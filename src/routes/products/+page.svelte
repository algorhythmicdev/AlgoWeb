<script>
  import { _, json } from 'svelte-i18n';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';
  import Hero from '$lib/components/Hero.svelte';
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

<Hero variant="halo" title="Products" subtitle="Ethereal radial halos, calm motion."></Hero>

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
