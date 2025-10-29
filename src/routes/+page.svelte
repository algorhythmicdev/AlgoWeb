<script lang="ts">
  import { base as appBase } from '$app/paths';
  import Card from '$lib/components/Card.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import { productIcons, videoAlgorhythmics } from '$lib/presentAssets';

  const contactHref = `${appBase}/contact`;
  const ideonautixHref = `${appBase}/ideonautix`;
  const nodevoyageHref = `${appBase}/nodevoyage`;
  const consultingHref = `${appBase}/consulting`;
  const educationHref = `${appBase}/education`;

  const findAsset = (needles: string[]) =>
    productIcons.find((path) =>
      needles.some((n) => path.toLowerCase().includes(n.toLowerCase()))
    ) || null;

  const iconIdeonautix = findAsset(['ideonautix', 'ix']);
  const iconNodeVoyage = findAsset(['nodevoyage', 'nodi', 'nv']);
</script>

<svelte:head>
  <title>Algorhythmics</title>
  <meta name="description" content="Useful AI products, consulting, and education programs from Latvia." />
</svelte:head>

<main id="main" class="prose rhythm">
  <section class="section hero-gradient" style="position:relative">
    <div class="container">
      <div class="card frosted" style="max-width:880px;margin:0 auto;text-align:center;padding:2rem;">
        <h1 class="text-strong" style="margin:0 0 .5rem">Let’s create something useful</h1>
        <p class="text-secondary" style="margin:0 0 1rem">We build practical AI tools and help teams adopt them quickly.</p>
        <a class="btn btn-primary" href={contactHref}>Let’s talk</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container grid-2">
      <Card heading="Ideonautix">
        <div class="grid-2" style="align-items:center;">
          <AssetImage src={iconIdeonautix} alt="Ideonautix" ratio="1 / 1" fit="contain" />
          <ul class="stack">
            <li>Pitch Assistant, Standups, Focus Coach, Intel</li>
            <li>Clean UI, six languages, AAA text contrast</li>
            <li>Simple exports and short learning curve</li>
          </ul>
        </div>
        <a class="btn" href={ideonautixHref} style="margin-top:var(--space-4);width:fit-content">Explore Ideonautix</a>
      </Card>

      <Card heading="NodeVoyage">
        <div class="grid-2" style="align-items:center;">
          <AssetImage src={iconNodeVoyage} alt="NodeVoyage" ratio="1 / 1" fit="contain" />
          <ul class="stack">
            <li>Map + timeline planning with Nodi helper</li>
            <li>Real-time edits, budget & eco drawers</li>
            <li>On-trip capture: camera, voice, translate</li>
          </ul>
        </div>
        <a class="btn" href={nodevoyageHref} style="margin-top:var(--space-4);width:fit-content">See NodeVoyage</a>
      </Card>
    </div>
  </section>

  <section class="section" style="background: var(--bg-elev-2);">
    <div class="container stack" style="text-align:center;">
      <div class="stack" style="margin:0 auto;max-width:56ch;">
        <h2 class="text-strong" style="margin:0">What we do</h2>
        <p class="text-secondary" style="margin:0">Practical automation and adoption support so teams learn while they ship.</p>
      </div>
      <div class="grid-2">
        <Card heading="Consulting">
          <p class="text-secondary">Automation, data workflows, and training with clear outcomes.</p>
          <a class="btn" href={consultingHref}>Learn more</a>
        </Card>
        <Card heading="Education">
          <p class="text-secondary">Plain-language AI programs for Latvian schools and universities.</p>
          <a class="btn" href={educationHref}>Programs</a>
        </Card>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container stack" style="text-align:center;">
      <h2 class="text-strong" style="margin:0">Product preview</h2>
      <Card elevation={2} className="rhythm-tight" as="section">
        <VideoPlayer src={videoAlgorhythmics} ratio="16 / 9" />
      </Card>
    </div>
  </section>

  <section class="section">
    <div class="container stack" style="text-align:center;">
      <h2 class="text-strong" style="margin:0">Testimonials</h2>
      <div class="grid-2">
        <Card as="blockquote" className="rhythm-tight">
          <p class="text-secondary" style="margin:0 0 .75rem;">“Clear plan, shipped fast. We finally see results.”</p>
          <footer class="text-strong">— Program lead</footer>
        </Card>
        <Card as="blockquote" className="rhythm-tight">
          <p class="text-secondary" style="margin:0 0 .75rem;">“They explain things simply and deliver the parts that matter.”</p>
          <footer class="text-strong">— Founder</footer>
        </Card>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container stack" style="text-align:center;">
      <h2 class="text-strong" style="margin:0">Timeline</h2>
      <div class="grid-2">
        <Card className="rhythm-tight" heading="2024–2025">
          <p class="text-secondary" style="margin:0;">Core vision and prototypes.</p>
        </Card>
        <Card className="rhythm-tight" heading="2025">
          <p class="text-secondary" style="margin:0;">Public website and product previews.</p>
        </Card>
      </div>
    </div>
  </section>

  <section class="section" style="text-align:center;">
    <a class="btn btn-primary" href={contactHref}>Let’s talk</a>
  </section>
</main>
