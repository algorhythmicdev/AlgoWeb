<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const hero = {
    title: 'AlgoRhythmics Insights & Resources',
    subtitle: 'Stories, case studies, documentation, and events that share our calm AI playbooks.',
    description:
      'Whether you are exploring creative productivity, planning educational programmes, or piloting AI inside your organisation, these resources keep you in step with our studio.',
    primary: { label: 'Read the blog', href: '#blog' },
    secondary: { label: 'Subscribe to Newsletter', href: '#newsletter' }
  };

  const resourceSections = [
    {
      id: 'blog',
      eyebrow: 'Blog',
      title: 'AlgoRhythmics Insights & Blog',
      copy:
        'A space where logic meets creativity in writing. Discover trend analyses, creative productivity tips, product updates, and behind-the-scenes stories from our educational pilots.',
      highlights: [
        'Accessible, jargon-light articles for multi-generational readers',
        'Spotlights on educators, founders, and students using calm AI',
        'Practical checklists inspired by signage craft and inclusive design'
      ],
      primary: { label: 'Visit the blog', href: '/blog' },
      secondary: { label: 'Subscribe for monthly highlights', href: '#newsletter' }
    },
    {
      id: 'case-studies',
      eyebrow: 'Case studies',
      title: 'Impact & success stories',
      copy:
        'Interactive narratives that show how AlgoRhythmics solutions deliver results—from classrooms adopting AI literacy to teams streamlining creative workflows.',
      highlights: [
        'NodeVoyage accessibility refresh with +22% itinerary completion',
        'Ideonautix founder cockpit raising satisfaction to 4.8/5',
        'Calm consulting blueprint guiding logistics teams through adoption'
      ],
      primary: { label: 'Explore case studies', href: '/resources#case-studies' },
      secondary: { label: 'Download briefing kits', href: '/resources#documentation' }
    },
    {
      id: 'documentation',
      eyebrow: 'Documentation',
      title: 'Guides, APIs, and curriculum packs',
      copy:
        'Every platform ships with clear guides, inclusive language, and signage-inspired diagrams. Educators can also download curriculum packs aligned with LIAA pilots.',
      highlights: [
        'User guides covering NodeVoyage and Ideonautix fundamentals',
        'API references with transparent data usage explanations',
        'Lesson plans, workshop decks, and classroom management tips'
      ],
      primary: { label: 'Access documentation', href: '/resources#documentation' },
      secondary: { label: 'Contact education team', href: 'mailto:education@algorhythmics.ai' }
    }
  ];

  const eventsSection = {
    title: 'Upcoming workshops, webinars & community events',
    copy:
      'Join monthly sessions that demystify AI, celebrate creativity, and connect peers across disciplines. Most events are free and archived for replay.',
    bullets: [
      'Hands-on workshops for families, teachers, and founders',
      'Virtual webinars with live Q&A and accessible transcripts',
      'Community hackathons and cultural collaborations blending AI with art'
    ],
    primary: { label: 'Browse the event calendar', href: '/resources#events' },
    secondary: { label: 'Host an event with us', href: '/contact' }
  };

  const newsletter = {
    title: 'Stay in the calm loop',
    copy:
      'Subscribe to receive monthly highlights—product updates, educational wins, accessibility upgrades, and invitations to upcoming pilots.',
    primary: { label: 'Subscribe to newsletter', href: 'https://algorhythmics.substack.com' }
  };
</script>

<Hero variant="aurora" title={hero.title} subtitle={hero.subtitle}>
  <svelte:fragment slot="description">
    <p class="hero-description">{hero.description}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href={hero.primary.href}>{hero.primary.label}</Button>
      <Button variant="secondary" size="lg" href={hero.secondary.href}>{hero.secondary.label}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="resources" use:revealOnScroll>
  <div class="container resources__grid" use:staggerReveal>
    {#each resourceSections as section (section.id)}
      <GlassCard class="resource-card" padding="lg" halo id={section.id}>
        <span class="resource-eyebrow">{section.eyebrow}</span>
        <h2>{section.title}</h2>
        <p>{section.copy}</p>
        <ul>
          {#each section.highlights as highlight (highlight)}
            <li>{highlight}</li>
          {/each}
        </ul>
        <div class="card-actions">
          <Button href={section.primary.href} variant="gradient" size="md">{section.primary.label}</Button>
          {#if section.secondary}
            <Button href={section.secondary.href} variant="secondary" size="md">{section.secondary.label}</Button>
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
      <span class="resource-eyebrow">Events</span>
      <h2>{eventsSection.title}</h2>
      <p>{eventsSection.copy}</p>
      <ul>
        {#each eventsSection.bullets as bullet (bullet)}
          <li>{bullet}</li>
        {/each}
      </ul>
      <div class="card-actions">
        <Button href={eventsSection.primary.href} variant="gradient" size="md">{eventsSection.primary.label}</Button>
        <Button href={eventsSection.secondary.href} variant="secondary" size="md">{eventsSection.secondary.label}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<section class="newsletter" id="newsletter" use:revealOnScroll>
  <div class="container">
    <GlassCard class="newsletter-card" padding="lg" halo>
      <span class="resource-eyebrow">Newsletter</span>
      <h2>{newsletter.title}</h2>
      <p>{newsletter.copy}</p>
      <div class="card-actions">
        <Button href={newsletter.primary.href} variant="gradient" size="lg">{newsletter.primary.label}</Button>
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


