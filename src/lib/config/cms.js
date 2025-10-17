/**
 * CMS Configuration (Phase 1)
 * Central configuration for Strapi CMS integration
 */

import { env } from '$env/dynamic/public';

/**
 * @typedef {Object} CMSConfig
 * @property {string} apiUrl - Base URL for Strapi API
 * @property {string} apiVersion - API version path
 * @property {number} defaultPageSize - Default pagination size
 * @property {number} requestTimeout - Request timeout in milliseconds
 */

/** @type {CMSConfig} */
export const cmsConfig = {
  apiUrl: env.PUBLIC_STRAPI_URL || 'http://localhost:1337',
  apiVersion: '/api',
  defaultPageSize: 10,
  requestTimeout: 10000
};

/**
 * Get full API endpoint URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
  const baseUrl = cmsConfig.apiUrl;
  const version = cmsConfig.apiVersion;
  return `${baseUrl}${version}${endpoint}`;
}

/**
 * Content type endpoints (Phase 2)
 */
export const endpoints = {
  auth: {
    login: '/auth/local',
    register: '/auth/local/register',
    me: '/users/me'
  },
  posts: '/posts',
  modules: '/educational-modules',
  platforms: '/platform-articles',
  categories: '/categories',
  tags: '/tags',
  authors: '/authors',
  upload: '/upload'
};
