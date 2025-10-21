import DOMPurify from 'isomorphic-dompurify';

/**
 * Content Sanitization Utilities (Phase 7 - Security)
 * Sanitizes HTML content from CMS to prevent XSS attacks
 */

const DEFAULT_CONFIG = {
  // Ensure links we render are always safe and open in new tabs when necessary
  ADD_ATTR: ['target', 'rel'],
  FORBID_ATTR: ['style'],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|ftp|mailto|tel|sms|callto|cid|data:image\/(?:png|gif|jpeg|webp);base64)[^"\s]*)$/i,
  USE_PROFILES: { html: true }
};

/**
 * Sanitize HTML content using DOMPurify.
 *
 * @param {string} html - Raw HTML content
 * @param {import('dompurify').Config} [config] - Optional DOMPurify configuration overrides
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html, config = {}) {
  if (!html) return '';

  return DOMPurify.sanitize(html, { ...DEFAULT_CONFIG, ...config });
}

/**
 * Sanitize plain text (escape HTML entities)
 * @param {string} text - Plain text
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  if (!text) return '';
  
  const map = /** @type {Record<string, string>} */ ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  });

  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}

/**
 * Strip all HTML tags from content
 * @param {string} html - HTML content
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export function truncate(text, length = 150, suffix = '...') {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
}
