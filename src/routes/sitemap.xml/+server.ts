import { base } from '$app/paths';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

const routes = [
  '/',
  '/team',
  '/ideonautix',
  '/nodevoyage',
  '/consulting',
  '/education',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies'
];

export const GET: RequestHandler = async ({ url }) => {
  const derivedOrigin = url.origin && url.origin !== 'null' ? url.origin : '';
  const origin = derivedOrigin.replace(/\/$/, '');
  const basePath = base === '/' ? '' : base ?? '';

  const resolvePath = (path: string) => {
    if (path === '/') {
      return `${basePath}/`;
    }
    return `${basePath}${path}`;
  };

  const urls = routes
    .map(
      (p) => `
    <url>
      <loc>${origin}${resolvePath(p)}</loc>
      <changefreq>weekly</changefreq>
      <priority>${p === '/' ? '1.0' : '0.7'}</priority>
    </url>`
    )
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
  </urlset>`.trim();

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
