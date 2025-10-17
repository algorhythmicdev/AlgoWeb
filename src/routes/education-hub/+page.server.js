/**
 * Education Hub Page Server (Phase 5 - Educational Hub Integration)
 * Fetches and displays all educational modules from Strapi
 */

import { fetchCollection } from '$lib/utils/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // Fetch published educational modules from Strapi
    const response = await fetchCollection('educational-modules', {
      populate: ['category', 'tags', 'mediaAttachments'],
      filters: {
        '[status][$eq]': 'published'
      },
      sort: 'publishDate:desc',
      pageSize: 50
    });

    return {
      modules: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error('Error fetching educational modules:', error);
    // Return empty state if CMS is not available
    return {
      modules: [],
      meta: {},
      error: 'Unable to load educational modules. CMS may not be configured.'
    };
  }
}
