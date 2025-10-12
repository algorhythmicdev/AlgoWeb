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
    border: 1px solid var(
      --surface-glass-border,
      color-mix(in srgb, var(--border) 68%, transparent 32%)
    );
    background: var(
      --surface-glass-bg,
      color-mix(in srgb, var(--bg-elev-1) 96%, rgba(var(--voyage-blue-rgb), 0.06) 4%)
    );
    color: inherit;
    overflow: hidden;
    isolation: isolate;
    box-shadow: var(--surface-glass-shadow, 0 24px 60px rgba(10, 18, 39, 0.18));
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
      radial-gradient(circle at 20% 20%, rgba(var(--voyage-blue-rgb), 0.18), transparent 65%),
      radial-gradient(circle at 78% 28%, rgba(var(--aurora-purple-rgb), 0.14), transparent 70%),
      var(
        --surface-glass-bg,
        color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--voyage-blue-rgb), 0.08) 6%)
      );
    opacity: var(--surface-glass-opacity, 0.9);
    pointer-events: none;
    backdrop-filter: blur(var(--surface-glass-blur, 12px)) saturate(1.15);
    -webkit-backdrop-filter: blur(var(--surface-glass-blur, 12px)) saturate(1.15);
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

  .glass-card::after,
  .glass-card::before {
    content: '';
    position: absolute;
    inset: -30%;
    border-radius: inherit;
    pointer-events: none;
  }

  .glass-card::after {
    opacity: 0;
    transition: opacity var(--duration-slow, 600ms) ease;
  }

  .glass-card::before {
    background-image: radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.16), transparent 72%);
    opacity: var(--grain-opacity, 0.06);
    transition: opacity var(--duration-slow, 600ms) ease;
  }

  .glass-card--halo::after {
    background: radial-gradient(
      circle at 50% 50%,
      color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.45) 65%, transparent 35%),
      transparent 70%
    );
    opacity: 0.65;
  }

  .glass-card--particles::before {
    background-image: radial-gradient(2px 2px at 30% 30%, rgba(var(--voyage-blue-rgb), 0.3), transparent 80%);
    background-size: 180px 180px;
    opacity: var(--grain-opacity, 0.35);
    animation: glassParticles 40s linear infinite;
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
