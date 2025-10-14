<script lang="ts">
  type TagName = keyof HTMLElementTagNameMap;
  type Padding = 'sm' | 'md' | 'lg';

  export let as: TagName = 'div';
  export let halo = false;
  export let particles = false;
  export let padding: Padding = 'md';
  export let interactive = false;

  $: rootClass = [
    'glass-card',
    `glass-card--pad-${padding}`,
    halo ? 'glass-card--halo' : '',
    particles ? 'glass-card--particles' : '',
    interactive ? 'glass-card--interactive' : '',
    typeof $$props.class === 'string' ? $$props.class : ''
  ]
    .filter(Boolean)
    .join(' ');
</script>

<svelte:element this={as} class={rootClass} data-variant={halo ? 'halo' : particles ? 'particles' : undefined} {...$$restProps}>
  <div class="glass-card__surface" aria-hidden="true"></div>
  <slot />
</svelte:element>

<style>
  .glass-card {
    position: relative;
    padding: clamp(1.5rem, 3vw, 2.4rem);
    border-radius: clamp(24px, 4vw, 40px);
    border: 1.5px solid color-mix(in srgb, rgba(255, 255, 255, 0.3) 80%, transparent 20%);
    background-color: color-mix(in srgb, var(--bg-elev-1) 88%, transparent 12%);
    background-image: var(--glass-layer, var(--glass-texture));
    color: var(--text);
    overflow: hidden;
    isolation: isolate;
    box-shadow: 
      0 16px 48px rgba(10, 18, 32, 0.16),
      0 4px 16px rgba(10, 18, 32, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(10, 18, 32, 0.03);
  }

  .glass-card--pad-sm {
    padding: clamp(1rem, 2.2vw, 1.6rem);
  }

  .glass-card--pad-lg {
    padding: clamp(2rem, 4vw, 3rem);
  }

  .glass-card__surface {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: transparent;
    opacity: 1;
    pointer-events: none;
    backdrop-filter: blur(40px) saturate(1.4) brightness(1.08);
    -webkit-backdrop-filter: blur(40px) saturate(1.4) brightness(1.08);
    transition: backdrop-filter var(--duration-normal, 320ms) cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  .glass-card--interactive {
    cursor: pointer;
    transition: 
      transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 320ms cubic-bezier(0.4, 0, 0.2, 1),
      border-color 240ms ease;
  }

  .glass-card--interactive:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.5) 85%, transparent 15%);
    box-shadow: 
      0 24px 64px rgba(10, 18, 32, 0.2),
      0 8px 24px rgba(10, 18, 32, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  .glass-card--interactive:hover .glass-card__surface {
    backdrop-filter: blur(48px) saturate(1.5) brightness(1.12);
    -webkit-backdrop-filter: blur(48px) saturate(1.5) brightness(1.12);
  }

  .glass-card--interactive:active {
    transform: translateY(-2px) scale(0.99);
    transition-duration: 150ms;
  }

  .glass-card:focus-within {
    outline: 2px solid color-mix(
      in srgb,
      var(--focus-ring-color, color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%)) 82%,
      rgba(var(--signal-yellow-rgb, 255, 211, 57), 0.35) 18%
    );
    outline-offset: 3px;
  }

  .glass-card::after,
  .glass-card::before {
    content: '';
    position: absolute;
    inset: -30%;
    border-radius: inherit;
    pointer-events: none;
    background-size: 240px 240px;
    background-repeat: repeat;
    transition: opacity var(--duration-slow, 600ms) ease;
  }

  .glass-card::before {
    background-image: var(--grain, var(--grain-texture));
    opacity: var(--glass-grain-opacity, 0.05);
  }

  .glass-card::after {
    background-image: var(--grain, var(--grain-texture));
    opacity: 0;
  }

  .glass-card--halo::after {
    background: radial-gradient(circle at 50% 50%, color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.28) 60%, transparent 40%), transparent 72%);
    opacity: 0.45;
  }

  .glass-card--particles::before {
    background-image: radial-gradient(1px 1px at 28% 30%, rgba(var(--voyage-blue-rgb), 0.22), transparent 78%), var(--grain, var(--grain-texture));
    background-size: 220px 220px, 240px 240px;
    background-repeat: repeat;
    opacity: var(--glass-grain-opacity, 0.18);
    animation: glassParticles 48s linear infinite;
  }

  .glass-card :global(*) {
    position: relative;
    z-index: 2;
  }

  :global(html[data-theme='hc'] .glass-card),
  :global(html[data-theme='hc'] .glass-card__surface) {
    background: var(--bg);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }

  :global(html[data-theme='hc'] .glass-card:focus-within) {
    outline: 2px solid currentColor;
  }

  :global(html[data-theme='hc'] .glass-card::after),
  :global(html[data-theme='hc'] .glass-card::before) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .glass-card--interactive,
    .glass-card--interactive:hover,
    .glass-card--interactive:focus-visible {
      transform: none;
      box-shadow: 0 24px 60px rgba(10, 18, 39, 0.18);
    }

    .glass-card--particles::before {
      animation: none;
    }
  }

  @keyframes glassParticles {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-200px, -120px, 0);
    }
  }
</style>
