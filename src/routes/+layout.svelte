<script>
  import '$lib/styles/theme.css';
  import '$lib/styles/layout-new.css';
  import '$lib/styles/scale.css';
  import '$lib/styles/reading.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ThemeToggle from '$lib/components/theme-toggle.svelte';
  import LanguageSwitcher from '$lib/components/language-switcher.svelte';
</script>

<div class="header surface-1 control">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-4)">
    <Navigation />
  </div>
</div>

<main class="surface-0">
  <slot />
</main>
<Footer />
