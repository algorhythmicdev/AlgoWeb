import type { PageServerLoad } from './$types';
import { base as appBase } from '$app/paths';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = () => {
  const target = appBase && appBase !== '/' ? `${appBase}/team` : '/team';
  throw redirect(308, target);
};
