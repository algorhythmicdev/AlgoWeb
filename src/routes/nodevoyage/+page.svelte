<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  const head = Head({ title: 'NodeVoyage', description: 'AI-assisted trip planning with Nodi.' });

  const features = [
    'Nodi-aided planning',
    'Live map & timeline feel',
    'Collaboration',
    'Sustainability notes',
    'Mobile capture/AR ideas',
    'Community concept'
  ];
  const gallery = [
    {
      title: 'Trip canvas',
      description: 'Nodi surfaces logistics, notes, and collaborators on a single board.'
    },
    {
      title: 'Timeline explorer',
      description: 'Preview the itinerary with sustainability callouts and local tips.'
    }
  ];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>NodeVoyage</h1>
  <p>Overview and mission in plain language. Focused on clarity and collaboration.</p>

  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>

  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
