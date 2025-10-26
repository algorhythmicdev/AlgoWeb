<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  const head = Head({ title: 'Ideonautix', description: 'Startup education & productivity toolkit.' });

  const features = ['Pitch Assistant','Competitive Intelligence','Pomodoro Coach','Smart Standups','Revenue Dashboard'];
  const gallery = [
    { base: '/images/ideonautix/preview-1', alt: 'Ideonautix preview 1', pending: true },
    { base: '/images/ideonautix/preview-2', alt: 'Ideonautix preview 2', pending: true }
  ];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>Ideonautix</h1>
  <p>Overview and mission in plain language. Built for students, founders, and teams.</p>

  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>

  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
