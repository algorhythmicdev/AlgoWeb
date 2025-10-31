<script lang="ts">
  import { base } from '$app/paths';
  import HeroNew from '$lib/components/HeroNew.svelte';
  import NarrativeSteps from '$lib/components/NarrativeSteps.svelte';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Consulting — Algorhythmics</title>
  <meta name="description" content="We make useful things that save time." />
</svelte:head>

<main id="main">
  <HeroNew
    variant="consulting"
    title="Make AI your co-worker, not your headache"
    lead="Small, safe prototypes that reduce manual work. We set them up, you keep control."
    ctaHref={contactHref}
    ctaLabel="Apply for a pilot" />

  <NarrativeSteps steps={[
    { title:'Kickoff', text:'Map your tools and pain points. Pick one fast win.' },
    { title:'Prototype', text:'A working mini-solution in days, documented in plain language.' },
    { title:'Handover', text:'Training and upkeep plan — your team owns it.' }
  ]} />
</main>
