import type { RequestHandler } from '@sveltejs/kit';
import { stripTrailingSlash } from '$lib/url';

export const prerender = true;

const routes = ['/', '/team', '/ideonautix', '/nodevoyage', '/consulting', '/education', '/contact'];
export const GET: RequestHandler = async () => {
  const baseUrl = stripTrailingSlash(import.meta.env.PUBLIC_SITE_URL || '');

  const urls = routes
    .map((path) => {
      return `
    <url>
      <loc>${baseUrl}${path}</loc>
      <changefreq>weekly</changefreq>
      <priority>${path === '/' ? '1.0' : '0.7'}</priority>
    </url>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
  </urlset>`.trim();

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
