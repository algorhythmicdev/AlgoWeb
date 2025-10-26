<script lang="ts">
  import { withBase } from '$utils/paths';

  type GalleryItem = {
    base?: string | null;
    alt: string;
    width?: number;
    height?: number;
    pending?: boolean;
  };

  export let items: GalleryItem[] = [];

  let missing = new Set<string>();

  const canonicalPath = (item: GalleryItem): string => item.base?.replace(/^\/+/, '') ?? 'asset';

  const srcWithBase = (basePath: string, extension: 'png' | 'webp'): string => {
    const path = `${basePath}.${extension}`;
    return withBase(path) ?? path;
  };

  const markMissing = (basePath: string | null | undefined) => {
    if (!basePath || missing.has(basePath)) return;
    const next = new Set(missing);
    next.add(basePath);
    missing = next;
  };

  const shouldRenderAsset = (item: GalleryItem): item is GalleryItem & { base: string } => {
    if (!item.base || item.pending) return false;
    return !missing.has(item.base);
  };
</script>

<div class="gallery grid">
  {#each items as item (item.base ?? item.alt)}
    <figure class="card glass">
      {#if shouldRenderAsset(item)}
        <picture>
          <source srcset={srcWithBase(item.base, 'webp')} type="image/webp" />
          <img
            src={srcWithBase(item.base, 'png')}
            alt={item.alt}
            loading="lazy"
            width={item.width || 800}
            height={item.height || 500}
            on:error={() => markMissing(item.base)}
          />
        </picture>
      {:else}
        <div class="fallback" role="img" aria-label={item.alt}>
          <span>{item.alt}</span>
          <small>{canonicalPath(item)} • {item.width || 800}×{item.height || 500} asset pending</small>
        </div>
      {/if}
    </figure>
  {/each}
</div>

<style>
  .fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    text-align: center;
    min-height: 220px;
    padding: 1.5rem;
    border: 1px dashed var(--border);
    border-radius: 12px;
    color: var(--text-subtle);
    background: color-mix(in oklab, var(--surface) 88%, transparent);
  }

  .fallback span {
    font-weight: 600;
    color: var(--text);
  }

  .fallback small {
    font-size: 0.8125rem;
    letter-spacing: 0.01em;
    opacity: 0.7;
  }
</style>
