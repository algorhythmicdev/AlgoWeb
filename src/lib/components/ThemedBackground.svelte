<script>
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { page } from '$app/stores';
  import { getThemeForPath } from '$config/backgroundThemes';

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let particles = [];
  const basePalette = ['voyage-blue', 'aurora-purple', 'signal-yellow'];

  const pointerSpring = spring({ x: 0.5, y: 0.35 }, { stiffness: 0.12, damping: 0.35, precision: 0.001 });
  const scrollSpring = spring(0, { stiffness: 0.08, damping: 0.4, precision: 0.0001 });

  let pointerCoords = { x: 0.5, y: 0.35 };
  let scrollDepth = 0;

  const unsubscribePointer = pointerSpring.subscribe((value) => (pointerCoords = value));
  const unsubscribeScroll = scrollSpring.subscribe((value) => (scrollDepth = value));

  $: paletteNames = theme?.palette ?? basePalette;
  const paletteFallback = ['var(--voyage-blue)', 'var(--aurora-purple)', 'var(--signal-yellow)'];
  $: paletteColors = paletteNames.map((name, index) => colorVar(name, index));
  $: [primaryColor, secondaryColor, accentColor] = [
    paletteColors[0] ?? paletteFallback[0],
    paletteColors[1] ?? paletteFallback[1],
    paletteColors[2] ?? paletteFallback[2]
  ];

  $: backgroundVars =
    `--pointer-x:${pointerCoords.x}; --pointer-y:${pointerCoords.y}; --scroll-depth:${scrollDepth}; --theme-primary:${primaryColor}; --theme-secondary:${secondaryColor}; --theme-accent:${accentColor};`;

  $: theme = getThemeForPath($page.url.pathname);
  $: if (theme) initParticles(theme);

  function colorVar(name, index = 0) {
    if (name === 'voyage-blue') return 'var(--voyage-blue)';
    if (name === 'aurora-purple') return 'var(--aurora-purple)';
    if (name === 'signal-yellow') return 'var(--signal-yellow)';
    if (name === 'cherry-red') return 'var(--cherry-red)';
    // provide subtle variation when palette item missing
    const fallback = ['var(--voyage-blue)', 'var(--aurora-purple)', 'var(--signal-yellow)'];
    return fallback[index % fallback.length];
  }

  function initParticles(themeConfig) {
    const total = themeConfig.shapes.reduce((sum, s) => sum + s.count, 0);
    const limit = Math.min(total, prefersReducedMotion ? 18 : 54);
    const list = [];
    themeConfig.shapes.forEach((shapeConfig, index) => {
      const count = Math.min(shapeConfig.count, Math.ceil(limit / themeConfig.shapes.length));
      for (let i = 0; i < count; i++) {
        const size = shapeConfig.size === 'small' ? 7 : shapeConfig.size === 'medium' ? 12 : 18;
        list.push({
          id: `${shapeConfig.type}-${index}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          dx: (Math.random() - 0.5) * 0.18,
          dy: (Math.random() - 0.5) * 0.14,
          size,
          color: colorVar(shapeConfig.color),
          duration: 12 + Math.random() * 10,
          delay: -Math.random() * 8,
          blur: 0.5 + Math.random() * 1.5,
          opacity: 0.085 + Math.random() * 0.055
        });
      }
    });
    particles = list;
  }

  let raf;
  function animate() {
    if (prefersReducedMotion) return;
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
    if (prefersReducedMotion || typeof window === 'undefined') return;
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
    if (!prefersReducedMotion) {
      window.addEventListener('pointermove', handlePointer);
      window.addEventListener('pointerleave', handleLeave);
      raf = requestAnimationFrame(animate);
    }
    window.addEventListener('scroll', syncScrollDepth, { passive: true });
    syncScrollDepth();

    return () => {
      if (!prefersReducedMotion) {
        window.removeEventListener('pointermove', handlePointer);
        window.removeEventListener('pointerleave', handleLeave);
        cancelAnimationFrame(raf);
      }
      window.removeEventListener('scroll', syncScrollDepth);
    };
  });

  onDestroy(() => {
    unsubscribePointer();
    unsubscribeScroll();
  });
</script>

<div class="background" aria-hidden="true">
  <div class="wash"></div>
  <div class="flare"></div>
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
  }

  .wash,
  .flare {
    grid-area: 1 / 1;
  }

  .wash {
    background:
      radial-gradient(
        40% 40% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--theme-primary) 40%, transparent),
        transparent 70%
      ),
      radial-gradient(56% 52% at 16% 12%, color-mix(in srgb, var(--theme-secondary) 24%, transparent) 0%, transparent 72%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.05) 60%);
    opacity: 0.82;
    filter: saturate(1.1);
  }

  .flare {
    background:
      radial-gradient(38% 38% at 78% 20%, color-mix(in srgb, var(--theme-secondary) 28%, transparent) 0%, transparent 70%),
      radial-gradient(46% 46% at 24% 86%, color-mix(in srgb, var(--theme-accent) 20%, transparent) 0%, transparent 74%);
    opacity: calc(0.25 + var(--scroll-depth) * 0.45);
    mix-blend-mode: screen;
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

  :global([data-theme='dark']) .wash {
    background:
      radial-gradient(
        44% 44% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 100%),
        color-mix(in srgb, var(--theme-primary) 55%, transparent),
        transparent 74%
      ),
      radial-gradient(54% 50% at 18% 16%, color-mix(in srgb, var(--theme-secondary) 38%, transparent) 0%, transparent 72%),
      linear-gradient(180deg, rgba(5, 9, 24, 0.94) 0%, rgba(3, 7, 20, 0.88) 50%, rgba(2, 4, 15, 0.86) 100%);
    opacity: 0.76;
  }

  :global([data-theme='dark']) .flare {
    opacity: calc(0.32 + var(--scroll-depth) * 0.48);
    mix-blend-mode: lighten;
  }

  :global([data-theme='dark']) .dot {
    mix-blend-mode: screen;
    opacity: 0.55;
  }

  @media (prefers-reduced-motion: reduce) {
    .dot { animation: none; }
  }

  @keyframes floaty {
    0% { transform: translate3d(-4px, -6px, 0) scale(0.95); }
    50% { transform: translate3d(6px, 8px, 0) scale(1.05); }
    100% { transform: translate3d(-6px, 4px, 0) scale(0.98); }
  }
</style>
