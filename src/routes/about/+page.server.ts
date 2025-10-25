import type { PageServerLoad } from './$types';
import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = () => {
  const target = base && base !== '/' ? `${base}/team` : '/team';
  throw redirect(308, target);
};
