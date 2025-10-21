/**
 * SvelteKit Server Hooks (Phase 7 - Security)
 * Implements Content Security Policy and other security headers
 */

import { env } from '$env/dynamic/public';
import type { Handle } from '@sveltejs/kit';

const FALLBACK_STRAPI_URL = 'http://localhost:1337';

function toOrigin(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch (error) {
    console.warn('Unable to derive origin from Strapi URL, falling back to localhost.', error);
    return FALLBACK_STRAPI_URL;
  }
}

function buildDirective(name: string, sources: string[]): string {
  const uniqueSources = Array.from(new Set(sources));
  return `${name} ${uniqueSources.join(' ')}`;
}

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  const strapiBase = env.PUBLIC_STRAPI_URL || FALLBACK_STRAPI_URL;
  const strapiOrigin = toOrigin(strapiBase);

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
    buildDirective('img-src', ["'self'", 'data:', 'https:', strapiOrigin]),
    buildDirective('font-src', ["'self'", 'data:', 'https://fonts.gstatic.com']),
    buildDirective('connect-src', ["'self'", strapiOrigin]),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];

  response.headers.set('Content-Security-Policy', directives.join('; '));

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
};
