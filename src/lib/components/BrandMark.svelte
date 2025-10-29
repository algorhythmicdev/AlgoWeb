<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { brand } from '$lib/presentAssets';
  // try to pick suitable variants by filename
  const icon   = brand.find(b => /logo[-_]?icon$/i.test(b))   || brand.find(b => /icon/i.test(b)) || null;
  const main   = brand.find(b => /logo[-_]?main$/i.test(b))   || null;
  const white  = brand.find(b => /logo[-_]?white$/i.test(b))  || null;

  // We'll render a single <img> that survives all themes:
  // Prefer icon (usually squared), else main, else white.
  const chosen = icon || main || white;
  const homeHref = appBase || '/';
</script>

<a href={homeHref} class="brand" aria-label="Algorhythmics Home">
  {#if chosen}
    <img src={`${appBase}${chosen}.png`} alt="Algorhythmics" width="28" height="28" />
  {:else}
    <div style="width:28px;height:28px;border-radius:6px;background:var(--primary);" aria-hidden="true"></div>
  {/if}
</a>

<style>
  .brand { display:inline-flex; align-items:center; gap:.5rem; text-decoration:none; }
  .brand img { display:block; border-radius:6px; }
</style>
