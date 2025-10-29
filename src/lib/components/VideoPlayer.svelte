<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from '$lib/components/SvgPlaceholder.svelte';

  export let src: string | null = null;
  export let poster: string | null = null;
  export let ratio = '16 / 9';
  export let className = '';
  export let autoplay = true;
  export let loop = true;
  export let muted = true;
  export let label = 'Promotional video';
  export let decorative = false;
  export let width = 1200;
  export let height = 675;

  const externalPattern = /^(?:https?:|data:|\/\/)/i;

  const resolvePath = (path: string | null) => {
    if (!path) return null;
    if (externalPattern.test(path)) return path;
    if (path.startsWith('/')) return appBase ? `${appBase}${path}` : path;
    const prefix = appBase ? `${appBase}/` : '/';
    return `${prefix}${path.replace(/^\/+/, '')}`;
  };

  $: resolvedSrc = resolvePath(src);
  $: resolvedPoster = resolvePath(poster);
  $: ariaLabel = decorative ? undefined : label;
  $: ariaHidden = decorative ? 'true' : undefined;
</script>

<div class={`video-frame ${className}`} style={`--ratio:${ratio}`}>
  {#if resolvedSrc}
    <video
      src={resolvedSrc}
      poster={resolvedPoster ?? undefined}
      playsinline
      {muted}
      {loop}
      {autoplay}
      controls={false}
      preload="metadata"
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    ></video>
  {:else}
    <SvgPlaceholder label={`${label} (placeholder)`} {width} {height} radius={16} />
  {/if}
</div>

<style>
  .video-frame{
    aspect-ratio: var(--ratio);
    width:100%;
    border-radius:16px;
    overflow:hidden;
    background:var(--bg-elev-2);
    display:block;
  }
  .video-frame video{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
    background:#000;
  }
  .video-frame :global(svg){
    width:100%;
    height:100%;
  }
</style>
