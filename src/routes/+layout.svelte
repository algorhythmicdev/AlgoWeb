<script lang="ts">
  import { onMount } from 'svelte';
  import '$lib/styles/theme.css';
  import '$lib/styles/global.css';
  import '$lib/styles/typography.css';
  import '$lib/styles/forms.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { initI18n, locale as localeStore } from '$lib/i18n';

  export let data: { locale?: string } = {};

  onMount(() => {
    void initI18n(data.locale ?? 'en');
  });

  $: activeLocale = data.locale ?? $localeStore ?? 'en';

  $: if (typeof document !== 'undefined') {
    document.documentElement.lang = activeLocale;
  }
</script>

<Navigation />

<slot />

<Footer />
