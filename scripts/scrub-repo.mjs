import { rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const maybeDelete = async (p) => {
  try { await stat(p); await rm(p, { recursive: true, force: true }); console.log('Removed', p); }
  catch { /* ignore */ }
};

const toRemove = [
  // Legacy CMS / content
  'cms', 'content', 'admin', 'static/admin', 'static/cms',

  // Old routes we no longer serve
  'src/routes/blog', 'src/routes/posts', 'src/routes/article',
  'src/routes/old', 'src/routes/legacy', 'src/routes/cms',
  'src/routes/api',      // dynamic endpoints not allowed on static site
  'src/routes/sanity',   // any CMS previews
  'src/lib/cms',         // stale CMS helpers
  'static/_redirects',   // old Netlify redirects (GH Pages ignores; just remove)

  // Old CI / hosts
  'netlify.toml', '.vercel', '.netlify', '.slicemachine'
];

await Promise.all(toRemove.map((p) => maybeDelete(join(ROOT, p))));

console.log('Scrub complete.');
