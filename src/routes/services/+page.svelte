<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import productsData from '$data/products.json';

  const heroTitle = 'Services & Solutions for Calm, Creative AI';
  const heroSubtitle =
    'Discover how AlgoRhythmics blends consulting, flagship platforms, and education to move ideas from spark to launch.';
  const heroDescription =
    'Whether you are integrating AI into operations, equipping classrooms, or piloting a new product, our team choreographs the rhythm from strategy to support.';

  const heroCtas = [
    { label: 'Request a Demo / Consultation', href: '/contact', variant: 'gradient' as const },
    { label: 'Explore Platforms', href: '#platforms', variant: 'secondary' as const }
  ];

  type ServiceCard = {
    id: string;
    eyebrow?: string;
    title: string;
    summary: string;
    bullets: string[];
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };

  const serviceCards: ServiceCard[] = [
    {
      id: 'consulting',
      eyebrow: 'Guided by signage discipline',
      title: 'AI Consulting & Integration',
      summary:
        'Leverage our founder-led consulting to map opportunities, translate them into transparent automation, and deliver AI that teams actually trust.',
      bullets: [
        'Discovery workshops that decode workflows and user journeys',
        'Pilot sprints with explainable automation notes and opt-out paths',
        'Change-management playbooks and training to keep crews confident'
      ],
      primaryCta: { label: 'Contact for AI Consulting', href: '/contact' }
    },
    {
      id: 'implementation',
      eyebrow: 'From pilot to steady state',
      title: 'Technical Implementation & Training',
      summary:
        'We stay on deck after the strategy is signed off. Our team deploys, documents, and trains your people so calm, inclusive AI becomes routine.',
      bullets: [
        'Hands-on configuration across cloud, data, and governance checkpoints',
        'AAA-accessible documentation, onboarding guides, and office hours',
        'Ongoing success metrics and iteration roadmaps tuned to your rhythm'
      ],
      primaryCta: { label: 'Plan Your Rollout', href: '/contact' }
    }
  ];

  const productEntries = [
    {
      id: 'ideonautix',
      eyebrow: 'Creative productivity suite',
      title: 'Ideonautix',
      summary:
        'An AI partner for founders, educators, and teams who need momentum. Brainstorm, storyboard, and orchestrate projects with clarity and delight.',
      bullets: [
        'AI Pitch Assistant for decks, grants, and stakeholder updates',
        'Collaborative canvases that balance focus dashboards with playful prompts',
        'Inclusive localisation and voice options for multilingual communities'
      ],
      primaryCta: {
        label: 'Explore Ideonautix',
        href: productsData?.ideonautix?.demoUrl ?? 'https://ideonautix.algorhythmics.dev/'
      },
      secondaryCta: { label: 'View Ideonautix Highlights', href: '/resources#case-studies' }
    },
    {
      id: 'nodevoyage',
      eyebrow: 'AI travel companion',
      title: 'NodeVoyage',
      summary:
        'Plan journeys with a companion that choreographs logistics and wonder. From family trips to nomad itineraries, NodeVoyage adapts to every explorer.',
      bullets: [
        'Personalised itineraries with live context, accessibility, and language options',
        'Route optimisation and collaborative trip workspaces for teams or classrooms',
        'Hospitality-ready previews for partners and agencies'
      ],
      primaryCta: {
        label: 'Discover NodeVoyage',
        href: productsData?.nodevoyage?.demoUrl ?? 'https://nodevoyage.algorhythmics.dev/'
      },
      secondaryCta: { label: 'See Travel Case Studies', href: '/resources#case-studies' }
    }
  ];

  const educationCard: ServiceCard = {
    id: 'educational-partnerships',
    eyebrow: 'Built with LIAA and Baltic schools',
    title: 'Educational Programs & Partnerships',
    summary:
      'Bring AI literacy into classrooms, libraries, and community hubs. We co-design workshops, curriculum modules, and mentorship sprints that welcome every learner.',
    bullets: [
      'Curriculum blueprints, teacher training, and ready-to-run lesson plans',
      'Community hackathons, parent ambassador network, and internship pathways',
      'Impact tracking dashboards tuned to student confidence and reach goals'
    ],
    primaryCta: { label: 'Join the Program', href: '/educational-outreach' },
    secondaryCta: { label: 'Access Educator Resources', href: '/resources#documentation' }
  };

  const finale = {
    title: 'Let’s choreograph your next milestone',
    copy:
      'Share your roadmap, pain points, or classrooms and we will assemble the right mix of consulting, platforms, and education support. Calm, human-centred AI is a conversation away.',
    primary: { label: 'Contact AlgoRhythmics', href: '/contact' },
    secondary: { label: 'Read Success Stories', href: '/resources#case-studies' }
  };
</script>

<Hero variant="grid" title={heroTitle} subtitle={heroSubtitle}>
  <svelte:fragment slot="description">
    <p class="hero-description">{heroDescription}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      {#each heroCtas as action}
        <Button href={action.href} variant={action.variant} size="lg">{action.label}</Button>
      {/each}
    </div>
  </svelte:fragment>
</Hero>

<section class="services" aria-labelledby="service-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Consulting & support</span>
      <h2 id="service-heading">Strategy that keeps pace with your team</h2>
      <p>
        Every engagement starts with signage-inspired clarity and ends with teams who understand their tools. These services pair calm rituals with measurable outcomes.
      </p>
    </header>

    <div class="cards" use:staggerReveal>
      {#each serviceCards as card (card.id)}
        <GlassCard class="service-card" padding="lg" halo id={card.id}>
          {#if card.eyebrow}
            <span class="service-eyebrow">{card.eyebrow}</span>
          {/if}
          <h3>{card.title}</h3>
          <p>{card.summary}</p>
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

<SectionDivider tone="aurora" />

<section class="services" aria-labelledby="platform-heading" id="platforms" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Flagship platforms</span>
      <h2 id="platform-heading">Products where logic dances with creativity</h2>
      <p>
        Our studio platforms are living proof of the methodologies we teach. They inherit the same frosted-glass calm, multilingual access, and rhythm you will feel in every engagement.
      </p>
    </header>

    <div class="cards" use:staggerReveal>
      {#each productEntries as product (product.id)}
        <GlassCard class="service-card" padding="lg" halo id={product.id}>
          {#if product.eyebrow}
            <span class="service-eyebrow">{product.eyebrow}</span>
          {/if}
          <h3>{product.title}</h3>
          <p>{product.summary}</p>
          <ul>
            {#each product.bullets as bullet (bullet)}
              <li>{bullet}</li>
            {/each}
          </ul>
          <div class="card-actions">
            <Button href={product.primaryCta.href} variant="gradient" size="md">{product.primaryCta.label}</Button>
            {#if product.secondaryCta}
              <Button href={product.secondaryCta.href} variant="secondary" size="md">{product.secondaryCta.label}</Button>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="services" aria-labelledby="education-heading" use:revealOnScroll>
  <div class="container">
    <GlassCard class="education-card" padding="lg" halo id={educationCard.id}>
      <span class="service-eyebrow">{educationCard.eyebrow}</span>
      <div class="education-grid">
        <div>
          <h2 id="education-heading">{educationCard.title}</h2>
          <p>{educationCard.summary}</p>
        </div>
        <ul>
          {#each educationCard.bullets as bullet (bullet)}
            <li>{bullet}</li>
          {/each}
        </ul>
        <div class="card-actions">
          <Button href={educationCard.primaryCta.href} variant="gradient" size="md">{educationCard.primaryCta.label}</Button>
          {#if educationCard.secondaryCta}
            <Button href={educationCard.secondaryCta.href} variant="secondary" size="md">{educationCard.secondaryCta.label}</Button>
          {/if}
        </div>
      </div>
    </GlassCard>
  </div>
</section>

<section class="services finale" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg">
      <span class="service-eyebrow">Next step</span>
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

  .services {
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }

  .section-heading {
    max-width: 70ch;
    margin: 0 auto clamp(2rem, 6vw, 3rem);
    text-align: center;
    display: grid;
    gap: 0.8rem;
  }

  .section-eyebrow,
  .service-eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.9rem;
    border-radius: 999px;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-2) 86%, rgba(var(--aurora-purple-rgb), 0.2) 14%);
    color: color-mix(in srgb, var(--aurora-purple) 68%, var(--text-secondary) 32%);
  }

  .cards {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.service-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  :global(.service-card) ul,
  :global(.education-card) ul {
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

  :global(.education-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  .education-grid {
    display: grid;
    gap: clamp(1rem, 3vw, 1.8rem);
  }

  .finale {
    padding-bottom: clamp(4rem, 10vw, 6.5rem);
  }

  :global(.finale-card) {
    text-align: center;
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 900px) {
    .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :global(.service-card:nth-child(odd)) {
      --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
    }

    .education-grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cards,
    .services {
      animation: none;
    }
  }
</style>




