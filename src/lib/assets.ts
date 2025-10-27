import generated from './assets.generated.json';

type Item = { base: string; files: string[] };

function findPrefix(prefix: string): Item[] {
  return (generated as Item[]).filter((i) => i.base.startsWith(prefix));
}

export const partners = () => findPrefix('/static/images/partners/');
export const ideonautixPreviews = () => findPrefix('/static/images/ideonautix/');
export const nodevoyagePreviews = () => findPrefix('/static/images/nodevoyage/');
