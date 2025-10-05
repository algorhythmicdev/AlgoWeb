<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getThemeForPath } from '$config/backgroundThemes';

  // Respect reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Particle field using CSS transforms only, minimal DOM nodes
  let particles = [];

  $: theme = getThemeForPath($page.url.pathname);
  $: if (theme) initParticles(theme);

  function colorVar(name) {
    if (name === 'voyage-blue') return 'var(--voyage-blue)';
    if (name === 'aurora-purple') return 'var(--aurora-purple)';
    if (name === 'signal-yellow') return 'var(--signal-yellow)';
    return 'var(--voyage-blue)';
  }

  function initParticles(themeConfig) {
    const total = themeConfig.shapes.reduce((sum, s) => sum + s.count, 0);
    const limit = Math.min(total, prefersReducedMotion ? 18 : 48);
    const list = [];
    themeConfig.shapes.forEach((shapeConfig) => {
      const count = Math.min(shapeConfig.count, Math.ceil(limit / themeConfig.shapes.length));
      for (let i = 0; i < count; i++) {
        const size = shapeConfig.size === 'small' ? 6 : shapeConfig.size === 'medium' ? 10 : 14;
        list.push({
          id: `${shapeConfig.type}-${i}`,
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
      if (nx < -2 || nx > 102) p.dx = -p.dx, nx = Math.max(-2, Math.min(102, nx));
      if (ny < -2 || ny > 102) p.dy = -p.dy, ny = Math.max(-2, Math.min(102, ny));
      return { ...p, x: nx, y: ny };
    });
    raf = requestAnimationFrame(animate);
  }

  onMount(() => {
    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(raf);
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
