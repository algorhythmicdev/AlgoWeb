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
    label: en.platforms?.hero?.label ?? 'Platforms',
    title: en.platforms?.hero?.title ?? 'Platform lineup',
    subtitle: en.platforms?.hero?.subtitle ?? 'Two paths to AI mastery',
    description:
      en.platforms?.hero?.description ??
      'Step into the Ideonautix and NodeVoyage shells hosted on algorhythmics.dev.',
    primaryAction: en.platforms?.hero?.primary ?? 'Test-drive our previews',
    secondaryAction: en.platforms?.hero?.secondary ?? 'Book a chat',
    ctaTitle: en.platforms?.cta?.title ?? 'Stay close',
    ctaText:
      en.platforms?.cta?.text ??
      'Join the community for release news, pilot invites, and accessibility updates.',
    ctaPrimary: en.platforms?.cta?.primary ?? 'Join the community',
    ctaSecondary: en.platforms?.cta?.secondary ?? 'Book a chat'
  };

  const catalogCopy = /** @type {Record<string, any>} */ (en.platforms?.catalog ?? {});
  const demosCopy = /** @type {Record<string, any>} */ (en.platforms?.demos ?? {});

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
  const canonicalUrl = `${siteOrigin}/platforms`;

  /**
   * @param {unknown} value
   * @param {string} fallback
   */
  const ensureString = (value, fallback) =>
    typeof value === 'string' && value.trim().length ? value : fallback;

  $: heroLabel = ensureString($json?.('platforms.hero.label'), fallbackHero.label);
  $: heroTitle = ensureString($json?.('platforms.hero.title'), fallbackHero.title);
  $: heroSubtitle = ensureString($json?.('platforms.hero.subtitle'), fallbackHero.subtitle);
  $: heroDescription = ensureString($json?.('platforms.hero.description'), fallbackHero.description);
  $: heroPrimaryAction = ensureString($json?.('platforms.hero.primary'), fallbackHero.primaryAction);
  $: heroSecondaryAction = ensureString($json?.('platforms.hero.secondary'), fallbackHero.secondaryAction);

  $: ctaTitle = ensureString($json?.('platforms.cta.title'), fallbackHero.ctaTitle);
  $: ctaText = ensureString($json?.('platforms.cta.text'), fallbackHero.ctaText);
  $: ctaPrimaryLabel = ensureString($json?.('platforms.cta.primary'), fallbackHero.ctaPrimary);
  $: ctaSecondaryLabel = ensureString($json?.('platforms.cta.secondary'), fallbackHero.ctaSecondary);

  $: platforms = productKeys.map((key) => {
    const fallback = fallbackProducts[key];
    const product = /** @type {Record<string, any>} */ (productsData?.[key] ?? {});

    const featureEntries = /** @type {Array<{ id: string; icon: string }>} */ (product.features ?? []);

    const features = featureEntries.reduce(
      (list, feature) => {
        const fallbackFeature = fallback.features?.[feature.id] ?? {};
        const title = ensureString(
          $json?.(`platforms.catalog.${key}.features.${feature.id}.title`),
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
            $json?.(`platforms.catalog.${key}.features.${feature.id}.description`),
            fallbackFeature.description ?? ''
          )
        });

        return list;
      },
      /** @type {Array<{ id: string; icon: string; title: string; description: string }> } */ ([])
    );

    return {
      id: key,
      name: ensureString($json?.(`platforms.catalog.${key}.name`), fallback.name),
      tagline: ensureString($json?.(`platforms.catalog.${key}.tagline`), fallback.tagline),
      description: ensureString($json?.(`platforms.catalog.${key}.description`), fallback.description),
      status: ensureString($json?.(`platforms.catalog.${key}.status`), fallback.status),
      mvp: ensureString($json?.(`platforms.catalog.${key}.mvp`), fallback.mvp),
      cta: ensureString($json?.(`platforms.catalog.${key}.cta`), fallback.cta),
      demoHref: ensureString(product.demoUrl, fallback.demoHref),
      demoHost: ensureString(product.demoHost, fallback.demoHost),
      demoCta: ensureString($json?.(`platforms.demos.${key}`), fallback.demoCta),
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
    <span class="platforms-hero__status">{heroLabel}</span>
  </svelte:fragment>

  <svelte:fragment slot="description">
    {#if heroDescription}
      <p class="platforms-hero__description">{heroDescription}</p>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="platforms-hero__actions">
      {#if heroPrimaryAction}
        <Button href="#platforms-overview" variant="gradient" size="lg">
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

<section id="platforms-overview" class="platforms-overview">
  <div class="container">
    <div class="platforms-grid">
      {#each platforms as platform}
        <GlassCard
          as="article"
          id={platform.id}
          class="platform-card"
          halo={platform.accent === 'aurora'}
          particles={platform.accent !== 'aurora'}
          padding="lg"
        >
          <header class="platform-card__header">
            {#if platform.status}
              <span class="platform-card__status">{platform.status}</span>
            {/if}
            <h2 class="platform-card__title">{platform.name}</h2>
            {#if platform.tagline}
              <p class="platform-card__tagline">{platform.tagline}</p>
            {/if}
          </header>

          {#if platform.description}
            <p class="platform-card__description">{platform.description}</p>
          {/if}

          {#if platform.features.length}
            <ul class="platform-card__features">
              {#each platform.features as feature}
                <li class="platform-card__feature">
                  <span class="platform-card__feature-icon">
                    <Icon name={feature.icon} size="22" />
                  </span>
                  <div class="platform-card__feature-copy">
                    <span class="platform-card__feature-title">{feature.title}</span>
                    {#if feature.description}
                      <span class="platform-card__feature-description">{feature.description}</span>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}

          <div class="platform-card__actions">
            <Button
              href={platform.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="gradient"
              elevate
              aria-label={`${platform.demoCta || platform.cta || platform.name} (${platform.demoHost})`}
            >
              {platform.demoCta || platform.cta || platform.name}
            </Button>
            {#if platform.mvp}
              <span class="platform-card__meta">{platform.mvp}</span>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="platforms-cta">
  <div class="container">
    <GlassCard class="platforms-cta__surface" particles padding="lg">
      <div class="platforms-cta__copy">
        <h2>{ctaTitle}</h2>
        <p>{ctaText}</p>
      </div>
      <div class="platforms-cta__actions">
        {#if ctaPrimaryLabel}
          <Button href="/community" variant="gradient">{ctaPrimaryLabel}</Button>
        {/if}
        {#if ctaSecondaryLabel}
          <Button href="/contact" variant="secondary">{ctaSecondaryLabel}</Button>
        {/if}
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .platforms-hero__status {
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

  .platforms-hero__description {
    max-width: 60ch;
    margin: 0;
    font-size: clamp(1.05rem, 2.4vw, 1.3rem);
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .platforms-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .platforms-overview {
    padding: clamp(3.5rem, 8vw, 6.5rem) 0;
  }

  .platforms-grid {
    display: grid;
    gap: clamp(1.75rem, 4vw, 2.75rem);
  }

  :global(.platform-card) {
    display: grid;
    gap: clamp(1.1rem, 3vw, 1.8rem);
  }

  .platform-card__header {
    display: grid;
    gap: 0.75rem;
  }

  .platform-card__status {
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

  .platform-card__title {
    margin: 0;
    font-size: clamp(2rem, 4vw, 2.6rem);
  }

  .platform-card__tagline {
    margin: 0;
    font-size: clamp(1.2rem, 3vw, 1.45rem);
    color: var(--text-secondary);
  }

  .platform-card__description {
    margin: 0;
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .platform-card__features {
    list-style: none;
    display: grid;
    gap: clamp(0.9rem, 2vw, 1.2rem);
    margin: 0;
    padding: 0;
  }

  .platform-card__feature {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.8rem;
    align-items: start;
  }

  .platform-card__feature-icon {
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

  .platform-card__feature-title {
    display: block;
    font-weight: 600;
  }

  .platform-card__feature-description {
    display: block;
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 72%, transparent);
  }

  .platform-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  .platform-card__meta {
    font-size: var(--text-small);
    color: color-mix(in srgb, var(--text-secondary) 75%, transparent);
  }

  .platforms-cta {
    padding: clamp(3.75rem, 8vw, 6.5rem) 0;
  }

  :global(.platforms-cta__surface) {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2rem);
    align-items: center;
  }

  .platforms-cta__copy {
    display: grid;
    gap: 0.75rem;
  }

  .platforms-cta__copy h2 {
    margin: 0;
  }

  .platforms-cta__copy p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
  }

  .platforms-cta__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
  }

  @media (min-width: 960px) {
    .platforms-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :global(.platforms-cta__surface) {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.platform-card),
    :global(.platforms-cta__surface) {
      animation: none;
    }
  }
</style>
