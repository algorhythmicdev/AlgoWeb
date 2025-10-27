<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from '$lib/components/SvgPlaceholder.svelte';

  // Was: export let base
  export let videoBase: string | null = null; // '/videos/...'(no extension), under static/
  export let label = 'Promotional video';
  export let width = 1200;
  export let height = 675; // 16:9
</script>

{#if videoBase}
  <figure style="margin:0">
    <video
      class="video"
      width={width}
      height={height}
      muted
      playsinline
      controls
      preload="metadata"
      aria-label={label}
    >
      <source src={`${appBase}${videoBase}.webm`} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  </figure>
{:else}
  <SvgPlaceholder label={`${label} (placeholder)`} {width} {height} radius={12} />
{/if}

<style>
  .video {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--glass-stroke);
    border-radius: 12px;
    background: #000;
  }
</style>
