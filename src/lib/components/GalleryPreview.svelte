<script lang="ts">
  import { base } from '$app/paths';

  type GalleryItem = {
    alt: string;
    width?: number;
    height?: number;
    base?: string;
    src?: string;
  };

  export let items: GalleryItem[] = [];
  const resolve = (path: string) => `${base}${path}`;
</script>

<div class="grid section">
  {#each items as item}
    <figure class="card glass">
      {#if item.base}
        <picture>
          <source srcset={resolve(`${item.base}.webp`)} type="image/webp" />
          <img
            src={resolve(`${item.base}.png`)}
            alt={item.alt}
            loading="lazy"
            width={item.width ?? 800}
            height={item.height ?? 500}
          />
        </picture>
      {:else if item.src}
        <img
          src={resolve(item.src)}
          alt={item.alt}
          loading="lazy"
          width={item.width ?? 800}
          height={item.height ?? 500}
        />
      {:else}
        <figcaption>{item.alt}</figcaption>
      {/if}
    </figure>
  {/each}
</div>
