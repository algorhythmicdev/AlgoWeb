/**
 * API Utilities for Strapi Integration (Phase 4 & 5)
 * Helper functions for making authenticated requests to Strapi CMS
 */

import { getApiUrl } from '$lib/config/cms';

/**
 * @typedef {import('$lib/types/cms').StrapiResponse<unknown>} StrapiResponse
 * @typedef {import('$lib/types/cms').APIError} APIError
 */

/**
 * Make an authenticated API request to Strapi
 * @param {string} endpoint - API endpoint
 * @param {RequestInit & { jwt?: string }} options - Fetch options with optional JWT
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, options = {}) {
  const { jwt, ...fetchOptions } = options;
  const url = getApiUrl(endpoint);

  const headers = new Headers(fetchOptions.headers ?? {});
  headers.set('Content-Type', 'application/json');

  if (jwt) {
    headers.set('Authorization', `Bearer ${jwt}`);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error?.message || 'API request failed',
        details: data.error
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Fetch all items from a collection with optional filters
 * @param {string} collection - Collection name (e.g., 'posts', 'modules')
 * @param {Object} options
 * @param {string[]} [options.populate] - Relations to populate
 * @param {Object} [options.filters] - Strapi filters
 * @param {string} [options.sort] - Sort parameter
 * @param {number} [options.page] - Page number
 * @param {number} [options.pageSize] - Page size
 * @param {string} [options.jwt] - Authentication token
 * @returns {Promise<StrapiResponse>}
 */
export async function fetchCollection(collection, options = {}) {
  const { populate, filters, sort, page, pageSize, jwt } = options;

  const params = new URLSearchParams();

  if (populate) {
    populate.forEach((field) => {
      params.append('populate', field);
    });
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.append(`filters${key}`, String(value));
    });
  }

  if (sort) {
    params.append('sort', sort);
  }

  if (page) {
    params.append('pagination[page]', String(page));
  }

  if (pageSize) {
    params.append('pagination[pageSize]', String(pageSize));
  }

  const queryString = params.toString();
  const endpoint = `/${collection}${queryString ? `?${queryString}` : ''}`;

  return /** @type {Promise<StrapiResponse>} */ (apiRequest(endpoint, { jwt }));
}

/**
 * Fetch a single item by slug
 * @param {string} collection - Collection name
 * @param {string} slug - Item slug
 * @param {Object} options
 * @param {string[]} [options.populate] - Relations to populate
 * @param {string} [options.jwt] - Authentication token
 * @returns {Promise<any>}
 */
export async function fetchBySlug(collection, slug, options = {}) {
  const { populate, jwt } = options;

  const params = new URLSearchParams();
  params.append('filters[slug][$eq]', slug);

  if (populate) {
    populate.forEach((field) => {
      params.append('populate', field);
    });
  }

  const endpoint = `/${collection}?${params.toString()}`;
  const response = await apiRequest(endpoint, { jwt });

  return response.data?.[0] || null;
}

/**
 * Create a new item in a collection
 * @param {string} collection - Collection name
 * @param {Object} data - Item data
 * @param {string} jwt - Authentication token
 * @returns {Promise<any>}
 */
export async function createItem(collection, data, jwt) {
  return apiRequest(`/${collection}`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    jwt
  });
}

/**
 * Update an existing item
 * @param {string} collection - Collection name
 * @param {number} id - Item ID
 * @param {Object} data - Updated data
 * @param {string} jwt - Authentication token
 * @returns {Promise<any>}
 */
export async function updateItem(collection, id, data, jwt) {
  return apiRequest(`/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
    jwt
  });
}

/**
 * Delete an item
 * @param {string} collection - Collection name
 * @param {number} id - Item ID
 * @param {string} jwt - Authentication token
 * @returns {Promise<any>}
 */
export async function deleteItem(collection, id, jwt) {
  return apiRequest(`/${collection}/${id}`, {
    method: 'DELETE',
    jwt
  });
}

/**
 * Login to Strapi (Phase 3)
 * @param {string} identifier - Email or username
 * @param {string} password - Password
 * @returns {Promise<import('$lib/types/cms').AuthResponse>}
 */
export async function login(identifier, password) {
  return apiRequest('/auth/local', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
}

/**
 * Get current user info
 * @param {string} jwt - Authentication token
 * @returns {Promise<import('$lib/types/cms').User>}
 */
export async function getCurrentUser(jwt) {
  return apiRequest('/users/me', { jwt });
}
