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
    titleKey: 'educationHub.page.hero.title',
    titleFallback: 'Education Hub: Calm AI stories & learning paths',
    subtitleKey: 'educationHub.page.hero.subtitle',
    subtitleFallback: 'Discover inclusive AI resources, classroom-ready toolkits, and community highlights from the AlgoRhythmics crew.',
    descriptionKey: 'educationHub.page.hero.description',
    descriptionFallback:
      'Explore how calm AI comes to life across classrooms, studios, and cities. Our Education Hub curates stories, toolkits, and events so every learner can join the rhythm.',
    primaryCta: {
      href: '#insights',
      labelKey: 'educationHub.page.hero.primary_cta',
      labelFallback: 'Browse latest insights'
    },
    secondaryCta: {
      href: '#newsletter',
      labelKey: 'educationHub.page.hero.secondary_cta',
      labelFallback: 'Subscribe for updates'
    },
    highlights: [
      {
        key: 'educationHub.page.hero.highlights.0',
        fallback: 'AAA-accessible articles translated across six languages'
      },
      {
        key: 'educationHub.page.hero.highlights.1',
        fallback: 'Classroom-ready toolkits shaped with teachers and families'
      },
      {
        key: 'educationHub.page.hero.highlights.2',
        fallback: 'Monthly community events with recordings & transcripts'
      }
    ]
  } as const;

  const featuredStory = {
    eyebrowKey: 'educationHub.page.featured.eyebrow',
    eyebrowFallback: 'Featured story',
    titleKey: 'educationHub.page.featured.title',
    titleFallback: 'How a Riga classroom built a calm AI newsroom',
    summaryKey: 'educationHub.page.featured.summary',
    summaryFallback:
      'Students co-created responsible reporting workflows with Ideonautix, pairing signage-inspired rituals with explainable automation.',
    metaKey: 'educationHub.page.featured.meta',
    metaFallback: '16-week pilot • Journalism & civic tech',
    primaryCta: {
      href: '#case-studies',
      labelKey: 'educationHub.page.featured.primary_cta',
      labelFallback: 'Read the pilot recap'
    },
    secondaryCta: {
      href: '#toolkits',
      labelKey: 'educationHub.page.featured.secondary_cta',
      labelFallback: 'Download classroom toolkit'
    }
  } as const;

  const latestArticles = [
    {
      titleKey: 'educationHub.page.insights.items.0.title',
      titleFallback: 'Designing inclusive AI rituals for morning assemblies',
      summaryKey: 'educationHub.page.insights.items.0.summary',
      summaryFallback: 'A step-by-step guide for teachers hosting calm AI “news shows” with younger students.',
      metaKey: 'educationHub.page.insights.items.0.meta',
      metaFallback: 'March 2026 • Accessibility',
      hrefKey: 'educationHub.page.insights.items.0.href',
      hrefFallback: '#'
    },
    {
      titleKey: 'educationHub.page.insights.items.1.title',
      titleFallback: 'From idea to launch: documenting an Ideonautix founder sprint',
      summaryKey: 'educationHub.page.insights.items.1.summary',
      summaryFallback: 'See how a three-person team used calm check-ins, AI copilots, and tactile rituals to ship faster.',
      metaKey: 'educationHub.page.insights.items.1.meta',
      metaFallback: 'February 2026 • Product practice',
      hrefKey: 'educationHub.page.insights.items.1.href',
      hrefFallback: '#'
    },
    {
      titleKey: 'educationHub.page.insights.items.2.title',
      titleFallback: 'Parent ambassadors keeping AI conversations joyful at home',
      summaryKey: 'educationHub.page.insights.items.2.summary',
      summaryFallback: 'Lessons from monthly library circles that mix storytelling, crafts, and calm automation demos.',
      metaKey: 'educationHub.page.insights.items.2.meta',
      metaFallback: 'January 2026 • Community',
      hrefKey: 'educationHub.page.insights.items.2.href',
      hrefFallback: '#'
    }
  ] as const;

  const learningLibrary = [
    {
      eyebrowKey: 'educationHub.page.toolkits.items.0.eyebrow',
      eyebrowFallback: 'Teachers',
      titleKey: 'educationHub.page.toolkits.items.0.title',
      titleFallback: 'AI lesson arcs with signage-inspired visuals',
      copyKey: 'educationHub.page.toolkits.items.0.copy',
      copyFallback: 'Plug-and-play modules with bilingual slides, tactile prompts, and printable pacing cards.',
      bullets: [
        {
          key: 'educationHub.page.toolkits.items.0.bullets.0',
          fallback: 'Grades 4–12 differentiation paths with accessibility notes'
        },
        {
          key: 'educationHub.page.toolkits.items.0.bullets.1',
          fallback: 'Assessment rubrics that honour creativity and collaboration'
        },
        {
          key: 'educationHub.page.toolkits.items.0.bullets.2',
          fallback: 'Mini reflection rituals to keep AI use transparent'
        }
      ],
      cta: {
        hrefKey: 'educationHub.page.toolkits.items.0.href',
        hrefFallback: '#',
        labelKey: 'educationHub.page.toolkits.items.0.cta',
        labelFallback: 'Preview a module'
      }
    },
    {
      eyebrowKey: 'educationHub.page.toolkits.items.1.eyebrow',
      eyebrowFallback: 'Founders & teams',
      titleKey: 'educationHub.page.toolkits.items.1.title',
      titleFallback: 'Calm AI operating guide for startups',
      copyKey: 'educationHub.page.toolkits.items.1.copy',
      copyFallback: 'Workshop decks and service blueprints for teams adopting explainable automation.',
      bullets: [
        {
          key: 'educationHub.page.toolkits.items.1.bullets.0',
          fallback: 'Weekly sprint rituals with inclusive facilitation tips'
        },
        {
          key: 'educationHub.page.toolkits.items.1.bullets.1',
          fallback: 'Consent-forward data intake templates and governance checklists'
        },
        {
          key: 'educationHub.page.toolkits.items.1.bullets.2',
          fallback: 'Case study workbook for mapping impact stories'
        }
      ],
      cta: {
        hrefKey: 'educationHub.page.toolkits.items.1.href',
        hrefFallback: '#',
        labelKey: 'educationHub.page.toolkits.items.1.cta',
        labelFallback: 'Download the guide'
      }
    },
    {
      eyebrowKey: 'educationHub.page.toolkits.items.2.eyebrow',
      eyebrowFallback: 'Families',
      titleKey: 'educationHub.page.toolkits.items.2.title',
      titleFallback: 'Home rituals for curious makers',
      copyKey: 'educationHub.page.toolkits.items.2.copy',
      copyFallback: 'Story cards, unplugged activities, and conversation starters for multi-generational learning.',
      bullets: [
        {
          key: 'educationHub.page.toolkits.items.2.bullets.0',
          fallback: 'Printable zines that explain algorithms without jargon'
        },
        {
          key: 'educationHub.page.toolkits.items.2.bullets.1',
          fallback: 'Audio guides with calming narration in multiple languages'
        },
        {
          key: 'educationHub.page.toolkits.items.2.bullets.2',
          fallback: 'Monthly challenges that mix art, data, and storytelling'
        }
      ],
      cta: {
        hrefKey: 'educationHub.page.toolkits.items.2.href',
        hrefFallback: '#',
        labelKey: 'educationHub.page.toolkits.items.2.cta',
        labelFallback: 'Start a family challenge'
      }
    }
  ] as const;

  const communitySpotlights = [
    {
      titleKey: 'educationHub.page.spotlights.items.0.title',
      titleFallback: 'Teacher roundtables with Latvia’s Mentor Network',
      copyKey: 'educationHub.page.spotlights.items.0.copy',
      copyFallback: 'Monthly conversations surface what educators need next—from translation support to reflective journaling prompts.',
      metaKey: 'educationHub.page.spotlights.items.0.meta',
      metaFallback: 'Hybrid • Hosted with LIAA',
      hrefKey: 'educationHub.page.spotlights.items.0.href',
      hrefFallback: '#'
    },
    {
      titleKey: 'educationHub.page.spotlights.items.1.title',
      titleFallback: 'Calm AI residencies inside cultural institutions',
      copyKey: 'educationHub.page.spotlights.items.1.copy',
      copyFallback: 'Museums and theatres pair artists with technologists to co-create sensory storytelling installations.',
      metaKey: 'educationHub.page.spotlights.items.1.meta',
      metaFallback: 'On-site • Riga & Liepāja',
      hrefKey: 'educationHub.page.spotlights.items.1.href',
      hrefFallback: '#'
    },
    {
      titleKey: 'educationHub.page.spotlights.items.2.title',
      titleFallback: 'Parent ambassador circles for inclusive tech nights',
      copyKey: 'educationHub.page.spotlights.items.2.copy',
      copyFallback: 'Families co-host gentle demos, lending libraries, and discussion prompts to demystify AI at home.',
      metaKey: 'educationHub.page.spotlights.items.2.meta',
      metaFallback: 'Virtual • Monthly',
      hrefKey: 'educationHub.page.spotlights.items.2.href',
      hrefFallback: '#'
    }
  ] as const;

  const events = {
    eyebrowKey: 'educationHub.page.events.eyebrow',
    eyebrowFallback: 'Events',
    titleKey: 'educationHub.page.events.title',
    titleFallback: 'Upcoming workshops, webinars & community jams',
    copyKey: 'educationHub.page.events.copy',
    copyFallback:
      'Join sessions where we sketch prototypes together, explore ethical guardrails, and celebrate student showcases. Most events include live captioning and recorded replays.',
    bullets: [
      {
        key: 'educationHub.page.events.bullets.0',
        fallback: 'Workshop: Calm AI storytelling for libraries (Apr 18, hybrid)'
      },
      {
        key: 'educationHub.page.events.bullets.1',
        fallback: 'Webinar: Ideonautix focus rituals for remote teams (May 9, virtual)'
      },
      {
        key: 'educationHub.page.events.bullets.2',
        fallback: 'Community jam: NodeVoyage climate missions (Jun 1, Riga & online)'
      }
    ],
    primaryCta: {
      hrefKey: 'educationHub.page.events.primary_cta_href',
      hrefFallback: 'https://lu.ma/algorhythmics',
      labelKey: 'educationHub.page.events.primary_cta',
      labelFallback: 'Open the event calendar'
    },
    secondaryCta: {
      hrefKey: 'educationHub.page.events.secondary_cta_href',
      hrefFallback: '/contact',
      labelKey: 'educationHub.page.events.secondary_cta',
      labelFallback: 'Host a session with us'
    }
  } as const;

  const newsletter = {
    eyebrowKey: 'educationHub.page.newsletter.eyebrow',
    eyebrowFallback: 'Newsletter',
    titleKey: 'educationHub.page.newsletter.title',
    titleFallback: 'Stay in the calm loop',
    copyKey: 'educationHub.page.newsletter.copy',
    copyFallback:
      'Monthly highlights with new toolkits, impact stories, and early invites to pilots. Short, friendly, and focused on actionable inspiration.',
    primaryCta: {
      hrefKey: 'educationHub.page.newsletter.primary_cta_href',
      hrefFallback: 'https://algorhythmics.substack.com',
      labelKey: 'educationHub.page.newsletter.primary_cta',
      labelFallback: 'Subscribe to newsletter'
    }
  } as const;
</script>

<Hero variant="grid" title={t(hero.titleKey, hero.titleFallback)} subtitle={t(hero.subtitleKey, hero.subtitleFallback)}>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href={hero.primaryCta.href} variant="gradient" size="lg">{t(hero.primaryCta.labelKey, hero.primaryCta.labelFallback)}</Button>
      <Button href={hero.secondaryCta.href} variant="secondary" size="lg">{t(hero.secondaryCta.labelKey, hero.secondaryCta.labelFallback)}</Button>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="highlights">
    <ul class="hero-highlights">
      {#each hero.highlights as item}
        <li>{t(item.key, item.fallback)}</li>
      {/each}
    </ul>
  </svelte:fragment>
</Hero>

<section class="featured" aria-labelledby="featured-heading" use:revealOnScroll>
  <div class="container">
    <GlassCard as="article" class="featured__card" halo padding="lg">
      <header class="featured__header">
        <p class="featured__eyebrow">{t(featuredStory.eyebrowKey, featuredStory.eyebrowFallback)}</p>
        <h2 id="featured-heading">{t(featuredStory.titleKey, featuredStory.titleFallback)}</h2>
        <p class="featured__meta">{t(featuredStory.metaKey, featuredStory.metaFallback)}</p>
      </header>
      <p class="featured__summary">{t(featuredStory.summaryKey, featuredStory.summaryFallback)}</p>
      <div class="featured__actions">
        <Button href={featuredStory.primaryCta.href} variant="gradient">{t(featuredStory.primaryCta.labelKey, featuredStory.primaryCta.labelFallback)}</Button>
        <Button href={featuredStory.secondaryCta.href} variant="subtle">{t(featuredStory.secondaryCta.labelKey, featuredStory.secondaryCta.labelFallback)}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<SectionDivider label={t('educationHub.page.sections.insights.label', 'Latest insights')} tone="aurora" />

<section id="insights" class="insights" aria-labelledby="insights-heading" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <p class="section-heading__eyebrow">{t('educationHub.page.sections.insights.eyebrow', 'Insights')}</p>
      <h2 id="insights-heading">{t('educationHub.page.sections.insights.title', 'Fresh perspectives on calm AI')}</h2>
      <p class="section-heading__copy">{t('educationHub.page.sections.insights.copy', 'Articles crafted with educators, founders, and families to keep AI human and hopeful.')}</p>
    </div>
    <div class="insights__grid" use:staggerReveal>
      {#each latestArticles as article}
        <GlassCard as="article" class="insights__card" interactive>
          <p class="insights__meta">{t(article.metaKey, article.metaFallback)}</p>
          <h3 class="insights__title">{t(article.titleKey, article.titleFallback)}</h3>
          <p class="insights__summary">{t(article.summaryKey, article.summaryFallback)}</p>
          <Button href={t(article.hrefKey, article.hrefFallback)} variant="subtle">{t('educationHub.page.insights.read', 'Read article')}</Button>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider label={t('educationHub.page.sections.toolkits.label', 'Learning toolkits')} tone="voyage" />

<section id="toolkits" class="toolkits" aria-labelledby="toolkits-heading" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <p class="section-heading__eyebrow">{t('educationHub.page.sections.toolkits.eyebrow', 'Toolkits')}</p>
      <h2 id="toolkits-heading">{t('educationHub.page.sections.toolkits.title', 'Ready-to-use calm AI resources')}</h2>
      <p class="section-heading__copy">{t('educationHub.page.sections.toolkits.copy', 'Downloadable lesson arcs, operating guides, and family activities designed with accessibility at the core.')}</p>
    </div>
    <div class="toolkits__grid" use:staggerReveal>
      {#each learningLibrary as item}
        <GlassCard class="toolkits__card" interactive>
          <p class="toolkits__eyebrow">{t(item.eyebrowKey, item.eyebrowFallback)}</p>
          <h3 class="toolkits__title">{t(item.titleKey, item.titleFallback)}</h3>
          <p class="toolkits__copy">{t(item.copyKey, item.copyFallback)}</p>
          <ul class="toolkits__list">
            {#each item.bullets as bullet}
              <li>{t(bullet.key, bullet.fallback)}</li>
            {/each}
          </ul>
          <Button href={t(item.cta.hrefKey, item.cta.hrefFallback)} variant="secondary">{t(item.cta.labelKey, item.cta.labelFallback)}</Button>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider label={t('educationHub.page.sections.spotlights.label', 'Community spotlights')} tone="citrus" />

<section id="case-studies" class="spotlights" aria-labelledby="spotlights-heading" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <p class="section-heading__eyebrow">{t('educationHub.page.sections.spotlights.eyebrow', 'Spotlights')}</p>
      <h2 id="spotlights-heading">{t('educationHub.page.sections.spotlights.title', 'Impact stories & collaborations')}</h2>
      <p class="section-heading__copy">{t('educationHub.page.sections.spotlights.copy', 'Follow pilots, residencies, and community experiments that show calm AI in action.')}</p>
    </div>
    <div class="spotlights__grid" use:staggerReveal>
      {#each communitySpotlights as spotlight}
        <GlassCard class="spotlights__card" interactive>
          <p class="spotlights__meta">{t(spotlight.metaKey, spotlight.metaFallback)}</p>
          <h3 class="spotlights__title">{t(spotlight.titleKey, spotlight.titleFallback)}</h3>
          <p class="spotlights__copy">{t(spotlight.copyKey, spotlight.copyFallback)}</p>
          <Button href={t(spotlight.hrefKey, spotlight.hrefFallback)} variant="subtle">{t('educationHub.page.spotlights.read', 'Open story')}</Button>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider label={t('educationHub.page.sections.events.label', 'Upcoming events')} tone="aurora" />

<section id="events" class="events" aria-labelledby="events-heading" use:revealOnScroll>
  <div class="container">
    <GlassCard class="events__card" padding="lg">
      <p class="events__eyebrow">{t(events.eyebrowKey, events.eyebrowFallback)}</p>
      <h2 id="events-heading">{t(events.titleKey, events.titleFallback)}</h2>
      <p class="events__copy">{t(events.copyKey, events.copyFallback)}</p>
      <ul class="events__list">
        {#each events.bullets as bullet}
          <li>{t(bullet.key, bullet.fallback)}</li>
        {/each}
      </ul>
      <div class="events__actions">
        <Button href={t(events.primaryCta.hrefKey, events.primaryCta.hrefFallback)} variant="gradient" size="md">{t(events.primaryCta.labelKey, events.primaryCta.labelFallback)}</Button>
        <Button href={t(events.secondaryCta.hrefKey, events.secondaryCta.hrefFallback)} variant="secondary" size="md">{t(events.secondaryCta.labelKey, events.secondaryCta.labelFallback)}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<SectionDivider label={t('educationHub.page.sections.newsletter.label', 'Stay connected')} tone="voyage" />

<section id="newsletter" class="newsletter" aria-labelledby="newsletter-heading" use:revealOnScroll>
  <div class="container">
    <GlassCard class="newsletter__card" particles padding="lg">
      <p class="newsletter__eyebrow">{t(newsletter.eyebrowKey, newsletter.eyebrowFallback)}</p>
      <h2 id="newsletter-heading">{t(newsletter.titleKey, newsletter.titleFallback)}</h2>
      <p class="newsletter__copy">{t(newsletter.copyKey, newsletter.copyFallback)}</p>
      <Button href={t(newsletter.primaryCta.hrefKey, newsletter.primaryCta.hrefFallback)} variant="primary" size="lg">{t(newsletter.primaryCta.labelKey, newsletter.primaryCta.labelFallback)}</Button>
    </GlassCard>
  </div>
</section>

<style>
  :global(body.page-education-hub) {
    background: var(--bg-elev-0);
  }

  .hero-description {
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--ink-rgb), 0.8) 12%);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .hero-highlights {
    display: grid;
    gap: 0.6rem;
    font-size: 0.95rem;
    text-align: left;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .hero-highlights li::before {
    content: '✶';
    margin-right: 0.5rem;
    color: var(--signal-yellow);
  }

  .featured {
    padding-block: clamp(2.5rem, 6vw, 4rem);
  }

  :global(.featured__card) {
    display: grid;
    gap: clamp(1.25rem, 3vw, 2rem);
    background: color-mix(in srgb, var(--bg-elev-1) 86%, rgba(var(--aurora-purple-rgb), 0.12) 14%);
  }

  .featured__header {
    display: grid;
    gap: 0.65rem;
  }

  .featured__eyebrow {
    font-size: 0.9rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--voyage-blue) 70%, rgba(var(--ink-rgb), 0.64) 30%);
  }

  .featured__meta {
    font-size: 0.95rem;
    color: color-mix(in srgb, var(--text) 75%, rgba(var(--ink-rgb), 0.6) 25%);
  }

  .featured__summary {
    font-size: clamp(1.05rem, 2.3vw, 1.25rem);
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--ink-rgb), 0.76) 12%);
  }

  .featured__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .section-heading {
    display: grid;
    gap: 0.6rem;
    max-width: 720px;
    margin: 0 auto clamp(2rem, 4vw, 3rem);
    text-align: center;
  }

  .section-heading__eyebrow {
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.82rem;
    color: color-mix(in srgb, var(--voyage-blue) 70%, rgba(var(--ink-rgb), 0.6) 30%);
  }

  .section-heading__copy {
    font-size: 1.05rem;
    color: color-mix(in srgb, var(--text) 82%, rgba(var(--ink-rgb), 0.7) 18%);
  }

  .insights,
  .toolkits,
  .spotlights,
  .events,
  .newsletter {
    padding-block: clamp(2.5rem, 6vw, 4rem);
  }

  .insights__grid,
  .toolkits__grid,
  .spotlights__grid {
    display: grid;
    gap: clamp(1.2rem, 3vw, 1.8rem);
  }

  :global(.insights__card),
  :global(.spotlights__card) {
    display: grid;
    gap: 0.75rem;
  }

  .insights__meta,
  .spotlights__meta {
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--voyage-blue) 68%, rgba(var(--ink-rgb), 0.54) 32%);
  }

  .insights__title,
  .spotlights__title,
  .toolkits__title {
    font-size: clamp(1.25rem, 2.5vw, 1.6rem);
    line-height: 1.4;
  }

  .insights__summary,
  .spotlights__copy,
  .toolkits__copy {
    color: color-mix(in srgb, var(--text) 84%, rgba(var(--ink-rgb), 0.72) 16%);
    line-height: 1.6;
  }

  :global(.toolkits__card) {
    display: grid;
    gap: 0.9rem;
  }

  .toolkits__eyebrow {
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--aurora-purple) 68%, rgba(var(--ink-rgb), 0.58) 32%);
  }

  .toolkits__list {
    display: grid;
    gap: 0.45rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .toolkits__list li::before {
    content: '•';
    margin-right: 0.5rem;
    color: var(--signal-yellow);
  }

  :global(.events__card) {
    display: grid;
    gap: 1rem;
    text-align: center;
  }

  .events__eyebrow {
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--aurora-purple) 68%, rgba(var(--ink-rgb), 0.54) 32%);
  }

  .events__copy {
    color: color-mix(in srgb, var(--text) 86%, rgba(var(--ink-rgb), 0.72) 14%);
    line-height: 1.7;
  }

  .events__list {
    display: grid;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .events__list li::before {
    content: '▹';
    margin-right: 0.4rem;
    color: var(--voyage-blue);
  }

  .events__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  :global(.newsletter__card) {
    display: grid;
    gap: 1rem;
    text-align: center;
    background: color-mix(in srgb, var(--bg-elev-1) 82%, rgba(var(--voyage-blue-rgb), 0.15) 18%);
  }

  .newsletter__eyebrow {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--voyage-blue) 70%, rgba(var(--ink-rgb), 0.6) 30%);
  }

  .newsletter__copy {
    font-size: 1.05rem;
    color: color-mix(in srgb, var(--text) 86%, rgba(var(--ink-rgb), 0.72) 14%);
    line-height: 1.7;
  }

  @media (min-width: 720px) {
    .insights__grid,
    .spotlights__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .toolkits__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 719px) {
    .hero-actions {
      justify-content: stretch;
    }

    .hero-actions :global(a),
    .hero-actions :global(button) {
      flex: 1 1 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-actions,
    :global(.featured__card),
    .insights__grid,
    .toolkits__grid,
    .spotlights__grid,
    :global(.events__card),
    :global(.newsletter__card) {
      animation: none !important;
      transition: none !important;
    }
  }

  :global(html[data-theme='hc']) .hero-highlights li::before,
  :global(html[data-theme='hc']) .toolkits__list li::before,
  :global(html[data-theme='hc']) .events__list li::before {
    color: currentColor;
  }
</style>
