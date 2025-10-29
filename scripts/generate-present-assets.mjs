import { readdir, writeFile, stat } from 'node:fs/promises';
import { join, posix, parse } from 'node:path';

const IMG_EXTS = ['.png','.PNG','.webp','.WEBP','.jpg','.JPG','.jpeg','.JPEG'];
const VID_EXTS = ['.webm','.WEBM'];

const roots = {
  brand:      'static/images/brand',
  founders:   'static/images/founders',
  products:   'static/images/products',
  ideonautix: 'static/images/ideonautix',
  nodevoyage: 'static/images/nodevoyage',
  partners:   'static/images/partners',
  videos:     'static/videos'
};

async function exists(p){ try{ await stat(p); return true; }catch{ return false; } }

async function walk(dir, filterExts){
  const out = new Set();
  async function rec(abs, rel=''){
    let entries;
    try { entries = await readdir(abs, { withFileTypes:true }); } catch { return; }
    for (const d of entries) {
      const full = join(abs, d.name);
      const nextRel = rel ? posix.join(rel, d.name) : d.name;
      if (d.isDirectory()) await rec(full, nextRel);
      else {
        const ext = parse(d.name).ext;
        if (filterExts.includes(ext)) {
          const drel = abs.split('static/')[1] || '';
          const base = parse(d.name).name;
          out.add('/' + posix.join(drel, base));
        }
      }
    }
  }
  if (!(await exists(dir))) return [];
  await rec(dir);
  return Array.from(out).sort();
}

const brand       = await walk(roots.brand,      IMG_EXTS);
const founders    = await walk(roots.founders,   IMG_EXTS);
const products    = await walk(roots.products,   IMG_EXTS);
const ideonautix  = await walk(roots.ideonautix, IMG_EXTS);
const nodevoyage  = await walk(roots.nodevoyage, IMG_EXTS);
const partners    = await walk(roots.partners,   IMG_EXTS);
const videos      = await walk(roots.videos,     VID_EXTS);

function findLike(arr, ...needles) {
  const n = needles.map(s => s.toLowerCase());
  return arr.find(b => n.some(k => b.toLowerCase().includes(k))) || null;
}

const videoAlgorhythmics = findLike(videos, 'algo','algorhythmics');
const videoIdeonautix    = findLike(videos, 'ideonautix','ix');
const videoNodeVoyage    = findLike(videos, 'nodevoyage','nodi','nv');

const file = `// AUTO-GENERATED (do not edit by hand)
export const brand = ${JSON.stringify(brand, null, 2)};
export const founders = ${JSON.stringify(founders, null, 2)};
export const productIcons = ${JSON.stringify(products, null, 2)};

export const ideonautixPreviews = ${JSON.stringify(ideonautix, null, 2)};
export const nodevoyagePreviews = ${JSON.stringify(nodevoyage, null, 2)};
export const partners = ${JSON.stringify(partners, null, 2)};

export const videoAlgorhythmics = ${JSON.stringify(videoAlgorhythmics)};
export const videoIdeonautix    = ${JSON.stringify(videoIdeonautix)};
export const videoNodeVoyage    = ${JSON.stringify(videoNodeVoyage)};
`;
await writeFile('src/lib/presentAssets.ts', file, 'utf8');
console.log('Wrote src/lib/presentAssets.ts');
