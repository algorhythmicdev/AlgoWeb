<script lang="ts">
  type SectionTone = 'plain' | 'tint' | 'elev';

  const ALLOWED_TONES: readonly SectionTone[] = ['plain', 'tint', 'elev'];

  export let as: keyof HTMLElementTagNameMap = 'section';
  export let bg: SectionTone = 'plain';
  export let background: SectionTone | undefined = undefined;

  const resolveExtraClass = (): string => {
    const value = /** @type {unknown} */ ($$restProps.class);
    return typeof value === 'string' ? value : '';
  };

  const resolveTone = (): SectionTone => {
    if (background && ALLOWED_TONES.includes(background)) {
      return background;
    }

    return bg;
  };

  $: extraClass = resolveExtraClass();
  $: tone = resolveTone();
  $: classes = ['section', `section--${tone}`, extraClass].filter(Boolean).join(' ');
</script>

<svelte:element this={as} {...$$restProps} class={classes}>
  <div class="section__inner">
    <slot />
  </div>
</svelte:element>

<style>
  .section {
    padding-block: var(--space-10);
    background: transparent;
  }

  .section__inner {
    max-width: var(--container-max, 72rem);
    margin-inline: auto;
    padding-inline: var(--space-4);
  }

  .section--tint {
    background: var(--bg-elev-1);
  }

  .section--elev {
    background: var(--bg-elev-2);
  }

  .section--plain {
    background: transparent;
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
