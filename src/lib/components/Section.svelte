<script lang="ts">
  export let as: keyof HTMLElementTagNameMap = 'section';
  export let background: 'plain' | 'tint' | 'elev' = 'plain';

  const resolveExtraClass = (): string => {
    const value = /** @type {unknown} */ ($$restProps.class);
    return typeof value === 'string' ? value : '';
  };

  $: extraClass = resolveExtraClass();
  $: classes = ['section', `section--${background}`, extraClass].filter(Boolean).join(' ');
</script>

<svelte:element this={as} {...$$restProps} class={classes}>
  <div class="section__inner">
    <slot />
  </div>
</svelte:element>

<style>
  .section {
    padding-block: var(--space-10);
  }

  .section__inner {
    max-width: var(--container-max, 72rem);
    margin-inline: auto;
    padding-inline: var(--space-4);
  }

  .section--plain {
    background: var(--bg);
  }

  .section--tint {
    background: var(--bg-elev-1);
  }

  .section--elev {
    background: var(--bg-elev-2);
  }

  @media (min-width: 48rem) {
    .section__inner {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 80rem) {
    .section__inner {
      padding-inline: var(--space-8);
    }
  }
</style>
