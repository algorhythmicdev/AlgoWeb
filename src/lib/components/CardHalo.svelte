<script lang="ts">
  import { onMount } from 'svelte';
  
  export let as: string = 'div';
  export let elevation: 1 | 2 = 1;
  export let className = '';
  export let heading: string | null = null;
  export let ariaLabel: string | null = null;
  export let halo: 'neural' | 'quantum' | 'cyber' | 'matrix' | 'coral' | 'none' = 'none';
  export let interactive = false;
  export let glass = false;
  
  let element: HTMLElement;
  let isHovered = false;
  
  function handleMouseMove(e: MouseEvent) {
    if (!interactive || !element) return;
    
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    element.style.setProperty('--mouse-x', `${x}%`);
    element.style.setProperty('--mouse-y', `${y}%`);
  }
  
  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
  
  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !interactive) return;
    
    element?.addEventListener('mousemove', handleMouseMove);
    element?.addEventListener('mouseenter', handleMouseEnter);
    element?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element?.removeEventListener('mousemove', handleMouseMove);
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  });
</script>

<svelte:element
  this={as}
  bind:this={element}
  class={`card-halo ${elevation === 2 ? 'surface-2' : ''} ${className}`.trim()}
  class:has-halo={halo !== 'none'}
  class:halo-neural={halo === 'neural'}
  class:halo-quantum={halo === 'quantum'}
  class:halo-cyber={halo === 'cyber'}
  class:halo-matrix={halo === 'matrix'}
  class:halo-coral={halo === 'coral'}
  class:interactive
  class:glass
  class:hovered={isHovered}
  aria-label={ariaLabel || undefined}
  {...$$restProps}
>
  {#if halo !== 'none'}
    <div class="card-halo-effect" aria-hidden="true"></div>
  {/if}
  
  <div class="card-content">
    {#if heading}
      <h3 class="text-strong card-heading">{heading}</h3>
    {/if}
    <slot />
  </div>
</svelte:element>

<style>
  .card-halo {
    position: relative;
    padding: 1.5rem;
    border-radius: 20px;
    background: var(--bg-elev-1);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-subtle);
    transition: 
      box-shadow var(--anim-normal, 400ms) var(--ease-apple, cubic-bezier(0.25, 0.1, 0.25, 1)),
      transform var(--anim-fast, 200ms) var(--ease-apple, cubic-bezier(0.25, 0.1, 0.25, 1)),
      border-color var(--anim-fast, 200ms) var(--ease-apple, cubic-bezier(0.25, 0.1, 0.25, 1));
    overflow: hidden;
    isolation: isolate;
  }
  
  .card-content {
    position: relative;
    z-index: 2;
  }
  
  .card-heading {
    margin: 0 0 1rem;
  }
  
  .glass {
    background: color-mix(
      in srgb, 
      var(--bg-elev-1) calc(100% - var(--glass-bg-opacity, 8%) * 100%), 
      transparent
    );
    backdrop-filter: blur(var(--glass-blur, 24px)) saturate(var(--glass-saturation, 1.1));
    -webkit-backdrop-filter: blur(var(--glass-blur, 24px)) saturate(var(--glass-saturation, 1.1));
    border-color: color-mix(
      in srgb,
      var(--border) calc(100% - var(--glass-border-opacity, 18%) * 100%),
      transparent
    );
  }
  
  .interactive {
    cursor: pointer;
    --mouse-x: 50%;
    --mouse-y: 50%;
  }
  
  .interactive:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-large);
    border-color: var(--halo-color-1, var(--primary));
  }
  
  .interactive:active {
    transform: translateY(-2px);
  }
  
  .has-halo {
    overflow: visible;
  }
  
  .card-halo-effect {
    position: absolute;
    inset: -20%;
    z-index: var(--z-halo, -1);
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      var(--halo-color-1, var(--primary)) 0%,
      var(--halo-color-2, var(--accent-1)) 30%,
      transparent 70%
    );
    filter: blur(var(--halo-blur, 80px));
    transition: opacity var(--anim-normal, 400ms) var(--ease-apple, cubic-bezier(0.25, 0.1, 0.25, 1));
  }
  
  .interactive.hovered .card-halo-effect {
    opacity: var(--halo-intensity, 0.35);
  }
  
  /* Halo color themes */
  .halo-neural {
    --halo-color-1: var(--ai-neural-1, #0066FF);
    --halo-color-2: var(--ai-neural-2, #00A3FF);
  }
  
  .halo-quantum {
    --halo-color-1: var(--ai-quantum-1, #8A6BFF);
    --halo-color-2: var(--ai-quantum-2, #B794F6);
  }
  
  .halo-cyber {
    --halo-color-1: var(--ai-cyber-1, #00E5A0);
    --halo-color-2: var(--ai-cyber-2, #00FFC8);
  }
  
  .halo-matrix {
    --halo-color-1: var(--ai-matrix-1, #FFB800);
    --halo-color-2: var(--ai-matrix-2, #FFD700);
  }
  
  .halo-coral {
    --halo-color-1: var(--ai-coral-1, #FF6B9D);
    --halo-color-2: var(--ai-coral-2, #FF8FB4);
  }
  
  @media (max-width: 768px) {
    .card-halo {
      padding: 1.25rem;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .card-halo,
    .card-halo-effect {
      transition: none;
    }
    
    .interactive:hover {
      transform: none;
    }
    
    .card-halo-effect {
      display: none;
    }
  }
  
  :root[data-theme="high-contrast"] .card-halo-effect {
    display: none;
  }
  
  :root[data-theme="high-contrast"] .glass {
    background: var(--bg-elev-1);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-color: var(--border);
  }
</style>
