<script lang="ts">
  import { page } from '$app/stores';
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { reveal } from '$lib/directives/reveal';
  import { withBase } from '$utils/paths';
  import Hero from '$lib/components/Hero.svelte';
  import ProductCards from '$lib/components/ProductCards.svelte';
  import Teasers from '$lib/components/Teasers.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  import Timeline from '$lib/components/Timeline.svelte';

  const head = Head({
    title: 'Home',
    description: 'AI consulting + practical tools: NodeVoyage and Ideonautix.'
  });
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor($page.url.pathname)}>
  {@html hreflangLinks($page.url.pathname)}
</svelte:head>

<main id="main">
  <section use:reveal><Hero /></section>
  <section use:reveal><ProductCards /></section>
  <section use:reveal><Teasers /></section>
  <section use:reveal><Testimonials /></section>
  <section use:reveal><Timeline /></section>
  <section use:reveal>
    <a class="btn btn-primary" href={withBase('/contact') ?? '/contact'}>Let’s create something awesome</a>
  </section>
</main>
