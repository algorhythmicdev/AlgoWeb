<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onMount, onDestroy, tick } from 'svelte';
  import { theme } from '$stores/theme';

  const MAX_PARTICLES = 96;
  const BASE_SPEED = 0.1;
  const BASE_POINTER_PULL = 140;
  const MIN_POINTER_PULL = 100;
  let pointerPull = BASE_POINTER_PULL;
  let coarsePointer = false;

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number | undefined;
  let particles: Particle[] = [];
  let mouse = { x: 0, y: 0, active: false };
  let activePointerId: number | null = null;
  let prefersReducedMotion = false;
  let resizeObserver: ResizeObserver | null = null;
  let lastTimestamp = 0;
  let dpr = 1;
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;

  type RGB = { r: number; g: number; b: number };

  type Palette = {
    primary: RGB;
    secondary: RGB;
    tertiary: RGB;
    link: RGB;
    isDark: boolean;
  };

  const FALLBACK_LIGHT_PRIMARY: RGB = { r: 30, g: 92, b: 255 };
  const FALLBACK_LIGHT_SECONDARY: RGB = { r: 106, g: 56, b: 255 };
  const FALLBACK_LIGHT_TERTIARY: RGB = { r: 255, g: 211, b: 57 };

  const FALLBACK_DARK_PRIMARY: RGB = { r: 136, g: 108, b: 255 };
  const FALLBACK_DARK_SECONDARY: RGB = { r: 66, g: 132, b: 255 };
  const FALLBACK_DARK_TERTIARY: RGB = { r: 255, g: 196, b: 88 };
  const BLACK: RGB = { r: 0, g: 0, b: 0 };

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    depth: number;
    phase: number;
    phaseSpeed: number;

    constructor(width: number, height: number) {
      this.depth = Math.random() * 0.6 + 0.4;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * BASE_SPEED;
      this.vy = (Math.random() - 0.5) * BASE_SPEED;
      this.radius = Math.random() * 2 + 1 + this.depth * 0.6;
      this.phase = Math.random();
      this.phaseSpeed = Math.random() * 0.002 + 0.0008;
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
        if (dist < pointerPull) {
          const force = (1 - dist / pointerPull) * 0.4;
          this.vx -= (dx / dist) * force * 0.03;
          this.vy -= (dy / dist) * force * 0.03;
        }
      }

      this.phase = (this.phase + this.phaseSpeed * delta) % 1;
    }

    draw(context: CanvasRenderingContext2D, palette: Palette) {
      const cycleColor = brandCycleColor(palette, this.phase + this.depth * 0.35);
      const haloColor = brandCycleColor(palette, this.phase + 0.18);
      const haloTint = palette.isDark ? haloColor : shadeRgb(haloColor, 0.18);
      const coreBase = mixRgb(palette.primary, haloColor, 0.32 + this.depth * 0.18);
      const coreColor = palette.isDark ? coreBase : shadeRgb(coreBase, 0.22);
      const rimColor = palette.isDark ? cycleColor : shadeRgb(cycleColor, 0.28);
      const midColor = mixRgb(rimColor, coreColor, 0.52);

      const gradient = context.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 3.4
      );
      gradient.addColorStop(0, withAlpha(coreColor, palette.isDark ? 0.68 : 0.7));
      gradient.addColorStop(0.6, withAlpha(midColor, palette.isDark ? 0.56 : 0.6));
      gradient.addColorStop(0.88, withAlpha(rimColor, palette.isDark ? 0.38 : 0.44));
      gradient.addColorStop(1, withAlpha(rimColor, 0));

      context.save();
      context.fillStyle = gradient;
      context.shadowColor = withAlpha(haloTint, palette.isDark ? 0.28 : 0.32);
      context.shadowBlur = this.radius * (palette.isDark ? 7 : 8);
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.lineWidth = palette.isDark ? Math.max(0.8, this.radius * 0.3) : Math.max(0.9, this.radius * 0.4);
      context.strokeStyle = withAlpha(rimColor, palette.isDark ? 0.6 : 0.7);
      context.stroke();
      context.restore();
    }
  }

  let palette: Palette = fallbackPalette();
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

  function shadeRgb(color: RGB, amount: number): RGB {
    const ratio = Math.min(Math.max(amount, 0), 1);
    return mixRgb(color, BLACK, ratio);
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

  function readAccentPalette(): { primary: RGB | null; secondary: RGB | null; tertiary: RGB | null } | null {
    if (!browser || !document.body) return null;
    const bodyStyles = getComputedStyle(document.body);
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryValue = resolveColorValue(bodyStyles.getPropertyValue('--accent-primary'), bodyStyles, rootStyles);
    const secondaryValue = resolveColorValue(bodyStyles.getPropertyValue('--accent-secondary'), bodyStyles, rootStyles);
    const tertiaryValue = resolveColorValue(bodyStyles.getPropertyValue('--accent-tertiary'), bodyStyles, rootStyles);
    const primary = primaryValue ? parseColor(primaryValue) : null;
    const secondary = secondaryValue ? parseColor(secondaryValue) : null;
    const tertiary = tertiaryValue ? parseColor(tertiaryValue) : null;
    if (!primary && !secondary && !tertiary) return null;
    return { primary, secondary, tertiary };
  }

  function createPalette(primary: RGB, secondary: RGB, tertiary: RGB, isDark: boolean): Palette {
    const paired = mixRgb(primary, secondary, 0.55);
    const spectrumLink = mixRgb(paired, tertiary, 0.35);
    return {
      primary,
      secondary,
      tertiary,
      link: spectrumLink,
      isDark
    };
  }

  function fallbackPalette(): Palette {
    const isDark = $theme === 'dark';
    if (isDark) {
      return createPalette(
        { ...FALLBACK_DARK_PRIMARY },
        { ...FALLBACK_DARK_SECONDARY },
        { ...FALLBACK_DARK_TERTIARY },
        true
      );
    }

    return createPalette(
      { ...FALLBACK_LIGHT_PRIMARY },
      { ...FALLBACK_LIGHT_SECONDARY },
      { ...FALLBACK_LIGHT_TERTIARY },
      false
    );
  }

  function buildPalette(): Palette {
    const accentPalette = readAccentPalette();
    if (!accentPalette) {
      return fallbackPalette();
    }

    const themeName = $theme;
    const primary = accentPalette.primary ?? (themeName === 'dark' ? FALLBACK_DARK_PRIMARY : FALLBACK_LIGHT_PRIMARY);
    const secondary = accentPalette.secondary ?? (themeName === 'dark' ? FALLBACK_DARK_SECONDARY : FALLBACK_LIGHT_SECONDARY);
    const tertiary = accentPalette.tertiary ?? accentPalette.primary ?? (themeName === 'dark' ? FALLBACK_DARK_TERTIARY : FALLBACK_LIGHT_TERTIARY);
    const isDark = themeName === 'dark';

    return createPalette({ ...primary }, { ...secondary }, { ...tertiary }, isDark);
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
    const shortSide = Math.min(width, height);
    const useCoarseDensity = coarsePointer || shortSide < 720;
    const density = useCoarseDensity ? 36000 : 28000;
    const minimum = useCoarseDensity ? 28 : 36;
    return Math.min(MAX_PARTICLES, Math.max(minimum, Math.round(area / density)));
  }

  function updateInteractionSettings(width: number, height: number) {
    const shortestSide = Math.max(240, Math.min(width, height));
    const base = coarsePointer ? Math.min(BASE_POINTER_PULL, shortestSide * 0.38) : Math.min(BASE_POINTER_PULL, shortestSide * 0.45);
    pointerPull = Math.max(MIN_POINTER_PULL, base);
  }

  function configureCanvas(preserveParticles = false) {
    if (!canvas) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const previousWidth = lastCanvasWidth || width;
    const previousHeight = lastCanvasHeight || height;
    updateInteractionSettings(width, height);
    dpr = Math.min(browser ? window.devicePixelRatio || 1 : 1, 2);

    const nextWidth = Math.round(width * dpr);
    const nextHeight = Math.round(height * dpr);

    const resized = canvas.width !== nextWidth || canvas.height !== nextHeight;

    const count = targetParticleCount(width, height);

    const shouldRebuild = !preserveParticles || particles.length === 0;
    const sameDensity = particles.length === count;

    if (!shouldRebuild && !resized && sameDensity && ctx) {
      lastCanvasWidth = width;
      lastCanvasHeight = height;
      return;
    }

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    if (shouldRebuild) {
      particles = Array.from({ length: count }, () => new Particle(width, height));
    } else {
      if (resized) {
        const widthRatio = previousWidth ? width / previousWidth : 1;
        const heightRatio = previousHeight ? height / previousHeight : 1;
        const velocityScale = Math.sqrt(
          Math.max(0.25, (widthRatio * widthRatio + heightRatio * heightRatio) * 0.5)
        );
        const sizeScale = Math.sqrt(Math.max(0.25, widthRatio * heightRatio));

        particles.forEach((particle) => {
          particle.x = Math.max(0, Math.min(width, particle.x * widthRatio));
          particle.y = Math.max(0, Math.min(height, particle.y * heightRatio));
          particle.vx *= velocityScale;
          particle.vy *= velocityScale;
          particle.radius = Math.max(0.8, particle.radius * sizeScale);
        });
      }

      if (particles.length > count) {
        particles.length = count;
      } else {
        while (particles.length < count) {
          particles.push(new Particle(width, height));
        }
      }
    }

    lastCanvasWidth = width;
    lastCanvasHeight = height;
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
    context.lineCap = 'round';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const maxDistance = 180 * (a.depth + b.depth) * 0.62;

        if (dist < maxDistance) {
          const strength = 1 - dist / maxDistance;
          const phase = ((a.phase + b.phase) * 0.5 + lastTimestamp / 7200) % 1;
          const cycleColor = brandCycleColor(palette, phase);
          const linkColor = mixRgb(cycleColor, palette.link, 0.32 + strength * 0.18);
          const tinted = palette.isDark ? linkColor : shadeRgb(linkColor, 0.24);
          context.strokeStyle = withAlpha(tinted, palette.isDark ? 0.32 : 0.38);
          context.globalAlpha = Math.pow(strength, 0.7) * (palette.isDark ? 0.7 : 0.75);
          context.lineWidth = palette.isDark ? 0.6 + strength * 0.6 : 0.7 + strength * 0.8;
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
    const pointerColor = brandCycleColor(palette, (lastTimestamp / 4800 + 0.25) % 1);
    const pointerBlend = mixRgb(pointerColor, palette.tertiary, 0.42);
    const pointerTint = palette.isDark ? pointerBlend : shadeRgb(pointerBlend, 0.22);
    const haloScale = coarsePointer ? 0.7 : 0.85;
    const gradient = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, pointerPull * 1.05);
    gradient.addColorStop(0, withAlpha(pointerTint, (palette.isDark ? 0.22 : 0.2) * haloScale));
    gradient.addColorStop(
      0.45,
      withAlpha(mixRgb(pointerTint, palette.primary, 0.38), (palette.isDark ? 0.16 : 0.18) * haloScale)
    );
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(mouse.x, mouse.y, pointerPull, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function brandCycleColor(palette: Palette, progress: number): RGB {
    const sequence = [palette.secondary, palette.tertiary, palette.primary, palette.secondary];
    const normalized = ((progress % 1) + 1) % 1;
    const scaled = normalized * (sequence.length - 1);
    const index = Math.floor(scaled);
    const ratio = scaled - index;
    const start = sequence[index];
    const end = sequence[index + 1];
    return mixRgb(start, end, ratio);
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

  function setPointerPosition(x: number, y: number) {
    mouse = { x, y, active: true };
  }

  function deactivatePointer() {
    activePointerId = null;
    mouse.active = false;
  }

  function handleMouseMove(event: MouseEvent) {
    setPointerPosition(event.clientX, event.clientY);
  }

  function handleMouseLeave() {
    deactivatePointer();
  }

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType === 'mouse') {
      setPointerPosition(event.clientX, event.clientY);
      return;
    }

    if (activePointerId !== null && event.pointerId !== activePointerId) {
      return;
    }

    activePointerId = event.pointerId;
    setPointerPosition(event.clientX, event.clientY);
  }

  function handlePointerDown(event: PointerEvent) {
    activePointerId = event.pointerId;
    setPointerPosition(event.clientX, event.clientY);
  }

  function handlePointerEnd(event: PointerEvent) {
    if (activePointerId !== null && event.pointerId !== activePointerId) {
      return;
    }
    deactivatePointer();
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length === 0) return;
    const touch = event.touches[0];
    setPointerPosition(touch.clientX, touch.clientY);
  }

  function handleTouchEnd() {
    deactivatePointer();
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      deactivatePointer();
      stop();
    } else if (!prefersReducedMotion) {
      start();
    }
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
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const legacyPointerQuery = pointerQuery as LegacyMediaQueryList;
    const hoverQuery = window.matchMedia('(hover: none)');
    const legacyHoverQuery = hoverQuery as LegacyMediaQueryList;

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
    const computeCoarsePointer = () => {
      const pointerMatches = pointerQuery.matches;
      const hoverNone = hoverQuery.matches;
      const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints ?? 0 : 0;
      return pointerMatches || hoverNone || touchPoints > 0;
    };
    const updatePointerPrecision = () => {
      const nextCoarse = computeCoarsePointer();
      if (nextCoarse === coarsePointer) return;
      coarsePointer = nextCoarse;
      configureCanvas(true);
    };
    const onPointerChange = () => updatePointerPrecision();

    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (legacyMotionQuery.addListener) {
      legacyMotionQuery.addListener(onMotionChange);
    }

    updatePointerPrecision();

    if (typeof pointerQuery.addEventListener === 'function') {
      pointerQuery.addEventListener('change', onPointerChange);
    } else if (legacyPointerQuery.addListener) {
      legacyPointerQuery.addListener(onPointerChange);
    }

    if (typeof hoverQuery.addEventListener === 'function') {
      hoverQuery.addEventListener('change', onPointerChange);
    } else if (legacyHoverQuery.addListener) {
      legacyHoverQuery.addListener(onPointerChange);
    }

    tick().then(() => {
      configureCanvas();
      updatePalette(true);
    });

    updateMotionPreference(motionQuery.matches);

    const resizeTarget = document.documentElement;
    resizeObserver = new ResizeObserver(() => {
      configureCanvas(true);
      if (!prefersReducedMotion) {
        start();
      }
    });
    resizeObserver.observe(resizeTarget);

    const pointerSupported = typeof window.PointerEvent !== 'undefined';

    if (pointerSupported) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      window.addEventListener('pointerup', handlePointerEnd, { passive: true });
      window.addEventListener('pointercancel', handlePointerEnd, { passive: true });
      window.addEventListener('pointerleave', handlePointerEnd, { passive: true });
    } else {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchstart', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      if (typeof motionQuery.removeEventListener === 'function') {
        motionQuery.removeEventListener('change', onMotionChange);
      } else if (legacyMotionQuery.removeListener) {
        legacyMotionQuery.removeListener(onMotionChange);
      }
      if (typeof pointerQuery.removeEventListener === 'function') {
        pointerQuery.removeEventListener('change', onPointerChange);
      } else if (legacyPointerQuery.removeListener) {
        legacyPointerQuery.removeListener(onPointerChange);
      }

      if (typeof hoverQuery.removeEventListener === 'function') {
        hoverQuery.removeEventListener('change', onPointerChange);
      } else if (legacyHoverQuery.removeListener) {
        legacyHoverQuery.removeListener(onPointerChange);
      }
      if (pointerSupported) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerEnd);
        window.removeEventListener('pointercancel', handlePointerEnd);
        window.removeEventListener('pointerleave', handlePointerEnd);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      }
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  onDestroy(() => {
    stop();
    resizeObserver?.disconnect();
    if (browser) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="particle-network"
  data-theme={$theme}
  aria-hidden="true"></canvas>

<style>
  .particle-network {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--z-behind, -10);
    pointer-events: none;
    opacity: 0.42;
    mix-blend-mode: screen;
    filter: saturate(1.08) contrast(1.04) brightness(1.02);
    transition:
      opacity 2s cubic-bezier(0.4, 0, 0.2, 1),
      filter 2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .particle-network[data-theme='dark'] {
    opacity: 0.48;
    filter: saturate(1.14) contrast(1.06) brightness(1.03);
  }

  .particle-network[data-theme='light'] {
    opacity: 0.55;
    mix-blend-mode: multiply;
    filter: saturate(1.18) contrast(1.12) brightness(0.96);
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
