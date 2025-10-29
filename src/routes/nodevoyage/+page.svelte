<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { i18n } from '$lib/i18n';
  $: t = $i18n;

  import Icon from '$lib/components/icons/Icon.svelte';
  import Card from '$lib/components/Card.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import { nodevoyagePreviews, videoNodeVoyage } from '$lib/presentAssets';
  const previews = nodevoyagePreviews;
  const vid = videoNodeVoyage;
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>{t('nodevoyage.title')}</title>
</svelte:head>

<main id="main" class="prose rhythm">
  <h1 class="text-strong">{t('nodevoyage.title')}</h1>
  <p>Plan trips with Nodi. Collect places, set routes, and keep your crew in sync.</p>

  <section class="section grid">
    <Card heading="Web planning workspace">
      <ul>
        <li>Three-pane layout: Timeline • Map • Nodi assistant.</li>
        <li>Node types: Stay / Activity / Food / Transport / Emergency.</li>
        <li>Drawers: Budget, Eco (CO₂ estimate), Version history.</li>
      </ul>
    </Card>
    <Card heading="Mobile on-trip">
      <ul>
        <li>Tabs: Home / Trip / Community / Profile.</li>
        <li>Quick Capture: Camera / Translate / Voice — attach to nodes.</li>
        <li>Nodi pill: hands-free assistant, six languages.</li>
      </ul>
    </Card>
    <Card heading="MVP expectations">
      <ul>
        <li>Map↔Timeline sync and live route updates.</li>
        <li>Export: ICS calendar & PDF itinerary.</li>
        <li>Collaboration: presence, comments, share.</li>
      </ul>
    </Card>
  </section>

  <section class="section grid" style="grid-template-columns: minmax(0,1.5fr) minmax(260px,1fr); gap: var(--space-6)">
    <Card as="section" heading={t('nodevoyage.features')}>
      <ul class="rhythm-tight" style="list-style:none;padding:0;margin:0">
        <li><Icon name="map" /> Smart suggestions and route planning.</li>
        <li><Icon name="users" /> Collaboration and shared notes.</li>
        <li><Icon name="clock" /> Timing and day-by-day view.</li>
        <li><Icon name="shield" /> Offline-friendly and privacy-aware.</li>
        <li><Icon name="globe" /> Sustainability hints and awareness.</li>
      </ul>
    </Card>

    <Card as="aside" heading={t('nodevoyage.promo')}>
      <VideoPlayer videoBase={vid} label="NodeVoyage — promo" decorative={true}/>
    </Card>
  </section>

  <section class="section">
    <h2 class="text-strong">{t('nodevoyage.preview')}</h2>
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
      <ul><li>Solo travelers who like tidy plans.</li><li>Families and small groups.</li><li>School trips with clear schedules.</li></ul>
    </Card>
    <Card heading="How to start">
      <ol><li>Add three places for your first day.</li><li>Let Nodi suggest the order.</li><li>Share the plan and iterate.</li></ol>
      <p><a class="btn btn-primary" href={contactHref}>Ask about NodeVoyage</a></p>
    </Card>
  </section>
</main>
