<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from '$lib/components/SvgPlaceholder.svelte';

  export let videoBase: string | null = null; // '/videos/xxx' (no extension), under static/
  export let label = 'Promotional video';
  export let width = 1200;
  export let height = 675;
  export let decorative = false; // if true, hide from a11y tree
</script>

{#if videoBase}
  <figure style="margin:0">
    <video
      class="video"
      width={width}
      height={height}
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? 'true' : 'false'}
    >
      <source src={`${appBase}${videoBase}.webm`} type="video/webm" />
    </video>
  </figure>
{:else}
  <SvgPlaceholder label={`${label} (placeholder)`} {width} {height} radius={12} />
{/if}

<style>
  .video{
    display:block;width:100%;height:auto;border:1px solid var(--glass-stroke);
    border-radius:12px;background:#000
  }
</style>
