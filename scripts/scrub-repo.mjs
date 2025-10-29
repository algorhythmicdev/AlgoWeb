import { rm, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const maybeDel = async (p) => {
  try { await stat(p); await rm(p, { recursive: true, force: true }); console.log('Removed', p); }
  catch { /* ignore */ }
};

const dirs = [
  // CMS/old content
  'cms', 'content', 'admin', 'static/admin', 'static/cms', 'src/lib/cms',
  // legacy routes/APIs (not allowed on static)
  'src/routes/api', 'src/routes/blog', 'src/routes/posts', 'src/routes/article', 'src/routes/cms', 'src/routes/legacy', 'src/routes/old',
  // old hosting/config
  '.vercel', '.netlify', 'netlify.toml', '.slicemachine'
];

// also nuke empty top-level dirs that only contain .md/.json cruft
async function sweepEmpty(root = 'src/routes') {
  try {
    const kids = await readdir(root, { withFileTypes: true });
    await Promise.all(kids.map(async (d) => {
      if (!d.isDirectory()) return;
      const p = join(root, d.name);
      try {
        const files = await readdir(p);
        if (files.length === 0) await maybeDel(p);
      } catch {}
    }));
  } catch {}
}

await Promise.all(dirs.map((d) => maybeDel(join(ROOT, d))));
await sweepEmpty();
console.log('Scrub complete');
