<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Privacy',
    description: 'How we handle your data in plain language.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'privacy', FALLBACK, activeLocale);
  $: head = Head(meta);
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/privacy')}>
  {@html hreflangLinks(data.pathname ?? '/privacy')}
</svelte:head>

<main id="main">
  <h1>Privacy</h1>
  <p>Plain-language privacy policy placeholder.</p>
</main>
