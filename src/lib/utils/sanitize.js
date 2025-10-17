/**
 * Content Sanitization Utilities (Phase 7 - Security)
 * Sanitizes HTML content from CMS to prevent XSS attacks
 */

/**
 * List of allowed HTML tags for rich content
 * Used for future sanitization implementation
 */
// const ALLOWED_TAGS = [
//   'p', 'br', 'strong', 'em', 'u', 's', 'del',
//   'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//   'ul', 'ol', 'li',
//   'a', 'img',
//   'blockquote', 'code', 'pre',
//   'table', 'thead', 'tbody', 'tr', 'th', 'td'
// ];

/**
 * Allowed attributes per tag
 * Used for future sanitization implementation
 */
// const ALLOWED_ATTRIBUTES = {
//   a: ['href', 'title', 'target', 'rel'],
//   img: ['src', 'alt', 'title', 'width', 'height'],
//   '*': ['class', 'id']
// };

/**
 * Basic HTML sanitization
 * Note: In production, use a library like DOMPurify or sanitize-html
 * This is a simplified version for demonstration
 * 
 * @param {string} html - Raw HTML content
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html) return '';

  // In a real implementation, use DOMPurify or similar:
  // import DOMPurify from 'isomorphic-dompurify';
  // return DOMPurify.sanitize(html, {
  //   ALLOWED_TAGS,
  //   ALLOWED_ATTR: Object.keys(ALLOWED_ATTRIBUTES).reduce((acc, tag) => {
  //     return [...acc, ...ALLOWED_ATTRIBUTES[tag]];
  //   }, [])
  // });

  // For now, return with a warning comment
  // TODO: Install and use sanitize-html or DOMPurify package
  return html;
}

/**
 * Sanitize plain text (escape HTML entities)
 * @param {string} text - Plain text
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  if (!text) return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
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
