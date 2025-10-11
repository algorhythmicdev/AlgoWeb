<script lang="ts">
  import '../app.css';
  import '../lib/styles/theme.css';
  import '../lib/styles/global.css';
  import Navigation from '$components/Navigation.svelte';
  import Footer from '$components/Footer.svelte';
  import AICompanion from '$components/AICompanion.svelte';
  import LoadingOverlay from '$components/LoadingOverlay.svelte';
  import ThemedBackground from '$components/ThemedBackground.svelte';
  import FloatingThemeSwitcher from '$components/FloatingThemeSwitcher.svelte';
  import '$lib/i18n';
  import { _ } from 'svelte-i18n';
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import en from '$lib/i18n/en.json';
  import { morphGradient } from '$lib/utils/animations';
  import { theme, availableThemes } from '$stores/theme';

  export let data;

  let cleanupMorphGradient: { destroy: () => void; };

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && availableThemes.includes(savedTheme)) {
      theme.set(savedTheme);
    }

    cleanupMorphGradient = morphGradient(document.documentElement, {
      colors: ['#6A38FF', '#1351FF', '#E0322C', '#FFD339'],
      speed: 20000 // A longer duration for a subtle, calm shift
    });
  });

  onDestroy(() => {
    if (cleanupMorphGradient) {
      cleanupMorphGradient.destroy();
    }
  });

  $: routeKey = $page.url.pathname;

  /** @type {Record<string, any>} */
  let metaData: { [key: string]: any } = {};
  $: metaData = /** @type {Record<string, any>} */ (data?.meta ?? {});

  const fallbackMeta = {
    title: en.seo?.default_title ?? `${en.site.title} — ${en.site.tagline}`,
    description: en.seo?.default_description ?? en.site.description,
    ogTitle: en.seo?.default_og_title ?? en.site.title,
    ogDescription: en.seo?.default_og_description ?? en.site.tagline,
    url: en.seo?.default_url ?? 'https://algorhythmics.com'
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

<svelte:window on:keydown={(e)=>{ if (e.key === 't') theme.toggle(); }} />

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

<FloatingThemeSwitcher />

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
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
