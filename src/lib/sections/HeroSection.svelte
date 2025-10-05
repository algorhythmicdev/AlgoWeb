<script>
  import { onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { _ } from 'svelte-i18n';
  import timelineData from '$data/timeline.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** @type {HTMLElement | null} */
  let heroSection = null;

  const pointerSpring = spring({ x: 0.5, y: 0.45 }, { stiffness: 0.16, damping: 0.38, precision: 0.0008 });
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
  <div class="container hero-grid">
    <div class="hero-copy" use:revealOnScroll>
      <span class="status-chip">{$_('hero.status')}</span>
      <h1>{$_('hero.title')}</h1>
      <p class="hero-lead">{$_('hero.subtitle')}</p>

      <div class="hero-actions" role="group" aria-label="Primary actions">
        <a href="/products" class="btn btn-gradient">{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary hover-lift">{$_('hero.cta_consulting')}</a>
      </div>

      <div class="hero-pills" aria-hidden="true">
        <span>{$_('products.nodevoyage.name')} • {$_('products.nodevoyage.status')}</span>
        <span>{$_('products.ideonautix.name')} • {$_('products.ideonautix.status')}</span>
        {#if upcomingMilestone}
          <span>{$_('timeline.title')} • {milestoneDate}</span>
        {/if}
      </div>
    </div>

    <div class="hero-visual" use:staggerReveal={{ delay: 120, stagger: 140 }}>
      <div class="aurora" aria-hidden="true">
        <div class="aurora-layer layer-one"></div>
        <div class="aurora-layer layer-two"></div>
        <div class="aurora-pulse"></div>
      </div>

      <div class="hero-tiles">
        <article class="tile tile-node">
          <header>
            <span class="kicker">{$_('products.nodevoyage.name')}</span>
            <span class="badge-pill">{$_('products.nodevoyage.status')}</span>
          </header>
          <p>{$_('nodevoyage.hero_description')}</p>
          <footer>
            <span>{$_('products.nodevoyage.mvp')}</span>
            <a href="/products/nodevoyage" class="inline-link">{$_('products.nodevoyage.cta')}</a>
          </footer>
        </article>

        <article class="tile tile-ide">
          <header>
            <span class="kicker">{$_('products.ideonautix.name')}</span>
            <span class="badge-pill">{$_('products.ideonautix.status')}</span>
          </header>
          <p>{$_('ideonautix.hero_description')}</p>
          <footer>
            <span>{$_('products.ideonautix.mvp')}</span>
            <a href="/products/ideonautix" class="inline-link">{$_('products.ideonautix.cta')}</a>
          </footer>
        </article>
      </div>

      {#if upcomingMilestone}
        <div class="milestone-card">
          <span class="kicker">{$_('hero.next_milestone')}</span>
          <h3>{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h3>
          <p>{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
          {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
            <p class="timeline-note">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
          {/if}
          <span class="milestone-date">{milestoneDate}</span>
        </div>
      {/if}

      <div class="scroll-indicator" aria-hidden="true">
        <span></span>
        <span></span>
      </div>
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
    inset: clamp(-6rem, -10vw, -3rem) -20% auto;
    height: clamp(22rem, 40vw, 32rem);
    background: linear-gradient(135deg, rgba(19, 81, 255, 0.18), rgba(106, 56, 255, 0.08));
    filter: blur(120px);
    opacity: 0.65;
    z-index: -1;
  }

  .hero-grid {
    display: grid;
    gap: clamp(3rem, 7vw, 5.5rem);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    align-items: center;
  }

  .hero-copy {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.2rem);
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

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 1.25rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 30%, transparent);
    background: color-mix(in srgb, var(--bg-muted) 70%, rgba(19, 81, 255, 0.12));
    color: color-mix(in srgb, var(--voyage-blue) 72%, var(--text-primary) 28%);
    box-shadow: 0 8px 20px rgba(19, 81, 255, 0.12);
  }

  .hero-lead {
    font-size: clamp(1.2rem, 2.4vw, 1.75rem);
    color: var(--text-secondary);
    max-width: 34rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .hero-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 0.5rem;
    color: var(--text-tertiary);
    font-size: var(--text-small);
  }

  .hero-pills span {
    display: inline-flex;
    align-items: center;
    gap: 0.5ch;
    padding: 0.55rem 1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 72%, transparent);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 18%, transparent);
    backdrop-filter: blur(18px);
  }

  .hero-visual {
    position: relative;
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.6rem);
    padding: clamp(1rem, 2vw, 1.5rem);
    isolation: isolate;
  }

  .aurora {
    position: absolute;
    inset: -30% -10% -20% -20%;
    pointer-events: none;
    z-index: -1;
    transform: translate3d(
        calc((var(--hero-pointer-x) - 0.5) * 12%),
        calc((var(--hero-pointer-y) - 0.45) * 16%),
        0
      ) scale(calc(0.96 + var(--hero-depth) * 0.08));
    transition: transform 280ms var(--ease-out);
  }

  .aurora-layer {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 30%, rgba(19, 81, 255, 0.35), transparent 70%);
    filter: blur(60px);
  }

  .layer-two {
    background: radial-gradient(circle at 70% 40%, rgba(106, 56, 255, 0.32), transparent 75%);
    mix-blend-mode: screen;
  }

  .aurora-pulse {
    position: absolute;
    inset: 15% 20% 10%;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 50%, rgba(255, 211, 57, 0.4), transparent 70%);
    filter: blur(40px);
    opacity: calc(0.35 + var(--hero-depth) * 0.25);
    animation: pulse 18s ease-in-out infinite;
  }

  .hero-tiles {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2rem);
  }

  .tile {
    position: relative;
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 22%, transparent);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(19, 81, 255, 0.12));
    backdrop-filter: blur(26px);
    padding: clamp(1.6rem, 3vw, 2.2rem);
    display: grid;
    gap: 1rem;
    box-shadow: 0 24px 60px rgba(12, 24, 52, 0.18);
    transform:
      translate3d(
        calc((var(--hero-pointer-x) - 0.5) * 26px * var(--hero-depth)),
        calc((var(--hero-pointer-y) - 0.45) * 34px * var(--hero-depth)),
        0
      )
      rotate3d(1, -1, 0, calc((var(--hero-pointer-x) - 0.5) * 6deg));
    transition: transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
    animation: float 16s ease-in-out infinite;
  }

  .tile header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .tile p {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .tile footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .tile-node {
    border-color: color-mix(in srgb, var(--voyage-blue) 28%, transparent);
    background: linear-gradient(145deg, color-mix(in srgb, var(--bg-surface) 88%, rgba(19, 81, 255, 0.14)), rgba(19, 81, 255, 0.08));
  }

  .tile-ide {
    border-color: color-mix(in srgb, var(--aurora-purple) 28%, transparent);
    background: linear-gradient(145deg, color-mix(in srgb, var(--bg-surface) 86%, rgba(106, 56, 255, 0.12)), rgba(106, 56, 255, 0.08));
    animation-delay: -6s;
  }

  .inline-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
  }

  .inline-link::after {
    content: '↗';
    font-size: 0.85em;
  }

  .milestone-card {
    display: grid;
    gap: 0.6rem;
    padding: 1.6rem 1.8rem;
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, var(--aurora-purple) 26%, transparent);
    background: color-mix(in srgb, var(--bg-elevated) 82%, rgba(106, 56, 255, 0.18));
    backdrop-filter: blur(24px);
    box-shadow: 0 18px 48px rgba(30, 22, 56, 0.25);
    max-width: 320px;
    transform: translate3d(
      calc((var(--hero-pointer-x) - 0.5) * 20px * var(--hero-depth)),
      calc((var(--hero-pointer-y) - 0.45) * 28px * var(--hero-depth)),
      0
    );
    transition: transform var(--duration-normal) var(--ease-out);
  }

  .milestone-card h3 {
    font-size: clamp(1.2rem, 2.4vw, 1.5rem);
  }

  .milestone-card p {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .timeline-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .milestone-date {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--voyage-blue) 75%, var(--text-primary) 25%);
  }

  .scroll-indicator {
    position: absolute;
    bottom: clamp(-1.5rem, -3vw, -0.75rem);
    left: clamp(2.5rem, 5vw, 3rem);
    width: 48px;
    height: 96px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 20%, transparent);
    background: color-mix(in srgb, var(--bg-muted) 75%, transparent);
    backdrop-filter: blur(18px);
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .scroll-indicator span {
    display: block;
    width: 4px;
    height: 16px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--voyage-blue) 80%, var(--aurora-purple) 20%);
    animation: scroll 3.4s ease-in-out infinite;
  }

  .scroll-indicator span:last-child {
    animation-delay: -1.2s;
  }

  @keyframes float {
    0% {
      transform: translate3d(0, 0, 0) rotate3d(1, -1, 0, 0deg);
    }
    50% {
      transform: translate3d(0, -10px, 0) rotate3d(1, -1, 0, 2deg);
    }
    100% {
      transform: translate3d(0, 0, 0) rotate3d(1, -1, 0, 0deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.35;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }

  @keyframes scroll {
    0% {
      transform: translateY(-18px);
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    70% {
      transform: translateY(18px);
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: translateY(18px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .aurora,
    .tile,
    .milestone-card {
      transform: none !important;
      animation: none !important;
      transition: none !important;
    }

    .aurora-pulse,
    .scroll-indicator span {
      animation: none;
    }
  }

  @media (max-width: 1080px) {
    .hero-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .hero-copy {
      margin: 0 auto;
      justify-items: center;
    }

    .hero-actions {
      justify-content: center;
    }

    .hero-visual {
      justify-items: center;
    }

    .milestone-card {
      justify-self: center;
    }

    .scroll-indicator {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 640px) {
    .hero {
      padding-top: clamp(5.5rem, 12vw, 7rem);
    }

    .hero-actions {
      flex-direction: column;
    }

    .hero-pills span {
      width: 100%;
      justify-content: center;
    }

    .hero-tiles {
      gap: 1.2rem;
    }

    .tile,
    .milestone-card {
      padding: 1.4rem 1.6rem;
    }

    .scroll-indicator {
      display: none;
    }
  }
</style>
