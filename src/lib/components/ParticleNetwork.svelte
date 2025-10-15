<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '$stores/theme';

  const MAX_PARTICLES = 96;
  const BASE_SPEED = 0.22;
  const POINTER_PULL = 110;

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number | undefined;
  let particles: Particle[] = [];
  let mouse = { x: 0, y: 0, active: false };
  let prefersReducedMotion = false;
  let resizeObserver: ResizeObserver | null = null;
  let lastTimestamp = 0;
  let dpr = 1;

  type Palette = {
    node: string;
    nodeAlt: string;
    link: string;
    glow: string;
  };

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    depth: number;

    constructor(width: number, height: number) {
      this.depth = Math.random() * 0.6 + 0.4;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * BASE_SPEED;
      this.vy = (Math.random() - 0.5) * BASE_SPEED;
      this.radius = Math.random() * 1.8 + 0.8 + this.depth * 0.6;
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
        if (dist < POINTER_PULL) {
          const force = (1 - dist / POINTER_PULL) * 0.6;
          this.vx -= (dx / dist) * force * 0.05;
          this.vy -= (dy / dist) * force * 0.05;
        }
      }
    }

    draw(context: CanvasRenderingContext2D, palette: Palette) {
      const gradient = context.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 2.4
      );
      gradient.addColorStop(0, palette.node);
      gradient.addColorStop(1, palette.nodeAlt);

      context.fillStyle = gradient;
      context.beginPath();
      context.globalAlpha = 0.8;
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function paletteForTheme(): Palette {
    const isDark = $theme === 'dark';
    return isDark
      ? {
          node: 'rgba(124, 90, 255, 0.85)',
          nodeAlt: 'rgba(124, 90, 255, 0)',
          link: 'rgba(124, 90, 255, 0.18)',
          glow: 'rgba(110, 134, 255, 0.12)'
        }
      : {
          node: 'rgba(30, 92, 255, 0.85)',
          nodeAlt: 'rgba(30, 92, 255, 0)',
          link: 'rgba(30, 92, 255, 0.14)',
          glow: 'rgba(120, 170, 255, 0.18)'
        };
  }

  function targetParticleCount(width: number, height: number) {
    const area = width * height;
    const density = 24000;
    return Math.min(MAX_PARTICLES, Math.max(36, Math.round(area / density)));
  }

  function configureCanvas() {
    if (!canvas) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    dpr = Math.min(browser ? window.devicePixelRatio || 1 : 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const count = targetParticleCount(width, height);
    particles = Array.from({ length: count }, () => new Particle(width, height));
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
    const palette = paletteForTheme();

    particles.forEach((particle) => {
      particle.update(width, height, delta);
      particle.draw(ctx!, palette);
    });

    ctx.globalAlpha = 1;
    drawConnections(ctx, palette);
    drawPointerGlow(ctx, palette);

    animationId = requestAnimationFrame(renderFrame);
  }

  function drawConnections(context: CanvasRenderingContext2D, palette: Palette) {
    context.save();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const maxDistance = 150 * (a.depth + b.depth) * 0.55;

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          context.strokeStyle = palette.link;
          context.globalAlpha = alpha;
          context.lineWidth = 0.9;
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
    const gradient = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, POINTER_PULL);
    gradient.addColorStop(0, palette.glow);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(mouse.x, mouse.y, POINTER_PULL, 0, Math.PI * 2);
    context.fill();
    context.restore();
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

  function handleMouseMove(event: MouseEvent) {
    mouse = { x: event.clientX, y: event.clientY, active: true };
  }

  function handleMouseLeave() {
    mouse.active = false;
  }

  type LegacyMediaQueryList = MediaQueryList & {
    addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
  };

  onMount(() => {
    if (!browser) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const legacyMotionQuery = motionQuery as LegacyMediaQueryList;

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

    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (legacyMotionQuery.addListener) {
      legacyMotionQuery.addListener(onMotionChange);
    }

    configureCanvas();

    updateMotionPreference(motionQuery.matches);

    const resizeTarget = document.documentElement;
    resizeObserver = new ResizeObserver(() => {
      configureCanvas();
      if (!prefersReducedMotion) {
        start();
      }
    });
    resizeObserver.observe(resizeTarget);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      stop();
      if (typeof motionQuery.removeEventListener === 'function') {
        motionQuery.removeEventListener('change', onMotionChange);
      } else if (legacyMotionQuery.removeListener) {
        legacyMotionQuery.removeListener(onMotionChange);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver?.disconnect();
    };
  });

  onDestroy(() => {
    stop();
    resizeObserver?.disconnect();
  });
</script>

<canvas bind:this={canvas} class="particle-network" aria-hidden="true"></canvas>

<style>
  .particle-network {
    position: fixed;
    inset: 0;
    z-index: var(--z-background);
    pointer-events: none;
    opacity: 0.4;
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
