<script lang="ts">
  import { base } from '$app/paths';
  import { Head } from '$lib/seo';
  import Hero from '$lib/components/Hero.svelte';
  import ProductCards from '$lib/components/ProductCards.svelte';
  import Teasers from '$lib/components/Teasers.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import { ripple } from '$lib/directives/ripple';
  const head = Head({ title:'Home', description:'AI consulting + practical tools: NodeVoyage and Ideonautix.' });
  const contactHref = `${base}/contact`;
</script>

<svelte:head>{@html head}</svelte:head>
<main id="main" class="prose">
  <Hero />
  <SectionDivider />
  <ProductCards />
  <SectionDivider />
  <Teasers />
  <SectionDivider />
  <Testimonials />
  <SectionDivider />
  <Timeline />
  <section class="section"><a class="btn btn-primary" href={contactHref} use:ripple>Let’s create something awesome</a></section>
</main>
