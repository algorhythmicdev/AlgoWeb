<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getThemeForPath } from '$config/backgroundThemes';
  
  let shapes = [];
  let mouseX = 0;
  let mouseY = 0;
  
  $: theme = getThemeForPath($page.url.pathname);
  $: if (theme) generateShapes(theme);
  
  function generateShapes(themeConfig) {
    shapes = [];
    themeConfig.shapes.forEach(shapeConfig => {
      for (let i = 0; i < shapeConfig.count; i++) {
        shapes.push({
          id: `${shapeConfig.type}-${i}`,
          type: shapeConfig.type,
          color: shapeConfig.color,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: shapeConfig.size === 'small' ? 20 : shapeConfig.size === 'medium' ? 40 : 60,
          speed: Math.random() * 0.5 + 0.2,
          rotation: Math.random() * 360
        });
      }
    });
  }
  
  onMount(() => {
    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
</script>

<div class="background" aria-hidden="true">
  {#each shapes as shape (shape.id)}
    <div
      class="shape shape-{shape.type}"
      style="
        left: {shape.x}%;
        top: {shape.y}%;
        width: {shape.size}px;
        height: {shape.size}px;
        animation-duration: {20 + shape.speed * 10}s;
        transform: rotate({shape.rotation}deg);
      "
    />
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
  
  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.06;
    animation: float 20s ease-in-out infinite;
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
  }
  
  .shape-brain {
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    background: var(--aurora-purple);
  }
  
  .shape-sparkle {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    background: var(--signal-yellow);
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(30px, -30px) rotate(120deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(240deg);
    }
  }
</style>
