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
    display: grid;
    gap: clamp(1.1rem, 2.5vw, 1.6rem);
    padding: var(--card-padding-lg);
    border-radius: var(--glass-card-radius, 0);
    border: 1px solid var(--surface-glass-border);
    background: var(--surface-glass-bg);
    color: var(--text);
    overflow: visible;
    isolation: isolate;
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.85)) saturate(1.04);
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.85)) saturate(1.04);
    transition:
      background var(--duration-normal) var(--ease-smooth),
      border-color var(--duration-normal) var(--ease-smooth),
      box-shadow var(--duration-normal) var(--ease-smooth),
      transform var(--duration-normal) var(--ease-smooth);
  }

  .glass-card--pad-sm {
    padding: var(--card-padding-sm);
  }

  .glass-card--pad-lg {
    padding: var(--card-padding-xl);
  }

  .glass-card::before,
  .glass-card::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: max(0px, calc(var(--glass-card-radius, 0) - 1px));
    pointer-events: none;
    z-index: var(--z-behind);
  }

  .glass-card::before {
    background: linear-gradient(140deg, rgba(var(--snow-rgb, 244, 246, 255), 0.24), transparent 68%);
    opacity: 0.45;
  }

  .glass-card::after {
    background:
      radial-gradient(120% 120% at 15% 15%, rgba(var(--voyage-blue-rgb), 0.08), transparent 62%),
      radial-gradient(100% 110% at 85% 25%, rgba(var(--aurora-purple-rgb), 0.06), transparent 68%);
    mix-blend-mode: screen;
    opacity: 0.32;
  }

  .glass-card__surface {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: var(--z-behind);
  }

  .glass-card--interactive {
    cursor: pointer;
    transition:
      transform var(--duration-smooth) var(--ease-spring),
      box-shadow var(--duration-smooth) var(--ease-smooth),
      border-color var(--duration-fast) ease,
      background var(--duration-normal) var(--ease-smooth);
  }

  .glass-card--interactive:hover {
    transform: var(--transform-hover-card);
    border-color: color-mix(in srgb, var(--glass-border-hover, var(--glass-border)) 78%, transparent 22%);
    box-shadow: var(--shadow-xl);
    background: color-mix(in srgb, var(--glass-bg-lightest) 46%, transparent 54%);
  }

  .glass-card--interactive:active {
    transform: var(--transform-active-card);
    transition-duration: var(--duration-micro);
  }

  .glass-card:focus-within {
    outline: 2px solid color-mix(
      in srgb,
      var(--focus-ring-color, color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%)) 80%,
      rgba(var(--signal-yellow-rgb, 255, 211, 57), 0.24) 20%
    );
    outline-offset: 4px;
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

  .glass-card :global(p) {
    margin: 0;
    line-height: 1.65;
    color: color-mix(in srgb, var(--text) 84%, rgba(var(--voyage-blue-rgb), 0.2) 16%);
  }

  .glass-card :global(ul),
  .glass-card :global(ol) {
    margin: 0;
    padding-left: clamp(1.1rem, 2.8vw, 1.4rem);
    display: grid;
    gap: 0.6rem;
    line-height: 1.6;
  }

  .glass-card :global(li) {
    margin: 0;
  }

  .glass-card :global(.card-actions) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
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
