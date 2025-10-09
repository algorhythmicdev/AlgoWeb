<script>
  import { _, json } from 'svelte-i18n';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import HeroBackdrop from '$lib/components/hero/HeroBackdrop.svelte';
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
  <svelte:fragment slot="backdrop">
    <HeroBackdrop variant="aurora-flow" tone="primary" intensity="balanced" className="hero-backdrop--landing" />
    <HeroBackdrop variant="line-sweep" tone="primary" intensity="soft" className="hero-backdrop--landing-sweep" />
  </svelte:fragment>

  <svelte:fragment slot="title">
    <div class="hero-title" aria-live="polite">
      <span class="hero-title__line hero-title__line--lead">{heroTitle.lead}</span>
      <span class="hero-title__brand">
        <span aria-hidden="true" class="hero-title__brand-sweep"></span>
        <AnimatedHeadline
          variant="reveal"
          text={heroTitle.brand}
          ariaLabel={$_('hero.brand_aria')}
        />
      </span>
      <span class="hero-title__line hero-title__line--trail">{heroTitle.trail}</span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    {#if heroHighlight}
      <p class="hero-highlight">{heroHighlight}</p>
    {/if}
  </svelte:fragment>
</HeroWrapper>

<style>
  :global(.hero--landing) {
    --hero-padding-block-start: clamp(7rem, 16vw, 11rem);
    --hero-shell-columns: minmax(0, 1fr);
    --hero-shell-gap: 0;
    --hero-intro-gap: clamp(1.15rem, 2.6vw, 1.85rem);
    --hero-padding-block-end: clamp(5rem, 12vw, 7rem);
  }

  @media (max-width: 768px) {
    :global(.hero--landing) {
      --hero-padding-block-start: clamp(6rem, 22vw, 8rem);
      --hero-padding-block-end: clamp(4.5rem, 14vw, 6rem);
    }
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
    margin: clamp(0.5rem, 1.6vw, 0.85rem) 0 0;
    font-size: clamp(1.05rem, 2.4vw, 1.55rem);
    color: var(--text-secondary);
    max-width: var(--measure-sm);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-highlight {
    color: var(--text-primary);
  }

  .hero-title__brand {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: clamp(0.15em, 0.5vw, 0.25em) clamp(0.45em, 1vw, 0.7em);
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--surface-glass-strong) 68%, rgba(255, 255, 255, 0.22) 32%);
    border: 1px solid color-mix(in srgb, var(--border-glass) 70%, rgba(255, 255, 255, 0.4) 30%);
    box-shadow:
      0 18px 42px rgba(15, 23, 42, 0.18),
      inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    isolation: isolate;
    overflow: hidden;
  }

  .hero-title__brand-sweep {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.45) 0%, rgba(var(--aurora-purple-rgb), 0.32) 45%, rgba(var(--signal-yellow-rgb), 0.18) 100%);
    mix-blend-mode: screen;
    opacity: 0.55;
    animation: heroBrandSweep 18s ease-in-out infinite;
    pointer-events: none;
  }

  .hero-title__brand :global(.animated-headline) {
    position: relative;
    z-index: 1;
  }

  :global([data-base-theme='dark']) .hero-title__brand {
    background: color-mix(in srgb, rgba(12, 18, 32, 0.86) 62%, rgba(var(--aurora-purple-rgb), 0.3) 38%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 64%, rgba(255, 255, 255, 0.12) 36%);
    box-shadow:
      0 24px 48px rgba(2, 6, 18, 0.42),
      inset 0 0 0 1px rgba(120, 146, 220, 0.28);
  }

  :global([data-base-theme='dark']) .hero-title__brand-sweep {
    mix-blend-mode: lighten;
    opacity: 0.48;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-title__brand {
    background: color-mix(in srgb, var(--text) 86%, var(--bg) 14%);
    border-color: color-mix(in srgb, var(--text) 72%, var(--bg) 28%);
    box-shadow: 0 18px 44px color-mix(in srgb, var(--text) 65%, transparent 35%);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-title__brand-sweep {
    display: none;
  }

  :global(.hero-backdrop--landing) {
    --hero-backdrop-opacity: 0.72;
    --hero-backdrop-blur: clamp(160px, 24vw, 260px);
  }

  :global(.hero-backdrop--landing-sweep) {
    --hero-backdrop-opacity: 0.38;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  @keyframes heroBrandSweep {
    0% { transform: translate3d(-14%, -10%, 0) rotate(-8deg); }
    50% { transform: translate3d(12%, 6%, 0) rotate(6deg); }
    100% { transform: translate3d(-10%, -4%, 0) rotate(-7deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-title__brand-sweep {
      display: none;
    }
  }
</style>
