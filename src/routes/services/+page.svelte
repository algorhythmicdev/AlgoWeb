<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import productsData from '$data/products.json';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const hero = {
    titleKey: 'services.page.hero.title',
    titleFallback: 'Services & Solutions for Calm, Creative AI',
    subtitleKey: 'services.page.hero.subtitle',
    subtitleFallback: 'Discover how AlgoRhythmics blends consulting, flagship platforms, and education to move ideas from spark to launch.',
    descriptionKey: 'services.page.hero.description',
    descriptionFallback:
      'Whether you are integrating AI into operations, equipping classrooms, or piloting a new product, our team choreographs the rhythm from strategy to support.',
    actions: [
      {
        href: '/contact',
        variant: 'gradient' as const,
        labelKey: 'services.page.hero.primary_cta',
        labelFallback: 'Request a Demo / Consultation'
      },
      {
        href: '#platforms',
        variant: 'secondary' as const,
        labelKey: 'services.page.hero.secondary_cta',
        labelFallback: 'Explore Platforms'
      }
    ]
  } as const;

  type ServiceCard = {
    id: string;
    eyebrowKey?: string;
    eyebrowFallback?: string;
    titleKey: string;
    titleFallback: string;
    summaryKey: string;
    summaryFallback: string;
    bullets: { key: string; fallback: string }[];
    primaryCta: { href: string; labelKey: string; labelFallback: string };
    secondaryCta?: { href: string; labelKey: string; labelFallback: string };
  };

  const serviceCards: ServiceCard[] = [
    {
      id: 'consulting',
      eyebrowKey: 'services.page.consulting.cards.consulting.eyebrow',
      eyebrowFallback: 'Guided by signage discipline',
      titleKey: 'services.page.consulting.cards.consulting.title',
      titleFallback: 'AI Consulting & Integration',
      summaryKey: 'services.page.consulting.cards.consulting.summary',
      summaryFallback:
        'Leverage our founder-led consulting to map opportunities, translate them into transparent automation, and deliver AI that teams actually trust.',
      bullets: [
        {
          key: 'services.page.consulting.cards.consulting.bullets.0',
          fallback: 'Discovery workshops that decode workflows and user journeys'
        },
        {
          key: 'services.page.consulting.cards.consulting.bullets.1',
          fallback: 'Pilot sprints with explainable automation notes and opt-out paths'
        },
        {
          key: 'services.page.consulting.cards.consulting.bullets.2',
          fallback: 'Change-management playbooks and training to keep crews confident'
        }
      ],
      primaryCta: {
        href: '/contact',
        labelKey: 'services.page.consulting.cards.consulting.primary_cta',
        labelFallback: 'Contact for AI Consulting'
      }
    },
    {
      id: 'implementation',
      eyebrowKey: 'services.page.consulting.cards.implementation.eyebrow',
      eyebrowFallback: 'From pilot to steady state',
      titleKey: 'services.page.consulting.cards.implementation.title',
      titleFallback: 'Technical Implementation & Training',
      summaryKey: 'services.page.consulting.cards.implementation.summary',
      summaryFallback:
        'We stay on deck after the strategy is signed off. Our team deploys, documents, and trains your people so calm, inclusive AI becomes routine.',
      bullets: [
        {
          key: 'services.page.consulting.cards.implementation.bullets.0',
          fallback: 'Hands-on configuration across cloud, data, and governance checkpoints'
        },
        {
          key: 'services.page.consulting.cards.implementation.bullets.1',
          fallback: 'AAA-accessible documentation, onboarding guides, and office hours'
        },
        {
          key: 'services.page.consulting.cards.implementation.bullets.2',
          fallback: 'Ongoing success metrics and iteration roadmaps tuned to your rhythm'
        }
      ],
      primaryCta: {
        href: '/contact',
        labelKey: 'services.page.consulting.cards.implementation.primary_cta',
        labelFallback: 'Plan Your Rollout'
      }
    }
  ];

  const productEntries = [
    {
      id: 'ideonautix',
      eyebrowKey: 'services.page.platforms.ideonautix.eyebrow',
      eyebrowFallback: 'Creative productivity suite',
      titleKey: 'services.page.platforms.ideonautix.title',
      titleFallback: 'Ideonautix',
      summaryKey: 'services.page.platforms.ideonautix.summary',
      summaryFallback:
        'An AI partner for founders, educators, and teams who need momentum. Brainstorm, storyboard, and orchestrate projects with clarity and delight.',
      bullets: [
        {
          key: 'services.page.platforms.ideonautix.bullets.0',
          fallback: 'AI Pitch Assistant for decks, grants, and stakeholder updates'
        },
        {
          key: 'services.page.platforms.ideonautix.bullets.1',
          fallback: 'Collaborative canvases that balance focus dashboards with playful prompts'
        },
        {
          key: 'services.page.platforms.ideonautix.bullets.2',
          fallback: 'Inclusive localisation and voice options for multilingual communities'
        }
      ],
      primaryCta: {
        href: productsData?.ideonautix?.demoUrl ?? 'https://ideonautix.algorhythmics.dev/',
        labelKey: 'services.page.platforms.ideonautix.primary_cta',
        labelFallback: 'Explore Ideonautix'
      },
      secondaryCta: {
        href: '/education-hub#case-studies',
        labelKey: 'services.page.platforms.ideonautix.secondary_cta',
        labelFallback: 'View Ideonautix Highlights'
      }
    },
    {
      id: 'nodevoyage',
      eyebrowKey: 'services.page.platforms.nodevoyage.eyebrow',
      eyebrowFallback: 'AI travel companion',
      titleKey: 'services.page.platforms.nodevoyage.title',
      titleFallback: 'NodeVoyage',
      summaryKey: 'services.page.platforms.nodevoyage.summary',
      summaryFallback:
        'Plan journeys with a companion that choreographs logistics and wonder. From family trips to nomad itineraries, NodeVoyage adapts to every explorer.',
      bullets: [
        {
          key: 'services.page.platforms.nodevoyage.bullets.0',
          fallback: 'Personalised itineraries with live context, accessibility, and language options'
        },
        {
          key: 'services.page.platforms.nodevoyage.bullets.1',
          fallback: 'Route optimisation and collaborative trip workspaces for teams or classrooms'
        },
        {
          key: 'services.page.platforms.nodevoyage.bullets.2',
          fallback: 'Hospitality-ready previews for partners and agencies'
        }
      ],
      primaryCta: {
        href: productsData?.nodevoyage?.demoUrl ?? 'https://nodevoyage.algorhythmics.dev/',
        labelKey: 'services.page.platforms.nodevoyage.primary_cta',
        labelFallback: 'Discover NodeVoyage'
      },
      secondaryCta: {
        href: '/education-hub#case-studies',
        labelKey: 'services.page.platforms.nodevoyage.secondary_cta',
        labelFallback: 'See Travel Case Studies'
      }
    }
  ] as const;

  const educationCard: ServiceCard = {
    id: 'educational-partnerships',
    eyebrowKey: 'services.page.education.eyebrow',
    eyebrowFallback: 'Built with LIAA and Baltic schools',
    titleKey: 'services.page.education.title',
    titleFallback: 'Educational Programs & Partnerships',
    summaryKey: 'services.page.education.summary',
    summaryFallback:
      'Bring AI literacy into classrooms, libraries, and community hubs. We co-design workshops, curriculum modules, and mentorship sprints that welcome every learner.',
    bullets: [
      {
        key: 'services.page.education.bullets.0',
        fallback: 'Curriculum blueprints, teacher training, and ready-to-run lesson plans'
      },
      {
        key: 'services.page.education.bullets.1',
        fallback: 'Community hackathons, parent ambassador network, and internship pathways'
      },
      {
        key: 'services.page.education.bullets.2',
        fallback: 'Impact tracking dashboards tuned to student confidence and reach goals'
      }
    ],
    primaryCta: {
      href: '/educational-outreach',
      labelKey: 'services.page.education.primary_cta',
      labelFallback: 'Join the Program'
    },
    secondaryCta: {
      href: '/education-hub#toolkits',
      labelKey: 'services.page.education.secondary_cta',
      labelFallback: 'Access Educator Resources'
    }
  };

  const finale = {
    eyebrowKey: 'services.page.finale.eyebrow',
    eyebrowFallback: 'Next step',
    titleKey: 'services.page.finale.title',
    titleFallback: 'Let’s choreograph your next milestone',
    copyKey: 'services.page.finale.copy',
    copyFallback:
      'Share your roadmap, pain points, or classrooms and we will assemble the right mix of consulting, platforms, and education support. Calm, human-centred AI is a conversation away.',
    primary: {
      href: '/contact',
      labelKey: 'services.page.finale.primary_cta',
      labelFallback: 'Contact AlgoRhythmics'
    },
    secondary: {
      href: '/education-hub#case-studies',
      labelKey: 'services.page.finale.secondary_cta',
      labelFallback: 'Read Success Stories'
    }
  } as const;
</script>

<Hero
  class="hero--products"
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
        <Button href={action.href} variant={action.variant} size="lg">{t(action.labelKey, action.labelFallback)}</Button>
      {/each}
    </div>
  </svelte:fragment>
</Hero>

<div class="aurora-wrap aurora-wrap--consulting">
  <section class="services" aria-labelledby="service-heading" use:revealOnScroll>
    <div class="container">
      <header class="section-heading">
        <span class="section-eyebrow">{t('services.page.consulting.eyebrow', 'Consulting & support')}</span>
        <h2 id="service-heading">{t('services.page.consulting.title', 'Strategy that keeps pace with your team')}</h2>
        <p>
          {t(
            'services.page.consulting.copy',
            'Every engagement starts with signage-inspired clarity and ends with teams who understand their tools. These services pair calm rituals with measurable outcomes.'
          )}
        </p>
      </header>

      <div class="cards" use:staggerReveal>
        {#each serviceCards as card (card.id)}
          <GlassCard class={`service-card service-card--${card.id}`} padding="lg" halo id={card.id}>
            {#if card.eyebrowKey}
              <span class="service-eyebrow">{t(card.eyebrowKey, card.eyebrowFallback ?? '')}</span>
            {/if}
            <h3>{t(card.titleKey, card.titleFallback)}</h3>
            <p>{t(card.summaryKey, card.summaryFallback)}</p>
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
</div>

<SectionDivider tone="aurora" />

<div class="aurora-wrap aurora-wrap--platforms">
  <section class="services" aria-labelledby="platform-heading" id="platforms" use:revealOnScroll>
    <div class="container">
      <header class="section-heading">
        <span class="section-eyebrow">{t('services.page.platforms.eyebrow', 'Flagship platforms')}</span>
        <h2 id="platform-heading">{t('services.page.platforms.title', 'Products where logic dances with creativity')}</h2>
        <p>
          {t(
            'services.page.platforms.copy',
            'Our studio platforms are living proof of the methodologies we teach. They inherit the same frosted-glass calm, multilingual access, and rhythm you will feel in every engagement.'
          )}
        </p>
      </header>

      <div class="cards" use:staggerReveal>
        {#each productEntries as product (product.id)}
          <GlassCard class={`service-card service-card--${product.id}`} padding="lg" halo id={product.id}>
            {#if product.eyebrowKey}
              <span class="service-eyebrow">{t(product.eyebrowKey, product.eyebrowFallback)}</span>
            {/if}
            <h3>{t(product.titleKey, product.titleFallback)}</h3>
            <p>{t(product.summaryKey, product.summaryFallback)}</p>
            <ul>
              {#each product.bullets as bullet (bullet.key)}
                <li>{t(bullet.key, bullet.fallback)}</li>
              {/each}
            </ul>
            <div class="card-actions">
              <Button href={product.primaryCta.href} variant="gradient" size="md">{t(product.primaryCta.labelKey, product.primaryCta.labelFallback)}</Button>
              {#if product.secondaryCta}
                <Button href={product.secondaryCta.href} variant="secondary" size="md">{t(product.secondaryCta.labelKey, product.secondaryCta.labelFallback)}</Button>
              {/if}
            </div>
          </GlassCard>
        {/each}
      </div>
    </div>
  </section>
</div>

<SectionDivider tone="neutral" />

<div class="aurora-wrap aurora-wrap--education">
  <section class="services" aria-labelledby="education-heading" use:revealOnScroll>
    <div class="container">
      <GlassCard class="education-card" padding="lg" halo id={educationCard.id}>
        <span class="service-eyebrow">{t(educationCard.eyebrowKey ?? '', educationCard.eyebrowFallback ?? '')}</span>
        <div class="education-grid">
          <div>
            <h2 id="education-heading">{t(educationCard.titleKey, educationCard.titleFallback)}</h2>
            <p>{t(educationCard.summaryKey, educationCard.summaryFallback)}</p>
          </div>
          <ul>
            {#each educationCard.bullets as bullet (bullet.key)}
              <li>{t(bullet.key, bullet.fallback)}</li>
            {/each}
          </ul>
          <div class="card-actions">
            <Button href={educationCard.primaryCta.href} variant="gradient" size="md">{t(educationCard.primaryCta.labelKey, educationCard.primaryCta.labelFallback)}</Button>
            {#if educationCard.secondaryCta}
              <Button href={educationCard.secondaryCta.href} variant="secondary" size="md">{t(educationCard.secondaryCta.labelKey, educationCard.secondaryCta.labelFallback)}</Button>
            {/if}
          </div>
        </div>
      </GlassCard>
    </div>
  </section>
</div>

<div class="aurora-wrap aurora-wrap--finale">
  <section class="services finale" use:revealOnScroll>
    <div class="container">
      <GlassCard class="finale-card service-card--finale" halo padding="lg">
        <span class="service-eyebrow">{t(finale.eyebrowKey, finale.eyebrowFallback)}</span>
        <h2>{t(finale.titleKey, finale.titleFallback)}</h2>
        <p>{t(finale.copyKey, finale.copyFallback)}</p>
        <div class="card-actions">
          <Button href={finale.primary.href} variant="gradient" size="lg">{t(finale.primary.labelKey, finale.primary.labelFallback)}</Button>
          <Button href={finale.secondary.href} variant="secondary" size="lg">{t(finale.secondary.labelKey, finale.secondary.labelFallback)}</Button>
        </div>
      </GlassCard>
    </div>
  </section>
</div>

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

  .aurora-wrap {
    position: relative;
    isolation: isolate;
    padding: clamp(1.8rem, 5vw, 3rem) 0;
    overflow: hidden;
  }

  .aurora-wrap::before,
  .aurora-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: -2;
    opacity: 0.92;
  }

  .aurora-wrap::before {
    will-change: transform;
  }

  .aurora-wrap::after {
    z-index: -1;
    mix-blend-mode: screen;
    opacity: 0.7;
  }

  .aurora-wrap--consulting::before {
    background:
      radial-gradient(110% 70% at 18% 16%, rgba(var(--aurora-purple-rgb), 0.34), transparent 70%),
      radial-gradient(120% 80% at 84% 10%, rgba(var(--signal-yellow-rgb), 0.18), transparent 76%),
      linear-gradient(120deg, color-mix(in srgb, var(--bg-elev-2) 88%, rgba(var(--aurora-purple-rgb), 0.18) 12%), transparent 72%);
    animation: floatGlow 48s ease-in-out infinite alternate;
  }

  .aurora-wrap--consulting::after {
    background:
      radial-gradient(60% 40% at 20% 80%, rgba(var(--aurora-purple-rgb), 0.22), transparent 68%),
      radial-gradient(70% 50% at 82% 82%, rgba(var(--signal-yellow-rgb), 0.18), transparent 72%);
  }

  .aurora-wrap--platforms::before {
    background:
      radial-gradient(100% 75% at 18% 18%, rgba(var(--voyage-blue-rgb), 0.26), transparent 72%),
      radial-gradient(85% 70% at 82% 30%, rgba(var(--aurora-purple-rgb), 0.3), transparent 74%),
      conic-gradient(from 160deg at 52% 48%, rgba(var(--voyage-blue-rgb), 0.18), rgba(var(--aurora-purple-rgb), 0.18), transparent 65%);
    animation: floatGlow 56s ease-in-out infinite alternate;
  }

  .aurora-wrap--platforms::after {
    background:
      radial-gradient(70% 60% at 78% 88%, rgba(var(--signal-yellow-rgb), 0.16), transparent 76%),
      radial-gradient(75% 50% at 12% 86%, rgba(var(--voyage-blue-rgb), 0.2), transparent 80%);
  }

  .aurora-wrap--education::before {
    background:
      radial-gradient(120% 75% at 20% 18%, rgba(var(--aurora-purple-rgb), 0.28), transparent 76%),
      radial-gradient(100% 70% at 82% 18%, rgba(var(--signal-yellow-rgb), 0.16), transparent 78%),
      linear-gradient(140deg, color-mix(in srgb, var(--bg-elev-2) 90%, rgba(var(--aurora-purple-rgb), 0.14) 10%), transparent 70%);
    animation: floatGlow 60s ease-in-out infinite alternate;
  }

  .aurora-wrap--education::after {
    background:
      radial-gradient(70% 60% at 30% 90%, rgba(var(--aurora-purple-rgb), 0.2), transparent 76%),
      radial-gradient(70% 60% at 74% 82%, rgba(var(--signal-yellow-rgb), 0.14), transparent 78%);
  }

  .aurora-wrap--finale::before {
    background:
      radial-gradient(120% 80% at 12% 14%, rgba(var(--aurora-purple-rgb), 0.32), transparent 76%),
      radial-gradient(105% 70% at 88% 12%, rgba(var(--voyage-blue-rgb), 0.24), transparent 74%),
      linear-gradient(145deg, color-mix(in srgb, var(--bg-elev-2) 86%, rgba(var(--aurora-purple-rgb), 0.2) 14%), transparent 70%);
    animation: floatGlow 52s ease-in-out infinite alternate;
  }

  .aurora-wrap--finale::after {
    background:
      radial-gradient(65% 40% at 80% 90%, rgba(var(--signal-yellow-rgb), 0.2), transparent 78%),
      radial-gradient(60% 50% at 14% 86%, rgba(var(--aurora-purple-rgb), 0.24), transparent 80%);
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

  :global(.aurora-wrap--consulting .service-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.16) 12%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 36%, transparent 64%);
    --surface-glass-shadow: 0 20px 60px rgba(var(--aurora-purple-rgb), 0.18);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 72%, var(--signal-yellow) 28%);
  }

  :global(.aurora-wrap--platforms .service-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 86%, rgba(var(--voyage-blue-rgb), 0.2) 14%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 42%, transparent 58%);
    --surface-glass-shadow: 0 22px 65px rgba(var(--voyage-blue-rgb), 0.18);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  :global(.aurora-wrap--platforms .service-card--ideonautix) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 84%, rgba(var(--aurora-purple-rgb), 0.22) 16%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 40%, transparent 60%);
  }

  :global(.aurora-wrap--platforms .service-card--nodevoyage) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 86%, rgba(var(--voyage-blue-rgb), 0.26) 14%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 46%, transparent 54%);
  }

  :global(.aurora-wrap--education .education-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--signal-yellow-rgb), 0.16) 12%);
    --surface-glass-border: color-mix(in srgb, var(--signal-yellow) 42%, transparent 58%);
    --surface-glass-shadow: 0 18px 55px rgba(var(--signal-yellow-rgb), 0.18);
    --focus-ring-color: color-mix(in srgb, var(--signal-yellow) 68%, var(--aurora-purple) 32%);
  }

  :global(.aurora-wrap--finale .service-card--finale) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 86%, rgba(var(--aurora-purple-rgb), 0.24) 14%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 48%, transparent 52%);
    --surface-glass-shadow: 0 24px 70px rgba(var(--aurora-purple-rgb), 0.22);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 70%, var(--voyage-blue) 30%);
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
    .aurora-wrap::before,
    .aurora-wrap::after {
      animation: none !important;
      transform: none !important;
    }

    .cards,
    .services {
      animation: none;
    }
  }

  @keyframes floatGlow {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
    }

    50% {
      transform: translate3d(0, -3%, 0) scale(1.02);
    }

    100% {
      transform: translate3d(0, 3%, 0) scale(1.01);
    }
  }
</style>




