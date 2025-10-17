<script>
  /**
   * Admin Layout (Phase 6 - Dashboard Structure)
   * Main layout for admin pages with navigation
   */
  import AdminNav from '$lib/components/AdminNav.svelte';
</script>

<svelte:head>
  <title>Admin Dashboard - AlgoRhythmics</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin-layout">
  <AdminNav />
  <main class="admin-main">
    <slot />
  </main>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
  }

  .admin-main {
    flex: 1;
    overflow: auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .admin-layout {
      flex-direction: column;
    }

    .admin-main {
      padding: 1rem;
    }
  }
</style>
