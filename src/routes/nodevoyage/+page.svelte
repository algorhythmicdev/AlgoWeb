<script lang="ts">
  import { base as appBase } from '$app/paths';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { nodevoyagePreviews, videoNodeVoyage } from '$lib/presentAssets';
  const previews = nodevoyagePreviews; // string[]
  const vid = videoNodeVoyage;         // string | null
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>NodeVoyage — Plan trips with Nodi</title>
  <meta name="description" content="AI-assisted trip planning. Keep ideas, routes, and people in sync." />
</svelte:head>

<main id="main" class="prose">
  <h1 class="text-strong">NodeVoyage</h1>
  <p>Plan trips with Nodi. Collect places, set routes, and keep your crew in sync. The goal: less time fiddling, more time doing.</p>

  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <h2 class="text-strong">Promo video</h2>
    <VideoPlayer videoBase={vid} label="NodeVoyage — promo" />
  </section>

  <section class="section">
    <h2 class="text-strong">Core features</h2>
    <ul>
      <li><strong>Suggestions:</strong> Nodi helps you pick places and routes.</li>
      <li><strong>Route planning:</strong> map stops, timing, and notes in one place.</li>
      <li><strong>Collaboration:</strong> invite friends, split tasks, keep it tidy.</li>
      <li><strong>Offline-friendly:</strong> keep the plan handy when you’re moving.</li>
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

  <p><a class="btn btn-primary" href={contactHref}>Ask about NodeVoyage</a></p>
</main>
