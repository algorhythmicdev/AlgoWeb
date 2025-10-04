<script>
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
          dx: (Math.random() - 0.5) * 0.15,
          dy: (Math.random() - 0.5) * 0.12,
          size,
          color: colorVar(shapeConfig.color)
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
  {#each particles as p (p.id)}
    <span class="dot" style="left:{p.x}%; top:{p.y}%; width:{p.size}px; height:{p.size}px; background:{p.color}"></span>
  {/each}
</div>

<style>
  .background {
    position: fixed;
    inset: 0;
    z-index: var(--z-background);
    pointer-events: none;
    overflow: hidden;
  }

  .dot {
    position: absolute;
    border-radius: 50%;
    opacity: 0.12;
    transform: translateZ(0);
    will-change: transform;
    box-shadow: 0 0 10px rgba(var(--voyage-blue-rgb), 0.06);
  }

  @media (prefers-reduced-motion: reduce) {
    .dot { opacity: 0.08; }
  }
</style>
