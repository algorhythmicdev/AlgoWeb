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
  <slot />
</svelte:element>

<style>
  .glass-card {
    position: relative;
    display: grid;
    gap: var(--card-gap, clamp(1.35rem, 3vw, 2.15rem));
    padding: var(--card-padding-lg);
    border-radius: var(--radius-lg);
    --glass-card-surface-default:
      color-mix(
        in srgb,
        var(
            --surface-glass-bg,
            color-mix(in srgb, var(--glass-bg-lighter) 52%, transparent 48%)
          )
          88%,
        transparent 12%
      );
    --glass-card-border-default: color-mix(in srgb, var(--glass-border-strong) 65%, transparent 35%);
    --glass-card-shadow-default: 0 24px 68px rgba(var(--ink-rgb), 0.14), 0 8px 24px rgba(var(--ink-rgb), 0.08);
    --glass-card-spot-a-default: rgba(var(--voyage-blue-rgb), 0.12);
    --glass-card-spot-b-default: rgba(var(--aurora-purple-rgb), 0.1);
    --glass-card-veil-default: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.18) 36%, transparent 64%);
    --glass-card-highlight-default: rgba(var(--snow-rgb, 244, 246, 255), 0.18);
    --glass-card-halo-default: rgba(var(--signal-yellow-rgb), 0.24);
    --glass-card-halo-blur-default: 28px;
    --glass-card-veil-opacity-default: 0.55;
    --glass-card-halo-opacity-default: 0.25;
    border: 1px solid
      var(
        --glass-card-border,
        var(--surface-glass-border, var(--glass-card-border-default))
      );
    background: var(
      --glass-card-surface,
      var(--surface-glass-fill, var(--glass-card-surface-default))
    );
    color: var(--text);
    overflow: visible;
    isolation: isolate;
    box-shadow: var(
      --glass-card-shadow,
      var(--surface-glass-shadow, var(--glass-card-shadow-default))
    );
    backdrop-filter: blur(var(--glass-blur-lg)) saturate(1.12);
    -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(1.12);
    transition:
      background var(--duration-normal) var(--ease-smooth),
      border-color var(--duration-normal) var(--ease-smooth),
      box-shadow var(--duration-normal) var(--ease-smooth),
      transform var(--duration-normal) var(--ease-smooth),
      color var(--duration-normal) var(--ease-smooth);
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
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: var(--z-behind);
    transition: opacity var(--duration-smooth) var(--ease-smooth),
      transform var(--duration-smooth) var(--ease-smooth);
  }

  .glass-card::before {
    background:
      radial-gradient(
        120% 120% at 14% 20%,
        var(--glass-card-spot-a, var(--glass-card-spot-a-default)) 0%,
        transparent 62%
      ),
      radial-gradient(
        120% 140% at 80% 16%,
        var(--glass-card-spot-b, var(--glass-card-spot-b-default)) 0%,
        transparent 68%
      ),
      linear-gradient(
        180deg,
        var(--glass-card-veil, var(--glass-card-veil-default)) 0%,
        transparent 45%
      ),
      linear-gradient(
        180deg,
        var(--glass-card-highlight, var(--glass-card-highlight-default)) 0%,
        transparent 72%
      );
    opacity: var(--glass-card-veil-opacity, var(--glass-card-veil-opacity-default));
  }

  .glass-card::after {
    inset: -14%;
    background: radial-gradient(
      120% 120% at 50% 45%,
      color-mix(
        in srgb,
        var(--glass-card-halo, var(--glass-card-halo-default)) 28%,
        transparent 72%
      )
        0%,
      transparent 70%
    );
    filter: blur(var(--glass-card-halo-blur, var(--glass-card-halo-blur-default)));
    opacity: var(--glass-card-halo-opacity, var(--glass-card-halo-opacity-default));
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
    border-color: color-mix(
      in srgb,
      var(
          --glass-card-border-hover,
          var(--glass-card-border, var(--surface-glass-border, var(--glass-card-border-default)))
        )
        78%,
      transparent 22%
    );
    box-shadow: var(--shadow-xl);
    background: color-mix(in srgb, var(--glass-bg-lightest) 48%, transparent 52%);
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

  .glass-card--halo::after {
    opacity: var(--glass-card-halo-boost, 0.45);
  }

  .glass-card--halo:hover::after,
  .glass-card--halo:focus-visible::after,
  .glass-card--halo.glass-card--interactive:hover::after,
  .glass-card--halo.glass-card--interactive:focus-visible::after {
    opacity: var(--glass-card-halo-boost-hover, 0.55);
    transform: scale(1.02);
  }

  .glass-card--particles::before {
    opacity: var(--glass-card-particles-opacity, 0.65);
  }

  @media (max-width: 640px) {
    .glass-card {
      gap: var(--glass-card-gap-mobile, clamp(1rem, 4.5vw, 1.6rem));
      padding: var(--glass-card-padding-mobile, clamp(1.45rem, 5.5vw, 1.9rem));
      border-radius: calc(var(--glass-card-radius) * 0.9);
    }

    .glass-card--pad-sm {
      padding: var(--glass-card-padding-sm-mobile, clamp(1.1rem, 4.2vw, 1.5rem));
    }

    .glass-card--pad-lg {
      padding: var(--glass-card-padding-lg-mobile, clamp(1.85rem, 6vw, 2.4rem));
    }
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

  .glass-card :global(h1),
  .glass-card :global(h2),
  .glass-card :global(h3),
  .glass-card :global(h4),
  .glass-card :global(h5),
  .glass-card :global(h6) {
    text-wrap: balance;
    overflow-wrap: break-word;
  }

  .glass-card :global(p) {
    margin: 0;
    max-width: var(--measure-lg);
    line-height: var(--leading-relaxed, 1.65);
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--voyage-blue-rgb), 0.18) 12%);
    text-wrap: pretty;
    overflow-wrap: break-word;
  }

  .glass-card :global(ul),
  .glass-card :global(ol) {
    margin: 0;
    padding-left: clamp(1.1rem, 2.8vw, 1.5rem);
    display: grid;
    gap: clamp(0.55rem, 1.4vw, 0.85rem);
    line-height: var(--leading-normal, 1.5);
  }

  .glass-card :global(li) {
    margin: 0;
  }

  .glass-card :global(.card-actions) {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.75rem, 2vw, 1.25rem);
    align-items: center;
  }

  :global(html[data-theme='hc'] .glass-card) {
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
