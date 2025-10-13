<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const hero = {
    titleKey: 'education.page.hero.title',
    titleFallback: 'Educational Outreach & Community Building',
    subtitleKey: 'education.page.hero.subtitle',
    subtitleFallback: 'Empowering learners, educators, and communities through AI.',
    descriptionKey: 'education.page.hero.description',
    descriptionFallback:
      'AlgoRhythmics is as much an educational movement as it is a tech studio. We nurture AI literacy across classrooms, libraries, and community hubs with programs that welcome every age.',
    primaryCta: {
      href: '/contact',
      labelKey: 'education.page.hero.primary_cta',
      labelFallback: 'Join the Program'
    },
    secondaryCta: {
      href: '/education-hub#toolkits',
      labelKey: 'education.page.hero.secondary_cta',
      labelFallback: 'Access Resources'
    }
  } as const;

  const partnershipCards = [
    {
      id: 'liaa-partnership',
      eyebrowKey: 'education.page.partnerships.liaa.eyebrow',
      eyebrowFallback: 'National collaboration',
      titleKey: 'education.page.partnerships.liaa.title',
      titleFallback: 'LIAA Partnership',
      copyKey: 'education.page.partnerships.liaa.copy',
      copyFallback:
        "As the education sector ambassador with Latvia's Investment and Development Agency (LIAA), we co-create policy-ready pilots that bring AI literacy into formal curricula.",
      bullets: [
        {
          key: 'education.page.partnerships.liaa.bullets.0',
          fallback: 'Curriculum integration with bilingual lesson kits and signage-inspired visuals'
        },
        {
          key: 'education.page.partnerships.liaa.bullets.1',
          fallback: 'Teacher coaching cohorts and certification pathways that demystify AI'
        },
        {
          key: 'education.page.partnerships.liaa.bullets.2',
          fallback: 'Shared research loops to publish findings and refine national standards'
        }
      ],
      primaryCta: {
        href: 'mailto:education@algorhythmics.ai',
        labelKey: 'education.page.partnerships.liaa.cta',
        labelFallback: 'Talk with the Outreach Team'
      }
    },
    {
      id: 'school-programs',
      eyebrowKey: 'education.page.partnerships.schools.eyebrow',
      eyebrowFallback: 'Hands-on discovery',
      titleKey: 'education.page.partnerships.schools.title',
      titleFallback: 'School Programs',
      copyKey: 'education.page.partnerships.schools.copy',
      copyFallback:
        'We activate classrooms with experiential AI—coding clubs, innovation labs, and creative sprints where students see logic dance with imagination.',
      bullets: [
        {
          key: 'education.page.partnerships.schools.bullets.0',
          fallback: 'Plug-and-play project modules for math, science, arts, and humanities'
        },
        {
          key: 'education.page.partnerships.schools.bullets.1',
          fallback:
            'Workshops where students train mini AIs, compose generative art, or design ethical guidelines'
        },
        {
          key: 'education.page.partnerships.schools.bullets.2',
          fallback: 'Free or subsidised Ideonautix access so practice continues beyond the bell'
        }
      ],
      primaryCta: {
        href: '/contact',
        labelKey: 'education.page.partnerships.schools.cta',
        labelFallback: 'Request a Pilot Pack'
      }
    },
    {
      id: 'community-events',
      eyebrowKey: 'education.page.partnerships.community.eyebrow',
      eyebrowFallback: 'Beyond the classroom',
      titleKey: 'education.page.partnerships.community.title',
      titleFallback: 'Community Events',
      copyKey: 'education.page.partnerships.community.copy',
      copyFallback:
        'Monthly workshops, webinars, and neighbourhood hackathons make AI approachable for parents, professionals, and the next wave of makers.',
      bullets: [
        {
          key: 'education.page.partnerships.community.bullets.0',
          fallback: 'Open-to-all sessions that explain machine learning with tangible analogies'
        },
        {
          key: 'education.page.partnerships.community.bullets.1',
          fallback: 'Parent Ambassador Network where families co-host learning circles at libraries'
        },
        {
          key: 'education.page.partnerships.community.bullets.2',
          fallback: 'Guest mentors from industry and culture bridging real projects with storytelling'
        }
      ],
      primaryCta: {
        href: '/education-hub#events',
        labelKey: 'education.page.partnerships.community.cta',
        labelFallback: 'See Upcoming Events'
      }
    },
    {
      id: 'cultural-partnerships',
      eyebrowKey: 'education.page.partnerships.cultural.eyebrow',
      eyebrowFallback: 'Logic meets art',
      titleKey: 'education.page.partnerships.cultural.title',
      titleFallback: 'Cultural Partnerships',
      copyKey: 'education.page.partnerships.cultural.copy',
      copyFallback:
        'Museums, libraries, and creative labs collaborate with AlgoRhythmics to blend technology with heritage—sparking curiosity across generations.',
      bullets: [
        {
          key: 'education.page.partnerships.cultural.bullets.0',
          fallback: 'AI + Art exhibits that translate algorithms into sound, movement, and light'
        },
        {
          key: 'education.page.partnerships.cultural.bullets.1',
          fallback: 'Story-driven installations where elders and kids explore AI together'
        },
        {
          key: 'education.page.partnerships.cultural.bullets.2',
          fallback: 'Shared archives of lesson prompts and accessible exhibition guides'
        }
      ],
      primaryCta: {
        href: '/contact',
        labelKey: 'education.page.partnerships.cultural.cta',
        labelFallback: 'Propose a Collaboration'
      }
    }
  ] as const;

  const impactStats = [
    {
      labelKey: 'education.page.impact.items.teachers.label',
      labelFallback: 'Teachers trained',
      valueKey: 'education.page.impact.items.teachers.value',
      valueFallback: '200+',
      descriptionKey: 'education.page.impact.items.teachers.description',
      descriptionFallback: 'Certified through our calm AI pedagogy labs.'
    },
    {
      labelKey: 'education.page.impact.items.students.label',
      labelFallback: 'Students engaged',
      valueKey: 'education.page.impact.items.students.value',
      valueFallback: '5,000+',
      descriptionKey: 'education.page.impact.items.students.description',
      descriptionFallback: 'Across clubs, camps, and classroom pilots.'
    },
    {
      labelKey: 'education.page.impact.items.goal.label',
      labelFallback: 'Goal for 2026',
      valueKey: 'education.page.impact.items.goal.value',
      valueFallback: '80% of Latvian schools',
      descriptionKey: 'education.page.impact.items.goal.description',
      descriptionFallback: 'Onboarded with ready-to-run AI literacy modules.'
    },
    {
      labelKey: 'education.page.impact.items.feedback.label',
      labelFallback: 'Positive feedback',
      valueKey: 'education.page.impact.items.feedback.value',
      valueFallback: '90%',
      descriptionKey: 'education.page.impact.items.feedback.description',
      descriptionFallback: 'Educators reporting higher confidence in teaching AI topics.'
    }
  ] as const;

  const globalVision = {
    eyebrowKey: 'education.page.global.eyebrow',
    eyebrowFallback: 'Sharing the rhythm worldwide',
    titleKey: 'education.page.global.title',
    titleFallback: 'A global rhythm of shared learning',
    copyKey: 'education.page.global.copy',
    copyFallback:
      'Our outreach stretches beyond Latvia through European education networks, exchange programs, and shared research. Students collaborate across borders, trading ideas and building empathy through responsible AI projects.',
    primaryCta: {
      href: '/education-hub#insights',
      labelKey: 'education.page.global.primary_cta',
      labelFallback: 'Join Our Community Forum'
    },
    secondaryCta: {
      href: '/contact',
      labelKey: 'education.page.global.secondary_cta',
      labelFallback: 'Partner with Us'
    }
  } as const;

  const finale = {
    eyebrowKey: 'education.page.finale.eyebrow',
    eyebrowFallback: 'Open invitation',
    titleKey: 'education.page.finale.title',
    titleFallback: 'Get involved with AlgoRhythmics outreach',
    copyKey: 'education.page.finale.copy',
    copyFallback:
      'Students, educators, parents, and sponsors are welcome. We will help you orchestrate workshops, integrate curriculum, or spark community events that pair logic with creativity.',
    primary: {
      href: '/contact',
      labelKey: 'education.page.finale.primary_cta',
      labelFallback: 'Start the Conversation'
    },
    secondary: {
      href: '/education-hub#toolkits',
      labelKey: 'education.page.finale.secondary_cta',
      labelFallback: 'Download Program Overview'
    }
  } as const;
</script>

<Hero variant="halo" title={t(hero.titleKey, hero.titleFallback)} subtitle={t(hero.subtitleKey, hero.subtitleFallback)}>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href={hero.primaryCta.href} variant="gradient" size="lg">{t(hero.primaryCta.labelKey, hero.primaryCta.labelFallback)}</Button>
      <Button href={hero.secondaryCta.href} variant="secondary" size="lg">{t(hero.secondaryCta.labelKey, hero.secondaryCta.labelFallback)}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="intro" use:revealOnScroll>
  <div class="container intro__grid">
    <GlassCard class="intro-card" padding="lg">
      <h2>{t('education.page.intro.why_title', 'Why outreach matters')}</h2>
      <p>
        {t(
          'education.page.intro.why_copy',
          'Early exposure to AI concepts nurtures curiosity, confidence, and ethical awareness. Our outreach programmes are designed with signage clarity, playful experimentation, and rigorous safeguards so every learner can participate.'
        )}
      </p>
      <p>
        {t(
          'education.page.intro.partners_copy',
          'We build bridges between schools, parents, industry mentors, and cultural partners. The result is a supportive ecosystem where logic and creativity collaborate in real time.'
        )}
      </p>
    </GlassCard>
    <GlassCard class="intro-card" padding="lg" halo>
      <h2>{t('education.page.intro.how_title', 'How we collaborate')}</h2>
      <ul>
        <li>{t('education.page.intro.how_items.0', 'Co-create pilots with educators and align them with national curricula.')}</li>
        <li>{t('education.page.intro.how_items.1', 'Pair every workshop with inclusive materials and multilingual support.')}</li>
        <li>{t('education.page.intro.how_items.2', 'Document outcomes so communities can continue the rhythm independently.')}</li>
      </ul>
      <div class="intro-actions">
        <Button href="mailto:education@algorhythmics.ai" variant="secondary" size="md">{t('education.page.intro.how_cta', 'Email our Outreach Coordinators')}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<section class="partnerships" aria-labelledby="partnership-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">{t('education.page.partnerships.eyebrow', 'Programmes in motion')}</span>
      <h2 id="partnership-heading">{t('education.page.partnerships.title', 'Anchors for learners, families, and mentors')}</h2>
      <p>
        {t(
          'education.page.partnerships.copy',
          'From nationwide initiatives to after-school labs, each partnership invites communities to experience AI as something welcoming and responsible.'
        )}
      </p>
    </header>

    <div class="cards" use:staggerReveal>
      {#each partnershipCards as card (card.id)}
        <GlassCard class="partnership-card" padding="lg" id={card.id}>
          <span class="card-eyebrow">{t(card.eyebrowKey, card.eyebrowFallback)}</span>
          <h3>{t(card.titleKey, card.titleFallback)}</h3>
          <p>{t(card.copyKey, card.copyFallback)}</p>
          <ul>
            {#each card.bullets as bullet (bullet.key)}
              <li>{t(bullet.key, bullet.fallback)}</li>
            {/each}
          </ul>
          <div class="card-actions">
            <Button href={card.primaryCta.href} variant="gradient" size="md">{t(card.primaryCta.labelKey, card.primaryCta.labelFallback)}</Button>
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="impact" use:revealOnScroll>
  <div class="container impact__grid">
    {#each impactStats as stat (stat.labelKey)}
      <GlassCard class="impact-card" padding="lg">
        <span class="impact-value">{t(stat.valueKey, stat.valueFallback)}</span>
        <h3>{t(stat.labelKey, stat.labelFallback)}</h3>
        <p>{t(stat.descriptionKey, stat.descriptionFallback)}</p>
      </GlassCard>
    {/each}
  </div>
  <p class="impact-note">
    {t(
      'education.page.impact.note',
      'Metrics guide our iteration, but the stories matter most—like the student who chose a tech career after an AlgoRhythmics camp or the teacher who now leads AI clubs with confidence.'
    )}
  </p>
</section>

<SectionDivider tone="aurora" />

<section class="global-vision" use:revealOnScroll>
  <div class="container">
    <GlassCard class="global-card" halo padding="lg">
      <span class="section-eyebrow">{t(globalVision.eyebrowKey, globalVision.eyebrowFallback)}</span>
      <h2>{t(globalVision.titleKey, globalVision.titleFallback)}</h2>
      <p>{t(globalVision.copyKey, globalVision.copyFallback)}</p>
      <div class="card-actions">
        <Button href={globalVision.primaryCta.href} variant="gradient" size="md">{t(globalVision.primaryCta.labelKey, globalVision.primaryCta.labelFallback)}</Button>
        <Button href={globalVision.secondaryCta.href} variant="secondary" size="md">{t(globalVision.secondaryCta.labelKey, globalVision.secondaryCta.labelFallback)}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<section class="finale" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg">
      <span class="section-eyebrow">{t(finale.eyebrowKey, finale.eyebrowFallback)}</span>
      <h2>{t(finale.titleKey, finale.titleFallback)}</h2>
      <p>{t(finale.copyKey, finale.copyFallback)}</p>
      <div class="card-actions">
        <Button href={finale.primary.href} variant="gradient" size="lg">{t(finale.primary.labelKey, finale.primary.labelFallback)}</Button>
        <Button href={finale.secondary.href} variant="secondary" size="lg">{t(finale.secondary.labelKey, finale.secondary.labelFallback)}</Button>
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




