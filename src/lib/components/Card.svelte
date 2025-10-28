<script lang="ts">
  export let as: 'div' | 'section' | 'article' | 'aside' = 'div';
  export let heading: string | null = null;
  export let ariaLabel: string | null = null;
</script>

<svelte:element this={as}
  class="card surface-2 control rhythm"
  aria-label={ariaLabel || undefined}
  style="padding:1rem;border-radius:12px"
>
  {#if heading}<h3 class="text-strong">{heading}</h3>{/if}
  <slot />
</svelte:element>
