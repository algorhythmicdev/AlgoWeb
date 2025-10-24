export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function fadeIn(node, { duration = 180, delay = 0 } = {}) {
  if (prefersReduced()) duration = 0;
  return {
    delay,
    duration,
    css: (t) => `opacity:${t}`
  };
}

export function slideY(node, { y = 8, duration = 200, delay = 0, easing = (t) => t } = {}) {
  if (prefersReduced()) duration = 0;
  return {
    delay,
    duration,
    easing,
    css: (t) => `transform: translateY(${(1 - t) * y}px); opacity:${t}`
  };
}
