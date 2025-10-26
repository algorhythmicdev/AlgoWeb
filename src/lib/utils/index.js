/**
 * AlgoRhythmics Utils - Barrel Export
 * Central export point for all utility functions
 */

// Animation utilities
export { prefersReduced, fadeIn, slideY } from '../animations.js';

// Validation utilities
export {
  validateEmail,
  validatePhone,
  validateURL,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateForm
} from './validators.js';

// Formatting utilities
export {
  formatDate,
  formatDateShort,
  formatNumber,
  formatCurrency,
  truncate,
  slugify,
  capitalize,
  formatRelativeTime
} from './formatters.js';

// i18n utilities
export { translateOrFallback } from './i18n.js';

// CMS helpers
export { resolveMediaUrl, normaliseRelation } from './media.js';
export { normalisePost } from './strapi';
