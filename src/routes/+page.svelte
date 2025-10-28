<script lang="ts">
  import { base as appBase } from '$app/paths';
  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import { videoAlgorhythmics } from '$lib/presentAssets';
  const algVid = videoAlgorhythmics; // string | null
  const contactHref = `${appBase}/contact`;
  const ideonautixHref = `${appBase}/ideonautix`;
  const nodevoyageHref = `${appBase}/nodevoyage`;
</script>

<svelte:head>
  <title>Algorhythmics — Practical AI, real outcomes</title>
  <meta name="description" content="We build simple, useful AI tools and deliver hands-on consulting. Based in Daugavpils, Latvia." />
</svelte:head>

<main id="main" class="prose">
  <!-- Hero -->
  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <div class="glass scrim">
      <h1 class="text-strong">Let’s create something useful</h1>
      <p>We build practical AI tools and help teams adopt them quickly. No jargon. No mystery. Just results.</p>
      <p><a class="btn btn-primary" href={contactHref}>Contact us</a></p>
    </div>
  </section>

  <!-- Products -->
  <section class="section">
    <h2 class="text-strong">Products</h2>
    <div class="grid">
      <a class="card surface-2 control" href={ideonautixHref}>
        <h3>Ideonautix</h3>
        <p>Startup education and productivity toolkit for students, founders, and teams.</p>
      </a>
      <a class="card surface-2 control" href={nodevoyageHref}>
        <h3>NodeVoyage</h3>
        <p>AI-assisted trip planning with Nodi — turn ideas into routes and real plans.</p>
      </a>
    </div>
  </section>

  <!-- Promo video -->
  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <h2 class="text-strong">Algorhythmics — promo</h2>
    <VideoPlayer videoBase={algVid} label="Algorhythmics — promo" />
  </section>

  <!-- What we do -->
  <section class="section">
    <h2 class="text-strong">What we do</h2>
    <ul>
      <li><strong>Consulting:</strong> automation, data flows, training, and quick prototypes.</li>
      <li><strong>Product development:</strong> Ideonautix and NodeVoyage, built in public.</li>
      <li><strong>Education:</strong> clear, hands-on programs for schools and universities in Latvia.</li>
    </ul>
  </section>

  <!-- Testimonials (simple, non-exaggerated) -->
  <section class="section">
    <h2 class="text-strong">What people say</h2>
    <div class="card surface-2 control">
      <blockquote>
        <p>“Clear plan, shipped fast. We finally see results.”</p>
        <footer>— Program lead</footer>
      </blockquote>
    </div>
  </section>

  <!-- Timeline -->
  <section class="section">
    <h2 class="text-strong">Timeline</h2>
    <ol class="grid" style="list-style:none;padding:0">
      <li class="card surface-2 control"><strong>2024–2025</strong> — Defined the core vision and prototypes</li>
      <li class="card surface-2 control"><strong>2025</strong> — Public website and product previews</li>
    </ol>
  </section>

  <!-- CTA -->
  <section class="section">
    <a class="btn btn-primary" href={contactHref}>Let’s talk</a>
  </section>
</main>
