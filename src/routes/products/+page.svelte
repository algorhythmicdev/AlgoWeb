<script>
  import { _, json } from 'svelte-i18n';
  import { Icon, ProductDemoPreview } from '$lib/components';
  import { revealOnScroll, staggerReveal } from '$utils/animations';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';

  /** @type {Array<'nodevoyage' | 'ideonautix'>} */
  const productKeys = ['nodevoyage', 'ideonautix'];
  const products = /** @type {Record<'nodevoyage' | 'ideonautix', any>} */ (productsData);

  const fallbackHeroLabel = en.products?.hero_label ?? 'Products';
  const fallbackHeroTitle = en.products?.title ?? 'Our Products';
  const fallbackHeroSubtitle = en.products?.subtitle ?? '';
  const fallbackShowcaseTitle = en.products?.showcase?.title ?? en.products?.demos?.title ?? '';
  const fallbackShowcaseSubtitle = en.products?.showcase?.subtitle ?? en.products?.demos?.description ?? '';
  const fallbackDemoDescriptions = {
    nodevoyage: en.products?.demos?.nodevoyage_description ?? '',
    ideonautix: en.products?.demos?.ideonautix_description ?? ''
  };

  /**
   * @param {unknown} value
   * @param {string} fallback
   */
  const ensureString = (value, fallback) => (typeof value === 'string' && value.trim().length ? value : fallback);

  /**
   * @param {string} value
   * @returns {string[]}
   */
  const splitChars = (value) => Array.from(value);

  /**
   * @param {string} value
   * @returns {string[]}
   */
  const splitWords = (value) => value.split(/\s+/).filter(Boolean);

  let heroLabel = fallbackHeroLabel;
  let heroTitle = fallbackHeroTitle;
  let heroTitleChars = splitChars(heroTitle);
  let heroSubtitleWords = splitWords(fallbackHeroSubtitle);
  let showcaseTitle = fallbackShowcaseTitle;
  let showcaseSubtitle = fallbackShowcaseSubtitle;
  let nodevoyageDescription = fallbackDemoDescriptions.nodevoyage;
  let ideonautixDescription = fallbackDemoDescriptions.ideonautix;

  $: heroLabel = ensureString($json?.('products.hero_label'), fallbackHeroLabel);
  $: heroTitle = ensureString($json?.('products.title'), fallbackHeroTitle);
  $: heroTitleChars = splitChars(heroTitle);
  $: heroSubtitleWords = splitWords(ensureString($json?.('products.subtitle'), fallbackHeroSubtitle));
  $: showcaseTitle = ensureString($json?.('products.showcase.title'), fallbackShowcaseTitle);
  $: showcaseSubtitle = ensureString($json?.('products.showcase.subtitle'), fallbackShowcaseSubtitle);
  $: nodevoyageDescription = ensureString(
    $json?.('products.demos.nodevoyage_description'),
    fallbackDemoDescriptions.nodevoyage
  );
  $: ideonautixDescription = ensureString(
    $json?.('products.demos.ideonautix_description'),
    fallbackDemoDescriptions.ideonautix
  );
</script>

<svelte:head>
  <title>{$_('products.meta_title')}</title>
  <meta name="description" content={$_('products.meta_description')} />
</svelte:head>

<section class="hero section" use:revealOnScroll>
  <div class="products-hero__backdrop" aria-hidden="true">
    <span class="products-stripe products-stripe--one"></span>
    <span class="products-stripe products-stripe--two"></span>
    <span class="products-orb products-orb--one"></span>
  </div>
  <div class="container hero-container">
    <div class="hero-intro">
      <span class="eyebrow text-gradient">{heroLabel}</span>
      <h1 class="products-hero__headline" aria-label={heroTitle}>
        <span class="sr-only">{heroTitle}</span>
        <span class="products-hero__headline-visual" aria-hidden="true">
          {#each heroTitleChars as char, index (index)}
            <span class="products-hero__char" style={`--char-index:${index}`}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          {/each}
        </span>
      </h1>
      <p class="products-hero__subtitle" aria-live="polite">
        {#each heroSubtitleWords as word, index (index)}
          <span class="products-hero__word" style={`--word-index:${index}`}>{word}</span>{index < heroSubtitleWords.length - 1
            ? '\u00A0'
            : ''}
        {/each}
      </p>
      <p class="products-hero__description">{$_('story.mission_text')}</p>
      <div class="hero-actions">
        <a href="#demos" class="btn btn-gradient">{$_('products.demos.title')}</a>
        <a href="/contact" class="btn btn-secondary hover-lift">{$_('products.cta_contact')}</a>
      </div>
    </div>
  </div>
</section>

<section class="demo-previews section-sm" id="demos" use:revealOnScroll>
  <div class="container">
    <div class="demo-previews__header" use:staggerReveal={{ stagger: 90 }}>
      <span class="eyebrow text-gradient">{$_('products.demos.title')}</span>
      <h2>{showcaseTitle}</h2>
      <p>{showcaseSubtitle}</p>
    </div>
    <div class="demo-previews__grid" use:staggerReveal={{ stagger: 140 }}>
      <ProductDemoPreview
        title={$_('products.demos.nodevoyage')}
        description={nodevoyageDescription}
        host={$_('products.demos.nodevoyage_host')}
        href="https://nodevoyage.algorhythmics.dev/"
        cta={$_('products.demos.nodevoyage')}
        accent="voyage"
      />
      <ProductDemoPreview
        title={$_('products.demos.ideonautix')}
        description={ideonautixDescription}
        host={$_('products.demos.ideonautix_host')}
        href="https://ideonautix.algorhythmics.dev/"
        cta={$_('products.demos.ideonautix')}
        accent="aurora"
      />
    </div>
  </div>
</section>

<section class="catalog section-sm" use:revealOnScroll>
  <div class="container">
    <div class="catalog-grid" use:staggerReveal={{ stagger: 160 }}>
      {#each productKeys as key}
        {#if products[key]}
          <article class="catalog-card">
            <div class="catalog-header">
              <span class="kicker">{$_(`products.${key}.name`)}</span>
              <span class="badge-pill">{$_(`products.${key}.status`)}</span>
            </div>

            <h2>{$_(`products.${key}.tagline`)}</h2>
            <p>{$_(`products.${key}.description`)}</p>

            <ul class="feature-pills">
              {#each (products[key].features ?? []).slice(0, 3) as feature}
                <li>
                  <span class="feature-icon">
                    <Icon name={feature.icon} size={28} />
                  </span>
                  <span>{$_(`${key}.features.${feature.id}.title`)}</span>
                </li>
              {/each}
            </ul>

            <div class="catalog-footer">
              <span class="launch">{$_(`products.${key}.mvp`)}</span>
              <a href={`/products/${key}`} class="btn btn-primary">{$_(`products.${key}.cta`)}</a>
            </div>
          </article>
        {/if}
      {/each}
    </div>
  </div>
</section>

<section class="cta section" use:revealOnScroll>
  <div class="container cta-card">
    <div class="cta-copy">
      <h2>{$_('products.cta_title')}</h2>
      <p>{$_('products.cta_text')}</p>
    </div>
    <div class="cta-actions">
      <a href="/community" class="btn btn-gradient">{$_('products.cta_join')}</a>
      <a href="/contact" class="btn btn-secondary hover-lift">{$_('products.cta_contact')}</a>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    padding-top: clamp(5rem, 10vw, 8rem);
    padding-bottom: clamp(4rem, 9vw, 6.5rem);
  }

  .products-hero__backdrop {
    position: absolute;
    inset: -20% -30% auto;
    height: clamp(18rem, 32vw, 26rem);
    pointer-events: none;
  }

  .products-stripe {
    position: absolute;
    top: 10%;
    width: 140%;
    height: clamp(280px, 40vw, 340px);
    background: linear-gradient(120deg, rgba(19, 81, 255, 0.18), rgba(106, 56, 255, 0.08));
    filter: blur(80px);
    transform: rotate(12deg);
    transform-origin: center;
    animation: productsSweep 22s ease-in-out infinite;
  }

  .products-stripe--one {
    left: -20%;
    animation-duration: 24s;
  }

  .products-stripe--two {
    right: -12%;
    top: -6%;
    transform: rotate(-14deg);
    background: linear-gradient(120deg, rgba(255, 211, 57, 0.16), rgba(224, 50, 44, 0.12));
    animation-duration: 28s;
    animation-delay: -6s;
  }

  .products-orb {
    position: absolute;
    width: clamp(160px, 28vw, 220px);
    height: clamp(160px, 28vw, 220px);
    background: var(--gradient-spectrum-2);
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.42;
    bottom: -40%;
    left: 10%;
    animation: productsOrbDrift 26s ease-in-out infinite;
  }

  @keyframes productsSweep {
    0% {
      transform: translate3d(-6%, 0, 0) rotate(12deg) scale(0.95);
      opacity: 0.45;
    }

    50% {
      transform: translate3d(6%, -4%, 0) rotate(18deg) scale(1.05);
      opacity: 0.72;
    }

    100% {
      transform: translate3d(-6%, 0, 0) rotate(12deg) scale(0.95);
      opacity: 0.45;
    }
  }

  @keyframes productsOrbDrift {
    0%,
    100% {
      transform: translate3d(-6%, 6%, 0) scale(0.9);
    }

    40% {
      transform: translate3d(6%, -6%, 0) scale(1.05);
    }
  }

  .hero-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
  }

  .hero-intro {
    display: grid;
    gap: clamp(1rem, 2.6vw, 1.8rem);
    text-align: left;
    position: relative;
  }

  .hero-intro .eyebrow {
    justify-self: flex-start;
  }

  .products-hero__headline {
    margin: 0;
    font-size: var(--text-hero);
    letter-spacing: -0.04em;
  }

  .products-hero__headline-visual {
    display: inline-flex;
    flex-wrap: wrap;
    gap: clamp(0.15em, 0.6vw, 0.3em);
  }

  .products-hero__char {
    display: inline-block;
    animation: heroCharFloat 6s calc(var(--char-index) * 120ms) ease-in-out infinite alternate;
  }

  .products-hero__subtitle {
    margin: 0;
    font-size: clamp(1.1rem, 2.4vw, 1.6rem);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .products-hero__word {
    display: inline-block;
    transform: translateY(12px);
    opacity: 0;
    animation: heroWordReveal 1.4s calc(160ms * var(--word-index)) var(--ease-out) forwards;
  }

  .products-hero__description {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.2vw, 1.45rem);
    max-width: 64ch;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .demo-previews {
    position: relative;
  }

  .demo-previews::before {
    content: '';
    position: absolute;
    inset: 5% 10% auto;
    height: clamp(12rem, 26vw, 18rem);
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.16), rgba(var(--aurora-purple-rgb), 0.1));
    filter: blur(120px);
    opacity: 0.6;
    pointer-events: none;
  }

  .demo-previews__header {
    display: grid;
    gap: clamp(0.5rem, 1.6vw, 1rem);
    max-width: 620px;
    margin-bottom: clamp(2rem, 5vw, 3rem);
  }

  .demo-previews__header p {
    margin: 0;
    color: var(--text-secondary);
  }

  .demo-previews__grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.8rem);
  }

  .catalog-grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.8rem);
  }

  .catalog-card {
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: clamp(2rem, 4vw, 3rem);
    background: var(--surface-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
    display: grid;
    gap: clamp(1.5rem, 3vw, 2rem);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .catalog-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: color-mix(in srgb, var(--voyage-blue) 40%, rgba(255, 255, 255, 0.4) 60%);
  }

  .catalog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .catalog-card h2 {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    margin: 0;
  }

  .catalog-card p {
    color: var(--text-secondary);
    margin: 0;
  }

  .feature-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .feature-pills li {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 72%, transparent);
    color: var(--text-secondary);
    font-size: var(--text-small);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    backdrop-filter: blur(18px);
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--voyage-blue) 12%, transparent 88%);
    color: var(--voyage-blue);
    filter: drop-shadow(0 4px 8px rgba(17, 24, 39, 0.12));
  }

  .catalog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1.2rem, 3vw, 2rem);
    flex-wrap: wrap;
  }

  .launch {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .cta-card {
    background: var(--surface-glass);
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: clamp(2.5rem, 5vw, 3.5rem);
    display: flex;
    flex-direction: column;
    gap: clamp(1.8rem, 4vw, 2.5rem);
    align-items: stretch;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
  }

  .cta-copy {
    display: grid;
    gap: 1rem;
  }

  .cta-copy p {
    color: var(--text-secondary);
    margin: 0;
  }

  .cta-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  @keyframes heroCharFloat {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-6px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes heroWordReveal {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .hero-container {
      justify-content: center;
      text-align: center;
    }

    .hero-intro {
      text-align: center;
      align-items: center;
    }

    .hero-intro .eyebrow,
    .hero-actions {
      justify-content: center;
    }

    .hero-actions {
      width: 100%;
      justify-content: center;
    }

    .products-hero__headline-visual {
      justify-content: center;
    }

    .products-hero__description {
      text-align: center;
    }
  }

  @media (max-width: 640px) {
    .hero-actions {
      flex-direction: column;
    }
  }

  @media (min-width: 960px) {
    .demo-previews__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .products-hero__char,
    .products-hero__word {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }

  :global([data-theme='dark']) .demo-previews::before {
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.22), rgba(var(--aurora-purple-rgb), 0.18));
    opacity: 0.5;
  }

  :global([data-theme='dark']) .catalog-card {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(255, 255, 255, 0.12) 40%);
    box-shadow: var(--shadow-sm);
  }

  :global([data-theme='dark']) .feature-pills li {
    background: color-mix(in srgb, rgba(12, 18, 30, 0.82) 70%, rgba(var(--voyage-blue-rgb), 0.2) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 60%, rgba(255, 255, 255, 0.08) 40%);
    color: rgba(220, 228, 244, 0.9);
  }

  :global([data-theme='dark']) .cta-card {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 60%, rgba(255, 255, 255, 0.12) 40%);
    box-shadow: var(--shadow-md);
  }
</style>
