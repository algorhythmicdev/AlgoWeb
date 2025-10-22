/**
 * CMS media helpers
 * Resolve Strapi media URLs to absolute paths that work in the browser.
 */

const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

/**
 * @param {string | undefined} base
 */
function normalizeBase(base = '') {
  if (!base) return '';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

/**
 * @param {string | undefined} path
 */
function normalizePath(path = '') {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * @param {string | undefined} baseOverride
 */
function resolveBase(baseOverride) {
  if (baseOverride) return normalizeBase(baseOverride);
  // const configured = import.meta.env.PUBLIC_STRAPI_URL;
  // if (typeof configured === 'string' && configured.length > 0) {
  //   return normalizeBase(configured);
  // }
  return 'http://localhost:1337';
}

/**
 * Convert a media path returned by Strapi into an absolute URL.
 *
 * @param {string | null | undefined} url - The raw URL returned by Strapi.
 * @param {string} [baseUrl] - Optional base URL to use instead of PUBLIC_STRAPI_URL.
 * @returns {string | undefined} Resolved absolute URL, or undefined when no URL provided.
 */
export function resolveMediaUrl(url, baseUrl) {
  if (!url) return undefined;

  if (ABSOLUTE_URL_PATTERN.test(url)) {
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    return url;
  }

  const base = resolveBase(baseUrl);
  return `${base}${normalizePath(url)}`;
}

/**
 * Safely collect a list of tags or categories from Strapi relations.
 *
 * @template T
 * @param {{ data?: Array<{ id?: number | string; attributes?: T | null } | null> } | null | undefined} relation
 * @returns {Array<{ id: string | number; attributes: T }>} Normalised relation entries without nulls.
 */
export function normaliseRelation(relation) {
  const entries = relation?.data ?? [];
  /** @type {Array<{ id: string | number; attributes: T }>} */
  const normalised = [];

  for (const entry of entries) {
    if (!entry) continue;
    const id = entry.id;
    const attributes = entry.attributes;
    if (id == null || attributes == null) continue;
    normalised.push({ id, attributes });
  }

  return normalised;
}
