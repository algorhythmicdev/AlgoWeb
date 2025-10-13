<script>
  import { json } from 'svelte-i18n';
  import Hero from '$lib/components/Hero.svelte';
  import { Button, GlassCard, Icon } from '$lib/components';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';

  const productKeys = /** @type {const} */ (['nodevoyage', 'ideonautix']);

  const accentMap = /** @type {const} */ ({
    nodevoyage: 'voyage',
    ideonautix: 'aurora'
  });

  const fallbackHero = {
    label: en.products?.hero?.label ?? 'Products',
    title: en.products?.hero?.title ?? 'Product lineup',
    subtitle: en.products?.hero?.subtitle ?? 'Two paths to AI mastery',
    description:
      en.products?.hero?.description ??
      'Step into Ideonautix and NodeVoyage inside one calm, glassy studio shell.',
    primaryAction: en.products?.hero?.primary ?? 'Test-drive our previews',
    secondaryAction: en.products?.hero?.secondary ?? 'Book a chat',
    ctaTitle: en.products?.cta?.title ?? 'Stay close',
    ctaText:
      en.products?.cta?.text ??
      'Join the community for release news, pilot invites, and accessibility updates.',
    ctaPrimary: en.products?.cta?.primary ?? 'Join the community',
    ctaSecondary: en.products?.cta?.secondary ?? 'Book a chat'
  };

  const catalogCopy = /** @type {Record<string, any>} */ (en.products?.catalog ?? {});
  const demosCopy = /** @type {Record<string, any>} */ (en.products?.demos ?? {});

  const fallbackProducts = productKeys.reduce(
    (acc, key) => {
      const productCopy = /** @type {Record<string, any>} */ (catalogCopy?.[key] ?? {});
      const productData = /** @type {Record<string, any>} */ (productsData?.[key] ?? {});
      const featureCopy = /** @type {Record<string, { title?: string; description?: string }>} */ (
        productCopy.features ?? {}
      );

      acc[key] = {
        name: productCopy.name ?? '',
        tagline: productCopy.tagline ?? '',
        description: productCopy.description ?? '',
        status: productCopy.status ?? '',
        mvp: productCopy.mvp ?? '',
        cta: productCopy.cta ?? '',
        demoHref: productData.demoUrl ?? '',
        demoHost: productData.demoHost ?? demosCopy?.[`${key}_host`] ?? '',
        demoCta: demosCopy?.[key] ?? productCopy.cta ?? '',
        features: featureCopy,
        icon: productData.icon ?? '',
        accent: accentMap[key] ?? 'voyage'
      };

      return acc;
    },
    /** @type {Record<string, { name: string; tagline: string; description: string; status: string; mvp: string; cta: string; demoHref: string; demoHost: string; demoCta: string; features: Record<string, { title?: string; description?: string }>; icon: string; accent: string }>} */ ({})
  );

  const siteOrigin = (en.seo?.default_url ?? 'https://algorhythmics.com').replace(/\/$/, '');
  const canonicalUrl = `${siteOrigin}/products`;

  /**
   * @param {unknown} value
   * @param {string} fallback
   */
  const ensureString = (value, fallback) =>
    typeof value === 'string' && value.trim().length ? value : fallback;

  $: heroLabel = ensureString($json?.('products.hero.label'), fallbackHero.label);
  $: heroTitle = ensureString($json?.('products.hero.title'), fallbackHero.title);
  $: heroSubtitle = ensureString($json?.('products.hero.subtitle'), fallbackHero.subtitle);
  $: heroDescription = ensureString($json?.('products.hero.description'), fallbackHero.description);
  $: heroPrimaryAction = ensureString($json?.('products.hero.primary'), fallbackHero.primaryAction);
  $: heroSecondaryAction = ensureString($json?.('products.hero.secondary'), fallbackHero.secondaryAction);

  $: ctaTitle = ensureString($json?.('products.cta.title'), fallbackHero.ctaTitle);
  $: ctaText = ensureString($json?.('products.cta.text'), fallbackHero.ctaText);
  $: ctaPrimaryLabel = ensureString($json?.('products.cta.primary'), fallbackHero.ctaPrimary);
  $: ctaSecondaryLabel = ensureString($json?.('products.cta.secondary'), fallbackHero.ctaSecondary);

  $: productEntries = productKeys.map((key) => {
    const fallback = fallbackProducts[key];
    const product = /** @type {Record<string, any>} */ (productsData?.[key] ?? {});

    const featureEntries = /** @type {Array<{ id: string; icon: string }>} */ (product.features ?? []);

    const features = featureEntries.reduce(
      (list, feature) => {
        const fallbackFeature = fallback.features?.[feature.id] ?? {};
        const title = ensureString(
          $json?.(`products.catalog.${key}.features.${feature.id}.title`),
          fallbackFeature.title ?? ''
        );

        if (!title) {
          return list;
        }

        list.push({
          id: feature.id,
          icon: feature.icon,
          title,
          description: ensureString(
            $json?.(`products.catalog.${key}.features.${feature.id}.description`),
            fallbackFeature.description ?? ''
          )
        });

        return list;
      },
      /** @type {Array<{ id: string; icon: string; title: string; description: string }> } */ ([])
    );

    return {
      id: key,
      name: ensureString($json?.(`products.catalog.${key}.name`), fallback.name),
      tagline: ensureString($json?.(`products.catalog.${key}.tagline`), fallback.tagline),
      description: ensureString($json?.(`products.catalog.${key}.description`), fallback.description),
      status: ensureString($json?.(`products.catalog.${key}.status`), fallback.status),
      mvp: ensureString($json?.(`products.catalog.${key}.mvp`), fallback.mvp),
      cta: ensureString($json?.(`products.catalog.${key}.cta`), fallback.cta),
      demoHref: ensureString(product.demoUrl, fallback.demoHref),
      demoHost: ensureString(product.demoHost, fallback.demoHost),
      demoCta: ensureString($json?.(`products.demos.${key}`), fallback.demoCta),
      icon: fallback.icon,
      accent: fallback.accent,
      features
    };
  });
</script>

<svelte:head>
  <link rel="canonical" href={canonicalUrl} />
</svelte:head>

<Hero variant="grid" title={heroTitle} subtitle={heroSubtitle}>
  <svelte:fragment slot="status">
    <span class="products-hero__status">{heroLabel}</span>
  </svelte:fragment>

  <svelte:fragment slot="description">
    {#if heroDescription}
      <p class="products-hero__description">{heroDescription}</p>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="products-hero__actions">
      {#if heroPrimaryAction}
        <Button href="#products-overview" variant="gradient" size="lg">
          {heroPrimaryAction}
        </Button>
      {/if}
      {#if heroSecondaryAction}
        <Button href="/contact" variant="secondary" size="lg">
          {heroSecondaryAction}
        </Button>
      {/if}
    </div>
  </svelte:fragment>
</Hero>

<section id="products-overview" class="products-overview">
  <div class="container">
    <div class="products-grid">
      {#each productEntries as product}
        <GlassCard
          as="article"
          id={product.id}
          class="products-card"
          halo={product.accent === 'aurora'}
          particles={product.accent !== 'aurora'}
          padding="lg"
        >
          <header class="products-card__header">
            {#if product.status}
              <span class="products-card__status">{product.status}</span>
            {/if}
            <h2 class="products-card__title">{product.name}</h2>
            {#if product.tagline}
              <p class="products-card__tagline">{product.tagline}</p>
            {/if}
          </header>

          {#if product.description}
            <p class="products-card__description">{product.description}</p>
          {/if}

          {#if product.features.length}
            <ul class="products-card__features">
              {#each product.features as feature}
                <li class="products-card__feature">
                  <span class="products-card__feature-icon">
                    <Icon name={feature.icon} size="22" />
                  </span>
                  <div class="products-card__feature-copy">
                    <h3>{feature.title}</h3>
                    {#if feature.description}
                      <p>{feature.description}</p>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}

          <footer class="products-card__footer">
            <div class="products-card__meta">
              {#if product.demoHost}
                <span>{product.demoHost}</span>
              {/if}
              {#if product.mvp}
                <span>{product.mvp}</span>
              {/if}
            </div>

            <div class="products-card__actions">
              {#if product.cta}
                <Button href={`/products#${product.id}`} size="lg" variant="secondary">
                  {product.cta}
                </Button>
              {/if}

              {#if product.demoHref}
                <Button href={product.demoHref} target="_blank" rel="noreferrer" size="lg" variant="subtle">
                  {product.demoCta}
                </Button>
              {/if}
            </div>
          </footer>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="products-cta">
  <div class="container">
    <GlassCard class="products-cta__surface" particles padding="lg">
      <div class="products-cta__copy">
        <h2>{ctaTitle}</h2>
        <p>{ctaText}</p>
      </div>
      <div class="products-cta__actions">
        {#if ctaPrimaryLabel}
          <Button href="/resources" variant="gradient">{ctaPrimaryLabel}</Button>
        {/if}
        {#if ctaSecondaryLabel}
          <Button href="/contact" variant="secondary">{ctaSecondaryLabel}</Button>
        {/if}
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .products-hero__status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.28) 12%);
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 65%, rgba(255, 255, 255, 0.3) 35%);
  }

  .products-hero__description {
    max-width: 60ch;
    margin: 0;
    font-size: clamp(1.05rem, 2.4vw, 1.3rem);
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .products-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .products-overview {
    padding: clamp(3.5rem, 8vw, 6.5rem) 0;
  }

  .products-grid {
    display: grid;
    gap: clamp(1.75rem, 4vw, 2.75rem);
  }

  :global(.products-card) {
    display: grid;
    gap: clamp(1.1rem, 3vw, 1.8rem);
  }

  .products-card__header {
    display: grid;
    gap: 0.75rem;
  }

  .products-card__status {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text) 82%, rgba(var(--voyage-blue-rgb), 0.2) 18%);
    background: color-mix(in srgb, var(--bg) 84%, rgba(var(--voyage-blue-rgb), 0.22) 16%);
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.38) 68%, rgba(255, 255, 255, 0.32) 32%);
  }

  .products-card__title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 2.6rem);
  }

  .products-card__tagline {
    margin: 0;
    font-size: clamp(1.2rem, 3vw, 1.45rem);
    color: var(--text-secondary);
  }

  .products-card__description {
    margin: 0;
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .products-card__features {
    list-style: none;
    display: grid;
    gap: clamp(0.9rem, 2vw, 1.2rem);
    margin: 0;
    padding: 0;
  }

  .products-card__feature {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.8rem;
    align-items: start;
  }

  .products-card__feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.9rem;
    border: 1px solid var(--surface-pill-border, color-mix(in srgb, var(--border) 70%, transparent));
    background: color-mix(in srgb, var(--surface-pill-bg, var(--bg-elev-2)) 76%, rgba(var(--voyage-blue-rgb), 0.18) 24%);
    box-shadow: var(--surface-pill-shadow, 0 10px 24px rgba(15, 23, 42, 0.12));
    color: color-mix(in srgb, var(--grad-b) 65%, var(--text) 35%);
  }

  .products-card__feature-copy {
    display: grid;
    gap: 0.25rem;
  }

  .products-card__feature-copy h3 {
    margin: 0;
    font-weight: 600;
  }

  .products-card__feature-copy p {
    margin: 0;
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 72%, transparent);
  }

  .products-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  .products-card__meta {
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 75%, transparent);
  }

  .products-cta {
    padding: clamp(3.75rem, 8vw, 6.5rem) 0;
  }

  :global(.products-cta__surface) {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2rem);
    align-items: center;
  }

  .products-cta__copy {
    display: grid;
    gap: 0.75rem;
  }

  .products-cta__copy h2 {
    margin: 0;
  }

  .products-cta__copy p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
  }

  .products-cta__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
  }

  @media (min-width: 960px) {
    .products-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :global(.products-cta__surface) {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.products-card),
    :global(.products-cta__surface) {
      animation: none;
    }
  }
</style>
