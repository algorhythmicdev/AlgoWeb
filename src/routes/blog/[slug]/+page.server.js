/**
 * Blog Detail Page Server (Phase 4 - Frontend Integration)
 * Fetches individual blog post by slug
 */

import { error } from '@sveltejs/kit';
import { get } from '$lib/api/strapi';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
  try {
    const response = await get(
      'posts',
      {
        filters: {
          slug: { $eq: params.slug },
          status: { $eq: 'published' }
        },
        populate: {
          author: true,
          tags: true,
          categories: true,
          featuredImage: true
        }
      },
      fetch,
      true
    );

    const post = response.data?.[0];

    if (!post || post.attributes?.status !== 'published') {
      throw error(404, 'Blog post not found');
    }

    return {
      post
    };
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'status' in err &&
      /** @type {{ status?: number }} */ (err).status === 404
    ) {
      throw err;
    }
    console.error('Error fetching post:', err);
    throw error(500, 'Unable to load blog post. CMS may not be configured.');
  }
}
