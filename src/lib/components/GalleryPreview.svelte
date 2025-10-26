<script lang="ts">
  import AssetImage from './AssetImage.svelte';
  import { reveal } from '$lib/directives/reveal';
  import type { AssetEntry } from '$lib/assets';
  export let items: AssetEntry[] = [];
</script>

<section class="section">
  <div class="grid">
    {#each items as i}
      <figure class="card glass glossy" use:reveal>
        <AssetImage entry={i} />
      </figure>
    {/each}
  </div>
</section>
