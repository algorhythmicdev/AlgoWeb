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
  const milestoneProgressDisplayId = 'home-hero-milestone-progress';
  const fallbackMilestoneProgressLabel = 'Milestone progress';

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
  const fallbackHeroPrimaryCta = ensureString(en.hero?.cta_products, 'Explore the product lineup');
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
  const fallbackTimelineFiltersLabel = ensureString(
    en.timeline?.filters_label,
    'Filter milestones by status'
  );
  const fallbackTimelineFiltersReset = ensureString(
    en.timeline?.filters_reset,
    'Show all statuses'
  );
  const fallbackTimelineFiltersAll = ensureString(en.timeline?.filters_all, 'All statuses');
  const fallbackTimelineFiltersEmpty = ensureString(
    en.timeline?.filters_empty,
    'No milestones match the selected statuses yet.'
  );
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
  let timelineFiltersLabel = fallbackTimelineFiltersLabel;
  let timelineFiltersResetLabel = fallbackTimelineFiltersReset;
  let timelineFiltersAllLabel = fallbackTimelineFiltersAll;
  let timelineFiltersEmptyLabel = fallbackTimelineFiltersEmpty;
  let timelineFiltersSummary = '';
  let timelineStatusOptions: Array<{ value: string; label: string; priority: number }> = [];
  let activeStatusFilters: string[] = [];
  let timelineFilteredMilestones: TimelineMilestone[] = timelineData.milestones;
  let timelineOverviewHighlights: TimelineMilestone[] = [];
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

  $: timelineStatusOptions = Array.from(
    new Set(sortedMilestones.map((milestone) => milestone.status).filter(Boolean))
  )
    .map((status) => ({
      value: status,
      label: toReadableLabel(status),
      priority: milestoneStatusPriority[status] ?? Number.POSITIVE_INFINITY
    }))
    .sort((a, b) => {
      const priorityDiff = a.priority - b.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return a.label.localeCompare(b.label);
    });

  const orderStatuses = (values: string[]): string[] => {
    const unique = new Set(values.filter(Boolean));
    return timelineStatusOptions
      .filter((option) => unique.has(option.value))
      .map((option) => option.value);
  };

  $: {
    if (!timelineStatusOptions.length) {
      if (activeStatusFilters.length) {
        activeStatusFilters = [];
      }
    } else if (!activeStatusFilters.length) {
      activeStatusFilters = timelineStatusOptions.map((option) => option.value);
    } else {
      const ordered = orderStatuses(activeStatusFilters);
      if (ordered.length !== activeStatusFilters.length) {
        activeStatusFilters = ordered.length
          ? ordered
          : timelineStatusOptions.map((option) => option.value);
      } else if (ordered.some((value, index) => value !== activeStatusFilters[index])) {
        activeStatusFilters = ordered;
      }
    }
  }

  $: timelineFilteredMilestones = timelineData.milestones.filter((milestone) =>
    activeStatusFilters.includes(milestone.status)
  );

  $: timelineOverviewHighlights = (() => {
    if (!timelineHighlights.length) return [];
    const filtered = timelineHighlights.filter((milestone) =>
      activeStatusFilters.includes(milestone.status)
    );
    return filtered.length ? filtered : timelineHighlights;
  })();

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
  $: milestoneProgressRatio = canNavigateMilestones && milestoneProgressTotal > 0
    ? Math.min(1, Math.max(0, milestoneProgressCurrent / milestoneProgressTotal))
    : 0;
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

  const toggleStatusFilter = (status: string) => {
    if (!timelineStatusOptions.length) return;
    const isActive = activeStatusFilters.includes(status);
    const nextValues = isActive
      ? activeStatusFilters.filter((value) => value !== status)
      : [...activeStatusFilters, status];

    const ordered = orderStatuses(nextValues);
    activeStatusFilters = ordered.length
      ? ordered
      : timelineStatusOptions.map((option) => option.value);
  };

  const resetStatusFilters = () => {
    activeStatusFilters = timelineStatusOptions.map((option) => option.value);
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
  $: timelineFiltersLabel = ensureString($_('timeline.filters_label'), fallbackTimelineFiltersLabel);
  $: timelineFiltersResetLabel = ensureString(
    $_('timeline.filters_reset'),
    fallbackTimelineFiltersReset
  );
  $: timelineFiltersAllLabel = ensureString($_('timeline.filters_all'), fallbackTimelineFiltersAll);
  $: timelineFiltersEmptyLabel = ensureString(
    $_('timeline.filters_empty'),
    fallbackTimelineFiltersEmpty
  );
  $: timelineFiltersSummary = (() => {
    if (!timelineStatusOptions.length) return '';
    if (activeStatusFilters.length === timelineStatusOptions.length) {
      return timelineFiltersAllLabel;
    }
    return activeStatusFilters
      .map((status) => timelineStatusOptions.find((option) => option.value === status)?.label ?? '')
      .filter(Boolean)
      .join(' • ');
  })();
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

<div class="home-page" data-hero-tone="primary" data-hero-intensity="soft">
  <Hero variant="aurora" title={heroTitle} subtitle={heroSubtitle} tone="primary" intensity="soft">
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
      <a class="home-hero__action btn btn-gradient btn-lg" href="#products">
        <span>{heroPrimaryActionLabel}</span>
      </a>
      <a class="home-hero__action btn btn-secondary btn-lg" href="/consulting">
        <span>{heroSecondaryActionLabel}</span>
      </a>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="highlights">
    {#if heroPillars.length}
      <div class="home-hero__pillars os-window" aria-labelledby="home-hero-pillars-heading">
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
  </svelte:fragment>

  <svelte:fragment slot="aside">
    {#if upcomingMilestone && (upcomingMilestoneTitle || upcomingMilestoneDescription || upcomingMilestoneNote)}
      <article class="home-hero__milestone os-window" data-variant="grid">
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
            <div class="home-hero__milestone-nav surface-pill" role="group" aria-label={milestoneNavGroupLabel}>
              <button
                class="home-hero__milestone-nav-btn surface-chip"
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

              <div class="home-hero__milestone-progressgroup">
                {#if milestoneProgressDisplay}
                  <span
                    id={milestoneProgressDisplayId}
                    class="home-hero__milestone-progress"
                    aria-live="polite"
                    aria-label={milestoneProgressAriaLabel || undefined}
                  >
                    {milestoneProgressDisplay}
                  </span>
                {/if}

                <div
                  class="home-hero__milestone-progressbar"
                  role="progressbar"
                  aria-label={milestoneProgressAriaLabel || fallbackMilestoneProgressLabel}
                  aria-valuemin={1}
                  aria-valuemax={milestoneProgressTotal}
                  aria-valuenow={Math.min(Math.max(milestoneProgressCurrent, 1), milestoneProgressTotal)}
                  aria-describedby={milestoneProgressDisplay ? milestoneProgressDisplayId : undefined}
                >
                  <span
                    class="home-hero__milestone-progressbar-fill"
                    style={`--progress-ratio:${milestoneProgressRatio};`}
                  ></span>
                </div>
              </div>

              <button
                class="home-hero__milestone-nav-btn surface-chip"
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
      <dl class="home-hero__signals os-window" data-variant="line">
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
  </svelte:fragment>
  </Hero>

  <section class="story section" id="story" use:revealOnScroll>
  <div class="container">
    <span id="vision" class="section-anchor" aria-hidden="true"></span>
    <div class="story-shell os-window" role="group" aria-labelledby="story-heading">
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
          <div class="timeline-overview__highlight os-window" aria-labelledby="timeline-next-heading">
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

        {#if timelineStatusOptions.length}
          <div class="timeline-filters" role="group" aria-label={timelineFiltersLabel}>
            <div class="timeline-filters__header">
              <span class="timeline-filters__label">{timelineFiltersLabel}</span>
              {#if timelineFiltersSummary}
                <span class="timeline-filters__summary" aria-live="polite">{timelineFiltersSummary}</span>
              {/if}
            </div>
            <div class="timeline-filters__chips">
              {#each timelineStatusOptions as option (option.value)}
                <button
                  type="button"
                  class={`timeline-filters__chip surface-chip${
                    activeStatusFilters.includes(option.value) ? ' is-active' : ''
                  }`}
                  on:click={() => toggleStatusFilter(option.value)}
                  aria-pressed={activeStatusFilters.includes(option.value)}
                >
                  {option.label}
                </button>
              {/each}

              <button
                type="button"
                class={`timeline-filters__chip surface-chip timeline-filters__chip--reset${
                  activeStatusFilters.length === timelineStatusOptions.length ? ' is-active' : ''
                }`}
                on:click={resetStatusFilters}
                aria-pressed={activeStatusFilters.length === timelineStatusOptions.length}
              >
                {timelineFiltersResetLabel}
              </button>
            </div>
          </div>
        {/if}

        {#if timelineOverviewHighlights.length > 1}
          <ul class="timeline-overview__list" aria-label={timelinePreviewLabel}>
            {#each timelineOverviewHighlights as highlight (highlight.id)}
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
        {#if timelineFilteredMilestones.length}
          {#each timelineFilteredMilestones as milestone, index (milestone.id)}
            <MagneticTiltCard class="timeline-card" staggerOptions={{ delay: 80 + index * 60 }}>
              <div class="timeline-card__marker" aria-hidden="true"></div>
              <div class="timeline-card__content">
                <div class="timeline-card__meta">
                  <span class="timeline-card__date">
                    {new Date(`${milestone.date}-01`).toLocaleString(undefined, {
                      month: 'short',
                      year: 'numeric'
                    })}
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
        {:else}
          <div class="timeline-track__empty os-window" role="status">
            <p>{timelineFiltersEmptyLabel}</p>
            <button type="button" class="timeline-track__empty-reset surface-pill" on:click={resetStatusFilters}>
              {timelineFiltersResetLabel}
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
  </section>

  <CallToActionSection />

</div>

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

  .home-page {
    display: contents;
    --home-accent: color-mix(in srgb, var(--voyage-blue) 68%, var(--aurora-purple) 32%);
    --home-secondary: color-mix(in srgb, var(--aurora-purple) 58%, var(--voyage-blue) 42%);
    --home-tertiary: color-mix(in srgb, var(--signal-yellow) 56%, var(--aurora-purple) 44%);
    --home-outline: color-mix(in srgb, var(--home-secondary) 36%, transparent 64%);
    --home-shadow: color-mix(in srgb, var(--home-accent) 26%, transparent 74%);
    --home-tertiary-soft: color-mix(in srgb, var(--home-tertiary) 22%, transparent 78%);
  }

  :global(.home-page[data-hero-tone='aurora']) {
    --home-accent: color-mix(in srgb, var(--aurora-purple) 74%, var(--voyage-blue) 26%);
    --home-secondary: color-mix(in srgb, var(--voyage-blue) 60%, var(--aurora-purple) 40%);
    --home-tertiary: color-mix(in srgb, var(--signal-yellow) 52%, var(--aurora-purple) 48%);
  }

  :global(.home-page[data-hero-tone='citrus']) {
    --home-accent: color-mix(in srgb, var(--signal-yellow) 66%, var(--voyage-blue) 34%);
    --home-secondary: color-mix(in srgb, var(--voyage-blue) 54%, var(--signal-yellow) 46%);
    --home-tertiary: color-mix(in srgb, var(--aurora-purple) 58%, var(--signal-yellow) 42%);
  }

  :global(.home-page[data-hero-tone='crimson']) {
    --home-accent: color-mix(in srgb, var(--cherry-pop) 68%, var(--aurora-purple) 32%);
    --home-secondary: color-mix(in srgb, var(--aurora-purple) 62%, var(--cherry-pop) 38%);
    --home-tertiary: color-mix(in srgb, var(--signal-yellow) 54%, var(--cherry-pop) 46%);
  }

  :global(.home-page[data-hero-tone='atlantic']) {
    --home-accent: color-mix(in srgb, var(--atlantic-blue) 72%, var(--voyage-blue) 28%);
    --home-secondary: color-mix(in srgb, var(--voyage-blue) 56%, var(--atlantic-blue) 44%);
    --home-tertiary: color-mix(in srgb, var(--accent-1) 58%, var(--atlantic-blue) 42%);
  }

  :global(.home-page[data-hero-tone='evergreen']) {
    --home-accent: color-mix(in srgb, var(--evergreen) 72%, var(--voyage-blue) 28%);
    --home-secondary: color-mix(in srgb, var(--voyage-blue) 58%, var(--evergreen) 42%);
    --home-tertiary: color-mix(in srgb, var(--signal-yellow) 52%, var(--evergreen) 48%);
  }

  :global(.home-page[data-hero-intensity='balanced']) {
    --home-outline: color-mix(in srgb, var(--home-secondary) 42%, transparent 58%);
    --home-shadow: color-mix(in srgb, var(--home-accent) 32%, transparent 68%);
    --home-tertiary-soft: color-mix(in srgb, var(--home-tertiary) 26%, transparent 74%);
  }

  :global(.home-page[data-hero-intensity='bold']) {
    --home-outline: color-mix(in srgb, var(--home-secondary) 48%, transparent 52%);
    --home-shadow: color-mix(in srgb, var(--home-accent) 38%, transparent 62%);
    --home-tertiary-soft: color-mix(in srgb, var(--home-tertiary) 32%, transparent 68%);
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
    background: radial-gradient(
      circle at 30% 30%,
      color-mix(in srgb, var(--hero-accent, var(--grad-a)) 80%, transparent 20%) 0%,
      transparent 70%
    );
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--hero-secondary, var(--grad-b)) 65%, transparent 35%);
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
    --surface-glass-blur: 24px;
    --home-hero-accent: var(
      --home-accent,
      var(--hero-accent, color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%))
    );
    --home-hero-secondary: var(
      --home-secondary,
      var(--hero-secondary, color-mix(in srgb, var(--aurora-purple) 60%, var(--voyage-blue) 40%))
    );
    --surface-glass-bg: color-mix(in srgb, var(--home-hero-secondary) 24%, transparent 76%);
    --surface-glass-border: color-mix(in srgb, var(--home-hero-secondary) 58%, rgba(255, 255, 255, 0.28) 42%);
    --surface-glass-shadow: 0 24px 48px color-mix(in srgb, var(--home-hero-accent) 22%, transparent 78%);
    --grain-opacity: 0.06;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, color-mix(in srgb, var(--home-hero-secondary) 32%, transparent 68%) 4%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 66%, color-mix(in srgb, var(--home-hero-secondary) 34%, transparent 66%) 34%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 58%, color-mix(in srgb, var(--home-hero-secondary) 32%, transparent 68%) 42%);
  }

  :global([data-base-theme='dark']) .home-hero__pillars {
    --surface-glass-bg: color-mix(in srgb, var(--home-hero-secondary) 28%, transparent 72%);
    --surface-glass-border: color-mix(in srgb, var(--home-hero-secondary) 56%, rgba(255, 255, 255, 0.22) 44%);
    --surface-glass-shadow: 0 28px 54px color-mix(in srgb, var(--home-hero-accent) 30%, transparent 70%);
    --grain-opacity: 0.07;
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
    background: radial-gradient(
      circle at 35% 35%,
      color-mix(in srgb, var(--hero-secondary, var(--grad-a)) 84%, transparent 16%) 0%,
      transparent 65%
    );
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--hero-accent, var(--grad-a)) 68%, transparent 32%);
  }

  .home-hero__milestone,
  .home-hero__signals {
    padding: clamp(1.25rem, 3.4vw, 1.8rem);
    display: grid;
    gap: clamp(0.75rem, 2.6vw, 1.1rem);
    --home-hero-accent: var(
      --home-accent,
      var(--hero-accent, color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%))
    );
    --home-hero-secondary: var(
      --home-secondary,
      var(--hero-secondary, color-mix(in srgb, var(--aurora-purple) 60%, var(--voyage-blue) 40%))
    );
    --home-hero-tertiary: var(
      --home-tertiary,
      var(--hero-tertiary, color-mix(in srgb, var(--signal-yellow) 70%, var(--aurora-purple) 30%))
    );
  }

  .home-hero__milestone {
    --surface-glass-blur: 26px;
    --surface-glass-bg: color-mix(in srgb, var(--home-hero-secondary) 24%, transparent 76%);
    --surface-glass-border: color-mix(in srgb, var(--home-hero-secondary) 60%, rgba(255, 255, 255, 0.3) 40%);
    --surface-glass-shadow: 0 28px 52px color-mix(in srgb, var(--home-hero-accent) 28%, transparent 72%);
    --grain-opacity: 0.07;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 95%, color-mix(in srgb, var(--home-hero-secondary) 40%, transparent 60%) 5%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 62%, color-mix(in srgb, var(--home-hero-secondary) 40%, transparent 60%) 38%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 56%, color-mix(in srgb, var(--home-hero-secondary) 42%, transparent 58%) 44%);
    --surface-pill-bg: color-mix(in srgb, var(--home-hero-accent) 24%, transparent 76%);
    --surface-pill-border: color-mix(in srgb, var(--home-hero-accent) 60%, rgba(255, 255, 255, 0.28) 40%);
    --surface-pill-shadow: 0 22px 44px color-mix(in srgb, var(--home-hero-accent) 26%, transparent 74%);
    --surface-pill-hc-bg: color-mix(in srgb, var(--bg) 96%, color-mix(in srgb, var(--home-hero-accent) 36%, transparent 64%) 4%);
    --surface-pill-hc-border: color-mix(in srgb, var(--border-strong) 58%, color-mix(in srgb, var(--home-hero-accent) 38%, transparent 62%) 42%);
    --surface-pill-hc-shadow: none;
    --surface-chip-bg: color-mix(in srgb, color-mix(in srgb, var(--home-hero-accent) 60%, var(--home-hero-secondary) 40%) 22%, transparent 78%);
    --surface-chip-border: color-mix(in srgb, color-mix(in srgb, var(--home-hero-accent) 58%, var(--home-hero-secondary) 42%) 62%, rgba(255, 255, 255, 0.3) 38%);
    --surface-chip-shadow: 0 20px 40px color-mix(in srgb, var(--home-hero-accent) 24%, transparent 76%);
    --surface-chip-hc-bg: color-mix(in srgb, var(--bg) 96%, color-mix(in srgb, var(--home-hero-accent) 34%, transparent 66%) 4%);
    --surface-chip-hc-border: color-mix(in srgb, var(--border-strong) 60%, color-mix(in srgb, var(--home-hero-accent) 36%, transparent 64%) 40%);
    --surface-chip-hc-shadow: none;
    --surface-chip-hc-color: var(--text);
  }

  :global([data-base-theme='dark']) .home-hero__milestone {
    --surface-glass-bg: color-mix(in srgb, var(--home-hero-secondary) 28%, transparent 72%);
    --surface-glass-border: color-mix(in srgb, var(--home-hero-secondary) 56%, rgba(255, 255, 255, 0.18) 44%);
    --surface-glass-shadow: 0 32px 60px color-mix(in srgb, var(--home-hero-accent) 34%, transparent 66%);
    --surface-pill-bg: color-mix(in srgb, var(--home-hero-accent) 26%, transparent 74%);
    --surface-pill-border: color-mix(in srgb, var(--home-hero-accent) 58%, rgba(255, 255, 255, 0.2) 42%);
    --surface-pill-shadow: 0 24px 48px color-mix(in srgb, var(--home-hero-accent) 30%, transparent 70%);
    --surface-chip-bg: color-mix(in srgb, color-mix(in srgb, var(--home-hero-accent) 58%, var(--home-hero-secondary) 42%) 24%, transparent 76%);
    --surface-chip-border: color-mix(in srgb, color-mix(in srgb, var(--home-hero-accent) 56%, var(--home-hero-secondary) 44%) 58%, rgba(255, 255, 255, 0.18) 42%);
    --surface-chip-shadow: 0 22px 44px color-mix(in srgb, var(--home-hero-accent) 32%, transparent 68%);
  }

  .home-hero__signals {
    --surface-glass-blur: 24px;
    --surface-glass-bg: color-mix(in srgb, var(--home-hero-tertiary) 20%, transparent 80%);
    --surface-glass-border: color-mix(in srgb, var(--home-hero-tertiary) 58%, rgba(255, 255, 255, 0.3) 42%);
    --surface-glass-shadow: 0 24px 48px color-mix(in srgb, var(--home-hero-tertiary) 24%, transparent 76%);
    --grain-opacity: 0.06;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, color-mix(in srgb, var(--home-hero-tertiary) 32%, transparent 68%) 4%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 62%, color-mix(in srgb, var(--home-hero-tertiary) 36%, transparent 64%) 38%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 56%, color-mix(in srgb, var(--home-hero-tertiary) 32%, transparent 68%) 44%);
  }

  :global([data-base-theme='dark']) .home-hero__signals {
    --surface-glass-bg: color-mix(in srgb, var(--home-hero-tertiary) 24%, transparent 76%);
    --surface-glass-border: color-mix(in srgb, var(--home-hero-tertiary) 56%, rgba(255, 255, 255, 0.2) 44%);
    --surface-glass-shadow: 0 28px 54px color-mix(in srgb, var(--home-hero-tertiary) 28%, transparent 72%);
    --grain-opacity: 0.07;
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
    color: color-mix(in srgb, var(--home-hero-secondary) 72%, var(--text-secondary) 28%);
  }

  .home-hero__milestone-date {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .home-hero__milestone h3 {
    margin: 0;
    font-size: clamp(1.4rem, 3.4vw, 2rem);
    background: var(--hero-heading-gradient, var(--gradient-text));
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
    color: color-mix(in srgb, var(--home-hero-accent) 78%, var(--text-secondary) 22%);
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
  }

  .home-hero__milestone-progressgroup {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 72px;
  }

  .home-hero__milestone-nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-full);
    padding: 0;
    gap: 0;
    color: var(--text);
    transition:
      background-color 160ms var(--ease-in-out),
      border-color 160ms var(--ease-in-out),
      transform 160ms var(--ease-in-out);
  }

  .home-hero__milestone-nav-btn:hover {
    background: color-mix(
      in srgb,
      var(--surface-chip-bg) 68%,
      color-mix(in srgb, var(--home-hero-accent) 28%, transparent 72%) 32%
    );
    border-color: color-mix(
      in srgb,
      var(--surface-chip-border) 60%,
      color-mix(in srgb, var(--home-hero-secondary) 34%, transparent 66%) 40%
    );
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

  .home-hero__milestone-progressbar {
    position: relative;
    width: 100%;
    height: 6px;
    border-radius: 999px;
    overflow: hidden;
    background: color-mix(
      in srgb,
      color-mix(in srgb, var(--home-hero-secondary) 48%, var(--home-hero-accent) 52%) 72%,
      transparent 28%
    );
    box-shadow: inset 0 0 0 1px color-mix(
      in srgb,
      color-mix(in srgb, var(--home-hero-accent) 44%, var(--home-hero-tertiary) 56%) 86%,
      transparent 14%
    );
  }

  .home-hero__milestone-progressbar-fill {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--home-hero-accent) 82%, transparent 18%),
      color-mix(in srgb, var(--home-hero-tertiary) 78%, transparent 22%)
    );
    transform: scaleX(var(--progress-ratio, 0));
    transform-origin: left center;
    transition: transform 260ms var(--ease-in-out);
  }

  @media (prefers-reduced-motion: reduce) {
    .home-hero__milestone-progressbar-fill {
      transition: none;
    }
  }

  .home-hero__milestone-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: var(--weight-semibold);
    color: var(--home-hero-accent);
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
    color: currentColor;
  }

  .home-hero__milestone-cta:hover svg,
  .home-hero__milestone-cta:focus-visible svg {
    transform: translateX(4px);
  }

  .home-hero__milestone-cta:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--home-hero-accent) 64%, var(--home-hero-tertiary) 36%);
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

  @media (max-width: 640px) {
    .home-hero__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .home-hero__action {
      width: 100%;
    }
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

  :global(html[data-theme='hc']) .home-hero__milestone-progress {
    color: var(--text);
  }

  :global(html[data-theme='hc']) .home-hero__milestone-progressbar {
    background: color-mix(in srgb, var(--bg) 55%, var(--border-strong, var(--text)) 45%);
    box-shadow: inset 0 0 0 1px var(--border-strong, var(--text));
  }

  :global(html[data-theme='hc']) .home-hero__milestone-progressbar-fill {
    background: var(--text);
  }

  .story-shell.os-window,
  .timeline-overview__highlight.os-window {
    --grain-blend-mode: soft-light;
    --grain-opacity: 0.18;
  }

  .story-shell.os-window {
    padding: clamp(1.8rem, 3.6vw, 2.8rem);
    border-radius: var(--radius-2xl);
  }

  .timeline-overview__highlight.os-window {
    border-radius: var(--radius-2xl);
    --surface-glass-bg: color-mix(in srgb, var(--timeline-secondary) 24%, transparent 76%);
    --surface-glass-border: color-mix(in srgb, var(--timeline-secondary) 60%, rgba(255, 255, 255, 0.28) 40%);
    --surface-glass-shadow: 0 26px 52px color-mix(in srgb, var(--timeline-accent) 24%, transparent 76%);
    --grain-opacity: 0.12;
    --os-window-hc-bg: color-mix(
      in srgb,
      var(--bg) 96%,
      color-mix(in srgb, var(--timeline-secondary) 36%, transparent 64%) 4%
    );
    --os-window-hc-border: color-mix(
      in srgb,
      var(--border-strong) 62%,
      color-mix(in srgb, var(--timeline-secondary) 36%, transparent 64%) 38%
    );
    --os-window-hc-shadow: 0 0 0 1px color-mix(
      in srgb,
      var(--border-strong) 56%,
      color-mix(in srgb, var(--timeline-secondary) 32%, transparent 68%) 44%
    );
  }

  :global([data-base-theme='dark'] .timeline-overview__highlight.os-window) {
    --surface-glass-bg: color-mix(in srgb, var(--timeline-secondary) 28%, transparent 72%);
    --surface-glass-border: color-mix(in srgb, var(--timeline-secondary) 56%, rgba(255, 255, 255, 0.2) 44%);
    --surface-glass-shadow: 0 30px 58px color-mix(in srgb, var(--timeline-accent) 28%, transparent 72%);
    --grain-opacity: 0.16;
  }

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

  .timeline {
    --timeline-accent: var(--home-accent, var(--voyage-blue));
    --timeline-secondary: var(--home-secondary, var(--aurora-purple));
    --timeline-tertiary: var(--home-tertiary, var(--signal-yellow));
    --timeline-outline: color-mix(in srgb, var(--timeline-secondary) 32%, transparent 68%);
    --timeline-shadow: color-mix(in srgb, var(--timeline-accent) 24%, transparent 76%);
    --timeline-tertiary-soft: color-mix(in srgb, var(--timeline-tertiary) 18%, transparent 82%);
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
    color: color-mix(in srgb, var(--timeline-secondary) 82%, var(--text) 18%);
    background: color-mix(in srgb, var(--timeline-secondary) 18%, transparent 82%);
    border: 1px solid color-mix(in srgb, var(--timeline-secondary) 40%, transparent 60%);
    box-shadow: 0 18px 32px color-mix(in srgb, var(--timeline-secondary) 16%, transparent 84%);
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
    color: color-mix(in srgb, var(--timeline-accent) 84%, var(--text-secondary) 16%);
    font-size: var(--text-small);
  }

  .timeline-overview__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--timeline-accent) 80%, var(--text) 20%);
    text-decoration: none;
  }

  .timeline-overview__cta::after {
    content: '→';
    font-size: 0.9em;
  }

  .timeline-overview__cta:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--timeline-accent) 62%, var(--timeline-tertiary) 38%);
    outline-offset: 3px;
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
    border-bottom: 1px solid color-mix(in srgb, var(--timeline-outline) 62%, transparent 38%);
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
    color: color-mix(in srgb, var(--timeline-accent) 76%, var(--text) 24%);
  }

  .timeline-filters {
    display: grid;
    gap: 0.85rem;
    padding: clamp(1rem, 2vw, 1.2rem);
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--timeline-secondary) 12%, transparent 88%);
    border: 1px solid color-mix(in srgb, var(--timeline-outline) 68%, transparent 32%);
  }

  .timeline-filters__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .timeline-filters__label {
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--timeline-secondary) 78%, var(--text) 22%);
  }

  .timeline-filters__summary {
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--timeline-accent) 74%, var(--text-secondary) 26%);
  }

  .timeline-filters__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .timeline-filters__chip {
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: var(--radius-full);
    transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
  }

  .timeline-filters__chip.is-active {
    background: color-mix(in srgb, var(--timeline-accent) 22%, transparent 78%);
    border-color: color-mix(in srgb, var(--timeline-accent) 60%, transparent 40%);
    color: color-mix(in srgb, var(--timeline-accent) 80%, var(--text) 20%);
  }

  .timeline-filters__chip--reset {
    font-weight: var(--weight-medium);
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
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--timeline-accent) 28%, transparent 72%) 0%,
      transparent 85%
    );
  }

  .timeline-track__empty {
    display: grid;
    gap: 0.9rem;
    align-content: start;
    padding: clamp(1.6rem, 3vw, 2rem);
    border-radius: var(--radius-xl);
    --surface-glass-bg: color-mix(in srgb, var(--timeline-secondary) 16%, transparent 84%);
    --surface-glass-border: color-mix(in srgb, var(--timeline-outline) 72%, transparent 28%);
    --surface-glass-shadow: 0 18px 36px color-mix(in srgb, var(--timeline-shadow) 32%, transparent 68%);
  }

  .timeline-track__empty p {
    margin: 0;
    font-size: var(--text-base);
    color: color-mix(in srgb, var(--timeline-accent) 82%, var(--text-secondary) 18%);
  }

  .timeline-track__empty-reset {
    justify-self: start;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  :global(.timeline-card.os-window) {
    --surface-glass-bg: color-mix(in srgb, var(--timeline-secondary) 18%, transparent 82%);
    --surface-glass-border: color-mix(in srgb, var(--timeline-secondary) 56%, rgba(255, 255, 255, 0.26) 44%);
    --surface-glass-shadow: 0 26px 52px color-mix(in srgb, var(--timeline-accent) 26%, transparent 74%);
    --grain-opacity: 0.1;
    --os-window-hc-bg: color-mix(
      in srgb,
      var(--bg) 96%,
      color-mix(in srgb, var(--timeline-secondary) 32%, transparent 68%) 4%
    );
    --os-window-hc-border: color-mix(
      in srgb,
      var(--border-strong) 60%,
      color-mix(in srgb, var(--timeline-secondary) 34%, transparent 66%) 40%
    );
    --os-window-hc-shadow: 0 0 0 1px color-mix(
      in srgb,
      var(--border-strong) 54%,
      color-mix(in srgb, var(--timeline-secondary) 30%, transparent 70%) 46%
    );
  }

  :global([data-base-theme='dark'] .timeline-card.os-window) {
    --surface-glass-bg: color-mix(in srgb, var(--timeline-secondary) 22%, transparent 78%);
    --surface-glass-border: color-mix(in srgb, var(--timeline-secondary) 52%, rgba(255, 255, 255, 0.18) 48%);
    --surface-glass-shadow: 0 30px 56px color-mix(in srgb, var(--timeline-accent) 30%, transparent 70%);
    --grain-opacity: 0.14;
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
    background: linear-gradient(135deg, var(--timeline-accent), var(--timeline-secondary));
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--timeline-accent) 22%, transparent 78%);
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
    color: color-mix(in srgb, var(--timeline-accent) 80%, var(--text) 20%);
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
    color: color-mix(in srgb, var(--timeline-tertiary) 68%, var(--timeline-accent) 32%);
    font-size: var(--text-small);
  }

  :global(html[data-theme='hc']) .timeline-overview__badge,
  :global(html[data-theme='hc']) .timeline-overview__cta,
  :global(html[data-theme='hc']) .timeline-overview__note,
  :global(html[data-theme='hc']) .timeline-overview__list-status,
  :global(html[data-theme='hc']) .timeline-filters__summary,
  :global(html[data-theme='hc']) .timeline-card__status,
  :global(html[data-theme='hc']) .timeline-card__note,
  :global(html[data-theme='hc']) .timeline-track__empty p {
    color: currentColor;
  }

  :global(html[data-theme='hc']) .timeline-overview__badge {
    background: transparent;
    border-color: currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .timeline-filters {
    background: transparent;
    border-color: var(--border);
  }

  :global(html[data-theme='hc']) .timeline-filters__chip {
    background: transparent;
    border-color: var(--border);
    color: currentColor;
  }

  :global(html[data-theme='hc']) .timeline-filters__chip.is-active {
    background: var(--bg-elev-1);
    border-color: currentColor;
    color: currentColor;
  }

  :global(html[data-theme='hc']) .timeline-overview__cta {
    color: currentColor;
    text-decoration: underline;
  }

  :global(html[data-theme='hc']) .timeline-overview__cta:focus-visible {
    outline-color: currentColor;
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

  :global(html[data-theme='hc']) .timeline-track__empty {
    border: 2px solid var(--border);
    --surface-glass-bg: transparent;
    --surface-glass-border: var(--border);
    --surface-glass-shadow: none;
  }

  :global(html[data-theme='hc']) .timeline-track__empty-reset {
    border: 1px solid var(--border);
    background: transparent;
    color: currentColor;
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
    .story-shell.os-window,
    .timeline-overview__highlight.os-window {
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
