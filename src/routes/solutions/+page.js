import { load as loadServices } from '../services/+page.js';

export const load = () => {
  const result = loadServices();

  if (result?.meta) {
    return {
      ...result,
      meta: {
        ...result.meta,
        title: 'Solutions | AlgoRhythmics',
        ogTitle: 'Solutions | AlgoRhythmics',
        url: 'https://algorhythmics.com/solutions'
      }
    };
  }

  return result;
};
