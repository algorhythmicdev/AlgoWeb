/**
 * Platform Article Detail Page Server
 * Fetches a single platform article by slug from Strapi
 */

import { error } from '@sveltejs/kit';
import { get } from '$lib/api/strapi';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
  try {
    const response = await get(
      'platform-articles',
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

    const article = response.data?.[0];

    if (!article) {
      throw error(404, 'Platform article not found');
    }

    return {
      article
    };
  } catch (err) {
    console.error('Error fetching platform article:', err);
    if (err.status === 404) {
      throw err;
    }
    throw error(500, 'Unable to load platform article. CMS may not be configured.');
  }
}
