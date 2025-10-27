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
    <source srcset={`${appBase}${assetBase}.webp`} type="image/webp" />
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
