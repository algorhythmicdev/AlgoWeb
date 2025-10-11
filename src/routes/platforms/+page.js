import en from '$lib/i18n/en.json';

export const load = () => {
  const fallbackUrl = en.seo?.default_url ?? 'https://algorhythmics.com';
  const baseMeta = en.products ?? {};

  return {
    meta: {
      title: baseMeta.meta_title ?? 'AlgoRhythmics platforms',
      description:
        baseMeta.meta_description ??
        'Discover NodeVoyage, the AI travel co-pilot, and Ideonautix, the calm workspace for founders.',
      ogTitle: baseMeta.meta_title ?? 'AlgoRhythmics platforms',
      ogDescription:
        baseMeta.meta_description ??
        'Discover NodeVoyage, the AI travel co-pilot, and Ideonautix, the calm workspace for founders.',
      url: `${fallbackUrl.replace(/\/$/, '')}/platforms`,
      keywords: ['AI platforms', 'NodeVoyage', 'Ideonautix', 'Algorhythmics products']
    }
  };
};
