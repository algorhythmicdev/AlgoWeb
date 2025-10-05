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
        const size = shapeConfig.size === 'small' ? 5 : shapeConfig.size === 'medium' ? 9 : 14;
        list.push({
          id: `${shapeConfig.type}-${index}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          dx: (Math.random() - 0.5) * 0.12,
          dy: (Math.random() - 0.5) * 0.1,
          size,
          color: colorVar(shapeConfig.color),
          duration: 12 + Math.random() * 10,
          delay: -Math.random() * 8,
          blur: 0.5 + Math.random() * 1.5,
          opacity: 0.045 + Math.random() * 0.035
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

  function handleScroll() {
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (!prefersReducedMotion) {
        window.removeEventListener('pointermove', handlePointer);
        window.removeEventListener('pointerleave', handleLeave);
        cancelAnimationFrame(raf);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  });

  onDestroy(() => {
    unsubscribePointer();
    unsubscribeScroll();
  });
</script>

<div class="background" aria-hidden="true">
  <div class="wash"></div>
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

  .wash {
    grid-area: 1 / 1;
    background:
      radial-gradient(50% 60% at 20% 15%, rgba(255, 255, 255, 0.55), transparent 70%),
      radial-gradient(45% 50% at 80% 12%, rgba(19, 81, 255, 0.22), transparent 65%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 55%);
    opacity: 0.6;
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

  @media (prefers-reduced-motion: reduce) {
    .dot { animation: none; }
  }

  @keyframes floaty {
    0% { transform: translate3d(-4px, -6px, 0) scale(0.95); }
    50% { transform: translate3d(6px, 8px, 0) scale(1.05); }
    100% { transform: translate3d(-6px, 4px, 0) scale(0.98); }
  }
</style>
