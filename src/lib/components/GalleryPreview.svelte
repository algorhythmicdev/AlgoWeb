<script lang="ts">
  import AssetImage from '$lib/components/AssetImage.svelte';

  export let items: { src: string | null; alt: string; w?: number; h?: number }[] = [];
</script>

<section class="section">
  <div class="grid">
    {#each items as i}
      <figure class="card surface-2 control glass glossy">
        <AssetImage src={i.src} alt={i.alt} width={i.w ?? 1200} height={i.h ?? 750} />
      </figure>
    {/each}
  </div>
</section>
