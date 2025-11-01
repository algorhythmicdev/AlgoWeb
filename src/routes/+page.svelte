<script lang="ts">
  import { base } from '$app/paths';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';

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
    title="Algorhythmics"
    subtitle="AI Innovation"
    description="We build practical AI tools and help teams adopt them quickly. From travel planning to startup education."
    ctaLabel="Start a conversation"
    ctaHref="/contact"
    secondaryCtaLabel="Explore our products"
    secondaryCtaHref="#products"
    variant="neural"
    particleType="none"
    size="epic"
    videoSrc="/videos/algorhythmics-promo.webm"
  />

  <AnimatedDivider variant="gradient" theme="neural" spacing="spacious" />

  <section id="products" class="page container section-spacing">
    <RevealOnScroll animation="fade-up" delay={0}>
      <h2 class="section-title">Our AI-Powered Products</h2>
    </RevealOnScroll>
    
    <div class="grid cols-2 product-grid">
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

  <section class="page container section-spacing">
    <RevealOnScroll animation="scale" delay={0}>
      <div class="section-intro">
        <h2 class="section-heading">Why Choose Algorhythmics?</h2>
        <p class="section-description">
          We combine cutting-edge AI technology with practical, user-friendly design. 
          Based in Latvia, serving globally—our tools are built for real people solving real problems.
        </p>
      </div>
    </RevealOnScroll>

    <div class="grid cols-2 features-grid">
      <RevealOnScroll animation="fade-right" delay={100}>
        <CardHalo halo="matrix" interactive>
          <h3 style="color:var(--ai-matrix-1); display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="shield" size={24} />
            Accessible by Design
          </h3>
          <p>AAA accessibility standards, multilingual support (EN/LV/RU), and intuitive interfaces for everyone.</p>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-left" delay={200}>
        <CardHalo halo="coral" interactive>
          <h3 style="color:var(--ai-coral-1); display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="rocket" size={24} />
            AI-Powered
          </h3>
          <p>Leveraging Google's Gemini AI for intelligent assistance, insights, and automation.</p>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-right" delay={300}>
        <CardHalo halo="neural" interactive>
          <h3 style="color:var(--ai-neural-1); display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="lightbulb" size={24} />
            Practical Solutions
          </h3>
          <p>No fluff, no hype—just tools that work, tested with real users and real feedback.</p>
        </CardHalo>
      </RevealOnScroll>
      
      <RevealOnScroll animation="fade-left" delay={400}>
        <CardHalo halo="quantum" interactive>
          <h3 style="color:var(--ai-quantum-1); display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="globe" size={24} />
            Local & Global
          </h3>
          <p>Proudly based in Daugavpils, Latvia, with a vision to serve teams worldwide.</p>
        </CardHalo>
      </RevealOnScroll>
    </div>
  </section>
</main>

<style>
  .section-spacing {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  
  .section-title {
    text-align: center;
    font-size: clamp(2rem, 4vw, 2.5rem);
    margin-bottom: 3rem;
    font-weight: 700;
  }
  
  .section-intro {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
  }
  
  .section-heading {
    font-size: clamp(1.75rem, 3.5vw, 2rem);
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .section-description {
    font-size: clamp(1.125rem, 2vw, 1.25rem);
    color: var(--text-secondary);
    line-height: 1.8;
  }
  
  .product-grid {
    gap: 2rem;
  }
  
  .features-grid {
    margin-top: 3rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .section-spacing {
      margin-top: 3rem;
      margin-bottom: 3rem;
    }
  }
</style>
