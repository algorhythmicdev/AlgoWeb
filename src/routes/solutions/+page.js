import { load as loadServices } from '../services/+page.js';

export const load = async (event) => {
  const result = await loadServices(event);
  if (result && result.meta) {
    result.meta = {
      ...result.meta,
      title: 'Solutions | AlgoRhythmics',
      ogTitle: 'Solutions | AlgoRhythmics',
      url: 'https://algorhythmics.com/solutions'
    };
  }
  return result;
};
