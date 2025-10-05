<script>
  import { onDestroy, onMount } from 'svelte';
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

  function updateDepthFromScroll() {
    if (!heroSection || typeof window === 'undefined') return;
    const rect = heroSection.getBoundingClientRect();
    const viewport = Math.max(window.innerHeight, 1);
    const progress = 1 - Math.min(1, Math.max(0, (rect.top + rect.height * 0.25) / viewport));
    depthSpring.set(progress);
  }

  $: if (heroSection) updateDepthFromScroll();

  let teardownWindowListeners = () => {};

  onMount(() => {
    if (typeof window === 'undefined') return;
    const opts = { passive: true };
    window.addEventListener('scroll', updateDepthFromScroll, opts);
    window.addEventListener('resize', updateDepthFromScroll);
    updateDepthFromScroll();

    teardownWindowListeners = () => {
      window.removeEventListener('scroll', updateDepthFromScroll);
      window.removeEventListener('resize', updateDepthFromScroll);
    };
    return teardownWindowListeners;
  });

  onDestroy(() => {
    teardownWindowListeners();
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
      <span class="status-chip animate-fade-in-up animate-stagger-1">{$_('hero.status')}</span>
      <h1 class="animate-slide-in-left animate-stagger-2">{$_('hero.title')}</h1>
      <p class="hero-tagline animate-typewriter animate-stagger-3" use:typewriter={{ speed: 26 }}>{$_('hero.tagline')}</p>
      <p class="hero-lead animate-fade-in-up animate-stagger-4">{$_('hero.subtitle')}</p>

      <div class="hero-actions" role="group" aria-label="Primary actions" use:staggerReveal={{ delay: 140, stagger: 100 }}>
        <a href="/products" class="btn btn-gradient animate-bounce-in animate-stagger-5" use:magnetic={{ strength: 0.18 }}>{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary hover-lift animate-zoom-in animate-stagger-6" use:magnetic={{ strength: 0.16 }}>{$_('hero.cta_consulting')}</a>
      </div>

      <div class="hero-signals" aria-hidden="true" use:staggerReveal={{ delay: 260, stagger: 90 }}>
        {#each signals as signal, index}
          <span class="signal animate-fade-in-left" style={`--index:${index}; animation-delay: ${0.8 + index * 0.2}s;`}> 
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
      <div class="hero-orbit animate-float" aria-hidden="true"></div>
      <div class="hero-glimmer animate-pulse" aria-hidden="true"></div>

      {#each heroMoments as card, index}
        <article class={`moment-card moment-${card.id} animate-slide-in-up`} style={`--index:${index}; --accent:${card.accent}; animation-delay: ${1.2 + index * 0.3}s;`}>
          <header>
            <span class="moment-kicker animate-fade-in-left" style={`animation-delay: ${1.4 + index * 0.3}s;`}>{$_(card.kickerKey)}</span>
            <span class="moment-status animate-fade-in-right" style={`animation-delay: ${1.5 + index * 0.3}s;`}>{$_(card.statusKey)}</span>
          </header>
          <p class="animate-fade-in-up" style={`animation-delay: ${1.6 + index * 0.3}s;`}>{$_(card.copyKey)}</p>
          <footer>
            <span class="animate-fade-in-left" style={`animation-delay: ${1.7 + index * 0.3}s;`}>{$_(card.metaKey)}</span>
            <a href={card.href} class="inline-link animate-fade-in-right" style={`animation-delay: ${1.8 + index * 0.3}s;`}>{$_(card.ctaKey)}</a>
          </footer>
        </article>
      {/each}

      {#if upcomingMilestone}
        <article class="moment-card milestone animate-zoom-in" style="--index:2; --accent:var(--signal-yellow); animation-delay: 2.1s;">
          <header>
            <span class="moment-kicker animate-fade-in-left" style="animation-delay: 2.3s;">{$_('hero.next_milestone')}</span>
            <span class="moment-status animate-fade-in-right" style="animation-delay: 2.4s;">{milestoneDate}</span>
          </header>
          <h3 class="animate-slide-in-up" style="animation-delay: 2.5s;">{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h3>
          <p class="animate-fade-in-up" style="animation-delay: 2.6s;">{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
          {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
            <p class="moment-note animate-fade-in-up" style="animation-delay: 2.7s;">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
          {/if}
        </article>
      {/if}

      <div class="hero-spark animate-pulse" aria-hidden="true"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-top: clamp(8rem, 12vw, 10rem);
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: clamp(-4rem, -8vw, -2rem) 0 auto;
    height: clamp(18rem, 35vw, 26rem);
    background: linear-gradient(135deg, rgba(19, 81, 255, 0.18), rgba(106, 56, 255, 0.08));
    filter: blur(120px);
    opacity: 0.7;
    z-index: -1;
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
    gap: clamp(3rem, 6vw, 5rem);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3vw, 2rem);
    max-width: 38rem;
  }

  .hero-lead {
    font-size: clamp(1.2rem, 2.4vw, 1.7rem);
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
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .hero-signals {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .signal {
    display: grid;
    gap: 1.2rem;
    margin-top: 1.4rem;
  }

  .meta-card {
    padding: clamp(1.4rem, 2.4vw, 1.8rem);
    border: 1px solid rgba(255, 255, 255, 0.58);
    border-radius: var(--radius-2xl);
    background: var(--surface-glass);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(24px);
    display: grid;
    gap: 0.65rem;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .meta-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .meta-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
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
    gap: clamp(1.6rem, 4vw, 2.2rem);
  }

  .showcase-card {
    padding: clamp(1.8rem, 3vw, 2.4rem);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: var(--surface-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
    display: grid;
    gap: clamp(0.9rem, 2vw, 1.2rem);
    position: relative;
    overflow: hidden;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .showcase-card::after {
    content: '';
    position: absolute;
    inset: -40% 30% auto -30%;
    height: 140%;
    background: radial-gradient(ellipse at center, rgba(19, 81, 255, 0.2), transparent 65%);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .showcase-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-md);
  }

  .showcase-card:hover::after {
    opacity: 0.6;
  }

  .showcase-card.focus {
    border: 1px solid rgba(19, 81, 255, 0.24);
    box-shadow: var(--shadow-md);
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

  .showcase-stack {
    display: grid;
    gap: clamp(1.4rem, 3vw, 1.8rem);
  }

  .moment-card footer span {
    font-size: var(--text-small);
  }

  .milestone h3 {
    font-size: clamp(1.4rem, 2.6vw, 1.9rem);
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
      align-items: stretch;
    }

    .hero {
      padding-top: clamp(6rem, 18vw, 8rem);
    }

    .moment-card,
    .moment-card.milestone {
      margin-inline-start: 0;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 640px) {
    .hero-actions { flex-direction: column; align-items: stretch; }
    .meta-card { padding: 1.2rem; }
    .showcase-card { padding: 1.6rem; }
  }
</style>
