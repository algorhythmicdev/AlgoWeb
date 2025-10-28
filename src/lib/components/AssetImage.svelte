<script lang="ts">
  import { base as appBase } from '$app/paths';
  import SvgPlaceholder from './SvgPlaceholder.svelte';

  // Was: export let base
  export let assetBase: string | null = null; // '/images/...'(no extension), under static/
  export let alt = 'Image';
  export let width = 1200;
  export let height = 750;
  export let radius = 12;
</script>

{#if assetBase}
  <picture>
    <!-- Most efficient first -->
    <source srcset={`${appBase}${assetBase}.webp`} type="image/webp" />
    <!-- PNG (both cases) -->
    <source srcset={`${appBase}${assetBase}.png`}  type="image/png" />
    <source srcset={`${appBase}${assetBase}.PNG`}  type="image/png" />
    <!-- JPEG (both cases) -->
    <source srcset={`${appBase}${assetBase}.jpg`}  type="image/jpeg" />
    <source srcset={`${appBase}${assetBase}.JPG`}  type="image/jpeg" />
    <!-- Fallback (may 404 if only JPG exists; that's OK if <source> hits) -->
    <img
      src={`${appBase}${assetBase}.png`}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      style="display:block;border-radius:{radius}px;border:1px solid var(--glass-stroke)"
    />
  </picture>
{:else}
  <SvgPlaceholder label={alt} {width} {height} {radius} />
{/if}
