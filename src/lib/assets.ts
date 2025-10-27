import gen from './assets.generated.json';

type Item = { base: string; files: string[] };
type Manifest = { images: Item[]; videos: Item[] };
const manifest = gen as Manifest;

const stripStatic = (path: string) => path.replace(/^\/static/, '');
const sanitizeItem = (item: Item): Item => ({
  base: stripStatic(item.base),
  files: item.files.map(stripStatic)
});

const images = manifest.images.map(sanitizeItem);
const videos = manifest.videos.map(sanitizeItem);

const byPrefix = (arr: Item[], prefix: string) => arr.filter(i => i.base.startsWith(prefix));

export const partners = () => byPrefix(images, '/images/partners/');
export const ideonautixPreviews = () => byPrefix(images, '/images/ideonautix/');
export const nodevoyagePreviews = () => byPrefix(images, '/images/nodevoyage/');

function videoBaseMatching(substr: string) {
  const s = substr.toLowerCase();
  return videos.find(v => v.base.toLowerCase().includes(s))?.base ?? null;
}

// Promo videos by fuzzy name match
export const promoAlgorhythmics = () => videoBaseMatching('algor');     // algorhythmics / algorithmics
export const promoIdeonautix   = () => videoBaseMatching('ideonaut');
export const promoNodeVoyage   = () => videoBaseMatching('nodevoy');
