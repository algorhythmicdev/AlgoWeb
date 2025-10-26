<script lang="ts">
  import { onMount } from 'svelte';
  export let intensity = 1;
  let el: HTMLElement;

  onMount(() => {
    const prefersReduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0, mx = 50, my = 50, dirty = false;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width) * 100;
      my = ((e.clientY - rect.top) / rect.height) * 100;
      if (!dirty) {
        dirty = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      el.style.setProperty('--mx', `${mx}%`);
      el.style.setProperty('--my', `${my}%`);
      el.style.setProperty('--halo-scale', String(intensity));
      dirty = false;
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  });
</script>

<div bind:this={el} class="halo-layer">
  <slot />
</div>
