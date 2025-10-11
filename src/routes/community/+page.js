import en from '$lib/i18n/en.json';

export const load = () => {
  const fallbackUrl = en.seo?.default_url ?? 'https://algorhythmics.com';
  const baseMeta = en.community ?? {};

  return {
    meta: {
      title: baseMeta.meta_title ?? 'AlgoRhythmics community',
      description:
        baseMeta.meta_description ??
        'Co-create every release with feature votes, roadmap updates, and open feedback loops.',
      ogTitle: baseMeta.meta_title ?? 'AlgoRhythmics community',
      ogDescription:
        baseMeta.meta_description ??
        'Co-create every release with feature votes, roadmap updates, and open feedback loops.',
      url: `${fallbackUrl.replace(/\/$/, '')}/community`,
      keywords: ['Algorhythmics community', 'feature voting', 'product roadmap', 'user ideas']
    }
  };
};
