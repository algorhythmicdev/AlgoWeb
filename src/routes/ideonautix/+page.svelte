<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Ideonautix',
    description: 'Startup education & productivity toolkit.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'ideonautix', FALLBACK, activeLocale);
  $: head = Head(meta);

  const features = [
    'Pitch Assistant',
    'Competitive Intelligence',
    'Pomodoro Coach',
    'Smart Standups',
    'Revenue Dashboard'
  ];
  const gallery = [
    {
      title: 'Workspace dashboard',
      description: 'Daily focus tiles with smart reminders for student founders.'
    },
    {
      title: 'Pitch assistant outline',
      description: 'Step-by-step prompts that adapt to team progress checkpoints.'
    }
  ];
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/ideonautix')}>
  {@html hreflangLinks(data.pathname ?? '/ideonautix')}
</svelte:head>

<main id="main">
  <h1>Ideonautix</h1>
  <p>Overview and mission in plain language. Built for students, founders, and teams.</p>

  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>

  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
