<script lang="ts">
  import { page } from '$app/stores';
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  const head = Head({ title: 'Ideonautix', description: 'Startup education & productivity toolkit.' });

  const features = [
    'Pitch Assistant',
    'Competitive Intelligence',
    'Pomodoro Coach',
    'Smart Standups',
    'Revenue Dashboard'
  ];
  const gallery = [
    { src: '/images/products/ideonautix-hero.svg', alt: 'Ideonautix hero illustration' },
    { src: '/images/placeholders/platform-ideonautix.svg', alt: 'Ideonautix platform preview illustration' }
  ];
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor($page.url.pathname)}>
  {@html hreflangLinks($page.url.pathname)}
</svelte:head>

<main id="main">
  <h1>Ideonautix</h1>
  <p>Overview and mission in plain language. Built for students, founders, and teams.</p>

  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>

  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
