<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const hero = {
    titleLead: 'Where logic dances with creativity.',
    subtitle:
      'AlgoRhythmics builds AI platforms, consulting rituals, and educational programmes that keep innovation approachable for everyone—from students to enterprises.',
    description:
      'We choreograph technology with human-friendly signage craft, inclusive localisation, and transparent automation notes. The result is AI that feels calm, clear, and collaborative.'
  };

  const highlights = [
    {
      icon: 'idea',
      title: 'Innovative AI Solutions',
      copy: 'NodeVoyage and Ideonautix adapt to your journeys and workflows with playful precision.'
    },
    {
      icon: 'education',
      title: 'Educational Impact',
      copy: 'Curriculum pilots, teacher labs, and student hackathons nurture confident creators.'
    },
    {
      icon: 'target',
      title: 'Consulting Excellence',
      copy: 'Hands-on integration sprints pair transparent automation with lasting change.'
    },
    {
      icon: 'people',
      title: 'Community & Creativity',
      copy: 'Blogs, events, and community forums let families, founders, and students learn together.'
    }
  ];

  const offerings = [
    {
      id: 'consulting',
      title: 'AI Consulting & Integration',
      summary:
        'Map opportunities, run pilot sprints, and launch explainable automation with founder-led guidance.',
      bullets: [
        'Discovery workshops grounded in signage-inspired clarity',
        'Pilot roadmaps with opt-out controls and transparent documentation',
        'Training and change support to keep teams confident'
      ],
      primary: { label: 'Request a Consultation', href: '/services#consulting' }
    },
    {
      id: 'platforms',
      title: 'Flagship Platforms',
      summary:
        'NodeVoyage reimagines travel planning while Ideonautix accelerates creative productivity—both share the same accessible rhythm.',
      bullets: [
        'Personalised itineraries and collaborative travel workspaces',
        'Creative canvases, pitch assistants, and multilingual workflows',
        'AAA contrast modes, reduced-motion support, and localisation baked in'
      ],
      primary: { label: 'Explore Platforms', href: '/services#platforms' },
      secondary: { label: 'View Case Studies', href: '/resources#case-studies' }
    },
    {
      id: 'education',
      title: 'Educational Outreach',
      summary:
        'In partnership with LIAA, schools, and cultural institutions, we bring AI literacy to classrooms, libraries, and community hubs.',
      bullets: [
        'Ready-to-run lesson plans and bilingual classroom kits',
        'Parent ambassador network and mentorship pipelines',
        'Community events that blend logic, art, and storytelling'
      ],
      primary: { label: 'Join the Programme', href: '/educational-outreach' },
      secondary: { label: 'Access Resource Library', href: '/resources#documentation' }
    }
  ];

  const resourceSpotlight = {
    title: 'Keep up with the rhythm',
    description:
      'Our blog, case studies, and events share the playbooks behind calm AI—from classroom wins to product breakthroughs.',
    items: [
      {
        eyebrow: 'Blog',
        title: 'AlgoRhythmics Insights & Blog',
        copy: 'Dive into stories, how-to guides, and behind-the-scenes notes where logic meets creativity in writing.',
        cta: { label: 'Read the blog', href: '/resources#blog' }
      },
      {
        eyebrow: 'Case studies',
        title: 'Impact & Success Stories',
        copy: 'See how teams, students, and communities turn calm AI into measurable outcomes.',
        cta: { label: 'Explore case studies', href: '/resources#case-studies' }
      },
      {
        eyebrow: 'Events',
        title: 'Workshops, webinars & meetups',
        copy: 'Join upcoming sessions that demystify AI and celebrate co-creation across ages.',
        cta: { label: 'Browse events', href: '/resources#events' }
      }
    ]
  };

  const finale = {
    title: 'Ready to choreograph your next idea?',
    copy:
      'Bring your roadmap, classroom goals, or community vision. We will help orchestrate the right mix of consulting, products, and outreach to make AI feel friendly and focused.',
    primary: { label: 'Explore Our Services', href: '/services' },
    secondary: { label: 'Connect with the Team', href: '/contact' }
  };
</script>

<Hero variant="grid" title={hero.titleLead} subtitle={hero.subtitle}>
  <svelte:fragment slot="description">
    <p class="hero-description">{hero.description}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href="/services" variant="gradient" size="lg">Explore Our Services</Button>
      <Button href="/about" variant="secondary" size="lg">Learn About Our Mission</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="highlights" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Key highlights</span>
      <h2>Innovation that feels welcoming</h2>
      <p>
        Every AlgoRhythmics experience blends rigorous logic with imaginative play. These highlights show how our rhythm supports travellers, founders, students, and lifelong learners.
      </p>
    </header>

    <div class="highlights__grid" use:staggerReveal>
      {#each highlights as item (item.title)}
        <GlassCard class="highlight-card" padding="lg" halo>
          <div class="highlight-icon">
            <Icon name={item.icon} size={28} />
          </div>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="offerings" aria-labelledby="offerings-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">What we offer</span>
      <h2 id="offerings-heading">Services, platforms, and programmes in one rhythm</h2>
      <p>
        Choose the path that fits your journey. We keep transitions effortless—partnerships often blend consulting, products, and outreach to meet evolving goals.
      </p>
    </header>

    <div class="offerings__grid" use:staggerReveal>
      {#each offerings as item (item.id)}
        <GlassCard class="offering-card" padding="lg" id={item.id}>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <ul>
            {#each item.bullets as bullet (bullet)}
              <li>{bullet}</li>
            {/each}
          </ul>
          <div class="card-actions">
            <Button href={item.primary.href} variant="gradient" size="md">{item.primary.label}</Button>
            {#if item.secondary}
              <Button href={item.secondary.href} variant="secondary" size="md">{item.secondary.label}</Button>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="resources" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Stay in the loop</span>
      <h2>{resourceSpotlight.title}</h2>
      <p>{resourceSpotlight.description}</p>
    </header>

    <div class="resources__grid" use:staggerReveal>
      {#each resourceSpotlight.items as item (item.title)}
        <GlassCard class="resource-card" padding="lg" halo>
          <span class="resource-eyebrow">{item.eyebrow}</span>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
          <div class="card-actions">
            <Button href={item.cta.href} variant="secondary" size="md">{item.cta.label}</Button>
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="finale" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg">
      <span class="section-eyebrow">Let’s collaborate</span>
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
    max-width: 72ch;
    margin: 0 auto clamp(2rem, 6vw, 3rem);
    text-align: center;
    display: grid;
    gap: 0.8rem;
  }

  .section-eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.9rem;
    border-radius: 999px;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-2) 88%, rgba(var(--aurora-purple-rgb), 0.18) 12%);
    color: color-mix(in srgb, var(--aurora-purple) 72%, var(--text-secondary) 28%);
  }

  .highlights,
  .offerings,
  .resources,
  .finale {
    padding: clamp(3.5rem, 8vw, 6rem) 0;
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
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--voyage-blue-rgb), 0.18) 18%);
    color: var(--voyage-blue);
  }

  :global(.offering-card) ul,
  :global(.resource-card) ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.4rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
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

  :global(.finale-card) {
    text-align: center;
  }

  @media (min-width: 900px) {
    .highlights__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .offerings__grid,
    .resources__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .highlights,
    .offerings,
    .resources,
    .finale {
      animation: none;
    }
  }
</style>




