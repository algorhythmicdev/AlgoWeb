<script lang="ts">
  import { base as basePath } from '$app/paths';
  import SvgPlaceholder from '$lib/components/SvgPlaceholder.svelte';

  // Pass a manifest item from assets.ts, or null if missing
  export let item: { base: string; files: string[] } | null = null;
  export let label = 'Promotional video';
  export let width = 1200;
  export let height = 675; // 16:9

  const toPublicPath = (path: string | null) => {
    if (!path) return null;
    let stripped = path.replace(/^\/?static\//, '/');
    if (!stripped.startsWith('/')) stripped = `/${stripped}`;
    return `${basePath}${stripped}`;
  };

  $: file = item?.files.find((f) => /\.webm$/i.test(f)) ?? null;
  $: src = toPublicPath(file);
</script>

{#if src}
  <figure class="vp">
    <video
      class="video"
      width={width}
      height={height}
      muted
      playsinline
      controls
      preload="metadata"
      aria-label={label}
      poster=""
    >
      <source src={src} type="video/webm" />
      <!-- Optional: you can add <track> captions later -->
      Your browser does not support the video tag.
    </video>
  </figure>
{:else}
  <SvgPlaceholder label={`${label} (placeholder)`} {width} {height} radius={12} />
{/if}

<style>
  .vp { margin: 0; }
  .video {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #000;
  }
</style>
