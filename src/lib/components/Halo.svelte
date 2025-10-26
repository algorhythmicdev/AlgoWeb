<script lang="ts">
  import { onMount } from 'svelte';
  export let intensity = 1; // 0.5..1.5
  let el: HTMLElement;

  onMount(() => {
    el.style.setProperty('--halo-scale', String(intensity));
    const prefersReduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // static halo only

    function move(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${mx}%`);
      el.style.setProperty('--my', `${my}%`);
      el.style.setProperty('--halo-scale', String(intensity));
    }
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  });
</script>

<div bind:this={el} class="halo-layer">
  <slot />
</div>
