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
    padding: var(--space-3xl);
    border-radius: 64px;
    border: 2px solid var(--border);
    background: var(--bg-elev-1);
    color: var(--text);
    overflow: visible;
    isolation: isolate;
    box-shadow: var(--shadow-2xl);
  }

  .glass-card--pad-sm {
    padding: var(--card-padding-sm);
  }

  .glass-card--pad-lg {
    padding: var(--card-padding-xl);
  }

  .glass-card__surface {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: transparent;
    opacity: 0;
    pointer-events: none;
    z-index: var(--z-behind);
  }

  .glass-card--interactive {
    cursor: pointer;
    transition: 
      transform var(--duration-smooth) var(--ease-spring),
      box-shadow var(--duration-smooth) var(--ease-smooth),
      border-color var(--duration-fast) ease;
  }

  .glass-card--interactive:hover {
    transform: var(--transform-hover-card);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-2xl);
  }

  .glass-card--interactive:active {
    transform: var(--transform-active-card);
    transition-duration: var(--duration-micro);
  }

  .glass-card:focus-within {
    outline: 2px solid color-mix(
      in srgb,
      var(--focus-ring-color, color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%)) 82%,
      rgba(var(--signal-yellow-rgb, 255, 211, 57), 0.35) 18%
    );
    outline-offset: 3px;
  }



  .glass-card :global(*) {
    position: relative;
    z-index: var(--z-text);
  }
  
  .glass-card :global(h1),
  .glass-card :global(h2),
  .glass-card :global(h3),
  .glass-card :global(h4),
  .glass-card :global(h5),
  .glass-card :global(h6),
  .glass-card :global(p),
  .glass-card :global(span),
  .glass-card :global(a),
  .glass-card :global(button) {
    position: relative;
    z-index: var(--z-text);
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

  @media (prefers-reduced-motion: reduce) {
    .glass-card--interactive,
    .glass-card--interactive:hover,
    .glass-card--interactive:focus-visible {
      transform: none;
      box-shadow: var(--shadow-xl);
    }
  }
</style>
