<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Section from '$lib/components/Section.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { withBase } from '$utils/paths';
  import { slideY } from '$lib/animations';
  import { _ } from '$lib/i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  type TranslationParams = Record<string, unknown>;

  const t = (
    key: string,
    fallbackOrParams?: string | TranslationParams,
    params?: TranslationParams
  ) => {
    const fallback = typeof fallbackOrParams === 'string' ? fallbackOrParams : '';
    const finalParams =
      typeof fallbackOrParams === 'string' || fallbackOrParams === undefined
        ? params
        : fallbackOrParams;
    return translateOrFallback($_, key, fallback, finalParams);
  };

  const asset = (path: string) => withBase(path) ?? path;

  const hero = {
    eyebrowKey: 'about.page.hero.eyebrow',
    eyebrowFallback: 'Inside AlgoRhythmics',
    titleKey: 'about.page.hero.title',
    titleFallback: 'Accessible AI with signage-grade discipline',
    subtitleKey: 'about.page.hero.subtitle',
    subtitleFallback:
      'AlgoRhythmics is a Latvia-born studio co-led by founders who split their time between our products and Reclame Fabriek’s Signage Research Department.',
    descriptionKey: 'about.page.hero.description',
    descriptionFallback:
      'We blend signage R&D, accessible design, and honest communication. NodeVoyage and Ideonautix are in development, backed by fabrication work on next-gen LED neon, in-house controllers, custom coatings, and 3D printed components in Daugavpils.',
    primary: {
      href: '/consulting',
      labelKey: 'about.page.hero.primary_cta',
      labelFallback: 'Explore Our Services'
    },
    secondary: {
      href: '#team',
      labelKey: 'about.page.hero.secondary_cta',
      labelFallback: 'Meet the Team'
    }
  } as const;

  const vision = {
    eyebrowKey: 'about.page.vision.eyebrow',
    eyebrowFallback: 'Vision & goals',
    titleKey: 'about.page.vision.title',
    titleFallback: 'A clear path to launch',
    copyKey: 'about.page.vision.copy',
    copyFallback:
      'We publish our roadmap so collaborators know exactly how NodeVoyage, Ideonautix, and our education pilots come together.',
    cards: [
      {
        icon: 'idea',
        titleKey: 'about.page.vision.cards.products.title',
        titleFallback: 'Product milestones',
        copyKey: 'about.page.vision.cards.products.copy',
        copyFallback:
          'NodeVoyage and Ideonautix share one platform with staged releases from alpha pilots through community rollout.',
        bullets: [
          {
            key: 'about.page.vision.cards.products.bullet_1',
            fallback: 'Alpha pilots: collaborative planning, explainable AI rituals, and mobile capture.'
          },
          {
            key: 'about.page.vision.cards.products.bullet_2',
            fallback: 'Public beta: June 2026 with multilingual interface and accessibility tooling.'
          },
          {
            key: 'about.page.vision.cards.products.bullet_3',
            fallback: 'Planned launch pricing: under €3/month with student and family plans ready.'
          }
        ]
      },
      {
        icon: 'education',
        titleKey: 'about.page.vision.cards.education.title',
        titleFallback: 'Education targets',
        copyKey: 'about.page.vision.cards.education.copy',
        copyFallback:
          'Our LIAA partnership focuses on measurable AI literacy across Latvia before we scale outward.',
        bullets: [
          {
            key: 'about.page.vision.cards.education.bullet_1',
            fallback: 'Planned reach includes up to 80% of institutions with adaptable curricula and recorded workshops.'
          },
          {
            key: 'about.page.vision.cards.education.bullet_2',
            fallback: 'Planned support for up to 25k+ students annually via blended, bilingual programmes.'
          },
          {
            key: 'about.page.vision.cards.education.bullet_3',
            fallback: 'Planned mentorship for 500+ educators with follow-up assessments and community support.'
          }
        ]
      },
      {
        icon: 'target',
        titleKey: 'about.page.vision.cards.consulting.title',
        titleFallback: 'Consulting outcomes',
        copyKey: 'about.page.vision.cards.consulting.copy',
        copyFallback:
          'Every consulting engagement is scoped to transfer ownership back to the client team with clear rituals.',
        bullets: [
          {
            key: 'about.page.vision.cards.consulting.bullet_1',
            fallback: 'Scorecards define success metrics and opt-out rules before work begins.'
          },
          {
            key: 'about.page.vision.cards.consulting.bullet_2',
            fallback: 'Documentation and governance kits accompany every prototype or integration.'
          },
          {
            key: 'about.page.vision.cards.consulting.bullet_3',
            fallback: 'Three months of advisory support ensures teams can run independently.'
          }
        ]
      }
    ]
  } as const;

  const values = [
    {
      icon: 'education',
      titleKey: 'about.page.values.education_first.title',
      titleFallback: 'Education first',
      copyKey: 'about.page.values.education_first.copy',
      copyFallback:
        'We nurture AI literacy in classrooms and community hubs. Free resources and respectful mentorship keep curiosity alive for every learner.'
    },
    {
      icon: 'target',
      titleKey: 'about.page.values.empowerment.title',
      titleFallback: 'Empowerment through technology',
      copyKey: 'about.page.values.empowerment.copy',
      copyFallback:
        'Whether you are a founder, teacher, or student, our tools are designed to feel welcoming, intuitive, and human-centred.'
    },
    {
      icon: 'idea',
      titleKey: 'about.page.values.integrity.title',
      titleFallback: 'Innovation with integrity',
      copyKey: 'about.page.values.integrity.copy',
      copyFallback:
        'Ethical guardrails, privacy, and transparency guide every release. We document automation decisions in plain language so trust stays intact.'
    },
    {
      icon: 'people',
      titleKey: 'about.page.values.community.title',
      titleFallback: 'Community & collaboration',
      copyKey: 'about.page.values.community.copy',
      copyFallback:
        'Partnerships with parents, cultural institutions, and industry mentors turn AI into a shared dance rather than a solo act.'
    }
  ] as const;

  const story = {
    introKey: 'about.page.story.intro',
    introFallback:
      'AlgoRhythmics began as a Riga side project and now bridges signage innovation, education pilots, and accessible AI tools. We stay transparent about the in-development stage while serving real partners.',
    milestones: [
      {
        key: 'about.page.story.milestones.0',
        fallback:
          'Shaped the NodeVoyage and Ideonautix roadmaps around Latvian schools, founders, and families using feedback loops from the Education, Product, and Consulting pillars.'
      },
      {
        key: 'about.page.story.milestones.1',
        fallback:
          'Tested responsible AI rituals with Reclame Fabriek colleagues so signage-floor precision and safety translate into consumer software.'
      },
      {
        key: 'about.page.story.milestones.2',
        fallback:
          'Outlined funding sprints that keep pricing inclusive (EUR 1–3 entries) and education-first metrics at the centre of every release.'
      }
    ],
    cultureKey: 'about.page.story.culture',
    cultureFallback:
      'Our internal rhythm alternates between fabrication labs, usability sessions, and quiet research sprints. We document everything in plain language so collaborators, schools, and investors stay in sync.'
  } as const;

  const team = [
    {
      nameKey: 'about.page.team.members.nikita.name',
      nameFallback: 'Nikita Jurtaevs',
      roleKey: 'about.page.team.members.nikita.role',
      roleFallback: 'Co-founder & CEO',
      focusKey: 'about.page.team.members.nikita.focus',
      focusFallback: 'Strategy, product direction, and partner delivery',
      bioKey: 'about.page.team.members.nikita.bio',
      bioFallback:
        'Nikita Jurtaevs serves as CEO in a 50/50 co-leadership model, guiding brand, partnerships, and product UX/QA across NodeVoyage and Ideonautix while contributing to Reclame Fabriek’s Signage Research Department.',
      highlights: [
        {
          key: 'about.page.team.members.nikita.highlight_1',
          fallback:
            'Leads accessible, multilingual delivery plans with LIAA-aligned pilots and a 2025–2026 go-to-market timeline for both platforms.'
        },
        {
          key: 'about.page.team.members.nikita.highlight_2',
          fallback:
            'Works on next-gen LED neon systems, in-house LED controllers, custom coatings, and full-scale 3D printed components inside Reclame Fabriek R&D.'
        },
        {
          key: 'about.page.team.members.nikita.highlight_3',
          fallback:
            'Keeps messaging honest: AlgoRhythmics is in development while the founders remain hands-on in Reclame Fabriek’s innovation arm.'
        }
      ],
      links: [
        { labelKey: 'about.page.team.members.nikita.links.email', labelFallback: 'Email', href: 'mailto:nikita@algorhythmics.ai' },
        {
          labelKey: 'about.page.team.members.nikita.links.linkedin',
          labelFallback: 'LinkedIn',
          href: 'https://www.linkedin.com/in/nikitajurtaevs/'
        }
      ],
      photo: asset('/images/founders/founder-nikita.png')
    },
    {
      nameKey: 'about.page.team.members.slaff.name',
      nameFallback: 'Vjaceslavs "Slaff" Trosins',
      roleKey: 'about.page.team.members.slaff.role',
      roleFallback: 'Co-founder & CTO',
      focusKey: 'about.page.team.members.slaff.focus',
      focusFallback: 'Technical vision, AI platforms, and delivery',
      bioKey: 'about.page.team.members.slaff.bio',
      bioFallback:
        'Vjaceslavs “Slaff” Trosins co-leads AlgoRhythmics as CTO, owning the technical roadmap across web, mobile, APIs, and AI while engineering signage controllers at Reclame Fabriek’s Signage Research Department.',
      highlights: [
        {
          key: 'about.page.team.members.slaff.highlight_1',
          fallback:
            'Designs Google Cloud-first architecture with SvelteKit/TypeScript, Fastify, Prisma, PostgreSQL, Redis/BullMQ, and Vertex AI or Gemini integrations.'
        },
        {
          key: 'about.page.team.members.slaff.highlight_2',
          fallback:
            'Pairs Reclame Fabriek R&D experience on LED controllers and fabrication pipelines with explainable AI and real-time UX patterns in consumer software.'
        },
        {
          key: 'about.page.team.members.slaff.highlight_3',
          fallback:
            'Oversees near-term funding sprints—Pomodoro Coach, Startup Pitch Assistant, and Competitive Intelligence Dashboard—to finance broader product build-out and hiring.'
        }
      ],
      links: [
        { labelKey: 'about.page.team.members.slaff.links.email', labelFallback: 'Email', href: 'mailto:slaff@algorhythmics.ai' },
        { labelKey: 'about.page.team.members.slaff.links.linkedin', labelFallback: 'LinkedIn', href: 'https://www.linkedin.com/in/slaff/' }
      ],
      photo: asset('/images/founders/founder-slaff.png')
    }
  ] as const;

  const finale = {
    eyebrowKey: 'about.page.finale.eyebrow',
    eyebrowFallback: 'Join us',
    titleKey: 'about.page.finale.title',
    titleFallback: 'Join the rhythm',
    copyKey: 'about.page.finale.copy',
    copyFallback:
      'We welcome collaborators who care about accessible technology, joyful learning, and responsible automation. Whether you are exploring careers, partnerships, or sponsorships, let’s build together.',
    primary: {
      href: '/contact',
      labelKey: 'about.page.finale.primary_cta',
      labelFallback: 'Connect with AlgoRhythmics'
    },
    secondary: {
      href: '/contact',
      labelKey: 'about.page.finale.secondary_cta',
      labelFallback: 'Subscribe to Updates'
    }
  } as const;
</script>

<Hero
  class="hero--products"
  variant="grid"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="status">
    <span class="hero-kicker surface-pill" data-tone="accent">{t(hero.eyebrowKey, hero.eyebrowFallback)}</span>
  </svelte:fragment>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <Button variant="gradient" size="lg" href={hero.primary.href}>{t(hero.primary.labelKey, hero.primary.labelFallback)}</Button>
    <Button variant="secondary" size="lg" href={hero.secondary.href}>{t(hero.secondary.labelKey, hero.secondary.labelFallback)}</Button>
  </svelte:fragment>
</Hero>

<Section class="who-we-are" bg="tint" data-surface="glow">
  <div class="who-we-are__grid" transition:slideY>
    <GlassCard class="about-card" padding="lg">
      <h2>{t('about.page.story.heading')}</h2>
      <p>{t(story.introKey, story.introFallback)}</p>
      <p>
        {t(story.cultureKey, story.cultureFallback)}
      </p>
    </GlassCard>
    <GlassCard class="about-card" padding="lg" halo>
      <h2>{t('about.page.story.milestones_heading')}</h2>
      <ul>
        {#each story.milestones as milestone (milestone.key)}
          <li>{t(milestone.key, milestone.fallback)}</li>
        {/each}
      </ul>
      <div class="card-actions">
        <Button href="/" variant="secondary" size="md">{t('about.page.story.cta')}</Button>
      </div>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="vision" data-surface="glow" aria-labelledby="vision-heading">
  <div class="vision__content" transition:slideY>
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t(vision.eyebrowKey, vision.eyebrowFallback)}</span>
      <h2 id="vision-heading">{t(vision.titleKey, vision.titleFallback)}</h2>
      <p>{t(vision.copyKey, vision.copyFallback)}</p>
    </header>

    <div class="vision__grid" transition:slideY>
      {#each vision.cards as card (card.titleKey)}
        <GlassCard class="vision-card" padding="lg" halo>
          <div class="vision-card__icon">
            <Icon name={card.icon} size="var(--icon-glyph-md)" />
          </div>
          <h3>{t(card.titleKey, card.titleFallback)}</h3>
          <p>{t(card.copyKey, card.copyFallback)}</p>
          <ul>
            {#each card.bullets as bullet (bullet.key)}
              <li>{t(bullet.key, bullet.fallback)}</li>
            {/each}
          </ul>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="values" bg="tint" data-surface="glow" aria-labelledby="values-heading">
  <div class="values__content" transition:slideY>
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('about.page.values.eyebrow')}</span>
      <h2 id="values-heading">{t('about.page.values.title')}</h2>
      <p>
        {t('about.page.values.copy')}
      </p>
    </header>

    <div class="values__grid" transition:slideY>
      {#each values as value (value.titleKey)}
        <GlassCard class="value-card" padding="lg">
          <div class="value-icon">
            <Icon name={value.icon} size="var(--icon-glyph-md)" />
          </div>
          <h3>{t(value.titleKey, value.titleFallback)}</h3>
          <p>{t(value.copyKey, value.copyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="team" data-surface="glow" id="team">
  <div class="team__content" transition:slideY>
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('about.page.team.eyebrow')}</span>
      <h2>{t('about.page.team.title')}</h2>
      <p>
        {t('about.page.team.copy')}
      </p>
    </header>

    <div class="team__grid" transition:slideY>
      {#each team as member (member.nameKey)}
        <GlassCard class="team-card" padding="lg">
        <img
          class="team-photo"
          src={member.photo}
          alt={`Portrait of ${t(member.nameKey, member.nameFallback)}`}
          width="480"
          height="360"
          loading="lazy"
        />
        <h3>{t(member.nameKey, member.nameFallback)}</h3>
        <span class="team-role">{t(member.roleKey, member.roleFallback)}</span>
        <p class="team-focus">
          {t('about.page.team.focus_label', 'Focus: {focus}').replace(
            '{focus}',
            t(member.focusKey, member.focusFallback)
          )}
        </p>
        <p>{t(member.bioKey, member.bioFallback)}</p>
        {#if member.highlights?.length}
          <ul class="team-highlights">
            {#each member.highlights as highlight (highlight.key)}
              <li>{t(highlight.key, highlight.fallback)}</li>
            {/each}
          </ul>
        {/if}
        <div class="team-links">
          {#each member.links as link (link.href)}
            <a href={link.href}>{t(link.labelKey, link.labelFallback)}</a>
          {/each}
        </div>
      </GlassCard>
    {/each}
  </div>
  </div>
</Section>

<Section class="finale" bg="elev" data-surface="glow">
  <div class="finale__content" transition:slideY>
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
</Section>

<style>
  .hero-kicker {
    display: inline-flex;
    align-items: center;
    padding-block: var(--chip-padding-block);
    padding-inline: calc(var(--chip-padding-inline) + var(--space-3xs));
    font-size: var(--text-small);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
  }

  .hero-description {
    max-width: 70ch;
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--text-lead);
    line-height: var(--leading-relaxed);
  }

  :global(.section.who-we-are),
  :global(.section.vision),
  :global(.section.values),
  :global(.section.team),
  :global(.section.finale) {
    isolation: isolate;
  }

  :global(.section.who-we-are) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.16);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.vision) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.24);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.values) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.team) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.finale) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.3);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.16);
  }

  .who-we-are__grid,
  .vision__grid,
  .values__grid,
  .team__grid {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  .vision__content,
  .values__content,
  .team__content,
  .finale__content {
    display: grid;
    gap: var(--grid-gap-xl);
  }

  .team-photo {
    width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    border: var(--border-width-hairline) solid var(--glass-border);
    box-shadow: var(--shadow-lg);
  }

  :global(.about-card),
  :global(.vision-card),
  :global(.value-card),
  :global(.team-card),
  :global(.finale-card) {
    display: grid;
    gap: var(--cluster-gap-md);
  }

  :global(.vision-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--aurora-purple-rgb), 0.14) 10%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 36%, transparent 64%);
    --surface-glass-shadow: var(--shadow-card-aurora);
  }

  :global(.about-card) ul,
  :global(.vision-card) ul {
    margin: 0;
    padding-left: calc(var(--space-lg) + var(--space-xs));
    display: grid;
    gap: var(--space-sm);
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .section-heading {
    margin-block-end: var(--space-3xl);
  }

  .vision-card__icon,
  .value-icon {
    inline-size: var(--size-icon-lg);
    block-size: var(--size-icon-lg);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 56%, transparent 44%);
  }

  .vision-card__icon {
    color: var(--aurora-purple);
  }

  .value-icon {
    color: var(--voyage-blue);
  }

  .team-role {
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .team-focus {
    font-weight: var(--weight-semibold);
    color: var(--text-secondary);
  }

  .team-highlights {
    margin: 0;
    padding-left: calc(var(--space-lg) + var(--space-xs));
    display: grid;
    gap: var(--space-sm);
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .team-highlights li::marker {
    color: var(--voyage-blue);
  }

  .team-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cluster-gap-sm);
  }

  .team-links a {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cluster-gap-sm);
    align-items: center;
  }

  @media (min-width: 900px) {
    .who-we-are__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .vision__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .values__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .team__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.who-we-are),
    :global(.vision),
    :global(.values),
    :global(.team),
    :global(.finale) {
      animation: none;
    }
  }
</style>
