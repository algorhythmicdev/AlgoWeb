<script lang="ts">
  import { base as appBase } from '$app/paths';
  import HeroNew from '$lib/components/HeroNew.svelte';
  import NarrativeSteps from '$lib/components/NarrativeSteps.svelte';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Ideonautix — Startup Toolkit</title>
</svelte:head>

<main id="main">
  <HeroNew
    variant="ideonautix"
    title="Tools that think with you, not for you"
    lead="Organize ideas, focus your time, and prepare a clean story for investors or your team."
    ctaHref={contactHref}
    ctaLabel="Ask for a demo" />

  <NarrativeSteps steps={[
    { title:'Focus Coach', text:'Adaptive Pomodoro with insights — work with intent, not burn.' },
    { title:'Pitch Assistant', text:'From notes to slides and a script you can rehearse, in simple steps.' },
    { title:'Competitive Intel', text:'A short brief of what changed, saved for the moments that matter.' }
  ]} />
</main>
