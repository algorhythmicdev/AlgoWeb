<script>
  import { _, json } from 'svelte-i18n';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';
  import Hero from '$lib/components/Hero.svelte';
  import MagneticTiltCard from '$lib/components/MagneticTiltCard.svelte';
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

  const productVariants = {
    nodevoyage: 'halo',
    ideonautix: 'grid'
  };

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

  let spotlightEntries = [];
  $: spotlightEntries = catalogEntries.slice(0, 2);
</script>

<svelte:head>
  <title>{$_('products.meta_title')}</title>
  <meta name="description" content={$_('products.meta_description')} />
</svelte:head>

<Hero variant="halo" title={heroTitle} subtitle={heroSubtitle}>
  <div class="products-hero">
    <div class="products-hero__copy">
      {#if heroLabel}
        <span class="products-hero__eyebrow">{heroLabel}</span>
      {/if}
      {#if heroMission}
        <p class="products-hero__mission">{heroMission}</p>
      {/if}
      <div class="products-hero__actions">
        {#if heroPrimaryActionLabel}
          <a class="btn btn-gradient" href="#demos">{heroPrimaryActionLabel}</a>
        {/if}
        {#if heroSecondaryActionLabel}
          <a class="btn btn-secondary hover-lift" href="/contact">{heroSecondaryActionLabel}</a>
        {/if}
      </div>
    </div>

    {#if spotlightEntries.length}
      <div class="products-hero__spotlights">
        {#each spotlightEntries as entry (entry.id)}
          <MagneticTiltCard
            class="products-hero__card"
            data-variant={productVariants[entry.id] ?? 'halo'}
            interactive={false}
            id={`spotlight-${entry.id}`}
            aria-label={`${entry.name} overview`}
          >
            <header class="products-hero__card-header">
              <span class="products-hero__card-name">{entry.name}</span>
              {#if entry.status}
                <span class="badge-pill">{entry.status}</span>
              {/if}
            </header>
            <h3>{entry.tagline}</h3>
            <p>{entry.description}</p>
            <div class="products-hero__card-meta">
              {#if entry.mvp}
                <span>{entry.mvp}</span>
              {/if}
              {#if entry.demoHost}
                <span>{entry.demoHost}</span>
              {/if}
            </div>
            <div class="products-hero__card-actions">
              <a
                class="btn btn-secondary hover-lift"
                href={entry.demoHref}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={entry.buttonAriaLabel}
              >
                {entry.buttonLabel}
              </a>
              {#if entry.cta}
                <a class="products-hero__card-link" href={`#${entry.id}`}>
                  {entry.cta}
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              {/if}
            </div>
          </MagneticTiltCard>
        {/each}
      </div>
    {/if}
  </div>
</Hero>


<section class="products-demos section-sm" id="demos" use:revealOnScroll>
  <div class="container">
    <div class="products-demos__header" use:staggerReveal={{ stagger: 120 }}>
      <span class="products-demos__eyebrow text-gradient">{$_('products.demos.title')}</span>
      <h2>{showcaseTitle}</h2>
      <p>{showcaseSubtitle}</p>
    </div>
    <div class="products-demos__grid" use:staggerReveal={{ stagger: 160, selector: '.demo-preview' }}>
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

<section class="products-catalog section-sm" use:revealOnScroll>
  <div class="container">
    <div class="products-catalog__grid">
      {#each catalogEntries as entry, index (entry.id)}
        <MagneticTiltCard
          class="products-catalog__card"
          data-variant={productVariants[entry.id] ?? 'grid'}
          id={entry.id}
          staggerOptions={{ delay: 140 + index * 90 }}
        >
          <header class="products-catalog__header">
            <span class="products-catalog__eyebrow">{entry.name}</span>
            {#if entry.status}
              <span class="badge-pill">{entry.status}</span>
            {/if}
          </header>

          <h3 class="products-catalog__tagline">{entry.tagline}</h3>
          <p>{entry.description}</p>

          <div class="products-catalog__meta">
            {#if entry.mvp}
              <span>{entry.mvp}</span>
            {/if}
            {#if entry.demoHost}
              <span>{entry.demoHost}</span>
            {/if}
          </div>

          {#if entry.features.length}
            <ul class="products-catalog__features">
              {#each entry.features as feature (feature.id)}
                <li>
                  <span class="products-catalog__feature-icon">
                    <Icon name={feature.icon} size={26} />
                  </span>
                  <div class="products-catalog__feature-copy">
                    <span class="products-catalog__feature-title">{feature.title}</span>
                    {#if feature.description}
                      <span class="products-catalog__feature-description">{feature.description}</span>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}

          <div class="products-catalog__actions">
            <a
              class="btn btn-gradient"
              href={entry.demoHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={entry.buttonAriaLabel}
            >
              {entry.buttonLabel}
            </a>
            {#if entry.cta}
              <a class="products-catalog__secondary" href={`#spotlight-${entry.id}`}>
                {entry.cta}
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            {/if}
          </div>
        </MagneticTiltCard>
      {/each}
    </div>
  </div>
</section>

<section class="products-cta section" use:revealOnScroll>
  <div class="container">
    <MagneticTiltCard class="products-cta__card" data-variant="line" interactive={false}>
      <div class="products-cta__copy">
        <h2>{ctaTitle}</h2>
        <p>{ctaText}</p>
      </div>
      <div class="products-cta__actions">
        {#if ctaPrimaryLabel}
          <a href="/community" class="btn btn-gradient">{ctaPrimaryLabel}</a>
        {/if}
        {#if ctaSecondaryLabel}
          <a href="/contact" class="btn btn-secondary hover-lift">{ctaSecondaryLabel}</a>
        {/if}
      </div>
    </MagneticTiltCard>
  </div>
</section>

<style>
  .products-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: var(--grid-gap-2xl);
    align-items: stretch;
  }

  .products-hero__copy {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2.4rem);
    align-content: center;
  }

  .products-hero__eyebrow {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: color-mix(in srgb, var(--muted) 70%, transparent);
  }

  .products-hero__mission {
    max-width: 58ch;
    color: var(--text-secondary);
    font-size: clamp(1.1rem, 2.4vw, 1.35rem);
    line-height: 1.6;
  }

  .products-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .products-hero__spotlights {
    display: grid;
    gap: var(--grid-gap-xl);
  }

  :global(.products-hero__card) {
    display: grid;
    gap: clamp(1.1rem, 2.4vw, 1.8rem);
    padding: var(--card-padding-lg);
    min-height: 100%;
  }

  .products-hero__card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm, 0.75rem);
  }

  .products-hero__card-name {
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  :global(.products-hero__card) h3 {
    margin: 0;
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    line-height: 1.25;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  :global(.products-hero__card) p {
    margin: 0;
    color: var(--text-secondary);
  }

  .products-hero__card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 78%, transparent);
  }

  .products-hero__card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  .products-hero__card-actions .btn {
    flex-shrink: 0;
  }

  :global(.products-hero__card-link) {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: var(--text-small);
    color: var(--voyage-blue);
    text-decoration: none;
  }

  :global(.products-hero__card-link) svg {
    transition: transform 180ms var(--ease-in-out);
  }

  :global(.products-hero__card-link:hover) svg,
  :global(.products-hero__card-link:focus-visible) svg {
    transform: translateX(4px);
  }

  .products-demos__header {
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.4rem);
    max-width: min(72ch, 100%);
    margin: 0 auto var(--space-2xl, clamp(2rem, 5vw, 3rem));
    text-align: center;
  }

  .products-demos__header h2 {
    margin: 0;
  }

  .products-demos__header p {
    margin: 0;
    color: var(--text-secondary);
  }

  .products-demos__grid {
    display: grid;
    gap: var(--grid-gap-xl);
  }

  .products-catalog__grid {
    display: grid;
    gap: var(--grid-gap-2xl);
  }

  :global(.products-catalog__card) {
    display: grid;
    gap: clamp(1.2rem, 2.8vw, 2.2rem);
    padding: var(--card-padding-xl);
  }

  .products-catalog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm, 0.75rem);
  }

  .products-catalog__eyebrow {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--muted) 65%, transparent);
  }

  .products-catalog__tagline {
    margin: 0;
    font-size: clamp(1.55rem, 3vw, 2.2rem);
    line-height: 1.3;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  :global(.products-catalog__card) p {
    margin: 0;
    color: var(--text-secondary);
  }

  .products-catalog__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 75%, transparent);
  }

  .products-catalog__features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: clamp(0.85rem, 2vw, 1.4rem);
  }

  .products-catalog__features li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.9rem;
    align-items: start;
  }

  .products-catalog__feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.85rem;
    background: color-mix(in srgb, var(--grad-a) 18%, transparent);
    color: var(--grad-b);
  }

  .products-catalog__feature-copy {
    display: grid;
    gap: 0.35rem;
  }

  .products-catalog__feature-title {
    font-weight: 600;
  }

  .products-catalog__feature-description {
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 70%, transparent);
  }

  .products-catalog__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  .products-catalog__secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: var(--text-small);
    color: var(--voyage-blue);
    text-decoration: none;
  }

  .products-catalog__secondary svg {
    transition: transform 180ms var(--ease-in-out);
  }

  .products-catalog__secondary:hover svg,
  .products-catalog__secondary:focus-visible svg {
    transform: translateX(4px);
  }

  :global(.products-cta__card) {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    align-items: center;
    gap: var(--grid-gap-xl);
    padding: var(--card-padding-xl);
  }

  .products-cta__copy {
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }

  .products-cta__copy h2 {
    margin: 0;
  }

  .products-cta__copy p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1rem, 2vw, 1.2rem);
  }

  .products-cta__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    justify-content: flex-end;
  }

  @media (max-width: 1100px) {
    .products-hero {
      grid-template-columns: 1fr;
    }

    .products-hero__spotlights {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (max-width: 880px) {
    .products-demos__grid,
    .products-catalog__grid {
      gap: var(--grid-gap-xl);
    }

    :global(.products-catalog__card),
    :global(.products-hero__card) {
      padding: var(--card-padding-md);
    }

    :global(.products-cta__card) {
      grid-template-columns: 1fr;
      text-align: left;
    }

    .products-cta__actions {
      justify-content: flex-start;
    }
  }

  @media (max-width: 640px) {
    .products-hero__actions,
    .products-hero__card-actions,
    .products-catalog__actions,
    .products-cta__actions {
      flex-direction: column;
      align-items: stretch;
    }

    :global(.products-hero__card-link),
    :global(.products-catalog__secondary) {
      justify-content: center;
    }
  }
</style>
