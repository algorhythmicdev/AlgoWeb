<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Cookies',
    description: 'Cookie usage and choices.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'cookies', FALLBACK, activeLocale);
  $: head = Head(meta);
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/cookies')}>
  {@html hreflangLinks(data.pathname ?? '/cookies')}
</svelte:head>

<main id="main">
  <h1>Cookies</h1>
  <p>Cookie usage placeholder with consent categories.</p>
</main>
