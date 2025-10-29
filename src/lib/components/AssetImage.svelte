<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from './SvgPlaceholder.svelte';

  export let src: string | null = null;
  export let alt = '';
  /** e.g. '1 / 1', '4 / 3', '16 / 9'; null = natural */
  export let ratio: string | null = null;
  export let fit: 'cover' | 'contain' | 'scale-down' | 'none' = 'cover';
  export let className = '';
  export let width = 1200;
  export let height = 750;
  export let radius = 12;

  const externalPattern = /^(?:https?:|data:|\/\/)/i;

  const resolvePath = (path: string) => {
    if (!path) return null;
    if (externalPattern.test(path)) return path;
    if (path.startsWith('/')) return appBase ? `${appBase}${path}` : path;
    const prefix = appBase ? `${appBase}/` : '/';
    return `${prefix}${path.replace(/^\/+/, '')}`;
  };

  $: resolvedSrc = src ? resolvePath(src) : null;
  $: hasRatio = Boolean(ratio);
  $: objectFitStyle = `object-fit:${fit}`;
</script>

<figure class={`asset ${className}`} data-has-ratio={hasRatio ? '1' : undefined} style={hasRatio ? `--ratio:${ratio}` : ''}>
  {#if resolvedSrc}
    <img src={resolvedSrc} alt={alt} loading="lazy" decoding="async" style={objectFitStyle} />
  {:else}
    <SvgPlaceholder label={alt || 'Image placeholder'} {width} {height} {radius} />
  {/if}
</figure>

<style>
  .asset{
    width:100%;
    display:block;
    border-radius:12px;
    overflow:hidden;
    background:var(--bg-elev-2);
  }
  .asset[data-has-ratio]{ aspect-ratio: var(--ratio); }
  .asset img{
    width:100%;
    height:100%;
    display:block;
  }
  .asset[data-has-ratio] img{ height:100%; }
  .asset:not([data-has-ratio]) img{ height:auto; }
</style>
