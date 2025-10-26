<script lang="ts">
  import { page } from '$app/stores';
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  const head = Head({ title: 'NodeVoyage', description: 'AI-assisted trip planning with Nodi.' });

  const features = [
    'Nodi-aided planning',
    'Live map & timeline feel',
    'Collaboration',
    'Sustainability notes',
    'Mobile capture ideas'
  ];
  const gallery = [
    { src: '/images/products/nodevoyage-hero.svg', alt: 'NodeVoyage hero illustration' },
    { src: '/images/placeholders/platform-nodevoyage.svg', alt: 'NodeVoyage platform preview illustration' }
  ];
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor($page.url.pathname)}>
  {@html hreflangLinks($page.url.pathname)}
</svelte:head>

<main id="main">
  <h1>NodeVoyage</h1>
  <p>Overview and mission in plain language. Focused on clarity and collaboration.</p>

  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>

  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
