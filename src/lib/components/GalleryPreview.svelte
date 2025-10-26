<script lang="ts">
  import { base } from '$app/paths';

  type GallerySource = { srcset: string; type?: string };
  type GalleryItem = {
    src?: string | null;
    sources?: GallerySource[];
    alt: string;
    width?: number;
    height?: number;
    pending?: boolean;
  };

  export let items: GalleryItem[] = [];

  let missing = new Set<string>();

  const withBasePath = (path: string | null | undefined): string | null => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalized}`;
  };

  const markMissing = (path: string | null | undefined) => {
    if (!path || missing.has(path)) return;
    missing = new Set([...missing, path]);
  };

  const isReady = (item: GalleryItem): item is GalleryItem & { src: string } => {
    if (!item.src || item.pending) return false;
    return !missing.has(item.src);
  };

  const resolvedSources = (item: GalleryItem) =>
    item.sources?.map((source) => ({
      ...source,
      srcset: withBasePath(source.srcset) ?? source.srcset
    }));
</script>

<div class="gallery grid">
  {#each items as item (item.src ?? item.alt)}
    <figure class="card glass">
      {#if isReady(item)}
        <picture>
          {#if item.sources}
            {#each resolvedSources(item) as source}
              <source srcset={source.srcset} type={source.type} />
            {/each}
          {/if}
          <img
            src={withBasePath(item.src) ?? item.src}
            alt={item.alt}
            loading="lazy"
            width={item.width || 800}
            height={item.height || 500}
            on:error={() => markMissing(item.src)}
          />
        </picture>
      {:else}
        <div class="fallback" role="img" aria-label={item.alt}>
          <span>{item.alt}</span>
          <small>{item.width || 800}×{item.height || 500} preview unavailable</small>
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
