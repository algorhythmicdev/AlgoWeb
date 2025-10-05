<script>
  import '../app.css';
  import Navigation from '$components/navigation.svelte';
  import Footer from '$components/footer.svelte';
  import ThemedBackground from '$components/themed-background.svelte';
  import LoadingSpinner from '$components/loading-spinner.svelte';
  import '$lib/i18n';
  import { waitLocale } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { theme } from '$stores/theme';
  
  export let data;
  
  onMount(() => {
    // Initialize theme on mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.body.setAttribute('data-theme', savedTheme);
    }
  });
</script>

<svelte:head>
  <title>{data?.meta?.title || 'AlgoRhythmics - Where Logic Dances with Creativity'}</title>
  <meta name="description" content={data?.meta?.description || 'AI innovation lab creating NodeVoyage travel platform and Ideonautix productivity suite.'} />
  {#if data?.meta?.keywords}
    <meta name="keywords" content={data.meta.keywords.join(', ')} />
  {/if}
  
  <!-- Open Graph -->
  <meta property="og:title" content={data?.meta?.title || 'AlgoRhythmics'} />
  <meta property="og:description" content={data?.meta?.description || 'Where Logic Dances with Creativity'} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={data?.meta?.url || 'https://algorhythmics.com'} />
  <meta property="og:image" content="/og-image.png" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data?.meta?.title || 'AlgoRhythmics'} />
  <meta name="twitter:description" content={data?.meta?.description || 'Where Logic Dances with Creativity'} />
  <meta name="twitter:image" content="/og-image.png" />
</svelte:head>

<LoadingSpinner />

{#await waitLocale()}
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>
{:then}
  <ThemedBackground />
  
  <div class="app">
    <Navigation />
    
    <main>
      <slot />
    </main>
    
    <Footer />
  </div>
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
