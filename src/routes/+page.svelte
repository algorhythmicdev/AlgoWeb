<script lang="ts">
  import { base } from '$app/paths';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';

  const contactHref = `${base}/contact`;
  const ideonautixHref = `${base}/ideonautix`;
  const nodevoyageHref = `${base}/nodevoyage`;
</script>

<svelte:head>
  <title>Algorhythmics — AI Tools & Consulting</title>
  <meta name="description" content="We build practical AI tools and help teams adopt them quickly. Discover NodeVoyage and Ideonautix." />
</svelte:head>

<main id="main">
  <HeroEpic
    title="Let's create something awesome"
    subtitle="AI Innovation"
    description="We build practical AI tools and help teams adopt them quickly. From travel planning to startup education."
    ctaLabel="Start a conversation"
    ctaHref="/contact"
    secondaryCtaLabel="Explore our products"
    secondaryCtaHref="#products"
    variant="neural"
    particleType="neural"
    size="epic"
  />

  <AnimatedDivider variant="gradient" theme="neural" spacing="spacious" />

  <section id="products" class="page container" style="margin-top:4rem; margin-bottom:4rem">
    <RevealOnScroll animation="fade-up" delay={0}>
      <h2 style="text-align:center; font-size:2.5rem; margin-bottom:3rem">Our AI-Powered Products</h2>
    </RevealOnScroll>
    
    <div class="grid cols-2" style="gap:2rem">
      <RevealOnScroll animation="fade-up" delay={100}>
        <CardHalo halo="quantum" interactive glass>
          <h2 style="color:var(--ai-quantum-1)">Ideonautix</h2>
          <p style="margin:1rem 0">Startup toolkit: Focus Coach, Pitch Assistant, Competitive Intel and more—multilingual and accessible.</p>
          <VideoPlayer srcWebm="/videos/ideonautix-promo.webm" className="ratio-16x9" />
          <div style="margin-top:1rem">
            <a class="btn" href={ideonautixHref} style="width:100%; text-align:center">Discover Ideonautix →</a>
          </div>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-up" delay={200}>
        <CardHalo halo="cyber" interactive glass>
          <h2 style="color:var(--ai-cyber-1)">NodeVoyage</h2>
          <p style="margin:1rem 0">Map-first travel planning with Nodi guidance, collaboration, and sustainability tools.</p>
          <VideoPlayer srcWebm="/videos/nodevoyage-promo.webm" className="ratio-16x9" />
          <div style="margin-top:1rem">
            <a class="btn" href={nodevoyageHref} style="width:100%; text-align:center">Explore NodeVoyage →</a>
          </div>
        </CardHalo>
      </RevealOnScroll>
    </div>
  </section>

  <AnimatedDivider variant="particles" theme="mixed" spacing="spacious" />

  <section class="page container" style="margin-top:4rem; margin-bottom:4rem">
    <RevealOnScroll animation="scale" delay={0}>
      <div style="text-align:center; max-width:800px; margin:0 auto">
        <h2 style="font-size:2rem; margin-bottom:1rem">Why Choose Algorhythmics?</h2>
        <p style="font-size:1.25rem; color:var(--text-secondary); line-height:1.8">
          We combine cutting-edge AI technology with practical, user-friendly design. 
          Based in Latvia, serving globally—our tools are built for real people solving real problems.
        </p>
      </div>
    </RevealOnScroll>

    <div class="grid cols-2" style="margin-top:3rem; gap:1.5rem">
      <RevealOnScroll animation="fade-right" delay={100}>
        <CardHalo halo="matrix" interactive>
          <h3 style="color:var(--ai-matrix-1)">🎯 Accessible by Design</h3>
          <p>AAA accessibility standards, multilingual support (EN/LV/RU), and intuitive interfaces for everyone.</p>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-left" delay={200}>
        <CardHalo halo="coral" interactive>
          <h3 style="color:var(--ai-coral-1)">🚀 AI-Powered</h3>
          <p>Leveraging Google's Gemini AI for intelligent assistance, insights, and automation.</p>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-right" delay={300}>
        <CardHalo halo="neural" interactive>
          <h3 style="color:var(--ai-neural-1)">💡 Practical Solutions</h3>
          <p>No fluff, no hype—just tools that work, tested with real users and real feedback.</p>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-left" delay={400}>
        <CardHalo halo="quantum" interactive>
          <h3 style="color:var(--ai-quantum-1)">🌍 Local & Global</h3>
          <p>Proudly based in Daugavpils, Latvia, with a vision to serve teams worldwide.</p>
        </CardHalo>
      </RevealOnScroll>
    </div>
  </section>
</main>
