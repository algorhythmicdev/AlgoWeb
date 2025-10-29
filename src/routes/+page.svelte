<script lang="ts">
  import { base } from '$app/paths';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';

  const contactHref = `${base}/contact`;
  const ideonautixHref = `${base}/ideonautix`;
</script>

<svelte:head>
  <title>Algorhythmics</title>
  <meta name="description" content="We build practical AI tools and help teams adopt them quickly." />
</svelte:head>

<main id="main">
  <section class="page container grid cols-2" style="margin-top:48px">
  <div class="card frost">
    <h1>Let's create something useful</h1>
    <p>We build practical AI tools and help teams adopt them quickly.</p>
    <div style="display:flex; gap:12px; margin-top:12px">
      <a class="btn btn-primary" href={contactHref}>Let's talk</a>
      <a class="btn" href={ideonautixHref}>See Ideonautix</a>
    </div>
  </div>
  <div class="card">
    <VideoPlayer srcWebm="/videos/algorhythmics-promo.webm" className="ratio-16x9" />
  </div>
</section>

<section class="page container" style="margin-top:48px">
  <div class="grid cols-2">
    <div class="card">
      <h2>Ideonautix</h2>
      <p>Startup toolkit: Focus Coach, Pitch Assistant, Competitive Intel and more—multilingual and accessible.</p>
      <VideoPlayer srcWebm="/videos/ideonautix-promo.webm" className="ratio-16x9" />
    </div>
    <div class="card">
      <h2>NodeVoyage</h2>
      <p>Map-first travel planning with Nodi guidance, collaboration, and sustainability tools.</p>
      <VideoPlayer srcWebm="/videos/nodevoyage-promo.webm" className="ratio-16x9" />
    </div>
  </div>
</section>
</main>
