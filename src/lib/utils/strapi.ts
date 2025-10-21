import { resolveMediaUrl, normaliseRelation } from './media.js';

type Nullable<T> = T | null | undefined;

type StrapiMediaAttributes = {
  url?: string | null;
  alternativeText?: string | null;
  name?: string | null;
};

type StrapiMedia = {
  data?: Nullable<{
    attributes?: Nullable<StrapiMediaAttributes>;
  }>;
} | Nullable<StrapiMediaAttributes>;

type StrapiRelation<T> = {
  data?: Array<Nullable<{
    id?: string | number | null;
    attributes?: Nullable<T>;
  }>>;
} | Nullable<Array<Nullable<{ id?: string | number | null; attributes?: Nullable<T> }>>>;

type StrapiAuthorAttributes = {
  name?: string | null;
  bio?: string | null;
  avatar?: StrapiMedia;
};

type StrapiPostAttributes = {
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  publishDate?: string | null;
  featuredImage?: StrapiMedia;
  categories?: StrapiRelation<{ name?: string | null }>;
  tags?: StrapiRelation<{ name?: string | null }>;
  author?: Nullable<{ data?: Nullable<{ attributes?: Nullable<StrapiAuthorAttributes> }> }>;
  status?: string | null;
};

type StrapiPostEntry = {
  id?: string | number | null;
  attributes?: Nullable<StrapiPostAttributes>;
};

export type NormalisedMedia = {
  url: string;
  alt: string;
};

export type NormalisedAuthor = {
  name: string;
  bio?: string;
  avatar?: NormalisedMedia;
};

export type NormalisedPost = {
  id: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  publishDate?: string;
  featuredImage?: NormalisedMedia;
  author?: NormalisedAuthor;
  categories: string[];
  tags: string[];
};

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const normaliseMedia = (media: StrapiMedia): NormalisedMedia | undefined => {
  if (!media) return undefined;

  if (typeof media === 'object' && 'data' in media) {
    const nested = media?.data?.attributes ?? null;
    if (nested) {
      return normaliseMedia(nested);
    }
    return undefined;
  }

  if (typeof media !== 'object' || media === null) return undefined;

  const candidate = media as StrapiMediaAttributes;
  const resolvedUrl = resolveMediaUrl(candidate.url ?? undefined);
  if (!resolvedUrl) return undefined;

  const alt = candidate.alternativeText || candidate.name || '';
  return {
    url: resolvedUrl,
    alt
  };
};

const normaliseNameCollection = (relation: StrapiRelation<{ name?: string | null }>): string[] => {
  const entries = Array.isArray(relation)
    ? relation
    : normaliseRelation<{ name?: string | null }>(relation as { data?: Array<{ id?: string | number; attributes?: { name?: string | null } | null } | null> });

  const normalised: string[] = [];
  for (const entry of entries ?? []) {
    if (!entry) continue;
    const name = (entry.attributes as { name?: string | null } | undefined)?.name;
    if (!isNonEmptyString(name)) continue;
    normalised.push(name.trim());
  }
  return normalised;
};

const normaliseAuthor = (attributes: Nullable<StrapiAuthorAttributes>): NormalisedAuthor | undefined => {
  if (!attributes) return undefined;
  if (!isNonEmptyString(attributes.name)) return undefined;

  return {
    name: attributes.name,
    bio: attributes.bio ?? undefined,
    avatar: normaliseMedia(attributes.avatar ?? null)
  };
};

export const normalisePost = (entry: unknown): NormalisedPost | null => {
  if (!entry || typeof entry !== 'object') return null;
  const record = entry as StrapiPostEntry;
  const attributes = record.attributes ?? null;
  if (!attributes || typeof attributes !== 'object') return null;

  const slug = attributes.slug;
  const title = attributes.title;
  if (!isNonEmptyString(slug) || !isNonEmptyString(title)) return null;

  const excerpt = isNonEmptyString(attributes.excerpt) ? attributes.excerpt : undefined;
  const content = isNonEmptyString(attributes.content) ? attributes.content : undefined;
  const publishDate = isNonEmptyString(attributes.publishDate) ? attributes.publishDate : undefined;

  const categories = normaliseNameCollection(attributes.categories ?? null);
  const tags = normaliseNameCollection(attributes.tags ?? null);

  const authorAttributes = attributes.author?.data?.attributes ?? null;

  return {
    id: record.id ?? slug,
    slug,
    title,
    excerpt,
    content,
    publishDate,
    featuredImage: normaliseMedia(attributes.featuredImage ?? null),
    author: normaliseAuthor(authorAttributes),
    categories,
    tags
  };
};

export type { StrapiPostEntry };
