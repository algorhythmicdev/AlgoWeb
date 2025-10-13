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
    titleKey: 'resources.page.hero.title',
    titleFallback: 'AlgoRhythmics Insights & Resources',
    subtitleKey: 'resources.page.hero.subtitle',
    subtitleFallback: 'Stories, case studies, documentation, and events that share our calm AI playbooks.',
    descriptionKey: 'resources.page.hero.description',
    descriptionFallback:
      'Whether you are exploring creative productivity, planning educational programmes, or piloting AI inside your organisation, these resources keep you in step with our studio.',
    primary: {
      href: '#blog',
      labelKey: 'resources.page.hero.primary_cta',
      labelFallback: 'Read the blog'
    },
    secondary: {
      href: '#newsletter',
      labelKey: 'resources.page.hero.secondary_cta',
      labelFallback: 'Subscribe to Newsletter'
    }
  } as const;

  const resourceSections = [
    {
      id: 'blog',
      eyebrowKey: 'resources.page.sections.blog.eyebrow',
      eyebrowFallback: 'Blog',
      titleKey: 'resources.page.sections.blog.title',
      titleFallback: 'AlgoRhythmics Insights & Blog',
      copyKey: 'resources.page.sections.blog.copy',
      copyFallback:
        'A space where logic meets creativity in writing. Discover trend analyses, creative productivity tips, product updates, and behind-the-scenes stories from our educational pilots.',
      highlights: [
        {
          key: 'resources.page.sections.blog.highlights.0',
          fallback: 'Accessible, jargon-light articles for multi-generational readers'
        },
        {
          key: 'resources.page.sections.blog.highlights.1',
          fallback: 'Spotlights on educators, founders, and students using calm AI'
        },
        {
          key: 'resources.page.sections.blog.highlights.2',
          fallback: 'Practical checklists inspired by signage craft and inclusive design'
        }
      ],
      primary: {
        href: '/resources#blog',
        labelKey: 'resources.page.sections.blog.primary_cta',
        labelFallback: 'Visit the blog'
      },
      secondary: {
        href: '#newsletter',
        labelKey: 'resources.page.sections.blog.secondary_cta',
        labelFallback: 'Subscribe for monthly highlights'
      }
    },
    {
      id: 'case-studies',
      eyebrowKey: 'resources.page.sections.cases.eyebrow',
      eyebrowFallback: 'Case studies',
      titleKey: 'resources.page.sections.cases.title',
      titleFallback: 'Impact & success stories',
      copyKey: 'resources.page.sections.cases.copy',
      copyFallback:
        'Interactive narratives that show how AlgoRhythmics solutions deliver results—from classrooms adopting AI literacy to teams streamlining creative workflows.',
      highlights: [
        {
          key: 'resources.page.sections.cases.highlights.0',
          fallback: 'NodeVoyage accessibility refresh with +22% itinerary completion'
        },
        {
          key: 'resources.page.sections.cases.highlights.1',
          fallback: 'Ideonautix founder cockpit raising satisfaction to 4.8/5'
        },
        {
          key: 'resources.page.sections.cases.highlights.2',
          fallback: 'Calm consulting blueprint guiding logistics teams through adoption'
        }
      ],
      primary: {
        href: '/resources#case-studies',
        labelKey: 'resources.page.sections.cases.primary_cta',
        labelFallback: 'Explore case studies'
      },
      secondary: {
        href: '/resources#documentation',
        labelKey: 'resources.page.sections.cases.secondary_cta',
        labelFallback: 'Download briefing kits'
      }
    },
    {
      id: 'documentation',
      eyebrowKey: 'resources.page.sections.docs.eyebrow',
      eyebrowFallback: 'Documentation',
      titleKey: 'resources.page.sections.docs.title',
      titleFallback: 'Guides, APIs, and curriculum packs',
      copyKey: 'resources.page.sections.docs.copy',
      copyFallback:
        'Every platform ships with clear guides, inclusive language, and signage-inspired diagrams. Educators can also download curriculum packs aligned with LIAA pilots.',
      highlights: [
        {
          key: 'resources.page.sections.docs.highlights.0',
          fallback: 'User guides covering NodeVoyage and Ideonautix fundamentals'
        },
        {
          key: 'resources.page.sections.docs.highlights.1',
          fallback: 'API references with transparent data usage explanations'
        },
        {
          key: 'resources.page.sections.docs.highlights.2',
          fallback: 'Lesson plans, workshop decks, and classroom management tips'
        }
      ],
      primary: {
        href: '/resources#documentation',
        labelKey: 'resources.page.sections.docs.primary_cta',
        labelFallback: 'Access documentation'
      },
      secondary: {
        href: 'mailto:education@algorhythmics.ai',
        labelKey: 'resources.page.sections.docs.secondary_cta',
        labelFallback: 'Contact education team'
      }
    }
  ] as const;

  const eventsSection = {
    eyebrowKey: 'resources.page.events.eyebrow',
    eyebrowFallback: 'Events',
    titleKey: 'resources.page.events.title',
    titleFallback: 'Upcoming workshops, webinars & community events',
    copyKey: 'resources.page.events.copy',
    copyFallback:
      'Join monthly sessions that demystify AI, celebrate creativity, and connect peers across disciplines. Most events are free and archived for replay.',
    bullets: [
      {
        key: 'resources.page.events.bullets.0',
        fallback: 'Hands-on workshops for families, teachers, and founders'
      },
      {
        key: 'resources.page.events.bullets.1',
        fallback: 'Virtual webinars with live Q&A and accessible transcripts'
      },
      {
        key: 'resources.page.events.bullets.2',
        fallback: 'Community hackathons and cultural collaborations blending AI with art'
      }
    ],
    primary: {
      href: '/resources#events',
      labelKey: 'resources.page.events.primary_cta',
      labelFallback: 'Browse the event calendar'
    },
    secondary: {
      href: '/contact',
      labelKey: 'resources.page.events.secondary_cta',
      labelFallback: 'Host an event with us'
    }
  } as const;

  const newsletter = {
    eyebrowKey: 'resources.page.newsletter.eyebrow',
    eyebrowFallback: 'Newsletter',
    titleKey: 'resources.page.newsletter.title',
    titleFallback: 'Stay in the calm loop',
    copyKey: 'resources.page.newsletter.copy',
    copyFallback:
      'Subscribe to receive monthly highlights—product updates, educational wins, accessibility upgrades, and invitations to upcoming pilots.',
    primary: {
      href: 'https://algorhythmics.substack.com',
      labelKey: 'resources.page.newsletter.primary_cta',
      labelFallback: 'Subscribe to newsletter'
    }
  } as const;
</script>

<Hero variant="aurora" title={t(hero.titleKey, hero.titleFallback)} subtitle={t(hero.subtitleKey, hero.subtitleFallback)}>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href={hero.primary.href}>{t(hero.primary.labelKey, hero.primary.labelFallback)}</Button>
      <Button variant="secondary" size="lg" href={hero.secondary.href}>{t(hero.secondary.labelKey, hero.secondary.labelFallback)}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="resources" use:revealOnScroll>
  <div class="container resources__grid" use:staggerReveal>
    {#each resourceSections as section (section.id)}
      <GlassCard class="resource-card" padding="lg" halo id={section.id}>
        <span class="resource-eyebrow">{t(section.eyebrowKey, section.eyebrowFallback)}</span>
        <h2>{t(section.titleKey, section.titleFallback)}</h2>
        <p>{t(section.copyKey, section.copyFallback)}</p>
        <ul>
          {#each section.highlights as highlight (highlight.key)}
            <li>{t(highlight.key, highlight.fallback)}</li>
          {/each}
        </ul>
        <div class="card-actions">
          <Button href={section.primary.href} variant="gradient" size="md">{t(section.primary.labelKey, section.primary.labelFallback)}</Button>
          {#if section.secondary}
            <Button href={section.secondary.href} variant="secondary" size="md">{t(section.secondary.labelKey, section.secondary.labelFallback)}</Button>
          {/if}
        </div>
      </GlassCard>
    {/each}
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="events" use:revealOnScroll>
  <div class="container">
    <GlassCard class="events-card" padding="lg" id="events">
      <span class="resource-eyebrow">{t(eventsSection.eyebrowKey, eventsSection.eyebrowFallback)}</span>
      <h2>{t(eventsSection.titleKey, eventsSection.titleFallback)}</h2>
      <p>{t(eventsSection.copyKey, eventsSection.copyFallback)}</p>
      <ul>
        {#each eventsSection.bullets as bullet (bullet.key)}
          <li>{t(bullet.key, bullet.fallback)}</li>
        {/each}
      </ul>
      <div class="card-actions">
        <Button href={eventsSection.primary.href} variant="gradient" size="md">{t(eventsSection.primary.labelKey, eventsSection.primary.labelFallback)}</Button>
        <Button href={eventsSection.secondary.href} variant="secondary" size="md">{t(eventsSection.secondary.labelKey, eventsSection.secondary.labelFallback)}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<section class="newsletter" id="newsletter" use:revealOnScroll>
  <div class="container">
    <GlassCard class="newsletter-card" padding="lg" halo>
      <span class="resource-eyebrow">{t(newsletter.eyebrowKey, newsletter.eyebrowFallback)}</span>
      <h2>{t(newsletter.titleKey, newsletter.titleFallback)}</h2>
      <p>{t(newsletter.copyKey, newsletter.copyFallback)}</p>
      <div class="card-actions">
        <Button href={newsletter.primary.href} variant="gradient" size="lg">{t(newsletter.primary.labelKey, newsletter.primary.labelFallback)}</Button>
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

  .resources,
  .events,
  .newsletter {
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }

  .resources__grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.resource-card),
  :global(.events-card),
  :global(.newsletter-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  .resource-eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.resource-card) ul,
  :global(.events-card) ul {
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

  @media (min-width: 900px) {
    .resources__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .resources,
    .events,
    .newsletter {
      animation: none;
    }
  }
</style>


