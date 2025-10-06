<script>
  import { _, json } from 'svelte-i18n';
  import timelineData from '$data/timeline.json';
  import { magnetic } from '$utils/animations';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import en from '$lib/i18n/en.json';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';

  const heroSignals = [
    { label: 'hero.signals.studio_phase', value: 'hero.signals.studio_phase_value' },
    { label: 'hero.signals.focus_tracks', value: 'hero.signals.focus_tracks_value' },
    { label: 'hero.signals.research', value: 'hero.signals.research_value' }
  ];

  const fallbackTitle = /** @type {{ lead: string; brand: string; trail: string }} */ (en.hero.title);
  const fallbackPillars = Array.isArray(en.hero.pillars) ? en.hero.pillars : [];
  const fallbackFocusPoints = Array.isArray(en.hero.focus?.points) ? en.hero.focus.points : [];

  let heroTitle = fallbackTitle;

  /**
   * @template T
   * @param {unknown} value
   * @param {ReadonlyArray<T>} fallback
   * @returns {ReadonlyArray<T>}
   */
  const ensureArray = (value, fallback) => (Array.isArray(value) ? value : fallback);

  /**
   * @param {unknown} value
   * @returns {value is { lead: string; brand: string; trail: string }}
   */
  const isHeroTitle = (value) =>
    !!value && typeof value === 'object' && 'lead' in value && 'brand' in value && 'trail' in value;

  $: heroTitle = (() => {
    const value = $json?.('hero.title');
    return isHeroTitle(value) ? value : fallbackTitle;
  })();

  $: heroHighlights = (() => {
    const value = ensureArray($json?.('hero.pillars'), fallbackPillars);
    return value.slice(0, 3);
  })();

  $: focusPoints = (() => {
    return ensureArray($json?.('hero.focus.points'), fallbackFocusPoints);
  })();
</script>

<HeroWrapper
  id="hero"
  class="hero hero--landing"
  introReveal={{ stagger: 110 }}
  asideReveal={{ delay: 140, stagger: 130 }}
>
  <svelte:fragment slot="status">
    <span class="status-chip">{$_('hero.status')}</span>
  </svelte:fragment>

  <svelte:fragment slot="title">
    <h1 class="hero-title">
      <span class="hero-title__line text-gradient">{heroTitle.lead}</span>
      <span class="hero-title__brand" aria-label={$_('hero.brand_aria')}>
        <span class="hero-title__brand-glow" aria-hidden="true"></span>
        <span class="hero-title__brand-text" aria-hidden="true">{heroTitle.brand}</span>
        <span class="sr-only">{heroTitle.brand}</span>
      </span>
      <span class="hero-title__line hero-title__line--trail text-gradient">{heroTitle.trail}</span>
    </h1>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    <p class="hero-lead text-gradient">{$_('hero.tagline')}</p>
  </svelte:fragment>

  <svelte:fragment slot="description">
    <p class="hero-description">{$_('hero.subtitle')}</p>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <a href="/products" class="btn btn-gradient" use:magnetic={{ strength: 0.18 }}>{$_('hero.cta_products')}</a>
      <a href="/consulting" class="btn btn-secondary" use:magnetic={{ strength: 0.16 }}>{$_('hero.cta_consulting')}</a>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="highlights">
    {#if heroHighlights.length}
      <ul class="hero-highlights">
        {#each heroHighlights as highlight}
          <li>{highlight}</li>
        {/each}
      </ul>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="metrics">
    <dl class="hero-metrics">
      {#each heroSignals as signal}
        <div class="metric">
          <dt>{$_(signal.label)}</dt>
          <dd>{$_(signal.value)}</dd>
        </div>
      {/each}
    </dl>
  </svelte:fragment>

  <svelte:fragment slot="aside">
    {#if upcomingMilestone}
      <article class="glass-card milestone">
        <header>
          <span class="kicker">{$_('hero.next_milestone')}</span>
          <span class="timestamp">{milestoneDate}</span>
        </header>
        <h2>{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h2>
        <p>{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
        {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
          <p class="note">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
        {/if}
        <a href="#journey" class="inline-link">{$_('hero.milestone_cta')}</a>
      </article>
    {/if}

    <article class="glass-card focus">
      <header>
        <span class="kicker">{$_('hero.focus.kicker')}</span>
        <h2>{$_('hero.focus.title')}</h2>
      </header>
      <p>{$_('hero.focus.description')}</p>
      {#if focusPoints.length}
        <ul>
          {#each focusPoints as point}
            <li>{point}</li>
          {/each}
        </ul>
      {/if}
      <a href="/community" class="inline-link">{$_('hero.focus.cta')}</a>
    </article>
  </svelte:fragment>
</HeroWrapper>

<style>
  :global(.hero--landing) {
    --hero-actions-gap: 0.85rem;
    --hero-metrics-gap: clamp(1rem, 2.6vw, 1.6rem);
    --hero-aside-gap: clamp(1.6rem, 3.4vw, 2.4rem);
  }

  :global(.hero--landing .hero-metrics) {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }

  .hero-title {
    display: inline-grid;
    gap: clamp(0.35rem, 1.4vw, 0.55rem);
    align-items: start;
    justify-items: start;
  }

  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    .hero-title {
      background: none;
      -webkit-background-clip: border-box;
      background-clip: border-box;
      color: var(--heading-color);
      animation: none;
    }
  }

  .hero-title__line {
    display: inline-flex;
    align-items: center;
    gap: clamp(0.35rem, 1vw, 0.55rem);
  }

  .hero-title__brand {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: clamp(0.15em, 0.5vw, 0.25em) clamp(0.45em, 1vw, 0.7em);
    border-radius: var(--radius-full);
    isolation: isolate;
  }

  .hero-title__brand::before {
    content: '';
    position: absolute;
    inset: -18%;
    border-radius: inherit;
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 60%, rgba(var(--cherry-red-rgb), 0.28) 40%);
    filter: blur(32px);
    opacity: 0.45;
    z-index: 0;
    animation: heroBrandAura 14s var(--ease-in-out) infinite alternate;
  }

  .hero-title__brand::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.65) 60%, rgba(var(--voyage-blue-rgb), 0.24) 40%);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.18) 55%, rgba(var(--voyage-blue-rgb), 0.18) 45%);
    opacity: 0.35;
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    z-index: 0;
  }

  .hero-title__brand-text {
    position: relative;
    z-index: 1;
    font-size: clamp(2.8rem, 7vw, 5rem);
    font-weight: var(--weight-black);
    line-height: 1.05;
    letter-spacing: -0.04em;
    background: var(--gradient-heading-strong);
    background-size: 280% auto;
    background-position: 0% 50%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    text-shadow: none;
    animation: heroBrandPulse 8s var(--ease-spring) infinite alternate;
  }

  @keyframes heroBrandPulse {
    0% {
      background-position: 0% 50%;
      transform: scale(0.96);
    }

    50% {
      background-position: 100% 50%;
      transform: scale(1.02);
    }

    100% {
      background-position: 0% 50%;
      transform: scale(0.97);
    }
  }

  @keyframes heroBrandAura {
    0% {
      opacity: 0.32;
      transform: scale(0.96);
    }

    50% {
      opacity: 0.58;
      transform: scale(1.04);
    }

    100% {
      opacity: 0.36;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-title__brand-text {
      animation: none;
      transform: none;
    }

    .hero-title__brand::before {
      animation: none;
    }
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 1.35rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--surface-glass) 88%, rgba(var(--voyage-blue-rgb), 0.12) 12%);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent 28%);
    color: var(--text-primary);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .hero-lead {
    margin: 0;
    font-size: clamp(1.1rem, 2.5vw, 1.6rem);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--voyage-blue);
  }

  :global([data-theme='dark']) .hero-lead {
    color: color-mix(in srgb, var(--voyage-blue) 56%, var(--aurora-purple) 44%);
  }

  .hero-description {
    font-size: clamp(1.05rem, 2.2vw, 1.5rem);
    color: var(--text-secondary);
    max-width: 60ch;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .btn {
    min-width: clamp(10rem, 18vw, 12rem);
  }

  .hero-highlights {
    display: grid;
    gap: 0.75rem;
    padding: clamp(1.2rem, 2.4vw, 1.8rem);
    border-radius: clamp(1.4rem, 3.4vw, 2.2rem);
    background: color-mix(in srgb, var(--surface-glass) 90%, rgba(var(--voyage-blue-rgb), 0.1) 10%);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent 28%);
    box-shadow: var(--shadow-xs);
    list-style: none;
  }

  .hero-highlights li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .hero-highlights li::before {
    content: '';
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
    background: var(--voyage-blue);
    box-shadow: 0 0 12px rgba(var(--voyage-blue-rgb), 0.4);
  }

  :global([data-theme='dark']) .hero-highlights {
    background: color-mix(in srgb, rgba(6, 12, 24, 0.86) 68%, rgba(var(--voyage-blue-rgb), 0.16) 32%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 60%, rgba(255, 255, 255, 0.08) 40%);
  }

  :global([data-theme='dark']) .hero-highlights li::before {
    background: color-mix(in srgb, var(--voyage-blue) 60%, var(--aurora-purple) 40%);
    box-shadow: 0 0 14px rgba(var(--aurora-purple-rgb), 0.45);
  }

  .hero-metrics {
    display: grid;
    gap: clamp(1rem, 2.6vw, 1.6rem);
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }

  .metric {
    display: grid;
    gap: 0.35rem;
    padding: 1.1rem 1.2rem;
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--surface-glass) 86%, rgba(var(--voyage-blue-rgb), 0.08) 14%);
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.22) 62%, rgba(255, 255, 255, 0.4) 38%);
    box-shadow: var(--shadow-xs);
  }

  .metric dt {
    font-size: clamp(0.7rem, 1vw, 0.82rem);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--voyage-blue) 66%, var(--aurora-purple) 34%);
  }

  .metric dd {
    margin: 0;
    font-size: clamp(1.05rem, 2.2vw, 1.4rem);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
  }

  :global([data-theme='dark']) .metric {
    background: color-mix(in srgb, rgba(6, 12, 24, 0.88) 68%, rgba(var(--voyage-blue-rgb), 0.2) 32%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(255, 255, 255, 0.08) 40%);
  }

  .glass-card {
    display: grid;
    gap: 1rem;
    padding: clamp(1.6rem, 3.2vw, 2.3rem);
    border-radius: clamp(1.8rem, 4vw, 2.6rem);
    background: color-mix(in srgb, var(--surface-glass) 88%, rgba(var(--voyage-blue-rgb), 0.12) 12%);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent 28%);
    box-shadow: var(--shadow-sm);
  }

  .glass-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .glass-card h2 {
    margin: 0;
    font-size: clamp(1.45rem, 2.6vw, 1.9rem);
    line-height: var(--leading-snug);
  }

  .glass-card p {
    margin: 0;
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  .glass-card ul {
    margin: 0;
    padding-left: 1.1rem;
    color: var(--text-secondary);
    display: grid;
    gap: 0.55rem;
    font-size: var(--text-small);
  }

  .glass-card ul li::marker {
    color: var(--voyage-blue);
  }

  .kicker {
    font-size: clamp(0.7rem, 1vw, 0.82rem);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  .timestamp {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--surface-glass) 80%, rgba(var(--voyage-blue-rgb), 0.14) 20%);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 68%, transparent 32%);
  }

  .note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  :global([data-theme='dark']) .glass-card {
    background: color-mix(in srgb, rgba(4, 10, 22, 0.9) 68%, rgba(var(--voyage-blue-rgb), 0.2) 32%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(255, 255, 255, 0.08) 40%);
    box-shadow: var(--shadow-md);
  }

  :global([data-theme='dark']) .timestamp {
    background: color-mix(in srgb, rgba(6, 12, 24, 0.84) 70%, rgba(var(--voyage-blue-rgb), 0.24) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 60%, rgba(255, 255, 255, 0.1) 40%);
  }

  @media (max-width: 1024px) {
    :global(.hero--landing .hero-wrapper__shell) {
      grid-template-columns: 1fr;
    }

    :global(.hero--landing .hero-wrapper__aside) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 720px) {
    :global(.hero--landing) {
      --hero-padding-block-start: clamp(5rem, 18vw, 6.5rem);
    }

    :global(.hero--landing .hero-actions) {
      flex-direction: column;
      align-items: stretch;
    }

    .metric {
      padding: clamp(0.9rem, 4vw, 1.2rem);
    }

    .glass-card {
      padding: clamp(1.3rem, 4.4vw, 1.8rem);
    }
  }
</style>
