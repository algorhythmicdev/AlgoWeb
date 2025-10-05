<script>
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { navigation } from '$stores/navigation';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle.svelte';
  import { mainNavigation } from '$config/navigation';

  let isScrolled = false;

  $: currentPath = $page.url.pathname;

  function handleScroll() {
    const scrollY = window.scrollY;
    isScrolled = scrollY > 32;
    navigation.updateScroll(scrollY);
  }
</script>

<svelte:window on:scroll={handleScroll} />

<nav
  class="nav"
  class:nav-condensed={isScrolled}
  class:hidden={$navigation.scrollDirection === 'down' && $navigation.lastScrollY > 200}
>
  <div class="container nav-container">
    <a href="/" class="brand" aria-label={$_('nav.brand_aria')}>
      <img src="/images/brand/logo-main.webp" alt={$_('nav.brand_name')} width="148" height="40" />
    </a>

    <div class="nav-content">
      <div class="nav-links" class:open={$navigation.isMenuOpen}>
        {#each mainNavigation as item}
          <a
            href={item.href}
            class="nav-link"
            class:active={currentPath === item.href}
            on:click={() => navigation.closeMenu()}
          >
            <span>{$_(item.label)}</span>
            {#if item.badge}
              <span class="nav-badge">{$_(item.badge)}</span>
            {/if}
          </a>
        {/each}
      </div>

      <div class="nav-actions">
        <LanguageSwitcher />
        <ThemeToggle />
        <a href="/contact" class="nav-cta">{$_('nav.contact')}</a>
        <button class="menu-toggle" on:click={() => navigation.toggleMenu()} aria-label={$_('nav.toggle_menu')}>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </div>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-sticky);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border-subtle);
    transition: transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out);
  }

  .nav.hidden { transform: translateY(-100%); }

  .nav-condensed {
    box-shadow: 0 12px 24px rgba(15, 20, 25, 0.06);
    border-bottom-color: rgba(15, 20, 25, 0.08);
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 0;
  }

  .brand img { display: block; width: 148px; height: auto; }

  .nav-content {
    display: flex;
    align-items: center;
    gap: var(--space-6);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    gap: 0.35rem;
    align-items: center;
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    padding: 0.25rem 0;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover,
  .nav-link.active { color: var(--text-primary); }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -0.55rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--voyage-blue);
  }

  .nav-badge {
    font-size: var(--text-caption);
    color: var(--voyage-blue);
    background: rgba(19, 81, 255, 0.1);
    border-radius: var(--radius-full);
    padding: 0.1rem 0.45rem;
    font-weight: var(--weight-semibold);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .nav-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 1.2rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(19, 81, 255, 0.18);
    background: var(--bg-surface);
    background: color-mix(in srgb, var(--voyage-blue) 8%, transparent);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
    transition: all var(--duration-fast) var(--ease-out);
    backdrop-filter: blur(18px);
  }

  .nav-cta:hover {
    background: var(--voyage-blue);
    color: var(--pure-white);
    border-color: var(--voyage-blue);
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    padding: 0.4rem 0.35rem;
    border-radius: var(--radius-sm);
    background: transparent;
  }

  .menu-toggle span {
    width: 22px;
    height: 2px;
    background: var(--text-primary);
    transition: transform var(--duration-fast) var(--ease-out);
  }

  @media (max-width: 960px) {
    .nav-content { gap: var(--space-3); }
    .nav-links {
      position: fixed;
      top: 70px;
      left: 1.5rem;
      right: 1.5rem;
      flex-direction: column;
      align-items: stretch;
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-lg);
      transform: translateY(-20px);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-normal) var(--ease-out),
        transform var(--duration-normal) var(--ease-out);
    }

    .nav-links.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    .nav-link { font-size: 1.05rem; padding: 0.5rem 0; }

    .nav-actions { gap: var(--space-2); }

    .nav-cta { display: none; }

    .menu-toggle { display: inline-flex; }
  }
</style>
