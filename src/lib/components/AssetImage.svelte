<script lang="ts">
  import { base } from '$app/paths';
  import SvgPlaceholder from './SvgPlaceholder.svelte';
  import { findAsset } from '$lib/assets';
  import type { AssetEntry, AssetCollectionKey } from '$lib/assets';

  export let basePath: string | null = null; // e.g. '/images/ideonautix/preview-1'
  export let collection: AssetCollectionKey | null = null;
  export let item: string | number | null = null;
  export let entry: AssetEntry | null = null;
  export let alt = 'Image';
  export let width: number | null = null;
  export let height: number | null = null;
  export let radius = 12;

  let loaded = false;
  let failed = false;
  let resolvedEntry: AssetEntry | null = null;
  let resolvedBasePath: string | null = null;
  let resolvedAlt = alt;
  let resolvedWidth = width ?? 1200;
  let resolvedHeight = height ?? 750;
  let baseTracker: string | null = null;

  const onLoad = () => (loaded = true);
  const onError = () => {
    failed = true;
    loaded = false;
  };

  $: {
    const fromCollection = collection ? findAsset(collection, item ?? undefined) ?? null : null;
    resolvedEntry = entry ?? fromCollection;
  }

  $: resolvedBasePath = resolvedEntry?.base ?? basePath;
  $: resolvedAlt = (resolvedEntry?.alt ?? alt ?? '').trim() || 'Image';
  $: resolvedWidth = width ?? resolvedEntry?.w ?? 1200;
  $: resolvedHeight = height ?? resolvedEntry?.h ?? 750;

  $: {
    const next = resolvedBasePath ?? null;
    if (next !== baseTracker) {
      baseTracker = next;
      loaded = false;
      failed = false;
    }
  }

  $: showPlaceholder = !resolvedBasePath || failed;
</script>

{#if showPlaceholder}
  <SvgPlaceholder label={resolvedAlt} width={resolvedWidth} height={resolvedHeight} {radius} />
{:else}
  <picture class="ai-wrap" data-loaded={loaded} style={`border-radius:${radius}px`}>
    <source srcset={`${base}${resolvedBasePath}.webp`} type="image/webp" />
    <img
      src={`${base}${resolvedBasePath}.png`}
      alt={resolvedAlt}
      width={resolvedWidth}
      height={resolvedHeight}
      loading="lazy"
      on:load={onLoad}
      on:error={onError}
      style={`display:block;border-radius:${radius}px;border:1px solid var(--border)`}
    />
  </picture>
{/if}

<style>
  .ai-wrap {
    position: relative;
    display: block;
    overflow: hidden;
    border-radius: 12px;
  }
  .ai-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.075) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    animation: shimmer 1.8s infinite;
  }
  .ai-wrap[data-loaded="true"]::before {
    display: none;
  }
  .ai-wrap img {
    filter: blur(6px);
    transform: scale(1.01);
    transition: filter var(--dur) var(--ease), transform var(--dur) var(--ease);
  }
  .ai-wrap[data-loaded="true"] img {
    filter: blur(0);
    transform: scale(1);
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-wrap::before {
      animation: none;
    }
    .ai-wrap img {
      transition: none;
      filter: none;
      transform: none;
    }
  }
</style>
