<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { i18n } from '$lib/i18n';
  $: t = $i18n;

  import Icon from '$lib/components/icons/Icon.svelte';
  import Card from '$lib/components/Card.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import { ideonautixPreviews, videoIdeonautix } from '$lib/presentAssets';
  const previews = ideonautixPreviews;
  const vid = videoIdeonautix;
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>{t('ideonautix.title')}</title>
</svelte:head>

<main id="main" class="prose rhythm">
  <h1 class="text-strong">{t('ideonautix.title')}</h1>
  <p>Startup education and productivity toolkit. Clear steps, short lessons, and practical templates.</p>

  <section class="section grid">
    <Card heading="MVP++ Snapshot">
      <ul>
        <li>Frontend: SvelteKit + TypeScript, a11y AAA, i18n (EN/LV/RU baseline).</li>
        <li>Mobile: PWA + Capacitor; offline-first via IndexedDB (Dexie).</li>
        <li>Backend (narrative only on website): Fastify, Postgres/Prisma, Redis/BullMQ, S3 store.</li>
        <li>AI: Gemini on Vertex for text/multimodal; text-embedding-004 for memory.</li>
      </ul>
    </Card>
    <Card heading="Near-term modules">
      <ul>
        <li>Pomodoro Coach — adaptive focus sessions.</li>
        <li>Pitch Assistant — outline, slide aid, rehearsal notes.</li>
        <li>Competitive Intelligence — watchlist + brief.</li>
      </ul>
    </Card>
  </section>

  <section class="section grid" style="grid-template-columns: minmax(0,1.5fr) minmax(260px,1fr); gap: var(--space-6)">
    <Card as="section" heading={t('ideonautix.features')}>
      <ul class="rhythm-tight" style="list-style:none;padding:0;margin:0">
        <li><Icon name="spark" /> Pitch Assistant — draft and structure clean slides.</li>
        <li><Icon name="book" /> Competitive Intelligence — track changes that matter.</li>
        <li><Icon name="clock" /> Pomodoro Coach — focused work with context.</li>
        <li><Icon name="users" /> Smart Standups — short, honest, and useful.</li>
        <li><Icon name="gear" /> Metrics basics — what to track and why.</li>
      </ul>
    </Card>

    <Card as="aside" heading={t('ideonautix.promo')}>
      <VideoPlayer videoBase={vid} label="Ideonautix — promo" decorative={true}/>
    </Card>
  </section>

  <section class="section">
    <h2 class="text-strong">{t('ideonautix.preview')}</h2>
    <div class="grid">
      {#if previews.length === 0}
        <Card><AssetImage assetBase={null} alt="Preview 1" /></Card>
        <Card><AssetImage assetBase={null} alt="Preview 2" /></Card>
      {:else}
        {#each previews as b}
          <Card><AssetImage assetBase={b} alt={b.split('/').pop()||'Preview'} /></Card>
        {/each}
      {/if}
    </div>
  </section>

  <section class="section grid">
    <Card heading="Who it helps">
      <ul>
        <li>Students learning product thinking.</li>
        <li>Founders preparing their first deck.</li>
        <li>Teams aligning on priorities weekly.</li>
      </ul>
    </Card>
    <Card heading="How to start">
      <ol>
        <li>Pick one module (Pitch Assistant or Pomodoro).</li>
        <li>Do one tidy deliverable this week.</li>
        <li>Repeat next week; keep it small.</li>
      </ol>
      <p><a class="btn btn-primary" href={contactHref}>Ask about Ideonautix</a></p>
    </Card>
  </section>
</main>
