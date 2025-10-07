<script>
  import { _, json } from 'svelte-i18n';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';
  import HeroWrapper from '$components/hero/HeroWrapper.svelte';
  import HeroBackdrop from '$components/hero/HeroBackdrop.svelte';
  import ProductDemoPreview from '$components/ProductDemoPreview.svelte';
  import Icon from '$components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

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
      host: products.nodevoyage?.demoHost ?? en.products?.demos?.nodevoyage_host ?? '',
      href: products.nodevoyage?.demoUrl ?? 'https://nodevoyage.algorhythmics.dev/',
      cta: en.products?.demos?.nodevoyage ?? '',
      accent: 'voyage'
    },
    ideonautix: {
      title: en.products?.demos?.ideonautix ?? '',
      description: en.products?.demos?.ideonautix_description ?? '',
      host: products.ideonautix?.demoHost ?? en.products?.demos?.ideonautix_host ?? '',
      href: products.ideonautix?.demoUrl ?? 'https://ideonautix.algorhythmics.dev/',
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

  $: heroTitleChars = Array.from(heroTitle ?? '');
  $: heroSubtitleWords = heroSubtitle ? heroSubtitle.split(/\s+/).filter(Boolean) : [];

  $: catalogEntries = productKeys.reduce((acc, key) => {
    const fallback = fallbackProductCopy[key];
    const source = products[key];
    const name = ensureString($json?.(`products.${key}.name`), fallback.name);
    if (name.trim().length) {
      const fallbackDemo = fallbackDemoContent[key];
      const previewLabel = ensureString($json?.(`products.demos.${key}`), fallbackDemo.cta);
      const ctaLabel = ensureString($json?.(`products.${key}.cta`), fallback.cta);
      const buttonLabel = previewLabel || ctaLabel || `Visit ${name}`;
      acc.push({
        id: key,
        name,
        status: ensureString($json?.(`products.${key}.status`), fallback.status),
        tagline: ensureString($json?.(`products.${key}.tagline`), fallback.tagline),
        description: ensureString($json?.(`products.${key}.description`), fallback.description),
        mvp: ensureString($json?.(`products.${key}.mvp`), fallback.mvp),
        cta: ctaLabel,
        previewLabel,
        buttonLabel,
        buttonAriaLabel: `${buttonLabel} (opens in a new tab)`,
        demoHref: ensureString(source?.demoUrl, fallbackDemo.href),
        demoHost: ensureString(source?.demoHost, fallbackDemo.host),
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
        ).filter(
          /** @param {{ title: string }} feature */
          (feature) => feature.title
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
    previewLabel: string;
    buttonLabel: string;
    buttonAriaLabel: string;
    demoHref: string;
    demoHost: string;
    features: Array<{ id: string; icon: string; title: string; description: string }>;
  }>} */ ([]));

  $: demos = productKeys.reduce((acc, key) => {
    const fallback = fallbackDemoContent[key];
    const source = products[key];
    const titleValue = ensureString($json?.(`products.demos.${key}`), fallback.title);
    const descriptionValue = ensureString($json?.(`products.demos.${key}_description`), fallback.description);
    const hostValue = ensureString($json?.(`products.demos.${key}_host`), fallback.host);
    if (titleValue.trim().length || descriptionValue.trim().length) {
      acc.push({
        id: key,
        title: titleValue,
        description: descriptionValue,
        host: hostValue,
        href: ensureString(source?.demoUrl, fallback.href),
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
  class="hero hero--products hero--centered section"
  showAside={false}
  introReveal={{ delay: 40, stagger: 120 }}
>
  <svelte:fragment slot="status">
    {#if heroLabel}
      <span class="products-hero__label">{heroLabel}</span>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="backdrop">
    <HeroBackdrop
      variant="glass-parallax"
      tone="atlantic"
      intensity="bold"
      className="products-hero__backdrop"
    />
    <HeroBackdrop
      variant="line-sweep"
      tone="aurora"
      intensity="soft"
      className="products-hero__backdrop-sweep"
    />
  </svelte:fragment>
  <svelte:fragment slot="title">
    <h1 class="products-hero__headline heading-gradient" aria-label={heroTitle}>
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
  <p class="products-hero__description">{heroMission}</p>
  <div class="hero-actions">
    {#if heroPrimaryActionLabel}
      <a href="#demos" class="btn btn-gradient">{heroPrimaryActionLabel}</a>
    {/if}
    {#if heroSecondaryActionLabel}
      <a href="/contact" class="btn btn-secondary hover-lift">{heroSecondaryActionLabel}</a>
    {/if}
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
      {#each demos as demo (demo.id)}
        <ProductDemoPreview
          title={demo.title}
          description={demo.description}
          host={demo.host}
          href={demo.href}
          cta={demo.cta}
          accent={demo.accent}
        />
      {/each}
    </div>
  </div>
</section>

<section class="catalog section-sm" use:revealOnScroll>
  <div class="container">
    <div class="catalog-grid" use:staggerReveal={{ stagger: 160 }}>
      {#each catalogEntries as entry (entry.id)}
        <article class="catalog-card os-window" id={entry.id}>
          <header class="catalog-header">
            <span class="catalog-eyebrow">{entry.name}</span>
            {#if entry.status}
              <span class="badge-pill">{entry.status}</span>
            {/if}
          </header>

          <h2 class="catalog-tagline heading-gradient">{entry.tagline}</h2>
          <p>{entry.description}</p>

          <div class="catalog-meta">
            {#if entry.mvp}
              <span class="catalog-mvp">{entry.mvp}</span>
            {/if}
            {#if entry.demoHost}
              <span class="catalog-host">{entry.demoHost}</span>
            {/if}
          </div>

          {#if entry.features.length}
            <ul class="feature-pills">
              {#each entry.features as feature (feature.id)}
                <li>
                  <span class="feature-icon">
                    <Icon name={feature.icon} size={28} />
                  </span>
                  <div class="feature-text">
                    <span class="feature-title">{feature.title}</span>
                    {#if feature.description}
                      <span class="feature-description">{feature.description}</span>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}

          <div class="catalog-actions">
            <a
              class="btn btn-gradient"
              href={entry.demoHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={entry.buttonAriaLabel}
            >
              {entry.buttonLabel}
            </a>
          </div>
        </article>
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
    max-width: min(100%, var(--container-xl));
    margin: 0 auto;
    justify-items: center;
    text-align: center;
    position: relative;
  }

  :global(.hero--products .hero-wrapper__intro .hero-badge) {
    justify-self: center;
  }

  :global(.products-hero__backdrop),
  :global(.products-hero__backdrop-sweep) {
    position: absolute;
    inset: -22% -32% auto;
    height: clamp(18rem, 34vw, 26rem);
    pointer-events: none;
    z-index: -1;
  }

  :global(.products-hero__backdrop) {
    --hero-backdrop-opacity: 0.56;
    --hero-backdrop-blur: clamp(140px, 26vw, 220px);
  }

  :global(.products-hero__backdrop-sweep) {
    --hero-backdrop-opacity: 0.38;
    mix-blend-mode: screen;
  }

  :global([data-base-theme='dark'] .products-hero__backdrop) {
    --hero-backdrop-opacity: 0.48;
  }

  :global([data-base-theme='dark'] .products-hero__backdrop-sweep) {
    --hero-backdrop-opacity: 0.32;
  }

  .products-hero__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: clamp(0.45rem, 1.2vw, 0.65rem) clamp(1rem, 2.6vw, 1.5rem);
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-surface) 68%, rgba(var(--voyage-blue-rgb), 0.24) 32%);
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 55%, rgba(255, 255, 255, 0.55) 45%);
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.15);
    color: var(--heading-color);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  :global([data-base-theme='dark']) .products-hero__label {
    background: color-mix(in srgb, rgba(10, 16, 30, 0.88) 60%, rgba(var(--aurora-purple-rgb), 0.3) 40%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 62%, rgba(255, 255, 255, 0.16) 38%);
    box-shadow: 0 22px 52px rgba(2, 6, 18, 0.48);
    color: var(--text-primary);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .products-hero__label {
    background: rgba(0, 0, 0, 0.85);
    border-color: rgba(255, 255, 255, 0.72);
    color: var(--text-primary);
    box-shadow: 0 22px 48px rgba(0, 0, 0, 0.75);
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
    max-width: var(--measure-xl);
  }
  :global([data-base-theme='dark'])
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast']))
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
    width: min(100%, var(--container-md));
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

  .catalog-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.8rem;
    border-radius: var(--radius-full);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: var(--text-caption);
    font-weight: var(--weight-semibold);
    color: var(--heading-color);
    background: color-mix(in srgb, var(--bg-muted) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 65%, transparent);
  }

  .catalog-tagline {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    margin: 0;
  }

  .catalog-card p {
    color: var(--text-secondary);
    margin: 0;
  }

  .catalog-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
    margin-top: clamp(0.3rem, 1vw, 0.6rem);
    margin-bottom: clamp(0.4rem, 1.2vw, 0.8rem);
  }

  .catalog-mvp,
  .catalog-host {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 76%, transparent);
    color: var(--text-secondary);
    font-size: var(--text-small);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    font-variant-numeric: tabular-nums;
  }

  .catalog-host {
    font-family: 'Space Grotesk', var(--font-display);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .feature-pills {
    display: grid;
    gap: clamp(0.9rem, 2vw, 1.3rem);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .feature-pills li {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: clamp(0.9rem, 2vw, 1.2rem) clamp(1rem, 2.4vw, 1.6rem);
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--bg-muted) 74%, transparent);
    color: var(--text-secondary);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent);
    backdrop-filter: blur(18px);
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(2.4rem, 5vw, 2.9rem);
    height: clamp(2.4rem, 5vw, 2.9rem);
    border-radius: 50%;
    background: color-mix(in srgb, var(--voyage-blue) 12%, transparent 88%);
    color: var(--voyage-blue);
    filter: drop-shadow(0 4px 8px rgba(17, 24, 39, 0.12));
  }

  .feature-text {
    display: grid;
    gap: 0.3rem;
  }

  .feature-title {
    font-weight: var(--weight-semibold);
    color: var(--heading-color);
  }

  .feature-description {
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: var(--leading-normal);
  }

  .catalog-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-top: clamp(0.6rem, 1.6vw, 1.2rem);
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

  :global([data-base-theme='dark']) .demo-previews::before {
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.22), rgba(var(--aurora-purple-rgb), 0.18));
    opacity: 0.5;
  }

  :global([data-base-theme='dark']) .catalog-card {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(255, 255, 255, 0.12) 40%);
    box-shadow: var(--shadow-sm);
  }

  :global([data-base-theme='dark']) .catalog-eyebrow {
    background: color-mix(in srgb, rgba(12, 18, 30, 0.88) 70%, rgba(var(--voyage-blue-rgb), 0.3) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 62%, rgba(255, 255, 255, 0.14) 38%);
    color: rgba(226, 236, 255, 0.95);
  }

  :global([data-base-theme='dark']) .catalog-mvp,
  :global([data-base-theme='dark']) .catalog-host {
    background: color-mix(in srgb, rgba(10, 16, 30, 0.86) 68%, rgba(var(--voyage-blue-rgb), 0.32) 32%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 60%, rgba(255, 255, 255, 0.12) 40%);
    color: rgba(214, 226, 255, 0.92);
  }

  :global([data-base-theme='dark']) .feature-pills li {
    background: color-mix(in srgb, rgba(12, 18, 30, 0.88) 70%, rgba(var(--voyage-blue-rgb), 0.26) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(255, 255, 255, 0.1) 40%);
    color: rgba(214, 226, 255, 0.9);
  }

  :global([data-base-theme='dark']) .feature-description {
    color: rgba(196, 208, 242, 0.82);
  }

  :global([data-base-theme='dark']) .cta-card {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 60%, rgba(255, 255, 255, 0.12) 40%);
    box-shadow: var(--shadow-md);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .catalog-card {
    border-color: rgba(255, 255, 255, 0.85);
    box-shadow: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .catalog-eyebrow,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .catalog-mvp,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .catalog-host,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .feature-pills li {
    background: rgba(0, 0, 0, 0.88);
    border-color: rgba(255, 255, 255, 0.85);
    color: var(--text-primary);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .feature-title {
    color: var(--text-primary);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .feature-description {
    color: var(--text-secondary);
  }
</style>



