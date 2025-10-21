/**
 * Blog Index Page Server (Phase 4 - Frontend Integration)
 * Fetches and displays all blog posts from Strapi
 */

import { get } from '$lib/api/strapi';
import { normalisePost, type NormalisedPost } from '$lib/utils/strapi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
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

    const rawPosts: unknown[] = Array.isArray(response.data) ? response.data : [];
    const posts = rawPosts
      .map((entry) => normalisePost(entry))
      .filter((post): post is NormalisedPost => post !== null);

    return {
      posts,
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
};
