<script>
  import { onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { _ } from 'svelte-i18n';
  import timelineData from '$data/timeline.json';
  import { revealOnScroll, staggerReveal, magnetic, typewriter } from '$utils/animations';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';

  /**
   * @typedef {{ id: string; labelKey: string; valueKey?: string; value?: string }} HeroSignal
   */

  const heroMoments = [
    {
      id: 'nodevoyage',
      accent: 'var(--voyage-blue)',
      kickerKey: 'products.nodevoyage.name',
      statusKey: 'products.nodevoyage.status',
      copyKey: 'nodevoyage.hero_description',
      metaKey: 'products.nodevoyage.mvp',
      ctaKey: 'products.nodevoyage.cta',
      href: '/products/nodevoyage'
    },
    {
      id: 'ideonautix',
      accent: 'var(--aurora-purple)',
      kickerKey: 'products.ideonautix.name',
      statusKey: 'products.ideonautix.status',
      copyKey: 'ideonautix.hero_description',
      metaKey: 'products.ideonautix.mvp',
      ctaKey: 'products.ideonautix.cta',
      href: '/products/ideonautix'
    }
  ];

  /** @type {HeroSignal[]} */
  const baseSignals = [
    { id: 'nodevoyage', labelKey: 'products.nodevoyage.name', valueKey: 'products.nodevoyage.status' },
    { id: 'ideonautix', labelKey: 'products.ideonautix.name', valueKey: 'products.ideonautix.status' }
  ];

  $: signals = /** @type {HeroSignal[]} */ (
    upcomingMilestone
      ? [...baseSignals, { id: 'milestone', labelKey: 'hero.next_milestone', value: milestoneDate }]
      : baseSignals
  );

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** @type {HTMLElement | null} */
  let heroSection = null;

  const pointerSpring = spring({ x: 0.5, y: 0.45 }, { stiffness: 0.18, damping: 0.4, precision: 0.0008 });
  const depthSpring = spring(0, { stiffness: 0.12, damping: 0.42, precision: 0.0001 });

  let pointerCoords = { x: 0.5, y: 0.45 };
  let depth = 0;

  const unsubscribePointer = pointerSpring.subscribe((value) => (pointerCoords = value));
  const unsubscribeDepth = depthSpring.subscribe((value) => (depth = value));

  $: heroVars = `--hero-pointer-x:${pointerCoords.x}; --hero-pointer-y:${pointerCoords.y}; --hero-depth:${depth};`;

  /** @param {PointerEvent} event */
  function handlePointer(event) {
    if (prefersReducedMotion || !heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerSpring.set({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }

  function resetPointer() {
    pointerSpring.set({ x: 0.5, y: 0.45 });
  }

  function handleScroll() {
    if (!heroSection || typeof window === 'undefined') return;
    const rect = heroSection.getBoundingClientRect();
    const viewport = Math.max(window.innerHeight, 1);
    const progress = 1 - Math.min(1, Math.max(0, (rect.top + rect.height * 0.25) / viewport));
    depthSpring.set(progress);
  }

  $: if (heroSection) handleScroll();

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
  }

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    }
    unsubscribePointer();
    unsubscribeDepth();
  });
</script>

<section
  class="hero section-xl"
  bind:this={heroSection}
  style={heroVars}
  on:pointermove={handlePointer}
  on:pointerleave={resetPointer}
  on:pointercancel={resetPointer}
>
  <div class="container hero-shell">
    <div class="hero-copy" use:revealOnScroll>
      <span class="status-chip">{$_('hero.status')}</span>
      <h1>{$_('hero.title')}</h1>
      <p class="hero-tagline" use:typewriter={{ speed: 26 }}>{$_('hero.tagline')}</p>
      <p class="hero-lead">{$_('hero.subtitle')}</p>

      <div class="hero-actions" role="group" aria-label="Primary actions" use:staggerReveal={{ delay: 140, stagger: 100 }}>
        <a href="/products" class="btn btn-gradient" use:magnetic={{ strength: 0.18 }}>{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary hover-lift" use:magnetic={{ strength: 0.16 }}>{$_('hero.cta_consulting')}</a>
      </div>

      <div class="hero-signals" aria-hidden="true" use:staggerReveal={{ delay: 260, stagger: 90 }}>
        {#each signals as signal, index}
          <span class="signal" style={`--index:${index}`}> 
            <span class="signal-label">{$_(signal.labelKey)}</span>
            <span class="signal-value">
              {#if signal.valueKey}
                {$_(signal.valueKey)}
              {:else}
                {signal.value}
              {/if}
            </span>
          </span>
        {/each}
      </div>
    </div>

    <div class="hero-showcase" use:staggerReveal={{ delay: 200, stagger: 150 }}>
      <div class="hero-orbit" aria-hidden="true"></div>
      <div class="hero-glimmer" aria-hidden="true"></div>

      {#each heroMoments as card, index}
        <article class={`moment-card moment-${card.id}`} style={`--index:${index}; --accent:${card.accent};`}>
          <header>
            <span class="moment-kicker">{$_(card.kickerKey)}</span>
            <span class="moment-status">{$_(card.statusKey)}</span>
          </header>
          <p>{$_(card.copyKey)}</p>
          <footer>
            <span>{$_(card.metaKey)}</span>
            <a href={card.href} class="inline-link">{$_(card.ctaKey)}</a>
          </footer>
        </article>
      {/each}

      {#if upcomingMilestone}
        <article class="moment-card milestone" style="--index:2; --accent:var(--signal-yellow);">
          <header>
            <span class="moment-kicker">{$_('hero.next_milestone')}</span>
            <span class="moment-status">{milestoneDate}</span>
          </header>
          <h3>{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h3>
          <p>{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
          {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
            <p class="moment-note">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
          {/if}
        </article>
      {/if}

      <div class="hero-spark" aria-hidden="true"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-top: clamp(7.5rem, 12vw, 10.5rem);
    overflow: hidden;
    --hero-pointer-x: 0.5;
    --hero-pointer-y: 0.45;
    --hero-depth: 0;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: clamp(-6rem, -12vw, -4rem) -30% auto;
    height: clamp(24rem, 42vw, 32rem);
    background: radial-gradient(70% 70% at 50% 30%, rgba(19, 81, 255, 0.16) 0%, transparent 70%);
    filter: blur(120px);
    opacity: 0.6;
    z-index: -1;
  }

  .hero-shell {
    display: grid;
    gap: clamp(3rem, 8vw, 6rem);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    align-items: center;
  }

  .hero-copy {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.2rem);
    max-width: 40rem;
  }

  .hero-copy h1 {
    font-size: var(--text-hero);
    letter-spacing: -0.03em;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .hero-tagline {
    font-size: var(--text-title);
    font-weight: var(--weight-medium);
    color: color-mix(in srgb, var(--text-primary) 82%, transparent);
  }

  .hero-lead {
    color: var(--text-secondary);
    max-width: 36ch;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 1.25rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    background: color-mix(in srgb, var(--bg-muted) 78%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 65%, transparent);
    backdrop-filter: blur(18px);
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hero-signals {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .signal {
    display: grid;
    gap: 0.15rem;
    padding: 0.65rem 1.1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 72%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    backdrop-filter: blur(16px);
    font-size: var(--text-small);
    color: var(--text-secondary);
    transform: translateY(calc(var(--index) * -4px));
  }

  .signal-label {
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .signal-value {
    font-weight: var(--weight-medium);
    color: var(--text-primary);
  }

  .hero-showcase {
    position: relative;
    display: grid;
    gap: clamp(1.4rem, 4vw, 2rem);
    padding: clamp(1.8rem, 4vw, 3rem);
    border-radius: var(--radius-2xl);
    background: color-mix(in srgb, var(--bg-surface) 78%, rgba(19, 81, 255, 0.1) 22%);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 20%, rgba(255, 255, 255, 0.35) 80%);
    box-shadow: 0 38px 80px rgba(15, 23, 42, 0.16);
    overflow: hidden;
  }

  .hero-orbit,
  .hero-glimmer,
  .hero-spark {
    position: absolute;
    inset: 0;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .hero-orbit {
    background:
      radial-gradient(90% 75% at calc(var(--hero-pointer-x) * 100%) calc(var(--hero-pointer-y) * 100%), rgba(19, 81, 255, 0.18) 0%,
        transparent 68%),
      radial-gradient(70% 70% at 30% 10%, rgba(106, 56, 255, 0.16) 0%, transparent 75%);
    transform: translate3d(
        calc((var(--hero-pointer-x) - 0.5) * 16%),
        calc((var(--hero-pointer-y) - 0.5) * 20%),
        0
      );
    transition: transform var(--duration-slow) var(--ease-out);
  }

  .hero-glimmer {
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.18) 0%, transparent 55%);
    opacity: calc(0.25 + var(--hero-depth) * 0.25);
  }

  .hero-spark {
    background: radial-gradient(45% 45% at 70% 80%, rgba(255, 211, 57, 0.2), transparent 70%);
    opacity: calc(0.12 + var(--hero-depth) * 0.3);
    filter: blur(24px);
  }

  .moment-card {
    position: relative;
    display: grid;
    gap: 1.1rem;
    padding: clamp(1.6rem, 3.6vw, 2.4rem);
    border-radius: var(--radius-2xl);
    background: color-mix(in srgb, var(--bg-surface) 84%, rgba(19, 81, 255, 0.12) 16%);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.18) 60%, rgba(255, 255, 255, 0.3) 40%);
    box-shadow: 0 28px 48px rgba(15, 23, 42, 0.18);
    margin-inline-start: calc(var(--index) * clamp(0.8rem, 2.8vw, 2.4rem));
    transform: translate3d(
        calc((var(--hero-pointer-x) - 0.5) * 18px * (var(--index) + 1)),
        calc((var(--hero-pointer-y) - 0.52) * 22px * (var(--index) + 0.7) - var(--hero-depth) * 12px * (var(--index) + 0.5)),
        0
      );
    transition: transform var(--duration-normal) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
    z-index: calc(6 - var(--index));
  }

  .moment-card::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 28%, transparent) 0%, transparent 70%);
    opacity: 0.45;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .moment-card header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .moment-kicker {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--accent) 65%, var(--text-secondary) 35%);
  }

  .moment-status {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 68%, transparent);
  }

  .moment-card p {
    color: var(--text-secondary);
  }

  .moment-card footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    color: var(--text-tertiary);
  }

  .moment-card footer span {
    font-size: var(--text-small);
  }

  .moment-card:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, rgba(255, 255, 255, 0.5) 55%);
    box-shadow: 0 36px 68px rgba(19, 81, 255, 0.18);
  }

  .moment-card:hover::after {
    opacity: 0.68;
  }

  .moment-card.milestone {
    margin-inline-start: clamp(2.4rem, 6vw, 4rem);
    background: color-mix(in srgb, var(--bg-surface) 88%, rgba(255, 211, 57, 0.12) 12%);
    border-color: color-mix(in srgb, rgba(255, 211, 57, 0.32) 60%, rgba(255, 255, 255, 0.28) 40%);
  }

  .moment-card.milestone h3 {
    font-size: clamp(1.4rem, 2.8vw, 1.8rem);
    line-height: var(--leading-snug);
  }

  .moment-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  @media (max-width: 960px) {
    .hero-shell {
      grid-template-columns: 1fr;
    }

    .hero-showcase {
      margin-inline: auto;
    }

    .moment-card,
    .moment-card.milestone {
      margin-inline-start: 0;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 640px) {
    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .hero-showcase {
      padding: clamp(1.2rem, 8vw, 2rem);
    }
  }

  :global([data-theme='dark']) .hero-showcase {
    background: color-mix(in srgb, var(--bg-surface) 78%, rgba(26, 48, 98, 0.55) 22%);
    border-color: color-mix(in srgb, rgba(74, 120, 255, 0.42) 65%, rgba(5, 10, 22, 0.7) 35%);
    box-shadow: 0 42px 88px rgba(2, 6, 18, 0.68);
  }

  :global([data-theme='dark']) .moment-card {
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(40, 70, 140, 0.35) 18%);
    border-color: color-mix(in srgb, rgba(70, 120, 255, 0.32) 60%, rgba(6, 12, 26, 0.6) 40%);
    box-shadow: 0 32px 72px rgba(2, 6, 18, 0.65);
  }

  :global([data-theme='dark']) .moment-card.milestone {
    background: color-mix(in srgb, var(--bg-surface) 88%, rgba(255, 211, 57, 0.18) 12%);
    border-color: color-mix(in srgb, rgba(255, 211, 57, 0.4) 65%, rgba(6, 12, 26, 0.55) 35%);
  }

  :global([data-theme='dark']) .status-chip,
  :global([data-theme='dark']) .signal {
    background: color-mix(in srgb, rgba(17, 28, 58, 0.78) 80%, transparent);
    border-color: color-mix(in srgb, rgba(70, 120, 255, 0.35) 60%, transparent);
    color: var(--text-secondary);
  }

  :global([data-theme='dark']) .signal-value {
    color: var(--text-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-showcase,
    .moment-card,
    .hero-orbit {
      transition: none;
      transform: none;
    }
  }
</style>
