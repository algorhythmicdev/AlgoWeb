<script>
  import '$lib/styles/theme.css';
  import '$lib/styles/scale.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
</script>

<div class="header surface-1 control">
  <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-4)">
    <Navigation />
    <div style="display:flex;gap:.5rem;align-items:center">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  </div>
</div>

<div class="container surface-0"><slot /></div>
<Footer />
