<script lang="ts">
  import { onMount } from 'svelte';
  import { tilt, magnetic, staggerReveal } from '$lib/utils/animations';

  export let magneticStrength = 0.3; // 0 to 1
  export let maxTilt = 7; // Max tilt in degrees
  export let staggerOptions: { stagger?: number; delay?: number } = {};

  let cardEl: HTMLElement;

  onMount(() => {
    const cleanupTilt = tilt(cardEl, { max: maxTilt });
    const cleanupMag = magnetic(cardEl, { strength: magneticStrength });
    let cleanupStagger: (() => void) | undefined;
    if (Object.keys(staggerOptions).length > 0) {
      cleanupStagger = staggerReveal(cardEl, staggerOptions).destroy;
    }

    return () => {
      cleanupTilt.destroy();
      cleanupMag.destroy();
      if (cleanupStagger) cleanupStagger();
    };
  });
</script>

<div bind:this={cardEl} class="glass-card magnetic-card {$$props.class || ''}" data-variant={$$props['data-variant'] || ''}>
  <slot />
</div>

<style>
  .magnetic-card {
    /* Add any specific styling for the magnetic card here, if needed */
  }
</style>