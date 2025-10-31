<script lang="ts">
  import { base } from '$app/paths';
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Consulting — Algorhythmics</title>
  <meta name="description" content="We make useful things that save time." />
</svelte:head>

<main id="main">
  <HeroEpic
    title="AI Consulting That Works"
    subtitle="Professional Solutions"
    description="We make useful things that save time. Small, safe prototypes that grow with your team."
    ctaLabel="Apply for a pilot"
    ctaHref="/contact"
    variant="matrix"
    particleType="minimal"
    size="default"
  />

  <AnimatedDivider variant="pulse" theme="matrix" spacing="spacious" />

  <section class="page container">
    <div class="grid cols-2" style="gap:2rem">
      <RevealOnScroll animation="fade-up" delay={100}>
        <CardHalo halo="matrix" glass>
          <h2 style="margin-top:0; color:var(--ai-matrix-1)">Services</h2>
          <ul style="line-height:1.8">
            <li><strong>Automation</strong>: connect tools, cut manual steps, reduce errors.</li>
            <li><strong>Data & reporting</strong>: simple dashboards and alerts people actually use.</li>
            <li><strong>Training</strong>: short sessions and playbooks; your team keeps the gains.</li>
          </ul>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={200}>
        <CardHalo halo="neural" glass>
          <h2 style="margin-top:0; color:var(--ai-neural-1)">Process</h2>
          <ol style="line-height:1.8">
            <li><strong>Kickoff</strong>: what to improve and what you already have.</li>
            <li><strong>Prototype</strong>: a working version in days.</li>
            <li><strong>Refine</strong>: adjust with feedback and basic metrics.</li>
            <li><strong>Handover</strong>: docs and a simple plan to maintain.</li>
          </ol>
        </CardHalo>
      </RevealOnScroll>
    </div>

    <RevealOnScroll animation="scale" delay={300}>
      <CardHalo halo="matrix" interactive glass style="margin-top:2rem; text-align:center; padding:2.5rem">
        <h3 style="color:var(--ai-matrix-1); margin-top:0; font-size:1.75rem">Pilot Applications</h3>
        <p style="font-size:1.125rem; margin:1.5rem 0">We open a small number of pilots each month.</p>
        <a class="btn btn-primary" href={contactHref} style="font-size:1.125rem; padding:1rem 2rem">Apply for a pilot</a>
      </CardHalo>
    </RevealOnScroll>
  </section>
</main>
