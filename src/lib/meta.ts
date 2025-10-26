import type { MetaInput } from '$lib/seo';

export type MetaFallback = Pick<MetaInput, 'title' | 'description'>;

type Translator = ((key: string, options?: Record<string, unknown>) => string) | undefined;

type MetaKey =
  | 'home'
  | 'team'
  | 'ideonautix'
  | 'nodevoyage'
  | 'consulting'
  | 'education'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies';

export function buildMeta(
  translate: Translator,
  key: MetaKey,
  fallback: MetaFallback,
  locale: string
): MetaInput {
  const title = translateKey(translate, `meta.${key}.title`, fallback.title);
  const description = fallback.description
    ? translateKey(translate, `meta.${key}.description`, fallback.description)
    : undefined;

  return {
    title,
    description,
    lang: locale
  };
}

function translateKey(
  translate: Translator,
  key: string,
  fallback: string
): string {
  if (translate) {
    try {
      const value = translate(key);
      if (value && value !== key) {
        return value;
      }
    } catch {
      // fall through to fallback when translation is not ready
    }
  }

  return fallback;
}
