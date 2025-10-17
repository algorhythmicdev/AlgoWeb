/**
 * Educational Module Detail Page Server
 * Fetches a single educational module by slug from Strapi
 */

import { fetchBySlug } from '$lib/utils/api';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const module = await fetchBySlug('educational-modules', params.slug, {
      populate: ['category', 'tags', 'mediaAttachments', 'author']
    });

    if (!module) {
      throw error(404, 'Educational module not found');
    }

    return {
      module
    };
  } catch (err) {
    console.error('Error fetching educational module:', err);
    if (err.status === 404) {
      throw err;
    }
    throw error(500, 'Unable to load educational module. CMS may not be configured.');
  }
}
