/**
 * Blog Detail Page Server (Phase 4 - Frontend Integration)
 * Fetches individual blog post by slug
 */

import { error } from '@sveltejs/kit';
import { fetchBySlug } from '$lib/utils/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
  try {
    const post = await fetchBySlug('posts', params.slug, {
      populate: ['author', 'tags', 'categories', 'featuredImage']
    });

    if (!post) {
      throw error(404, 'Blog post not found');
    }

    // Only show published posts
    if (post.status !== 'published') {
      throw error(404, 'Blog post not found');
    }

    return {
      post
    };
  } catch (err) {
    if (err.status === 404) {
      throw err;
    }
    console.error('Error fetching post:', err);
    throw error(500, 'Unable to load blog post. CMS may not be configured.');
  }
}
