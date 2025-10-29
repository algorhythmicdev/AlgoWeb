<script lang="ts">
  import AssetImage from '$lib/components/AssetImage.svelte';
  export let name = '';
  export let role = '';
  export let photoBase: string | null = null;   // '/images/founders/founder-xxx'
  export let summary = '';
  export let bullets: string[] = [];
</script>

<article class="card control" style="display:grid;grid-template-columns:96px 1fr;gap:1rem;align-items:start">
  <div style="width:96px">
    <AssetImage assetBase={photoBase} alt={`${name} portrait`} width={96} height={96} radius={10} />
  </div>
  <div class="rhythm-tight">
    <h3 class="text-strong" style="margin:0">{name}</h3>
    <p class="text-secondary" style="margin:0">{role}</p>
    {#if summary}<p style="margin-top:.5rem">{summary}</p>{/if}
    {#if bullets.length}
      <ul>
        {#each bullets as b}<li>{b}</li>{/each}
      </ul>
    {/if}
  </div>
</article>
