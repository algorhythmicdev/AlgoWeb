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

type StrapiSingleRelation<T> =
  | {
      data?: Nullable<{
        attributes?: Nullable<T>;
      }>;
    }
  | Nullable<{
      attributes?: Nullable<T>;
    }>
  | Nullable<T>;

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

type StrapiModuleAttributes = {
  slug?: string | null;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  content?: string | null;
  publishDate?: string | null;
  status?: string | null;
  heroImage?: StrapiMedia;
  mediaAttachments?:
    | StrapiRelation<StrapiMediaAttributes>
    | Nullable<Array<Nullable<StrapiMediaAttributes>>>;
  category?: StrapiSingleRelation<{ name?: string | null }>;
  tags?: StrapiRelation<{ name?: string | null }>;
};

type StrapiModuleEntry = {
  id?: string | number | null;
  attributes?: Nullable<StrapiModuleAttributes>;
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

export type NormalisedModule = {
  id: string | number;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  content?: string;
  publishDate?: string;
  status?: 'draft' | 'published';
  heroImage?: NormalisedMedia;
  mediaAttachments: NormalisedMedia[];
  category?: string;
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

const normaliseStatus = (status: unknown): 'draft' | 'published' | undefined => {
  if (status === 'draft' || status === 'published') {
    return status;
  }
  return undefined;
};

const extractSingleRelationAttributes = <T>(relation: StrapiSingleRelation<T>): Nullable<T> => {
  if (!relation) return null;

  if (typeof relation !== 'object') {
    return relation as Nullable<T>;
  }

  if ('data' in relation) {
    const data = (relation as { data?: Nullable<{ attributes?: Nullable<T> }> }).data ?? null;
    return data?.attributes ?? null;
  }

  if ('attributes' in relation) {
    return (relation as { attributes?: Nullable<T> }).attributes ?? null;
  }

  return relation as Nullable<T>;
};

const collectRelationAttributes = <T>(
  relation: StrapiRelation<T> | Nullable<Array<Nullable<T>>>
): Array<Nullable<T>> => {
  if (Array.isArray(relation)) {
    return relation;
  }

  const entries = normaliseRelation<T>(
    relation as {
      data?: Array<{
        id?: string | number;
        attributes?: Nullable<T>;
      } | null>;
    }
  );

  return entries.map((entry) => entry.attributes ?? null);
};

const normaliseMediaCollection = (
  relation: StrapiRelation<StrapiMediaAttributes> | Nullable<Array<Nullable<StrapiMediaAttributes>>>
): NormalisedMedia[] => {
  const attributesList = collectRelationAttributes<StrapiMediaAttributes>(relation);
  const items: NormalisedMedia[] = [];

  for (const attributes of attributesList) {
    const media = normaliseMedia(attributes ?? null);
    if (media) {
      items.push(media);
    }
  }

  return items;
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

export const normaliseModule = (entry: unknown): NormalisedModule | null => {
  if (!entry || typeof entry !== 'object') return null;
  const record = entry as StrapiModuleEntry;
  const attributes = record.attributes ?? null;
  if (!attributes || typeof attributes !== 'object') return null;

  const slug = attributes.slug;
  const title = attributes.title;
  if (!isNonEmptyString(slug) || !isNonEmptyString(title)) return null;

  const summary = isNonEmptyString(attributes.summary) ? attributes.summary : undefined;
  const description = isNonEmptyString(attributes.description) ? attributes.description : undefined;
  const content = isNonEmptyString(attributes.content) ? attributes.content : undefined;
  const publishDate = isNonEmptyString(attributes.publishDate) ? attributes.publishDate : undefined;
  const status = normaliseStatus(attributes.status);

  const categoryAttributes = extractSingleRelationAttributes<{ name?: string | null }>(attributes.category ?? null);
  const category = isNonEmptyString(categoryAttributes?.name) ? categoryAttributes.name.trim() : undefined;

  return {
    id: record.id ?? slug,
    slug,
    title,
    summary,
    description,
    content,
    publishDate,
    status,
    heroImage: normaliseMedia(attributes.heroImage ?? null),
    mediaAttachments: normaliseMediaCollection(attributes.mediaAttachments ?? null),
    category,
    tags: normaliseNameCollection(attributes.tags ?? null)
  };
};

const mapCollection = <T>(collection: unknown, normaliser: (entry: unknown) => T | null): T[] => {
  const source = Array.isArray(collection)
    ? collection
    : typeof collection === 'object' && collection !== null && 'data' in (collection as Record<string, unknown>)
      ? ((collection as { data?: unknown[] }).data ?? [])
      : [];

  const items: T[] = [];
  for (const entry of source ?? []) {
    const normalised = normaliser(entry);
    if (normalised) {
      items.push(normalised);
    }
  }
  return items;
};

export const normalisePostCollection = (collection: unknown): NormalisedPost[] => mapCollection(collection, normalisePost);

export const normaliseModuleCollection = (collection: unknown): NormalisedModule[] => mapCollection(collection, normaliseModule);
