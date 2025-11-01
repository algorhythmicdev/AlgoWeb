<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { i18n } from '$lib/i18n';
  $: t = $i18n;

  import Icon from '$lib/components/icons/Icon.svelte';
  import Card from '$lib/components/Card.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import { ideonautixPreviews, videoIdeonautix } from '$lib/presentAssets';
  const previews = ideonautixPreviews;
  const vid = videoIdeonautix;
  const contactHref = `${appBase}/contact`;
  
  // Map previews to gallery format
  const galleryItems = previews.map((src, i) => ({
    src,
    alt: `Ideonautix Preview ${i + 1}`
  }));
</script>

<svelte:head>
  <title>{t('ideonautix.title')}</title>
</svelte:head>

<main id="main" class="prose rhythm">
  <HeroEpic
    title={t('ideonautix.title')}
    subtitle="Innovation Toolkit"
    description="Startup education and productivity toolkit. Clear steps, short lessons, and practical templates."
    ctaLabel="Get Started"
    ctaHref="/contact"
    variant="quantum"
    particleType="minimal"
    size="large"
  />

  <AnimatedDivider variant="pulse" theme="quantum" spacing="spacious" />

  <section class="section">
    <div class="container">
      <div class="grid-2" style="gap:2rem">
        <RevealOnScroll animation="fade-up" delay={100}>
          <CardHalo halo="quantum" glass heading="MVP++ Snapshot">
            <ul>
              <li>Frontend: SvelteKit + TypeScript, a11y AAA, i18n (EN/LV/RU baseline).</li>
              <li>Mobile: PWA + Capacitor; offline-first via IndexedDB (Dexie).</li>
              <li>Backend (narrative only on website): Fastify, Postgres/Prisma, Redis/BullMQ, S3 store.</li>
              <li>AI: Gemini on Vertex for text/multimodal; text-embedding-004 for memory.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
        
        <RevealOnScroll animation="fade-up" delay={200}>
          <CardHalo halo="matrix" glass heading="Near-term modules">
            <ul>
              <li>Pomodoro Coach — adaptive focus sessions.</li>
              <li>Pitch Assistant — outline, slide aid, rehearsal notes.</li>
              <li>Competitive Intelligence — watchlist + brief.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
      </div>
    </div>
  </section>

  <AnimatedDivider variant="gradient" theme="quantum" spacing="normal" />

  <section class="section">
    <div class="container">
      <div class="grid-2 feature-grid">
        <RevealOnScroll animation="fade-right" delay={100}>
          <CardHalo halo="quantum" interactive as="section" heading={t('ideonautix.features')}>
            <ul class="rhythm-tight" style="list-style:none;padding:0;margin:0">
              <li><Icon name="spark" /> Pitch Assistant — draft and structure clean slides.</li>
              <li><Icon name="book" /> Competitive Intelligence — track changes that matter.</li>
              <li><Icon name="clock" /> Pomodoro Coach — focused work with context.</li>
              <li><Icon name="users" /> Smart Standups — short, honest, and useful.</li>
              <li><Icon name="gear" /> Metrics basics — what to track and why.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>

        <RevealOnScroll animation="fade-left" delay={200}>
          <CardHalo halo="cyber" glass as="aside" heading={t('ideonautix.promo')}>
            <VideoPlayer srcWebm={vid} />
          </CardHalo>
        </RevealOnScroll>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container stack">
      <RevealOnScroll animation="fade-up" delay={0}>
        <h2 class="text-strong" style="text-align:center">{t('ideonautix.preview')}</h2>
      </RevealOnScroll>
      {#if galleryItems.length > 0}
        <Gallery items={galleryItems} halo="quantum" columns={3} />
      {:else}
        <div class="grid-3">
          <RevealOnScroll animation="scale" delay={100}>
            <CardHalo halo="quantum" glass><AssetImage src={null} alt="Preview 1" /></CardHalo>
          </RevealOnScroll>
          <RevealOnScroll animation="scale" delay={200}>
            <CardHalo halo="quantum" glass><AssetImage src={null} alt="Preview 2" /></CardHalo>
          </RevealOnScroll>
        </div>
      {/if}
    </div>
  </section>

  <AnimatedDivider variant="particles" theme="quantum" spacing="spacious" />

  <section class="section">
    <div class="container">
      <div class="grid-2" style="gap:2rem">
        <RevealOnScroll animation="fade-up" delay={100}>
          <CardHalo halo="coral" interactive heading="Who it helps">
            <ul>
              <li>Students learning product thinking.</li>
              <li>Founders preparing their first deck.</li>
              <li>Teams aligning on priorities weekly.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
        
        <RevealOnScroll animation="fade-up" delay={200}>
          <CardHalo halo="neural" interactive heading="How to start">
            <ol>
              <li>Pick one module (Pitch Assistant or Pomodoro).</li>
              <li>Do one tidy deliverable this week.</li>
              <li>Repeat next week; keep it small.</li>
            </ol>
            <p><a class="btn btn-primary" href={contactHref}>Ask about Ideonautix</a></p>
          </CardHalo>
        </RevealOnScroll>
      </div>
    </div>
  </section>
</main>

<style>
  .feature-grid {
    align-items: stretch;
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 1fr);
  }
  @media (max-width: 900px) {
    .feature-grid { grid-template-columns: 1fr; }
  }
</style>
