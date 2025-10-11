import en from '$lib/i18n/en.json';

export const load = () => {
  const fallbackUrl = en.seo?.default_url ?? 'https://algorhythmics.com';
  const baseMeta = en.contact ?? {};

  return {
    meta: {
      title: baseMeta.meta_title ?? 'Contact AlgoRhythmics',
      description:
        baseMeta.meta_description ??
        'Reach the founders for pilots, partnerships, press, or community collaborations.',
      ogTitle: baseMeta.meta_title ?? 'Contact AlgoRhythmics',
      ogDescription:
        baseMeta.meta_description ??
        'Reach the founders for pilots, partnerships, press, or community collaborations.',
      url: `${fallbackUrl.replace(/\/$/, '')}/contact`,
      keywords: ['contact Algorhythmics', 'book a strategy call', 'AI studio partnerships']
    }
  };
};
