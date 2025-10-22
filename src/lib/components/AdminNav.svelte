<script>
  /**
   * Admin Navigation Component (Phase 6 - Dashboard UI)
   * Sidebar navigation for admin dashboard
   */
  import { page } from '$app/stores';
  import { _ } from '$lib/i18n';

  /**
   * @typedef {{ href: string; labelKey: string; icon: string }} NavItem
   */

  /** @type {NavItem[]} */
  const navItems = [
    { href: '/admin', labelKey: 'admin.nav.items.dashboard', icon: '📊' },
    { href: '/admin/posts', labelKey: 'admin.nav.items.posts', icon: '📝' },
    { href: '/admin/modules', labelKey: 'admin.nav.items.modules', icon: '📚' },
    { href: '/', labelKey: 'admin.nav.items.back', icon: '🏠' }
  ];

  /**
   * @param {string} href
   */
  function isActive(href) {
    return $page.url.pathname.startsWith(href);
  }
</script>

<nav class="admin-nav" aria-label="Admin navigation">
  <div class="admin-nav__header">
    <h2 class="admin-nav__title">{$_('admin.nav.title')}</h2>
  </div>
  
  <ul class="admin-nav__list">
    {#each navItems as item}
      <li>
        <a 
          href={item.href} 
          class="admin-nav__link"
          class:active={isActive(item.href)}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span class="admin-nav__icon" aria-hidden="true">{item.icon}</span>
          <span class="admin-nav__label">{$_(item.labelKey)}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .admin-nav {
    display: flex;
    flex-direction: column;
    width: 16rem;
    height: 100vh;
    background: var(--surface);
    border-right: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
    padding: 1.5rem 0;
  }

  .admin-nav__header {
    padding: 0 1.5rem 1.5rem;
    border-bottom: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
  }

  .admin-nav__title {
    font-size: var(--text-card-title);
    font-weight: 600;
    background: linear-gradient(
      135deg,
      var(--voyage-blue) 0%,
      var(--aurora-purple) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .admin-nav__list {
    list-style: none;
    padding: 1rem 0.5rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .admin-nav__link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: var(--text);
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: var(--text-meta);
  }

  .admin-nav__link:hover {
    background: color-mix(in srgb, var(--voyage-blue) 10%, transparent);
  }

  .admin-nav__link.active {
    background: linear-gradient(
      135deg,
      rgba(var(--voyage-blue-rgb), 0.15) 0%,
      rgba(var(--aurora-purple-rgb), 0.15) 100%
    );
    font-weight: 500;
  }

  .admin-nav__icon {
    font-size: var(--text-card-title);
  }

  .admin-nav__label {
    flex: 1;
  }

  @media (max-width: 768px) {
    .admin-nav {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
    }

    .admin-nav__list {
      flex-direction: row;
      overflow-x: auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .admin-nav__link {
      transition: none;
    }
  }
</style>
