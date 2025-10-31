<script lang="ts">
  import { base } from '$app/paths';
  import HeroNew from '$lib/components/HeroNew.svelte';
  import NarrativeSteps from '$lib/components/NarrativeSteps.svelte';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Education — Algorhythmics</title>
  <meta name="description" content="Short, practical AI programs for Latvian schools and universities." />
</svelte:head>

<main id="main">
  <HeroNew
    variant="education"
    title="Teaching AI with both feet on the ground"
    lead="Clear lessons, safe tools, and projects schools can actually run in Latvia."
    ctaHref={contactHref}
    ctaLabel="Partner with us" />

  <NarrativeSteps steps={[
    { title:'Teacher training', text:'From basics to program leads — simple, practical formats.' },
    { title:'Student projects', text:'Make small, working things. Share results and reflect.' },
    { title:'Impact, not hype', text:'Metrics and annual reporting you can trust.' }
  ]} />
</main>
