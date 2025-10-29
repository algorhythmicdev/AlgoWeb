<script lang="ts">
  import { asset } from '$app/paths';
  import SvgPlaceholder from './SvgPlaceholder.svelte';

  export let src: string | null;     // e.g. '/founders/founder-slaff.png'
  export let alt = '';
  export let ratio: '16x9'|'1x1'|'4x3' | null = null;
  export let fit: 'cover'|'contain' = 'cover';
  export let className = '';
  $: full = src ? asset(src) : null;  // works under /AlgoWeb too
  $: ratioClass = ratio ? `ratio-${ratio}` : '';
  $: fitClass   = fit === 'contain' ? 'media-contain' : 'media-cover';
</script>

<div class={`img-shell ${ratioClass} ${className}`} data-asset={src || ''}>
  {#if full}
    <img src={full} alt={alt} class={fitClass} loading="lazy" decoding="async" />
  {:else}
    <SvgPlaceholder label={alt || 'Image placeholder'} width={1200} height={750} radius={16} />
  {/if}
</div>

<style>
  .img-shell { width: 100%; border-radius: var(--radius-xl); overflow: hidden; background: var(--bg-elev-2); }
</style>
