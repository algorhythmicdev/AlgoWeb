<script lang="ts">
  import { Head } from '$lib/seo';
  import Hero from '$lib/components/Hero.svelte';
  import ProductCards from '$lib/components/ProductCards.svelte';
  import Teasers from '$lib/components/Teasers.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import { withBase } from '$utils/paths';

  const head = Head({
    title: 'Home',
    description: 'AI consulting + practical tools: NodeVoyage and Ideonautix.'
  });
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <Hero />
  <ProductCards />
  <Teasers />
  <Testimonials />
  <Timeline />
  <section><a class="btn" href={withBase('/contact') ?? '/contact'}>Let’s create something awesome</a></section>
</main>
