<script>
  /**
   * Admin Dashboard Home (Phase 3 & 6)
   * Overview page with quick actions and stats
   */
  import Button from '$lib/components/Button.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';

  const quickActions = [
    { 
      title: 'New Blog Post', 
      href: '/admin/posts/new', 
      icon: '✍️',
      description: 'Create a new blog article'
    },
    { 
      title: 'New Module', 
      href: '/admin/modules/new', 
      icon: '📚',
      description: 'Add an educational module'
    },
    { 
      title: 'View Posts', 
      href: '/admin/posts', 
      icon: '📝',
      description: 'Manage blog posts'
    },
    { 
      title: 'View Modules', 
      href: '/admin/modules', 
      icon: '🎓',
      description: 'Manage learning content'
    }
  ];
</script>

<div class="admin-dashboard">
  <header class="dashboard-header">
    <h1>Dashboard</h1>
    <p class="dashboard-subtitle">Welcome to the AlgoRhythmics CMS</p>
  </header>

  <section class="dashboard-section">
    <h2>Quick Actions</h2>
    <div class="quick-actions">
      {#each quickActions as action}
        <GlassCard class="action-card" interactive>
          <a href={action.href} class="action-link">
            <span class="action-icon" aria-hidden="true">{action.icon}</span>
            <h3 class="action-title">{action.title}</h3>
            <p class="action-description">{action.description}</p>
          </a>
        </GlassCard>
      {/each}
    </div>
  </section>

  <section class="dashboard-section">
    <h2>Getting Started</h2>
    <GlassCard padding="lg">
      <div class="getting-started">
        <h3>Content Management System</h3>
        <p>
          This admin dashboard allows you to create and manage content for the AlgoRhythmics website.
          Before you can see live content, you need to:
        </p>
        <ol class="setup-steps">
          <li>Set up Strapi CMS backend (see README.md Phase 1 & 2)</li>
          <li>Configure environment variables in .env file</li>
          <li>Define content types in Strapi admin panel</li>
          <li>Start creating content!</li>
        </ol>
        <div class="actions">
          <Button href="/education-hub" variant="secondary">View Public Site</Button>
        </div>
      </div>
    </GlassCard>
  </section>
</div>

<style>
  .admin-dashboard {
    max-width: 80rem;
    margin: 0 auto;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h1 {
    font-size: clamp(2rem, 5vw, 2.5rem);
    margin-bottom: 0.5rem;
  }

  .dashboard-subtitle {
    color: color-mix(in srgb, var(--text) 70%, transparent);
    font-size: 1.1rem;
  }

  .dashboard-section {
    margin-bottom: 3rem;
  }

  .dashboard-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.5rem;
  }

  :global(.action-card) {
    height: 100%;
  }

  .action-link {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-decoration: none;
    color: inherit;
    height: 100%;
    padding: 1.5rem;
  }

  .action-icon {
    font-size: 2.5rem;
  }

  .action-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .action-description {
    color: color-mix(in srgb, var(--text) 70%, transparent);
    font-size: 0.95rem;
    margin: 0;
  }

  .getting-started {
    display: grid;
    gap: 1rem;
  }

  .getting-started h3 {
    font-size: 1.25rem;
    margin: 0;
  }

  .getting-started p {
    line-height: 1.6;
    color: color-mix(in srgb, var(--text) 85%, transparent);
  }

  .setup-steps {
    padding-left: 1.5rem;
    line-height: 1.8;
    color: color-mix(in srgb, var(--text) 85%, transparent);
  }

  .actions {
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
</style>
