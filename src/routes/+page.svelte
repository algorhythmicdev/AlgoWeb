<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

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
    titleKey: 'home.page.hero.title',
    titleFallback: 'Where logic dances with creativity.',
    subtitleKey: 'home.page.hero.subtitle',
    subtitleFallback:
      'AlgoRhythmics builds AI platforms, consulting rituals, and educational programmes that keep innovation approachable for everyone—from students to enterprises.',
    descriptionKey: 'home.page.hero.description',
    descriptionFallback:
      'We choreograph technology with human-friendly signage craft, inclusive localisation, and transparent automation notes. The result is AI that feels calm, clear, and collaborative.',
    actions: [
      {
        href: '/services',
        variant: 'gradient' as const,
        size: 'lg' as const,
        labelKey: 'home.page.hero.primary_cta',
        labelFallback: 'Explore Our Services'
      },
      {
        href: '/about',
        variant: 'secondary' as const,
        size: 'lg' as const,
        labelKey: 'home.page.hero.secondary_cta',
        labelFallback: 'Learn About Our Mission'
      }
    ]
  } as const;

  const highlights = [
    {
      icon: 'idea',
      titleKey: 'home.page.highlights.items.innovative_ai.title',
      titleFallback: 'Innovative AI Solutions',
      copyKey: 'home.page.highlights.items.innovative_ai.copy',
      copyFallback: 'NodeVoyage and Ideonautix adapt to your journeys and workflows with playful precision.'
    },
    {
      icon: 'education',
      titleKey: 'home.page.highlights.items.educational_impact.title',
      titleFallback: 'Educational Impact',
      copyKey: 'home.page.highlights.items.educational_impact.copy',
      copyFallback: 'Curriculum pilots, teacher labs, and student hackathons nurture confident creators.'
    },
    {
      icon: 'target',
      titleKey: 'home.page.highlights.items.consulting_excellence.title',
      titleFallback: 'Consulting Excellence',
      copyKey: 'home.page.highlights.items.consulting_excellence.copy',
      copyFallback: 'Hands-on integration sprints pair transparent automation with lasting change.'
    },
    {
      icon: 'people',
      titleKey: 'home.page.highlights.items.community_creativity.title',
      titleFallback: 'Community & Creativity',
      copyKey: 'home.page.highlights.items.community_creativity.copy',
      copyFallback: 'Blogs, events, and community forums let families, founders, and students learn together.'
    }
  ] as const;

  const offerings = [
    {
      id: 'consulting',
      icon: 'target',
      titleKey: 'home.page.offerings.items.consulting.title',
      titleFallback: 'AI Consulting & Integration',
      summaryKey: 'home.page.offerings.items.consulting.summary',
      summaryFallback:
        'Map opportunities, run pilot sprints, and launch explainable automation with founder-led guidance.',
      bullets: [
        {
          key: 'home.page.offerings.items.consulting.bullets.0',
          fallback: 'Discovery workshops grounded in signage-inspired clarity'
        },
        {
          key: 'home.page.offerings.items.consulting.bullets.1',
          fallback: 'Pilot roadmaps with opt-out controls and transparent documentation'
        },
        {
          key: 'home.page.offerings.items.consulting.bullets.2',
          fallback: 'Training and change support to keep teams confident'
        }
      ],
      primary: {
        href: '/services#consulting',
        labelKey: 'home.page.offerings.items.consulting.primary_cta',
        labelFallback: 'Request a Consultation'
      }
    },
    {
      id: 'platforms',
      icon: 'ai',
      titleKey: 'home.page.offerings.items.platforms.title',
      titleFallback: 'Flagship Platforms',
      summaryKey: 'home.page.offerings.items.platforms.summary',
      summaryFallback:
        'NodeVoyage reimagines travel planning while Ideonautix accelerates creative productivity—both share the same accessible rhythm.',
      bullets: [
        {
          key: 'home.page.offerings.items.platforms.bullets.0',
          fallback: 'Personalised itineraries and collaborative travel workspaces'
        },
        {
          key: 'home.page.offerings.items.platforms.bullets.1',
          fallback: 'Creative canvases, pitch assistants, and multilingual workflows'
        },
        {
          key: 'home.page.offerings.items.platforms.bullets.2',
          fallback: 'AAA contrast modes, reduced-motion support, and localisation baked in'
        }
      ],
      primary: {
        href: '/services#platforms',
        labelKey: 'home.page.offerings.items.platforms.primary_cta',
        labelFallback: 'Explore Platforms'
      },
      secondary: {
        href: '/education-hub#case-studies',
        labelKey: 'home.page.offerings.items.platforms.secondary_cta',
        labelFallback: 'View Case Studies'
      }
    },
    {
      id: 'education',
      icon: 'people',
      titleKey: 'home.page.offerings.items.education.title',
      titleFallback: 'Educational Outreach',
      summaryKey: 'home.page.offerings.items.education.summary',
      summaryFallback:
        'In partnership with LIAA, schools, and cultural institutions, we bring AI literacy to classrooms, libraries, and community hubs.',
      bullets: [
        {
          key: 'home.page.offerings.items.education.bullets.0',
          fallback: 'Ready-to-run lesson plans and bilingual classroom kits'
        },
        {
          key: 'home.page.offerings.items.education.bullets.1',
          fallback: 'Parent ambassador network and mentorship pipelines'
        },
        {
          key: 'home.page.offerings.items.education.bullets.2',
          fallback: 'Community events that blend logic, art, and storytelling'
        }
      ],
      primary: {
        href: '/educational-outreach',
        labelKey: 'home.page.offerings.items.education.primary_cta',
        labelFallback: 'Join the Programme'
      },
      secondary: {
        href: '/education-hub#toolkits',
        labelKey: 'home.page.offerings.items.education.secondary_cta',
        labelFallback: 'Access Resource Library'
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
          href: '/education-hub#insights',
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
          href: '/education-hub#case-studies',
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
          href: '/education-hub#events',
          labelKey: 'home.page.education_hub.items.events.cta',
          labelFallback: 'See upcoming events'
        }
      }
    ]
  } as const;

  const finale = {
    eyebrowKey: 'home.page.finale.eyebrow',
    eyebrowFallback: 'Let’s collaborate',
    titleKey: 'home.page.finale.title',
    titleFallback: 'Ready to choreograph your next idea?',
    copyKey: 'home.page.finale.copy',
    copyFallback:
      'Bring your roadmap, classroom goals, or community vision. We will help orchestrate the right mix of consulting, products, and outreach to make AI feel friendly and focused.',
    primary: {
      href: '/services',
      labelKey: 'home.page.finale.primary_cta',
      labelFallback: 'Explore Our Services'
    },
    secondary: {
      href: '/contact',
      labelKey: 'home.page.finale.secondary_cta',
      labelFallback: 'Connect with the Team'
    }
  } as const;

  const platformShowcase = {
    eyebrowKey: 'home.page.platform_showcase.eyebrow',
    eyebrowFallback: 'Product snapshots',
    titleKey: 'home.page.platform_showcase.title',
    titleFallback: 'Experience our flagship platforms',
    descriptionKey: 'home.page.platform_showcase.description',
    descriptionFallback:
      'Peek at the calm, glassy interfaces our teams are polishing across Ideonautix and NodeVoyage. Every screen leans on the same accessible design system you experience on this site.',
    items: [
      {
        id: 'ideonautix',
        titleKey: 'home.page.platform_showcase.items.ideonautix.title',
        titleFallback: 'Ideonautix creative cockpit',
        copyKey: 'home.page.platform_showcase.items.ideonautix.copy',
        copyFallback:
          'A focused writing and pitching workspace that keeps teams synchronised while our AI co-pilot explains every suggestion.',
        ctaHref: '/ideonautix',
        ctaKey: 'home.page.platform_showcase.items.ideonautix.cta',
        ctaFallback: 'Explore Ideonautix',
        image: '/images/placeholders/platform-ideonautix.svg',
        altKey: 'home.page.platform_showcase.items.ideonautix.alt',
        altFallback: 'Mockup of the Ideonautix creative cockpit interface'
      },
      {
        id: 'nodevoyage',
        titleKey: 'home.page.platform_showcase.items.nodevoyage.title',
        titleFallback: 'NodeVoyage travel timeline',
        copyKey: 'home.page.platform_showcase.items.nodevoyage.copy',
        copyFallback:
          'Collaborative itineraries with inclusive defaults, live missions, and transparent AI reasoning ready for every traveller.',
        ctaHref: '/nodevoyage',
        ctaKey: 'home.page.platform_showcase.items.nodevoyage.cta',
        ctaFallback: 'Tour NodeVoyage',
        image: '/images/placeholders/platform-nodevoyage.svg',
        altKey: 'home.page.platform_showcase.items.nodevoyage.alt',
        altFallback: 'Mockup of the NodeVoyage planning board'
      }
    ]
  } as const;
</script>

<Hero
  class="hero-landing"
  variant="grid"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      {#each hero.actions as action (action.href)}
        <Button href={action.href} variant={action.variant} size={action.size}>{t(action.labelKey, action.labelFallback)}</Button>
      {/each}
    </div>
  </svelte:fragment>
</Hero>

<section class="section highlights" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('home.page.highlights.eyebrow', 'Key highlights')}</span>
      <h2>{t('home.page.highlights.title', 'Innovation that feels welcoming')}</h2>
      <p>
        {t(
          'home.page.highlights.description',
          'Every AlgoRhythmics experience blends rigorous logic with imaginative play. These highlights show how our rhythm supports travellers, founders, students, and lifelong learners.'
        )}
      </p>
    </header>

    <div class="highlights__grid" use:staggerReveal>
      {#each highlights as item (item.titleKey)}
        <GlassCard class="highlight-card" padding="lg" halo interactive>
          <div class="highlight-icon">
            <Icon name={item.icon} size={28} />
          </div>
          <h3>{t(item.titleKey, item.titleFallback)}</h3>
          <p>{t(item.copyKey, item.copyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section offerings" data-surface="glow" aria-labelledby="offerings-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('home.page.offerings.eyebrow', 'What we offer')}</span>
      <h2 id="offerings-heading">{t('home.page.offerings.title', 'Services, platforms, and programmes in one rhythm')}</h2>
      <p>
        {t(
          'home.page.offerings.description',
          'Choose the path that fits your journey. We keep transitions effortless—partnerships often blend consulting, products, and outreach to meet evolving goals.'
        )}
      </p>
    </header>

    <div class="offerings__grid" use:staggerReveal>
      {#each offerings as item (item.id)}
        <GlassCard class="offering-card" padding="lg" id={item.id} interactive>
          <h3 class="offering-title">
            <span class="offering-icon">
              <Icon name={item.icon} size={26} />
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
</section>

<SectionDivider tone="neutral" />

<section class="section platform-showcase" data-surface="glow" aria-labelledby="platform-showcase-heading" use:revealOnScroll>
  <div class="container">
    <div class="platform-showcase__header">
      <span class="section-eyebrow">{t(platformShowcase.eyebrowKey, platformShowcase.eyebrowFallback)}</span>
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
</section>

<section class="section resources" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t(educationShowcase.eyebrowKey, educationShowcase.eyebrowFallback)}</span>
      <h2>{t(educationShowcase.titleKey, educationShowcase.titleFallback)}</h2>
      <p>{t(educationShowcase.descriptionKey, educationShowcase.descriptionFallback)}</p>
    </header>

    <div class="resources__grid" use:staggerReveal>
      {#each educationShowcase.items as item (item.titleKey)}
        <GlassCard class="resource-card" padding="lg" halo interactive>
          <div class="resource-icon">
            <Icon name={item.icon} size={28} />
          </div>
          <span class="resource-eyebrow">{t(item.eyebrowKey, item.eyebrowFallback)}</span>
          <h3>{t(item.titleKey, item.titleFallback)}</h3>
          <p>{t(item.copyKey, item.copyFallback)}</p>
          <div class="card-actions">
            <Button href={item.cta.href} variant="secondary" size="md">{t(item.cta.labelKey, item.cta.labelFallback)}</Button>
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="section finale" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg" interactive>
      <span class="section-eyebrow">{t(finale.eyebrowKey, finale.eyebrowFallback)}</span>
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
</section>

<style>
  .hero-description {
    max-width: 70ch;
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

  .section-heading {
    position: relative;
    z-index: var(--z-content);
  }

  .section-heading::after {
    content: '';
    position: absolute;
    inset-inline: clamp(-1.5rem, -4vw, -1rem);
    inset-block-end: -1.25rem;
    height: 2px;
    border-radius: var(--radius-full);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--aurora-purple) 82%, transparent 18%),
      color-mix(in srgb, var(--voyage-blue) 70%, var(--signal-yellow) 30%)
    );
    opacity: 0.55;
    pointer-events: none;
  }

  .section.highlights,
  .section.offerings,
  .section.platform-showcase,
  .section.resources,
  .section.finale {
    isolation: isolate;
    overflow: hidden;
  }

  .section.highlights {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.24);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.16);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  .section.offerings {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  .section.platform-showcase {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  .section.resources {
    --section-glow-primary: rgba(var(--signal-yellow-rgb), 0.2);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.18);
    --section-glow-accent: rgba(var(--voyage-blue-rgb), 0.14);
  }

  .section.finale {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.28);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.16);
  }

  .platform-showcase__header {
    max-width: var(--measure-lg);
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.4rem);
  }

  .platform-showcase__intro {
    color: var(--text-secondary);
  }

  .platform-showcase__grid {
    display: grid;
    gap: clamp(1.75rem, 4vw, 3rem);
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .platform-showcase__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  :global(.platform-card) {
    display: grid;
    gap: clamp(1.25rem, 3vw, 2rem);
  }

  :global(.platform-card img) {
    width: 100%;
    height: auto;
    border-radius: max(0px, calc(var(--glass-card-radius, 0) + 0.75rem));
    border: 1px solid color-mix(in srgb, var(--glass-border) 54%, transparent 46%);
    box-shadow: 0 18px 44px rgba(var(--ink-rgb), 0.12);
  }

  :global(.platform-card__body) {
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }

  .highlights > .container,
  .offerings > .container,
  .resources > .container,
  .finale > .container {
    position: relative;
    z-index: var(--z-content);
  }


  .highlights__grid,
  .offerings__grid,
  .resources__grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.highlight-card),
  :global(.offering-card),
  :global(.resource-card),
  :global(.finale-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  .highlight-icon {
    width: clamp(2.75rem, 8vw, 3.25rem);
    height: clamp(2.75rem, 8vw, 3.25rem);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 38%, transparent 62%);
    color: var(--voyage-blue);
    box-shadow: 0 8px 18px rgba(16, 41, 95, 0.12);
    animation: floaty 32s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  }

  .offering-title {
    display: flex;
    align-items: center;
    gap: clamp(0.65rem, 2vw, 0.85rem);
    margin: 0;
  }

  .offering-icon {
    inline-size: clamp(2.5rem, 7vw, 3rem);
    block-size: clamp(2.5rem, 7vw, 3rem);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    color: var(--aurora-purple);
    box-shadow: 0 8px 18px rgba(58, 28, 120, 0.2);
    animation: floaty 38s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite reverse;
  }

  :global(.offering-card) ul,
  :global(.resource-card) ul {
    margin: 0;
    padding-left: clamp(1.1rem, 3vw, 1.4rem);
    display: grid;
    gap: clamp(0.35rem, 1.5vw, 0.5rem);
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .resource-icon {
    width: clamp(2.75rem, 8vw, 3.25rem);
    height: clamp(2.75rem, 8vw, 3.25rem);
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background:
      radial-gradient(circle at 28% 28%, rgba(var(--signal-yellow-rgb), 0.22), transparent 72%),
      color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--signal-yellow-rgb), 0.12) 18%);
    color: var(--signal-yellow);
    box-shadow: 0 8px 20px rgba(148, 110, 10, 0.24);
    animation: floaty 42s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  }

  .resource-eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  .highlights :global(.highlight-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.12) 8%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 35%, transparent 65%);
    --surface-glass-shadow: 0 22px 48px rgba(9, 21, 58, 0.18);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  .highlights :global(.highlight-card:hover .highlight-icon),
  .highlights :global(.highlight-card:focus-visible .highlight-icon) {
    animation-duration: 14s;
  }

  .offerings :global(.offering-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--aurora-purple-rgb), 0.14) 10%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 38%, transparent 62%);
    --surface-glass-shadow: 0 26px 60px rgba(20, 8, 62, 0.22);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 72%, var(--signal-yellow) 28%);
  }

  .resources :global(.resource-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 93%, rgba(var(--signal-yellow-rgb), 0.12) 7%);
    --surface-glass-border: color-mix(in srgb, var(--signal-yellow) 30%, transparent 70%);
    --surface-glass-shadow: 0 22px 46px rgba(95, 68, 4, 0.22);
    --focus-ring-color: color-mix(in srgb, var(--signal-yellow) 70%, var(--aurora-purple) 30%);
  }

  .finale :global(.finale-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.2) 12%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 42%, transparent 58%);
    --surface-glass-shadow: 0 32px 72px rgba(24, 12, 58, 0.28);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 70%, var(--voyage-blue) 30%);
  }

  .finale :global(.finale-card)::after {
    border: 1px solid rgba(var(--signal-yellow-rgb), 0.25);
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
    .resources__grid,
    .platform-showcase__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 900px) {
    .highlights__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .offerings__grid,
    .resources__grid,
    .platform-showcase__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @keyframes floaty {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      transform: translate3d(0, -3px, 0) scale(1.01);
    }

    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .highlight-icon,
    .offering-icon,
    .resource-icon {
      animation: none;
    }

    .section-heading::after {
      display: none;
    }

    .highlights,
    .offerings,
    .resources,
    .finale {
      animation: none;
    }

    .highlights::before,
    .offerings::before,
    .resources::before,
    .finale::before,
    .highlight-icon,
    .offering-icon,
    .resource-icon {
      animation: none;
    }
  }
</style>




