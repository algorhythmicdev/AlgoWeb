<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Terms',
    description: 'Simple terms for using our website.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'terms', FALLBACK, activeLocale);
  $: head = Head(meta);
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/terms')}>
  {@html hreflangLinks(data.pathname ?? '/terms')}
</svelte:head>

<main id="main">
  <h1>Terms</h1>
  <p>Simple terms placeholder.</p>
</main>
