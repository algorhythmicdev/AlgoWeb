/**
 * Determine whether the current environment prefers reduced motion.
 *
 * @returns {boolean}
 */
export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Fade an element in using Svelte's transition interface.
 *
 * @param {Element} node
 * @param {{ duration?: number; delay?: number }} [options]
 * @returns {import('svelte/transition').TransitionConfig}
 */
export function fadeIn(node, { duration = 180, delay = 0 } = {}) {
  if (prefersReduced()) duration = 0;
  return {
    delay,
    duration,
    css: (/** @type {number} */ t) => `opacity:${t}`
  };
}

/**
 * Slide an element on the Y axis.
 *
 * @param {Element} node
 * @param {{ y?: number; duration?: number; delay?: number; easing?: (t: number) => number }} [options]
 * @returns {import('svelte/transition').TransitionConfig}
 */
export function slideY(
  node,
  { y = 8, duration = 200, delay = 0, easing = (/** @type {number} */ t) => t } = {}
) {
  if (prefersReduced()) duration = 0;
  return {
    delay,
    duration,
    easing,
    css: (/** @type {number} */ t) => `transform: translateY(${(1 - t) * y}px); opacity:${t}`
  };
}
