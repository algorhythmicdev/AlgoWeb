<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from '$lib/components/SvgPlaceholder.svelte';
  export let videoBase: string | null = null; // '/videos/foo' no extension
  export let label = 'Promotional video';
  export let width = 1200;
  export let height = 675;
  export let decorative = false;
  export let posterBase: string | null = null; // '/images/foo-poster' optional
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
      poster={posterBase ? `${appBase}${posterBase}.png` : undefined}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? 'true' : 'false'}
    >
      <source src={`${appBase}${videoBase}.webm`} type="video/webm" />
      <source src={`${appBase}${videoBase}.WEBM`} type="video/webm" />
    </video>
  </figure>
{:else}
  <SvgPlaceholder label={`${label} (placeholder)`} {width} {height} radius={12} />
{/if}

<style>
  .video{display:block;width:100%;height:auto;border:1px solid var(--glass-stroke);border-radius:12px;background:#000}
</style>
