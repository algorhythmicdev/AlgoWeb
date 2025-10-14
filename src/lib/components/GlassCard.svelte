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
    border-radius: var(--radius-lg, 24px);
    border: 1px solid var(--glass-border, var(--surface-glass-border, color-mix(in srgb, var(--border) 68%, transparent 32%)));
    background-color:
      var(--glass-bg, var(--surface-glass-bg, color-mix(in srgb, var(--bg-elev-1) 98%, rgba(var(--ink-rgb), 0.04) 2%)));
    background-image: var(--glass-layer, var(--glass-texture, var(--grain, var(--grain-texture))));
    color: inherit;
    overflow: hidden;
    isolation: isolate;
    box-shadow: var(--glass-shadow, var(--surface-glass-shadow, 0 20px 48px rgba(12, 20, 40, 0.12)));
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
    background:
      var(--glass-inner-bg, var(--surface-glass-fill, color-mix(in srgb, var(--bg-elev-1) 99%, rgba(var(--ink-rgb), 0.05) 1%)));
    opacity: var(--glass-inner-opacity, var(--surface-glass-opacity, 1));
    pointer-events: none;
    backdrop-filter:
      var(--surface-glass-blur, blur(var(--glass-blur, 18px)))
      saturate(var(--glass-saturation, 1.08));
    -webkit-backdrop-filter:
      var(--surface-glass-blur, blur(var(--glass-blur, 18px)))
      saturate(var(--glass-saturation, 1.08));
    transition: opacity var(--duration-fast, 240ms) ease;
  }

  .glass-card--interactive {
    transition: transform var(--duration-fast, 240ms) ease, box-shadow var(--duration-fast, 240ms) ease;
  }

  .glass-card--interactive:hover,
  .glass-card--interactive:focus-visible {
    transform: translateY(-3px);
    box-shadow: 0 30px 70px rgba(10, 18, 39, 0.22);
  }

  .glass-card--interactive:hover .glass-card__surface,
  .glass-card--interactive:focus-within .glass-card__surface {
    opacity: calc(var(--surface-glass-opacity, 1) * 0.88);
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
    z-index: 1;
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
