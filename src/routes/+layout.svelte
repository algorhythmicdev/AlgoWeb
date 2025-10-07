<script>
  import '../app.css';
  import Navigation from '$components/Navigation.svelte';
  import Footer from '$components/Footer.svelte';
  import ThemedBackground from '$components/ThemedBackground.svelte';
  import AICompanion from '$components/AICompanion.svelte';
  import LoadingOverlay from '$components/LoadingOverlay.svelte';
  import '$lib/i18n';
  import { _, waitLocale } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { theme } from '$stores/theme';
  import { get } from 'svelte/store';
  import en from '$lib/i18n/en.json';
  
  export let data;

  $: routeKey = $page.url.pathname;

  /** @type {Record<string, any>} */
  let metaData = {};
  $: metaData = /** @type {Record<string, any>} */ (data?.meta ?? {});

  const localePromise = waitLocale();
  let localeReady = false;

  const fallbackMeta = {
    title: en.seo?.default_title ?? `${en.site.title} — ${en.site.tagline}`,
    description: en.seo?.default_description ?? en.site.description,
    ogTitle: en.seo?.default_og_title ?? en.site.title,
    ogDescription: en.seo?.default_og_description ?? en.site.tagline,
    url: en.seo?.default_url ?? 'https://algorhythmics.com'
  };

  const fallbackLoading = en.app.loading;
  let loadingMessage = fallbackLoading;
  /** @type {((key: string, options?: Record<string, any>) => string) | null} */
  let translateFn = null;

  let defaultMetaTitle = fallbackMeta.title;
  let defaultMetaDescription = fallbackMeta.description;
  let defaultOgTitle = fallbackMeta.ogTitle;
  let defaultOgDescription = fallbackMeta.ogDescription;
  let defaultMetaUrl = fallbackMeta.url;

  let metaTitle = defaultMetaTitle;
  let metaDescription = defaultMetaDescription;
  let ogTitle = defaultOgTitle;
  let ogDescription = defaultOgDescription;
  let metaUrl = defaultMetaUrl;

  /**
   * @param {string} key
   * @param {string} fallback
   */
  const safeTranslate = (key, fallback) => {
    if (!localeReady) return fallback;
    const t = translateFn;
    if (typeof t !== 'function') return fallback;
    try {
      const result = t(key);
      if (typeof result === 'string' && result.trim().length > 0) {
        return result;
      }
    } catch (error) {
      // Ignore and fall back to the provided string
    }
    return fallback;
  };

  $: translateFn = get(_);

  $: {
    if (localeReady && typeof translateFn === 'function') {
      try {
        defaultMetaTitle = translateFn('seo.default_title') || fallbackMeta.title;
        defaultMetaDescription = translateFn('seo.default_description') || fallbackMeta.description;
        defaultOgTitle = translateFn('seo.default_og_title') || fallbackMeta.ogTitle;
        defaultOgDescription = translateFn('seo.default_og_description') || fallbackMeta.ogDescription;
        defaultMetaUrl = translateFn('seo.default_url') || fallbackMeta.url;
      } catch (error) {
        defaultMetaTitle = fallbackMeta.title;
        defaultMetaDescription = fallbackMeta.description;
        defaultOgTitle = fallbackMeta.ogTitle;
        defaultOgDescription = fallbackMeta.ogDescription;
        defaultMetaUrl = fallbackMeta.url;
      }
    } else {
      defaultMetaTitle = fallbackMeta.title;
      defaultMetaDescription = fallbackMeta.description;
      defaultOgTitle = fallbackMeta.ogTitle;
      defaultOgDescription = fallbackMeta.ogDescription;
      defaultMetaUrl = fallbackMeta.url;
    }
  }

  $: metaTitle = metaData.title ?? (metaData.titleKey ? safeTranslate(metaData.titleKey, defaultMetaTitle) : defaultMetaTitle);

  $: metaDescription =
    metaData.description ??
    (metaData.descriptionKey ? safeTranslate(metaData.descriptionKey, defaultMetaDescription) : defaultMetaDescription);

  $: ogTitle =
    metaData.ogTitle ??
    (metaData.ogTitleKey ? safeTranslate(metaData.ogTitleKey, metaTitle ?? defaultOgTitle) : metaTitle ?? defaultOgTitle);

  $: ogDescription =
    metaData.ogDescription ??
    (metaData.ogDescriptionKey ? safeTranslate(metaData.ogDescriptionKey, defaultOgDescription) : defaultOgDescription);

  $: metaUrl = typeof metaData.url === 'string' && metaData.url.trim() ? metaData.url : defaultMetaUrl;

  localePromise
    .then(() => {
      localeReady = true;
      loadingMessage = safeTranslate('app.loading', fallbackLoading);
    })
    .catch(() => {
      localeReady = false;
      loadingMessage = fallbackLoading;
    });

  onMount(() => {
    // Initialize theme on mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.body.setAttribute('data-theme', savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  });
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
  <meta property="og:image" content="/og-image.png" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metaTitle} />
  <meta name="twitter:description" content={ogDescription} />
  <meta name="twitter:image" content="/og-image.png" />
</svelte:head>

<LoadingOverlay />

{#await localePromise}
  <div class="loading">
    <div class="spinner"></div>
    <p>{loadingMessage}</p>
  </div>
{:then}
  <ThemedBackground />

  <div class="app">
    <Navigation />
    
    <main>
      {#key routeKey}
        <slot />
      {/key}
    </main>
    
    <Footer />
  </div>
  <AICompanion />
{/await}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
  
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  main {
    flex: 1;
    padding-top: 80px;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: var(--space-4);
  }
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--bg-elevated);
    border-top-color: var(--voyage-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
