<script lang="ts">
  import { onMount } from 'svelte';
  
  export let variant: 'neural' | 'quantum' | 'cyber' | 'matrix' | 'mixed' = 'mixed';
  export let animate = true;
  export let opacity = 0.15;
  
  let mounted = false;
  
  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced && animate) {
      mounted = true;
    } else {
      mounted = true;
    }
  });
</script>

<div 
  class="mesh-gradient gradient-{variant}"
  class:animated={animate && mounted}
  style="opacity: {opacity}"
  aria-hidden="true"
>
  <div class="gradient-orb orb-1"></div>
  <div class="gradient-orb orb-2"></div>
  <div class="gradient-orb orb-3"></div>
  <div class="gradient-orb orb-4"></div>
</div>

<style>
  .mesh-gradient {
    position: absolute;
    inset: 0;
    z-index: var(--z-hero-bg, 0);
    pointer-events: none;
    overflow: hidden;
    filter: blur(80px);
  }
  
  .gradient-orb {
    position: absolute;
    border-radius: 50%;
    width: 60%;
    height: 60%;
    mix-blend-mode: screen;
  }
  
  .orb-1 {
    background: radial-gradient(
      circle at center,
      var(--gradient-mesh-1, #0066FF) 0%,
      transparent 70%
    );
    top: -20%;
    left: -20%;
  }
  
  .orb-2 {
    background: radial-gradient(
      circle at center,
      var(--gradient-mesh-2, #8A6BFF) 0%,
      transparent 70%
    );
    top: -10%;
    right: -20%;
  }
  
  .orb-3 {
    background: radial-gradient(
      circle at center,
      var(--gradient-mesh-3, #00E5A0) 0%,
      transparent 70%
    );
    bottom: -20%;
    left: 10%;
  }
  
  .orb-4 {
    background: radial-gradient(
      circle at center,
      var(--gradient-mesh-4, #FFB800) 0%,
      transparent 70%
    );
    bottom: -10%;
    right: -10%;
  }
  
  .animated .orb-1 {
    animation: float-1 20s ease-in-out infinite;
  }
  
  .animated .orb-2 {
    animation: float-2 25s ease-in-out infinite;
  }
  
  .animated .orb-3 {
    animation: float-3 22s ease-in-out infinite;
  }
  
  .animated .orb-4 {
    animation: float-4 28s ease-in-out infinite;
  }
  
  @keyframes float-1 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(10%, 10%) scale(1.1);
    }
    66% {
      transform: translate(-5%, 15%) scale(0.9);
    }
  }
  
  @keyframes float-2 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-15%, 10%) scale(0.9);
    }
    66% {
      transform: translate(5%, -10%) scale(1.1);
    }
  }
  
  @keyframes float-3 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(15%, -10%) scale(1.1);
    }
    66% {
      transform: translate(-10%, 5%) scale(0.9);
    }
  }
  
  @keyframes float-4 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-10%, 15%) scale(0.9);
    }
    66% {
      transform: translate(10%, -5%) scale(1.1);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animated .orb-1,
    .animated .orb-2,
    .animated .orb-3,
    .animated .orb-4 {
      animation: none;
    }
  }
  
  :root[data-theme="high-contrast"] .mesh-gradient {
    display: none;
  }
</style>
