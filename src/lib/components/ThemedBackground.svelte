<script>
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { page } from '$app/stores';
  import { getThemeForPath } from '$config/backgroundThemes';
  import { theme as themeStore } from '$stores/theme';

  let prefersReducedMotion = false;
  let prefersHighContrast = false;
  let prefersLessTransparency = false;
  let flattenAmbient = false;
  let mounted = false;
  let pointerTracking = false;

  let particles = [];
  const basePalette = ['voyage-blue', 'aurora-purple', 'signal-yellow'];
  const fallbackGradient =
    'radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--bg) 99.92%, rgba(var(--voyage-blue-rgb), 0.006) 0.08%) 0%, color-mix(in srgb, var(--bg-elev-1, var(--bg)) 99.92%, rgba(var(--aurora-purple-rgb), 0.006) 0.08%) 42%, var(--bg) 100%)';
  const fallbackGrainOpacity = 0.0025;

  const pointerSpring = spring({ x: 0.5, y: 0.35 }, { stiffness: 0.12, damping: 0.35, precision: 0.001 });
  const scrollSpring = spring(0, { stiffness: 0.08, damping: 0.4, precision: 0.0001 });

  let pointerCoords = { x: 0.5, y: 0.35 };
  let scrollDepth = 0;

  const unsubscribePointer = pointerSpring.subscribe((value) => (pointerCoords = value));
  const unsubscribeScroll = scrollSpring.subscribe((value) => (scrollDepth = value));

  function observePreference(query, setter) {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setter(false);
      return () => {};
    }

    const mediaQuery = window.matchMedia(query);
    const apply = (value) => setter(Boolean(value));
    const handleChange = (event) => apply(event.matches);

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

  function enablePointerTracking() {
    if (!mounted || pointerTracking || typeof window === 'undefined' || prefersReducedMotion || flattenAmbient) {
      return;
    }

    pointerTracking = true;
    handleLeave();
    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('pointerleave', handleLeave);
    raf = requestAnimationFrame(animate);
  }

  function disablePointerTracking() {
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
  $: routeGrainOpacity = typeof theme?.grainOpacity === 'number' ? theme.grainOpacity : fallbackGrainOpacity;
  function buildLayerVars(layerOverrides = {}) {
    const list = [];
    const add = (key, value) => {
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

  function joinVars(values) {
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
    `--route-grain:${routeGrainOpacity}`
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

  function colorVar(name, index = 0) {
    if (name === 'voyage-blue') return 'var(--voyage-blue)';
    if (name === 'aurora-purple') return 'var(--aurora-purple)';
    if (name === 'signal-yellow') return 'var(--signal-yellow)';
    if (name === 'cherry-red' || name === 'cherry-pop') return 'var(--cherry-pop)';
    // provide subtle variation when palette item missing
    const fallback = ['var(--voyage-blue)', 'var(--aurora-purple)', 'var(--signal-yellow)'];
    return fallback[index % fallback.length];
  }

  function initParticles(themeConfig, options = {}) {
    const { flatten = flattenAmbient, reduced = prefersReducedMotion } = options;

    if (flatten) {
      particles = [];
      return;
    }
    const total = themeConfig.shapes.reduce((sum, s) => sum + s.count, 0);
    const limit = Math.min(total, reduced ? 6 : 12);
    const list = [];
    themeConfig.shapes.forEach((shapeConfig, index) => {
      const count = Math.min(shapeConfig.count, Math.ceil(limit / themeConfig.shapes.length));
      for (let i = 0; i < count; i++) {
        const size = shapeConfig.size === 'small' ? 5 : shapeConfig.size === 'medium' ? 8 : 12;
        list.push({
          id: `${shapeConfig.type}-${index}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          dx: (Math.random() - 0.5) * 0.05,
          dy: (Math.random() - 0.5) * 0.04,
          size: Math.max(4, size - 2),
          color: colorVar(shapeConfig.color),
          duration: 18 + Math.random() * 6,
          delay: -Math.random() * 8,
          blur: 0.4 + Math.random() * 0.3,
          opacity: 0.0015 + Math.random() * 0.0015
        });
      }
    });
    particles = list;
  }

  let raf;
  function animate() {
    if (!pointerTracking || prefersReducedMotion) return;
    particles = particles.map((p) => {
      let nx = p.x + p.dx;
      let ny = p.y + p.dy;
      if (nx < -4 || nx > 104) p.dx = -p.dx, nx = Math.max(-4, Math.min(104, nx));
      if (ny < -4 || ny > 104) p.dy = -p.dy, ny = Math.max(-4, Math.min(104, ny));
      return { ...p, x: nx, y: ny };
    });
    raf = requestAnimationFrame(animate);
  }

  function handlePointer(event) {
    if (!pointerTracking || typeof window === 'undefined') return;
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;
    pointerSpring.set({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }

  function handleLeave() {
    pointerSpring.set({ x: 0.5, y: 0.35 });
  }

  function syncScrollDepth() {
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
    z-index: var(--z-background, -20);
    overflow: hidden;
    display: grid;
    background: transparent;
    --gradient-filter: saturate(0.1) brightness(0.998);
    --gradient-opacity: 0.24;
    --wash-min: 0.0012;
    --wash-base: 0.0024;
    --wash-span: 0.0075;
    --wash-max: 0.0048;
    --wash-blend: normal;
    --wash-filter: blur(12px) saturate(0.24);
    --flare-min: 0.001;
    --flare-base: 0.0021;
    --flare-span: 0.0075;
    --flare-max: 0.0048;
    --flare-blend: screen;
    --flare-filter: blur(9px) saturate(0.24);
    --veil-color: rgba(12, 18, 30, 0.006);
    --veil-mix-mode: multiply;
    --veil-opacity-min: 0.002;
    --veil-opacity-max: 0.009;
    --veil-opacity-span: 0.012;
    --film-opacity-max: 0.0045;
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
    opacity: var(--gradient-opacity, 1);
    transition: background 1.6s ease, opacity 1s ease;
    filter: var(--gradient-filter, saturate(0.72) brightness(0.92));
  }

  .wash {
    background:
      radial-gradient(
        36% 38% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--theme-primary) 0.6%, transparent),
        transparent 74%
      ),
      radial-gradient(48% 48% at 18% 18%, color-mix(in srgb, var(--theme-secondary) 0.6%, transparent) 0%, transparent 78%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 99.75%, transparent) 0%, color-mix(in srgb, var(--bg) 99.75%, transparent) 100%);
    opacity: clamp(
      var(--wash-min, 0.0012),
      var(--wash-base, 0.0024) + var(--scroll-depth) * var(--wash-span, 0.0075),
      var(--wash-max, 0.0048)
    );
    filter: var(--wash-filter, blur(12px) saturate(0.24));
    mix-blend-mode: var(--wash-blend, normal);
    transition: opacity 1.2s ease, transform 1.2s ease;
  }

  .flare {
    background:
      radial-gradient(32% 32% at 78% 22%, color-mix(in srgb, var(--theme-accent) 0.6%, transparent) 0%, transparent 78%),
      radial-gradient(38% 38% at 24% 84%, color-mix(in srgb, var(--theme-secondary) 0.55%, transparent) 0%, transparent 78%);
    opacity: clamp(
      var(--flare-min, 0.001),
      var(--flare-base, 0.0021) + var(--scroll-depth) * var(--flare-span, 0.0075),
      var(--flare-max, 0.0048)
    );
    mix-blend-mode: var(--flare-blend, screen);
    filter: var(--flare-filter, blur(12px) saturate(0.46));
  }

  .veil {
    background: radial-gradient(120% 120% at 50% 20%, var(--veil-color), transparent 72%);
    mix-blend-mode: var(--veil-mix-mode);
    opacity: clamp(
      var(--veil-opacity-min),
      var(--veil-opacity-min) + var(--scroll-depth) * var(--veil-opacity-span, 0.1),
      var(--veil-opacity-max)
    );
  }

  .film {
    background-image: var(--grain, var(--grain-texture));
    opacity: clamp(0.0015, var(--route-grain, 0.0045), var(--film-opacity-max, 0.007));
    mix-blend-mode: soft-light;
  }

  :global([data-base-theme='dark']) .background {
    --gradient-filter: saturate(0.14) brightness(0.66);
    --gradient-opacity: 0.22;
    --wash-min: 0.0025;
    --wash-base: 0.0045;
    --wash-span: 0.011;
    --wash-max: 0.0075;
    --wash-blend: screen;
    --flare-min: 0.0026;
    --flare-base: 0.0048;
    --flare-span: 0.011;
    --flare-max: 0.0078;
    --veil-color: rgba(2, 4, 9, 0.026);
    --veil-mix-mode: lighten;
    --veil-opacity-min: 0.0055;
    --veil-opacity-max: 0.016;
    --veil-opacity-span: 0.014;
    --film-opacity-max: 0.006;
  }

  :global([data-base-theme='dark']) .background .wash {
    background:
      radial-gradient(
        38% 40% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--theme-primary) 0.8%, transparent),
        transparent 76%
      ),
      radial-gradient(50% 46% at 18% 16%, color-mix(in srgb, var(--theme-secondary) 0.7%, transparent) 0%, transparent 80%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 99.2%, transparent) 0%, color-mix(in srgb, var(--bg) 99.2%, transparent) 100%);
  }

  :global([data-base-theme='dark']) .background .flare {
    background:
      radial-gradient(34% 34% at 78% 22%, color-mix(in srgb, var(--theme-accent) 0.65%, transparent) 0%, transparent 76%),
      radial-gradient(40% 40% at 24% 84%, color-mix(in srgb, var(--theme-secondary) 0.6%, transparent) 0%, transparent 78%);
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
    animation: floaty var(--duration) ease-in-out infinite alternate;
    animation-delay: var(--delay);
  }

  :global([data-base-theme='dark']) .dot {
    mix-blend-mode: screen;
    opacity: 0.2;
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
    .dot {
      animation: none;
    }
  }



  @keyframes floaty {
    0% {
      transform: translate3d(-2px, -3px, 0) scale(0.97);
    }
    50% {
      transform: translate3d(3px, 4px, 0) scale(1.02);
    }
    100% {
      transform: translate3d(-3px, 2px, 0) scale(0.99);
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
