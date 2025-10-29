<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from './SvgPlaceholder.svelte';

  // e.g. '/images/partners/liaa' (no extension)
  export let assetBase: string | null = null;
  export let alt = 'Image';
  export let width = 1200;
  export let height = 750;
  export let radius = 12;
  export let sizes = '(min-width: 1024px) 800px, 100vw'; // responsive hint
</script>

{#if assetBase}
  <picture>
    <!-- try modern first -->
    <source srcset={`${appBase}${assetBase}.webp`} type="image/webp" />
    <source srcset={`${appBase}${assetBase}.WEBP`} type="image/webp" />
    <!-- png variants -->
    <source srcset={`${appBase}${assetBase}.png`} type="image/png" />
    <source srcset={`${appBase}${assetBase}.PNG`} type="image/png" />
    <!-- jpg variants -->
    <source srcset={`${appBase}${assetBase}.jpg`} type="image/jpeg" />
    <source srcset={`${appBase}${assetBase}.JPG`} type="image/jpeg" />
    <!-- fallback (may 404 if only jpg exists; ok if a <source> hit succeeds) -->
    <img
      src={`${appBase}${assetBase}.png`}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      style="display:block;border-radius:{radius}px;border:1px solid var(--glass-stroke)"
    />
  </picture>
{:else}
  <SvgPlaceholder label={alt} {width} {height} {radius} />
{/if}
