/**
 * Platform Articles Page Server
 * Fetches and displays all platform articles from Strapi
 */

import { get } from '$lib/api/strapi';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await get(
      'platform-articles',
      {
        populate: {
          author: true,
          tags: true,
          categories: true,
          featuredImage: true
        },
        filters: {
          status: { $eq: 'published' }
        },
        sort: { publishDate: 'desc' },
        pagination: { pageSize: 20 }
      },
      fetch,
      true
    );

    return {
      articles: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error('Error fetching platform articles:', error);
    // Return empty state if CMS is not available
    return {
      articles: [],
      meta: {},
      error: 'Unable to load platform articles. CMS may not be configured.'
    };
  }
}
