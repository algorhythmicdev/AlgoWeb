<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import FoundersSection from '$sections/FoundersSection.svelte';
  import MagneticTiltCard from '$lib/components/MagneticTiltCard.svelte';
  import { _ } from 'svelte-i18n';
  import { revealOnScroll, staggerReveal } from '$utils/animations';
  import productsData from '$data/products.json';
  import timelineData from '$data/timeline.json';
  import en from '$lib/i18n/en.json';

  type TimelineMilestone = {
    id: string;
    date: string;
    phase: string;
    status: string;
    category: string;
    icon: string;
  };

  const productKeys = ['nodevoyage', 'ideonautix'];
  const products: any = productsData;
  const timelineMilestones: TimelineMilestone[] = Array.isArray(timelineData.milestones)
    ? timelineData.milestones
    : [];

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const parseMilestoneDate = (value: string): Date => {
    const [yearString = '1970', monthString = '1'] = value.split('-');
    const year = Number(yearString);
    const month = Number(monthString) - 1;
    const parsed = new Date(Date.UTC(year, Number.isNaN(month) ? 0 : month, 1));
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const formatMilestoneDate = (value: string): string => {
    const date = parseMilestoneDate(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(date);
  };

  const sortedMilestones = timelineMilestones
    .slice()
    .sort((a, b) => parseMilestoneDate(a.date).getTime() - parseMilestoneDate(b.date).getTime());

  const fallbackHeroTitleParts = [
    ensureString(en.hero?.title?.lead, 'AlgoRhythmics'),
    ensureString(en.hero?.title?.brand, ''),
    ensureString(en.hero?.title?.trail, '')
  ];
  const fallbackHeroSubtitle = ensureString(en.hero?.tagline, 'Ideas tuned to human rhythm.');
  const fallbackHeroStatus = ensureString(en.hero?.status, 'OS-native AI studio');
  const fallbackHeroDescription = ensureString(
    en.hero?.description,
    'We choreograph AI rituals with signage discipline and AAA accessibility.'
  );
  const fallbackHeroPrimaryCta = ensureString(en.hero?.cta_products, 'Explore the constellation');
  const fallbackHeroSecondaryCta = ensureString(en.hero?.cta_consulting, 'Book a strategy huddle');
  const fallbackHeroMilestoneHeading = ensureString(en.hero?.next_milestone, 'Next waypoint');
  const fallbackHeroMilestoneCta = ensureString(en.hero?.milestone_cta, 'See the roadmap');
  const fallbackHeroActionsLabel = ensureString(en.hero?.pillars_title, 'How we sustain calm momentum');

  const fallbackMilestones: Record<string, { title?: string; description?: string; note?: string }> =
    (en.timeline?.milestones as Record<string, { title?: string; description?: string; note?: string }>) ?? {};

  let heroTitleParts: string[] = [];
  let heroTitle = fallbackHeroTitleParts.join(' ');
  let heroSubtitle = fallbackHeroSubtitle;
  let heroStatus = fallbackHeroStatus;
  let heroDescription = fallbackHeroDescription;
  let heroPrimaryActionLabel = fallbackHeroPrimaryCta;
  let heroSecondaryActionLabel = fallbackHeroSecondaryCta;
  let heroMilestoneHeading = fallbackHeroMilestoneHeading;
  let heroMilestoneCta = fallbackHeroMilestoneCta;
  let heroActionsLabel = fallbackHeroActionsLabel;
  let upcomingMilestone: TimelineMilestone | null = sortedMilestones[0] ?? null;
  let upcomingMilestoneTitle = ensureString(
    upcomingMilestone ? fallbackMilestones?.[upcomingMilestone.id]?.title : ''
  );
  let upcomingMilestoneDescription = ensureString(
    upcomingMilestone ? fallbackMilestones?.[upcomingMilestone.id]?.description : ''
  );
  let upcomingMilestoneNote = ensureString(
    upcomingMilestone ? fallbackMilestones?.[upcomingMilestone.id]?.note : ''
  );
  let upcomingMilestoneDateLabel = upcomingMilestone ? formatMilestoneDate(upcomingMilestone.date) : '';

  $: heroTitleParts = [
    ensureString($_('hero.title.lead'), fallbackHeroTitleParts[0]),
    ensureString($_('hero.title.brand'), fallbackHeroTitleParts[1]),
    ensureString($_('hero.title.trail'), fallbackHeroTitleParts[2])
  ].filter((part) => part && part.trim().length);

  $: heroTitle = heroTitleParts.join(' ').replace(/\s+/g, ' ').trim() || fallbackHeroTitleParts.join(' ');
  $: heroSubtitle = ensureString($_('hero.tagline'), fallbackHeroSubtitle);
  $: heroStatus = ensureString($_('hero.status'), fallbackHeroStatus);
  $: heroDescription = ensureString($_('hero.description'), fallbackHeroDescription);
  $: heroPrimaryActionLabel = ensureString($_('hero.cta_products'), fallbackHeroPrimaryCta);
  $: heroSecondaryActionLabel = ensureString($_('hero.cta_consulting'), fallbackHeroSecondaryCta);
  $: heroMilestoneHeading = ensureString($_('hero.next_milestone'), fallbackHeroMilestoneHeading);
  $: heroMilestoneCta = ensureString($_('hero.milestone_cta'), fallbackHeroMilestoneCta);
  $: heroActionsLabel = ensureString($_('hero.pillars_title'), fallbackHeroActionsLabel);

  $: upcomingMilestone =
    sortedMilestones.find((milestone) => milestone.status === 'active') ??
    sortedMilestones.find((milestone) => milestone.status === 'development') ??
    sortedMilestones.find((milestone) => milestone.status === 'planned') ??
    sortedMilestones[0] ??
    null;

  $: upcomingMilestoneTitle = upcomingMilestone
    ? ensureString(
        $_(`timeline.milestones.${upcomingMilestone.id}.title`),
        ensureString(fallbackMilestones?.[upcomingMilestone.id]?.title)
      )
    : '';
  $: upcomingMilestoneDescription = upcomingMilestone
    ? ensureString(
        $_(`timeline.milestones.${upcomingMilestone.id}.description`),
        ensureString(fallbackMilestones?.[upcomingMilestone.id]?.description)
      )
    : '';
  $: upcomingMilestoneNote = upcomingMilestone
    ? ensureString(
        $_(`timeline.milestones.${upcomingMilestone.id}.note`),
        ensureString(fallbackMilestones?.[upcomingMilestone.id]?.note)
      )
    : '';
  $: upcomingMilestoneDateLabel = upcomingMilestone ? formatMilestoneDate(upcomingMilestone.date) : '';
</script>

<section class="hero-section">
  <Hero variant="aurora" title={heroTitle} subtitle={heroSubtitle}>
    <div class="home-hero">
      {#if heroStatus}
        <p class="home-hero__status">{heroStatus}</p>
      {/if}

      {#if heroDescription}
        <p class="home-hero__description">{heroDescription}</p>
      {/if}

      <div class="home-hero__actions" role="group" aria-label={heroActionsLabel}>
        <a class="home-hero__action home-hero__action--primary" href="#products">
          <span>{heroPrimaryActionLabel}</span>
        </a>
        <a class="home-hero__action home-hero__action--secondary" href="/consulting">
          <span>{heroSecondaryActionLabel}</span>
        </a>
      </div>

      {#if upcomingMilestone && (upcomingMilestoneTitle || upcomingMilestoneDescription || upcomingMilestoneNote)}
        <div class="home-hero__milestone glass-card" data-variant="grid">
          <div class="home-hero__milestone-header">
            {#if heroMilestoneHeading}
              <span class="home-hero__milestone-eyebrow">{heroMilestoneHeading}</span>
            {/if}
            {#if upcomingMilestoneDateLabel}
              <span class="home-hero__milestone-date">{upcomingMilestoneDateLabel}</span>
            {/if}
          </div>

          {#if upcomingMilestoneTitle}
            <h3>{upcomingMilestoneTitle}</h3>
          {/if}

          {#if upcomingMilestoneDescription}
            <p>{upcomingMilestoneDescription}</p>
          {/if}

          {#if upcomingMilestoneNote}
            <p class="home-hero__milestone-note">{upcomingMilestoneNote}</p>
          {/if}

          <a class="home-hero__milestone-cta" href="#timeline">
            <span>{heroMilestoneCta}</span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4.75 10h10.5M10 4.75 15.25 10 10 15.25"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
        </div>
      {/if}
    </div>
  </Hero>
</section>

<section class="story section" id="story" use:revealOnScroll>
  <div class="container">
    <span id="vision" class="section-anchor" aria-hidden="true"></span>
    <div class="section-heading">
      <span class="eyebrow">{$_('story.title')}</span>
      <h2>{$_('story.vision_title')}</h2>
      <p>{$_('story.vision_text')}</p>
    </div>

    <div class="story-grid">
      <MagneticTiltCard data-variant="grid" staggerOptions={{ stagger: 160 }}>
        <span class="kicker">{$_('story.reality_title')}</span>
        <p>{$_('story.reality_text')}</p>
      </MagneticTiltCard>

      <MagneticTiltCard data-variant="halo" staggerOptions={{ stagger: 160 }}>
        <span class="kicker">{$_('story.mission_title')}</span>
        <p>{$_('story.mission_text')}</p>
      </MagneticTiltCard>
    </div>
  </div>
</section>

<FoundersSection />

<section class="products section" id="products" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('products.title')}</span>
      <h2>{$_('products.subtitle')}</h2>
    </div>

    <div class="product-list">
      {#each productKeys as key}
        {#if products[key]}
          <MagneticTiltCard class="particle-container" staggerOptions={{ stagger: 140 }}>
            <div class="product-meta">
              <span class="kicker">{$_(`products.${key}.name`)}</span>
              <h3>{$_(`products.${key}.tagline`)}</h3>
              <div class="status-pill">
                <span>{$_(`products.${key}.status`)}</span>
                <span class="dot"></span>
                <span>{$_(`products.${key}.mvp`)}</span>
              </div>
            </div>

            <div class="product-body">
              <p>{$_(`products.${key}.description`)}</p>
              <a class="product-link" href={`/products#${key}`}>
                <span>{$_(`products.${key}.cta`)}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </MagneticTiltCard>
        {/if}
      {/each}
    </div>
  </div>
</section>

<section class="timeline section" id="timeline" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('timeline.title')}</span>
      <h2>{$_('timeline.subtitle')}</h2>
    </div>

    <div class="timeline-grid">
      {#each timelineData.milestones as milestone, index}
        <MagneticTiltCard staggerOptions={{ delay: 80 + index * 60 }}>
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <span class="timeline-date">{new Date(`${milestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })}</span>
            <h3>{$_(`timeline.milestones.${milestone.id}.title`)}</h3>
            <p>{$_(`timeline.milestones.${milestone.id}.description`)}</p>
            {#if $_(`timeline.milestones.${milestone.id}.note`)}
              <p class="timeline-note">{$_(`timeline.milestones.${milestone.id}.note`)}</p>
            {/if}
          </div>
        </MagneticTiltCard>
      {/each}
    </div>
  </div>
</section>

<style>
  .hero-section {
    padding-bottom: var(--space-3xl, clamp(2.4rem, 6vw, 3.6rem));
  }

  .home-hero {
    display: grid;
    gap: clamp(1rem, 3vw, 1.8rem);
    margin-top: clamp(1.2rem, 2.6vw, 1.6rem);
    max-width: min(640px, 100%);
  }

  .home-hero__status {
    margin: 0;
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .home-hero__description {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.25rem);
    line-height: 1.6;
  }

  .home-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .home-hero__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    padding: 0.85rem 1.6rem;
    border-radius: var(--radius-full);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    transition:
      transform var(--duration-ui) var(--ease-out),
      box-shadow var(--duration-ui) var(--ease-out),
      background var(--duration-ui) var(--ease-out),
      color var(--duration-ui) var(--ease-out);
  }

  .home-hero__action--primary {
    background: var(--gradient-primary);
    color: #fff;
    box-shadow: var(--shadow-sm);
  }

  .home-hero__action--primary:hover,
  .home-hero__action--primary:focus-visible {
    transform: translateY(-2px);
  }

  .home-hero__action--secondary {
    background: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--voyage-blue-rgb), 0.16) 10%);
    color: var(--voyage-blue);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 35%, transparent);
  }

  .home-hero__action--secondary:hover,
  .home-hero__action--secondary:focus-visible {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--bg-elev-1) 80%, rgba(var(--voyage-blue-rgb), 0.22) 20%);
  }

  .home-hero__action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .home-hero__action {
      transition: none;
    }
  }

  .home-hero__milestone {
    display: grid;
    gap: clamp(0.65rem, 2vw, 1.2rem);
    padding: clamp(1.2rem, 2.6vw, 1.8rem);
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, var(--border) 65%, transparent);
    background: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.12) 12%);
    box-shadow: var(--shadow-sm);
  }

  .home-hero__milestone-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .home-hero__milestone-eyebrow {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-tertiary);
  }

  .home-hero__milestone-date {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  .home-hero__milestone h3 {
    margin: 0;
    font-size: clamp(1.35rem, 3vw, 1.9rem);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .home-hero__milestone p {
    margin: 0;
    color: var(--text-secondary);
  }

  .home-hero__milestone-note {
    color: var(--voyage-blue);
    font-size: var(--text-small);
  }

  .home-hero__milestone-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    text-decoration: none;
    margin-top: 0.35rem;
  }

  .home-hero__milestone-cta svg {
    transition: transform 180ms var(--ease-in-out);
  }

  .home-hero__milestone-cta:hover svg,
  .home-hero__milestone-cta:focus-visible svg {
    transform: translateX(4px);
  }

  .home-hero__milestone-cta:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    .home-hero {
      max-width: 100%;
    }

    .home-hero__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .home-hero__action {
      width: 100%;
    }
  }

  :global(html[data-theme='hc']) .home-hero__action--primary {
    background: var(--text);
    color: var(--bg);
  }

  :global(html[data-theme='hc']) .home-hero__milestone {
    background: var(--bg-elev-1);
    border-color: var(--border);
  }

  :global(html[data-theme='hc']) .home-hero__milestone h3 {
    background: none;
    color: var(--text);
  }

  :global(html[data-theme='hc']) .home-hero__milestone-note {
    color: var(--text);
  }

  .section-heading {
    --section-heading-gap: clamp(1.75rem, 4vw, 2.75rem);
    --section-heading-max-width: min(100%, 72ch);
    --section-heading-margin: var(--space-4xl);
  }

  .section-heading h2 {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .section-heading p { color: var(--text-secondary); }

  .story .section-heading .eyebrow {
    margin-top: var(--space-xs);
  }

  .story-grid {
    display: grid;
    gap: var(--grid-gap-xl);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    margin-top: var(--space-2xl);
  }

  .story-grid :global(.glass-card) {
    display: grid;
    gap: var(--space-lg);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    margin-bottom: var(--card-margin-bottom);
  }

  .story-grid :global(.glass-card p) { color: var(--text-secondary); }

  .section-anchor {
    display: block;
    width: 0;
    height: 0;
  }

  .product-list {
    display: grid;
    gap: var(--grid-gap-2xl);
    margin-top: var(--space-2xl);
  }

  .product-list :global(.glass-card) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: var(--space-3xl);
    padding: var(--card-padding-xl);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    margin-bottom: var(--card-margin-bottom);
  }

  .product-meta { display: grid; gap: 0.9rem; }

  .product-meta h3 {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: var(--radius-full);
    padding: 0.55rem 1.1rem;
    background: rgba(19, 81, 255, 0.08);
    background: color-mix(in srgb, var(--voyage-blue) 12%, transparent);
    border: 1px solid rgba(19, 81, 255, 0.18);
    font-size: var(--text-small);
    color: var(--voyage-blue);
  }

  .status-pill .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-flex;
  }

  .product-body { display: grid; gap: 1.2rem; }

  .product-body p { color: var(--text-secondary); }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
  }

  .product-link:hover { color: var(--aurora-purple); }

  .timeline-grid {
    position: relative;
    display: grid;
    gap: var(--space-4xl);
    padding-left: var(--space-xl);
    margin-top: var(--space-2xl);
  }

  .timeline-grid::before {
    content: '';
    position: absolute;
    left: 0.45rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, rgba(19, 81, 255, 0.32), transparent 80%);
  }

  .timeline-marker {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    margin-top: 0.4rem;
    flex-shrink: 0;
    box-shadow: 0 0 0 6px rgba(19, 81, 255, 0.08);
  }

  .timeline-grid :global(.glass-card) {
    display: flex;
    gap: clamp(1.6rem, 4vw, 2.5rem);
    background: var(--surface-glass);
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: var(--card-padding-lg);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    margin-bottom: var(--card-margin-bottom);
  }

  .timeline-grid :global(.glass-card .timeline-content) {
    display: grid;
    gap: var(--space-md);
  }

  .timeline-date {
    font-size: var(--text-small);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .timeline-content p { color: var(--text-secondary); }

  .timeline-note { color: var(--voyage-blue); font-size: var(--text-small); }

  @media (max-width: 960px) {
    .timeline-grid {
      padding-left: 0;
      gap: var(--space-2xl);
    }
    .timeline-grid::before { display: none; }
    .timeline-marker { margin-left: 6px; }
    .story-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
    .section-heading {
      --section-heading-gap: var(--space-lg);
      --section-heading-margin: var(--space-2xl);
    }
  }

  @media (max-width: 768px) {
    .story-grid :global(.glass-card) {
      padding: var(--card-padding-md);
      gap: var(--space-md);
    }
    .timeline-grid :global(.glass-card) {
      padding: var(--card-padding-md);
      gap: var(--space-sm);
    }
  }
</style>
