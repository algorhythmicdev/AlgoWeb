<script lang="ts">
  import { base } from '$app/paths';
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Education — Algorhythmics</title>
  <meta name="description" content="Short, practical AI programs for Latvian schools and universities." />
</svelte:head>

<main id="main">
  <HeroEpic
    title="AI Education Programs"
    subtitle="Learning Pathways"
    description="Short, practical AI programs for Latvian schools and universities. Clear lessons, safe tools, projects you can run."
    ctaLabel="Get in touch"
    ctaHref="/contact"
    variant="coral"
    particleType="waves"
    size="large"
  />

  <AnimatedDivider variant="wave" theme="coral" spacing="spacious" />

  <section class="page container section-spacing">
    <RevealOnScroll animation="fade-up" delay={100}>
      <h2 class="section-title">Program Examples</h2>
    </RevealOnScroll>

    <div class="grid cols-2 programs-grid">
      <RevealOnScroll animation="fade-up" delay={100}>
        <CardHalo halo="coral" interactive glass>
          <h3 style="color:var(--ai-coral-1); margin-top:0">🎓 AI Basics for Students</h3>
          <p>How it works, where it's useful, and what to avoid. Practical understanding without the hype.</p>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={200}>
        <CardHalo halo="quantum" interactive glass>
          <h3 style="color:var(--ai-quantum-1); margin-top:0">💡 Product Thinking</h3>
          <p>Turn a real problem into a small prototype. Learn to validate ideas and iterate.</p>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={300}>
        <CardHalo halo="cyber" interactive glass>
          <h3 style="color:var(--ai-cyber-1); margin-top:0">📊 Data Skills</h3>
          <p>Collecting, cleaning, and making sense of information. Hands-on with real datasets.</p>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={400}>
        <CardHalo halo="neural" interactive glass>
          <h3 style="color:var(--ai-neural-1); margin-top:0">🚀 Build & Ship</h3>
          <p>Complete small projects from idea to working demo. Learn the full cycle.</p>
        </CardHalo>
      </RevealOnScroll>
    </div>

    <div class="cta-card">
      <RevealOnScroll animation="scale" delay={500}>
        <CardHalo halo="matrix" glass>
          <h3 style="color:var(--ai-matrix-1); margin-top:0; font-size:1.75rem">Ready to Collaborate?</h3>
          <p style="font-size:1.125rem; margin:1.5rem 0">We're building these programs with schools and universities across Latvia.</p>
          <a class="btn btn-primary" href={contactHref} style="font-size:1.125rem; padding:1rem 2rem">Start a conversation</a>
        </CardHalo>
      </RevealOnScroll>
    </div>
  </section>
</main>

<style>
  .section-spacing {
    margin-top: 4rem;
    margin-bottom: 4rem;
  }
  
  .section-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 700;
  }
  
  .programs-grid {
    gap: 2rem;
  }
  
  .cta-card {
    margin-top: 3rem;
    text-align: center;
    padding: 2.5rem;
  }
  
  @media (max-width: 768px) {
    .section-spacing {
      margin-top: 3rem;
      margin-bottom: 3rem;
    }
    
    .cta-card {
      padding: 1.5rem;
    }
  }
</style>
