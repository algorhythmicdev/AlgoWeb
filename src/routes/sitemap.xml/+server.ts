import type { RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const prerender = true;

const routes = [
  '/',
  '/about',
  '/ideonautix',
  '/nodevoyage',
  '/consulting',
  '/education',
  '/contact'
];

export const GET: RequestHandler = async ({ url }) => {
  const envBase = (PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const derivedOrigin = url.origin && url.origin !== 'null' ? url.origin : '';
  const base = envBase || derivedOrigin;
  const urls = routes
    .map(
      (p) => `
    <url>
      <loc>${base}${p}</loc>
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
