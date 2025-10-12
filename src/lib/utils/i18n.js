/**
 * Translation helpers for safer fallbacks.
 * These utilities guard against missing keys that would otherwise
 * render raw translation identifiers in the UI.
 */

/**
 * Resolve a translation key and fall back when the translation is missing.
 * The helper trims whitespace and treats returned keys (e.g. "home.hero.title")
 * as missing values so components can confidently display the fallback copy.
 *
 * @param {(key: string, params?: Record<string, unknown>) => string} translator
 * @param {string} key
 * @param {string} [fallback]
 * @param {Record<string, unknown>} [params]
 * @returns {string}
 */
export function translateOrFallback(translator, key, fallback = '', params) {
  const fallbackText = typeof fallback === 'string' ? fallback.trim() : '';
  if (typeof translator !== 'function') {
    return fallbackText;
  }

  try {
    const value = translator(key, params);
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed && trimmed !== key) {
        return trimmed;
      }
    }
  } catch {
    // ignore translator errors and return fallback
  }

  return fallbackText;
}
