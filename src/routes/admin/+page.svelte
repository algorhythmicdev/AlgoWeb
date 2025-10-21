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
    width: min(100%, var(--container-xl));
    margin-inline: auto;
    padding-inline: clamp(var(--space-xl), 6vw, var(--space-4xl));
    padding-block: clamp(var(--space-2xl), 7vw, var(--space-5xl));
    display: grid;
    gap: var(--space-4xl);
  }

  .dashboard-header {
    display: grid;
    gap: var(--space-md);
  }

  .dashboard-header h1 {
    margin: 0;
    font-size: var(--text-headline);
    line-height: var(--leading-tight);
  }

  .dashboard-subtitle {
    color: var(--text-secondary);
    font-size: var(--text-body);
    margin: 0;
  }

  .dashboard-section {
    display: grid;
    gap: var(--grid-gap-xl);
  }

  .dashboard-section h2 {
    margin: 0;
    font-size: var(--text-title);
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--grid-min-card), 1fr));
    gap: var(--grid-gap-lg);
  }

  :global(.action-card) {
    height: 100%;
  }

  .action-link {
    display: flex;
    flex-direction: column;
    gap: var(--cluster-gap-md);
    text-decoration: none;
    color: inherit;
    height: 100%;
    padding: var(--component-padding-lg);
  }

  .action-icon {
    font-size: var(--text-headline);
  }

  .action-title {
    font-size: var(--text-headline);
    font-weight: var(--weight-semibold);
    margin: 0;
  }

  .action-description {
    color: var(--text-secondary);
    font-size: var(--text-meta);
    margin: 0;
    line-height: var(--leading-relaxed);
  }

  .getting-started {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  .getting-started h3 {
    margin: 0;
    font-size: var(--text-title);
  }

  .getting-started p {
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    margin: 0;
  }

  .setup-steps {
    padding-inline-start: var(--space-xl);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    display: grid;
    gap: var(--cluster-gap-sm);
  }

  .actions {
    margin-top: var(--space-md);
  }

  @media (max-width: 768px) {
    .quick-actions {
      grid-template-columns: 1fr;
    }
  }
</style>
