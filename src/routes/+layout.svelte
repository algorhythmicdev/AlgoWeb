<script>
  import '$lib/styles/theme.css';
  import '$lib/styles/tokens.css';
  import '$lib/styles/layout-new.css';
  import '$lib/styles/scale.css';
  import '$lib/styles/reading.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ThemeToggle from '$lib/components/theme-toggle.svelte';
  import LanguageSwitcher from '$lib/components/language-switcher.svelte';
</script>

<div class="header surface-1 control">
  <div class="container header-content">
    <Navigation />
  </div>
</div>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky, 100);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 0;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .header {
      transition: transform var(--anim-fast, 200ms) var(--ease-apple, ease);
    }
  }
</style>

<main class="surface-0">
  <slot />
</main>
<Footer />
