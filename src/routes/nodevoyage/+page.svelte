<script lang="ts">
  import { base as appBase } from '$app/paths';
  import HeroNew from '$lib/components/HeroNew.svelte';
  import NarrativeSteps from '$lib/components/NarrativeSteps.svelte';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>NodeVoyage — Smart Travel Planning</title>
</svelte:head>

<main id="main">
  <HeroNew
    variant="nodevoyage"
    title="Travel planning that feels human"
    lead="Map + timeline + Nodi helper. Add places, balance time and budget, and share a plan people understand."
    ctaHref={contactHref}
    ctaLabel="Join early access" />

  <NarrativeSteps steps={[
    { title:'Plan', text:'Add stays, food, and activities. Nodi suggests timings and smart routes.' },
    { title:'Adjust', text:'Change pace, budget, or access needs — see clean trade-offs before you confirm.' },
    { title:'Share', text:'Real-time comments and a printable itinerary that works offline.' }
  ]} />
</main>
