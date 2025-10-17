/**
 * Admin Layout Server (Phase 3 - Authentication Guard)
 * Protects all admin routes with authentication check
 */

import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  const jwt = cookies.get('jwt');

  if (!jwt) {
    // No JWT token, redirect to login
    throw redirect(302, '/login');
  }

  // In production, verify JWT with Strapi here
  // For now, just check if it exists
  // try {
  //   const user = await getCurrentUser(jwt);
  //   return { user };
  // } catch (error) {
  //   cookies.delete('jwt', { path: '/' });
  //   throw redirect(302, '/login');
  // }

  return {
    authenticated: true
  };
}
