/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml from CMS content
 */

import { fetchCollection } from '$lib/utils/api';

const SITE_URL = 'https://algorhythmics.dev'; // Update with actual domain

/**
 * Generate sitemap XML
 * @type {import('./$types').RequestHandler}
 */
export async function GET() {
  try {
    // Fetch all published content
    const [posts, modules, platforms] = await Promise.all([
      fetchCollection('posts', {
        filters: { '[status][$eq]': 'published' },
        fields: ['slug', 'updatedAt'],
        pageSize: 100
      }).catch(() => ({ data: [] })),
      fetchCollection('educational-modules', {
        filters: { '[status][$eq]': 'published' },
        fields: ['slug', 'updatedAt'],
        pageSize: 100
      }).catch(() => ({ data: [] })),
      fetchCollection('platform-articles', {
        filters: { '[status][$eq]': 'published' },
        fields: ['slug', 'updatedAt'],
        pageSize: 100
      }).catch(() => ({ data: [] }))
    ]);

    // Static pages
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/services', changefreq: 'monthly', priority: '0.8' },
      { url: '/solutions', changefreq: 'monthly', priority: '0.8' },
      { url: '/consulting', changefreq: 'monthly', priority: '0.8' },
      { url: '/education-hub', changefreq: 'weekly', priority: '0.9' },
      { url: '/blog', changefreq: 'daily', priority: '0.9' },
      { url: '/platform', changefreq: 'weekly', priority: '0.9' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/help-center', changefreq: 'weekly', priority: '0.7' },
      { url: '/nodevoyage', changefreq: 'monthly', priority: '0.8' },
      { url: '/ideonautix', changefreq: 'monthly', priority: '0.8' }
    ];

    // Build sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${(posts.data || [])
  .map(
    (post) => `  <url>
    <loc>${SITE_URL}/blog/${post.attributes?.slug}</loc>
    <lastmod>${post.attributes?.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
${(modules.data || [])
  .map(
    (module) => `  <url>
    <loc>${SITE_URL}/education-hub/${module.attributes?.slug}</loc>
    <lastmod>${module.attributes?.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
${(platforms.data || [])
  .map(
    (article) => `  <url>
    <loc>${SITE_URL}/platform/${article.attributes?.slug}</loc>
    <lastmod>${article.attributes?.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }
}
