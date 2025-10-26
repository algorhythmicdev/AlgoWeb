// Single source of truth for real images that already exist in /static/images
// Agent: update these lists ONLY with files that you have physically added.
// Verify with:  ls -la static/images/ideonautix  static/images/nodevoyage  static/images/partners

export type AssetEntry = {
  name?: string;
  base?: string | null;
  alt: string;
  w: number;
  h: number;
};

export const partners: AssetEntry[] = [
  { name: 'liaa', base: null, alt: 'LIAA partner logo', w: 320, h: 80 },
  { name: 'reclamefabriek', base: null, alt: 'Reclamefabriek partner logo', w: 320, h: 80 }
];

export const ideonautixPreviews: AssetEntry[] = [
  { name: 'preview-1', base: null, alt: 'Ideonautix preview 1', w: 1200, h: 750 },
  { name: 'preview-2', base: null, alt: 'Ideonautix preview 2', w: 1200, h: 750 }
];

export const nodevoyagePreviews: AssetEntry[] = [
  { name: 'preview-1', base: null, alt: 'NodeVoyage preview 1', w: 1200, h: 750 },
  { name: 'preview-2', base: null, alt: 'NodeVoyage preview 2', w: 1200, h: 750 }
];

export const assetCollections = {
  partners,
  ideonautixPreviews,
  nodevoyagePreviews
} as const;

export type AssetCollectionKey = keyof typeof assetCollections;

export function findAsset(kind: AssetCollectionKey, key?: string | number) {
  const list = assetCollections[kind];
  if (!list?.length) return undefined;
  if (typeof key === 'number') {
    return list[key];
  }
  if (typeof key === 'string') {
    const normalized = key.toLowerCase();
    return list.find((item) => {
      if (item.name && item.name.toLowerCase() === normalized) return true;
      const baseName = typeof item.base === 'string' ? item.base.split('/').pop()?.toLowerCase() : null;
      if (baseName && baseName === normalized) return true;
      return item.alt.toLowerCase() === normalized;
    });
  }
  return list[0];
}
