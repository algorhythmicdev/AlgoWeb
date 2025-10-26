<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  import { nodevoyagePreviews } from '$lib/assets';
  const head = Head({ title:'NodeVoyage', description:'AI-assisted trip planning with Nodi.' });
  const highlights = ['Smart itineraries','Realtime research','Team travel playbooks','Budget tracking','Offline-ready notes'];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose">
  <h1>NodeVoyage</h1>
  <p>Trip planning co-pilot with AI support from Nodi.</p>
  <h2>Highlights</h2>
  <ul>{#each highlights as f}<li>{f}</li>{/each}</ul>
  <h2>Preview</h2>
  <GalleryPreview items={nodevoyagePreviews} />
</main>
