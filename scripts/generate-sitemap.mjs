import { writeFile } from 'node:fs/promises';

const base = 'https://algorhythmicdev.github.io/AlgoWeb';

const routes = [
  '/', '/team', '/ideonautix', '/nodevoyage', '/consulting', '/contact', '/education',
  '/privacy', '/terms', '/cookies'
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(r => `  <url><loc>${base}${r === '/' ? '/' : r + '/'}</loc></url>`).join('\n') +
  `\n</urlset>\n`;

await writeFile('static/sitemap.xml', xml, 'utf8');
console.log('Sitemap updated:', routes.length, 'routes');
