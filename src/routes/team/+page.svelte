<script lang="ts">
  import AssetImage from '$lib/components/AssetImage.svelte';
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
</script>

<svelte:head>
  <title>Team — Algorhythmics</title>
  <meta name="description" content="Algorhythmics is based in Daugavpils, Latvia. We build accessible AI tools and offer practical consulting." />
</svelte:head>

<main id="main">
  <HeroEpic
    title="Meet Our Team"
    subtitle="Collaboration & Innovation"
    description="Based in Daugavpils, Latvia, building accessible AI tools with a global vision"
    variant="coral"
    particleType="dots"
    size="default"
  />

  <AnimatedDivider variant="wave" theme="coral" spacing="spacious" />

  <section class="page container" style="margin-top:4rem">
    <div class="grid cols-2" style="gap:2rem; margin-top:24px">
      <RevealOnScroll animation="fade-up" delay={100}>
        <CardHalo halo="quantum" glass>
          <article class="grid cols-2" style="gap:1.5rem; align-items:start">
            <AssetImage src="/images/founders/founder-nikita.png" alt="Nikita Jurtaevs" ratio="1x1" />
            <div>
              <h2 style="margin-top:0">Nikita Jurtaevs</h2>
              <p style="color:var(--ai-quantum-2); font-weight:600; margin:0.5rem 0">CEO & Product</p>
              <ul style="margin:1rem 0; line-height:1.8">
                <li>Leads brand & product direction; UX/QA across NodeVoyage & Ideonautix.</li>
                <li>Current R&D at Reclame Fabriek (LED neon, in-house controllers, coatings, 3D printing).</li>
                <li>Accessibility-first, multilingual delivery; pilots and lean GTM 2025–2026.</li>
              </ul>
            </div>
          </article>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={200}>
        <CardHalo halo="cyber" glass>
          <article class="grid cols-2" style="gap:1.5rem; align-items:start">
            <AssetImage src="/images/founders/founder-slaff.png" alt={'Vjaceslavs "Slaff" Trosins'} ratio="1x1" />
            <div>
              <h2 style="margin-top:0">Vjaceslavs "Slaff" Trosins</h2>
              <p style="color:var(--ai-cyber-2); font-weight:600; margin:0.5rem 0">CTO</p>
              <ul style="margin:1rem 0; line-height:1.8">
                <li>Owns technical vision: web/mobile, APIs, AI integration.</li>
                <li>Google Cloud-first architecture; SvelteKit/TypeScript, Flutter/Dart, Fastify, Prisma/Postgres.</li>
                <li>Hands-on signage-grade controller work aligned with explainable AI features.</li>
              </ul>
            </div>
          </article>
        </CardHalo>
      </RevealOnScroll>
    </div>

    <RevealOnScroll animation="scale" delay={300}>
      <CardHalo halo="matrix" glass style="margin-top:2rem">
        <h3 style="color:var(--ai-matrix-1); margin-top:0">Partners & Background</h3>
        <p style="line-height:1.8">LIAA (Latvia) and current workplace R&D at Reclame Fabriek in Daugavpils (next-gen LED neon, in-house controllers, advanced fabrication).</p>
      </CardHalo>
    </RevealOnScroll>
  </section>
</main>
