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
  import { nodevoyagePreviews, videoNodeVoyage } from '$lib/presentAssets';
  const previews = nodevoyagePreviews;
  const vid = videoNodeVoyage;
  const contactHref = `${appBase}/contact`;
  
  // Map previews to gallery format
  const galleryItems = previews.map((src, i) => ({
    src,
    alt: `NodeVoyage Preview ${i + 1}`
  }));
</script>

<svelte:head>
  <title>{t('nodevoyage.title')}</title>
</svelte:head>

<main id="main" class="prose rhythm">
  <HeroEpic
    title={t('nodevoyage.title')}
    subtitle="Smart Travel Planning"
    description="Plan trips with Nodi. Collect places, set routes, and keep your crew in sync."
    ctaLabel="Start Planning"
    ctaHref="/contact"
    variant="cyber"
    particleType="waves"
    size="large"
    animatedTitle={true}
  />

  <AnimatedDivider variant="wave" theme="cyber" spacing="spacious" />

  <section class="section">
    <div class="container">
      <div class="grid-3">
        <RevealOnScroll animation="fade-up" delay={100}>
          <CardHalo halo="cyber" glass heading="Web planning workspace">
            <ul>
              <li>Three-pane layout: Timeline • Map • Nodi assistant.</li>
              <li>Node types: Stay / Activity / Food / Transport / Emergency.</li>
              <li>Drawers: Budget, Eco (CO₂ estimate), Version history.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
        
        <RevealOnScroll animation="fade-up" delay={200}>
          <CardHalo halo="neural" glass heading="Mobile on-trip">
            <ul>
              <li>Tabs: Home / Trip / Community / Profile.</li>
              <li>Quick Capture: Camera / Translate / Voice — attach to nodes.</li>
              <li>Nodi pill: hands-free assistant, six languages.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
        
        <RevealOnScroll animation="fade-up" delay={300}>
          <CardHalo halo="matrix" glass heading="MVP expectations">
            <ul>
              <li>Map↔Timeline sync and live route updates.</li>
              <li>Export: ICS calendar & PDF itinerary.</li>
              <li>Collaboration: presence, comments, share.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
      </div>
    </div>
  </section>

  <AnimatedDivider variant="gradient" theme="cyber" spacing="normal" />

  <section class="section">
    <div class="container">
      <div class="grid-2 feature-grid">
        <RevealOnScroll animation="fade-right" delay={100}>
          <CardHalo halo="cyber" interactive as="section" heading={t('nodevoyage.features')}>
            <ul class="rhythm-tight" style="list-style:none;padding:0;margin:0">
              <li><Icon name="map" /> Smart suggestions and route planning.</li>
              <li><Icon name="users" /> Collaboration and shared notes.</li>
              <li><Icon name="clock" /> Timing and day-by-day view.</li>
              <li><Icon name="shield" /> Offline-friendly and privacy-aware.</li>
              <li><Icon name="globe" /> Sustainability hints and awareness.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>

        <RevealOnScroll animation="fade-left" delay={200}>
          <CardHalo halo="quantum" glass as="aside" heading={t('nodevoyage.promo')}>
            <VideoPlayer srcWebm={vid} />
          </CardHalo>
        </RevealOnScroll>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container stack">
      <RevealOnScroll animation="fade-up" delay={0}>
        <h2 class="text-strong" style="text-align:center">{t('nodevoyage.preview')}</h2>
      </RevealOnScroll>
      {#if galleryItems.length > 0}
        <Gallery items={galleryItems} halo="cyber" columns={3} />
      {:else}
        <div class="grid-3">
          <RevealOnScroll animation="scale" delay={100}>
            <CardHalo halo="cyber" glass><AssetImage src={null} alt="Preview 1" /></CardHalo>
          </RevealOnScroll>
          <RevealOnScroll animation="scale" delay={200}>
            <CardHalo halo="cyber" glass><AssetImage src={null} alt="Preview 2" /></CardHalo>
          </RevealOnScroll>
        </div>
      {/if}
    </div>
  </section>

  <AnimatedDivider variant="particles" theme="cyber" spacing="spacious" />

  <section class="section">
    <div class="container">
      <div class="grid-2" style="gap:2rem">
        <RevealOnScroll animation="fade-up" delay={100}>
          <CardHalo halo="coral" interactive heading="Who it helps">
            <ul>
              <li>Solo travelers who like tidy plans.</li>
              <li>Families and small groups.</li>
              <li>School trips with clear schedules.</li>
            </ul>
          </CardHalo>
        </RevealOnScroll>
        
        <RevealOnScroll animation="fade-up" delay={200}>
          <CardHalo halo="neural" interactive heading="How to start">
            <ol>
              <li>Add three places for your first day.</li>
              <li>Let Nodi suggest the order.</li>
              <li>Share the plan and iterate.</li>
            </ol>
            <p><a class="btn btn-primary" href={contactHref}>Ask about NodeVoyage</a></p>
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
