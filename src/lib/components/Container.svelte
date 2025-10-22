<script lang="ts">
  export let as: keyof HTMLElementTagNameMap = 'div';

  const resolveExtraClass = (): string => {
    const value = /** @type {unknown} */ ($$restProps.class);
    return typeof value === 'string' ? value : '';
  };

  $: extraClass = resolveExtraClass();
  $: classes = ['container', extraClass].filter(Boolean).join(' ');
</script>

<svelte:element this={as} {...$$restProps} class={classes}>
  <slot />
</svelte:element>

<style>
  .container {
    max-width: var(--container-max, 72rem);
    margin-inline: auto;
    padding-inline: var(--space-4);
  }

  @media (min-width: 48rem) {
    .container {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 80rem) {
    .container {
      padding-inline: var(--space-8);
    }
  }
</style>
