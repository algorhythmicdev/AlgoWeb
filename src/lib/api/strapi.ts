import { env } from '$env/dynamic/private';

const base = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

type QueryValue = string | number | boolean | null | undefined | QueryValue[] | QueryRecord;
interface QueryRecord {
  [key: string]: QueryValue;
}

const qs = (query?: QueryRecord) => {
  if (!query) return '';
  const flattened = flatten(query);
  const params = new URLSearchParams(flattened);
  const search = params.toString();
  return search ? `?${search}` : '';
};

function flatten(obj: QueryRecord, prefix = ''): Record<string, string> {
  return Object.entries(obj).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === null || value === undefined) return acc;

    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item === null || item === undefined) {
          return;
        }

        const arrayKey = `${fullKey}[${index}]`;

        if (typeof item === 'object' && !Array.isArray(item)) {
          Object.assign(acc, flatten(item as QueryRecord, arrayKey));
        } else {
          acc[arrayKey] = String(item);
        }
      });
      return acc;
    }

    if (typeof value === 'object') {
      Object.assign(acc, flatten(value as QueryRecord, fullKey));
      return acc;
    }

    acc[fullKey] = String(value);
    return acc;
  }, {});
}

/**
 * Perform a Strapi GET request.
 * The read-only API token is attached server-side only when `withAuth` is true.
 */
export async function get(
  path: string,
  query?: QueryRecord,
  fetcher: typeof fetch = fetch,
  withAuth = false
) {
  const headers: Record<string, string> = {};

  if (withAuth && typeof window === 'undefined' && env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${env.STRAPI_API_TOKEN}`;
  }

  const response = await fetcher(`${base}/api/${path}${qs(query)}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Strapi ${path} ${response.status}`);
  }

  return response.json();
}
