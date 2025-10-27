<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import { nodevoyagePreviews, promoNodeVoyage } from '$lib/assets';

  const head = Head({ title: 'NodeVoyage', description: 'AI-assisted trip planning with Nodi.' });
  const features = [
    'AI trip suggestions',
    'Route optimization',
    'Collaboration',
    'Sustainability tracking',
    'Mobile capture'
  ];

  const present = nodevoyagePreviews().map((i) => ({ assetBase: i.base, alt: i.base.split('/').pop() ?? 'Preview' }));
  const gallery = present.length ? present : [
    { assetBase: null, alt: 'Preview 1' },
    { assetBase: null, alt: 'Preview 2' }
  ];
  const vid = promoNodeVoyage() ?? null;
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose">
  <h1>NodeVoyage</h1>
  <p>Plan trips with Nodi — keep ideas, routes, and people in sync.</p>

  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <div class="scrim">
      <h2>Promo video</h2>
      <VideoPlayer videoBase={vid} label="NodeVoyage — promo" />
    </div>
  </section>

  <h2>Features</h2>
  <ul>
    {#each features as f}
      <li>{f}</li>
    {/each}
  </ul>
  <h2>Preview</h2>
  <GalleryPreview items={gallery} />
</main>
