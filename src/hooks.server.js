/**
 * SvelteKit Server Hooks (Phase 7 - Security)
 * Implements Content Security Policy and other security headers
 */

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event);

  // Content Security Policy (Phase 7)
  // Adjust these directives based on your needs
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for Svelte
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' " + (process.env.PUBLIC_STRAPI_URL || 'http://localhost:1337'),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspDirectives);

  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  return response;
}
