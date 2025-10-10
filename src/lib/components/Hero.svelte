<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy, afterUpdate } from 'svelte';

  export let variant: 'aurora' | 'halo' | 'nodes' | 'grid' | 'line' | 'particles' = 'aurora';
  export let title = 'Algo Hero — Big, modern, animated';
  export let subtitle = 'Single gradient logic + page-to-page variants.';

  let prefersReduced = false;
  let theme: 'light' | 'dark' | 'hc' = 'light';
  let auroraCanvas: HTMLCanvasElement | null = null;
  let nodesCanvas: HTMLCanvasElement | null = null;

  function readTheme() {
    if (!browser) return;
    const t = document.documentElement.getAttribute('data-theme');
    theme = t === 'dark' || t === 'hc' ? t : 'light';
  }

  let auroraRAF: number | null = null;
  let auroraResize: (() => void) | null = null;
  let nodesRAF: number | null = null;
  let nodesResize: (() => void) | null = null;

  const rgba = (hex: string, alpha = 1) => {
    const normalized = hex.replace('#', '');
    const value = parseInt(normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const mix = (a: string, b: string, t: number) => {
    const channel = (hex: string) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ];
    const [r1, g1, b1] = channel(a);
    const [r2, g2, b2] = channel(b);
    const red = Math.round(r1 + (r2 - r1) * t);
    const green = Math.round(g1 + (g2 - g1) * t);
    const blue = Math.round(b1 + (b2 - b1) * t);
    return `rgba(${red},${green},${blue},${0.6})`;
  };

  function stopAurora() {
    if (!browser) return;
    if (auroraRAF) {
      cancelAnimationFrame(auroraRAF);
      auroraRAF = null;
    }
    if (auroraResize) {
      window.removeEventListener('resize', auroraResize);
      auroraResize = null;
    }
    if (auroraCanvas) {
      const ctx = auroraCanvas.getContext('2d');
      ctx?.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);
    }
  }

  function startAurora() {
    if (!browser || !auroraCanvas || auroraRAF || prefersReduced || theme === 'hc' || variant !== 'aurora') {
      return;
    }

    const canvas = auroraCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const style = () => getComputedStyle(document.documentElement);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let time = 0;
    resize();

    const loop = () => {
      if (prefersReduced || variant !== 'aurora' || theme === 'hc' || !auroraCanvas) {
        stopAurora();
        return;
      }

      const { clientWidth: width, clientHeight: height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const colorA = style().getPropertyValue('--grad-a').trim();
      const colorB = style().getPropertyValue('--grad-b').trim();

      for (let i = 0; i < 3; i += 1) {
        const x = width * (0.3 + 0.4 * Math.sin(time / 7000 + i * 2));
        const y = height * (0.3 + 0.4 * Math.cos(time / 6000 + i * 1.7));
        const radius = Math.max(width, height) * 0.45;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, rgba(i % 2 ? colorA : colorB, 0.24));
        gradient.addColorStop(1, rgba(i % 2 ? colorB : colorA, 0));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      time += 16;
      auroraRAF = requestAnimationFrame(loop);
    };

    auroraResize = resize;
    window.addEventListener('resize', resize, { passive: true });
    auroraRAF = requestAnimationFrame(loop);
  }

  let nodesPoints: Array<{ x: number; y: number; vx: number; vy: number }> = [];

  function stopNodes() {
    if (!browser) return;
    if (nodesRAF) {
      cancelAnimationFrame(nodesRAF);
      nodesRAF = null;
    }
    if (nodesResize) {
      window.removeEventListener('resize', nodesResize);
      nodesResize = null;
    }
    if (nodesCanvas) {
      const ctx = nodesCanvas.getContext('2d');
      ctx?.clearRect(0, 0, nodesCanvas.width, nodesCanvas.height);
    }
  }

  function startNodes() {
    if (!browser || !nodesCanvas || nodesRAF || prefersReduced || theme === 'hc' || variant !== 'nodes') {
      return;
    }

    const canvas = nodesCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const style = () => getComputedStyle(document.documentElement);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(8, Math.floor((clientWidth * clientHeight) / 28000));
      nodesPoints = Array.from({ length: count }, () => ({
        x: Math.random() * clientWidth,
        y: Math.random() * clientHeight,
        vx: (Math.random() * 2 - 1) * 0.2,
        vy: (Math.random() * 2 - 1) * 0.2
      }));
    };

    resize();

    const loop = () => {
      if (prefersReduced || variant !== 'nodes' || theme === 'hc' || !nodesCanvas) {
        stopNodes();
        return;
      }

      const { clientWidth: width, clientHeight: height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const colorA = style().getPropertyValue('--grad-a').trim();
      const colorB = style().getPropertyValue('--grad-b').trim();

      for (const point of nodesPoints) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
      }

      for (let i = 0; i < nodesPoints.length; i += 1) {
        for (let j = i + 1; j < nodesPoints.length; j += 1) {
          const dx = nodesPoints[i].x - nodesPoints[j].x;
          const dy = nodesPoints[i].y - nodesPoints[j].y;
          const distance2 = dx * dx + dy * dy;
          const maxDistance = 150 * 150;
          if (distance2 < maxDistance) {
            const alpha = 1 - Math.sqrt(distance2) / 150;
            ctx.strokeStyle = mix(colorA, colorB, alpha * 0.5);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodesPoints[i].x, nodesPoints[i].y);
            ctx.lineTo(nodesPoints[j].x, nodesPoints[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = rgba(colorA, 0.9);
      for (const point of nodesPoints) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      nodesRAF = requestAnimationFrame(loop);
    };

    nodesResize = resize;
    window.addEventListener('resize', resize, { passive: true });
    nodesRAF = requestAnimationFrame(loop);
  }

  function updateCanvases() {
    if (!browser) return;
    readTheme();
    const highContrast = theme === 'hc';
    const enableAurora = !prefersReduced && !highContrast && variant === 'aurora';
    const enableNodes = !prefersReduced && !highContrast && variant === 'nodes';
    if (enableAurora) startAurora();
    else stopAurora();
    if (enableNodes) startNodes();
    else stopNodes();
  }

  let mounted = false;
  let cleanupObserver: MutationObserver | null = null;
  let mediaQuery: MediaQueryList | null = null;
  let handlePreference: ((event: MediaQueryListEvent) => void) | null = null;

  onMount(() => {
    if (!browser) return;
    mounted = true;
    readTheme();
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced = mediaQuery.matches;
    handlePreference = (event: MediaQueryListEvent) => {
      prefersReduced = event.matches;
      updateCanvases();
    };
    mediaQuery.addEventListener('change', handlePreference);

    cleanupObserver = new MutationObserver(() => {
      updateCanvases();
    });
    cleanupObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    updateCanvases();

    return () => {
      if (handlePreference) {
        mediaQuery?.removeEventListener('change', handlePreference);
      }
    };
  });

  afterUpdate(() => {
    if (mounted) updateCanvases();
  });

  onDestroy(() => {
    mounted = false;
    cleanupObserver?.disconnect();
    if (handlePreference) {
      mediaQuery?.removeEventListener('change', handlePreference);
      handlePreference = null;
    }
    mediaQuery = null;
    stopAurora();
    stopNodes();
  });
</script>

<style>
  .hero {
    position: relative;
    border-radius: var(--radius);
    overflow: clip;
    padding: clamp(24px, 5vw, 56px);
    background: var(--bg-elev-1);
    color: var(--text);
    box-shadow: var(--shadow-1);
    isolation: isolate;
  }
  .content {
    position: relative;
    z-index: 1;
    max-width: 72ch;
  }
  .hero__title {
    margin: 0 0 12px;
    font-weight: var(--weight-black, 800);
    line-height: 1.08;
  }
  .hero__subtitle {
    margin: 0 0 18px;
    color: var(--muted);
  }

  /* Gradient bar (accessible: behind solid text) */
  .gradbar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: clamp(10px, 3.2vw, 18px);
    background: var(--grad);
    opacity: 0.9;
    animation: bar-pan var(--bar-speed, var(--slow)) ease-in-out infinite alternate;
    z-index: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .gradbar {
      animation: none;
    }
  }

  /* Variant: HALO */
  .hero.a-halo::before,
  .hero.a-halo::after {
    content: '';
    position: absolute;
    inset: -10%;
    background: radial-gradient(
        600px 600px at 15% 20%,
        color-mix(in oklab, var(--grad-b) 60%, transparent) 0%,
        transparent 60%
      ),
      radial-gradient(
        700px 700px at 85% 60%,
        color-mix(in oklab, var(--grad-a) 55%, transparent) 0%,
        transparent 65%
      );
    z-index: 0;
    mix-blend-mode: screen;
    opacity: 0.55;
    animation: halo-move var(--med) ease-in-out infinite alternate;
  }
  :global(html[data-theme='dark'] .hero.a-halo)::before,
  :global(html[data-theme='dark'] .hero.a-halo)::after {
    mix-blend-mode: lighten;
  }
  :global(html[data-theme='hc'] .hero.a-halo)::before,
  :global(html[data-theme='hc'] .hero.a-halo)::after {
    display: none;
  }

  /* Variant: GRID RIPPLE */
  .hero.a-grid {
    background: linear-gradient(
      0deg,
      color-mix(in oklab, var(--bg-elev-1) 92%, var(--grad-a) 8%),
      color-mix(in oklab, var(--bg-elev-1) 92%, var(--grad-b) 8%)
    );
  }
  .hero.a-grid::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.55;
    background-image: radial-gradient(
        circle at var(--x, 50%) var(--y, 50%),
        color-mix(in oklab, var(--grad-a) 35%, transparent),
        transparent 35%
      ),
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: auto, 40px 40px, 40px 40px;
    animation: grid-ripple var(--med) ease-in-out infinite alternate;
  }
  :global(html[data-theme='hc'] .hero.a-grid)::before {
    background-image: none;
  }

  /* Variant: LINE SWEEP */
  .hero.a-line::before {
    content: '';
    position: absolute;
    inset: -20% -60% -20% -60%;
    background: conic-gradient(
      from var(--rot, 45deg),
      transparent 0 30%,
      color-mix(in oklab, var(--grad-a) 40%, transparent) 50%,
      transparent 70%
    );
    animation: sweep var(--slow) linear infinite;
    z-index: 0;
    opacity: 0.6;
  }
  :global(html[data-theme='hc'] .hero.a-line)::before {
    display: none;
  }

  /* Variant: PARTICLE DRIFT */
  .hero.a-particles::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: radial-gradient(
        2px 2px at 10% 20%,
        color-mix(in oklab, var(--grad-a) 80%, transparent) 0,
        transparent 100%
      ),
      radial-gradient(
        2px 2px at 35% 60%,
        color-mix(in oklab, var(--grad-b) 80%, transparent) 0,
        transparent 100%
      ),
      radial-gradient(
        2px 2px at 70% 30%,
        color-mix(in oklab, var(--signal) 70%, transparent) 0,
        transparent 100%
      ),
      radial-gradient(
        2px 2px at 85% 75%,
        color-mix(in oklab, var(--voyage) 70%, transparent) 0,
        transparent 100%
      );
    animation: drift var(--med) ease-in-out infinite alternate;
    opacity: 0.5;
  }
  :global(html[data-theme='hc'] .hero.a-particles)::before {
    display: none;
  }

  .underlay {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  canvas.aurora,
  canvas.nodes {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>

<div
  class="hero"
  class:a-aurora={variant === 'aurora'}
  class:a-halo={variant === 'halo'}
  class:a-nodes={variant === 'nodes'}
  class:a-grid={variant === 'grid'}
  class:a-line={variant === 'line'}
  class:a-particles={variant === 'particles'}
  role="region"
  aria-label="Animated hero"
>
  <div class="gradbar" aria-hidden="true"></div>
  <div class="underlay" aria-hidden="true">
    <canvas
      class="aurora"
      bind:this={auroraCanvas}
      style:display={variant === 'aurora' && theme !== 'hc' && !prefersReduced ? 'block' : 'none'}
    ></canvas>
    <canvas
      class="nodes"
      bind:this={nodesCanvas}
      style:display={variant === 'nodes' && theme !== 'hc' && !prefersReduced ? 'block' : 'none'}
    ></canvas>
  </div>
  <div class="content">
    <h1 class="hero__title heading">{title}</h1>
    {#if subtitle}
      <p class="hero__subtitle">{subtitle}</p>
    {/if}
    <slot />
  </div>
</div>
