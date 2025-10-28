import {
  ideonautixPreviews as fetchIdeonautix,
  nodevoyagePreviews as fetchNodeVoyage,
  promoAlgorhythmics,
  promoIdeonautix,
  promoNodeVoyage
} from '$lib/assets';

type AssetItem = { base: string };

const toBases = (items: AssetItem[]) => items.map((item) => item.base);

export const ideonautixPreviews = toBases(fetchIdeonautix());
export const nodevoyagePreviews = toBases(fetchNodeVoyage());

export const videoAlgorhythmics = promoAlgorhythmics();
export const videoIdeonautix = promoIdeonautix();
export const videoNodeVoyage = promoNodeVoyage();
