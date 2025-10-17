/**
 * Platform Article Detail Page Server
 * Fetches a single platform article by slug from Strapi
 */

import { fetchBySlug } from '$lib/utils/api';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const article = await fetchBySlug('platform-articles', params.slug, {
      populate: ['author', 'tags', 'categories', 'featuredImage']
    });

    if (!article) {
      throw error(404, 'Platform article not found');
    }

    return {
      article
    };
  } catch (err) {
    console.error('Error fetching platform article:', err);
    if (err.status === 404) {
      throw err;
    }
    throw error(500, 'Unable to load platform article. CMS may not be configured.');
  }
}
