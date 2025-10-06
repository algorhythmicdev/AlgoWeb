<script>
  import { _, json } from 'svelte-i18n';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import en from '$lib/i18n/en.json';

  const fallbackTitle = /** @type {{ lead: string; brand: string; trail: string }} */ (en.hero.title);
  const fallbackPillars = Array.isArray(en.hero.pillars) ? en.hero.pillars : [];
  const fallbackHighlight = (() => {
    const second = fallbackPillars[1];
    const first = fallbackPillars[0];
    if (typeof second === 'string' && second.trim()) return second.trim();
    if (typeof first === 'string' && first.trim()) return first.trim();
    return '';
  })();

  let heroTitle = fallbackTitle;
  let heroHighlight = fallbackHighlight;
  let heroPillars = fallbackPillars.slice(0, 3);

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

  /**
   * @param {unknown} value
   * @returns {string}
   */
  const normaliseHighlight = (value) => {
    return typeof value === 'string' && value.trim() ? value.trim() : '';
  };

  $: heroTitle = (() => {
    const value = $json?.('hero.title');
    return isHeroTitle(value) ? value : fallbackTitle;
  })();

  $: heroPillars = ensureArray($json?.('hero.pillars'), fallbackPillars).slice(0, 3);

  $: heroHighlight = (() => {
    const preferred = normaliseHighlight(heroPillars[1]);
    const fallbackCandidate = preferred || normaliseHighlight(heroPillars[0]);
    return fallbackCandidate || fallbackHighlight;
  })();
</script>

<HeroWrapper
  id="hero"
  class="hero hero--landing hero--centered hero--landing-center"
  showAside={false}
  introReveal={{ delay: 60, stagger: 120 }}
>
  <svelte:fragment slot="backdrop">
    <div class="hero-backdrop" aria-hidden="true">
      <span class="hero-backdrop__halo hero-backdrop__halo--primary"></span>
      <span class="hero-backdrop__halo hero-backdrop__halo--secondary"></span>
      <span class="hero-backdrop__grid"></span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="status">
    <span class="hero-badge">{$_('hero.status')}</span>
  </svelte:fragment>

  <svelte:fragment slot="title">
    <div class="hero-heading" aria-live="polite">
      <span class="hero-heading__line hero-heading__line--lead">{heroTitle.lead}</span>
      <span class="hero-heading__brand">
        <AnimatedHeadline
          variant="glow"
          text={heroTitle.brand}
          ariaLabel={$_('hero.brand_aria')}
        />
      </span>
      <span class="hero-heading__line hero-heading__line--trail">{heroTitle.trail}</span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    <p class="hero-motto">{$_('hero.tagline')}</p>
  </svelte:fragment>

  <svelte:fragment slot="description">
    <p class="hero-description">{$_('hero.subtitle')}</p>
    <p class="hero-description hero-description--secondary">{$_('hero.description')}</p>
  </svelte:fragment>

  <svelte:fragment slot="highlights">
    {#if heroHighlight || heroPillars.length}
      <div class="hero-insight" aria-label={$_('hero.pillars_title')}>
        {#if heroHighlight}
          <p class="hero-insight__headline">{heroHighlight}</p>
        {/if}
        {#if heroPillars.length}
          <ul class="hero-insight__list">
            {#each heroPillars as pillar}
              <li>{pillar}</li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  </svelte:fragment>
</HeroWrapper>

<style>
  :global(.hero--landing-center) {
    --hero-backdrop-inset: clamp(-6rem, -12vw, -3rem) 0 auto;
    --hero-backdrop-height: clamp(16rem, 42vw, 30rem);
    --hero-intro-gap: clamp(1.3rem, 3.2vw, 2.2rem);
  }

  .hero-backdrop {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
    overflow: hidden;
  }

  .hero-backdrop__halo {
    position: absolute;
    width: clamp(18rem, 46vw, 32rem);
    height: clamp(18rem, 46vw, 32rem);
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.55;
    transform: scale(0.85);
    animation: heroHaloFloat 18s ease-in-out infinite;
  }

  .hero-backdrop__halo--primary {
    background: radial-gradient(circle at 45% 35%, rgba(var(--voyage-blue-rgb), 0.48), transparent 65%);
    animation-delay: -4s;
  }

  .hero-backdrop__halo--secondary {
    background: radial-gradient(circle at 55% 65%, rgba(var(--aurora-purple-rgb), 0.4), transparent 70%);
    animation-delay: -10s;
  }

  .hero-backdrop__grid {
    position: absolute;
    inset: auto;
    width: min(82vw, 640px);
    height: min(82vw, 640px);
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.45) 60%, transparent 40%);
    mask: radial-gradient(circle, rgba(0, 0, 0, 0.95), transparent 70%);
    animation: heroGridSpin 26s linear infinite;
    opacity: 0.35;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6ch;
    padding: 0.55rem 1.1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.2) 65%, transparent);
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.46) 50%, transparent);
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .hero-heading {
    display: grid;
    gap: clamp(0.45rem, 1.6vw, 0.85rem);
  }

  .hero-heading__brand {
    display: block;
  }

  .hero-heading__line {
    font-size: clamp(1.3rem, 3.8vw, 2rem);
    letter-spacing: -0.02em;
    color: var(--text-secondary);
  }

  .hero-heading__brand :global(.animated-headline__glow) {
    font-size: clamp(3rem, 8vw, 5.2rem);
    font-weight: var(--weight-black);
    letter-spacing: -0.04em;
    text-transform: uppercase;
  }

  .hero-heading__line--trail {
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
  }

  .hero-motto {
    margin: 0;
    font-size: clamp(1.15rem, 2.6vw, 1.5rem);
    color: var(--text-primary);
    font-weight: var(--weight-medium);
  }

  .hero-description {
    margin: 0;
    max-width: 58ch;
    color: var(--text-secondary);
    font-size: clamp(1rem, 2.4vw, 1.2rem);
  }

  .hero-description + .hero-description {
    margin-top: 0.4rem;
  }

  .hero-insight {
    display: grid;
    gap: 1.2rem;
    padding: clamp(1.2rem, 3.2vw, 1.8rem) clamp(1.4rem, 3.6vw, 2.2rem);
    border-radius: clamp(1.6rem, 3.8vw, 2.6rem);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.26) 60%, transparent);
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.48) 55%, transparent);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 28px 48px rgba(15, 18, 38, 0.12);
  }

  .hero-insight__headline {
    margin: 0;
    font-size: clamp(1.1rem, 2.6vw, 1.35rem);
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
  }

  .hero-insight__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.75rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .hero-insight__list li {
    position: relative;
    padding-inline-start: 1.5rem;
  }

  .hero-insight__list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5em;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--gradient-hero);
    opacity: 0.75;
    animation: heroPulseDot 3.6s ease-in-out infinite;
  }

  @keyframes heroHaloFloat {
    0%,
    100% {
      transform: scale(0.9) translate3d(0, -4%, 0);
      opacity: 0.45;
    }

    50% {
      transform: scale(1) translate3d(0, 6%, 0);
      opacity: 0.6;
    }
  }

  @keyframes heroGridSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes heroPulseDot {
    0%,
    100% {
      transform: scale(0.85);
      opacity: 0.5;
    }

    50% {
      transform: scale(1.1);
      opacity: 0.9;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-backdrop__halo,
    .hero-backdrop__grid,
    .hero-insight__list li::before {
      animation: none;
    }
  }

  :global([data-base-theme='dark']) .hero-badge {
    background: rgba(16, 22, 38, 0.65);
    border-color: rgba(120, 146, 220, 0.38);
    color: rgba(210, 220, 255, 0.86);
  }

  :global([data-base-theme='dark']) .hero-insight {
    background: rgba(16, 22, 38, 0.72);
    border-color: rgba(120, 146, 220, 0.35);
    box-shadow: 0 36px 60px rgba(2, 8, 18, 0.6);
  }

  :global([data-base-theme='dark']) .hero-backdrop__halo--primary {
    background: radial-gradient(circle at 45% 35%, rgba(var(--voyage-blue-rgb), 0.55), transparent 72%);
  }

  :global([data-base-theme='dark']) .hero-backdrop__halo--secondary {
    background: radial-gradient(circle at 55% 65%, rgba(var(--aurora-purple-rgb), 0.48), transparent 76%);
  }

  :global([data-theme='contrast']) .hero-badge {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid rgba(255, 255, 255, 0.85);
    color: #fff;
  }

  :global([data-theme='contrast']) .hero-insight {
    background: rgba(0, 0, 0, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: none;
  }

  :global([data-theme='contrast']) .hero-insight__list li::before {
    background: #fff;
  }

  @media (max-width: 640px) {
    .hero-insight {
      padding-inline: clamp(1rem, 6vw, 1.6rem);
    }
  }
</style>
