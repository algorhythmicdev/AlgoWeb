<script>
  import { onDestroy, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { _, json } from 'svelte-i18n';
  import timelineData from '$data/timeline.json';
  import { revealOnScroll, staggerReveal, typewriter, magnetic } from '$utils/animations';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';

  const heroProducts = [
    { id: 'nodevoyage', href: '/products/nodevoyage' },
    { id: 'ideonautix', href: '/products/ideonautix' }
  ];

  /** @type {{ id: string; kickerKey: string; statusKey: string; copyKey: string; metaKey: string; ctaKey: string; href: string; accent: string; }[]} */
  const heroMoments = [
    {
      id: 'nodevoyage',
      kickerKey: 'hero.moments.nodevoyage.kicker',
      statusKey: 'hero.moments.nodevoyage.status',
      copyKey: 'hero.moments.nodevoyage.copy',
      metaKey: 'hero.moments.nodevoyage.meta',
      ctaKey: 'hero.moments.nodevoyage.cta',
      href: heroProducts[0].href,
      accent: 'var(--voyage-blue)'
    },
    {
      id: 'ideonautix',
      kickerKey: 'hero.moments.ideonautix.kicker',
      statusKey: 'hero.moments.ideonautix.status',
      copyKey: 'hero.moments.ideonautix.copy',
      metaKey: 'hero.moments.ideonautix.meta',
      ctaKey: 'hero.moments.ideonautix.cta',
      href: heroProducts[1].href,
      accent: 'var(--aurora-purple)'
    }
  ];

  /** @type {{ labelKey: string; valueKey?: string; value?: string }[]} */
  const signals = [
    {
      labelKey: 'hero.signals.studio_phase',
      valueKey: 'hero.signals.studio_phase_value'
    },
    {
      labelKey: 'hero.signals.focus_tracks',
      valueKey: 'hero.signals.focus_tracks_value'
    },
    {
      labelKey: 'hero.signals.research',
      valueKey: 'hero.signals.research_value'
    }
  ];

  $: heroPillars = (() => {
    const value = $json?.('hero.pillars');
    return Array.isArray(value) ? value : [];
  })();

  const defaultPointer = { x: 0.56, y: 0.42 };
  const pointerSpring = spring(defaultPointer, {
    stiffness: 0.18,
    damping: 0.42,
    precision: 0.0005
  });

  /** @type {{ x: number; y: number }} */
  let pointerCoords = defaultPointer;
  /** @type {HTMLElement | null} */
  let heroSection = null;
  let motionEnabled = false;

  const unsubscribePointer = pointerSpring.subscribe((value) => {
    pointerCoords = value;
  });

  $: heroVars = `--hero-pointer-x:${pointerCoords.x}; --hero-pointer-y:${pointerCoords.y};`;

  /** @param {number} value */
  function normalize(value) {
    return Math.max(0, Math.min(1, value));
  }

  /** @param {PointerEvent} event */
  function handlePointer(event) {
    if (!motionEnabled || !heroSection || event.pointerType === 'touch') return;
    const rect = heroSection.getBoundingClientRect();
    const x = normalize((event.clientX - rect.left) / rect.width);
    const y = normalize((event.clientY - rect.top) / rect.height);
    pointerSpring.set({ x, y });
  }

  function relaxPointer() {
    pointerSpring.set(defaultPointer);
  }

  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** @param {MediaQueryListEvent} event */
    const updatePreference = (event) => {
      motionEnabled = !event.matches;
      if (!motionEnabled) {
        relaxPointer();
      }
    };

    motionEnabled = !mediaQuery.matches;
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
    } else {
      mediaQuery.addListener(updatePreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updatePreference);
      } else {
        mediaQuery.removeListener(updatePreference);
      }
    };
  });

  onDestroy(() => {
    unsubscribePointer();
  });
</script>

<section
  class="hero section"
  id="hero"
  use:revealOnScroll
  bind:this={heroSection}
  style={heroVars}
  on:pointermove={handlePointer}
  on:pointerleave={relaxPointer}
  on:pointercancel={relaxPointer}
  on:touchend={relaxPointer}
>
  <div class="container hero-grid">
    <div class="hero-copy" use:revealOnScroll>
      <div class="hero-intro">
        <span class="status-chip animate-fade-in-up animate-stagger-1">{$_('hero.status')}</span>
        <h1 class="animate-slide-in-left animate-stagger-2">{$_('hero.title')}</h1>
        <p class="hero-tagline animate-typewriter animate-stagger-3" use:typewriter={{ speed: 26 }}>{$_('hero.tagline')}</p>
        <p class="hero-lead animate-fade-in-up animate-stagger-4">{$_('hero.subtitle')}</p>
      </div>

      <div class="hero-actions" role="group" aria-label="Primary actions" use:staggerReveal={{ delay: 140, stagger: 100 }}>
        <a href="/products" class="btn btn-gradient animate-bounce-in animate-stagger-5" use:magnetic={{ strength: 0.18 }}>{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary hover-lift animate-zoom-in animate-stagger-6" use:magnetic={{ strength: 0.16 }}>{$_('hero.cta_consulting')}</a>
      </div>

      <div class="hero-metrics" role="list" use:staggerReveal={{ delay: 260, stagger: 110 }}>
        {#each signals as signal, index}
          <div class="metric" role="listitem" style={`--metric-index:${index};`}>
            <span class="metric-label">{$_(signal.labelKey)}</span>
            <span class="metric-value">
              {#if signal.valueKey}
                {$_(signal.valueKey)}
              {:else}
                {signal.value}
              {/if}
            </span>
          </div>
        {/each}
      </div>

      {#if heroPillars.length}
        <div class="hero-pillars" use:staggerReveal={{ stagger: 90 }}>
          <span class="pillars-title">{$_('hero.pillars_title')}</span>
          <ul>
            {#each heroPillars as pillar}
              <li>{pillar}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <div class="hero-visual" use:staggerReveal={{ delay: 200, stagger: 150 }}>
      <div class="hero-canvas">
        <span class="hero-halo" aria-hidden="true"></span>
        <span class="hero-rings" aria-hidden="true"></span>

        {#each heroMoments as card, index}
          <article class={`hero-card hero-${card.id}`} style={`--index:${index}; --accent:${card.accent};`}>
            <header>
              <span class="hero-kicker">{$_(card.kickerKey)}</span>
              <span class="hero-status">{$_(card.statusKey)}</span>
            </header>
            <p>{$_(card.copyKey)}</p>
            <footer>
              <span>{$_(card.metaKey)}</span>
              <a href={card.href} class="inline-link">{$_(card.ctaKey)}</a>
            </footer>
          </article>
        {/each}

        {#if upcomingMilestone}
          <article class="hero-card milestone" style="--index: 2; --accent: var(--signal-yellow);">
            <header>
              <span class="hero-kicker">{$_('hero.next_milestone')}</span>
              <span class="hero-status">{milestoneDate}</span>
            </header>
            <h3>{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h3>
            <p>{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
            {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
              <p class="hero-note">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
            {/if}
          </article>
        {/if}

        <span class="hero-shimmer" aria-hidden="true"></span>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-top: clamp(7rem, 12vw, 9.5rem);
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: clamp(-6rem, -12vw, -3rem) 0 auto;
    height: clamp(22rem, 50vw, 34rem);
    background: radial-gradient(65% 70% at 50% 18%, color-mix(in srgb, var(--voyage-blue) 30%, transparent) 0%, transparent 75%);
    opacity: calc(0.52 + var(--hero-depth) * 0.28);
    filter: blur(120px);
    pointer-events: none;
    z-index: -1;
  }

  :global([data-theme='dark']) .hero::before {
    background: radial-gradient(68% 74% at 50% 18%, color-mix(in srgb, var(--aurora-purple) 44%, transparent) 0%, transparent 75%);
    opacity: calc(0.45 + var(--hero-depth) * 0.4);
  }

  .hero-grid {
    display: grid;
    gap: clamp(3rem, 7vw, 5rem);
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: stretch;
  }

  .hero-copy {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
    align-content: start;
  }

  .hero-intro {
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.7rem);
  }

  .hero-tagline {
    font-size: clamp(1.1rem, 2.3vw, 1.5rem);
    color: var(--voyage-blue);
  }

  .hero-lead {
    font-size: clamp(1.1rem, 2.4vw, 1.7rem);
    color: var(--text-secondary);
    max-width: 44ch;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 1.3rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--voyage-blue) 12%, rgba(255, 255, 255, 0.7) 88%);
    color: rgba(26, 33, 55, 0.78);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .hero-tagline {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--voyage-blue);
    background: color-mix(in srgb, var(--bg-muted) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 68%, transparent);
    backdrop-filter: blur(18px);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .hero-metrics {
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.6rem);
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    padding: clamp(1.3rem, 2.6vw, 1.8rem);
    border-radius: clamp(1.4rem, 4vw, 2rem);
    background: color-mix(in srgb, var(--bg-surface) 86%, rgba(19, 81, 255, 0.12) 14%);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.28) 60%, rgba(255, 255, 255, 0.4) 40%);
    box-shadow: 0 24px 54px rgba(15, 23, 42, 0.12);
  }

  .metric {
    --index: var(--metric-index, 0);
    display: grid;
    gap: 0.35rem;
    padding: 0.8rem 0.9rem;
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.82) 70%, transparent);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.24) 50%, rgba(255, 255, 255, 0.65) 50%);
    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
    transform: translate3d(
      calc((var(--hero-pointer-x) - 0.5) * (6px + var(--index) * 2px)),
      calc((var(--hero-pointer-y) - 0.45) * (10px + var(--index) * 3px)),
      0
    );
    transition: transform var(--duration-normal) var(--ease-out);
  }

  .metric-label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: var(--text-xsmall);
    color: var(--text-tertiary);
    font-weight: var(--weight-semibold);
  }

  .metric-value {
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
  }

  .hero-visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-canvas {
    position: relative;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: minmax(140px, auto);
    gap: clamp(1rem, 2.6vw, 2rem);
    padding: clamp(2rem, 4vw, 3rem);
    border-radius: clamp(2.2rem, 5vw, 3rem);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(19, 81, 255, 0.14) 18%);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.3) 65%, rgba(255, 255, 255, 0.4) 35%);
    box-shadow: 0 46px 90px rgba(15, 23, 42, 0.18);
    overflow: hidden;
    min-height: clamp(22rem, 56vw, 30rem);
    isolation: isolate;
  }

  .hero-halo,
  .hero-rings,
  .hero-shimmer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: -1;
  }

  .hero-halo {
    background: radial-gradient(
      60% 60% at calc(var(--hero-pointer-x) * 100%) calc(var(--hero-pointer-y) * 100%),
      color-mix(in srgb, var(--voyage-blue) 34%, transparent),
      transparent 76%
    );
    opacity: calc(0.28 + var(--hero-depth) * 0.42);
    filter: blur(90px);
  }

  .hero-rings {
    inset: clamp(1.4rem, 4vw, 2.4rem);
    border-radius: clamp(1.8rem, 4.5vw, 2.6rem);
    background:
      conic-gradient(from 45deg, rgba(255, 255, 255, 0.18), transparent 45%, rgba(255, 255, 255, 0.14), transparent 80%),
      radial-gradient(48% 52% at 70% 26%, rgba(255, 255, 255, 0.2), transparent 70%);
    mix-blend-mode: lighten;
    opacity: calc(0.32 + var(--hero-depth) * 0.3);
  }

  .hero-shimmer {
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.22) 0%, transparent 65%);
    opacity: calc(0.18 + var(--hero-depth) * 0.32);
  }

  .hero-card {
    --index: var(--index, 0);
    position: relative;
    display: grid;
    gap: 0.85rem;
    padding: clamp(1.4rem, 2.8vw, 2rem);
    border-radius: var(--radius-2xl);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(255, 255, 255, 0.22) 18%);
    border: 1px solid color-mix(in srgb, var(--accent, var(--voyage-blue)) 28%, rgba(255, 255, 255, 0.55) 72%);
    box-shadow: 0 36px 60px rgba(15, 23, 42, 0.16);
    backdrop-filter: blur(26px);
    min-height: min(100%, clamp(12rem, 26vw, 15rem));
    grid-column: span 3;
    transform: translate3d(
      calc((var(--hero-pointer-x) - 0.5) * (12px + var(--index) * 4px)),
      calc((var(--hero-pointer-y) - 0.45) * (18px + var(--index) * 6px)),
      0
    )
      scale(calc(1 + var(--hero-depth) * (0.04 + var(--index) * 0.01)));
    transition: transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out);
    z-index: calc(10 + var(--index));
  }

  .hero-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .hero-kicker {
    font-weight: var(--weight-semibold);
    color: var(--accent, var(--voyage-blue));
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: var(--text-xsmall);
  }

  .hero-status {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 68%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
  }

  .hero-card p {
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  .hero-card footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-size: var(--text-small);
  }

  .hero-card footer span {
    color: var(--text-tertiary);
  }

  .hero-card:hover {
    box-shadow: 0 42px 90px rgba(15, 23, 42, 0.2);
    border-color: color-mix(in srgb, var(--accent, var(--voyage-blue)) 45%, rgba(255, 255, 255, 0.7) 55%);
  }

  .hero-card.hero-nodevoyage {
    grid-column: 1 / span 3;
  }

  .hero-card.hero-ideonautix {
    grid-column: 4 / span 3;
    margin-top: clamp(0rem, 2vw, 1.4rem);
  }

  .hero-card.milestone {
    grid-column: 2 / span 4;
    background: color-mix(in srgb, var(--bg-surface) 80%, rgba(255, 211, 57, 0.16) 20%);
    border-color: color-mix(in srgb, rgba(255, 211, 57, 0.42) 60%, rgba(255, 255, 255, 0.4) 40%);
    box-shadow: 0 40px 70px rgba(255, 200, 55, 0.2);
  }

  .hero-card.milestone h3 {
    font-size: clamp(1.35rem, 2.6vw, 1.85rem);
    line-height: var(--leading-snug);
  }

  .hero-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  @media (max-width: 1080px) {
    .hero-card.hero-ideonautix {
      margin-top: 0;
    }
  }

  @media (max-width: 960px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .hero {
      padding-top: clamp(6rem, 18vw, 8rem);
    }

    .hero-canvas {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-height: clamp(26rem, 68vw, 32rem);
    }

    .hero-card {
      grid-column: span 3;
    }

    .hero-card.milestone {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 720px) {
    .hero-canvas {
      padding: clamp(1.6rem, 5vw, 2rem);
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: clamp(1rem, 3vw, 1.4rem);
    }

    .hero-card {
      padding: clamp(1.2rem, 4vw, 1.6rem);
      grid-column: span 2;
    }

    .hero-card.milestone {
      grid-column: 1 / -1;
    }

    .hero-metrics {
      grid-template-columns: 1fr;
    }

    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
