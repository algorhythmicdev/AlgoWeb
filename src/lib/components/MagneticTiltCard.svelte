<script>
  import { onMount } from 'svelte';
  import { tilt, magnetic, staggerReveal } from '$lib/utils/animations';

  export let magneticStrength = 0.3; // 0 to 1
  export let maxTilt = 7; // Max tilt in degrees
  /** @type {{ stagger?: number; delay?: number }} */
  export let staggerOptions = {};
  export let surface = 'window';
  export let variant = '';

  /** @type {HTMLElement | null} */
  let cardEl = null;
  /** @type {Record<string, any>} */
  let restProps = {};
  /** @type {string} */
  let incomingClass = '';
  /** @type {(() => void) | null} */
  let cleanupStagger = null;
  $: {
    const { class: restClass = '', ...rest } = $$restProps;
    incomingClass = restClass;
    restProps = rest;
  }
  $: classes = ['os-window', 'magnetic-card', incomingClass].filter(Boolean).join(' ');

  onMount(() => {
    if (!cardEl) {
      return () => {};
    }

    const cleanupTilt = tilt(cardEl, { max: maxTilt });
    const cleanupMag = magnetic(cardEl, { strength: magneticStrength });
    cleanupStagger = null;
    if (Object.keys(staggerOptions).length > 0) {
      const staggerAction = staggerReveal(cardEl, staggerOptions);
      if (staggerAction && typeof staggerAction.destroy === 'function') {
        cleanupStagger = () => staggerAction.destroy();
      }
    }

    return () => {
      cleanupTilt?.destroy?.();
      cleanupMag?.destroy?.();
      if (cleanupStagger) cleanupStagger();
    };
  });
</script>

<div
  bind:this={cardEl}
  class={classes}
  data-surface={surface}
  data-variant={variant}
  {...restProps}
>
  <slot />
</div>
