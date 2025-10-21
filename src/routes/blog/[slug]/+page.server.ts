/**
 * Blog Detail Page Server (Phase 4 - Frontend Integration)
 * Fetches individual blog post by slug
 */

import { error } from '@sveltejs/kit';
import { get } from '$lib/api/strapi';
import { normalisePost } from '$lib/utils/strapi';
import type { PageServerLoad } from './$types';
import type { HttpError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
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

    const rawPost = response.data?.[0];

    if (!rawPost || rawPost?.attributes?.status !== 'published') {
      throw error(404, 'Blog post not found');
    }

    const post = normalisePost(rawPost);

    if (!post) {
      throw error(404, 'Blog post not found');
    }

    return {
      post
    };
  } catch (err) {
    if ((err as HttpError)?.status === 404) {
      throw err;
    }
    console.error('Error fetching post:', err);
    throw error(500, 'Unable to load blog post. CMS may not be configured.');
  }
};
