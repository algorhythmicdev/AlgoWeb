<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import { Button, GlassCard } from '$lib/components';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import FoundersSection from '$lib/sections/FoundersSection.svelte';
  import PartnersSection from '$lib/sections/PartnersSection.svelte';
  import CallToActionSection from '$lib/sections/CallToActionSection.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import timelineData from '$data/timeline.json';
  import productsData from '$data/products.json';
  import { _ } from 'svelte-i18n';
  import en from '$lib/i18n/en.json';

  type TimelineMilestone = {
    id: string;
    date: string;
    status: string;
    phase?: string;
    category?: string;
    dateValue: Date;
  };

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const fallbackHeroTitleParts = [
    ensureString(en.home?.hero?.title?.lead, 'AlgoRhythmics'),
    ensureString(en.home?.hero?.title?.brand, ''),
    ensureString(en.home?.hero?.title?.trail, '')
  ];
  const fallbackHeroSubtitle = ensureString(
    en.home?.hero?.subtitle,
    'NodeVoyage, Ideonautix, and our consulting sprints share one calm operating rhythm.'
  );
  const fallbackHeroStatus = ensureString(
    en.home?.hero?.status,
    'Independent AI studio · Riga ↔ Rotterdam'
  );
  const fallbackHeroDescription = ensureString(
    en.home?.hero?.description,
    'We design every surface with AAA contrast, honour reduced-motion settings, and document automation decisions in plain language.'
  );
  const fallbackHeroPrimaryCta = ensureString(
    en.home?.hero?.cta_products,
    'Explore the platform lineup'
  );
  const fallbackHeroSecondaryCta = ensureString(
    en.home?.hero?.cta_consulting,
    'Schedule a consulting session'
  );
  const fallbackHeroActionsLabel = ensureString(
    en.home?.hero?.actions_label,
    'Primary hero actions'
  );
  const fallbackHeroMilestoneHeading = ensureString(
    en.home?.hero?.next_milestone,
    'Upcoming milestone'
  );
  const fallbackHeroMilestoneCta = ensureString(
    en.home?.hero?.milestone_cta,
    'See the roadmap'
  );
  const fallbackHeroPillarsTitle = ensureString(
    en.home?.hero?.pillars_title,
    'Our calm delivery rhythm'
  );
  const fallbackHeroPillars = Array.isArray(en.home?.hero?.pillars)
    ? en.home.hero.pillars.map((pillar) => ensureString(pillar)).filter(Boolean)
    : [];

  const fallbackStoryTitle = ensureString(en.home?.story?.title, 'Our story');
  const fallbackStoryVisionTitle = ensureString(en.home?.story?.vision_title, 'Our vision');
  const fallbackStoryVisionText = ensureString(
    en.home?.story?.vision_text,
    'By 2026, every AlgoRhythmics product will share one trustworthy operating rhythm so partners can switch between them without friction.'
  );
  const fallbackStoryMissionTitle = ensureString(en.home?.story?.mission_title, 'Our mission');
  const fallbackStoryMissionText = ensureString(
    en.home?.story?.mission_text,
    'Deliver approachable AI products and services that explain themselves and invite collaboration.'
  );
  const fallbackStoryRealityTitle = ensureString(en.home?.story?.reality_title, 'What we are building');
  const fallbackStoryRealityText = ensureString(
    en.home?.story?.reality_text,
    'We want AI to feel helpful, not hectic. That means clarity for travellers, founders, and anyone leaning on our tools.'
  );

  const productKeys = /** @type {const} */ (['nodevoyage', 'ideonautix']);
  const products: Record<string, any> = productsData as Record<string, any>;
  const fallbackPlatformHeader = (en.home?.platforms ?? {}) as Record<string, any>;
  const fallbackCatalog = (en.platforms?.catalog ?? {}) as Record<string, any>;

  const parseMilestoneDate = (value: string): Date => {
    const [yearString = '1970', monthString = '1'] = value.split('-');
    const year = Number(yearString);
    const month = Number(monthString) - 1;
    const parsed = new Date(Date.UTC(year, Number.isNaN(month) ? 0 : month, 1));
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const baseMilestones: TimelineMilestone[] = (Array.isArray(timelineData.milestones)
    ? timelineData.milestones
    : []
  ).map((milestone) => ({
    id: String(milestone.id ?? ''),
    date: String(milestone.date ?? ''),
    status: String(milestone.status ?? 'planned'),
    phase: typeof milestone.phase === 'string' ? milestone.phase : undefined,
    category: typeof milestone.category === 'string' ? milestone.category : undefined,
    dateValue: parseMilestoneDate(String(milestone.date ?? ''))
  }));

  const fallbackMilestones = (en.home?.timeline?.milestones ?? {}) as Record<
    string,
    { title?: string; description?: string; note?: string }
  >;

  const statusPriority: Record<string, number> = {
    active: 0,
    development: 1,
    planned: 2,
    vision: 3,
    completed: 4
  };

  const toReadableStatus = (value: string): string =>
    value
      ? value
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (match) => match.toUpperCase())
          .trim()
      : '';

  const formatMilestoneDate = (value: string): string => {
    const date = parseMilestoneDate(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(date);
  };

  let activeStatuses: string[] = [];

  $: heroTitleParts = [
    ensureString($_('home.hero.title.lead'), fallbackHeroTitleParts[0]),
    ensureString($_('home.hero.title.brand'), fallbackHeroTitleParts[1]),
    ensureString($_('home.hero.title.trail'), fallbackHeroTitleParts[2])
  ].filter(Boolean);
  $: heroTitle = heroTitleParts.join(' ').replace(/\s+/g, ' ').trim() || fallbackHeroTitleParts.join(' ');
  $: heroSubtitle = ensureString($_('home.hero.tagline'), fallbackHeroSubtitle);
  $: heroStatus = ensureString($_('home.hero.status'), fallbackHeroStatus);
  $: heroDescription = ensureString($_('home.hero.description'), fallbackHeroDescription);
  $: heroPrimaryActionLabel = ensureString($_('home.hero.cta_products'), fallbackHeroPrimaryCta);
  $: heroSecondaryActionLabel = ensureString($_('home.hero.cta_consulting'), fallbackHeroSecondaryCta);
  $: heroActionsLabel = ensureString($_('home.hero.actions_label'), fallbackHeroActionsLabel);
  $: heroMilestoneHeading = ensureString($_('home.hero.next_milestone'), fallbackHeroMilestoneHeading);
  $: heroMilestoneCta = ensureString($_('home.hero.milestone_cta'), fallbackHeroMilestoneCta);
  $: heroPillarsTitle = ensureString($_('home.hero.pillars_title'), fallbackHeroPillarsTitle);
  $: heroPillars = fallbackHeroPillars
    .map((fallbackValue, index) => ensureString($_(`home.hero.pillars.${index}`), fallbackValue))
    .filter(Boolean);

  $: storyTitle = ensureString($_('home.story.title'), fallbackStoryTitle);
  $: storyVisionTitle = ensureString($_('home.story.vision_title'), fallbackStoryVisionTitle);
  $: storyVisionText = ensureString($_('home.story.vision_text'), fallbackStoryVisionText);
  $: storyMissionTitle = ensureString($_('home.story.mission_title'), fallbackStoryMissionTitle);
  $: storyMissionText = ensureString($_('home.story.mission_text'), fallbackStoryMissionText);
  $: storyRealityTitle = ensureString($_('home.story.reality_title'), fallbackStoryRealityTitle);
  $: storyRealityText = ensureString($_('home.story.reality_text'), fallbackStoryRealityText);

  $: productCards = productKeys
    .map((key) => {
      const info = products?.[key] ?? {};
      const fallback = fallbackCatalog[key] ?? {};
      return {
        key,
        icon: ensureString(info.icon, ''),
        name: ensureString(
          $_(`platforms.catalog.${key}.name`),
          ensureString(fallback.name, ensureString(info.name, ''))
        ),
        tagline: ensureString(
          $_(`platforms.catalog.${key}.tagline`),
          ensureString(fallback.tagline, ensureString(info.tagline, ''))
        ),
        description: ensureString(
          $_(`platforms.catalog.${key}.description`),
          ensureString(fallback.description, ensureString(info.description, ''))
        ),
        status: ensureString(
          $_(`platforms.catalog.${key}.status`),
          ensureString(fallback.status, ensureString(info.status, ''))
        ),
        cta: ensureString(
          $_(`platforms.catalog.${key}.cta`),
          ensureString(fallback.cta, ensureString(info.cta, ''))
        )
      };
    })
    .filter((entry) => entry.name && entry.description);
  $: productsTitle = ensureString(
    $_('home.platforms.title'),
    ensureString(fallbackPlatformHeader.title, 'Platform lineup')
  );
  $: productsSubtitle = ensureString(
    $_('home.platforms.subtitle'),
    ensureString(
      fallbackPlatformHeader.subtitle,
      'NodeVoyage and Ideonautix live inside the same relaxed studio.'
    )
  );

  const fallbackTimeline = (en.home?.timeline ?? {}) as Record<string, any>;
  $: timelineHeading = ensureString(
    $_('home.timeline.title'),
    ensureString(fallbackTimeline.title, 'Our path')
  );
  $: timelineSubtitle = ensureString(
    $_('home.timeline.subtitle'),
    ensureString(fallbackTimeline.subtitle, 'Milestones that keep us moving')
  );
  $: timelineFiltersLabel = ensureString(
    $_('home.timeline.filters_label'),
    ensureString(fallbackTimeline.filters_label, 'Filter milestones by status')
  );
  $: timelineFiltersResetLabel = ensureString(
    $_('home.timeline.filters_reset'),
    ensureString(fallbackTimeline.filters_reset, 'Show all statuses')
  );
  $: timelineFiltersEmptyLabel = ensureString(
    $_('home.timeline.filters_empty'),
    ensureString(
      fallbackTimeline.filters_empty,
      'No milestones match the selected statuses yet.'
    )
  );
  $: timelineUpcomingBadge = ensureString(
    $_('home.timeline.upcoming_badge'),
    ensureString(fallbackTimeline.upcoming_badge, 'Upcoming')
  );

  $: timelineMilestones = baseMilestones
    .map((milestone) => {
      const fallback = fallbackMilestones[milestone.id] ?? {};
      const title = ensureString(
        $_(`home.timeline.milestones.${milestone.id}.title`),
        ensureString(fallback.title, '')
      );
      const description = ensureString(
        $_(`home.timeline.milestones.${milestone.id}.description`),
        ensureString(fallback.description, '')
      );
      const note = ensureString(
        $_(`home.timeline.milestones.${milestone.id}.note`),
        ensureString(fallback.note, '')
      );
      return {
        ...milestone,
        title,
        description,
        note,
        dateLabel: formatMilestoneDate(milestone.date)
      };
    })
    .sort((a, b) => a.dateValue.getTime() - b.dateValue.getTime());

  $: statusOptions = Array.from(
    new Map(
      timelineMilestones.map((milestone) => [
        milestone.status,
        {
          value: milestone.status,
          label: toReadableStatus(milestone.status),
          priority: statusPriority[milestone.status] ?? Number.POSITIVE_INFINITY
        }
      ])
    ).values()
  ).sort((a, b) => {
    const diff = a.priority - b.priority;
    if (diff !== 0) return diff;
    return a.label.localeCompare(b.label);
  });

  $: {
    if (!statusOptions.length) {
      if (activeStatuses.length) {
        activeStatuses = [];
      }
    } else if (!activeStatuses.length) {
      activeStatuses = statusOptions.map((option) => option.value);
    } else {
      const cleaned = activeStatuses.filter((status) => statusOptions.some((option) => option.value === status));
      if (!cleaned.length) {
        activeStatuses = statusOptions.map((option) => option.value);
      } else if (cleaned.length !== activeStatuses.length) {
        activeStatuses = cleaned;
      }
    }
  }

  $: filteredMilestones = timelineMilestones.filter((milestone) =>
    activeStatuses.includes(milestone.status)
  );
  $: upcomingMilestone = filteredMilestones[0] ?? timelineMilestones[0] ?? null;
  $: upcomingMilestoneTitle = upcomingMilestone?.title ?? '';
  $: upcomingMilestoneDescription = upcomingMilestone?.description ?? '';
  $: upcomingMilestoneNote = upcomingMilestone?.note ?? '';
  $: upcomingMilestoneDateLabel = upcomingMilestone ? formatMilestoneDate(upcomingMilestone.date) : '';
  $: upcomingMilestoneStatusLabel = upcomingMilestone
    ? toReadableStatus(upcomingMilestone.status)
    : '';
  $: upcomingMilestonePhaseLabel = upcomingMilestone
    ? toReadableStatus(upcomingMilestone.phase ?? '')
    : '';
  $: upcomingMilestoneCategoryLabel = upcomingMilestone
    ? toReadableStatus(upcomingMilestone.category ?? '')
    : '';

  const toggleStatus = (status: string) => {
    if (!statusOptions.length) return;
    const isActive = activeStatuses.includes(status);
    if (isActive && activeStatuses.length === 1) return;

    activeStatuses = isActive
      ? activeStatuses.filter((value) => value !== status)
      : [...activeStatuses, status];
  };

  const resetStatuses = () => {
    activeStatuses = statusOptions.map((option) => option.value);
  };
</script>

<div class="home" data-hero-tone="aurora">
  <Hero variant="aurora" title={heroTitle} subtitle={heroSubtitle}>
    <svelte:fragment slot="status">
      {#if heroStatus}
        <p class="home-hero__status surface-chip" data-tone="accent">{heroStatus}</p>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="description">
      {#if heroDescription}
        <p class="home-hero__description">{heroDescription}</p>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="actions">
      <div class="home-hero__actions" role="group" aria-label={heroActionsLabel}>
        <Button class="home-hero__action" variant="gradient" size="lg" href="#platforms">
          <span>{heroPrimaryActionLabel}</span>
        </Button>
        <Button class="home-hero__action" variant="secondary" size="lg" href="/consulting">
          <span>{heroSecondaryActionLabel}</span>
        </Button>
      </div>
    </svelte:fragment>

    <svelte:fragment slot="highlights">
      {#if heroPillars.length}
        <GlassCard class="home-hero__pillars" padding="lg">
          <h2>{heroPillarsTitle}</h2>
          <ul class="home-hero__pillars-list">
            {#each heroPillars as pillar}
              <li>{pillar}</li>
            {/each}
          </ul>
        </GlassCard>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="aside">
      {#if upcomingMilestone && (upcomingMilestoneTitle || upcomingMilestoneDescription)}
        <GlassCard class="home-hero__milestone" particles padding="lg">
          <span class="home-hero__milestone-eyebrow">{heroMilestoneHeading}</span>
          {#if upcomingMilestoneDateLabel}
            <span class="home-hero__milestone-date">{upcomingMilestoneDateLabel}</span>
          {/if}

          {#if upcomingMilestoneTitle}
            <h2>{upcomingMilestoneTitle}</h2>
          {/if}

          {#if upcomingMilestoneDescription}
            <p>{upcomingMilestoneDescription}</p>
          {/if}

          <div class="home-hero__milestone-tags">
            {#if upcomingMilestoneStatusLabel}
              <span class="surface-chip">{upcomingMilestoneStatusLabel}</span>
            {/if}
            {#if upcomingMilestonePhaseLabel}
              <span class="surface-chip" data-tone="neutral">{upcomingMilestonePhaseLabel}</span>
            {/if}
            {#if upcomingMilestoneCategoryLabel}
              <span class="surface-chip" data-tone="accent">{upcomingMilestoneCategoryLabel}</span>
            {/if}
          </div>

          {#if upcomingMilestoneNote}
            <p class="home-hero__milestone-note">{upcomingMilestoneNote}</p>
          {/if}

          <a class="home-hero__milestone-cta" href="#timeline">{heroMilestoneCta}</a>
        </GlassCard>
      {/if}
    </svelte:fragment>
  </Hero>

  <section class="story section" id="story" use:revealOnScroll>
    <div class="container story__grid">
      <div class="story__copy">
        <span class="eyebrow">{storyTitle}</span>
        <h2>{storyVisionTitle}</h2>
        <p class="story__lead">{storyVisionText}</p>

        {#if heroPillars.length}
          <ul class="story__pillars">
            {#each heroPillars as pillar}
              <li>{pillar}</li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="story__cards" use:staggerReveal={{ stagger: 160 }}>
        <GlassCard class="story-card" padding="lg">
          <span class="story-card__label">{storyRealityTitle}</span>
          <p>{storyRealityText}</p>
        </GlassCard>

        <GlassCard class="story-card" padding="lg">
          <span class="story-card__label">{storyMissionTitle}</span>
          <p>{storyMissionText}</p>
        </GlassCard>
      </div>
    </div>
  </section>

  <section class="products section" id="platforms" use:revealOnScroll>
    <div class="container">
      <header class="section-header">
        <span class="eyebrow">{$_('home.platforms.title') || productsTitle}</span>
        <h2>{productsSubtitle}</h2>
      </header>

      <div class="products__grid" use:staggerReveal={{ stagger: 140 }}>
        {#each productCards as product (product.key)}
          <GlassCard class="product-card" halo padding="lg" interactive>
            <div class="product-card__meta">
              {#if product.icon}
                <img
                  class="product-card__icon"
                  src={product.icon}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  width="56"
                  height="56"
                />
              {/if}
              <span class="product-card__status">{product.status}</span>
              <h3>{product.name}</h3>
              <p class="product-card__tagline">{product.tagline}</p>
            </div>

            <p class="product-card__description">{product.description}</p>

            <a class="product-card__cta" href={`/platforms#${product.key}`}>
              <span>{product.cta || $_('home.platforms.cta_title')}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </GlassCard>
        {/each}
      </div>
    </div>
  </section>

  <section class="timeline section" id="timeline" use:revealOnScroll>
    <div class="container timeline__layout">
      <div class="timeline__intro">
        <span class="eyebrow">{timelineHeading}</span>
        <h2>{timelineSubtitle}</h2>

        {#if upcomingMilestone && (upcomingMilestoneTitle || upcomingMilestoneDescription)}
          <GlassCard class="timeline__highlight" padding="lg">
            <div class="timeline__highlight-header">
              {#if upcomingMilestoneDateLabel}
                <span class="timeline__highlight-date">{upcomingMilestoneDateLabel}</span>
              {/if}
              <span class="timeline__highlight-badge">{timelineUpcomingBadge}</span>
            </div>

            {#if upcomingMilestoneTitle}
              <h2>{upcomingMilestoneTitle}</h2>
            {/if}

            {#if upcomingMilestoneDescription}
              <p>{upcomingMilestoneDescription}</p>
            {/if}

            <div class="timeline__highlight-tags">
              {#if upcomingMilestoneStatusLabel}
                <span class="surface-chip">{upcomingMilestoneStatusLabel}</span>
              {/if}
              {#if upcomingMilestonePhaseLabel}
                <span class="surface-chip" data-tone="neutral">{upcomingMilestonePhaseLabel}</span>
              {/if}
              {#if upcomingMilestoneCategoryLabel}
                <span class="surface-chip" data-tone="accent">{upcomingMilestoneCategoryLabel}</span>
              {/if}
            </div>

            {#if upcomingMilestoneNote}
              <p class="timeline__highlight-note">{upcomingMilestoneNote}</p>
            {/if}
          </GlassCard>
        {/if}
      </div>

      {#if statusOptions.length}
        <GlassCard class="timeline__filters" padding="md">
          <p class="timeline__filters-label">{timelineFiltersLabel}</p>
          <div class="timeline__chips">
            {#each statusOptions as option (option.value)}
              <button
                type="button"
                class={`timeline__chip${activeStatuses.includes(option.value) ? ' is-active' : ''}`}
                on:click={() => toggleStatus(option.value)}
                aria-pressed={activeStatuses.includes(option.value)}
              >
                {option.label}
              </button>
            {/each}

            <button
              type="button"
              class={`timeline__chip timeline__chip--reset${
                activeStatuses.length === statusOptions.length ? ' is-active' : ''
              }`}
              on:click={resetStatuses}
              aria-pressed={activeStatuses.length === statusOptions.length}
            >
              {timelineFiltersResetLabel}
            </button>
          </div>
        </GlassCard>
      {/if}

      {#if filteredMilestones.length}
        <div class="timeline__track">
          <div class="timeline__line" aria-hidden="true"></div>
          <ul class="timeline__list" use:staggerReveal={{ stagger: 120 }}>
            {#each filteredMilestones as milestone (milestone.id)}
              <li class="timeline__item">
                <span class="timeline__dot" data-status={milestone.status}></span>
                <GlassCard class="timeline__card" padding="md">
                  <div class="timeline__card-meta">
                    <span class="timeline__card-date">{milestone.dateLabel}</span>
                    <span class="timeline__card-status">{toReadableStatus(milestone.status)}</span>
                  </div>
                  {#if milestone.title}
                    <h3>{milestone.title}</h3>
                  {/if}
                  {#if milestone.description}
                    <p>{milestone.description}</p>
                  {/if}
                  {#if milestone.note}
                    <p class="timeline__card-note">{milestone.note}</p>
                  {/if}
                </GlassCard>
              </li>
            {/each}
          </ul>
        </div>
      {:else}
        <div class="timeline__empty">
          <GlassCard padding="md" class="timeline__empty-card">
            <p>{timelineFiltersEmptyLabel}</p>
            <Button variant="secondary" on:click={resetStatuses}>{timelineFiltersResetLabel}</Button>
          </GlassCard>
        </div>
      {/if}
    </div>
  </section>

  <SectionDivider tone="aurora" />

  <FoundersSection />

  <SectionDivider tone="neutral" />

  <PartnersSection />

  <CallToActionSection />
</div>

<style>
  .home {
    display: contents;
  }

  .home-hero__status {
    margin: 0 0 1.2rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .home-hero__description {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.08rem, 2.6vw, 1.28rem);
    line-height: 1.6;
    text-wrap: balance;
  }

  .home-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: clamp(1.6rem, 4vw, 2.4rem);
  }

  .home-hero__action {
    min-width: clamp(200px, 36vw, 240px);
  }

  :global(.home-hero__pillars) {
    margin-top: clamp(2rem, 5vw, 2.8rem);
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--voyage-blue-rgb), 0.12) 6%);
    --surface-glass-border: color-mix(in srgb, var(--border) 70%, transparent 30%);
    --surface-glass-shadow: 0 24px 50px rgba(12, 20, 36, 0.16);
  }

  :global(.home-hero__pillars) h3 {
    margin: 0 0 1.2rem;
    font-size: clamp(1.25rem, 3vw, 1.5rem);
  }

  .home-hero__pillars-list {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.8rem;
    list-style: none;
    color: var(--text-secondary);
  }

  .home-hero__pillars-list li {
    position: relative;
    padding-left: 1.4rem;
    line-height: 1.5;
  }

  .home-hero__pillars-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55rem;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, var(--voyage-blue) 0%, transparent 70%);
  }

  :global(.home-hero__milestone) {
    display: grid;
    gap: 0.75rem;
    margin-top: clamp(1.8rem, 4vw, 2.4rem);
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-2) 88%, rgba(var(--aurora-purple-rgb), 0.16) 12%);
    --surface-glass-border: color-mix(in srgb, var(--border-strong) 55%, transparent 45%);
    --surface-glass-shadow: 0 28px 60px rgba(20, 24, 44, 0.24);
  }

  :global(.home-hero__milestone) h3 {
    margin: 0;
    font-size: clamp(1.35rem, 3.4vw, 1.9rem);
    line-height: 1.2;
  }

  :global(.home-hero__milestone) p {
    margin: 0;
    color: var(--text-secondary);
  }

  .home-hero__milestone-eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .home-hero__milestone-date {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .home-hero__milestone-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .home-hero__milestone-note {
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--aurora-purple) 64%, var(--text-secondary) 36%);
  }

  .home-hero__milestone-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    text-decoration: none;
  }

  .home-hero__milestone-cta:hover,
  .home-hero__milestone-cta:focus-visible {
    text-decoration: underline;
  }

  .story {
    padding-block: clamp(4rem, 12vw, 6rem);
  }

  .story__grid {
    display: grid;
    gap: clamp(2rem, 6vw, 3rem);
    align-items: start;
  }

  @media (min-width: 900px) {
    .story__grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }

  .story__copy h2 {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 5vw, 2.8rem);
    line-height: 1.15;
  }

  .story__lead {
    margin: 0 0 1.6rem;
    color: var(--text-secondary);
    font-size: clamp(1.08rem, 2.6vw, 1.28rem);
    line-height: 1.6;
  }

  .story__pillars {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.75rem;
    color: var(--text-secondary);
  }

  .story__pillars li {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
  }

  .story__pillars li::before {
    content: '•';
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    margin-top: -0.1rem;
  }

  .story__cards {
    display: grid;
    gap: clamp(1.6rem, 4vw, 2.2rem);
  }

  :global(.story-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--signal-yellow-rgb), 0.14) 6%);
    --surface-glass-border: color-mix(in srgb, var(--border) 65%, transparent 35%);
  }

  .story-card__label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-elev-2) 90%, transparent 10%);
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.story-card) p {
    margin: 1rem 0 0;
    color: var(--text-secondary);
  }

  .products {
    padding-block: clamp(4rem, 12vw, 6rem);
  }

  .section-header {
    text-align: center;
    max-width: 720px;
    margin: 0 auto clamp(2rem, 6vw, 3rem);
  }

  .section-header h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 2.8rem);
  }

  .products__grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.4rem);
  }

  @media (min-width: 900px) {
    .products__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  :global(.product-card) {
    display: grid;
    gap: 1.4rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.16) 8%);
    --surface-glass-border: color-mix(in srgb, var(--border) 70%, transparent 30%);
    --surface-glass-shadow: 0 24px 60px rgba(12, 16, 40, 0.18);
  }

  .product-card__meta {
    display: grid;
    gap: 0.6rem;
  }

  .product-card__icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    object-fit: cover;
  }

  .product-card__status {
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.product-card) h3 {
    margin: 0;
    font-size: clamp(1.6rem, 3.4vw, 2rem);
  }

  .product-card__tagline {
    margin: 0;
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
  }

  .product-card__description {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .product-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    text-decoration: none;
  }

  .product-card__cta svg {
    transition: transform var(--duration-fast) ease;
  }

  .product-card__cta:hover svg,
  .product-card__cta:focus-visible svg {
    transform: translateX(4px);
  }

  .timeline {
    padding-block: clamp(4rem, 12vw, 6rem);
  }

  .timeline__layout {
    display: grid;
    gap: clamp(2rem, 6vw, 3rem);
  }

  .timeline__intro h2 {
    margin: 0 0 1.6rem;
    font-size: clamp(2rem, 5vw, 2.8rem);
  }

  :global(.timeline__highlight) {
    margin-top: clamp(1.8rem, 4vw, 2.4rem);
    display: grid;
    gap: 0.6rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--aurora-purple-rgb), 0.16) 6%);
    --surface-glass-border: color-mix(in srgb, var(--border) 68%, transparent 32%);
  }

  .timeline__highlight-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .timeline__highlight-badge {
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    background: color-mix(in srgb, var(--bg-elev-2) 90%, transparent 10%);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .timeline__highlight-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .timeline__highlight-note {
    margin: 0;
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--aurora-purple) 64%, var(--text-secondary) 36%);
  }

  :global(.timeline__filters) {
    display: grid;
    gap: 1rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.1) 8%);
  }

  .timeline__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .timeline__chip {
    padding: 0.45rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--border) 70%, transparent 30%);
    background: color-mix(in srgb, var(--bg-elev-2) 92%, transparent 8%);
    color: var(--text-secondary);
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all var(--duration-fast) ease;
  }

  .timeline__chip.is-active {
    background: color-mix(in srgb, var(--voyage-blue) 18%, var(--bg-elev-2) 82%);
    color: var(--text);
    box-shadow: 0 10px 28px rgba(15, 36, 84, 0.16);
  }

  .timeline__chip--reset {
    border-style: dashed;
  }

  .timeline__track {
    position: relative;
    padding-left: clamp(1.2rem, 3vw, 1.6rem);
  }

  .timeline__line {
    position: absolute;
    left: clamp(0.4rem, 1.6vw, 0.9rem);
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--voyage-blue) 60%, transparent 40%),
      color-mix(in srgb, var(--aurora-purple) 60%, transparent 40%)
    );
    opacity: 0.4;
  }

  .timeline__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.4rem);
  }

  .timeline__item {
    position: relative;
    display: grid;
    gap: 0.8rem;
  }

  .timeline__dot {
    position: absolute;
    left: calc(clamp(0.4rem, 1.6vw, 0.9rem) - 0.55rem);
    top: 1.4rem;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background: var(--voyage-blue);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--voyage-blue) 35%, transparent 65%);
  }

  .timeline__dot[data-status='vision'] {
    background: var(--signal-yellow);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--signal-yellow) 35%, transparent 65%);
  }

  .timeline__dot[data-status='planned'] {
    background: var(--aurora-purple);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--aurora-purple) 35%, transparent 65%);
  }

  .timeline__dot[data-status='development'] {
    background: var(--evergreen, #0f9b8e);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--evergreen, #0f9b8e) 35%, transparent 65%);
  }

  :global(.timeline__card) {
    margin-left: clamp(1.2rem, 3vw, 1.6rem);
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.12) 8%);
  }

  .timeline__card-meta {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    font-size: var(--text-small);
    color: var(--text-tertiary);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  :global(.timeline__card) h3 {
    margin: 0.4rem 0 0.6rem;
    font-size: clamp(1.35rem, 3vw, 1.75rem);
  }

  :global(.timeline__card) p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .timeline__card-note {
    margin-top: 0.6rem;
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--aurora-purple) 60%, var(--text-secondary) 40%);
  }

  .timeline__empty {
    display: flex;
    justify-content: center;
  }

  :global(.timeline__empty-card) {
    display: grid;
    gap: 1rem;
    text-align: center;
  }

  @media (max-width: 720px) {
    .home-hero__action {
      width: 100%;
    }

    .timeline__track {
      padding-left: 1.6rem;
    }

    .timeline__dot {
      left: 0;
    }

    .timeline__card {
      margin-left: 1.6rem;
    }
  }
</style>
