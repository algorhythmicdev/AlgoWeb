<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import { ideonautixPreviews, promoIdeonautix } from '$lib/assets';

  const head = Head({ title: 'Ideonautix', description: 'Startup education & productivity toolkit.' });
  const features = ['Pitch Assistant', 'Competitive Intelligence', 'Pomodoro Coach', 'Smart Standups', 'Revenue Dashboard'];

  const present = ideonautixPreviews().map((i) => ({ base: i.base, alt: i.base.split('/').pop() ?? 'Preview' }));
  const gallery = present.length
    ? present
    : [
        { base: null, alt: 'Preview 1' },
        { base: null, alt: 'Preview 2' }
      ];
  const vid = promoIdeonautix() ?? null;
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose">
  <h1>Ideonautix</h1>
  <p>Overview and mission in plain language. Built for students, founders, and teams.</p>

  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <div class="scrim">
      <h2>Promo video</h2>
      <VideoPlayer videoBase={vid} label="Ideonautix — promo" />
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
