﻿import { redirect } from '@sveltejs/kit';

export const prerender = true;

export const load = () => {
  throw redirect(301, '/services#platforms');
};
