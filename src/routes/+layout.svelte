<script lang="ts">
  import '$lib/styles/theme.css';
  import '$lib/styles/global.css';
  import '$lib/styles/typography.css';
  import '$lib/styles/forms.css';
  import '$lib/styles/animations.css';
  import '$lib/styles/layout-grid.css';
  import '$lib/styles/reading.css';
  import Navigation from '$components/Navigation.svelte';
  import Footer from '$components/Footer.svelte';
  import ParticleNetwork from '$components/ParticleNetwork.svelte';
  import { onMount } from 'svelte';
  import { _, initI18n } from '$lib/i18n';
  import { page } from '$app/stores';
  import en from '$lib/translations/en.json';
  import { theme, availableThemes } from '$stores/theme';
  import { browser } from '$app/environment';
  import { siteConfig } from '$lib/config/seo';

  export let data;

  const startLocale = data?.locale ?? 'en';
  let i18nReady = !browser;


  const isTheme = (value: string): value is (typeof availableThemes)[number] =>
    availableThemes.includes(value as (typeof availableThemes)[number]);

  onMount(async () => {
    await initI18n(startLocale);
    i18nReady = true;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && isTheme(savedTheme)) {
      theme.set(savedTheme);
    }
  });

  function handleThemeToggleShortcut(event: KeyboardEvent) {
    const target = event.target;
    const isEditable =
      target instanceof Element &&
      target.closest('input, textarea, [contenteditable]');

    if (
      event.key === 't' &&
      !document.body.classList.contains('modal-open') &&
      !isEditable
    ) {
      theme.toggle();
    }
  }

  $: routeKey = $page.url.pathname;

  const accentClassForPath = (pathname: string): string => {
    if (pathname === '/') return 'page-home';
    if (pathname.startsWith('/products')) return 'page-products';
    if (pathname.startsWith('/services') || pathname.startsWith('/solutions')) return 'page-services';
    if (pathname.startsWith('/consulting')) return 'page-consulting';
    if (pathname.startsWith('/educational-outreach')) return 'page-outreach';
    if (pathname.startsWith('/education')) return 'page-education';
    if (pathname.startsWith('/about')) return 'page-about';
    if (pathname.startsWith('/education-hub') || pathname.startsWith('/resources')) return 'page-education-hub';
    if (pathname.startsWith('/help-center')) return 'page-support';
    if (pathname.startsWith('/nodevoyage')) return 'page-nodevoyage';
    if (pathname.startsWith('/ideonautix')) return 'page-ideonautix';
    if (pathname.startsWith('/contact')) return 'page-contact';
    return 'page-generic';
  };

  $: currentAccentClass = accentClassForPath($page.url.pathname);

  $: if (browser) {
    document.body.classList.remove(
      'page-home',
      'page-products',
      'page-services',
      'page-consulting',
      'page-education',
      'page-outreach',
      'page-about',
      'page-education-hub',
      'page-contact',
      'page-support',
      'page-nodevoyage',
      'page-ideonautix',
      'page-generic'
    );
    document.body.classList.add(currentAccentClass);
  }

  /** @type {Record<string, any>} */
  let metaData: { [key: string]: any } = {};
  $: metaData = /** @type {Record<string, any>} */ (data?.meta ?? {});

  const fallbackMeta = {
    title: en.seo?.default_title ?? `${en.site.title} â€” ${en.site.tagline}`,
    description: en.seo?.default_description ?? en.site.description,
    ogTitle: en.seo?.default_og_title ?? en.site.title,
    ogDescription: en.seo?.default_og_description ?? en.site.tagline,
    url: en.seo?.default_url ?? siteConfig.url
  };

  let defaultMetaTitle = fallbackMeta.title;
  let defaultMetaDescription = fallbackMeta.description;
  let defaultOgTitle = fallbackMeta.ogTitle;
  let defaultOgDescription = fallbackMeta.ogDescription;
  let defaultMetaUrl = fallbackMeta.url;

  $: defaultMetaTitle = $_('seo.default_title') || fallbackMeta.title;
  $: defaultMetaDescription = $_('seo.default_description') || fallbackMeta.description;
  $: defaultOgTitle = $_('seo.default_og_title') || fallbackMeta.ogTitle;
  $: defaultOgDescription = $_('seo.default_og_description') || fallbackMeta.ogDescription;
  $: defaultMetaUrl = $_('seo.default_url') || fallbackMeta.url;

  $: metaTitle = metaData.title ?? (metaData.titleKey ? $_(metaData.titleKey) : defaultMetaTitle);
  $: metaDescription =
    metaData.description ?? (metaData.descriptionKey ? $_(metaData.descriptionKey) : defaultMetaDescription);
  $: ogTitle = metaData.ogTitle ?? (metaData.ogTitleKey ? $_(metaData.ogTitleKey) : metaTitle ?? defaultOgTitle);
  $: ogDescription =
    metaData.ogDescription ?? (metaData.ogDescriptionKey ? $_(metaData.ogDescriptionKey) : defaultOgDescription);
  $: metaUrl = typeof metaData.url === 'string' && metaData.url.trim() ? metaData.url : defaultMetaUrl;
  const ogImageUrl = siteConfig.ogImage;
</script>

<svelte:head>
  <title>{metaTitle}</title>
  <meta name="description" content={metaDescription} />
  {#if data?.meta?.keywords}
    <meta name="keywords" content={data.meta.keywords.join(', ')} />
  {/if}
  
  <!-- Open Graph -->
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={metaUrl} />
  <meta property="og:image" content={ogImageUrl} />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metaTitle} />
  <meta name="twitter:description" content={ogDescription} />
  <meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

<svelte:window on:keydown={handleThemeToggleShortcut} />

<ParticleNetwork />

<div class="app">
  <a class="skip-link" href="#main-content">{$_('nav.skip_to_content') || 'Skip to content'}</a>
  {#if i18nReady}
    <Navigation />

    <main id="main-content">
      {#key routeKey}
        <slot />
      {/key}
    </main>

    <Footer />
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
  
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: var(--z-base);
    isolation: isolate;
  }

  .skip-link {
    position: absolute;
    top: var(--skip-link-inset);
    left: var(--skip-link-inset);
    padding-block: var(--skip-link-padding-block);
    padding-inline: var(--skip-link-padding-inline);
    border-radius: var(--radius-md);
    background: var(--bg-elev-1);
    color: var(--text);
    border: 1px solid var(--border);
    transform: translateY(-200%);
    transition: transform 0.2s ease;
    z-index: var(--z-overlay);
  }

  .skip-link:focus {
    transform: translateY(0);
    outline: 3px solid var(--focus-ring-color);
    outline-offset: 4px;
  }

  main {
    flex: 1;
    padding-block-start: var(--layout-main-padding-top);
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
