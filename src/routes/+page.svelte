<script lang="ts">
  import { Head } from '$lib/seo';
  import Hero from '$lib/components/Hero.svelte';
  import ProductCards from '$lib/components/ProductCards.svelte';
  import Teasers from '$lib/components/Teasers.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { withBase } from '$utils/paths';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Home',
    description: 'AI consulting + practical tools: NodeVoyage and Ideonautix.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'home', FALLBACK, activeLocale);
  $: head = Head(meta);
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/')}> 
  {@html hreflangLinks(data.pathname ?? '/')}
</svelte:head>

<main id="main">
  <Hero />
  <ProductCards />
  <Teasers />
  <Testimonials />
  <Timeline />
  <section><a class="btn" href={withBase('/contact') ?? '/contact'}>Let’s create something awesome</a></section>
</main>
