<script lang="ts">
  type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'gradient';
  type ButtonSize = 'md' | 'lg';

  export let variant: ButtonVariant = 'primary';
  export let size: ButtonSize = 'md';
  export let href: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
  export let fullWidth = false;
  export let loading = false;
  export let ariaLabel: string | null = null;
  export let pressed: boolean | undefined = undefined;
  export let elevate = false;

  $: isLink = typeof href === 'string' && href.length > 0;
  $: computedRel = rel ?? (isLink && target === '_blank' ? 'noopener noreferrer' : undefined);
  $: ariaPressed = pressed === undefined ? undefined : !!pressed;
  $: ariaLabelValue = ariaLabel ?? undefined;
  $: busy = loading ? true : undefined;

  $: classes = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : 'btn--md',
    fullWidth ? 'btn--block' : '',
    loading ? 'btn--loading' : '',
    elevate ? 'btn--elevate' : '',
    typeof $$props.class === 'string' ? $$props.class : ''
  ]
    .filter(Boolean)
    .join(' ');
</script>

{#if isLink}
  <a
    {...$$restProps}
    class={classes}
    href={href}
    target={target}
    rel={computedRel}
    aria-label={ariaLabelValue}
    aria-busy={busy}
    data-variant={variant}
  >
    <span class="btn__content"><slot /></span>
  </a>
{:else}
  <button
    {...$$restProps}
    class={classes}
    type={type}
    disabled={disabled || loading}
    aria-label={ariaLabelValue}
    aria-busy={busy}
    aria-pressed={ariaPressed}
    data-variant={variant}
  >
    <span class="btn__content"><slot /></span>
  </button>
{/if}

<style>
  .btn {
    --btn-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
    --btn-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 65%, rgba(255, 255, 255, 0.4) 35%);
    --btn-color: color-mix(in srgb, var(--text) 85%, rgba(var(--voyage-blue-rgb), 0.12) 15%);
    --btn-shadow: 0 18px 36px rgba(10, 18, 39, 0.16);
    --btn-hover-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.16) 12%);
    --btn-hover-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.55) 70%, rgba(255, 255, 255, 0.5) 30%);
    --btn-hover-shadow: 0 24px 48px rgba(10, 18, 39, 0.22);
    --btn-active-translate: -2px;
    --btn-padding-y: 0.85rem;
    --btn-padding-x: 1.7rem;
    --btn-gap: 0.65rem;
    --btn-focus-ring: 0 0 0 3px color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 70%, transparent 30%);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--btn-gap, 0.65rem);
    padding: var(--btn-padding-y, 0.85rem) var(--btn-padding-x, 1.7rem);
    border-radius: var(--radius-pill, 999px);
    border: 1px solid var(--btn-border);
    background: var(--btn-bg);
    color: var(--btn-color);
    font-weight: var(--weight-semibold, 600);
    font-size: clamp(0.95rem, 1vw, 1.05rem);
    line-height: 1.1;
    text-decoration: none;
    cursor: pointer;
    box-shadow: var(--btn-shadow);
    transform: translateY(0);
    transition:
      transform var(--duration-fast, 220ms) var(--ease-out, ease-out),
      box-shadow var(--duration-fast, 220ms) var(--ease-out, ease-out),
      background var(--duration-fast, 220ms) var(--ease-out, ease-out),
      border-color var(--duration-fast, 220ms) var(--ease-out, ease-out);
  }

  .btn__content {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn--lg {
    --btn-padding-y: 1rem;
    --btn-padding-x: 2.25rem;
    font-size: clamp(1rem, 1.2vw, 1.15rem);
  }

  .btn--block {
    width: 100%;
  }

  .btn--elevate {
    --btn-hover-shadow: 0 28px 54px rgba(10, 18, 39, 0.28);
    --btn-active-translate: -3px;
  }

  .btn:hover,
  .btn:focus-visible {
    background: var(--btn-hover-bg);
    border-color: var(--btn-hover-border);
    transform: translateY(var(--btn-active-translate));
    box-shadow: var(--btn-hover-shadow, 0 24px 48px rgba(10, 18, 39, 0.22));
  }

  .btn:focus-visible {
    outline: none;
    box-shadow: 0 24px 48px rgba(10, 18, 39, 0.22), var(--btn-focus-ring);
  }

  .btn:disabled,
  .btn[aria-disabled='true'] {
    opacity: 0.6;
    pointer-events: none;
    box-shadow: none;
    transform: none;
  }

  .btn--secondary {
    --btn-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--mist-rgb, 235, 240, 252), 0.24) 6%);
    --btn-border: color-mix(in srgb, var(--border) 70%, rgba(var(--voyage-blue-rgb), 0.18) 30%);
    --btn-color: color-mix(in srgb, var(--text) 88%, rgba(var(--voyage-blue-rgb), 0.15) 12%);
    --btn-hover-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.14) 12%);
  }

  .btn--subtle {
    --btn-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.08) 4%);
    --btn-border: color-mix(in srgb, var(--border) 55%, transparent 45%);
    --btn-color: color-mix(in srgb, var(--text) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
    --btn-shadow: 0 12px 20px rgba(10, 18, 39, 0.1);
  }

  .btn--gradient {
    --btn-bg: linear-gradient(
      135deg,
      color-mix(in srgb, var(--aurora-purple) 72%, rgba(255, 255, 255, 0.12) 28%),
      color-mix(in srgb, var(--voyage-blue) 78%, rgba(255, 255, 255, 0.14) 22%)
    );
    --btn-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.5) 70%, rgba(255, 255, 255, 0.5) 30%);
    --btn-color: var(--cta-primary-text, #ffffff);
    --btn-hover-bg: linear-gradient(
      135deg,
      color-mix(in srgb, var(--aurora-purple) 78%, rgba(255, 255, 255, 0.08) 22%),
      color-mix(in srgb, var(--voyage-blue) 82%, rgba(255, 255, 255, 0.1) 18%)
    );
  }

  .btn--loading {
    cursor: wait;
  }

  :global(html[data-theme='hc'] .btn),
  :global(html[data-theme='hc'] .btn--gradient),
  :global(html[data-theme='hc'] .btn--secondary),
  :global(html[data-theme='hc'] .btn--subtle) {
    --btn-bg: var(--bg);
    --btn-color: var(--text);
    --btn-border: var(--border-strong);
    box-shadow: none;
  }

  :global(html[data-theme='hc'] .btn:focus-visible) {
    box-shadow: none;
    outline: 3px solid currentColor;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn,
    .btn:hover,
    .btn:focus-visible {
      transition: none;
      transform: none;
    }
  }
</style>
