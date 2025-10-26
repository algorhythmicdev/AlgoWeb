import type { RequestHandler } from '@sveltejs/kit';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { stripTrailingSlash } from '$lib/url';

export const prerender = true;

const routes = ['/', '/team', '/ideonautix', '/nodevoyage', '/consulting', '/education', '/contact'];
const LOCALES = ['en', 'lv', 'ru'];

export const GET: RequestHandler = async () => {
  const baseUrl = stripTrailingSlash(PUBLIC_SITE_URL || '');

  const urls = routes
    .map((path) => {
      const alternates = LOCALES.map(
        (locale) => `<xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}${path}" />`
      ).join('');

      return `
    <url>
      <loc>${baseUrl}${path}</loc>
      ${alternates}
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
