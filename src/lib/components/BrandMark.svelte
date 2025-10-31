<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { brand } from '$lib/presentAssets';

  const pick = (pattern: RegExp) => brand.find((b) => pattern.test(b)) || null;
  const icon = pick(/logo[-_]?icon/i) || brand.find((b) => /icon/i.test(b)) || null;
  const main = pick(/logo[-_]?main/i);
  const white = pick(/logo[-_]?white/i);
  const chosen = icon || main || white;

  const resolve = (path: string | null) => {
    if (!path) return null;
    if (/^(?:https?:|data:|\/\/)/i.test(path)) return path;
    if (path.startsWith('/')) return appBase ? `${appBase}${path}` : path;
    const prefix = appBase ? `${appBase}/` : '/';
    return `${prefix}${path.replace(/^\/+/, '')}`;
  };

  const homeHref = appBase || '/';
  $: src = resolve(chosen);
</script>

<a href={homeHref} class="brand" aria-label="Algorhythmics Home">
  {#if src}
    <img src={src} alt="Algorhythmics" class="brand-logo" />
  {:else}
    <div class="brand-fallback" aria-hidden="true"></div>
  {/if}
</a>

<style>
  .brand { 
    display: inline-flex; 
    align-items: center; 
    gap: .5rem; 
    text-decoration: none;
    height: 40px;
  }
  .brand-logo { 
    display: block; 
    height: 40px;
    width: auto;
    max-width: 200px;
    object-fit: contain;
    border-radius: 4px;
  }
  .brand-fallback {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background: var(--primary);
  }
</style>
