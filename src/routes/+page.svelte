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

<section class="highlights" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
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

<section class="offerings" aria-labelledby="offerings-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
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

<section class="resources" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
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

<section class="finale" use:revealOnScroll>
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
    max-width: 72ch;
    margin: 0 auto clamp(2rem, 6vw, 3rem);
    text-align: center;
    display: grid;
    gap: 0.8rem;
    position: relative;
    z-index: 1;
  }

  .section-heading::after {
    content: '';
    position: absolute;
    inset-inline: clamp(-2rem, -4vw, -1.2rem);
    inset-block-end: -1.5rem;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, color-mix(in srgb, var(--aurora-purple) 86%, transparent 14%), color-mix(in srgb, var(--voyage-blue) 70%, var(--signal-yellow) 30%));
    opacity: 0.55;
    pointer-events: none;
  }

  .section-eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.2rem;
    border-radius: var(--radius-full, 999px);
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--aurora-purple) 15%, var(--bg-elev-1) 85%);
    color: var(--aurora-purple);
    border: 1px solid color-mix(in srgb, var(--aurora-purple) 30%, transparent 70%);
    box-shadow: 
      0 4px 12px rgba(var(--aurora-purple-rgb), 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .highlights,
  .offerings,
  .resources,
  .finale {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }

  .highlights > .container,
  .offerings > .container,
  .resources > .container,
  .finale > .container {
    position: relative;
    z-index: 1;
  }

  .highlights::before,
  .highlights::after,
  .offerings::before,
  .offerings::after,
  .resources::before,
  .resources::after,
  .finale::before,
  .finale::after {
    content: '';
    position: absolute;
    inset: -20%;
    border-radius: clamp(36px, 7vw, 56px);
    pointer-events: none;
  }

  .highlights::before {
    background:
      radial-gradient(65% 85% at 12% 22%, rgba(var(--aurora-purple-rgb), 0.3), transparent 72%),
      radial-gradient(70% 90% at 82% 12%, rgba(var(--voyage-blue-rgb), 0.32), transparent 74%),
      linear-gradient(120deg, rgba(var(--signal-yellow-rgb), 0.22), transparent 68%);
    filter: saturate(1.05);
    opacity: 0.9;
    transform: translate3d(0, 0, 0) scale(1.05);
    animation: auroraDrift 42s ease-in-out infinite alternate;
  }

  .highlights::after {
    background-image: var(--grain, var(--grain-texture));
    background-size: 320px 320px;
    opacity: 0.08;
  }

  .offerings::before {
    background:
      conic-gradient(from 120deg, rgba(var(--aurora-purple-rgb), 0.22), rgba(var(--voyage-blue-rgb), 0.18), rgba(var(--signal-yellow-rgb), 0.18), rgba(var(--aurora-purple-rgb), 0.22));
    mask: radial-gradient(80% 80% at 50% 20%, rgba(0, 0, 0, 0.82), transparent 82%);
    opacity: 0.75;
    transform: rotate(3deg) scale(1.1);
    animation: orbitStripe 48s linear infinite;
  }

  .offerings::after {
    inset: -24%;
    border-radius: clamp(42px, 8vw, 64px);
    background: linear-gradient(180deg, rgba(var(--ink-rgb), 0.08), transparent 68%);
    opacity: 0.3;
  }

  .resources::before {
    inset: -16% -12% -28% -12%;
    border-radius: clamp(40px, 9vw, 72px);
    background:
      radial-gradient(120% 120% at 12% 18%, rgba(var(--signal-yellow-rgb), 0.24), transparent 72%),
      radial-gradient(90% 120% at 82% 6%, rgba(var(--aurora-purple-rgb), 0.28), transparent 70%),
      linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.2), transparent 62%);
    opacity: 0.88;
    animation: shimmerSweep 36s ease-in-out infinite;
  }

  .resources::after {
    inset: -18%;
    background-image: var(--grain, var(--grain-texture));
    background-size: 320px 320px;
    opacity: 0.07;
  }

  .finale::before {
    inset: -26%;
    border-radius: clamp(60px, 12vw, 88px);
    background:
      radial-gradient(90% 120% at 20% 20%, rgba(var(--aurora-purple-rgb), 0.32), transparent 72%),
      radial-gradient(120% 120% at 80% 0%, rgba(var(--signal-yellow-rgb), 0.22), transparent 70%),
      linear-gradient(160deg, rgba(var(--voyage-blue-rgb), 0.2), transparent 60%);
    opacity: 0.9;
    animation: finaleGlow 28s ease-in-out infinite alternate;
  }

  .finale::after {
    inset: -20%;
    border-radius: clamp(60px, 12vw, 88px);
    background-image: var(--grain, var(--grain-texture));
    background-size: 300px 300px;
    opacity: 0.06;
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
    background: color-mix(in srgb, var(--bg-elev-1) 65%, transparent 35%) !important;
    backdrop-filter: blur(32px) saturate(1.3) brightness(1.15) !important;
    -webkit-backdrop-filter: blur(32px) saturate(1.3) brightness(1.15) !important;
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.25) 70%, transparent 30%) !important;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
  }

  .highlight-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background:
      radial-gradient(circle at 30% 30%, rgba(var(--voyage-blue-rgb), 0.32), transparent 72%),
      color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--voyage-blue-rgb), 0.16) 18%);
    color: var(--voyage-blue);
    box-shadow: 0 10px 22px rgba(16, 41, 95, 0.22);
    animation: floaty 18s ease-in-out infinite;
  }

  .offering-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }

  .offering-icon {
    inline-size: 2.75rem;
    block-size: 2.75rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background:
      radial-gradient(circle at 30% 30%, rgba(var(--aurora-purple-rgb), 0.3), transparent 70%),
      color-mix(in srgb, var(--bg-elev-2) 80%, rgba(var(--aurora-purple-rgb), 0.18) 20%);
    color: var(--aurora-purple);
    box-shadow: 0 8px 18px rgba(58, 28, 120, 0.28);
    animation: floaty 22s ease-in-out infinite reverse;
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

  .resource-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background:
      radial-gradient(circle at 28% 28%, rgba(var(--signal-yellow-rgb), 0.32), transparent 72%),
      color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--signal-yellow-rgb), 0.18) 18%);
    color: var(--signal-yellow);
    box-shadow: 0 8px 20px rgba(148, 110, 10, 0.24);
    animation: floaty 24s ease-in-out infinite;
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
    .resources__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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

  @keyframes auroraDrift {
    from {
      transform: translate3d(-2%, -1%, 0) scale(1.05);
    }

    to {
      transform: translate3d(2%, 1%, 0) scale(1.08);
    }
  }

  @keyframes orbitStripe {
    from {
      transform: rotate(0deg) scale(1.1);
    }

    to {
      transform: rotate(360deg) scale(1.1);
    }
  }

  @keyframes shimmerSweep {
    from {
      transform: translate3d(-2%, -1%, 0) scale(1.04);
    }

    to {
      transform: translate3d(1%, 1.5%, 0) scale(1.06);
    }
  }

  @keyframes finaleGlow {
    from {
      transform: translate3d(-1%, -1.2%, 0) scale(1.03);
    }

    to {
      transform: translate3d(1.4%, 1.2%, 0) scale(1.07);
    }
  }

  @keyframes floaty {
    0% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(0, -6px, 0);
    }

    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
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




