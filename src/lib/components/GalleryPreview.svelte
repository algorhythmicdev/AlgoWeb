<script lang="ts">
  import AssetImage from '$lib/components/AssetImage.svelte';

  export let items: { base: string | null; alt: string; w?: number; h?: number }[] = [];
</script>

<section class="section">
  <div class="grid">
    {#each items as i}
      <figure class="card glass glossy">
        <AssetImage base={i.base} alt={i.alt} width={i.w ?? 1200} height={i.h ?? 750} />
      </figure>
    {/each}
  </div>
</section>
