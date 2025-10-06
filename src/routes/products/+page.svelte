<script>
  import { _, json } from 'svelte-i18n';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';
  import ProductsHero from './components/ProductsHero.svelte';
  import ProductsShowcase from './components/ProductsShowcase.svelte';
  import ProductCatalog from './components/ProductCatalog.svelte';
  import ProductsCTA from './components/ProductsCTA.svelte';

  /** @type {Array<'nodevoyage' | 'ideonautix'>} */
  const productKeys = ['nodevoyage', 'ideonautix'];
  const products = /** @type {Record<'nodevoyage' | 'ideonautix', any>} */ (productsData);
  const i18nResources = /** @type {Record<string, any>} */ (en);

  const fallbackHeroLabel = en.products?.hero_label ?? 'Products';
  const fallbackHeroTitle = en.products?.title ?? 'Our Products';
  const fallbackHeroSubtitle = en.products?.subtitle ?? '';
  const fallbackHeroMission = en.story?.mission_text ?? '';
  const fallbackShowcaseTitle = en.products?.showcase?.title ?? en.products?.demos?.title ?? '';
  const fallbackShowcaseSubtitle = en.products?.showcase?.subtitle ?? en.products?.demos?.description ?? '';
  const fallbackDemosTitle = en.products?.demos?.title ?? '';
  const fallbackCtaTitle = en.products?.cta_title ?? '';
  const fallbackCtaText = en.products?.cta_text ?? '';
  const fallbackCtaJoin = en.products?.cta_join ?? '';
  const fallbackCtaContact = en.products?.cta_contact ?? '';

  const fallbackProductCopy = productKeys.reduce((acc, key) => {
    const copy = /** @type {{ name?: string; tagline?: string; description?: string; status?: string; mvp?: string; cta?: string }} */ (
      en.products?.[key] ?? {}
    );
    acc[key] = {
      name: copy.name ?? '',
      tagline: copy.tagline ?? '',
      description: copy.description ?? '',
      status: copy.status ?? '',
      mvp: copy.mvp ?? '',
      cta: copy.cta ?? ''
    };
    return acc;
  }, /** @type {Record<string, { name: string; tagline: string; description: string; status: string; mvp: string; cta: string }>} */ ({}));

  const fallbackFeatureCopy = productKeys.reduce((acc, key) => {
    const featureCopy = /** @type {Record<string, { title?: string; description?: string }> | undefined} */ (
      i18nResources[key]?.features
    );
    acc[key] = featureCopy ?? {};
    return acc;
  }, /** @type {Record<string, Record<string, { title?: string; description?: string }>>} */ ({}));

  const fallbackDemoContent = /** @type {Record<'nodevoyage' | 'ideonautix', { title: string; description: string; host: string; href: string; cta: string; accent: 'voyage' | 'aurora' }>} */ ({
    nodevoyage: {
      title: en.products?.demos?.nodevoyage ?? '',
      description: en.products?.demos?.nodevoyage_description ?? '',
      host: en.products?.demos?.nodevoyage_host ?? '',
      href: 'https://nodevoyage.algorhythmics.dev/',
      cta: en.products?.demos?.nodevoyage ?? '',
      accent: 'voyage'
    },
    ideonautix: {
      title: en.products?.demos?.ideonautix ?? '',
      description: en.products?.demos?.ideonautix_description ?? '',
      host: en.products?.demos?.ideonautix_host ?? '',
      href: 'https://ideonautix.algorhythmics.dev/',
      cta: en.products?.demos?.ideonautix ?? '',
      accent: 'aurora'
    }
  });

  /**
   * @param {unknown} value
   * @param {string} fallback
   */
  const ensureString = (value, fallback) => (typeof value === 'string' && value.trim().length ? value : fallback);

  let heroLabel = fallbackHeroLabel;
  let heroTitle = fallbackHeroTitle;
  let heroSubtitle = fallbackHeroSubtitle;
  let heroMission = fallbackHeroMission;
  let showcaseTitle = fallbackShowcaseTitle;
  let showcaseSubtitle = fallbackShowcaseSubtitle;
  let heroPrimaryActionLabel = fallbackDemosTitle;
  let heroSecondaryActionLabel = fallbackCtaContact;
  let ctaTitle = fallbackCtaTitle;
  let ctaText = fallbackCtaText;
  let ctaPrimaryLabel = fallbackCtaJoin;
  let ctaSecondaryLabel = fallbackCtaContact;

  $: heroLabel = ensureString($json?.('products.hero_label'), fallbackHeroLabel);
  $: heroTitle = ensureString($json?.('products.title'), fallbackHeroTitle);
  $: heroSubtitle = ensureString($json?.('products.subtitle'), fallbackHeroSubtitle);
  $: heroMission = ensureString($json?.('story.mission_text'), fallbackHeroMission);
  $: showcaseTitle = ensureString($json?.('products.showcase.title'), fallbackShowcaseTitle);
  $: showcaseSubtitle = ensureString($json?.('products.showcase.subtitle'), fallbackShowcaseSubtitle);
  $: heroPrimaryActionLabel = ensureString($json?.('products.demos.title'), fallbackDemosTitle);
  $: heroSecondaryActionLabel = ensureString($json?.('products.cta_contact'), fallbackCtaContact);
  $: ctaTitle = ensureString($json?.('products.cta_title'), fallbackCtaTitle);
  $: ctaText = ensureString($json?.('products.cta_text'), fallbackCtaText);
  $: ctaPrimaryLabel = ensureString($json?.('products.cta_join'), fallbackCtaJoin);
  $: ctaSecondaryLabel = ensureString($json?.('products.cta_contact'), fallbackCtaContact);

  $: heroProducts = productKeys.reduce((acc, key) => {
    const fallback = fallbackProductCopy[key];
    const name = ensureString($json?.(`products.${key}.name`), fallback.name);
    if (name.trim().length) {
      acc.push({
        id: key,
        name,
        status: ensureString($json?.(`products.${key}.status`), fallback.status),
        mvp: ensureString($json?.(`products.${key}.mvp`), fallback.mvp),
        cta: ensureString($json?.(`products.${key}.cta`), fallback.cta),
        href: `/products/${key}`
      });
    }
    return acc;
  }, /** @type {Array<{ id: string; name: string; status: string; mvp: string; cta: string; href: string }>} */ ([]));

  $: catalogEntries = productKeys.reduce((acc, key) => {
    const fallback = fallbackProductCopy[key];
    const source = products[key];
    const name = ensureString($json?.(`products.${key}.name`), fallback.name);
    if (name.trim().length) {
      acc.push({
        id: key,
        name,
        status: ensureString($json?.(`products.${key}.status`), fallback.status),
        tagline: ensureString($json?.(`products.${key}.tagline`), fallback.tagline),
        description: ensureString($json?.(`products.${key}.description`), fallback.description),
        mvp: ensureString($json?.(`products.${key}.mvp`), fallback.mvp),
        cta: ensureString($json?.(`products.${key}.cta`), fallback.cta),
        href: `/products/${key}`,
        features: (source?.features ?? []).slice(0, 4).map(
          /** @param {{ id: string; icon: string }} feature */ (feature) => {
            const fallbackFeature = fallbackFeatureCopy[key]?.[feature.id] ?? {};
            return {
              id: feature.id,
              icon: feature.icon,
              title: ensureString($json?.(`${key}.features.${feature.id}.title`), fallbackFeature.title ?? ''),
              description: ensureString(
                $json?.(`${key}.features.${feature.id}.description`),
                fallbackFeature.description ?? ''
              )
            };
          }
        )
      });
    }
    return acc;
  }, /** @type {Array<{
    id: string;
    name: string;
    status: string;
    tagline: string;
    description: string;
    mvp: string;
    cta: string;
    href: string;
    features: Array<{ id: string; icon: string; title: string; description: string }>;
  }>} */ ([]));

  $: demos = productKeys.reduce((acc, key) => {
    const fallback = fallbackDemoContent[key];
    const titleValue = ensureString($json?.(`products.demos.${key}`), fallback.title);
    const descriptionValue = ensureString($json?.(`products.demos.${key}_description`), fallback.description);
    const hostValue = ensureString($json?.(`products.demos.${key}_host`), fallback.host);
    if (titleValue.trim().length || descriptionValue.trim().length) {
      acc.push({
        id: key,
        title: titleValue,
        description: descriptionValue,
        host: hostValue,
        href: fallback.href,
        cta: ensureString($json?.(`products.demos.${key}`), fallback.cta),
        accent: fallback.accent
      });
    }
    return acc;
  }, /** @type {Array<{ id: string; title: string; description: string; host: string; href: string; cta: string; accent: 'voyage' | 'aurora' }>} */ ([]));
</script>

<svelte:head>
  <title>{$_('products.meta_title')}</title>
  <meta name="description" content={$_('products.meta_description')} />
</svelte:head>

<HeroWrapper
  class="hero hero--products section"
  showAside={false}
  introReveal={{ stagger: 120 }}
>
  <svelte:fragment slot="backdrop">
    <div class="products-hero__backdrop" aria-hidden="true">
      <span class="products-stripe products-stripe--one"></span>
      <span class="products-stripe products-stripe--two"></span>
      <span class="products-orb products-orb--one"></span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="status">
    <span class="eyebrow text-gradient">{heroLabel}</span>
  </svelte:fragment>

  <svelte:fragment slot="title">
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
  </svelte:fragment>

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
</HeroWrapper>

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
  :global(.hero--products) {
    --hero-padding-block-start: clamp(5rem, 10vw, 8rem);
    --hero-padding-block-end: clamp(4rem, 9vw, 6.5rem);
    --hero-shell-columns: minmax(0, 1fr);
    --hero-shell-gap: clamp(2.2rem, 5vw, 3rem);
    --hero-intro-gap: clamp(1.4rem, 3vw, 2.2rem);
    --hero-actions-gap: 1rem;
    --hero-backdrop-inset: -20% -30% auto;
    --hero-backdrop-height: clamp(18rem, 32vw, 26rem);
    --hero-backdrop-gradient: linear-gradient(120deg, rgba(19, 81, 255, 0.18), rgba(106, 56, 255, 0.08));
    --hero-backdrop-opacity: 0.35;
    --hero-backdrop-opacity-light: 0.42;
    --hero-backdrop-opacity-dark: 0.28;
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }

  :global(.hero--products .hero-wrapper__intro) {
    max-width: min(100%, 960px);
    margin: 0 auto;
    justify-items: flex-start;
    text-align: left;
    position: relative;
  }

  :global(.hero--products .hero-wrapper__intro .eyebrow) { justify-self: flex-start; }

  .products-hero__backdrop {
    position: absolute;
    inset: -20% -30% auto;
    height: clamp(18rem, 32vw, 26rem);
    pointer-events: none;
    z-index: -1;
  }

  .products-stripe {
    position: absolute;
    top: 10%;
    width: 140%;
    height: clamp(280px, 40vw, 340px);
    background: linear-gradient(120deg, var(--hero-glow-primary), color-mix(in srgb, var(--hero-glow-secondary) 60%, transparent 40%));
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
    background: linear-gradient(120deg, var(--hero-glow-accent), color-mix(in srgb, var(--hero-glow-secondary) 55%, transparent 45%));
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
    opacity: var(--hero-orb-opacity);
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

  .demo-previews {
    position: relative;
  }

  .demo-previews::before {
    content: '';
    position: absolute;
    inset: 5% 10% auto;
    height: clamp(12rem, 26vw, 18rem);
    background: linear-gradient(135deg, var(--hero-glow-primary), color-mix(in srgb, var(--hero-glow-secondary) 60%, transparent 40%));
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
    :global(.hero--products) {
      --hero-shell-gap: clamp(2rem, 6vw, 2.6rem);
    }

    :global(.hero--products .hero-wrapper__intro) {
      justify-items: center;
      text-align: center;
    }

    :global(.hero--products .hero-wrapper__intro .eyebrow) {
      justify-self: center;
    }

    :global(.hero--products .hero-wrapper__intro .hero-actions) {
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
    :global(.hero--products .hero-wrapper__intro .hero-actions) {
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
