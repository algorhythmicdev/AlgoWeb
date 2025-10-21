<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { page } from '$app/stores';
  import { getThemeForPath } from '$config/backgroundThemes';
  import { theme as themeStore } from '$stores/theme';

  type LayerGradient = { filter?: string; opacity?: number };
  type LayerWash = {
    min?: number;
    base?: number;
    span?: number;
    max?: number;
    blend?: string;
    filter?: string;
  };
  type LayerFlare = {
    min?: number;
    base?: number;
    span?: number;
    max?: number;
    blend?: string;
    filter?: string;
  };
  type LayerVeil = {
    color?: string;
    mixMode?: string;
    min?: number;
    max?: number;
    span?: number;
  };
  type LayerFilm = { max?: number };
  type LayerOverrides = {
    gradient?: LayerGradient;
    wash?: LayerWash;
    flare?: LayerFlare;
    veil?: LayerVeil;
    film?: LayerFilm;
  };
  type ShapeConfig = {
    type: string;
    count: number;
    color: string;
    size: 'small' | 'medium' | 'large' | string;
  };
  type ThemeConfig = {
    name: string;
    palette?: string[];
    gradient?: string;
    grainOpacity?: number;
    layers?: LayerOverrides;
    shapes: ShapeConfig[];
    animation?: string;
    density?: string;
    interactivity?: string;
  };
  type ParticleOptions = {
    flatten?: boolean;
    reduced?: boolean;
  };
  type Particle = {
    id: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
    blur: number;
    opacity: number;
  };
  type PointerCoords = { x: number; y: number };

  let prefersReducedMotion = false;
  let prefersHighContrast = false;
  let prefersLessTransparency = false;
  let flattenAmbient = false;
  let mounted = false;
  let pointerTracking = false;
  let raf: number | undefined;

  let particles: Particle[] = [];
  let theme: ThemeConfig | undefined;
  const basePalette = ['voyage-blue', 'aurora-purple', 'signal-yellow'];
  const fallbackGradient =
    'radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--bg) 99.92%, rgba(var(--voyage-blue-rgb), 0.006) 0.08%) 0%, color-mix(in srgb, var(--bg-elev-1) 99.92%, rgba(var(--aurora-purple-rgb), 0.006) 0.08%) 42%, var(--bg) 100%)';
  const fallbackFilmOpacity = 0.045;

  const pointerSpring = spring<PointerCoords>({ x: 0.5, y: 0.35 }, { stiffness: 0.06, damping: 0.5, precision: 0.001 });
  const scrollSpring = spring<number>(0, { stiffness: 0.04, damping: 0.55, precision: 0.0001 });

  let pointerCoords: PointerCoords = { x: 0.5, y: 0.35 };
  let scrollDepth = 0;

  const unsubscribePointer = pointerSpring.subscribe((value) => (pointerCoords = value));
  const unsubscribeScroll = scrollSpring.subscribe((value) => (scrollDepth = value));

  function observePreference(query: string, setter: (value: boolean) => void): () => void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setter(false);
      return () => {};
    }

    const mediaQuery = window.matchMedia(query);
    const apply = (value: boolean) => setter(Boolean(value));
    const handleChange = (event: MediaQueryListEvent) => apply(event.matches);

    apply(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    return () => {};
  }

  function enablePointerTracking(): void {
    if (!mounted || pointerTracking || typeof window === 'undefined' || prefersReducedMotion || flattenAmbient) {
      return;
    }

    pointerTracking = true;
    handleLeave();
    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('pointerleave', handleLeave);
    raf = requestAnimationFrame(animate);
  }

  function disablePointerTracking(): void {
    if (!pointerTracking || typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('pointermove', handlePointer);
    window.removeEventListener('pointerleave', handleLeave);
    if (raf) {
      cancelAnimationFrame(raf);
      raf = undefined;
    }
    pointerTracking = false;
    handleLeave();
  }

  $: paletteNames = theme?.palette ?? basePalette;
  const paletteFallback = ['var(--voyage-blue)', 'var(--aurora-purple)', 'var(--signal-yellow)'];
  $: paletteColors = paletteNames.map((name, index) => colorVar(name, index));
  $: [primaryColor, secondaryColor, accentColor] = [
    paletteColors[0] ?? paletteFallback[0],
    paletteColors[1] ?? paletteFallback[1],
    paletteColors[2] ?? paletteFallback[2]
  ];

  $: currentThemeName = $themeStore;
  $: flattenAmbient = prefersHighContrast || prefersLessTransparency || currentThemeName === 'hc';

  $: routeGradient = theme?.gradient ?? fallbackGradient;
  $: routeFilmOpacity = typeof theme?.grainOpacity === 'number' ? theme.grainOpacity * 12 : fallbackFilmOpacity;
  function buildLayerVars(layerOverrides: LayerOverrides = {}): string[] {
    const list: string[] = [];
    const add = (key: string, value: string | number | null | undefined) => {
      if (value === undefined || value === null) return;
      list.push(`--${key}:${value}`);
    };

    const { gradient = {}, wash = {}, flare = {}, veil = {}, film = {} } = layerOverrides;

    add('gradient-filter', gradient.filter);
    add('gradient-opacity', gradient.opacity);

    add('wash-min', wash.min);
    add('wash-base', wash.base);
    add('wash-span', wash.span);
    add('wash-max', wash.max);
    add('wash-blend', wash.blend);
    add('wash-filter', wash.filter);

    add('flare-min', flare.min);
    add('flare-base', flare.base);
    add('flare-span', flare.span);
    add('flare-max', flare.max);
    add('flare-blend', flare.blend);
    add('flare-filter', flare.filter);

    add('veil-color', veil.color);
    add('veil-mix-mode', veil.mixMode);
    add('veil-opacity-min', veil.min);
    add('veil-opacity-max', veil.max);
    add('veil-opacity-span', veil.span);

    add('film-opacity-max', film.max);

    return list;
  }

  $: layerVars = buildLayerVars(theme?.layers);

  function joinVars(values: string[]): string {
    return values.filter(Boolean).join('; ');
  }

  $: backgroundVarList = [
    `--pointer-x:${pointerCoords.x}`,
    `--pointer-y:${pointerCoords.y}`,
    `--scroll-depth:${scrollDepth}`,
    `--theme-primary:${primaryColor}`,
    `--theme-secondary:${secondaryColor}`,
    `--theme-accent:${accentColor}`,
    `--route-gradient:${routeGradient}`,
    `--route-film:${routeFilmOpacity}`
  ];

  $: backgroundVars = joinVars([...backgroundVarList, ...layerVars]);
  $: if (backgroundVars) backgroundVars = `${backgroundVars};`;

  $: theme = getThemeForPath($page.url.pathname);
  $: if (theme) initParticles(theme, { flatten: flattenAmbient, reduced: prefersReducedMotion });

  $: if (mounted) {
    if (prefersReducedMotion || flattenAmbient) {
      disablePointerTracking();
    } else {
      enablePointerTracking();
    }
  }

  function colorVar(name: string, index = 0): string {
    if (name === 'voyage-blue') return 'var(--voyage-blue)';
    if (name === 'aurora-purple') return 'var(--aurora-purple)';
    if (name === 'signal-yellow') return 'var(--signal-yellow)';
    if (name === 'cherry-red' || name === 'cherry-pop') return 'var(--cherry-pop)';
    // provide subtle variation when palette item missing
    const fallback = ['var(--voyage-blue)', 'var(--aurora-purple)', 'var(--signal-yellow)'];
    return fallback[index % fallback.length];
  }

  function initParticles(themeConfig: ThemeConfig | undefined, options: ParticleOptions = {}): void {
    if (!themeConfig) {
      particles = [];
      return;
    }
    const { flatten = flattenAmbient, reduced = prefersReducedMotion } = options;

    if (flatten) {
      particles = [];
      return;
    }
    const total = themeConfig.shapes.reduce<number>((sum, shape) => sum + shape.count, 0);
    const limit = Math.min(total, reduced ? 6 : 12);
    const list: Particle[] = [];
    themeConfig.shapes.forEach((shapeConfig, index) => {
      const count = Math.min(shapeConfig.count, Math.ceil(limit / themeConfig.shapes.length));
      for (let i = 0; i < count; i++) {
        const size =
          shapeConfig.size === 'small'
            ? 5
            : shapeConfig.size === 'medium'
              ? 8
              : shapeConfig.size === 'large'
                ? 12
                : 10;
        list.push({
          id: `${shapeConfig.type}-${index}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          dx: (Math.random() - 0.5) * 0.025,
          dy: (Math.random() - 0.5) * 0.02,
          size: Math.max(4, size - 2),
          color: colorVar(shapeConfig.color),
          duration: 28 + Math.random() * 12,
          delay: -Math.random() * 14,
          blur: 0.6 + Math.random() * 0.5,
          opacity: 0.0008 + Math.random() * 0.0008
        });
      }
    });
    particles = list;
  }

  function animate(): void {
    if (!pointerTracking || prefersReducedMotion) return;
    particles = particles.map((p): Particle => {
      let { dx, dy } = p;
      let nx = p.x + dx;
      let ny = p.y + dy;
      if (nx < -4 || nx > 104) {
        dx = -dx;
        nx = Math.max(-4, Math.min(104, nx));
      }
      if (ny < -4 || ny > 104) {
        dy = -dy;
        ny = Math.max(-4, Math.min(104, ny));
      }
      return { ...p, x: nx, y: ny, dx, dy };
    });
    raf = requestAnimationFrame(animate);
  }

  function handlePointer(event: PointerEvent): void {
    if (!pointerTracking || typeof window === 'undefined') return;
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    pointerSpring.set({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }

  function handleLeave(): void {
    pointerSpring.set({ x: 0.5, y: 0.35 });
  }

  function syncScrollDepth(): void {
    if (typeof window === 'undefined') return;
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollSpring.set(Math.max(0, Math.min(1, window.scrollY / max)));
  }

  onMount(() => {
    mounted = true;

    const unsubscribeReduced = observePreference('(prefers-reduced-motion: reduce)', (matches) => {
      prefersReducedMotion = matches;
    });
    const unsubscribeContrast = observePreference('(prefers-contrast: more)', (matches) => {
      prefersHighContrast = matches;
    });
    const unsubscribeTransparency = observePreference('(prefers-reduced-transparency: reduce)', (matches) => {
      prefersLessTransparency = matches;
    });

    window.addEventListener('scroll', syncScrollDepth, { passive: true });
    syncScrollDepth();

    return () => {
      mounted = false;
      unsubscribeReduced();
      unsubscribeContrast();
      unsubscribeTransparency();
      disablePointerTracking();
      window.removeEventListener('scroll', syncScrollDepth);
    };
  });

  onDestroy(() => {
    unsubscribePointer();
    unsubscribeScroll();
  });
</script>

<div class="background" class:background--flat={flattenAmbient} aria-hidden="true" style={backgroundVars}>
  <div class="gradient"></div>
  <div class="wash"></div>
  <div class="flare"></div>
  <div class="veil"></div>
  <div class="film"></div>
  {#each particles as p (p.id)}
    <span
      class="dot"
      style="left:{p.x}%; top:{p.y}%; width:{p.size}px; height:{p.size}px; background:{p.color}; --duration:{p.duration}s; --delay:{p.delay}s; filter:blur({p.blur}px); opacity:{p.opacity}"
    ></span>
  {/each}
</div>

<style>
  .background {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: var(--z-background);
    overflow: hidden;
    display: grid;
    background: transparent;
    --gradient-filter: saturate(0.08) brightness(0.999);
    --gradient-opacity: 0.16;
    --wash-min: 0.0006;
    --wash-base: 0.0012;
    --wash-span: 0.004;
    --wash-max: 0.0024;
    --wash-blend: normal;
    --wash-filter: blur(18px) saturate(0.18);
    --flare-min: 0.0005;
    --flare-base: 0.001;
    --flare-span: 0.004;
    --flare-max: 0.0024;
    --flare-blend: screen;
    --flare-filter: blur(14px) saturate(0.18);
    --veil-color: rgba(12, 18, 30, 0.003);
    --veil-mix-mode: multiply;
    --veil-opacity-min: 0.001;
    --veil-opacity-max: 0.005;
    --veil-opacity-span: 0.008;
    --film-opacity-max: 0.003;
  }

  .gradient,
  .wash,
  .flare,
  .veil,
  .film {
    grid-area: 1 / 1;
  }

  .gradient {
    background: var(--route-gradient);
    opacity: var(--gradient-opacity);
    transition: background 2.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    filter: var(--gradient-filter);
  }

  .wash {
    background:
      radial-gradient(
        36% 38% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--theme-primary) 0.35%, transparent),
        transparent 74%
      ),
      radial-gradient(48% 48% at 18% 18%, color-mix(in srgb, var(--theme-secondary) 0.3%, transparent) 0%, transparent 78%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 99.85%, transparent) 0%, color-mix(in srgb, var(--bg) 99.85%, transparent) 100%);
    opacity: clamp(
      var(--wash-min),
      var(--wash-base) + var(--scroll-depth) * var(--wash-span),
      var(--wash-max)
    );
    filter: var(--wash-filter);
    mix-blend-mode: var(--wash-blend);
    transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1), transform 2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .flare {
    background:
      radial-gradient(32% 32% at 78% 22%, color-mix(in srgb, var(--theme-accent) 0.3%, transparent) 0%, transparent 78%),
      radial-gradient(38% 38% at 24% 84%, color-mix(in srgb, var(--theme-secondary) 0.25%, transparent) 0%, transparent 78%);
    opacity: clamp(
      var(--flare-min),
      var(--flare-base) + var(--scroll-depth) * var(--flare-span),
      var(--flare-max)
    );
    mix-blend-mode: var(--flare-blend);
    filter: var(--flare-filter);
    transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .veil {
    background: radial-gradient(120% 120% at 50% 20%, var(--veil-color), transparent 72%);
    mix-blend-mode: var(--veil-mix-mode);
    opacity: clamp(
      var(--veil-opacity-min),
      var(--veil-opacity-min) + var(--scroll-depth) * var(--veil-opacity-span),
      var(--veil-opacity-max)
    );
    transition: opacity 2.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .film {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--glass-bg-lightest) 70%, transparent 30%) 0%,
      transparent 100%
    );
    opacity: clamp(0.015, var(--route-film), var(--film-opacity-max));
    mix-blend-mode: normal;
    transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global([data-base-theme='dark']) .background {
    --gradient-filter: saturate(0.1) brightness(0.7);
    --gradient-opacity: 0.14;
    --wash-min: 0.0012;
    --wash-base: 0.0022;
    --wash-span: 0.006;
    --wash-max: 0.004;
    --wash-blend: screen;
    --flare-min: 0.0013;
    --flare-base: 0.0024;
    --flare-span: 0.006;
    --flare-max: 0.004;
    --veil-color: rgba(2, 4, 9, 0.015);
    --veil-mix-mode: lighten;
    --veil-opacity-min: 0.003;
    --veil-opacity-max: 0.009;
    --veil-opacity-span: 0.008;
    --film-opacity-max: 0.04;
  }

  :global([data-base-theme='dark']) .background .wash {
    background:
      radial-gradient(
        38% 40% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--theme-primary) 0.4%, transparent),
        transparent 76%
      ),
      radial-gradient(50% 46% at 18% 16%, color-mix(in srgb, var(--theme-secondary) 0.35%, transparent) 0%, transparent 80%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 99.6%, transparent) 0%, color-mix(in srgb, var(--bg) 99.6%, transparent) 100%);
  }

  :global([data-base-theme='dark']) .background .flare {
    background:
      radial-gradient(34% 34% at 78% 22%, color-mix(in srgb, var(--theme-accent) 0.32%, transparent) 0%, transparent 76%),
      radial-gradient(40% 40% at 24% 84%, color-mix(in srgb, var(--theme-secondary) 0.3%, transparent) 0%, transparent 78%);
  }

  :global(html[data-theme='hc']) .background,
  :global(html[data-theme='contrast']) .background,
  :global(html[data-theme-legacy='contrast']) .background {
    display: none;
  }

  .dot {
    position: absolute;
    border-radius: 50%;
    transform: translateZ(0);
    will-change: transform;
    mix-blend-mode: screen;
    animation: floaty var(--duration) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
    animation-delay: var(--delay);
  }

  :global([data-base-theme='dark']) .dot {
    mix-blend-mode: screen;
    opacity: 0.12;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .wash {
    background:
      radial-gradient(
        42% 42% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--accent-2) 32%, transparent),
        transparent 72%
      ),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 94%, transparent) 0%, color-mix(in srgb, var(--bg) 88%, transparent) 100%);
    opacity: clamp(0.12, 0.18 + var(--scroll-depth) * 0.16, 0.28);
    filter: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .flare {
    background:
      radial-gradient(42% 42% at 78% 22%, color-mix(in srgb, var(--accent-2) 34%, transparent) 0%, transparent 72%),
      radial-gradient(48% 48% at 24% 82%, color-mix(in srgb, var(--accent-1) 28%, transparent) 0%, transparent 74%);
    opacity: clamp(0.12, 0.18 + var(--scroll-depth) * 0.14, 0.26);
    mix-blend-mode: normal;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .dot {
    background: color-mix(in srgb, var(--accent-2) 70%, transparent) !important;
    mix-blend-mode: normal;
    opacity: 0.38 !important;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .veil {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .background, .background * {
      animation: none !important;
    }
    
    .dot {
      animation: none;
    }
  }



  @keyframes floaty {
    0% {
      transform: translate3d(-1px, -1.5px, 0) scale(0.98);
    }
    50% {
      transform: translate3d(1.5px, 2px, 0) scale(1.01);
    }
    100% {
      transform: translate3d(-1.5px, 1px, 0) scale(0.99);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gradient {
      transition-duration: 0.001ms;
    }
  }

  .background--flat {
    --gradient-opacity: 0.26;
    --gradient-filter: saturate(0.14) brightness(0.99);
    --wash-min: 0;
    --wash-base: 0;
    --wash-span: 0;
    --wash-max: 0;
    --flare-min: 0;
    --flare-base: 0;
    --flare-span: 0;
    --flare-max: 0;
    --veil-opacity-min: 0;
    --veil-opacity-max: 0;
    --veil-opacity-span: 0;
    --film-opacity-max: 0.004;
  }

  .background--flat .gradient {
    animation: none;
    transition: background 0.4s ease;
  }

  .background--flat :is(.wash, .flare, .veil, .dot) {
    display: none;
  }

  @media (prefers-contrast: more), (prefers-reduced-transparency: reduce) {
    .background {
      display: none;
    }
  }
</style>
