<script lang="ts">
  import { base } from '$app/paths';
  import HeroNew from '$lib/components/HeroNew.svelte';
  import NarrativeSteps from '$lib/components/NarrativeSteps.svelte';

  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Algorhythmics — AI Tools & Consulting</title>
  <meta name="description" content="We build practical AI tools and help teams adopt them quickly. Discover NodeVoyage and Ideonautix." />
</svelte:head>

<main id="main">
  <HeroNew
    variant="home"
    title="Clear AI for everyday people"
    lead="We build practical tools that make AI a helpful extra pair of hands — not a replacement."
    ctaHref={contactHref}
    ctaLabel="Let us create something useful" />

  <NarrativeSteps steps={[
    { title: 'Start simple', text: 'Short pilots that solve one real problem without changing everything at once.' },
    { title: 'Prove value', text: 'Measure time saved and errors reduced, then decide what is worth scaling.' },
    { title: 'Keep control', text: 'Plain-language docs, training, and handover so your team runs it confidently.' }
  ]} />
</main>
