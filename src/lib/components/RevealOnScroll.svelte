<script lang="ts">
  import { onMount } from 'svelte';
  
  export let animation: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur' = 'fade-up';
  export let delay = 0;
  export let threshold = 0.1;
  export let once = true;
  
  let element: HTMLElement;
  let isVisible = false;
  let observer: IntersectionObserver;
  
  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      isVisible = true;
      return;
    }
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            if (once && observer) {
              observer.disconnect();
            }
          } else if (!once) {
            isVisible = false;
          }
        });
      },
      { threshold }
    );
    
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });
</script>

<div
  bind:this={element}
  class="reveal-container"
  class:visible={isVisible}
  class:anim-fade-up={animation === 'fade-up'}
  class:anim-fade-down={animation === 'fade-down'}
  class:anim-fade-left={animation === 'fade-left'}
  class:anim-fade-right={animation === 'fade-right'}
  class:anim-scale={animation === 'scale'}
  class:anim-blur={animation === 'blur'}
  style="transition-delay: {delay}ms"
>
  <slot />
</div>

<style>
  .reveal-container {
    opacity: 0;
    transition: 
      opacity var(--anim-hero, 800ms) var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--anim-hero, 800ms) var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1)),
      filter var(--anim-hero, 800ms) var(--ease-smooth, cubic-bezier(0.4, 0, 0.2, 1));
  }
  
  .reveal-container.visible {
    opacity: 1;
  }
  
  /* Fade Up */
  .anim-fade-up {
    transform: translateY(var(--reveal-distance, 40px));
  }
  
  .anim-fade-up.visible {
    transform: translateY(0);
  }
  
  /* Fade Down */
  .anim-fade-down {
    transform: translateY(calc(-1 * var(--reveal-distance, 40px)));
  }
  
  .anim-fade-down.visible {
    transform: translateY(0);
  }
  
  /* Fade Left */
  .anim-fade-left {
    transform: translateX(var(--reveal-distance, 40px));
  }
  
  .anim-fade-left.visible {
    transform: translateX(0);
  }
  
  /* Fade Right */
  .anim-fade-right {
    transform: translateX(calc(-1 * var(--reveal-distance, 40px)));
  }
  
  .anim-fade-right.visible {
    transform: translateX(0);
  }
  
  /* Scale */
  .anim-scale {
    transform: scale(var(--reveal-scale-start, 0.95));
  }
  
  .anim-scale.visible {
    transform: scale(1);
  }
  
  /* Blur */
  .anim-blur {
    filter: blur(var(--reveal-blur-start, 10px));
    transform: translateY(calc(var(--reveal-distance, 40px) * 0.5));
  }
  
  .anim-blur.visible {
    filter: blur(0);
    transform: translateY(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .reveal-container {
      opacity: 1;
      transform: none;
      filter: none;
      transition: none;
    }
  }
</style>
