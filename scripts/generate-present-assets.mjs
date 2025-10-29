import { readdir, writeFile, stat } from 'node:fs/promises';
import { join, posix, parse } from 'node:path';

const IMG_EXTS = ['.png', '.PNG', '.webp', '.WEBP', '.jpg', '.JPG', '.jpeg', '.JPEG'];
const VID_EXTS = ['.webm', '.WEBM'];

const roots = {
  partners:     'static/images/partners',
  ideonautix:   'static/images/ideonautix',
  nodevoyage:   'static/images/nodevoyage',
  videos:       'static/videos'
};

async function exists(p) { try { await stat(p); return true; } catch { return false; } }
async function walk(dir, filterExts) {
  const out = [];
  async function rec(p, rel = '') {
    let items;
    try { items = await readdir(p, { withFileTypes: true }); } catch { return; }
    for (const d of items) {
      const full = join(p, d.name);
      const nextRel = rel ? posix.join(rel, d.name) : d.name;
      if (d.isDirectory()) await rec(full, nextRel);
      else {
        const ext = parse(d.name).ext;
        if (filterExts.includes(ext)) {
          const base = parse(d.name).name;
          // produce extensionless base prefixed with /images/... or /videos/...
          const dirPart = p.split('static/')[1] || '';
          const extless = posix.join('/', dirPart, base);
          out.push(extless);
        }
      }
    }
  }
  await rec(dir);
  // de-dup by base name (ignore extension variants)
  const uniq = Array.from(new Set(out)).sort();
  return uniq;
}

const partners   = (await exists(roots.partners))   ? await walk(roots.partners, IMG_EXTS) : [];
const ideonautix = (await exists(roots.ideonautix)) ? await walk(roots.ideonautix, IMG_EXTS) : [];
const nodevoyage = (await exists(roots.nodevoyage)) ? await walk(roots.nodevoyage, IMG_EXTS) : [];
const videos     = (await exists(roots.videos))     ? await walk(roots.videos, VID_EXTS) : [];

const findLike = (arr, ...needles) => {
  const n = needles.map(s => s.toLowerCase());
  return arr.find(b => n.some(k => b.toLowerCase().includes(k))) || null;
};

const videoAlgorhythmics = findLike(videos, 'algo', 'algorhythmics');
const videoIdeonautix   = findLike(videos, 'ideonautix', 'ix');
const videoNodeVoyage   = findLike(videos, 'nodevoyage', 'nodi', 'nv');

const file = `// AUTO-GENERATED (do not edit by hand)
export const partners = ${JSON.stringify(partners, null, 2)};
export const ideonautixPreviews = ${JSON.stringify(ideonautix, null, 2)};
export const nodevoyagePreviews = ${JSON.stringify(nodevoyage, null, 2)};
export const videoAlgorhythmics = ${JSON.stringify(videoAlgorhythmics)};
export const videoIdeonautix   = ${JSON.stringify(videoIdeonautix)};
export const videoNodeVoyage   = ${JSON.stringify(videoNodeVoyage)};
`;
await writeFile('src/lib/presentAssets.ts', file, 'utf8');
console.log('Wrote src/lib/presentAssets.ts');
