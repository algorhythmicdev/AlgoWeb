import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'static', 'images');
const VIDEO_DIR = path.join(ROOT, 'static', 'videos');
const OUT = path.join(ROOT, 'src', 'lib', 'assets.generated.json');

function walk(dir, acc = []) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(png|webp|svg|webm)$/i.test(e.name)) {
      acc.push(p.replace(ROOT, '').replace(/\\/g, '/'));
    }
  }
  return acc;
}

const files = [...walk(IMG_DIR), ...walk(VIDEO_DIR)].sort((a, b) => a.localeCompare(b));
const bases = new Map();
// collapse .webp + .png into one base record
for (const f of files) {
  const noext = f.replace(/\.(png|webp|svg|webm)$/i, '');
  if (!bases.has(noext)) bases.set(noext, { base: noext, files: [] });
  bases.get(noext).files.push(f);
}
const all = Array.from(bases.values())
  .map((entry) => ({ ...entry, files: entry.files.sort((a, b) => a.localeCompare(b)) }))
  .sort((a, b) => a.base.localeCompare(b.base));
const images = all.filter(i => i.files.some(f => /\.(png|webp|svg)$/i.test(f)));
const videos = all.filter(i => i.files.some(f => /\.webm$/i.test(f)));
const manifest = { images, videos };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${OUT} with ${images.length} image bases and ${videos.length} video bases`);
