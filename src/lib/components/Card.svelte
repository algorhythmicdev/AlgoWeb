<script lang="ts">
  export let as: string = 'div';
  export let elevation: 1 | 2 = 1;
  export let className = '';
  export let heading: string | null = null;
  export let ariaLabel: string | null = null;
</script>

<svelte:element
  this={as}
  class={`card ${elevation === 2 ? 'surface-2' : ''} ${className}`.trim()}
  aria-label={ariaLabel || undefined}
  {...$$restProps}
>
  {#if heading}
    <h3 class="text-strong" style="margin-top:0">{heading}</h3>
  {/if}
  <slot />
</svelte:element>

<style>
  .card {
    padding: 1.25rem;
  }

  @media (min-width: 960px) {
    .card {
      padding: 1.5rem;
    }
  }
</style>
