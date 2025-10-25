import { base } from '$app/paths';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async ({ url }) => {
  const derivedOrigin = url.origin && url.origin !== 'null' ? url.origin : '';
  const origin = derivedOrigin.replace(/\/$/, '');
  const basePath = base === '/' ? '' : base ?? '';
  const noindex = false;

  const lines = [
    'User-agent: *',
    noindex ? 'Disallow: /' : 'Allow: /',
    `Sitemap: ${origin}${basePath}/sitemap.xml`
  ].join('\n');

  return new Response(lines, { headers: { 'Content-Type': 'text/plain' } });
};
