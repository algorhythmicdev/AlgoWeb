<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  const VARIANT_MAP = new Map([
    ['aurora-flow', 'aurora-flow'],
    ['aurora', 'aurora-flow'],
    ['grid-ripple', 'grid-ripple'],
    ['mesh', 'grid-ripple'],
    ['glass-parallax', 'glass-parallax'],
    ['prism', 'glass-parallax'],
    ['particle-drift', 'particle-drift'],
    ['particles', 'particle-drift'],
    ['connected-nodes', 'connected-nodes'],
    ['nodes', 'connected-nodes'],
    ['line-sweep', 'line-sweep'],
    ['wave', 'line-sweep'],
    ['spotlight', 'spotlight']
  ]);

  export let variant =
    /**
     * @type {'aurora-flow' | 'glass-parallax' | 'grid-ripple' | 'connected-nodes' | 'particle-drift' | 'line-sweep' | 'spotlight' | 'aurora' | 'mesh' | 'wave' | 'prism'}
     */
    ('aurora-flow');
  export let tone = /** @type {'primary' | 'aurora' | 'citrus' | 'crimson' | 'atlantic' | 'evergreen'} */ ('primary');
  export let intensity = /** @type {'soft' | 'balanced' | 'bold'} */ ('balanced');
  export let className = '';
  let externalClass = '';
  let prefersReduced = false;
  let theme = 'light';
  let initialized = false;

  /** @type {HTMLCanvasElement | null} */
  let auroraCanvas = null;
  /** @type {HTMLCanvasElement | null} */
  let nodesCanvas = null;
  /** @type {number | null} */
  let auroraRAF = null;
  /** @type {number | null} */
  let nodesRAF = null;
  /** @type {(() => void) | null} */
  let auroraResizeCleanup = null;
  /** @type {(() => void) | null} */
  let nodesResizeCleanup = null;
  /** @type {MediaQueryList | null} */
  let motionQuery = null;
  /** @type {MutationObserver | null} */
  let themeObserver = null;

  /** @param {number} deg */
  const toRad = (deg) => (deg * Math.PI) / 180;

  /**
   * @param {number} count
   * @param {number} radiusScale
   * @param {number} yBias
   */
  const createScatter = (count, radiusScale = 0.45, yBias = 0) =>
    Array.from({ length: Math.max(count, 0) }, (_, index) => {
      const angle = (index * 137.5) % 360;
      const radius = 0.18 + (index / Math.max(count, 1)) * radiusScale;
      const sin = Math.sin(toRad(angle));
      const cos = Math.cos(toRad(angle));
      const top = 50 + (sin * radius + yBias) * 50;
      const left = 50 + cos * radius * 50;
      return {
        top: `${Math.min(92, Math.max(8, top))}%`,
        left: `${Math.min(92, Math.max(8, left))}%`,
        delay: ((index % 7) + 1) * 0.35
      };
    });

  $: resolvedVariant = VARIANT_MAP.get(variant) ?? 'aurora-flow';
  $: toneClass = tone ? `hero-backdrop--tone-${tone}` : '';
  $: intensityClass = intensity ? `hero-backdrop--intensity-${intensity}` : '';
  $: externalClass = (() => {
    const raw = /** @type {unknown} */ ($$props.class);
    if (typeof raw === 'string') return raw;
    if (Array.isArray(raw)) return raw.filter(Boolean).join(' ');
    return '';
  })();
  $: mergedClassName = [className, externalClass].filter(Boolean).join(' ');
  $: baseClasses = ['hero-backdrop', `hero-backdrop--${resolvedVariant}`, toneClass, intensityClass, mergedClassName]
    .filter(Boolean)
    .join(' ');
  $: particleCount =
    resolvedVariant === 'grid-ripple'
      ? 22
      : resolvedVariant === 'glass-parallax'
        ? 18
        : resolvedVariant === 'connected-nodes'
          ? 20
          : resolvedVariant === 'particle-drift'
            ? 28
            : 14;
  $: scatter = (() => {
    switch (resolvedVariant) {
      case 'grid-ripple':
        return createScatter(particleCount, 0.42);
      case 'glass-parallax':
        return createScatter(particleCount, 0.38, -0.05);
      case 'connected-nodes':
        return createScatter(particleCount, 0.44, -0.04);
      case 'particle-drift':
        return createScatter(particleCount, 0.56, 0.02);
      case 'line-sweep':
        return createScatter(particleCount, 0.48, 0.04);
      case 'spotlight':
        return createScatter(particleCount, 0.36, -0.02);
      default:
        return [];
    }
  })();
  $: networkParticles =
    resolvedVariant === 'connected-nodes'
      ? scatter.map((particle, index) => ({
          ...particle,
          duration: 16 + (index % 4) * 3.5
        }))
      : [];
  $: driftParticles =
    resolvedVariant === 'particle-drift'
      ? scatter.map((particle, index) => ({
          ...particle,
          duration: 20 + (index % 5) * 2.5
        }))
      : [];
  $: overlayParticles = resolvedVariant === 'particle-drift' ? driftParticles : scatter;
  $: showAuroraCanvas = browser && resolvedVariant === 'aurora-flow';
  $: showNodesCanvas = browser && resolvedVariant === 'connected-nodes';

  const readTheme = () => {
    if (!browser) return;
    const root = document.documentElement;
    const dataTheme = (root.getAttribute('data-theme') || '').toLowerCase();
    const baseTheme = (root.getAttribute('data-base-theme') || '').toLowerCase();
    const candidate = dataTheme || baseTheme;
    if (!candidate) {
      theme = 'light';
      return;
    }
    if (candidate.includes('hc') || candidate.includes('contrast')) {
      theme = 'hc';
      return;
    }
    if (candidate.includes('dark')) {
      theme = 'dark';
      return;
    }
    theme = 'light';
  };

  const isAuroraActive = () => browser && initialized && resolvedVariant === 'aurora-flow' && !prefersReduced && theme !== 'hc';
  const isNodesActive = () =>
    browser && initialized && resolvedVariant === 'connected-nodes' && !prefersReduced && theme !== 'hc';

  /** @param {HTMLCanvasElement | null} canvas */
  const clearCanvas = (canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const stopAurora = () => {
    if (auroraRAF != null) {
      cancelAnimationFrame(auroraRAF);
      auroraRAF = null;
    }
    auroraResizeCleanup?.();
    auroraResizeCleanup = null;
    clearCanvas(auroraCanvas);
  };

  const stopNodes = () => {
    if (nodesRAF != null) {
      cancelAnimationFrame(nodesRAF);
      nodesRAF = null;
    }
    nodesResizeCleanup?.();
    nodesResizeCleanup = null;
    clearCanvas(nodesCanvas);
    nodePoints = [];
  };

  const startAurora = () => {
    if (!isAuroraActive() || !auroraCanvas || auroraRAF != null) return;
    const canvas = auroraCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rgba = (hex, alpha = 1) => {
      const normalized = String(hex || '#000000').replace('#', '');
      const int = Number.parseInt(normalized, 16);
      const r = (int >> 16) & 255;
      const g = (int >> 8) & 255;
      const b = int & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    };
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const gradA = style.getPropertyValue('--grad-a').trim() || '#1351ff';
      const gradB = style.getPropertyValue('--grad-b').trim() || '#6a38ff';
      return { gradA, gradB };
    };
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, clientWidth * dpr);
      canvas.height = Math.max(1, clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize, { passive: true });
    auroraResizeCleanup = () => window.removeEventListener('resize', handleResize);
    resize();
    let t = 0;
    const loop = () => {
      if (!isAuroraActive()) {
        stopAurora();
        return;
      }
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const { gradA, gradB } = getColors();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i += 1) {
        const x = w * (0.3 + 0.4 * Math.sin(t / 7000 + i * 2));
        const y = h * (0.3 + 0.4 * Math.cos(t / 6000 + i * 1.7));
        const radius = Math.max(w, h) * 0.45;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, rgba(i % 2 ? gradA : gradB, 0.28));
        gradient.addColorStop(1, rgba(i % 2 ? gradB : gradA, 0));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      t += 16;
      auroraRAF = requestAnimationFrame(loop);
    };
    auroraRAF = requestAnimationFrame(loop);
  };

  let nodePoints = [];
  const startNodes = () => {
    if (!isNodesActive() || !nodesCanvas || nodesRAF != null) return;
    const canvas = nodesCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rgba = (hex, alpha = 1) => {
      const normalized = String(hex || '#000000').replace('#', '');
      const int = Number.parseInt(normalized, 16);
      const r = (int >> 16) & 255;
      const g = (int >> 8) & 255;
      const b = int & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    };
    const mix = (a, b, t) => {
      const parse = (hex) => {
        const normalized = String(hex || '#000000').replace('#', '');
        return [
          Number.parseInt(normalized.slice(0, 2), 16),
          Number.parseInt(normalized.slice(2, 4), 16),
          Number.parseInt(normalized.slice(4, 6), 16)
        ];
      };
      const [r1, g1, b1] = parse(a);
      const [r2, g2, b2] = parse(b);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const blue = Math.round(b1 + (b2 - b1) * t);
      return `rgba(${r},${g},${blue},0.6)`;
    };
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const gradA = style.getPropertyValue('--grad-a').trim() || '#1351ff';
      const gradB = style.getPropertyValue('--grad-b').trim() || '#6a38ff';
      return { gradA, gradB };
    };
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, clientWidth * dpr);
      canvas.height = Math.max(1, clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = clientWidth * clientHeight;
      const count = Math.max(8, Math.floor(area / 28000));
      nodePoints = Array.from({ length: count }, () => ({
        x: Math.random() * clientWidth,
        y: Math.random() * clientHeight,
        vx: (Math.random() * 2 - 1) * 0.25,
        vy: (Math.random() * 2 - 1) * 0.25
      }));
    };
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize, { passive: true });
    nodesResizeCleanup = () => window.removeEventListener('resize', handleResize);
    resize();
    const loop = () => {
      if (!isNodesActive()) {
        stopNodes();
        return;
      }
      const { clientWidth: w, clientHeight: h } = canvas;
      const { gradA, gradB } = getColors();
      ctx.clearRect(0, 0, w, h);
      for (const point of nodePoints) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > w) point.vx *= -1;
        if (point.y < 0 || point.y > h) point.vy *= -1;
      }
      for (let i = 0; i < nodePoints.length; i += 1) {
        for (let j = i + 1; j < nodePoints.length; j += 1) {
          const dx = nodePoints[i].x - nodePoints[j].x;
          const dy = nodePoints[i].y - nodePoints[j].y;
          const distanceSquared = dx * dx + dy * dy;
          const limit = 150 * 150;
          if (distanceSquared < limit) {
            const alpha = 1 - Math.sqrt(distanceSquared) / 150;
            ctx.strokeStyle = mix(gradA, gradB, alpha * 0.5);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodePoints[i].x, nodePoints[i].y);
            ctx.lineTo(nodePoints[j].x, nodePoints[j].y);
            ctx.stroke();
          }
        }
      }
      for (const point of nodePoints) {
        ctx.fillStyle = rgba(gradA, 0.9);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      nodesRAF = requestAnimationFrame(loop);
    };
    nodesRAF = requestAnimationFrame(loop);
  };

  const updateCanvases = () => {
    if (!browser || !initialized) return;
    if (isAuroraActive()) startAurora(); else stopAurora();
    if (isNodesActive()) startNodes(); else stopNodes();
  };

  const attachMotionListener = () => {
    if (!browser || !window.matchMedia) return;
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced = motionQuery.matches;
    const handleChange = (event) => {
      prefersReduced = event.matches;
      updateCanvases();
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleChange);
      return () => motionQuery?.removeEventListener('change', handleChange);
    }
    // Safari
    motionQuery.addListener(handleChange);
    return () => motionQuery?.removeListener(handleChange);
  };

  let detachMotionListener = null;

  onMount(() => {
    if (!browser) return undefined;
    readTheme();
    detachMotionListener = attachMotionListener();
    themeObserver = new MutationObserver(() => {
      readTheme();
      updateCanvases();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-base-theme']
    });
    initialized = true;
    updateCanvases();
    return () => {
      stopAurora();
      stopNodes();
      themeObserver?.disconnect();
      themeObserver = null;
      detachMotionListener?.();
      detachMotionListener = null;
      motionQuery = null;
      initialized = false;
    };
  });

  onDestroy(() => {
    stopAurora();
    stopNodes();
    themeObserver?.disconnect();
    themeObserver = null;
    detachMotionListener?.();
    detachMotionListener = null;
    motionQuery = null;
    initialized = false;
  });

  $: if (initialized) {
    updateCanvases();
  }
</script>

<div class={baseClasses} aria-hidden="true">
  {#if showAuroraCanvas}
    <canvas class="hero-backdrop__canvas hero-backdrop__canvas--aurora" bind:this={auroraCanvas}></canvas>
  {/if}
  {#if showNodesCanvas}
    <canvas class="hero-backdrop__canvas hero-backdrop__canvas--nodes" bind:this={nodesCanvas}></canvas>
  {/if}
  {#if resolvedVariant === 'connected-nodes'}
    <div class="hero-backdrop__particles hero-backdrop__particles--network">
      {#each networkParticles as particle, index (index)}
        <span
          class="hero-backdrop__particle hero-backdrop__particle--network"
          style={`top:${particle.top};left:${particle.left};animation-delay:${particle.delay}s;--network-particle-speed:${particle.duration}s;`}
        ></span>
      {/each}
    </div>
  {:else if overlayParticles.length}
    <div class={`hero-backdrop__particles hero-backdrop__particles--${resolvedVariant}`}>
      {#each overlayParticles as particle, index (index)}
        <span
          class="hero-backdrop__particle"
          style={`top:${particle.top};left:${particle.left};animation-delay:${particle.delay}s;--particle-duration:${particle.duration ?? 16}s;`}
        ></span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .hero-backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    z-index: var(--hero-backdrop-layer, 0);
    display: block;
  }

  :global(html[data-theme='hc']) .hero-backdrop {
    display: none;
  }

  .hero-backdrop__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.85;
    mix-blend-mode: normal;
    transition: opacity 220ms ease;
  }

  :global([data-base-theme='dark']) .hero-backdrop__canvas {
    opacity: 0.75;
  }

  .hero-backdrop__particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hero-backdrop__particle {
    position: absolute;
    width: clamp(3px, 0.6vw, 7px);
    height: clamp(3px, 0.6vw, 7px);
    border-radius: 999px;
    background: radial-gradient(circle, color-mix(in srgb, var(--hero-accent, var(--grad-a)) 80%, transparent 20%) 0%, transparent 70%);
    box-shadow: 0 0 20px color-mix(in srgb, var(--hero-accent, var(--grad-a)) 30%, transparent 70%);
    opacity: 0;
    animation: heroParticleFloat var(--particle-duration, 18s) ease-in-out infinite;
  }

  .hero-backdrop__particle:nth-child(odd) {
    animation-duration: calc(var(--particle-duration, 18s) * 1.2);
  }

  .hero-backdrop__particle:nth-child(3n) {
    filter: brightness(1.1);
  }

  .hero-backdrop__particles--grid-ripple .hero-backdrop__particle {
    width: clamp(2px, 0.4vw, 5px);
    height: clamp(2px, 0.4vw, 5px);
  }

  .hero-backdrop__particles--glass-parallax .hero-backdrop__particle {
    filter: blur(0.3px) brightness(1.05);
  }

  .hero-backdrop__particles--line-sweep .hero-backdrop__particle,
  .hero-backdrop__particles--spotlight .hero-backdrop__particle {
    width: clamp(3px, 0.5vw, 6px);
    height: clamp(3px, 0.5vw, 6px);
  }

  .hero-backdrop__particle--network {
    width: clamp(2px, 0.4vw, 4px);
    height: clamp(2px, 0.4vw, 4px);
    background: color-mix(in srgb, var(--hero-secondary, var(--hero-accent, var(--grad-a))) 70%, transparent 30%);
    box-shadow: 0 0 16px color-mix(in srgb, var(--hero-secondary, var(--hero-accent, var(--grad-a))) 25%, transparent 75%);
    animation: heroNetworkFloat var(--network-particle-speed, 20s) linear infinite;
  }

  :global(html[data-theme='dark']) .hero-backdrop__particle {
    box-shadow: 0 0 22px color-mix(in srgb, var(--hero-accent, var(--grad-a)) 35%, transparent 65%);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-backdrop__particle {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      opacity: 0.5;
    }
  }

  @keyframes heroParticleFloat {
    0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
    15% { opacity: 1; }
    50% { transform: translate3d(6px, -10px, 0) scale(1); opacity: 0.9; }
    85% { opacity: 0.3; }
    100% { transform: translate3d(-4px, 6px, 0) scale(0.8); opacity: 0; }
  }

  @keyframes heroNetworkFloat {
    0% { opacity: 0; transform: translate3d(0, 0, 0); }
    20% { opacity: 0.85; }
    60% { transform: translate3d(4px, -6px, 0); opacity: 0.5; }
    100% { opacity: 0; transform: translate3d(-4px, 4px, 0); }
  }
</style>

