<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import FoundersSection from '$sections/FoundersSection.svelte';
  import PartnersSection from '$sections/PartnersSection.svelte';
  import CallToActionSection from '$sections/CallToActionSection.svelte';
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

  const milestoneStatusPriority: Record<string, number> = {
    active: 0,
    development: 1,
    planned: 2,
    vision: 3,
    completed: 4
  };
  const upcomingPriorityLimit = milestoneStatusPriority.planned ?? 2;
  let milestoneCandidates: TimelineMilestone[] = [];
  let timelineHighlights: TimelineMilestone[] = [];
  let selectedMilestoneIndex = 0;
  let milestoneProgressTotal = 0;
  let milestoneProgressCurrent = 0;
  let milestoneProgressDisplay = '';
  let milestoneProgressAriaLabel = '';
  let canNavigateMilestones = false;
  let previousMilestoneLabel = 'Previous milestone';
  let nextMilestoneLabel = 'Next milestone';

  const ensureLabelValue = (value: string, key: string, fallback: string) =>
    value && value !== key ? value : fallback;

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
  const fallbackHeroPillarsTitle = ensureString(en.hero?.pillars_title, 'How we sustain calm momentum');
  const fallbackHeroActionsLabel = ensureString(en.hero?.actions_label, 'Primary hero actions');

  const heroSignalKeyMap = [
    { id: 'studio_phase', valueKey: 'studio_phase_value' },
    { id: 'focus_tracks', valueKey: 'focus_tracks_value' },
    { id: 'research', valueKey: 'research_value' }
  ] as const;

  const fallbackHeroSignals = heroSignalKeyMap.reduce(
    (acc, { id, valueKey }) => {
      const signals = (en.hero?.signals ?? {}) as Record<string, unknown>;
      acc[id] = {
        label: ensureString(signals[id], ''),
        value: ensureString(signals[valueKey], '')
      };
      return acc;
    },
    {} as Record<string, { label: string; value: string }>
  );

  const fallbackHeroPillars = Array.isArray(en.hero?.pillars)
    ? en.hero.pillars.map((pillar) => ensureString(pillar, '')).filter(Boolean)
    : [];

  const fallbackTimelinePreviewLabel = ensureString(en.timeline?.preview_label, 'Roadmap preview');
  const fallbackTimelineUpcomingBadge = ensureString(en.timeline?.upcoming_badge, 'Upcoming');
  const fallbackMilestoneLiveLabel = ensureString(
    en.timeline?.milestone_live_label,
    'Now viewing {title}{progress}'
  );
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
  let heroPillarsTitle = fallbackHeroPillarsTitle;
  let heroPillars: string[] = fallbackHeroPillars;
  let heroSignals: Array<{ id: string; label: string; value: string }> = heroSignalKeyMap
    .map(({ id }) => ({ id, ...fallbackHeroSignals[id] }))
    .filter((entry) => entry.label || entry.value);
  let milestoneNavGroupLabel = heroMilestoneHeading;
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
  let upcomingMilestonePhaseLabel = '';
  let upcomingMilestoneStatusLabel = '';
  let upcomingMilestoneCategoryLabel = '';
  let timelinePreviewLabel = fallbackTimelinePreviewLabel;
  let timelineUpcomingBadgeLabel = fallbackTimelineUpcomingBadge;
  let milestoneLiveAnnouncement = '';

  const toReadableLabel = (value: string): string =>
    value
      ? value
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (match) => match.toUpperCase())
          .trim()
      : '';

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
  $: heroActionsLabel = ensureString($_('hero.actions_label'), fallbackHeroActionsLabel);
  $: heroMilestoneHeading = ensureString($_('hero.next_milestone'), fallbackHeroMilestoneHeading);
  $: heroMilestoneCta = ensureString($_('hero.milestone_cta'), fallbackHeroMilestoneCta);
  $: milestoneNavGroupLabel =
    heroMilestoneHeading || ensureLabelValue($_('timeline.title'), 'timeline.title', 'Milestones');
  $: heroPillarsTitle = ensureString($_('hero.pillars_title'), fallbackHeroPillarsTitle);
  $: heroPillars = fallbackHeroPillars
    .map((fallbackValue, index) => ensureString($_(`hero.pillars.${index}`), fallbackValue))
    .filter(Boolean);
  $: heroSignals = heroSignalKeyMap
    .map(({ id, valueKey }) => {
      const fallback = fallbackHeroSignals[id] ?? { label: '', value: '' };
      return {
        id,
        label: ensureString($_(`hero.signals.${id}`), fallback.label),
        value: ensureString($_(`hero.signals.${valueKey}`), fallback.value)
      };
    })
    .filter((entry) => entry.label || entry.value);

  $: milestoneCandidates = (() => {
    const prioritized = sortedMilestones
      .slice()
      .sort((a, b) => {
        const priorityDiff =
          (milestoneStatusPriority[a.status] ?? Number.POSITIVE_INFINITY) -
          (milestoneStatusPriority[b.status] ?? Number.POSITIVE_INFINITY);
        if (priorityDiff !== 0) return priorityDiff;
        return parseMilestoneDate(a.date).getTime() - parseMilestoneDate(b.date).getTime();
      });

    const filtered = prioritized.filter(
      (milestone) =>
        (milestoneStatusPriority[milestone.status] ?? Number.POSITIVE_INFINITY) <= upcomingPriorityLimit
    );

    return filtered.length ? filtered : prioritized;
  })();

  $: timelineHighlights = milestoneCandidates.slice(0, 3);

  $: {
    const total = milestoneCandidates.length;
    if (total === 0) {
      selectedMilestoneIndex = 0;
    } else if (selectedMilestoneIndex >= total) {
      selectedMilestoneIndex = total - 1;
    }
  }

  $: upcomingMilestone = milestoneCandidates.length
    ? milestoneCandidates[Math.min(selectedMilestoneIndex, milestoneCandidates.length - 1)]
    : sortedMilestones[0] ?? null;

  $: milestoneProgressTotal = milestoneCandidates.length;
  $: milestoneProgressCurrent = upcomingMilestone && milestoneProgressTotal ? selectedMilestoneIndex + 1 : 0;
  $: milestoneProgressDisplay =
    milestoneProgressTotal > 1 && milestoneProgressCurrent > 0
      ? `${milestoneProgressCurrent}/${milestoneProgressTotal}`
      : '';
  $: canNavigateMilestones = milestoneProgressTotal > 1;
  $: milestoneProgressAriaLabel = canNavigateMilestones && milestoneProgressCurrent > 0
    ? ensureLabelValue(
        $_('timeline.progress_label', {
          values: { current: milestoneProgressCurrent, total: milestoneProgressTotal }
        }),
        'timeline.progress_label',
        `Milestone ${milestoneProgressCurrent} of ${milestoneProgressTotal}`
      )
    : '';
  $: previousMilestoneLabel = ensureLabelValue(
    $_('timeline.nav_previous'),
    'timeline.nav_previous',
    'Previous milestone'
  );
  $: nextMilestoneLabel = ensureLabelValue($_('timeline.nav_next'), 'timeline.nav_next', 'Next milestone');

  const showNextMilestone = () => {
    if (!milestoneCandidates.length) return;
    selectedMilestoneIndex = (selectedMilestoneIndex + 1) % milestoneCandidates.length;
  };

  const showPreviousMilestone = () => {
    if (!milestoneCandidates.length) return;
    selectedMilestoneIndex =
      (selectedMilestoneIndex - 1 + milestoneCandidates.length) % milestoneCandidates.length;
  };

  const handleMilestoneKeydown = (event: KeyboardEvent) => {
    if (!canNavigateMilestones) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        showNextMilestone();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        showPreviousMilestone();
        break;
      case 'Home':
        event.preventDefault();
        selectedMilestoneIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        if (milestoneCandidates.length) {
          selectedMilestoneIndex = milestoneCandidates.length - 1;
        }
        break;
    }
  };

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
  $: upcomingMilestonePhaseLabel = upcomingMilestone ? toReadableLabel(upcomingMilestone.phase) : '';
  $: upcomingMilestoneStatusLabel = upcomingMilestone ? toReadableLabel(upcomingMilestone.status) : '';
  $: upcomingMilestoneCategoryLabel = upcomingMilestone ? toReadableLabel(upcomingMilestone.category) : '';
  $: timelinePreviewLabel = ensureString($_('timeline.preview_label'), fallbackTimelinePreviewLabel);
  $: timelineUpcomingBadgeLabel = ensureString(
    $_('timeline.upcoming_badge'),
    fallbackTimelineUpcomingBadge
  );
  $: milestoneLiveAnnouncement = upcomingMilestoneTitle
    ? ensureLabelValue(
        $_('timeline.milestone_live_label', {
          values: {
            title: upcomingMilestoneTitle,
            progress:
              milestoneProgressTotal > 1 && milestoneProgressCurrent > 0
                ? ` (${milestoneProgressCurrent}/${milestoneProgressTotal})`
                : ''
          }
        }),
        'timeline.milestone_live_label',
        fallbackMilestoneLiveLabel
          .replace('{title}', upcomingMilestoneTitle)
          .replace(
            '{progress}',
            milestoneProgressTotal > 1 && milestoneProgressCurrent > 0
              ? ` (${milestoneProgressCurrent}/${milestoneProgressTotal})`
              : ''
          )
      )
    : '';
</script>

<section class="hero-section">
  <Hero variant="aurora" title={heroTitle} subtitle={heroSubtitle}>
    <div class="home-hero">
      <div class="home-hero__column home-hero__column--main">
        {#if heroStatus}
          <p class="home-hero__status surface-chip" data-tone="accent">{heroStatus}</p>
        {/if}

        {#if heroDescription}
          <p class="home-hero__description">{heroDescription}</p>
        {/if}

        <div class="home-hero__actions" role="group" aria-label={heroActionsLabel}>
          <a class="home-hero__action btn btn-gradient btn-lg" href="#products">
            <span>{heroPrimaryActionLabel}</span>
          </a>
          <a class="home-hero__action btn btn-secondary btn-lg" href="/consulting">
            <span>{heroSecondaryActionLabel}</span>
          </a>
        </div>

        {#if heroPillars.length}
          <div class="home-hero__pillars glass-card" aria-labelledby="home-hero-pillars-heading">
            <p id="home-hero-pillars-heading" class="home-hero__pillars-heading">{heroPillarsTitle}</p>
            <ul class="home-hero__pillars-list">
              {#each heroPillars as pillar}
                <li class="home-hero__pillars-item">
                  <span>{pillar}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

      <div class="home-hero__column home-hero__column--aside">
        {#if upcomingMilestone && (upcomingMilestoneTitle || upcomingMilestoneDescription || upcomingMilestoneNote)}
          <article class="home-hero__milestone glass-card" data-variant="grid">
            <span class="sr-only" aria-live="polite">{milestoneLiveAnnouncement}</span>
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

            {#if upcomingMilestoneStatusLabel || upcomingMilestonePhaseLabel || upcomingMilestoneCategoryLabel}
              <div class="home-hero__milestone-tags">
                {#if upcomingMilestoneStatusLabel}
                  <span class="home-hero__milestone-tag surface-chip">{upcomingMilestoneStatusLabel}</span>
                {/if}
                {#if upcomingMilestonePhaseLabel}
                  <span class="home-hero__milestone-tag surface-chip">{upcomingMilestonePhaseLabel}</span>
                {/if}
                {#if upcomingMilestoneCategoryLabel}
                  <span class="home-hero__milestone-tag surface-chip">{upcomingMilestoneCategoryLabel}</span>
                {/if}
              </div>
            {/if}

            {#if upcomingMilestoneNote}
              <p class="home-hero__milestone-note">{upcomingMilestoneNote}</p>
            {/if}

            <div class="home-hero__milestone-footer">
              {#if canNavigateMilestones}
                <div class="home-hero__milestone-nav" role="group" aria-label={milestoneNavGroupLabel}>
                  <button
                    class="home-hero__milestone-nav-btn"
                    type="button"
                    on:click={showPreviousMilestone}
                    aria-label={previousMilestoneLabel}
                    on:keydown={handleMilestoneKeydown}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M12.25 4.75 7.75 10l4.5 5.25"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  {#if milestoneProgressDisplay}
                    <span
                      class="home-hero__milestone-progress"
                      aria-live="polite"
                      aria-label={milestoneProgressAriaLabel || undefined}
                    >
                      {milestoneProgressDisplay}
                    </span>
                  {/if}

                  <button
                    class="home-hero__milestone-nav-btn"
                    type="button"
                    on:click={showNextMilestone}
                    aria-label={nextMilestoneLabel}
                    on:keydown={handleMilestoneKeydown}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path
                        d="M7.75 4.75 12.25 10l-4.5 5.25"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
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
          </article>
        {/if}

        {#if heroSignals.length}
          <dl class="home-hero__signals glass-card" data-variant="line">
            {#each heroSignals as signal (signal.id)}
              <div class="home-hero__signal">
                {#if signal.label}
                  <dt>{signal.label}</dt>
                {/if}
                {#if signal.value}
                  <dd>{signal.value}</dd>
                {/if}
              </div>
            {/each}
          </dl>
        {/if}
      </div>
    </div>
  </Hero>
</section>

<section class="story section" id="story" use:revealOnScroll>
  <div class="container">
    <span id="vision" class="section-anchor" aria-hidden="true"></span>
    <div class="story-shell glass-stack" role="group" aria-labelledby="story-heading">
      <header class="story-shell__intro">
        <span class="eyebrow">{$_('story.title')}</span>
        <h2 id="story-heading">{$_('story.vision_title')}</h2>
        <p>{$_('story.vision_text')}</p>
      </header>

      <div class="story-shell__body">
        <div class="story-shell__cards">
          <MagneticTiltCard class="story-card" data-variant="grid" staggerOptions={{ stagger: 160 }}>
            <span class="kicker">{$_('story.reality_title')}</span>
            <p>{$_('story.reality_text')}</p>
          </MagneticTiltCard>

          <MagneticTiltCard class="story-card" data-variant="halo" staggerOptions={{ stagger: 160 }}>
            <span class="kicker">{$_('story.mission_title')}</span>
            <p>{$_('story.mission_text')}</p>
          </MagneticTiltCard>
        </div>

        {#if heroPillars.length}
          <div class="story-shell__pillars" aria-labelledby="story-pillars-heading">
            <p id="story-pillars-heading" class="story-shell__pillars-heading">{heroPillarsTitle}</p>
            <ul class="story-shell__pillars-list">
              {#each heroPillars as pillar}
                <li class="story-shell__pillars-item">{pillar}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<FoundersSection />

<PartnersSection />

<section class="products section" id="products" use:revealOnScroll>
  <div class="container">
    <div class="products-shell">
      <header class="products-shell__intro">
        <span class="eyebrow">{$_('products.title')}</span>
        <h2>{$_('products.subtitle')}</h2>
      </header>

      <div class="products-shell__grid">
        {#each productKeys as key}
          {#if products[key]}
            <MagneticTiltCard
              class="product-card"
              data-variant={key === 'nodevoyage' ? 'grid' : 'line'}
              staggerOptions={{ stagger: 140 }}
            >
              <div class="product-card__meta">
                <span class="kicker">{$_(`products.${key}.name`)}</span>
                <h3>{$_(`products.${key}.tagline`)}</h3>
                <div class="status-pill">
                  <span>{$_(`products.${key}.status`)}</span>
                  <span class="dot"></span>
                  <span>{$_(`products.${key}.mvp`)}</span>
                </div>
              </div>

              <div class="product-card__body">
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
  </div>
</section>

<section class="timeline section" id="timeline" use:revealOnScroll>
  <div class="container">
    <div class="timeline-shell">
      <aside class="timeline-overview">
        <span class="eyebrow">{$_('timeline.title')}</span>
        <h2>{$_('timeline.subtitle')}</h2>

        {#if upcomingMilestone && (upcomingMilestoneTitle || upcomingMilestoneDescription)}
          <div class="timeline-overview__highlight glass-stack" aria-labelledby="timeline-next-heading">
            <div class="timeline-overview__header">
              <span class="timeline-overview__date">{upcomingMilestoneDateLabel}</span>
              <span class="timeline-overview__badge">
                {upcomingMilestoneStatusLabel || timelineUpcomingBadgeLabel}
              </span>
            </div>
            <h3 id="timeline-next-heading">{upcomingMilestoneTitle}</h3>
            {#if upcomingMilestoneDescription}
              <p>{upcomingMilestoneDescription}</p>
            {/if}
            <div class="timeline-overview__meta">
              {#if upcomingMilestonePhaseLabel}
                <span>{upcomingMilestonePhaseLabel}</span>
              {/if}
              {#if upcomingMilestoneCategoryLabel}
                <span>{upcomingMilestoneCategoryLabel}</span>
              {/if}
            </div>
            {#if upcomingMilestoneNote}
              <p class="timeline-overview__note">{upcomingMilestoneNote}</p>
            {/if}
            <a class="timeline-overview__cta" href="#timeline-track">{heroMilestoneCta}</a>
          </div>
        {/if}

        {#if timelineHighlights.length > 1}
          <ul class="timeline-overview__list" aria-label={timelinePreviewLabel}>
            {#each timelineHighlights as highlight (highlight.id)}
              <li>
                <span class="timeline-overview__list-date">{formatMilestoneDate(highlight.date)}</span>
                <span class="timeline-overview__list-title">{$_(`timeline.milestones.${highlight.id}.title`)}</span>
                <span class="timeline-overview__list-status">{toReadableLabel(highlight.status)}</span>
              </li>
            {/each}
          </ul>
        {/if}
      </aside>

      <div class="timeline-track" id="timeline-track">
        {#each timelineData.milestones as milestone, index}
          <MagneticTiltCard class="timeline-card" staggerOptions={{ delay: 80 + index * 60 }}>
            <div class="timeline-card__marker" aria-hidden="true"></div>
            <div class="timeline-card__content">
              <div class="timeline-card__meta">
                <span class="timeline-card__date">
                  {new Date(`${milestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })}
                </span>
                <span class="timeline-card__status">{toReadableLabel(milestone.status)}</span>
              </div>
              <h3>{$_(`timeline.milestones.${milestone.id}.title`)}</h3>
              <p>{$_(`timeline.milestones.${milestone.id}.description`)}</p>
              {#if $_(`timeline.milestones.${milestone.id}.note`)}
                <p class="timeline-card__note">{$_(`timeline.milestones.${milestone.id}.note`)}</p>
              {/if}
            </div>
          </MagneticTiltCard>
        {/each}
      </div>
    </div>
  </div>
</section>

<CallToActionSection />

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .hero-section {
    padding-bottom: var(--space-3xl, clamp(2.4rem, 6vw, 3.6rem));
  }

  .home-hero {
    --hero-gap: clamp(1.75rem, 6vw, 2.75rem);
    margin-top: clamp(1.2rem, 2.2vw, 1.6rem);
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
    gap: var(--hero-gap);
    align-items: start;
  }

  .home-hero__column {
    display: grid;
  }

  .home-hero__column--main {
    gap: clamp(1.15rem, 3vw, 1.85rem);
  }

  .home-hero__column--aside {
    gap: clamp(1.2rem, 3vw, 2rem);
  }

  .home-hero__status {
    margin: 0;
    gap: 0.55rem;
  }

  .home-hero__status::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, var(--grad-a) 0%, transparent 70%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
  }

  .home-hero__description {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.08rem, 2.5vw, 1.32rem);
    line-height: 1.65;
    text-wrap: balance;
    max-width: 58ch;
  }

  .home-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .home-hero__action {
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .home-hero__action {
      transition: none;
    }
  }

  .home-hero__pillars {
    position: relative;
    margin-top: clamp(1.65rem, 4vw, 2.5rem);
    padding: clamp(1.2rem, 3.6vw, 1.9rem);
    border-radius: 26px;
    overflow: hidden;
  }

  .home-hero__pillars::before {
    content: '';
    position: absolute;
    inset: -25% 35% 55% -18%;
    background: radial-gradient(
      520px 420px at 18% 28%,
      color-mix(in oklab, var(--grad-b) 48%, transparent) 0%,
      transparent 65%
    );
    opacity: 0.6;
    pointer-events: none;
  }

  .home-hero__pillars-heading {
    margin: 0 0 0.85rem;
    font-size: clamp(0.78rem, 1.6vw, 0.92rem);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    color: var(--text-tertiary);
  }

  .home-hero__pillars-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: clamp(0.85rem, 2.6vw, 1.4rem);
  }

  .home-hero__pillars-item {
    position: relative;
    padding-left: 1.75rem;
    font-size: clamp(0.96rem, 2.4vw, 1.08rem);
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .home-hero__pillars-item::before {
    content: '';
    position: absolute;
    top: 0.55em;
    left: 0.3rem;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 999px;
    background: radial-gradient(circle at 35% 35%, var(--grad-a) 0%, transparent 65%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
  }

  .home-hero__milestone,
  .home-hero__signals {
    padding: clamp(1.25rem, 3.4vw, 1.8rem);
    display: grid;
    gap: clamp(0.75rem, 2.6vw, 1.1rem);
  }

  .home-hero__milestone-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .home-hero__milestone-eyebrow {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(var(--voyage-blue-rgb), 0.92);
  }

  .home-hero__milestone-date {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .home-hero__milestone h3 {
    margin: 0;
    font-size: clamp(1.4rem, 3.4vw, 2rem);
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

  .home-hero__milestone-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: 0.65rem;
  }

  .home-hero__milestone-tag {
    padding: 0.35rem 0.85rem;
    font-size: var(--text-caption);
    letter-spacing: 0.14em;
  }

  .home-hero__milestone-note {
    color: var(--voyage-blue);
    font-size: var(--text-small);
  }

  .home-hero__milestone-footer {
    margin-top: 1.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    flex-wrap: wrap;
  }

  .home-hero__milestone-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.65rem;
    border-radius: calc(var(--radius) * 0.75);
    border: 1px solid var(--surface-pill-border);
    background: var(--surface-pill-bg);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: var(--surface-glass-blur) saturate(1.05);
    -webkit-backdrop-filter: var(--surface-glass-blur) saturate(1.05);
  }

  .home-hero__milestone-nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-full);
    border: 1px solid var(--surface-chip-border);
    background: var(--surface-chip-bg);
    color: var(--text);
    transition:
      background-color 160ms var(--ease-in-out),
      border-color 160ms var(--ease-in-out),
      transform 160ms var(--ease-in-out);
  }

  .home-hero__milestone-nav-btn:hover {
    background: color-mix(in srgb, var(--surface-chip-bg) 70%, rgba(var(--voyage-blue-rgb), 0.16) 30%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 60%, rgba(var(--voyage-blue-rgb), 0.26) 40%);
  }

  .home-hero__milestone-nav-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--focus);
    transform: translateY(-1px);
  }

  .home-hero__milestone-nav-btn svg {
    width: 16px;
    height: 16px;
  }

  .home-hero__milestone-progress {
    min-width: 3ch;
    text-align: center;
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--text-tertiary);
  }

  .home-hero__milestone-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    text-decoration: none;
    margin-top: 0;
    margin-left: auto;
  }

  @media (max-width: 640px) {
    .home-hero__milestone-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .home-hero__milestone-nav {
      width: 100%;
      justify-content: space-between;
    }

    .home-hero__milestone-cta {
      width: 100%;
      justify-content: center;
      margin-left: 0;
    }
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

  .home-hero__signals {
    gap: clamp(0.9rem, 2.6vw, 1.2rem);
  }

  .home-hero__signal {
    display: grid;
    gap: 0.35rem;
  }

  .home-hero__signal dt {
    font-size: var(--text-small);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .home-hero__signal dd {
    margin: 0;
    font-size: clamp(1rem, 2.4vw, 1.18rem);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
  }

  @media (max-width: 960px) {
    .home-hero {
      grid-template-columns: minmax(0, 1fr);
    }

    .home-hero__column--aside {
      order: 2;
    }
  }

  @media (max-width: 640px) {
    .home-hero__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .home-hero__action {
      width: 100%;
    }
  }

  :global(html[data-theme='hc']) .home-hero__pillars,
  :global(html[data-theme='hc']) .home-hero__milestone,
  :global(html[data-theme='hc']) .home-hero__signals {
    background: transparent;
    border: 2px solid var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .home-hero__pillars::before {
    display: none;
  }

  :global(html[data-theme='hc']) .home-hero__pillars-item::before {
    background: currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .home-hero__milestone h3 {
    background: none;
    color: var(--text);
  }

  :global(html[data-theme='hc']) .home-hero__milestone-note {
    color: var(--text);
  }

  :global(html[data-theme='hc']) .home-hero__milestone-tag {
    background: transparent;
    color: var(--text);
    border-color: var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .home-hero__milestone-nav {
    background: transparent;
    border-color: var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .home-hero__milestone-nav-btn {
    background: transparent;
    border-color: var(--border);
    color: var(--text);
  }

  :global(html[data-theme='hc']) .home-hero__milestone-nav-btn:hover {
    background: transparent;
  }

  :global(html[data-theme='hc']) .home-hero__milestone-progress {
    color: var(--text);
  }

  .glass-stack {
    position: relative;
    border-radius: var(--radius-2xl);
    padding: clamp(1.8rem, 3.6vw, 2.8rem);
    background: var(--surface-glass-bg);
    border: 1px solid var(--surface-glass-border);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: var(--surface-glass-blur) saturate(1.08);
    -webkit-backdrop-filter: var(--surface-glass-blur) saturate(1.08);
    overflow: hidden;
  }

  .glass-stack::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--grain);
    opacity: var(--grain-opacity, 0.18);
    mix-blend-mode: var(--grain-blend-mode, soft-light);
    pointer-events: none;
  }

  :global(html[data-theme='hc']) .glass-stack {
    background: transparent;
    border: 2px solid var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .glass-stack::after { display: none; }

  .section-anchor {
    display: block;
    width: 0;
    height: 0;
  }

  .story-shell {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.6rem);
  }

  .story-shell__intro {
    display: grid;
    gap: var(--space-md);
    max-width: min(54ch, 100%);
  }

  .story-shell__intro h2 {
    margin: 0;
    background: var(--gradient-heading);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .story-shell__intro p {
    margin: 0;
    color: var(--text-secondary);
    line-height: var(--leading-relaxed, 1.65);
  }

  .story-shell__body {
    display: grid;
    gap: clamp(1.6rem, 4vw, 2.6rem);
  }

  .story-shell__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: clamp(1.4rem, 3vw, 2rem);
  }

  :global(.story-card) {
    display: grid;
    gap: var(--space-md);
    padding: clamp(1.6rem, 3.6vw, 2.2rem);
  }

  :global(.story-card) .kicker {
    font-size: var(--text-small);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    color: var(--text-tertiary);
  }

  :global(.story-card) p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  .story-shell__pillars {
    display: grid;
    gap: var(--space-sm);
  }

  .story-shell__pillars-heading {
    margin: 0;
    font-size: var(--text-small);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    font-weight: var(--weight-semibold);
  }

  .story-shell__pillars-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--space-sm);
  }

  .story-shell__pillars-item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 0.85rem 1.1rem;
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    line-height: 1.5;
    position: relative;
    border: 1px solid var(--surface-chip-border);
    background: var(--surface-chip-bg);
    box-shadow: var(--surface-chip-shadow);
    backdrop-filter: blur(18px) saturate(1.05);
    -webkit-backdrop-filter: blur(18px) saturate(1.05);
  }

  .story-shell__pillars-item::before {
    content: '';
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--grad-a), color-mix(in oklab, var(--grad-b) 85%, transparent));
    box-shadow: 0 0 0 3px color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 40%, rgba(255, 255, 255, 0.42) 60%);
  }

  :global(html[data-theme='hc']) .story-shell__pillars-item {
    background: transparent;
    border: 1px solid var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .story-shell__pillars-item::before {
    background: currentColor;
    box-shadow: none;
  }

  .products-shell {
    position: relative;
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
  }

  .products-shell::before {
    content: '';
    position: absolute;
    inset: -35% -20% 32% -20%;
    background:
      radial-gradient(520px 520px at 18% 28%, rgba(var(--voyage-blue-rgb), 0.18), transparent 70%),
      radial-gradient(620px 620px at 82% 62%, rgba(var(--aurora-purple-rgb), 0.14), transparent 75%);
    opacity: 0.65;
    pointer-events: none;
  }

  .products-shell__intro {
    position: relative;
    z-index: 1;
    display: grid;
    gap: var(--space-md);
    max-width: min(48ch, 100%);
  }

  .products-shell__intro h2 {
    margin: 0;
    background: var(--gradient-heading);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .products-shell__grid {
    position: relative;
    z-index: 1;
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.8rem);
  }

  :global(.product-card) {
    display: grid;
    gap: clamp(1.6rem, 4vw, 2.6rem);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    align-items: start;
    padding: clamp(1.8rem, 3.6vw, 2.6rem);
    border-radius: var(--radius-2xl);
  }

  :global(.product-card) .kicker {
    font-size: var(--text-small);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    font-weight: var(--weight-semibold);
  }

  .product-card__meta {
    display: grid;
    gap: var(--space-md);
  }

  .product-card__meta h3 {
    margin: 0;
    font-size: var(--text-display);
    background: var(--gradient-heading);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    line-height: 1.1;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 1.1rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--voyage-blue);
    border: 1px solid var(--surface-pill-border);
    background: var(--surface-pill-bg);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: var(--surface-glass-blur) saturate(1.05);
    -webkit-backdrop-filter: var(--surface-glass-blur) saturate(1.05);
  }

  .status-pill .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .product-card__body {
    display: grid;
    gap: var(--space-md);
  }

  .product-card__body p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    text-decoration: none;
  }

  .product-link:hover,
  .product-link:focus-visible {
    color: var(--aurora-purple);
  }

  .product-link svg { transition: transform var(--duration-ui) var(--ease-out); }

  .product-link:hover svg,
  .product-link:focus-visible svg {
    transform: translateX(4px);
  }

  :global(html[data-theme='hc'] .product-card) {
    background: transparent;
    border: 2px solid var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .status-pill {
    background: transparent;
    border-color: var(--border);
    color: var(--text);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .timeline-shell {
    display: grid;
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
    gap: clamp(2rem, 5vw, 3.4rem);
    align-items: start;
  }

  .timeline-overview {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2.2rem);
    position: sticky;
    top: clamp(4rem, 9vw, 6rem);
  }

  .timeline-overview h2 {
    margin: 0;
    background: var(--gradient-heading);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .timeline-overview__highlight {
    display: grid;
    gap: var(--space-md);
    padding: clamp(1.6rem, 3.2vw, 2.2rem);
    border-radius: var(--radius-2xl);
  }

  .timeline-overview__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .timeline-overview__date {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text-tertiary);
  }

  .timeline-overview__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    color: var(--aurora-purple);
    background: color-mix(in srgb, var(--aurora-purple) 16%, transparent);
    border: 1px solid color-mix(in srgb, var(--aurora-purple) 22%, transparent);
  }

  .timeline-overview__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    color: var(--text-tertiary);
    font-size: var(--text-small);
  }

  .timeline-overview__note {
    margin: 0;
    color: var(--voyage-blue);
    font-size: var(--text-small);
  }

  .timeline-overview__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    text-decoration: none;
  }

  .timeline-overview__cta::after {
    content: '→';
    font-size: 0.9em;
  }

  .timeline-overview__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.85rem;
  }

  .timeline-overview__list li {
    display: grid;
    gap: 0.3rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid color-mix(in srgb, var(--border) 52%, transparent);
  }

  .timeline-overview__list-date {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--text-tertiary);
  }

  .timeline-overview__list-title { font-weight: var(--weight-semibold); }

  .timeline-overview__list-status {
    font-size: var(--text-small);
    color: var(--voyage-blue);
  }

  .timeline-track {
    position: relative;
    display: grid;
    gap: clamp(1.8rem, 3.6vw, 2.6rem);
    padding-left: clamp(1.4rem, 2vw, 1.8rem);
  }

  .timeline-track::before {
    content: '';
    position: absolute;
    left: clamp(0.2rem, 0.8vw, 0.5rem);
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, rgba(var(--voyage-blue-rgb), 0.32), transparent 85%);
  }

  :global(.timeline-card) {
    position: relative;
    display: grid;
    gap: var(--space-md);
    padding: clamp(1.6rem, 3.2vw, 2.1rem);
    border-radius: var(--radius-xl);
  }

  .timeline-card__marker {
    position: absolute;
    top: 1.25rem;
    left: -2.05rem;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    box-shadow: 0 0 0 6px rgba(var(--voyage-blue-rgb), 0.1);
  }

  .timeline-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.85rem;
  }

  .timeline-card__date {
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .timeline-card__status {
    font-size: var(--text-small);
    color: var(--voyage-blue);
  }

  :global(.timeline-card) h3 {
    margin: 0;
    font-size: var(--text-title);
  }

  :global(.timeline-card) p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .timeline-card__note {
    color: var(--voyage-blue);
    font-size: var(--text-small);
  }

  :global(html[data-theme='hc'] .timeline-card) {
    background: transparent;
    border: 2px solid var(--border);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .timeline-track::before { background: currentColor; }

  :global(html[data-theme='hc']) .timeline-card__marker {
    background: currentColor;
    box-shadow: none;
  }

  @media (max-width: 1080px) {
    .home-hero {
      grid-template-columns: 1fr;
    }

    .home-hero__column--aside {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (max-width: 960px) {
    .products-shell::before { inset: -45% -35% 45% -35%; }
    :global(.product-card) {
      grid-template-columns: 1fr;
    }
    .timeline-shell {
      grid-template-columns: 1fr;
    }
    .timeline-overview {
      position: static;
    }
    .timeline-track {
      padding-left: 0;
    }
    .timeline-track::before {
      left: -999px;
    }
      :global(.timeline-card) {
        padding: clamp(1.4rem, 3vw, 1.9rem);
      }
      .timeline-card__marker {
        position: static;
        margin-bottom: 0.75rem;
      }
  }

  @media (max-width: 720px) {
    .story-shell__cards {
      grid-template-columns: 1fr;
    }
    .glass-stack {
      padding: clamp(1.6rem, 5vw, 2.2rem);
      border-radius: var(--radius-xl);
    }
    :global(.product-card) {
      padding: clamp(1.5rem, 5vw, 2rem);
      border-radius: var(--radius-xl);
    }
    :global(.timeline-card) {
      border-radius: var(--radius-lg);
    }
  }
</style>
