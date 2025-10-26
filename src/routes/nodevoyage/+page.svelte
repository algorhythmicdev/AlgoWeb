<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'NodeVoyage',
    description: 'AI-assisted trip planning with Nodi.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'nodevoyage', FALLBACK, activeLocale);
  $: head = Head(meta);

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

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/nodevoyage')}>
  {@html hreflangLinks(data.pathname ?? '/nodevoyage')}
</svelte:head>

<main id="main">
  <h1>NodeVoyage</h1>
  <p>Overview and mission in plain language. Focused on clarity and collaboration.</p>

  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>

  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
