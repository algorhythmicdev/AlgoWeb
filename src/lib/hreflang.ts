import { PUBLIC_SITE_URL } from '$env/static/public';
import { ensureLeadingSlash, stripTrailingSlash } from './url';

const LOCALES = ['en', 'lv', 'ru'] as const;
type Locale = (typeof LOCALES)[number];

export function hreflangLinks(pathname: string, current: Locale = 'en'): string {
  void current;
  const base = stripTrailingSlash(PUBLIC_SITE_URL || '');
  const path = ensureLeadingSlash(pathname);

  return (
    LOCALES.map((locale) => `<link rel="alternate" hreflang="${locale}" href="${base}${path}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${base}${path}">`
  );
}

export { LOCALES };
export type { Locale };
