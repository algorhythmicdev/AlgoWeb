<script lang="ts">
  import { onMount } from 'svelte';
  
  export let variant: 'neural' | 'dots' | 'matrix' | 'waves' | 'minimal' = 'dots';
  export let density: 'low' | 'medium' | 'high' = 'medium';
  export let color = 'var(--particle-color)';
  export let speed = 1;
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationId: number;
  let particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    connections?: Array<number>;
  }> = [];
  
  const densityMap = { low: 30, medium: 50, high: 80 };
  const particleCount = densityMap[density];
  
  function initCanvas() {
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx = canvas.getContext('2d');
    initParticles();
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed * 0.5,
        vy: (Math.random() - 0.5) * speed * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        connections: []
      });
    }
  }
  
  function drawNeural() {
    if (!ctx) return;
    
    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx!.beginPath();
          ctx!.strokeStyle = `rgba(102, 159, 255, ${(1 - distance / 120) * 0.3})`;
          ctx!.lineWidth = 1;
          ctx!.moveTo(p1.x, p1.y);
          ctx!.lineTo(p2.x, p2.y);
          ctx!.stroke();
        }
      });
    });
    
    // Draw particles
    particles.forEach(p => {
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(102, 159, 255, ${p.opacity})`;
      ctx!.fill();
    });
  }
  
  function drawDots() {
    if (!ctx) return;
    particles.forEach(p => {
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(102, 159, 255, ${p.opacity})`;
      ctx!.fill();
      
      // Glow effect
      const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, `rgba(102, 159, 255, ${p.opacity * 0.3})`);
      gradient.addColorStop(1, 'rgba(102, 159, 255, 0)');
      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx!.fill();
    });
  }
  
  function drawMatrix() {
    if (!ctx) return;
    particles.forEach(p => {
      ctx!.fillStyle = `rgba(0, 229, 160, ${p.opacity})`;
      ctx!.font = `${p.radius * 4}px monospace`;
      ctx!.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), p.x, p.y);
    });
  }
  
  function drawWaves() {
    if (!ctx) return;
    ctx!.beginPath();
    particles.forEach((p, i) => {
      if (i === 0) {
        ctx!.moveTo(p.x, p.y);
      } else {
        ctx!.lineTo(p.x, p.y);
      }
    });
    ctx!.strokeStyle = `rgba(102, 159, 255, 0.2)`;
    ctx!.lineWidth = 2;
    ctx!.stroke();
    
    particles.forEach(p => {
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(102, 159, 255, ${p.opacity})`;
      ctx!.fill();
    });
  }
  
  function drawMinimal() {
    if (!ctx) return;
    particles.forEach(p => {
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(102, 159, 255, ${p.opacity * 0.4})`;
      ctx!.fill();
    });
  }
  
  function updateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      // Keep in bounds
      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));
    });
  }
  
  function animate() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateParticles();
    
    switch (variant) {
      case 'neural':
        drawNeural();
        break;
      case 'dots':
        drawDots();
        break;
      case 'matrix':
        drawMatrix();
        break;
      case 'waves':
        drawWaves();
        break;
      case 'minimal':
        drawMinimal();
        break;
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    
    initCanvas();
    animate();
    
    const handleResize = () => {
      initCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<canvas 
  bind:this={canvas} 
  class="particle-canvas"
  aria-hidden="true"
></canvas>

<style>
  .particle-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: var(--z-particle, 1);
    pointer-events: none;
    opacity: var(--particle-opacity, 0.6);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .particle-canvas {
      display: none;
    }
  }
</style>
