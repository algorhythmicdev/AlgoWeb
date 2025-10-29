<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import FounderCard from '$lib/components/FounderCard.svelte';
  import { founders } from '$lib/presentAssets';

  const nikPhoto = founders.find(f => /nikita/i.test(f)) || '/images/founders/founder-nikita';
  const slaffPhoto = founders.find(f => /slaff|vjaceslav/i.test(f)) || '/images/founders/founder-slaff';
</script>

<svelte:head>
  <title>Team — Algorhythmics</title>
  <meta name="description" content="Latvia-based founders building accessible AI tools and practical consulting." />
</svelte:head>

<main id="main" class="prose rhythm section container">
  <h1 class="text-strong">Team</h1>

  <section class="grid" style="gap: var(--space-6)">
    <Card heading="Who we are">
      <p><strong>Algorhythmics</strong> is based in Daugavpils, Latvia. We build accessible AI tools and offer practical AI consulting. Mentions of signage R&amp;D live here in the Team section and partner notes only.</p>
    </Card>

    <Card heading="Founders">
      <div class="grid" style="gap:1rem">
        <FounderCard
          name="Nikita Jurtaevs"
          role="CEO & Product — 50/50 co-leadership"
          photoBase={nikPhoto}
          summary="Strategy, partnerships, brand direction. Coordinates product management and UX/QA across NodeVoyage & Ideonautix."
          bullets={[
            'Active work in Reclame Fabriek\'s Signage Research Department.',
            'R&D scope includes next-gen LED neon systems, in-house LED controllers, custom coatings, and 3D-printed components.',
            'Leads accessibility-first, multilingual delivery and education outreach aligned to LIAA.',
            'Maintains honest early-stage positioning: building Algorhythmics while contributing to Reclame Fabriek R&D.'
          ]}
        />

        <FounderCard
          name='Vjaceslavs "Slaff" Trosins'
          role="CTO & Platform — 50/50 co-leadership"
          photoBase={slaffPhoto}
          summary="Owns technical vision and delivery across web/mobile, APIs, and AI integration for NodeVoyage & Ideonautix."
          bullets={[
            'Current work in Reclame Fabriek Signage Research: systems design and controller engineering.',
            'Stack & delivery: Google Cloud–first (Cloud Run, Vertex/Gemini, Memorystore, Cloud SQL), SvelteKit/TypeScript, Flutter/Dart, Fastify, Prisma/PostgreSQL, Redis/BullMQ, WebSockets/SSE.',
            'Security, GDPR, and WCAG 2.2 as baseline disciplines.',
            'Near-term delivery via three funding sprints: Pomodoro Coach, Startup Pitch Assistant, Competitive Intelligence.'
          ]}
        />
      </div>
      <p class="text-secondary" style="margin-top:.5rem">Evidence of R&amp;D scope is reflected on Reclame Fabriek's own Signage Research page (LED neon, controllers, fabrication workflows at the Daugavpils facility).</p>
    </Card>

    <Card heading="Partners & background">
      <ul>
        <li>LIAA — Latvian Investment and Development Agency (education & outreach).</li>
        <li>Reclame Fabriek — current workplace reference; R&amp;D collaboration in Latvia.</li>
      </ul>
    </Card>
  </section>
</main>
