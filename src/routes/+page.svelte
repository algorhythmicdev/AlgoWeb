<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Section from '$lib/components/Section.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { withBase } from '$utils/paths';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
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

  type CTA = {
    href: string;
    labelKey: string;
    labelFallback: string;
  };

  type Offering = {
    readonly id: string;
    readonly icon: string;
    readonly titleKey: string;
    readonly titleFallback: string;
    readonly summaryKey: string;
    readonly summaryFallback: string;
    readonly bullets: readonly { key: string; fallback: string }[];
    readonly primary: CTA;
    readonly secondary?: CTA;
  };

  const hero = {
    titleKey: 'hero.title',
    titleFallback: 'Accessible AI for travel, startups, and schools.',
    subtitleKey: 'hero.subtitle',
    subtitleFallback:
      'We are a Latvia-based studio building NodeVoyage, Ideonautix, and education pilots while offering transparent consulting support.',
    actions: [
      {
        href: '/consulting',
        variant: 'gradient' as const,
        size: 'lg' as const,
        labelKey: 'hero.cta_primary',
        labelFallback: 'Explore services'
      },
      {
        href: '/about',
        variant: 'secondary' as const,
        size: 'lg' as const,
        labelKey: 'hero.cta_secondary',
        labelFallback: 'About us'
      }
    ]
  } as const;

  const highlights = [
    {
      icon: 'idea',
      titleKey: 'highlights.item_1_title',
      titleFallback: 'Practical AI tools',
      copyKey: 'highlights.item_1_body',
      copyFallback:
        'NodeVoyage and Ideonautix move from alpha to beta with a shared accessibility-first design system.'
    },
    {
      icon: 'education',
      titleKey: 'highlights.item_2_title',
      titleFallback: 'Education',
      copyKey: 'highlights.item_2_body',
      copyFallback: 'Lesson plans, toolkits, and teacher training with partners like LIAA.'
    },
    {
      icon: 'target',
      titleKey: 'highlights.item_3_title',
      titleFallback: 'Consulting',
      copyKey: 'highlights.item_3_body',
      copyFallback: 'Pilot sprints that pair strategy, build, and training so teams stay confident.'
    },
    {
      icon: 'people',
      titleKey: 'highlights.item_4_title',
      titleFallback: 'Community',
      copyKey: 'highlights.item_4_body',
      copyFallback: 'Guides, newsletters, and meetups for families, founders, and educators.'
    }
  ] as const;

  const offerings: ReadonlyArray<Offering> = [
    {
      id: 'consulting',
      icon: 'target',
      titleKey: 'offer.consulting_title',
      titleFallback: 'Consulting',
      summaryKey: 'offer.consulting_body',
      summaryFallback:
        'We map use cases, co-design workflows, and stay through the launch so your team keeps ownership.',
      bullets: [
        {
          key: 'offer.consulting_bullet_1',
          fallback: 'Automation roadmaps that respect existing rituals and regulations.'
        },
        {
          key: 'offer.consulting_bullet_2',
          fallback: 'Pilot sprints with measurable outcomes, clear documentation, and opt-out controls.'
        },
        {
          key: 'offer.consulting_bullet_3',
          fallback: 'Training that hands ownership back to your team the moment the sprint completes.'
        }
      ],
      primary: {
        href: '/consulting',
        labelKey: 'offer.consulting_cta',
        labelFallback: 'Request a consultation'
      }
    },
    {
      id: 'platforms',
      icon: 'ai',
      titleKey: 'offer.products_title',
      titleFallback: 'Products (in development)',
      summaryKey: 'offer.products_body',
      summaryFallback:
        'NodeVoyage and Ideonautix share one platform: multilingual UI, privacy-safe AI, and signage-grade reliability.',
      bullets: [
        {
          key: 'offer.products_bullet_1',
          fallback:
            'NodeVoyage: an AI-assisted travel planner with collaborative tools, sustainability tracking, and AR translation.'
        },
        {
          key: 'offer.products_bullet_2',
          fallback:
            'Ideonautix: Pomodoro Coach, Pitch Assistant, and Competitive Intelligence modules tuned for founders and students.'
        },
        {
          key: 'offer.products_bullet_3',
          fallback:
            'Shared AI orchestration, accessibility tokens, and localisation for six languages from the first release.'
        }
      ],
      primary: {
        href: '/nodevoyage',
        labelKey: 'offer.products_cta',
        labelFallback: 'Explore tools'
      }
    },
    {
      id: 'education',
      icon: 'people',
      titleKey: 'offer.education_title',
      titleFallback: 'Education',
      summaryKey: 'offer.education_body',
      summaryFallback:
        'Classroom kits and workshops co-created with Latvian educators, easy to adapt and localise.',
      bullets: [
        {
          key: 'offer.education_bullet_1',
          fallback: 'Teacher programmes spanning basics to leadership with practical, plain-language resources.'
        },
        {
          key: 'offer.education_bullet_2',
          fallback: 'Planned reach: up to 80% of Latvian institutions, supporting 25k+ students yearly and 500+ trained teachers.'
        },
        {
          key: 'offer.education_bullet_3',
          fallback: 'Partnership model with LIAA for events, curriculum input, and long-term measurement.'
        }
      ],
      primary: {
        href: '/',
        labelKey: 'offer.education_cta',
        labelFallback: 'Talk to us'
      }
    }
  ] satisfies ReadonlyArray<Offering>;

  const visionGoals = {
    eyebrowKey: 'home.brand.vision.eyebrow',
    eyebrowFallback: 'Vision & goals',
    titleKey: 'home.brand.vision.title',
    titleFallback: 'Where we are heading next',
    copyKey: 'home.brand.vision.copy',
    copyFallback:
      'Our roadmap stays public so partners can see how products, education pilots, and consulting add up to one accessible AI platform.',
    cards: [
      {
        icon: 'idea',
        titleKey: 'home.brand.vision.cards.products.title',
        titleFallback: 'Product milestones',
        copyKey: 'home.brand.vision.cards.products.copy',
        copyFallback:
          'NodeVoyage and Ideonautix release in stages: alpha with guided pilots, beta with multilingual rollouts, and general availability once the shared access platform is proven.',
        bullets: [
          {
            key: 'home.brand.vision.cards.products.bullet_1',
            fallback: 'Alpha builds focus on collaborative planning, explainable AI, and mobile capture.'
          },
          {
            key: 'home.brand.vision.cards.products.bullet_2',
            fallback: 'Public beta targets June 2026 with Latvian, English, and Russian support.'
          },
          {
            key: 'home.brand.vision.cards.products.bullet_3',
            fallback: 'Planned pricing to stay under €3/month with family and student discounts from day one.'
          }
        ]
      },
      {
        icon: 'education',
        titleKey: 'home.brand.vision.cards.education.title',
        titleFallback: 'Education targets',
        copyKey: 'home.brand.vision.cards.education.copy',
        copyFallback:
          'Together with LIAA partners we grow AI literacy across Latvia before expanding to the wider region.',
        bullets: [
          {
            key: 'home.brand.vision.cards.education.bullet_1',
            fallback: 'Planned reach includes up to 80% of institutions with adaptable lesson packs and teacher training.'
          },
          {
            key: 'home.brand.vision.cards.education.bullet_2',
            fallback: 'Support 25k+ students per year with project-based learning and bilingual resources.'
          },
          {
            key: 'home.brand.vision.cards.education.bullet_3',
            fallback: 'Train 500+ educators with mentorship cohorts and follow-up assessments.'
          }
        ]
      },
      {
        icon: 'target',
        titleKey: 'home.brand.vision.cards.consulting.title',
        titleFallback: 'Consulting outcomes',
        copyKey: 'home.brand.vision.cards.consulting.copy',
        copyFallback:
          'Consulting stays tightly scoped: we co-design, build, and hand over so in-house teams stay confident long after the engagement.',
        bullets: [
          {
            key: 'home.brand.vision.cards.consulting.bullet_1',
            fallback: 'Each pilot starts with a shared readiness scorecard and success metrics.'
          },
          {
            key: 'home.brand.vision.cards.consulting.bullet_2',
            fallback: 'Delivery includes documentation, governance rituals, and opt-out controls.'
          },
          {
            key: 'home.brand.vision.cards.consulting.bullet_3',
            fallback: 'We remain on-call for three months to mentor teams as they take full ownership.'
          }
        ]
      }
    ]
  } as const;

  const educationShowcase = {
    eyebrowKey: 'home.page.education_hub.eyebrow',
    eyebrowFallback: 'Stay in the loop',
    titleKey: 'home.page.education_hub.title',
    titleFallback: 'Keep up with the AlgoRhythmics build',
    descriptionKey: 'home.page.education_hub.description',
    descriptionFallback:
      'The Education Hub collects rollout notes, classroom toolkits, and partner stories so communities can follow our progress without jargon.',
    items: [
      {
        icon: 'blog',
        eyebrowKey: 'home.page.education_hub.items.insights.eyebrow',
        eyebrowFallback: 'Insights',
        titleKey: 'home.page.education_hub.items.insights.title',
        titleFallback: 'Latest product and education notes',
        copyKey: 'home.page.education_hub.items.insights.copy',
        copyFallback:
          'Readable, multilingual stories co-written with educators, founders, families, and our own R&D team.',
        cta: {
          href: '/',
          labelKey: 'home.page.education_hub.items.insights.cta',
          labelFallback: 'Browse insights'
        }
      },
      {
        icon: 'cases',
        eyebrowKey: 'home.page.education_hub.items.case_studies.eyebrow',
        eyebrowFallback: 'Case studies',
        titleKey: 'home.page.education_hub.items.case_studies.title',
        titleFallback: 'Impact stories & pilots',
        copyKey: 'home.page.education_hub.items.case_studies.copy',
        copyFallback:
          'See classrooms, startups, and cultural partners putting accessible AI pilots into daily use.',
        cta: {
          href: '/',
          labelKey: 'home.page.education_hub.items.case_studies.cta',
          labelFallback: 'Explore spotlights'
        }
      },
      {
        icon: 'events',
        eyebrowKey: 'home.page.education_hub.items.events.eyebrow',
        eyebrowFallback: 'Events',
        titleKey: 'home.page.education_hub.items.events.title',
        titleFallback: 'Workshops & community jams',
        copyKey: 'home.page.education_hub.items.events.copy',
        copyFallback: 'Join monthly gatherings with transcripts, captions, and shared notes.',
        cta: {
          href: '/',
          labelKey: 'home.page.education_hub.items.events.cta',
          labelFallback: 'See upcoming events'
        }
      }
    ]
  } as const;

  const finale = {
    titleKey: 'cta_block.title',
    titleFallback: 'Ready to start?',
    copyKey: 'cta_block.body',
    copyFallback:
      'Tell us your goals and we will suggest the next best move across consulting, pilots, or product betas.',
    primary: {
      href: '/consulting',
      labelKey: 'cta_block.cta_primary',
      labelFallback: 'Explore services'
    },
    secondary: {
      href: '/contact',
      labelKey: 'cta_block.cta_secondary',
      labelFallback: 'Talk to us'
    }
  } as const;

  const brandOverviewCards = [
    {
      id: 'who-we-are',
      icon: 'people',
      titleKey: 'home.brand.overview.title',
      titleFallback: 'Who we are',
      copyKey: 'home.brand.overview.copy',
      copyFallback:
        'AlgoRhythmics is a Latvia-based, pre-company stage initiative building accessible AI tools, consulting pilots, and education programmes. We stay transparent about our build status and choose partners who value measurable progress.',
      bullets: [
        {
          key: 'home.brand.overview.bullet_1',
          fallback:
            'Mission: unlock useful AI for everyday people, schools, startups, and small businesses across Latvia and beyond.'
        },
        {
          key: 'home.brand.overview.bullet_2',
          fallback:
            'Operating from Daugavpils and Riga with a remote-first mindset and a 50/50 co-leadership model.'
        },
        {
          key: 'home.brand.overview.bullet_3',
          fallback: 'Rooted in Reclame Fabriek’s Signage Research Department for real-world R&D discipline.'
        }
      ]
    },
    {
      id: 'pillars',
      icon: 'target',
      titleKey: 'home.brand.pillars.title',
      titleFallback: 'Three pillars, one rhythm',
      copyKey: 'home.brand.pillars.copy',
      copyFallback:
        'Products, consulting, and education move together so partners see impact and skills growth quickly.',
      bullets: [
        {
          key: 'home.brand.pillars.bullet_1',
          fallback:
            'NodeVoyage travel OS and Ideonautix founder toolkit are in active build with shared infrastructure.'
        },
        {
          key: 'home.brand.pillars.bullet_2',
          fallback:
            'Consulting sprints map automation, integrate AI safely, and train teams to own the outputs.'
        },
        {
          key: 'home.brand.pillars.bullet_3',
          fallback: 'Education programmes with LIAA align classroom pilots, teacher training, and community events.'
        }
      ]
    },
    {
      id: 'why-it-matters',
      icon: 'idea',
      titleKey: 'home.brand.impact.title',
      titleFallback: 'Why this matters',
      copyKey: 'home.brand.impact.copy',
      copyFallback:
        'Accessible AI only works when it stays transparent, inclusive, and measurable. That is our baseline.',
      bullets: [
        {
          key: 'home.brand.impact.bullet_1',
          fallback: 'Useful AI tools that explain themselves, respect autonomy, and support multiple languages.'
        },
        {
          key: 'home.brand.impact.bullet_2',
          fallback: 'Structured programmes with measurable outcomes for schools and cultural partners.'
        },
        {
          key: 'home.brand.impact.bullet_3',
          fallback: 'Focused startup support that removes noise and protects time.'
        },
        {
          key: 'home.brand.impact.bullet_4',
          fallback: 'Fair, local-friendly pricing that scales outward with proof.'
        }
      ]
    }
  ] as const;

  const buildBlueprint = {
    titleKey: 'home.brand.blueprint.title',
    titleFallback: 'How we build',
    leadKey: 'home.brand.blueprint.lead',
    leadFallback:
      'Our stack combines signage-grade reliability with modern product cadence. Every layer tracks accessibility, privacy, and documentation.',
    categories: [
      {
        titleKey: 'home.brand.blueprint.frontend.title',
        titleFallback: 'Frontend',
        items: [
          {
            key: 'home.brand.blueprint.frontend.item_1',
            fallback: 'SvelteKit + TypeScript with WCAG 2.2 AA/AAA coverage, responsive layouts, and light/dark modes.'
          },
          {
            key: 'home.brand.blueprint.frontend.item_2',
            fallback: 'Multilingual interface (EN/LV/RU/UK/FR/ES) using shared tokens and motion guidelines tuned for accessibility.'
          }
        ]
      },
      {
        titleKey: 'home.brand.blueprint.backend.title',
        titleFallback: 'Backend & Cloud',
        items: [
          {
            key: 'home.brand.blueprint.backend.item_1',
            fallback: 'Google Cloud stack (Cloud Run, Cloud SQL/Postgres, Firestore, Storage, Redis) with Fastify APIs and Prisma.'
          },
          {
            key: 'home.brand.blueprint.backend.item_2',
            fallback: 'OpenAPI-first contracts, CI/CD pipelines, and observability baked in.'
          }
        ]
      },
      {
        titleKey: 'home.brand.blueprint.ai.title',
        titleFallback: 'AI Layer',
        items: [
          {
            key: 'home.brand.blueprint.ai.item_1',
            fallback: 'Vertex AI as primary, OpenAI as fallback, with on-device models when privacy matters.'
          },
          {
            key: 'home.brand.blueprint.ai.item_2',
            fallback: 'Explainable prompts, opt-out controls, and clear audit trails for every decision.'
          }
        ]
      },
      {
        titleKey: 'home.brand.blueprint.realtime.title',
        titleFallback: 'Realtime & Quality',
        items: [
          {
            key: 'home.brand.blueprint.realtime.item_1',
            fallback: 'WebSockets and SSE for collaboration, plus testing from unit to accessibility checks.'
          },
          {
            key: 'home.brand.blueprint.realtime.item_2',
            fallback: 'CI pipelines mirror signage QA discipline with scenario scripts and visual diffing.'
          }
        ]
      },
      {
        titleKey: 'home.brand.blueprint.security.title',
        titleFallback: 'Security & privacy',
        items: [
          {
            key: 'home.brand.blueprint.security.item_1',
            fallback: 'GDPR-first, encryption everywhere, role-based access, and monitoring for every release.'
          }
        ]
      }
    ]
  } as const;

  const pricingOutlook = {
    titleKey: 'home.brand.pricing.title',
    titleFallback: 'Pricing & growth',
    leadKey: 'home.brand.pricing.lead',
    leadFallback:
      'Latvia-first pricing keeps entry points between one and three euros. Education discounts stay non-negotiable.',
    bullets: [
      {
        key: 'home.brand.pricing.bullet_1',
        fallback: 'NodeVoyage and Ideonautix plan to launch with free tiers and a €2.99/month premium option, plus family and student plans.'
      },
      {
        key: 'home.brand.pricing.bullet_2',
        fallback: 'Marketing focuses on schools, students, and startup communities with transparent KPIs.'
      },
      {
        key: 'home.brand.pricing.bullet_3',
        fallback: 'Risk scenarios include pricing flexibility, education partnerships, and staged expansion to the wider EU.'
      }
    ]
  } as const;

  const asset = (path: string) => withBase(path) ?? path;

  const platformShowcase = {
    titleKey: 'snapshots.title',
    titleFallback: 'Product snapshots',
    descriptionKey: 'snapshots.intro',
    descriptionFallback: 'See work-in-progress screens from Ideonautix and NodeVoyage.',
    items: [
      {
        id: 'ideonautix',
        titleKey: 'snapshots.ideo_title',
        titleFallback: 'Ideonautix',
        copyKey: 'snapshots.ideo_body',
        copyFallback: 'A focused workspace for writing and pitching, with clear AI guidance.',
        ctaHref: '/ideonautix',
        ctaKey: 'snapshots.ideo_cta',
        ctaFallback: 'Ideonautix',
        image: asset('/images/products/ideonautix-icon.png'),
        altKey: 'home.page.platform_showcase.items.ideonautix.alt',
        altFallback: 'Mockup of the Ideonautix creative cockpit interface'
      },
      {
        id: 'nodevoyage',
        titleKey: 'snapshots.nv_title',
        titleFallback: 'NodeVoyage',
        copyKey: 'snapshots.nv_body',
        copyFallback: 'Travel planning with collaborative timelines and transparent AI steps.',
        ctaHref: '/nodevoyage',
        ctaKey: 'snapshots.nv_cta',
        ctaFallback: 'NodeVoyage',
        image: asset('/images/products/nodevoyage-icon.png'),
        altKey: 'home.page.platform_showcase.items.nodevoyage.alt',
        altFallback: 'Mockup of the NodeVoyage planning board'
      }
    ]
  } as const;
</script>

<Section class="landing-hero">
  <Hero
    class="hero-landing"
    variant="grid"
    title={t(hero.titleKey, hero.titleFallback)}
    subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
  >
    <svelte:fragment slot="actions">
      {#each hero.actions as action (action.href)}
        <Button href={action.href} variant={action.variant} size={action.size}>
          {t(action.labelKey, action.labelFallback)}
        </Button>
      {/each}
    </svelte:fragment>
  </Hero>
</Section>

<Section class="highlights" bg="tint" data-surface="glow">
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <h2>{t('highlights.title', 'What you get')}</h2>
    </header>

    <div class="highlights__grid" use:staggerReveal>
      {#each highlights as item (item.titleKey)}
        <GlassCard class="highlight-card" padding="lg" halo interactive>
          <div class="highlight-icon">
            <Icon name={item.icon} size="var(--icon-glyph-lg)" />
          </div>
          <h3>{t(item.titleKey, item.titleFallback)}</h3>
          <p>{t(item.copyKey, item.copyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section
  class="offerings"
  data-surface="glow"
  aria-labelledby="offerings-heading"
>
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <h2 id="offerings-heading">{t('offer.title', 'What we offer')}</h2>
    </header>

    <div class="offerings__grid" use:staggerReveal>
      {#each offerings as item (item.id)}
        <GlassCard class="offering-card" padding="lg" id={item.id} interactive>
          <h3 class="offering-title">
            <span class="offering-icon">
              <Icon name={item.icon} size="var(--icon-glyph-md)" />
            </span>
            {t(item.titleKey, item.titleFallback)}
          </h3>
          <p>{t(item.summaryKey, item.summaryFallback)}</p>
          <ul>
            {#each item.bullets as bullet (bullet.key)}
              <li>{t(bullet.key, bullet.fallback)}</li>
            {/each}
          </ul>
          <div class="card-actions">
            <Button href={item.primary.href} variant="gradient" size="md">
              {t(item.primary.labelKey, item.primary.labelFallback)}
            </Button>
            {#if item.secondary}
              <Button href={item.secondary.href} variant="secondary" size="md">
                {t(item.secondary.labelKey, item.secondary.labelFallback)}
              </Button>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="brand-overview" bg="tint" data-surface="glow" aria-labelledby="brand-overview-heading">
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <h2 id="brand-overview-heading">{t('home.brand.section_title', 'Our brand story')}</h2>
      <p>
        {t(
          'home.brand.section_copy',
          'Everything starts with honest execution, transparent updates, and measurable impact.'
        )}
      </p>
    </header>

    <div class="brand-overview__grid" use:staggerReveal>
      {#each brandOverviewCards as card (card.id)}
        <GlassCard class="brand-card" padding="lg" halo>
          <div class="brand-card__icon">
            <Icon name={card.icon} size="var(--icon-glyph-lg)" />
          </div>
          <h3>{t(card.titleKey, card.titleFallback)}</h3>
          <p>{t(card.copyKey, card.copyFallback)}</p>
          {#if card.bullets?.length}
            <ul>
              {#each card.bullets as bullet (bullet.key)}
                <li>{t(bullet.key, bullet.fallback)}</li>
              {/each}
            </ul>
          {/if}
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="blueprint" data-surface="glow" aria-labelledby="blueprint-heading">
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <h2 id="blueprint-heading">{t(buildBlueprint.titleKey, buildBlueprint.titleFallback)}</h2>
      <p>{t(buildBlueprint.leadKey, buildBlueprint.leadFallback)}</p>
    </header>

    <div class="blueprint__grid" use:staggerReveal>
      {#each buildBlueprint.categories as category (category.titleKey)}
        <GlassCard class="blueprint-card" padding="lg">
          <h3>{t(category.titleKey, category.titleFallback)}</h3>
          <ul>
            {#each category.items as item (item.key)}
              <li>{t(item.key, item.fallback)}</li>
            {/each}
          </ul>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="vision" bg="tint" data-surface="glow" aria-labelledby="vision-heading">
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t(visionGoals.eyebrowKey, visionGoals.eyebrowFallback)}</span>
      <h2 id="vision-heading">{t(visionGoals.titleKey, visionGoals.titleFallback)}</h2>
      <p>{t(visionGoals.copyKey, visionGoals.copyFallback)}</p>
    </header>

    <div class="vision__grid" use:staggerReveal>
      {#each visionGoals.cards as card (card.titleKey)}
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

<Section class="education-hub" data-surface="glow" aria-labelledby="education-hub-heading">
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t(educationShowcase.eyebrowKey, educationShowcase.eyebrowFallback)}</span>
      <h2 id="education-hub-heading">{t(educationShowcase.titleKey, educationShowcase.titleFallback)}</h2>
      <p>{t(educationShowcase.descriptionKey, educationShowcase.descriptionFallback)}</p>
    </header>

    <div class="education-hub__grid" use:staggerReveal>
      {#each educationShowcase.items as item (item.icon)}
        <GlassCard class="education-card" padding="lg" halo>
          <div class="education-card__icon">
            <Icon name={item.icon} size="var(--icon-glyph-md)" />
          </div>
          <span class="education-card__eyebrow">{t(item.eyebrowKey, item.eyebrowFallback)}</span>
          <h3>{t(item.titleKey, item.titleFallback)}</h3>
          <p>{t(item.copyKey, item.copyFallback)}</p>
          <Button href={item.cta.href} variant="secondary" size="md" class="education-card__cta">
            {t(item.cta.labelKey, item.cta.labelFallback)}
          </Button>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="pricing" bg="tint" data-surface="glow" aria-labelledby="pricing-heading">
  <div class="section-content" use:revealOnScroll>
    <GlassCard class="pricing-card" padding="lg" halo>
      <h2 id="pricing-heading">{t(pricingOutlook.titleKey, pricingOutlook.titleFallback)}</h2>
      <p>{t(pricingOutlook.leadKey, pricingOutlook.leadFallback)}</p>
      <ul>
        {#each pricingOutlook.bullets as bullet (bullet.key)}
          <li>{t(bullet.key, bullet.fallback)}</li>
        {/each}
      </ul>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section
  class="platform-showcase"
  data-surface="glow"
  aria-labelledby="platform-showcase-heading"
>
  <div class="section-content" use:revealOnScroll>
    <div class="platform-showcase__header">
      <h2 id="platform-showcase-heading">{t(platformShowcase.titleKey, platformShowcase.titleFallback)}</h2>
      <p class="platform-showcase__intro">{t(platformShowcase.descriptionKey, platformShowcase.descriptionFallback)}</p>
    </div>

    <div class="platform-showcase__grid" use:staggerReveal>
      {#each platformShowcase.items as item (item.id)}
        <GlassCard as="article" class="platform-card" padding="lg" halo>
          <img
            src={item.image}
            alt={t(item.altKey, item.altFallback)}
            width="960"
            height="600"
            loading="lazy"
          />
          <div class="platform-card__body">
            <h3>{t(item.titleKey, item.titleFallback)}</h3>
            <p>{t(item.copyKey, item.copyFallback)}</p>
            <Button href={item.ctaHref} variant="secondary" size="md">{t(item.ctaKey, item.ctaFallback)}</Button>
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>


<Section class="finale" bg="elev" data-surface="glow">
  <div class="section-content" use:revealOnScroll>
    <GlassCard class="finale-card" halo padding="lg" interactive>
      <h2>{t(finale.titleKey, finale.titleFallback)}</h2>
      <p>{t(finale.copyKey, finale.copyFallback)}</p>
      <div class="card-actions">
        <Button href={finale.primary.href} variant="gradient" size="lg">
          {t(finale.primary.labelKey, finale.primary.labelFallback)}
        </Button>
        <Button href={finale.secondary.href} variant="secondary" size="lg">
          {t(finale.secondary.labelKey, finale.secondary.labelFallback)}
        </Button>
      </div>
    </GlassCard>
  </div>
</Section>

<style>
  .section-heading {
    position: relative;
    z-index: var(--z-content);
    --section-heading-underline-offset-inline: calc(-1 * var(--space-xl));
    --section-heading-underline-offset-block: calc(-1 * var(--space-md));
    --section-heading-underline-thickness: var(--border-width-thin);
    --section-heading-underline-opacity: 0.55;
  }

  .section-heading::after {
    content: '';
    position: absolute;
    inset-inline: var(--section-heading-underline-offset-inline);
    inset-block-end: var(--section-heading-underline-offset-block);
    height: var(--section-heading-underline-thickness);
    border-radius: var(--radius-full);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--aurora-purple) 82%, transparent 18%),
      color-mix(in srgb, var(--voyage-blue) 70%, var(--signal-yellow) 30%)
    );
    opacity: var(--section-heading-underline-opacity);
    pointer-events: none;
  }

  :global(.section.highlights),
  :global(.section.offerings),
  :global(.section.platform-showcase),
  :global(.section.finale) {
    isolation: isolate;
    overflow: hidden;
  }

  :global(.section.highlights) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.24);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.16);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
    --highlight-animation-duration: 14s;
  }

  :global(.section.offerings) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.platform-showcase) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.finale) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.28);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.16);
  }

  :global(.section.brand-overview) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.18);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.16);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.blueprint) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.1);
  }

  :global(.section.vision) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.education-hub) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.pricing) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  .platform-showcase__header {
    max-width: var(--measure-lg);
    display: grid;
    gap: var(--cluster-gap-md);
  }

  .platform-showcase__intro {
    color: var(--text-secondary);
  }

  .platform-showcase__grid {
    display: grid;
    gap: var(--grid-gap-xl);
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, var(--card-max-width-wide)), 1fr)
    );
    justify-content: center;
  }

  :global(.platform-card) {
    display: grid;
    gap: var(--card-gap);
    width: min(100%, var(--card-max-width-wide));
    margin-inline: auto;
  }

  :global(.platform-card img) {
    width: 100%;
    height: auto;
    border-radius: max(0px, calc(var(--glass-card-radius) + (var(--space-lg) * 0.5)));
    border: var(--border-width-hairline) solid color-mix(in srgb, var(--glass-border) 54%, transparent 46%);
    box-shadow: var(--shadow-card-neutral-soft);
  }

  :global(.platform-card__body) {
    display: grid;
    gap: var(--cluster-gap-md);
  }

  :global(.highlights > .section__inner),
  :global(.offerings > .section__inner),
  :global(.finale > .section__inner) {
    position: relative;
    z-index: var(--z-content);
  }


  .highlights__grid,
  .offerings__grid {
    display: grid;
    gap: var(--grid-gap-lg);
    grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
    justify-content: center;
  }

  :global(.highlight-card),
  :global(.offering-card),
  :global(.finale-card) {
    display: grid;
    gap: var(--cluster-gap-md);
    width: min(100%, var(--card-max-width));
    margin-inline: auto;
  }

  .highlight-icon {
    inline-size: var(--size-icon-md);
    block-size: var(--size-icon-md);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 38%, transparent 62%);
    color: var(--voyage-blue);
    box-shadow: var(--shadow-card-voyage-soft);
    --icon-float-duration: 32s;
    --icon-float-ease: var(--resource-float-ease);
    animation: floaty var(--icon-float-duration) var(--icon-float-ease) infinite;
  }

  .offering-title {
    display: flex;
    align-items: center;
    gap: calc(var(--space-sm) + var(--space-xs));
    margin: 0;
  }

  .offering-icon {
    inline-size: var(--size-icon-md);
    block-size: var(--size-icon-md);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    color: var(--aurora-purple);
    box-shadow: var(--shadow-card-aurora);
    --offering-float-duration: 38s;
    animation: floaty var(--offering-float-duration) var(--resource-float-ease) infinite reverse;
  }

  :global(.offering-card) ul {
    margin: 0;
    padding-inline-start: calc(var(--space-lg) + var(--space-xs));
    display: grid;
    gap: var(--space-xs);
    color: var(--text-secondary);
    font-size: var(--text-small);
  }


  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    align-items: center;
  }

  :global(.highlights .highlight-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.12) 8%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 35%, transparent 65%);
    --surface-glass-shadow: var(--shadow-card-voyage);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  :global(.highlights .highlight-card:hover .highlight-icon),
  :global(.highlights .highlight-card:focus-visible .highlight-icon) {
    animation-duration: var(--highlight-animation-duration);
  }

  :global(.offerings .offering-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--aurora-purple-rgb), 0.14) 10%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 38%, transparent 62%);
    --surface-glass-shadow: var(--shadow-card-aurora);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 72%, var(--signal-yellow) 28%);
  }

  :global(.finale .finale-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.2) 12%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 42%, transparent 58%);
    --surface-glass-shadow: var(--shadow-card-aurora-strong);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 70%, var(--voyage-blue) 30%);
  }

  .brand-overview__grid,
  .blueprint__grid,
  .vision__grid,
  .education-hub__grid {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  :global(.brand-card),
  :global(.blueprint-card),
  :global(.vision-card),
  :global(.education-card),
  :global(.pricing-card) {
    display: grid;
    gap: var(--cluster-gap-md);
    width: min(100%, var(--card-max-width));
    margin-inline: auto;
  }

  .brand-card__icon,
  .vision-card__icon,
  .education-card__icon {
    inline-size: var(--size-icon-md);
    block-size: var(--size-icon-md);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 52%, transparent 48%);
    color: var(--aurora-purple);
    box-shadow: var(--shadow-card-aurora);
  }

  :global(.vision-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--aurora-purple-rgb), 0.12) 10%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 34%, transparent 66%);
    --surface-glass-shadow: var(--shadow-card-aurora);
  }

  :global(.brand-card) ul,
  :global(.blueprint-card) ul,
  :global(.vision-card) ul,
  :global(.pricing-card) ul {
    margin: 0;
    padding-inline-start: calc(var(--space-lg) + var(--space-xs));
    display: grid;
    gap: var(--space-xs);
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  :global(.education-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.14) 8%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 36%, transparent 64%);
    --surface-glass-shadow: var(--shadow-card-voyage);
    text-align: left;
  }

  .education-card__eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.education-card__cta) {
    justify-self: start;
    --btn-padding-block: calc(var(--button-padding-block-md) - var(--space-2));
    --btn-padding-inline: calc(var(--button-padding-inline-md) - var(--space-2));
    --btn-font-size: var(--text-small);
  }

  :global(.finale .finale-card)::after {
    border: var(--border-width-hairline) solid rgba(var(--signal-yellow-rgb), 0.25);
    mix-blend-mode: screen;
  }

  :global(.finale-card) {
    text-align: center;
  }

  @media (min-width: 640px) {
    .highlights__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .offerings__grid,
    .platform-showcase__grid,
    .brand-overview__grid,
    .education-hub__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .blueprint__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 900px) {
    .highlights__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .offerings__grid,
    .platform-showcase__grid,
    .brand-overview__grid,
    .education-hub__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .blueprint__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @keyframes floaty {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      transform: translate3d(0, calc(-1 * var(--space-3xs)), 0) scale(1.01);
    }

    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .highlight-icon,
    .offering-icon {
      animation: none;
    }

    .section-heading::after {
      display: none;
    }

    :global(.highlights),
    :global(.offerings),
    :global(.finale) {
      animation: none;
    }

    :global(.highlights)::before,
    :global(.offerings)::before,
    :global(.finale)::before,
    .highlight-icon,
    .offering-icon {
      animation: none;
    }
  }
</style>
