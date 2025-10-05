<script>
  import { _, json } from 'svelte-i18n';
  import timelineData from '$data/timeline.json';
  import { revealOnScroll, staggerReveal, magnetic } from '$utils/animations';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';

  const heroSignals = [
    { label: 'hero.signals.studio_phase', value: 'hero.signals.studio_phase_value' },
    { label: 'hero.signals.focus_tracks', value: 'hero.signals.focus_tracks_value' },
    { label: 'hero.signals.research', value: 'hero.signals.research_value' }
  ];

  $: heroHighlights = (() => {
    const value = $json?.('hero.pillars');
    return Array.isArray(value) ? value.slice(0, 3) : [];
  })();

  $: focusPoints = (() => {
    const value = $json?.('hero.focus.points');
    return Array.isArray(value) ? value : [];
  })();
</script>

<section class="hero" id="hero" use:revealOnScroll>
  <div class="container hero-shell">
    <div class="hero-intro" use:staggerReveal={{ stagger: 110 }}>
      <span class="status-chip">{$_('hero.status')}</span>
      <h1>{$_('hero.title')}</h1>
      <p class="hero-lead">{$_('hero.tagline')}</p>
      <p class="hero-description">{$_('hero.subtitle')}</p>

      <div class="hero-actions">
        <a href="/products" class="btn btn-gradient" use:magnetic={{ strength: 0.18 }}>{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary" use:magnetic={{ strength: 0.16 }}>{$_('hero.cta_consulting')}</a>
      </div>

      {#if heroHighlights.length}
        <ul class="hero-highlights">
          {#each heroHighlights as highlight}
            <li>{highlight}</li>
          {/each}
        </ul>
      {/if}

      <dl class="hero-metrics">
        {#each heroSignals as signal}
          <div class="metric">
            <dt>{$_(signal.label)}</dt>
            <dd>{$_(signal.value)}</dd>
          </div>
        {/each}
      </dl>
    </div>

    <aside class="hero-aside" aria-label={$_('hero.status')} use:staggerReveal={{ delay: 140, stagger: 130 }}>
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
    </aside>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding: clamp(5.5rem, 11vw, 9rem) 0 clamp(4rem, 10vw, 7rem);
    isolation: isolate;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: clamp(-7rem, -12vw, -3rem) 0 auto;
    height: clamp(14rem, 38vw, 26rem);
    background: radial-gradient(64% 72% at 50% 18%, var(--hero-glow-color) 0%, transparent 68%);
    opacity: 0.7;
    filter: blur(120px);
    pointer-events: none;
    z-index: -1;
    transition: background 400ms var(--ease-in-out), opacity 400ms var(--ease-in-out);
  }

  :global([data-theme='light']) .hero::before {
    --hero-glow-color: color-mix(in srgb, var(--voyage-blue) 34%, rgba(255, 255, 255, 0.18));
  }

  :global([data-theme='dark']) .hero::before {
    --hero-glow-color: color-mix(in srgb, var(--aurora-purple) 42%, rgba(2, 6, 16, 0.92));
    opacity: 0.55;
  }

  .hero-shell {
    display: grid;
    gap: clamp(2.5rem, 5vw, 4rem);
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    align-items: start;
  }

  .hero-intro {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.2rem);
    align-content: start;
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

  .hero-aside {
    display: grid;
    gap: clamp(1.6rem, 3.4vw, 2.4rem);
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
    .hero-shell {
      grid-template-columns: 1fr;
    }

    .hero-aside {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 720px) {
    .hero {
      padding-top: clamp(5rem, 18vw, 6.5rem);
    }

    .hero-actions {
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
