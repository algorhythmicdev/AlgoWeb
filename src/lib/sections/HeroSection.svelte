<script>
  import { _, json } from 'svelte-i18n';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
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
    <div class="hero-backdrop" aria-hidden="true">
      <span class="hero-backdrop__halo hero-backdrop__halo--primary"></span>
      <span class="hero-backdrop__halo hero-backdrop__halo--secondary"></span>
      <span class="hero-backdrop__grid" aria-hidden="true"></span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="title">
    <div class="hero-title" aria-live="polite">
      <span class="hero-title__line hero-title__line--lead">{heroTitle.lead}</span>
      <span class="hero-title__brand">
        <AnimatedHeadline
          variant="glow"
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
    font-size: clamp(1.05rem, 2.4vw, 1.55rem);
    color: var(--text-secondary);
    max-width: var(--measure-sm);
  }

  :global([data-theme='contrast']) .hero-highlight {
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
  }

  :global([data-base-theme='dark']) .hero-title__brand {
    background: color-mix(in srgb, rgba(12, 18, 32, 0.86) 62%, rgba(var(--aurora-purple-rgb), 0.3) 38%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 64%, rgba(255, 255, 255, 0.12) 36%);
    box-shadow:
      0 24px 48px rgba(2, 6, 18, 0.42),
      inset 0 0 0 1px rgba(120, 146, 220, 0.28);
  }

  :global([data-theme='contrast']) .hero-title__brand {
    background: rgba(0, 0, 0, 0.86);
    border-color: rgba(255, 255, 255, 0.72);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.65);
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
</style>
