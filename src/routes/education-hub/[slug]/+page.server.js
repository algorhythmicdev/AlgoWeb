/**
 * Educational Module Detail Page Server
 * Fetches a single educational module by slug from Strapi
 */

import { error } from '@sveltejs/kit';
import { get } from '$lib/api/strapi';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
  try {
    const response = await get(
      'educational-modules',
      {
        filters: {
          slug: { $eq: params.slug },
          status: { $eq: 'published' }
        },
        populate: {
          category: true,
          tags: true,
          mediaAttachments: true,
          author: true
        }
      },
      fetch,
      true
    );

    const module = response.data?.[0];

    if (!module) {
      throw error(404, 'Educational module not found');
    }

    return {
      module
    };
  } catch (err) {
    console.error('Error fetching educational module:', err);
    if (err.status === 404) {
      throw err;
    }
    throw error(500, 'Unable to load educational module. CMS may not be configured.');
  }
}
