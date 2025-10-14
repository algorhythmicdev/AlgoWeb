<script>
  import { onMount, onDestroy } from 'svelte';
  import { theme } from '$stores/theme';

  let canvas;
  let ctx;
  let animationId;
  let particles = [];
  let mouse = { x: null, y: null };
  const particleCount = 60;
  const connectionDistance = 150;
  const particleSpeed = 0.3;

  class Particle {
    constructor(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * particleSpeed;
      this.vy = (Math.random() - 0.5) * particleSpeed;
      this.radius = Math.random() * 2 + 1;
    }

    update(canvas) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }
    }

    draw(ctx, color, opacity) {
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }
  }

  function animate() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = $theme === 'dark';
    const particleColor = isDark ? 'rgba(106, 56, 255, 0.6)' : 'rgba(19, 81, 255, 0.5)';
    const lineColor = isDark ? 'rgba(106, 56, 255, 0.2)' : 'rgba(19, 81, 255, 0.15)';

    particles.forEach(particle => {
      particle.update(canvas);
      particle.draw(ctx, particleColor, 0.7);
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 1 - dist / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  function handleResize() {
    init();
  }

  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function handleMouseLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  onMount(() => {
    init();
    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
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
