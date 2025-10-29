<script lang="ts">
  import AssetImage from '$lib/components/AssetImage.svelte';
</script>

<svelte:head>
  <title>Team — Algorhythmics</title>
  <meta name="description" content="Algorhythmics is based in Daugavpils, Latvia. We build accessible AI tools and offer practical consulting." />
</svelte:head>

<main id="main">
  <section class="page container">
  <h1>Team</h1>
  <p>Algorhythmics is based in Daugavpils, Latvia. We build accessible AI tools and offer practical consulting.</p>

  <div class="grid cols-2" style="margin-top:24px">
    <article class="card grid cols-2">
      <AssetImage src="/images/founders/founder-nikita.png" alt="Nikita Jurtaevs" ratio="1x1" />
      <div>
        <h2>Nikita Jurtaevs — CEO & Product</h2>
        <ul>
          <li>Leads brand & product direction; UX/QA across NodeVoyage & Ideonautix.</li>
          <li>Current R&D at Reclame Fabriek (LED neon, in-house controllers, coatings, 3D printing).</li>
          <li>Accessibility-first, multilingual delivery; pilots and lean GTM 2025–2026.</li>
        </ul>
      </div>
    </article>

    <article class="card grid cols-2">
      <AssetImage src="/images/founders/founder-slaff.png" alt={'Vjaceslavs "Slaff" Trosins'} ratio="1x1" />
      <div>
        <h2>Vjaceslavs "Slaff" Trosins — CTO</h2>
        <ul>
          <li>Owns technical vision: web/mobile, APIs, AI integration.</li>
          <li>Google Cloud-first architecture; SvelteKit/TypeScript, Flutter/Dart, Fastify, Prisma/Postgres.</li>
          <li>Hands-on signage-grade controller work aligned with explainable AI features.</li>
        </ul>
      </div>
    </article>
  </div>

  <aside class="card" style="margin-top:24px">
    <h3>Partners & background</h3>
    <p>LIAA (Latvia) and current workplace R&D at Reclame Fabriek in Daugavpils (next-gen LED neon, in-house controllers, advanced fabrication).</p>
  </aside>
</section>
</main>
