// Central motion utilities for the AlgoRhythmics experience.
// These helpers respect motion preferences, reuse shared timing tokens,
// and keep glass surfaces consistent by normalising older class names.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SURFACE_CLASS = 'os-window';
const isBrowser = typeof window !== 'undefined';

const tokenCache = new Map();

/**
 * Read a CSS custom property from the root element with a JS fallback.
 * Values are cached to avoid layout thrashing on successive reads.
 * @param {string} name
 * @param {string} fallback
 */
const getCssToken = (name, fallback) => {
  if (!isBrowser) return fallback;
  if (tokenCache.has(name)) return tokenCache.get(name);
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const resolved = value || fallback;
  tokenCache.set(name, resolved);
  return resolved;
};

const durations = {
  micro: () => getCssToken('--duration-micro', '120ms'),
  ui: () => getCssToken('--duration-ui', '240ms'),
  hero: () => getCssToken('--duration-hero', '520ms'),
  epic: () => getCssToken('--duration-epic', '720ms')
};

const easings = {
  soft: () => getCssToken('--ease-out-soft', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'),
  inOut: () => getCssToken('--ease-in-out', 'cubic-bezier(0.65, 0, 0.35, 1)'),
  snappy: () => getCssToken('--ease-snappy', 'cubic-bezier(0.33, 1, 0.68, 1)'),
  spring: () => getCssToken('--ease-spring', 'cubic-bezier(0.28, 0.84, 0.42, 1.1)')
};

const shouldReduceMotion = () => isBrowser && window.matchMedia(REDUCED_MOTION_QUERY).matches;

/**
 * Historically this helper swapped legacy `glass-card` classes for the
 * refreshed `os-window` shell. The component library now owns that
 * styling, so we simply opt-in elements that explicitly request the
 * window treatment via data attributes while leaving component classes
 * untouched.
 * @param {HTMLElement} node
 */
const normaliseSurface = (node) => {
  if (node.dataset.surface === 'window' || node.classList.contains(SURFACE_CLASS)) {
    node.classList.add(SURFACE_CLASS);
  }
};

/**
 * Intersection-driven reveal with reduced-motion fallback.
 * @param {HTMLElement} node
 * @param {{
 *  delay?: number;
 *  duration?: string;
 *  x?: number;
 *  y?: number;
 *  scale?: number;
 *  easing?: string;
 *  once?: boolean;
 *  threshold?: number;
 *  finalState?: { opacity?: number | string; transform?: string };
 * }} [options]
 */
export function useReveal(node, options = {}) {
  const {
    delay = 0,
    duration = durations.hero(),
    x = 0,
    y = 40,
    scale = 0.96,
    easing = easings.soft(),
    once = true,
    threshold = 0.12,
    finalState = { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  } = options;

  if (shouldReduceMotion()) {
    node.style.opacity = String(finalState.opacity ?? 1);
    node.style.transform = finalState.transform ?? 'none';
    return { destroy: () => {} };
  }

  if (typeof IntersectionObserver !== 'function') {
    node.style.opacity = String(finalState.opacity ?? 1);
    node.style.transform = finalState.transform ?? 'translate3d(0, 0, 0)';
    return { destroy: () => {} };
  }

  normaliseSurface(node);
  node.style.opacity = '0';
  node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  node.style.willChange = 'opacity, transform';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const applyFinalState = () => {
        node.style.transition = `opacity ${duration} ${easing}, transform ${duration} ${easing}`;
        const run = () => {
          node.style.opacity = String(finalState.opacity ?? 1);
          node.style.transform = finalState.transform ?? 'translate3d(0, 0, 0)';
          node.style.willChange = 'auto';
        };
        if (delay) {
          setTimeout(run, delay);
        } else {
          run();
        }
      };

      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => requestAnimationFrame(applyFinalState));
      } else {
        applyFinalState();
      }

      if (once) observer.disconnect();
    });
  }, { threshold });

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}

/**
 * Alias maintained for backwards compatibility with existing imports.
 */
export const revealOnScroll = useReveal;

/**
 * Group reveal that staggers children using the shared motion tokens.
 * @param {HTMLElement} node
 * @param {{
 *  delay?: number;
 *  stagger?: number;
 *  duration?: string;
 *  easing?: string;
 *  once?: boolean;
 *  selector?: string;
 *  x?: number;
 *  y?: number;
 *  scale?: number;
 *  finalState?: { opacity?: number | string; transform?: string };
 * }} [options]
 */
export function useStaggerReveal(node, options = {}) {
  const {
    delay = 0,
    stagger = 140,
    duration = durations.hero(),
    easing = easings.soft(),
    once = true,
    selector
  } = options;

  const targets = selector ? node.querySelectorAll(selector) : node.children;
  /** @type {Array<() => void>} */
  const destroyers = [];

  Array.from(targets)
    .filter((child) => child instanceof HTMLElement)
    .forEach((child, index) => {
      const element = /** @type {HTMLElement} */ (child);
      normaliseSurface(element);
      const action = useReveal(element, {
        delay: delay + index * stagger,
        duration,
        easing,
        once,
        y: options.y ?? 40,
        x: options.x ?? 0,
        scale: options.scale ?? 0.96,
        finalState: options.finalState
      });
      destroyers.push(() => action?.destroy?.());
    });

  return {
    destroy() {
      destroyers.forEach((fn) => fn && fn());
    }
  };
}

export const staggerReveal = useStaggerReveal;

/**
 * 3D hover tilt that respects reduced motion and coarse pointers.
 * @param {HTMLElement} node
 * @param {{ max?: number; scale?: number; easing?: string; glow?: boolean }} [options]
 */
export function tilt(node, { max = 12, scale = 1.03, easing = easings.snappy(), glow = true } = {}) {
  if (!isBrowser || shouldReduceMotion() || window.matchMedia('(pointer: coarse)').matches) {
    return { destroy: () => {} };
  }

  normaliseSurface(node);
  node.style.transition = `transform ${durations.ui()} ${easing}, box-shadow ${durations.ui()} ${easing}`;
  node.style.willChange = 'transform, box-shadow';

  let raf = 0;
  /** @param {PointerEvent} event */
  const handlePointerMove = (event) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = (max / 2 - x * max).toFixed(2);
      const tiltY = (y * max - max / 2).toFixed(2);
      node.style.transform = `perspective(800px) scale(${scale}) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
      if (glow) {
        const intensity = (Math.abs(Number(tiltX)) + Math.abs(Number(tiltY))) / max;
        node.style.boxShadow = `0 24px 48px rgba(var(--voyage-blue-rgb), ${0.08 + intensity * 0.12}), 0 0 24px rgba(var(--aurora-purple-rgb), ${0.04 + intensity * 0.08})`;
      }
    });
  };

  const reset = () => {
    cancelAnimationFrame(raf);
    node.style.transform = 'perspective(800px) scale(1)';
    node.style.boxShadow = '';
    node.style.willChange = 'auto';
  };

  node.addEventListener('pointermove', handlePointerMove);
  node.addEventListener('pointerleave', reset);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', reset);
    }
  };
}

/**
 * Magnetic attraction for buttons / CTAs with graceful fallback.
 * @param {HTMLElement} node
 * @param {{ strength?: number; threshold?: number; glow?: boolean; scale?: number }} [options]
 */
export function magnetic(node, { strength = 0.28, threshold = 110, glow = true, scale = 1.05 } = {}) {
  if (!isBrowser || shouldReduceMotion()) return { destroy: () => {} };

  node.style.transition = `transform ${durations.ui()} ${easings.soft()}, box-shadow ${durations.ui()} ${easings.soft()}`;

  /** @param {MouseEvent} event */
  const handleMove = (event) => {
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance >= threshold) return;

    const moveX = dx * strength;
    const moveY = dy * strength;
    const currentScale = 1 + (1 - distance / threshold) * (scale - 1);
    node.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${currentScale})`;
    if (glow) {
      const intensity = (1 - distance / threshold) * 0.28;
      node.style.boxShadow = `0 18px 32px rgba(var(--voyage-blue-rgb), ${intensity}), 0 0 22px rgba(var(--aurora-purple-rgb), ${intensity * 0.6})`;
    }
  };

  const reset = () => {
    node.style.transform = '';
    node.style.boxShadow = '';
  };

  window.addEventListener('mousemove', handleMove);
  node.addEventListener('mouseleave', reset);

  return {
    destroy() {
      window.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseleave', reset);
    }
  };
}

/**
 * Gradient morph helper used on hero panels.
 * @param {HTMLElement} node
 * @param {{ colors?: string[]; speed?: number }} [options]
 */
export function morphGradient(
  node,
  {
    colors,
    speed = 3200
  } = {}
) {
  if (!isBrowser) {
    node.style.background = getCssToken('--gradient-primary', '#6a38ff');
    return { destroy: () => {} };
  }

  const resolvedColors = (colors ?? [
    getCssToken('--aurora', '#6a38ff'),
    getCssToken('--voyage', '#1351ff'),
    getCssToken('--signal', '#ffd339'),
    getCssToken('--cherry', '#e0322c')
  ]).filter(Boolean);

  const isHighContrast = document.documentElement.dataset.theme === 'hc';

  if (shouldReduceMotion() || isHighContrast || resolvedColors.length < 2) {
    node.style.background = getCssToken('--gradient-primary', resolvedColors[0] ?? '#6a38ff');
    return { destroy: () => {} };
  }

  let index = 0;
  const apply = () => {
    const next = (index + 1) % resolvedColors.length;
    node.style.background = `linear-gradient(135deg, ${resolvedColors[index]}, ${resolvedColors[next]})`;
    index = next;
  };

  apply();
  const interval = setInterval(apply, speed);

  return {
    destroy() {
      clearInterval(interval);
    }
  };
}

export default {
  useReveal,
  revealOnScroll,
  useStaggerReveal,
  staggerReveal,
  tilt,
  magnetic,
  morphGradient
};
