<script>
  /**
   * Admin Dashboard Home (Phase 3 & 6)
   * Overview page with quick actions and stats
   */
  import Button from '$lib/components/Button.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import { _ } from '$lib/i18n';

  const quickActions = [
    {
      titleKey: 'admin.dashboard.quick_actions.items.new_post.title',
      descriptionKey: 'admin.dashboard.quick_actions.items.new_post.description',
      href: '/admin/posts/new',
      icon: '✍️'
    },
    {
      titleKey: 'admin.dashboard.quick_actions.items.new_module.title',
      descriptionKey: 'admin.dashboard.quick_actions.items.new_module.description',
      href: '/admin/modules/new',
      icon: '📚'
    },
    {
      titleKey: 'admin.dashboard.quick_actions.items.view_posts.title',
      descriptionKey: 'admin.dashboard.quick_actions.items.view_posts.description',
      href: '/admin/posts',
      icon: '📝'
    },
    {
      titleKey: 'admin.dashboard.quick_actions.items.view_modules.title',
      descriptionKey: 'admin.dashboard.quick_actions.items.view_modules.description',
      href: '/admin/modules',
      icon: '🎓'
    }
  ];

  const setupSteps = [
    'admin.dashboard.getting_started.steps.setup_strapi',
    'admin.dashboard.getting_started.steps.configure_env',
    'admin.dashboard.getting_started.steps.define_content',
    'admin.dashboard.getting_started.steps.start_creating'
  ];
</script>

<div class="admin-dashboard">
  <header class="dashboard-header">
    <h1>{$_('admin.dashboard.title')}</h1>
    <p class="dashboard-subtitle">{$_('admin.dashboard.subtitle')}</p>
  </header>

  <section class="dashboard-section">
    <h2>{$_('admin.dashboard.quick_actions.title')}</h2>
    <div class="quick-actions">
      {#each quickActions as action}
        <GlassCard class="action-card" interactive>
          <a href={action.href} class="action-link">
            <span class="action-icon" aria-hidden="true">{action.icon}</span>
            <h3 class="action-title">{$_(action.titleKey)}</h3>
            <p class="action-description">{$_(action.descriptionKey)}</p>
          </a>
        </GlassCard>
      {/each}
    </div>
  </section>

  <section class="dashboard-section">
    <h2>{$_('admin.dashboard.getting_started.title')}</h2>
    <GlassCard padding="lg">
      <div class="getting-started">
        <h3>{$_('admin.dashboard.getting_started.headline')}</h3>
        <p>{$_('admin.dashboard.getting_started.description')}</p>
        <ol class="setup-steps">
          {#each setupSteps as stepKey}
            <li>{$_(stepKey)}</li>
          {/each}
        </ol>
        <div class="actions">
          <Button href="/education-hub" variant="secondary">
            {$_('admin.dashboard.getting_started.cta')}
          </Button>
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
