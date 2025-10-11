<script lang="ts">
  import { onMount } from 'svelte';
  import { tilt, magnetic, staggerReveal } from '$lib/utils/animations';

  export let magneticStrength = 0.3; // 0 to 1
  export let maxTilt = 7; // Max tilt in degrees
  export let interactive = true;
  export let staggerOptions: { stagger?: number; delay?: number } = {};
  export let variant: 'halo' | 'grid' | 'line' | 'particles' | undefined = undefined;

  let cardEl: HTMLElement;
  let restProps: Record<string, any> = {};
  let forwardedVariant: string | undefined;

  onMount(() => {
    const tiltAction = interactive ? tilt(cardEl, { max: maxTilt }) : null;
    const magneticAction = interactive ? magnetic(cardEl, { strength: magneticStrength }) : null;
    let cleanupStagger: (() => void) | undefined;
    if (Object.keys(staggerOptions).length > 0) {
      cleanupStagger = staggerReveal(cardEl, staggerOptions).destroy;
    }

    return () => {
      tiltAction?.destroy?.();
      magneticAction?.destroy?.();
      if (cleanupStagger) cleanupStagger();
    };
  });

  $: {
    const { 'data-variant': dataVariant, ...rest } = $$restProps;
    restProps = rest;
    const attrVariant = typeof dataVariant === 'string' ? dataVariant.trim() : undefined;
    forwardedVariant = variant ?? (attrVariant && attrVariant.length ? attrVariant : undefined);
  }
</script>

<div
  bind:this={cardEl}
  class="os-window magnetic-card {$$props.class || ''}"
  data-variant={forwardedVariant}
  {...restProps}
>
  <slot />
</div>
