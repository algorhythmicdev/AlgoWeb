<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { founders } from '$lib/presentAssets';

  const findPhoto = (needles: string[]) =>
    founders.find((path) =>
      needles.some((n) => path.toLowerCase().includes(n.toLowerCase()))
    ) || null;

  const nikitaPhoto = findPhoto(['nikita']);
  const slaffPhoto = findPhoto(['slaff', 'vjaceslavs']);
</script>

<svelte:head>
  <title>Team — Algorhythmics</title>
  <meta name="description" content="Algorhythmics is a Latvia-based team building accessible AI products and consulting." />
</svelte:head>

<main id="main">
  <section class="section">
    <div class="container stack">
      <header class="stack">
        <h1 class="text-strong" style="margin:0">Team</h1>
        <p class="text-secondary" style="margin:0">
          Algorhythmics is based in Daugavpils, Latvia. We build accessible AI tools and offer practical AI consulting.
          Mentions of signage R&amp;D live here in the Team section and partner notes only.
        </p>
      </header>

      <div class="grid-3">
        <Card heading="Who we are">
          <p>Latvia-based builders focused on useful AI, clear UI, and education outreach. Straight talk, six languages, WCAG-first.</p>
          <ul>
            <li>Products: Ideonautix and NodeVoyage</li>
            <li>Consulting: automation, data workflows, training</li>
            <li>Education: schools/universities in Latvia</li>
          </ul>
        </Card>

        <Card heading="Founders">
          <article class="stack">
            <div class="founder">
              <AssetImage src={nikitaPhoto} alt="Nikita Jurtaevs" ratio="1 / 1" />
              <div>
                <h3 style="margin:0">Nikita Jurtaevs</h3>
                <p class="text-secondary" style="margin:.25rem 0 0">CEO &amp; Product — 50/50 co-leadership</p>
                <ul>
                  <li>Strategy, partnerships, brand direction; product management and UX/QA across NodeVoyage &amp; Ideonautix.</li>
                  <li>Reclame Fabriek R&amp;D: next-gen LED neon, in-house LED controllers, custom coatings, 3D-printed components.</li>
                  <li>Accessibility-first, multilingual delivery; pilots &amp; lean GTM 2025–2026.</li>
                </ul>
              </div>
            </div>

            <div class="founder">
              <AssetImage src={slaffPhoto} alt="Vjaceslavs “Slaff” Trosins" ratio="1 / 1" />
              <div>
                <h3 style="margin:0">Vjaceslavs “Slaff” Trosins</h3>
                <p class="text-secondary" style="margin:.25rem 0 0">CTO — 50/50 co-leadership</p>
                <ul>
                  <li>Technical vision &amp; delivery across web/mobile, APIs, and AI integration for both products.</li>
                  <li>Reclame Fabriek R&amp;D: systems design and controller engineering for advanced signage.</li>
                  <li>Stack: SvelteKit/TS, Flutter/Dart, Fastify, Prisma/Postgres, Redis/BullMQ; WCAG 2.2 &amp; GDPR as defaults.</li>
                </ul>
              </div>
            </div>
          </article>
        </Card>

        <Card heading="Partners &amp; background">
          <p>LIAA (Latvian Investment and Development Agency) context and current workplace reference (Reclame Fabriek) for R&amp;D collaboration in Latvia.</p>
          <p class="text-secondary">Logos appear in footer; references stay transparent and factual.</p>
        </Card>
      </div>
    </div>
  </section>
</main>

<style>
  .founder{
    display:grid;
    grid-template-columns: 120px 1fr;
    gap: 1rem;
    align-items:start;
  }
  @media (max-width: 600px){
    .founder{ grid-template-columns: 90px 1fr; }
  }
</style>
