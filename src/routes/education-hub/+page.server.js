/**
 * Education Hub Page Server (Phase 5 - Educational Hub Integration)
 * Fetches and displays all educational modules from Strapi
 */

import { get } from '$lib/api/strapi';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await get(
      'educational-modules',
      {
        populate: {
          category: true,
          tags: true,
          mediaAttachments: true
        },
        filters: {
          status: { $eq: 'published' }
        },
        sort: { publishDate: 'desc' },
        pagination: { pageSize: 50 }
      },
      fetch,
      true
    );

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
