/**
 * Blog Index Page Server (Phase 4 - Frontend Integration)
 * Fetches and displays all blog posts from Strapi
 */

import { get } from '$lib/api/strapi';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const response = await get(
      'posts',
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
      posts: response.data || [],
      meta: response.meta || {}
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty state if CMS is not available
    return {
      posts: [],
      meta: {},
      error: 'Unable to load blog posts. CMS may not be configured.'
    };
  }
}
