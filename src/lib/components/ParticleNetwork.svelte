<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onMount, onDestroy, tick } from 'svelte';
  import { theme } from '$stores/theme';

  const MAX_PARTICLES = 96;
  const BASE_SPEED = 0.18;
  const POINTER_PULL = 120;

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number | undefined;
  let particles: Particle[] = [];
  let mouse = { x: 0, y: 0, active: false };
  let prefersReducedMotion = false;
  let resizeObserver: ResizeObserver | null = null;
  let lastTimestamp = 0;
  let dpr = 1;

  type RGB = { r: number; g: number; b: number };

  type Palette = {
    node: string;
    nodeAlt: string;
    link: string;
    glow: string;
  };

  const DEFAULT_LIGHT_PALETTE: Palette = {
    node: 'rgba(30, 92, 255, 0.85)',
    nodeAlt: 'rgba(30, 92, 255, 0)',
    link: 'rgba(30, 92, 255, 0.18)',
    glow: 'rgba(120, 170, 255, 0.26)'
  };

  const DEFAULT_DARK_PALETTE: Palette = {
    node: 'rgba(124, 90, 255, 0.85)',
    nodeAlt: 'rgba(124, 90, 255, 0)',
    link: 'rgba(124, 90, 255, 0.22)',
    glow: 'rgba(110, 134, 255, 0.28)'
  };

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    depth: number;

    constructor(width: number, height: number) {
      this.depth = Math.random() * 0.6 + 0.4;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * BASE_SPEED;
      this.vy = (Math.random() - 0.5) * BASE_SPEED;
      this.radius = Math.random() * 1.8 + 0.8 + this.depth * 0.6;
    }

    update(width: number, height: number, delta: number) {
      this.x += this.vx * delta * (0.6 + this.depth);
      this.y += this.vy * delta * (0.6 + this.depth);

      if (this.x < 0 || this.x > width) {
        this.vx *= -1;
        this.x = Math.max(0, Math.min(width, this.x));
      }

      if (this.y < 0 || this.y > height) {
        this.vy *= -1;
        this.y = Math.max(0, Math.min(height, this.y));
      }

      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < POINTER_PULL) {
          const force = (1 - dist / POINTER_PULL) * 0.65;
          this.vx -= (dx / dist) * force * 0.05;
          this.vy -= (dy / dist) * force * 0.05;
        }
      }
    }

    draw(context: CanvasRenderingContext2D, palette: Palette) {
      const gradient = context.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 2.4
      );
      gradient.addColorStop(0, palette.node);
      gradient.addColorStop(1, palette.nodeAlt);

      context.save();
      context.fillStyle = gradient;
      context.globalAlpha = 0.85;
      context.shadowColor = palette.glow;
      context.shadowBlur = this.radius * 6;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  let palette: Palette = DEFAULT_LIGHT_PALETTE;
  let paletteSignature = '';

  function parseHex(value: string): RGB | null {
    const hex = value.replace('#', '').trim();
    if (![3, 6].includes(hex.length)) return null;
    const expanded = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex;
    const int = Number.parseInt(expanded, 16);
    if (Number.isNaN(int)) return null;
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255
    };
  }

  function parseRgb(value: string): RGB | null {
    const match = value.match(/\d+(?:\.\d+)?/g);
    if (!match || match.length < 3) return null;
    const [r, g, b] = match;
    return {
      r: Number.parseFloat(r),
      g: Number.parseFloat(g),
      b: Number.parseFloat(b)
    };
  }

  function parseColor(value: string): RGB | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('#')) return parseHex(trimmed);
    if (trimmed.startsWith('rgb')) return parseRgb(trimmed);
    return null;
  }

  function withAlpha(color: RGB, alpha: number) {
    return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${alpha})`;
  }

  function mixRgb(a: RGB, b: RGB, ratio: number): RGB {
    const amount = Math.min(Math.max(ratio, 0), 1);
    const mix = (x: number, y: number) => x * (1 - amount) + y * amount;
    return {
      r: mix(a.r, b.r),
      g: mix(a.g, b.g),
      b: mix(a.b, b.b)
    };
  }

  function resolveColorValue(
    value: string,
    bodyStyles: CSSStyleDeclaration,
    rootStyles: CSSStyleDeclaration,
    depth = 0
  ): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!trimmed.startsWith('var(')) return trimmed;
    if (depth > 6) return null;

    const match = trimmed.match(/var\((--[A-Za-z0-9-_]+)(?:,\s*(.*))?\)/);
    if (!match) return null;

    const [, token, fallback] = match;
    const nextValue =
      bodyStyles.getPropertyValue(token)?.trim() ||
      rootStyles.getPropertyValue(token)?.trim() ||
      (fallback ? fallback.trim() : '');
    return resolveColorValue(nextValue, bodyStyles, rootStyles, depth + 1);
  }

  function readAccentPalette(): { primary: RGB | null; secondary: RGB | null } | null {
    if (!browser || !document.body) return null;
    const bodyStyles = getComputedStyle(document.body);
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryValue = resolveColorValue(bodyStyles.getPropertyValue('--accent-primary'), bodyStyles, rootStyles);
    const secondaryValue = resolveColorValue(bodyStyles.getPropertyValue('--accent-secondary'), bodyStyles, rootStyles);
    const primary = primaryValue ? parseColor(primaryValue) : null;
    const secondary = secondaryValue ? parseColor(secondaryValue) : null;
    if (!primary && !secondary) return null;
    return { primary, secondary };
  }

  function fallbackPalette(): Palette {
    return $theme === 'dark' ? DEFAULT_DARK_PALETTE : DEFAULT_LIGHT_PALETTE;
  }

  function buildPalette(): Palette {
    const accentPalette = readAccentPalette();
    if (!accentPalette) {
      return fallbackPalette();
    }

    const themeName = $theme;
    const primary = accentPalette.primary ?? { r: 30, g: 92, b: 255 };
    const secondary = accentPalette.secondary ?? primary;
    const isDark = themeName === 'dark';

    const altBase = mixRgb(primary, { r: 255, g: 255, b: 255 }, isDark ? 0.22 : 0.3);

    return {
      node: withAlpha(primary, isDark ? 0.88 : 0.84),
      nodeAlt: withAlpha(altBase, 0),
      link: withAlpha(secondary, isDark ? 0.28 : 0.22),
      glow: withAlpha(primary, isDark ? 0.36 : 0.3)
    };
  }

  function updatePalette(force = false) {
    if (!browser) return;
    const next = buildPalette();
    const nextSignature = JSON.stringify(next);
    if (!force && nextSignature === paletteSignature) {
      return;
    }
    palette = next;
    paletteSignature = nextSignature;
  }

  function targetParticleCount(width: number, height: number) {
    const area = width * height;
    const density = 28000;
    return Math.min(MAX_PARTICLES, Math.max(36, Math.round(area / density)));
  }

  function configureCanvas() {
    if (!canvas) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    dpr = Math.min(browser ? window.devicePixelRatio || 1 : 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const count = targetParticleCount(width, height);
    particles = Array.from({ length: count }, () => new Particle(width, height));
  }

  function clear() {
    if (!ctx || !canvas) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function renderFrame(timestamp: number) {
    if (!ctx || !canvas) return;
    if (prefersReducedMotion) return;

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    const delta = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 16.67, 3) : 1;
    lastTimestamp = timestamp;

    clear();
    const paletteRef = palette;

    particles.forEach((particle) => {
      particle.update(width, height, delta);
      particle.draw(ctx!, paletteRef);
    });

    ctx.globalAlpha = 1;
    drawConnections(ctx, paletteRef);
    drawPointerGlow(ctx, paletteRef);

    animationId = requestAnimationFrame(renderFrame);
  }

  function drawConnections(context: CanvasRenderingContext2D, palette: Palette) {
    context.save();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const maxDistance = 160 * (a.depth + b.depth) * 0.55;

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          context.strokeStyle = palette.link;
          context.globalAlpha = alpha * 0.9;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
    }
    context.restore();
  }

  function drawPointerGlow(context: CanvasRenderingContext2D, palette: Palette) {
    if (!mouse.active) return;
    context.save();
    context.globalAlpha = 1;
    const gradient = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, POINTER_PULL);
    gradient.addColorStop(0, palette.glow);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(mouse.x, mouse.y, POINTER_PULL, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function start() {
    if (prefersReducedMotion) return;
    if (animationId) cancelAnimationFrame(animationId);
    lastTimestamp = 0;
    animationId = requestAnimationFrame(renderFrame);
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }
  }

  function handleMouseMove(event: MouseEvent) {
    mouse = { x: event.clientX, y: event.clientY, active: true };
  }

  function handleMouseLeave() {
    mouse.active = false;
  }

  type LegacyMediaQueryList = MediaQueryList & {
    addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
  };

  let lastPathname = '';
  let lastThemeName: string | undefined;

  $: if (browser) {
    const pathname = $page.url.pathname;
    if (pathname !== lastPathname) {
      lastPathname = pathname;
      tick().then(() => updatePalette());
    }
  }

  $: if (browser) {
    const themeName = $theme;
    if (themeName !== lastThemeName) {
      lastThemeName = themeName;
      tick().then(() => updatePalette());
    }
  }

  onMount(() => {
    if (!browser) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const legacyMotionQuery = motionQuery as LegacyMediaQueryList;

    const updateMotionPreference = (matches: boolean) => {
      prefersReducedMotion = matches;
      if (prefersReducedMotion) {
        stop();
        clear();
      } else {
        start();
      }
    };

    const onMotionChange = (event: MediaQueryListEvent) => updateMotionPreference(event.matches);

    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (legacyMotionQuery.addListener) {
      legacyMotionQuery.addListener(onMotionChange);
    }

    tick().then(() => {
      configureCanvas();
      updatePalette(true);
    });

    updateMotionPreference(motionQuery.matches);

    const resizeTarget = document.documentElement;
    resizeObserver = new ResizeObserver(() => {
      configureCanvas();
      if (!prefersReducedMotion) {
        start();
      }
    });
    resizeObserver.observe(resizeTarget);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      stop();
      if (typeof motionQuery.removeEventListener === 'function') {
        motionQuery.removeEventListener('change', onMotionChange);
      } else if (legacyMotionQuery.removeListener) {
        legacyMotionQuery.removeListener(onMotionChange);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver?.disconnect();
    };
  });

  onDestroy(() => {
    stop();
    resizeObserver?.disconnect();
  });
</script>

<canvas bind:this={canvas} class="particle-network" aria-hidden="true"></canvas>

<style>
  .particle-network {
    position: fixed;
    inset: 0;
    z-index: var(--z-behind, -10);
    pointer-events: none;
    opacity: 0.52;
    mix-blend-mode: screen;
    transition: opacity var(--duration-smooth) var(--ease-smooth);
  }

  :global([data-theme='hc']) .particle-network {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .particle-network {
      display: none;
    }
  }
</style>
