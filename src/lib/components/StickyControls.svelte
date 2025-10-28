<script lang="ts">
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
</script>

<div class="sticky-dock" aria-label="Display controls">
  <LanguageSwitcher />
  <ThemeToggle />
</div>

<style>
  .sticky-dock{
    position: sticky;
    top: .75rem;
    display: grid;
    gap: .5rem;
  }
  @media (max-width: 900px){
    .sticky-dock{ position: static; }
  }
</style>
