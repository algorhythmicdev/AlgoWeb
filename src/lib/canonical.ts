import { PUBLIC_SITE_URL } from '$env/static/public';
import { ensureLeadingSlash, stripTrailingSlash } from './url';

export function canonicalFor(pathname: string): string {
  const base = stripTrailingSlash(PUBLIC_SITE_URL || '');
  const path = ensureLeadingSlash(pathname);
  return `${base}${path}`;
}
