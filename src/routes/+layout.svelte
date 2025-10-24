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
  import { initI18n } from '$lib/i18n';
  import { page } from '$app/stores';
  import { applyTheme, cycleTheme, loadTheme, type Theme } from '$lib/theme';
  import { browser } from '$app/environment';

  export let data;

  const startLocale = data?.locale ?? 'en';
  let i18nReady = !browser;


  onMount(async () => {
    const savedTheme = loadTheme('light');
    currentTheme = applyTheme(savedTheme);
    await initI18n(startLocale);
    i18nReady = true;
  });

  let currentTheme: Theme = 'light';

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
      currentTheme = cycleTheme(currentTheme);
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

</script>

<svelte:window on:keydown={handleThemeToggleShortcut} />

<ParticleNetwork />

<div class="app">
  {#if i18nReady}
    <Navigation />

    <main id="main">
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
