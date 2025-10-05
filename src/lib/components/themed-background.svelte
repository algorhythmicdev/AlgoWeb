<script>
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { page } from '$app/stores';
  import { getThemeForPath } from '$config/background-themes';

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
          dx: (Math.random() - 0.5) * 0.1,
          dy: (Math.random() - 0.5) * 0.08,
          size,
          color: colorVar(shapeConfig.color),
          duration: 12 + Math.random() * 12,
          delay: -Math.random() * 12,
          blur: 0.5 + Math.random() * 1.5,
          opacity: 0.04 + Math.random() * 0.04,
          layer: Math.floor(Math.random() * 3) + 1
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

<div class="background" aria-hidden="true" style={backgroundVars}>
  <div class="wash"></div>
  <div class="halo"></div>
  <div class="mesh"></div>
  <div class="ribbons" aria-hidden="true">
    <span class="ribbon ribbon-a"></span>
    <span class="ribbon ribbon-b"></span>
    <span class="ribbon ribbon-c"></span>
  </div>
  <div class="grain"></div>
  {#each particles as p (p.id)}
    <span
      class="dot"
      style="left:{p.x}%; top:{p.y}%; width:{p.size}px; height:{p.size}px; background:{p.color}; --duration:{p.duration}s; --delay:{p.delay}s; filter:blur({p.blur}px); opacity:{p.opacity}; --layer:{p.layer}"
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
    --pointer-x: 0.5;
    --pointer-y: 0.35;
    --scroll-depth: 0;
    --pointer-offset-x: calc((var(--pointer-x) - 0.5) * 24%);
    --pointer-offset-y: calc((var(--pointer-y) - 0.4) * 28%);
  }

  .wash,
  .halo,
  .mesh,
  .ribbons,
  .grain {
    grid-area: 1 / 1;
    transition: opacity var(--duration-slower) var(--ease-out);
  }

  .wash {
    background:
      radial-gradient(
        42% 50% at calc(var(--pointer-x) * 100%) calc(var(--pointer-y) * 95%),
        color-mix(in srgb, var(--voyage-blue) 22%, transparent) 0%,
        transparent 70%
      ),
      radial-gradient(36% 48% at calc((1 - var(--pointer-x)) * 100%) calc((var(--pointer-y) + var(--scroll-depth) * 0.35) * 80%),
        color-mix(in srgb, var(--aurora-purple) 18%, transparent) 0%,
        transparent 75%
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 55%);
    opacity: calc(0.45 + var(--scroll-depth) * 0.35);
    transform: translate3d(calc(var(--pointer-offset-x) * 0.3), calc(var(--pointer-offset-y) * 0.25), 0);
  }

  .halo {
    background:
      radial-gradient(80% 80% at 50% 10%, rgba(255, 255, 255, 0.22), transparent 70%),
      radial-gradient(80% 65% at 50% 90%, rgba(19, 81, 255, 0.2), transparent 65%);
    opacity: calc(0.35 + var(--scroll-depth) * 0.25);
    transform: translate3d(calc(var(--pointer-offset-x) * -0.25), calc(var(--pointer-offset-y) * -0.2), 0);
  }

  .mesh {
    background-image:
      radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, transparent 65%),
      linear-gradient(120deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
      repeating-linear-gradient(
        120deg,
        rgba(255, 255, 255, 0.05) 0px,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px,
        transparent 14px
      );
    mix-blend-mode: screen;
    opacity: calc(0.18 + var(--scroll-depth) * 0.22);
    transform: translate3d(calc(var(--pointer-offset-x) * 0.6), calc(var(--pointer-offset-y) * 0.5), 0);
  }

  .ribbons {
    position: relative;
    display: grid;
    mix-blend-mode: screen;
    opacity: clamp(0.12, 0.08 + var(--scroll-depth) * 0.28, 0.38);
  }

  .ribbon {
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 90% at 50% 50%, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.08) 52%, transparent
        76%),
      linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 35%, transparent) 0%, transparent 65%);
    filter: blur(0.6px);
    animation: ribbonShift 18s ease-in-out infinite;
    transform: translate3d(0, 0, 0);
  }

  .ribbon-b {
    background: radial-gradient(110% 100% at 45% 55%, transparent 0%, transparent 28%, rgba(255, 255, 255, 0.1) 48%, transparent
        70%),
      linear-gradient(165deg, color-mix(in srgb, var(--theme-secondary) 38%, transparent) 0%, transparent 60%);
    animation-duration: 22s;
    animation-delay: -6s;
    transform: translate3d(calc(var(--pointer-offset-x) * 0.5), calc(var(--pointer-offset-y) * -0.35), 0);
  }

  .ribbon-c {
    background: radial-gradient(160% 120% at 60% 40%, transparent 0%, transparent 35%, rgba(255, 255, 255, 0.08) 52%, transparent
        75%),
      linear-gradient(200deg, color-mix(in srgb, var(--theme-accent) 45%, transparent) 0%, transparent 70%);
    animation-duration: 26s;
    animation-delay: -12s;
    transform: translate3d(calc(var(--pointer-offset-x) * -0.45), calc(var(--pointer-offset-y) * 0.4), 0);
  }

  .grain {
    opacity: 0.16;
    background-image: radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0);
    background-size: 3px 3px;
    mix-blend-mode: soft-light;
    transform: translate3d(calc(var(--pointer-offset-x) * 0.25), calc(var(--pointer-offset-y) * -0.18), 0);
  }

  .dot {
    position: absolute;
    border-radius: 50%;
    transform: translate3d(
        calc(var(--pointer-offset-x) * (var(--layer) * 0.35 + 0.2)),
        calc(var(--pointer-offset-y) * (var(--layer) * 0.3 + 0.18)),
        0
      );
    will-change: transform;
    mix-blend-mode: screen;
    animation: floaty var(--duration) ease-in-out infinite alternate;
    animation-delay: var(--delay);
  }

  @media (prefers-reduced-motion: reduce) {
    .wash,
    .halo,
    .mesh,
    .ribbons,
    .grain {
      transform: none;
      transition: none;
    }

    .dot {
      animation: none;
      transform: none;
    }

    .ribbon {
      animation: none;
    }
  }

  @keyframes ribbonShift {
    0% {
      transform: translate3d(calc(var(--pointer-offset-x) * -0.2), calc(var(--pointer-offset-y) * -0.15), 0) rotate(0deg)
        scale(1);
    }
    50% {
      transform: translate3d(calc(var(--pointer-offset-x) * 0.4), calc(var(--pointer-offset-y) * 0.25), 0) rotate(6deg)
        scale(1.06);
    }
    100% {
      transform: translate3d(calc(var(--pointer-offset-x) * -0.25), calc(var(--pointer-offset-y) * 0.18), 0) rotate(-4deg)
        scale(1.02);
    }
  }

  @keyframes floaty {
    0% {
      transform: translate3d(-4px, -6px, 0) scale(0.92);
    }
    50% {
      transform: translate3d(6px, 8px, 0) scale(1.06);
    }
    100% {
      transform: translate3d(-6px, 4px, 0) scale(0.98);
    }
  }
</style>
