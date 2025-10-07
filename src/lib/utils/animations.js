// Motion utilities and Svelte actions for the AlgoRhythmics refurb
// These helpers lean on the refreshed timing tokens and surface patterns
// declared in `tokens.css`, and they respect the new motion blueprint from
// `REFURB_PLAN.md`.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SURFACE_CLASS = 'os-window';
const SURFACE_HINTS = ['card', 'feature', 'item', 'surface', 'panel'];
const isBrowser = typeof window !== 'undefined';

const tokenCache = new Map();

/**
 * Read a CSS custom property from the root element with a JS fallback.
 * Values are cached to avoid thrashing layout on successive reads.
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
 * Swap legacy glass-card classes for the refreshed os-window shell.
 * @param {HTMLElement} node
 */
const normaliseSurface = (node) => {
  if (node.classList.contains(SURFACE_CLASS)) return;
  if (node.classList.contains('glass-card')) node.classList.remove('glass-card');
  if (node.dataset.surface === 'window' || SURFACE_HINTS.some((cls) => node.classList.contains(cls))) {
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
  const destroyers = [];

  Array.from(targets).forEach((child, index) => {
    if (!(child instanceof HTMLElement)) return;
    normaliseSurface(child);
    const action = useReveal(child, {
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
 * Dedicated hero stage reveal. Adds data attributes so CSS can orchestrate
 * backdrop fades, glyph reveals, and CTA focus rings once the hero reaches
 * the viewport. Reduced motion users get the final state immediately.
 * @param {HTMLElement} node
 * @param {{ delay?: number; threshold?: number; once?: boolean; rootMargin?: string }} [options]
 */
export function heroStage(
  node,
  { delay = 0, threshold = 0.4, once = true, rootMargin = '0px' } = {}
) {
  if (!isBrowser) return { destroy: () => {} };

  const readyClass = 'hero-ready';
  const stageClass = 'hero-stage';

  const setReady = () => {
    node.dataset.heroReady = 'true';
    node.classList.add(readyClass);
    node.classList.remove(stageClass);
  };

  if (shouldReduceMotion()) {
    setReady();
    return {
      destroy: () => {
        node.classList.remove(readyClass);
        delete node.dataset.heroReady;
      }
    };
  }

  node.dataset.heroReady = 'false';
  node.classList.add(stageClass);
  node.classList.remove(readyClass);

  const activate = () => {
    const run = () => {
      if (delay) {
        setTimeout(() => {
          requestAnimationFrame(() => requestAnimationFrame(setReady));
        }, delay);
      } else {
        requestAnimationFrame(() => requestAnimationFrame(setReady));
      }
    };
    run();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activate();
        if (once) observer.disconnect();
      });
    },
    { threshold, rootMargin }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
      node.classList.remove(stageClass, readyClass);
      delete node.dataset.heroReady;
    }
  };
}

/**
 * Lightweight parallax that throttles work to animation frames.
 * @param {HTMLElement} node
 * @param {{ intensity?: number; axis?: 'x' | 'y' }} [options]
 */
export function useParallax(node, { intensity = 30, axis = 'y' } = {}) {
  if (shouldReduceMotion()) return { destroy: () => {} };

  let frame = 0;
  const update = () => {
    const rect = node.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (rect.bottom < 0 || rect.top > viewport) return;
    const offset = ((rect.top + rect.height / 2 - viewport / 2) / viewport) * intensity;
    const x = axis === 'x' ? offset : 0;
    const y = axis === 'y' ? offset : 0;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  return {
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    }
  };
}

/**
 * Alias for backwards compatibility with previous parallax export.
 */
export const parallax = useParallax;

/**
 * 3D hover tilt that respects reduced motion and mobile pointers.
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
        node.style.boxShadow = `0 24px 48px rgba(19, 81, 255, ${0.08 + intensity * 0.12}), 0 0 24px rgba(106, 56, 255, ${0.04 + intensity * 0.08})`;
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
      node.style.boxShadow = `0 18px 32px rgba(19, 81, 255, ${intensity}), 0 0 22px rgba(106, 56, 255, ${intensity * 0.6})`;
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
 * Ripple feedback for button presses.
 * @param {HTMLElement} node
 */
export function ripple(node) {
  if (!isBrowser) return { destroy: () => {} };
  node.style.position = node.style.position || 'relative';
  node.style.overflow = 'hidden';

  const handlePointerDown = (event) => {
    const diameter = Math.max(node.clientWidth, node.clientHeight);
    const radius = diameter / 2;
    const circle = document.createElement('span');
    circle.className = 'motion-ripple';
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.pointerEvents = 'none';
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.offsetX - radius}px`;
    circle.style.top = `${event.offsetY - radius}px`;
    circle.style.background = 'rgba(255, 255, 255, 0.45)';
    circle.style.transform = 'scale(0)';
    circle.style.opacity = '1';
    circle.style.transition = `transform ${durations.ui()} ${easings.soft()}, opacity ${durations.ui()} ${easings.soft()}`;

    node.appendChild(circle);
    requestAnimationFrame(() => {
      circle.style.transform = 'scale(1)';
      circle.style.opacity = '0';
    });

    setTimeout(() => circle.remove(), parseFloat(durations.ui()) + 300);
  };

  node.addEventListener('pointerdown', handlePointerDown);

  return {
    destroy() {
      node.removeEventListener('pointerdown', handlePointerDown);
    }
  };
}

/**
 * Sparkle trail on hover/focus used for hero CTAs.
 * @param {HTMLElement} node
 */
export function sparkleTrail(node) {
  if (!isBrowser || shouldReduceMotion()) return { destroy: () => {} };

  const spawn = (event) => {
    const count = 10;
    for (let i = 0; i < count; i += 1) {
      const sparkle = document.createElement('span');
      sparkle.className = 'motion-sparkle';
      sparkle.style.position = 'absolute';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.width = sparkle.style.height = `${Math.random() * 6 + 4}px`;
      sparkle.style.left = `${event.offsetX + (Math.random() * 24 - 12)}px`;
      sparkle.style.top = `${event.offsetY + (Math.random() * 16 - 8)}px`;
      sparkle.style.borderRadius = '50%';
      sparkle.style.background = Math.random() > 0.5
        ? 'linear-gradient(45deg, #ffffff, rgba(var(--voyage-blue-rgb), 0.8))'
        : 'linear-gradient(45deg, #ffffff, rgba(var(--aurora-purple-rgb), 0.8))';
      sparkle.style.opacity = '1';
      sparkle.style.transition = `all ${durations.ui()} ${easings.spring()}`;
      node.appendChild(sparkle);
      requestAnimationFrame(() => {
        sparkle.style.opacity = '0';
        sparkle.style.transform = `translate3d(${(Math.random() - 0.5) * 24}px, ${(Math.random() - 0.5) * 18}px, 0)`;
      });
      setTimeout(() => sparkle.remove(), 480);
    }
  };

  node.addEventListener('pointerenter', spawn);
  node.addEventListener('focus', spawn);

  return {
    destroy() {
      node.removeEventListener('pointerenter', spawn);
      node.removeEventListener('focus', spawn);
    }
  };
}

/**
 * Particle burst on click for celebratory actions.
 * @param {HTMLElement} node
 */
export function particleExplode(node) {
  if (!isBrowser || shouldReduceMotion()) return { destroy: () => {} };

  const spawn = (event) => {
    const baseColor = getCssToken('--voyage-blue', '#1351ff');
    const createParticle = (angle, velocity, lifetime) => {
      const particle = document.createElement('span');
      particle.className = 'motion-particle';
      particle.style.position = 'fixed';
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.style.width = particle.style.height = '4px';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.background = baseColor;
      particle.style.zIndex = '9999';
      document.body.appendChild(particle);

      const start = performance.now();
      const animate = (now) => {
        const progress = (now - start) / lifetime;
        if (progress >= 1) {
          particle.remove();
          return;
        }
        const dx = Math.cos(angle) * velocity * progress * 16;
        const dy = Math.sin(angle) * velocity * progress * 16 + progress * 4;
        particle.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        particle.style.opacity = String(1 - progress);
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    const count = 14;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const velocity = 0.6 + Math.random() * 0.8;
      const lifetime = 600 + Math.random() * 260;
      createParticle(angle, velocity, lifetime);
    }
  };

  node.addEventListener('click', spawn);

  return {
    destroy() {
      node.removeEventListener('click', spawn);
    }
  };
}

/**
 * Morphing blob animation for hero backgrounds.
 * @param {SVGPathElement} node
 * @param {{ duration?: number; scale?: number }} [options]
 */
export function morphBlob(node, { duration = 6500, scale = 1.2 } = {}) {
  if (!isBrowser || shouldReduceMotion()) return { destroy: () => {} };
  let frameId = 0;

  const animate = (time) => {
    const cycle = (time % duration) / duration;
    const angle = cycle * Math.PI * 2;
    const center = 100;
    const r1 = 80 * scale;
    const r2 = 100 * scale;
    const path = `M${center + r1 * Math.cos(angle)},${center + r1 * Math.sin(angle)}
      C${center + r2 * Math.cos(angle + 1)},${center + r2 * Math.sin(angle + 1)},
      ${center + r2 * Math.cos(angle + 2)},${center + r2 * Math.sin(angle + 2)},
      ${center + r1 * Math.cos(angle + Math.PI)},${center + r1 * Math.sin(angle + Math.PI)} Z`;
    node.setAttribute('d', path);
    node.style.transform = `scale(${scale})`;
    frameId = requestAnimationFrame(animate);
  };

  frameId = requestAnimationFrame(animate);

  return {
    destroy() {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Typewriter helper for hero captions.
 * @param {HTMLElement} node
 * @param {{ text?: string; speed?: number; loop?: boolean }} [options]
 */
export function typewriter(node, { text, speed = 40, loop = false } = {}) {
  if (shouldReduceMotion()) {
    node.textContent = text ?? node.textContent ?? '';
    return { destroy: () => {} };
  }

  const content = text ?? node.textContent ?? '';
  let index = 0;
  let active = true;
  node.textContent = '';

  const step = () => {
    if (!active) return;
    if (index < content.length) {
      node.textContent += content.charAt(index);
      index += 1;
      setTimeout(step, speed);
    } else if (loop) {
      setTimeout(() => {
        node.textContent = '';
        index = 0;
        step();
      }, 700);
    }
  };

  step();

  return {
    destroy() {
      active = false;
    }
  };
}

/**
 * Gradient morph helper used on hero panels.
 * @param {HTMLElement} node
 * @param {{ colors?: string[]; speed?: number }} [options]
 */
export function morphGradient(node, { colors = ['#1351ff', '#6a38ff', '#ffd339'], speed = 3200 } = {}) {
  if (!isBrowser || shouldReduceMotion() || colors.length < 2) {
    node.style.background = colors[0] ?? '#1351ff';
    return { destroy: () => {} };
  }

  let index = 0;
  const apply = () => {
    const next = (index + 1) % colors.length;
    node.style.background = `linear-gradient(135deg, ${colors[index]}, ${colors[next]})`;
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
  useParallax,
  parallax,
  tilt,
  magnetic,
  ripple,
  sparkleTrail,
  particleExplode,
  morphBlob,
  typewriter,
  morphGradient
};
