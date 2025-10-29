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
    <img src={src} alt="Algorhythmics" width="28" height="28" />
  {:else}
    <div style="width:28px;height:28px;border-radius:6px;background:var(--primary);" aria-hidden="true"></div>
  {/if}
</a>

<style>
  .brand { display:inline-flex; align-items:center; gap:.5rem; text-decoration:none; }
  .brand img { display:block; border-radius:6px; }
</style>
