import en from '$lib/i18n/en.json';

export const load = () => {
  const fallbackUrl = en.seo?.default_url ?? 'https://algorhythmics.com';
  const baseMeta = en.consulting ?? {};

  return {
    meta: {
      title: baseMeta.meta_title ?? 'AlgoRhythmics consulting',
      description:
        baseMeta.meta_description ??
        'Join the calm AI consulting pilot for workshops, implementation support, and ongoing advisory care.',
      ogTitle: baseMeta.meta_title ?? 'AlgoRhythmics consulting',
      ogDescription:
        baseMeta.meta_description ??
        'Join the calm AI consulting pilot for workshops, implementation support, and ongoing advisory care.',
      url: `${fallbackUrl.replace(/\/$/, '')}/consulting`,
      keywords: ['AI consulting pilot', 'Algorhythmics services', 'accessible automation']
    }
  };
};
