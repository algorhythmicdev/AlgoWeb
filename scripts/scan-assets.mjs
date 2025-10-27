import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'static', 'images');
const OUT = path.join(ROOT, 'src', 'lib', 'assets.generated.json');

function walk(dir, acc = []) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(png|webp|svg)$/i.test(e.name)) {
      acc.push(p.replace(ROOT, '').replace(/\\/g, '/'));
    }
  }
  return acc;
}

const files = walk(IMG_DIR);
const bases = new Map();
// collapse .webp + .png into one base record
for (const f of files) {
  const noext = f.replace(/\.(png|webp|svg)$/i, '');
  if (!bases.has(noext)) bases.set(noext, { base: noext, files: [] });
  bases.get(noext).files.push(f);
}
const manifest = Array.from(bases.values());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${OUT} with ${manifest.length} entries`);
