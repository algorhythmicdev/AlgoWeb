<script lang="ts">
  type ButtonVariant = 'default' | 'primary' | 'secondary' | 'gradient';
  type ButtonSize = 'md' | 'lg';

  export let variant: ButtonVariant = 'default';
  export let size: ButtonSize = 'md';
  export let href: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
  export let fullWidth = false;
  export let loading = false;
  export let ariaLabel: string | null = null;
  export let elevate = false;
  export let pressed: boolean | undefined = undefined;

  const variantClassMap: Record<ButtonVariant, string> = {
    default: '',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    gradient: 'btn-gradient'
  };

  $: variantClass = variantClassMap[variant] ?? '';
  $: sizeClass = size === 'lg' ? 'btn-lg' : '';
  $: blockClass = fullWidth ? 'btn-block' : '';
  $: userClass = typeof $$props.class === 'string' ? $$props.class : '';
  $: classes = ['btn', variantClass, sizeClass, blockClass, elevate ? 'hover-lift' : '', userClass]
    .filter(Boolean)
    .join(' ')
    .trim();

  $: computedRel = rel ?? (href && target === '_blank' ? 'noopener noreferrer' : undefined);
  $: ariaPressed = pressed === undefined ? undefined : !!pressed;
  $: busy = loading ? true : undefined;
  $: ariaLabelValue = ariaLabel ?? undefined;
  $: isLink = typeof href === 'string' && href.length > 0;
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
    <slot />
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
    <slot />
  </button>
{/if}
