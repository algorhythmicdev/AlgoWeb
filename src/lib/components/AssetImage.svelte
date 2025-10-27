<script lang="ts">
  import { base as basePath } from '$app/paths';
  import manifest from '$lib/assets.generated.json';
  import SvgPlaceholder from './SvgPlaceholder.svelte';

  export let base: string | null = null; // e.g., '/static/images/ideonautix/preview-1'
  export let alt = 'Image';
  export let width = 1200;
  export let height = 750;
  export let radius = 12;

  type Item = { base: string; files: string[] };
  type Manifest = { images: Item[]; videos: Item[] };
  const data = manifest as Manifest;
  const items = new Map(data.images.map((item) => [item.base, item]));
  let loaded = false;
  const onLoad = () => (loaded = true);

  const toPublicPath = (path: string | null) => {
    if (!path) return null;
    let stripped = path.replace(/^\/?static\//, '/');
    if (!stripped.startsWith('/')) stripped = `/${stripped}`;
    return `${basePath}${stripped}`;
  };

  const getItem = () => (typeof base === 'string' ? items.get(base) ?? null : null);

  $: item = getItem();
  $: webpSrc = toPublicPath(item?.files.find((f) => /\.webp$/i.test(f)) ?? null);
  $: pngSrc = toPublicPath(item?.files.find((f) => /\.png$/i.test(f)) ?? null);
  $: svgSrc = toPublicPath(item?.files.find((f) => /\.svg$/i.test(f)) ?? null);
  $: imgSrc = pngSrc ?? webpSrc ?? svgSrc;
  const hasBase = Boolean(imgSrc);
</script>

{#if hasBase}
  <picture class="ai-wrap" data-loaded={loaded}>
    {#if webpSrc}
      <source srcset={webpSrc} type="image/webp" />
    {/if}
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      on:load={onLoad}
      style={`display:block;border-radius:${radius}px;border:1px solid var(--border)`}
    />
  </picture>
{:else}
  <SvgPlaceholder label={alt} width={width} height={height} radius={radius} />
{/if}

<style>
  .ai-wrap { position: relative; display: block; overflow: hidden; border-radius: 12px; }
  .ai-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.075) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%); animation: shimmer 1.8s infinite;
  }
  .ai-wrap[data-loaded="true"]::before { display: none; }
  .ai-wrap img { filter: blur(6px); transform: scale(1.01);
    transition: filter var(--dur) var(--ease), transform var(--dur) var(--ease); }
  .ai-wrap[data-loaded="true"] img { filter: blur(0); transform: scale(1); }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
</style>
