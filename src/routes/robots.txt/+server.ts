import type { RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SITE_URL, PUBLIC_NOINDEX } from '$env/static/public';

export const prerender = true;

export const GET: RequestHandler = async ({ url }) => {
  const envBase = (PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const derivedOrigin = url.origin && url.origin !== 'null' ? url.origin : '';
  const base = envBase || derivedOrigin;
  const noindex = (PUBLIC_NOINDEX || '').toLowerCase() === 'true';

  const lines = [
    'User-agent: *',
    noindex ? 'Disallow: /' : 'Allow: /',
    `Sitemap: ${base}/sitemap.xml`
  ].join('\n');

  return new Response(lines, { headers: { 'Content-Type': 'text/plain' } });
};
