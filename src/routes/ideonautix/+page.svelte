<script lang="ts">
  import { base as appBase } from '$app/paths';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { ideonautixPreviews, videoIdeonautix } from '$lib/presentAssets';
  const previews = ideonautixPreviews; // string[]
  const vid = videoIdeonautix;         // string | null
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Ideonautix — Startup education & productivity</title>
  <meta name="description" content="A simple toolkit for students, founders, and teams. Learn, plan, and execute with clarity." />
</svelte:head>

<main id="main" class="prose">
  <h1 class="text-strong">Ideonautix</h1>
  <p>Startup education and productivity toolkit. Clear steps, short lessons, and practical templates. Built for students, founders, and teams who want to move from ideas to results.</p>

  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <h2 class="text-strong">Promo video</h2>
    <VideoPlayer videoBase={vid} label="Ideonautix — promo" />
  </section>

  <section class="section">
    <h2 class="text-strong">What’s inside</h2>
    <ul>
      <li><strong>Pitch Assistant:</strong> build a clear story and slide outline.</li>
      <li><strong>Competitive Intelligence:</strong> a simple way to map your market.</li>
      <li><strong>Focus Coach:</strong> short work blocks with real outcomes.</li>
      <li><strong>Team Standups:</strong> short check-ins that keep promises honest.</li>
      <li><strong>Metrics basics:</strong> learn what to track and why.</li>
    </ul>
  </section>

  <section class="section">
    <h2 class="text-strong">What you can do today</h2>
    <ul>
      <li>Use the templates to write your first clear pitch.</li>
      <li>Draft 3 competitor snapshots and one positioning sentence.</li>
      <li>Plan two focused weekly goals and track progress simply.</li>
    </ul>
  </section>

  <section class="section">
    <h2 class="text-strong">Preview</h2>
    <div class="grid">
      {#if previews.length === 0}
        <div class="card surface-2 control"><AssetImage assetBase={null} alt="Preview 1" /></div>
        <div class="card surface-2 control"><AssetImage assetBase={null} alt="Preview 2" /></div>
      {:else}
        {#each previews as b}
          <div class="card surface-2 control"><AssetImage assetBase={b} alt={b.split('/').pop()||'Preview'} /></div>
        {/each}
      {/if}
    </div>
  </section>

  <p><a class="btn btn-primary" href={contactHref}>Ask about Ideonautix</a></p>
</main>
