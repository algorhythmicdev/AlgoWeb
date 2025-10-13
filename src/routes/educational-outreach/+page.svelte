<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const hero = {
    title: 'Educational Outreach & Community Building',
    subtitle: 'Empowering learners, educators, and communities through AI.',
    description:
      'AlgoRhythmics is as much an educational movement as it is a tech studio. We nurture AI literacy across classrooms, libraries, and community hubs with programs that welcome every age.',
    primaryCta: { label: 'Join the Program', href: '/contact' },
    secondaryCta: { label: 'Access Resources', href: '/resources#documentation' }
  };

  const partnershipCards = [
    {
      id: 'liaa-partnership',
      eyebrow: 'National collaboration',
      title: 'LIAA Partnership',
      copy:
        'As the education sector ambassador with Latvia\'s Investment and Development Agency (LIAA), we co-create policy-ready pilots that bring AI literacy into formal curricula.',
      bullets: [
        'Curriculum integration with bilingual lesson kits and signage-inspired visuals',
        'Teacher coaching cohorts and certification pathways that demystify AI',
        'Shared research loops to publish findings and refine national standards'
      ],
      primaryCta: { label: 'Talk with the Outreach Team', href: 'mailto:education@algorhythmics.ai' }
    },
    {
      id: 'school-programs',
      eyebrow: 'Hands-on discovery',
      title: 'School Programs',
      copy:
        'We activate classrooms with experiential AI—coding clubs, innovation labs, and creative sprints where students see logic dance with imagination.',
      bullets: [
        'Plug-and-play project modules for math, science, arts, and humanities',
        'Workshops where students train mini AIs, compose generative art, or design ethical guidelines',
        'Free or subsidised Ideonautix access so practice continues beyond the bell'
      ],
      primaryCta: { label: 'Request a Pilot Pack', href: '/contact' }
    },
    {
      id: 'community-events',
      eyebrow: 'Beyond the classroom',
      title: 'Community Events',
      copy:
        'Monthly workshops, webinars, and neighbourhood hackathons make AI approachable for parents, professionals, and the next wave of makers.',
      bullets: [
        'Open-to-all sessions that explain machine learning with tangible analogies',
        'Parent Ambassador Network where families co-host learning circles at libraries',
        'Guest mentors from industry and culture bridging real projects with storytelling'
      ],
      primaryCta: { label: 'See Upcoming Events', href: '/resources#events' }
    },
    {
      id: 'cultural-partnerships',
      eyebrow: 'Logic meets art',
      title: 'Cultural Partnerships',
      copy:
        'Museums, libraries, and creative labs collaborate with AlgoRhythmics to blend technology with heritage—sparking curiosity across generations.',
      bullets: [
        'AI + Art exhibits that translate algorithms into sound, movement, and light',
        'Story-driven installations where elders and kids explore AI together',
        'Shared archives of lesson prompts and accessible exhibition guides'
      ],
      primaryCta: { label: 'Propose a Collaboration', href: '/contact' }
    }
  ];

  const impactStats = [
    { label: 'Teachers trained', value: '200+', description: 'Certified through our calm AI pedagogy labs.' },
    { label: 'Students engaged', value: '5,000+', description: 'Across clubs, camps, and classroom pilots.' },
    { label: 'Goal for 2026', value: '80% of Latvian schools', description: 'Onboarded with ready-to-run AI literacy modules.' },
    { label: 'Positive feedback', value: '90%', description: 'Educators reporting higher confidence in teaching AI topics.' }
  ];

  const globalVision = {
    title: 'A global rhythm of shared learning',
    copy:
      'Our outreach stretches beyond Latvia through European education networks, exchange programs, and shared research. Students collaborate across borders, trading ideas and building empathy through responsible AI projects.',
    primaryCta: { label: 'Join Our Community Forum', href: '/resources#blog' },
    secondaryCta: { label: 'Partner with Us', href: '/contact' }
  };

  const finale = {
    title: 'Get involved with AlgoRhythmics outreach',
    copy:
      'Students, educators, parents, and sponsors are welcome. We will help you orchestrate workshops, integrate curriculum, or spark community events that pair logic with creativity.',
    primary: { label: 'Start the Conversation', href: '/contact' },
    secondary: { label: 'Download Program Overview', href: '/resources#documentation' }
  };
</script>

<Hero variant="halo" title={hero.title} subtitle={hero.subtitle}>
  <svelte:fragment slot="description">
    <p class="hero-description">{hero.description}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href={hero.primaryCta.href} variant="gradient" size="lg">{hero.primaryCta.label}</Button>
      <Button href={hero.secondaryCta.href} variant="secondary" size="lg">{hero.secondaryCta.label}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="intro" use:revealOnScroll>
  <div class="container intro__grid">
    <GlassCard class="intro-card" padding="lg">
      <h2>Why outreach matters</h2>
      <p>
        Early exposure to AI concepts nurtures curiosity, confidence, and ethical awareness. Our outreach programmes are designed with signage clarity, playful experimentation, and rigorous safeguards so every learner can participate.
      </p>
      <p>
        We build bridges between schools, parents, industry mentors, and cultural partners. The result is a supportive ecosystem where logic and creativity collaborate in real time.
      </p>
    </GlassCard>
    <GlassCard class="intro-card" padding="lg" halo>
      <h2>How we collaborate</h2>
      <ul>
        <li>Co-create pilots with educators and align them with national curricula.</li>
        <li>Pair every workshop with inclusive materials and multilingual support.</li>
        <li>Document outcomes so communities can continue the rhythm independently.</li>
      </ul>
      <div class="intro-actions">
        <Button href="mailto:education@algorhythmics.ai" variant="secondary" size="md">Email our Outreach Coordinators</Button>
      </div>
    </GlassCard>
  </div>
</section>

<section class="partnerships" aria-labelledby="partnership-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Programmes in motion</span>
      <h2 id="partnership-heading">Anchors for learners, families, and mentors</h2>
      <p>
        From nationwide initiatives to after-school labs, each partnership invites communities to experience AI as something welcoming and responsible.
      </p>
    </header>

    <div class="cards" use:staggerReveal>
      {#each partnershipCards as card (card.id)}
        <GlassCard class="partnership-card" padding="lg" id={card.id}>
          <span class="card-eyebrow">{card.eyebrow}</span>
          <h3>{card.title}</h3>
          <p>{card.copy}</p>
          <ul>
            {#each card.bullets as bullet (bullet)}
              <li>{bullet}</li>
            {/each}
          </ul>
          <div class="card-actions">
            <Button href={card.primaryCta.href} variant="gradient" size="md">{card.primaryCta.label}</Button>
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="impact" use:revealOnScroll>
  <div class="container impact__grid">
    {#each impactStats as stat (stat.label)}
      <GlassCard class="impact-card" padding="lg">
        <span class="impact-value">{stat.value}</span>
        <h3>{stat.label}</h3>
        <p>{stat.description}</p>
      </GlassCard>
    {/each}
  </div>
  <p class="impact-note">
    Metrics guide our iteration, but the stories matter most—like the student who chose a tech career after an AlgoRhythmics camp or the teacher who now leads AI clubs with confidence.
  </p>
</section>

<SectionDivider tone="aurora" />

<section class="global-vision" use:revealOnScroll>
  <div class="container">
    <GlassCard class="global-card" halo padding="lg">
      <span class="section-eyebrow">Sharing the rhythm worldwide</span>
      <h2>{globalVision.title}</h2>
      <p>{globalVision.copy}</p>
      <div class="card-actions">
        <Button href={globalVision.primaryCta.href} variant="gradient" size="md">{globalVision.primaryCta.label}</Button>
        <Button href={globalVision.secondaryCta.href} variant="secondary" size="md">{globalVision.secondaryCta.label}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<section class="finale" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg">
      <span class="section-eyebrow">Open invitation</span>
      <h2>{finale.title}</h2>
      <p>{finale.copy}</p>
      <div class="card-actions">
        <Button href={finale.primary.href} variant="gradient" size="lg">{finale.primary.label}</Button>
        <Button href={finale.secondary.href} variant="secondary" size="lg">{finale.secondary.label}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .hero-description {
    max-width: 60ch;
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .intro,
  .partnerships,
  .impact,
  .global-vision,
  .finale {
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }

  .intro__grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.intro-card) {
    display: grid;
    gap: clamp(0.9rem, 2.5vw, 1.4rem);
  }

   :global(.intro-card) ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.4rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .intro-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
  }

  .section-heading {
    max-width: 72ch;
    margin: 0 auto clamp(2rem, 6vw, 3rem);
    text-align: center;
    display: grid;
    gap: 0.8rem;
  }

  .section-eyebrow,
  .card-eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.9rem;
    border-radius: 999px;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-2) 86%, rgba(var(--voyage-blue-rgb), 0.18) 14%);
    color: color-mix(in srgb, var(--voyage-blue) 68%, var(--text-secondary) 32%);
  }

  .cards {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.partnership-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }
  :global(.partnership-card) ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.4rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  .impact__grid {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2rem);
  }

  :global(.impact-card) {
    text-align: center;
    display: grid;
    gap: 0.4rem;
  }

  .impact-value {
    font-size: clamp(2.2rem, 4vw, 2.8rem);
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
  }

  .impact-note {
    max-width: 72ch;
    margin: clamp(2rem, 6vw, 3rem) auto 0;
    text-align: center;
    color: var(--text-secondary);
  }

  :global(.global-card),
  :global(.finale-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
    text-align: center;
  }

  @media (min-width: 960px) {
    .intro__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .impact__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .intro,
    .partnerships,
    .impact,
    .global-vision,
    .finale {
      animation: none;
    }
  }
</style>




