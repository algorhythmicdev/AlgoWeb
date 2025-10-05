/**
 * AlgoRhythmics Utils - Barrel Export
 * Central export point for all utility functions
 */

// Animation utilities
export {
  revealOnScroll,
  staggerReveal,
  tilt,
  magnetic,
  parallax,
  typewriter,
  morphBlob,
  ripple,
  sparkleTrail,
  particleExplode,
  morphGradient
} from './animations.js';

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

// SEO utilities
export {
  generateMetaTags,
  generateStructuredData,
  generateBreadcrumbs,
  sanitizeForMeta
} from './seo.js';
