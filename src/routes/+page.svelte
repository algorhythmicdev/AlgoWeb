<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Section from '$lib/components/Section.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
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
    titleFallback: 'Clear tools and consulting for AI.',
    subtitleKey: 'hero.subtitle',
    subtitleFallback:
      'We design simple, accessible tools and offer pilot consulting starting in 2026. Products are in development.',
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
      copyFallback: 'NodeVoyage and Ideonautix are in development to help with travel and creative work.'
    },
    {
      icon: 'education',
      titleKey: 'highlights.item_2_title',
      titleFallback: 'Education',
      copyKey: 'highlights.item_2_body',
      copyFallback: 'Lesson plans and workshops that are easy to use and share.'
    },
    {
      icon: 'target',
      titleKey: 'highlights.item_3_title',
      titleFallback: 'Consulting',
      copyKey: 'highlights.item_3_body',
      copyFallback: 'Pilot sprints with clear documentation and opt-out controls.'
    },
    {
      icon: 'people',
      titleKey: 'highlights.item_4_title',
      titleFallback: 'Community',
      copyKey: 'highlights.item_4_body',
      copyFallback: 'Simple guides and events for families, students, and founders.'
    }
  ] as const;

  const offerings: ReadonlyArray<Offering> = [
    {
      id: 'consulting',
      icon: 'target',
      titleKey: 'offer.consulting_title',
      titleFallback: 'Consulting',
      summaryKey: 'offer.consulting_body',
      summaryFallback: 'We map use cases, run pilot sprints, and train your team.',
      bullets: [
        {
          key: 'offer.consulting_bullet_1',
          fallback: 'Automation roadmaps and workflow design tuned to your daily operations.'
        },
        {
          key: 'offer.consulting_bullet_2',
          fallback: 'Pilot sprints with measurable outcomes, documentation, and opt-out controls.'
        },
        {
          key: 'offer.consulting_bullet_3',
          fallback: 'Training that hands ownership back to your team once the sprint completes.'
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
      summaryFallback: 'NodeVoyage and Ideonautix share the same accessible design system.',
      bullets: [
        {
          key: 'offer.products_bullet_1',
          fallback: 'NodeVoyage: an AI-assisted travel planner with collaborative tools and sustainability tracking.'
        },
        {
          key: 'offer.products_bullet_2',
          fallback: 'Ideonautix: Pomodoro Coach, Pitch Assistant, and Competitive Intelligence modules for founders.'
        },
        {
          key: 'offer.products_bullet_3',
          fallback: 'Shared AI orchestration, accessibility tokens, and localisation for six languages from day one.'
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
      summaryFallback: 'Classroom kits and workshops. Simple to adapt and localize.',
      bullets: [
        {
          key: 'offer.education_bullet_1',
          fallback: 'Teacher programmes spanning basics to leadership, with resources in plain language.'
        },
        {
          key: 'offer.education_bullet_2',
          fallback: 'Targets: 80% of Latvian institutions reached, 25k+ students yearly, 500+ trained teachers.'
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

  const educationShowcase = {
    eyebrowKey: 'home.page.education_hub.eyebrow',
    eyebrowFallback: 'Stay in the loop',
    titleKey: 'home.page.education_hub.title',
    titleFallback: 'Keep up with the calm AI rhythm',
    descriptionKey: 'home.page.education_hub.description',
    descriptionFallback:
      'Our Education Hub shares calm AI stories, classroom toolkits, and community highlights—everything you need to bring inclusive innovation to life.',
    items: [
      {
        icon: 'blog',
        eyebrowKey: 'home.page.education_hub.items.insights.eyebrow',
        eyebrowFallback: 'Insights',
        titleKey: 'home.page.education_hub.items.insights.title',
        titleFallback: 'Latest calm AI articles',
        copyKey: 'home.page.education_hub.items.insights.copy',
        copyFallback:
          'Readable, multilingual stories co-written with educators, founders, and families.',
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
        copyFallback: 'See classrooms, startups, and cultural partners practicing calm AI.',
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
    copyFallback: 'Tell us your goals. We will help you choose the simple next step.',
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
        'AlgoRhythmics is a Latvia-based, pre-company stage initiative building accessible AI tools and practical consulting. We speak plainly about our in-development status and work with partners who value real execution.',
      bullets: [
        {
          key: 'home.brand.overview.bullet_1',
          fallback: 'Mission: unlock useful AI for everyday people, schools, startups, and small businesses.'
        },
        {
          key: 'home.brand.overview.bullet_2',
          fallback: 'Operating from Daugavpils and Riga with a remote-first mindset and a co-leadership model.'
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
      copyFallback: 'Products, consulting, and education move together so partners see impact fast.',
      bullets: [
        {
          key: 'home.brand.pillars.bullet_1',
          fallback: 'NodeVoyage travel OS and Ideonautix founder toolkit are in active build.'
        },
        {
          key: 'home.brand.pillars.bullet_2',
          fallback: 'Consulting sprints map automation, integrate AI safely, and train teams to own the outputs.'
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
      copyFallback: 'Accessible AI only works if it stays calm, inclusive, and measurable. That is our baseline.',
      bullets: [
        {
          key: 'home.brand.impact.bullet_1',
          fallback: 'Useful AI tools that explain themselves and respect autonomy.'
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
            fallback: 'Multilingual interface (EN/LV/RU/UK/FR/ES) using shared tokens and calm motion defaults.'
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
        fallback: 'NodeVoyage and Ideonautix launch with free tiers and €2.99/month premium, plus family and student options.'
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
        image: '/images/products/ideonautix-icon.png',
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
        image: '/images/products/nodevoyage-icon.png',
        altKey: 'home.page.platform_showcase.items.nodevoyage.alt',
        altFallback: 'Mockup of the NodeVoyage planning board'
      }
    ]
  } as const;
</script>

<Section class="landing-hero" background="plain">
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

<Section class="highlights" background="plain" data-surface="glow">
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
  background="plain"
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

<Section class="brand-overview" background="plain" data-surface="glow" aria-labelledby="brand-overview-heading">
  <div class="section-content" use:revealOnScroll>
    <header class="section-heading" data-align="center">
      <h2 id="brand-overview-heading">{t('home.brand.section_title', 'Our brand story')}</h2>
      <p>{t('home.brand.section_copy', 'Everything starts with honest execution and calm communication.')}</p>
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

<Section class="blueprint" background="plain" data-surface="glow" aria-labelledby="blueprint-heading">
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

<Section class="education-hub" background="plain" data-surface="glow" aria-labelledby="education-hub-heading">
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

<Section class="pricing" background="plain" data-surface="glow" aria-labelledby="pricing-heading">
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
  background="plain"
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


<Section class="finale" background="plain" data-surface="glow">
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
  .education-hub__grid {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  :global(.brand-card),
  :global(.blueprint-card),
  :global(.education-card),
  :global(.pricing-card) {
    display: grid;
    gap: var(--cluster-gap-md);
    width: min(100%, var(--card-max-width));
    margin-inline: auto;
  }

  .brand-card__icon,
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

  :global(.brand-card) ul,
  :global(.blueprint-card) ul,
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
