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

<ProductsHero
  label={heroLabel}
  title={heroTitle}
  subtitle={heroSubtitle}
  mission={heroMission}
  products={heroProducts}
  primaryAction={{ href: '#demos', label: heroPrimaryActionLabel }}
  secondaryAction={{ href: '/contact', label: heroSecondaryActionLabel }}
/>

<ProductsShowcase title={showcaseTitle} subtitle={showcaseSubtitle} demos={demos} />

<ProductCatalog products={catalogEntries} />

<ProductsCTA
  title={ctaTitle}
  text={ctaText}
  primaryLabel={ctaPrimaryLabel}
  secondaryLabel={ctaSecondaryLabel}
  primaryHref="/community"
  secondaryHref="/contact"
/>
