<script>
  import { _, json } from 'svelte-i18n';
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

  $: heroHighlight = (() => {
    const pillars = ensureArray($json?.('hero.pillars'), fallbackPillars);
    const preferred = normaliseHighlight(pillars[1]);
    const fallbackCandidate = preferred || normaliseHighlight(pillars[0]);
    return fallbackCandidate || fallbackHighlight;
  })();
</script>

<HeroWrapper id="hero" class="hero hero--landing" showAside={false}>
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
    {#if heroHighlight}
      <p class="hero-highlight">{heroHighlight}</p>
    {/if}
  </svelte:fragment>
</HeroWrapper>

<style>
  :global(.hero--landing) {
    --hero-shell-columns: minmax(0, 1fr);
    --hero-shell-gap: 0;
    --hero-intro-gap: clamp(1.15rem, 2.6vw, 1.85rem);
    --hero-padding-block-end: clamp(3rem, 10vw, 5rem);
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

  .hero-highlight {
    margin: 0;
    font-size: clamp(1.05rem, 2.4vw, 1.45rem);
    color: var(--text-secondary);
    max-width: 32ch;
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
</style>
