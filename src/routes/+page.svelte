<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { Head } from '$lib/seo';
  import Hero from '$lib/components/Hero.svelte';
  import ProductCards from '$lib/components/ProductCards.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import Teasers from '$lib/components/Teasers.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import { ripple } from '$lib/directives/ripple';
  import { promoAlgorhythmics } from '$lib/assets';
  const head = Head({ title:'Home', description:'AI consulting + practical tools: NodeVoyage and Ideonautix.' });
  const contactHref = `${appBase}/contact`;
  const algVid = promoAlgorhythmics() ?? null;
</script>

<svelte:head>{@html head}</svelte:head>
<main id="main" class="prose">
  <Hero />
  <SectionDivider />
  <ProductCards />
  <SectionDivider />
  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <div class="scrim">
      <h2>See what Algorhythmics is about</h2>
      <VideoPlayer videoBase={algVid} label="Algorhythmics — promo" />
    </div>
  </section>
  <SectionDivider />
  <Teasers />
  <SectionDivider />
  <Testimonials />
  <SectionDivider />
  <Timeline />
  <section class="section"><a class="btn btn-primary" href={contactHref} use:ripple>Let’s create something awesome</a></section>
</main>
