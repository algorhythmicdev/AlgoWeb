<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Education',
    description: 'Practical AI programs for schools and universities.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'education', FALLBACK, activeLocale);
  $: head = Head(meta);
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/education')}>
  {@html hreflangLinks(data.pathname ?? '/education')}
</svelte:head>

<main id="main">
  <h1>Education</h1>
  <p>We’re preparing plain-language, easy-to-run AI programs for schools and universities in Latvia. Built with real, hands-on outcomes.</p>

  <section>
    <h2>Focus</h2>
    <p>Lesson kits, teacher training, and community meetups.</p>
  </section>
</main>
