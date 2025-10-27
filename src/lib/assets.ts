import gen from './assets.generated.json';

type Item = { base: string; files: string[] };
type Manifest = { images: Item[]; videos: Item[] };
const m = gen as Manifest;

const byPrefix = (arr: Item[], prefix: string) => arr.filter(i => i.base.startsWith(prefix));

export const partners = () => byPrefix(m.images, '/static/images/partners/');
export const ideonautixPreviews = () => byPrefix(m.images, '/static/images/ideonautix/');
export const nodevoyagePreviews = () => byPrefix(m.images, '/static/images/nodevoyage/');

function has(substr: string) {
  const s = substr.toLowerCase();
  return m.videos.find(v => v.base.toLowerCase().includes(s)) ?? null;
}

// Promo videos by fuzzy name match
export const promoAlgorhythmics = () => has('algor');     // algorhythmics / algorithmics
export const promoIdeonautix   = () => has('ideonaut');
export const promoNodeVoyage   = () => has('nodevoy');
