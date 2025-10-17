/**
 * Platform Articles Page Server
 * Fetches and displays all platform articles from Strapi
 */

import { fetchCollection } from '$lib/utils/api';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // Fetch published platform articles from Strapi
    const response = await fetchCollection('platform-articles', {
      populate: ['author', 'tags', 'categories', 'featuredImage'],
      filters: {
        '[status][$eq]': 'published'
      },
      sort: 'publishDate:desc',
      pageSize: 20
    });

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
