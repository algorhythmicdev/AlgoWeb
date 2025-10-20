<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onDestroy, onMount, tick } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { Button } from '$lib/components';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle-dropdown.svelte';
  import { mainNavigation } from '$config/navigation';

  let menuOpen = false;
  let activeDropdown: number | null = null;
  let openMobileGroup: number | null = null;
  let mobileMenu: HTMLElement | null = null;
  let menuControl: HTMLButtonElement | null = null;

  $: currentPath = $page.url.pathname;

  const isRouteActive = (item: (typeof mainNavigation)[number]) => {
    if (!item) return false;
    if (currentPath === item.href) return true;
    if (item.href !== '/' && currentPath.startsWith(item.href)) return true;
    return item.children?.some((child) => currentPath === child.href || currentPath.startsWith(child.href)) ?? false;
  };

  async function toggleMenu() {
    menuOpen = !menuOpen;
    if (menuOpen) {
      activeDropdown = null;
      openMobileGroup = null;
      await tick();
      mobileMenu?.focus();
    }
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    activeDropdown = null;
    openMobileGroup = null;
    if (browser) {
      document.body.style.overflow = '';
      tick().then(() => {
        menuControl?.focus();
      });
    }
  }

  $: if (browser) {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  function handleLinkFollow() {
    closeMenu();
  }

  function toggleDesktopDropdown(index: number) {
    activeDropdown = activeDropdown === index ? null : index;
  }

  function toggleMobileDropdown(index: number) {
    openMobileGroup = openMobileGroup === index ? null : index;
  }

  onMount(() => {
    if (!browser) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (menuOpen) {
          event.preventDefault();
          closeMenu();
        } else if (activeDropdown !== null) {
          event.preventDefault();
          activeDropdown = null;
        }
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 960) {
        menuOpen = false;
        activeDropdown = null;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', handleResize);
    };
  });

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = '';
    }
  });
</script>

<header class="site-header">
  <div class="site-header__inner">
    <a href="/" class="brand" aria-label={$_('nav.brand_aria')}>
      <img src="/images/brand/logo-main.svg" alt={$_('nav.brand_name')} width="148" height="40" />
      <span class="brand__text">{$_('nav.brand_name')}</span>
    </a>

    <nav class="desktop-nav" aria-label={$_('nav.primary_label')}>
      <ul class="desktop-nav__list">
        {#each mainNavigation as item, index}
          <li class:has-children={item.children?.length}>
            {#if item.children?.length}
              <button
                type="button"
                class="desktop-nav__trigger"
                aria-haspopup="true"
                aria-expanded={activeDropdown === index}
                on:click={() => toggleDesktopDropdown(index)}
              >
                <span>{$_(item.label)}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.5 5.5 8 10l4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
              {#if activeDropdown === index}
                <div class="desktop-nav__dropdown">
                  <ul>
                    {#each item.children as child}
                      <li>
                        <a href={child.href} on:click={handleLinkFollow} class="desktop-nav__dropdown-link">
                          <span class="desktop-nav__dropdown-title">{$_(child.label)}</span>
                          {#if child.description}
                            <span class="desktop-nav__dropdown-description">{$_(child.description)}</span>
                          {/if}
                        </a>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
            {:else}
              <a href={item.href} class="desktop-nav__link" class:active={isRouteActive(item)}>{$_(item.label)}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="site-header__actions">
      <div class="site-header__utility">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div class="site-header__cta">
        <Button href="/contact" variant="gradient" elevate on:click={handleLinkFollow}>
          {$_('nav.talk_to_us')}
        </Button>
      </div>
      <button
        type="button"
        class="menu-button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        on:click={toggleMenu}
        bind:this={menuControl}
      >
        <span class="sr-only">{$_('nav.toggle_menu') ?? 'Toggle menu'}</span>
        <span aria-hidden="true"></span>
      </button>
    </div>
  </div>
</header>

{#if menuOpen}
  <div class="mobile-overlay" aria-hidden="true" on:click={closeMenu}></div>

  <div
    class="mobile-menu"
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label={$_('nav.primary_label')}
    tabindex="-1"
    bind:this={mobileMenu}
  >
    <div class="mobile-menu__header">
      <a href="/" class="brand" on:click={handleLinkFollow}>
        <img src="/images/brand/logo-main.svg" alt={$_('nav.brand_name')} width="120" height="32" />
      </a>
      <button type="button" class="mobile-menu__close" on:click={closeMenu}>
        <span class="sr-only">{$_('nav.close_menu') ?? 'Close menu'}</span>
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <nav aria-label={$_('nav.primary_label')} class="mobile-menu__nav">
      <ul>
        {#each mainNavigation as item, index}
          <li>
            {#if item.children?.length}
              <div class="mobile-menu__group" class:open={openMobileGroup === index}>
                <button
                  type="button"
                  class="mobile-menu__group-button"
                  aria-expanded={openMobileGroup === index}
                  on:click={() => toggleMobileDropdown(index)}
                >
                  <span>{$_(item.label)}</span>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M3.5 5.5 8 10l4.5-4.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                {#if openMobileGroup === index}
                  <ul>
                    {#each item.children as child}
                      <li>
                        <a href={child.href} on:click={handleLinkFollow}>
                          <span class="mobile-menu__link-title">{$_(child.label)}</span>
                          {#if child.description}
                            <span class="mobile-menu__link-description">{$_(child.description)}</span>
                          {/if}
                        </a>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {:else}
              <a href={item.href} on:click={handleLinkFollow} class:active={isRouteActive(item)}>
                {$_(item.label)}
              </a>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="mobile-menu__footer">
      <div class="mobile-menu__toggles">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <Button href="/contact" variant="gradient" elevate on:click={handleLinkFollow}>
        {$_('nav.talk_to_us')}
      </Button>
    </div>
  </div>
{/if}

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(14px) saturate(1.05);
    -webkit-backdrop-filter: blur(14px) saturate(1.05);
    background: color-mix(in srgb, var(--bg-elev-1) 66%, transparent 34%);
    border-bottom: 1px solid color-mix(in srgb, var(--border-strong) 28%, transparent 72%);
    box-shadow: 0 1px 0 color-mix(in srgb, var(--border) 22%, transparent 78%);
  }

  .site-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    padding: var(--space-md) clamp(var(--space-lg), 5vw, var(--space-2xl));
    width: min(100%, var(--container-xxl));
    margin-inline: auto;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    text-decoration: none;
    color: inherit;
  }

  .brand img {
    display: block;
  }

  .brand__text {
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-size: var(--text-label);
  }

  .desktop-nav {
    display: none;
  }

  .desktop-nav__list {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .desktop-nav__link,
  .desktop-nav__trigger {
    border-radius: var(--radius-full, 999px);
    padding: 0.6rem 1rem;
    font-size: var(--text-meta);
    font-weight: var(--weight-medium);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-secondary);
    transition: background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }

  .desktop-nav__link:hover,
  .desktop-nav__link:focus-visible,
  .desktop-nav__trigger:hover,
  .desktop-nav__trigger:focus-visible {
    color: var(--text-primary);
    background: color-mix(in srgb, var(--surface-chip-bg) 52%, transparent 48%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 48%, transparent 52%);
    box-shadow: var(--surface-chip-shadow);
    outline: none;
  }

  .desktop-nav__link.active {
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
  }

  .desktop-nav__trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .desktop-nav__trigger svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  .desktop-nav__dropdown {
    position: absolute;
    margin-top: 0.75rem;
    inset-inline-start: 0;
    background: color-mix(in srgb, var(--surface-glass-bg) 82%, transparent 18%);
    border: 1px solid color-mix(in srgb, var(--surface-glass-border) 54%, transparent 46%);
    border-radius: var(--radius-xl, 20px);
    box-shadow: var(--shadow-lg);
    padding: var(--space-md);
    min-width: 16rem;
    z-index: 10;
  }

  .desktop-nav__dropdown ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--space-sm);
  }

  .desktop-nav__dropdown-link {
    display: grid;
    gap: 0.25rem;
    text-decoration: none;
    color: var(--text-secondary);
    padding: 0.75rem;
    border-radius: var(--radius-lg);
    transition: background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .desktop-nav__dropdown-link:hover,
  .desktop-nav__dropdown-link:focus-visible {
    background: color-mix(in srgb, var(--surface-chip-bg) 56%, transparent 44%);
    color: var(--text-primary);
    outline: none;
  }

  .desktop-nav__dropdown-title {
    font-weight: var(--weight-semibold);
  }

  .desktop-nav__dropdown-description {
    font-size: var(--text-meta);
    color: var(--text-tertiary);
  }

  .site-header__actions {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .site-header__utility {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .site-header__cta {
    display: inline-flex;
  }

  .site-header__cta :global(*) {
    white-space: nowrap;
  }

  .menu-button {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--surface-pill-border) 52%, transparent 48%);
    background: color-mix(in srgb, var(--surface-pill-bg) 58%, transparent 42%);
    box-shadow: var(--surface-pill-shadow);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .menu-button:hover {
    transform: translateY(-1px);
  }

  .menu-button span[aria-hidden] {
    position: relative;
    width: 18px;
    height: 2px;
    border-radius: var(--radius-full);
    background: currentColor;
  }

  .menu-button span[aria-hidden]::before,
  .menu-button span[aria-hidden]::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    height: 2px;
    border-radius: var(--radius-full);
    background: currentColor;
    transform-origin: center;
  }

  .menu-button span[aria-hidden]::before {
    translate: 0 -6px;
  }

  .menu-button span[aria-hidden]::after {
    translate: 0 6px;
  }

  .menu-button[aria-expanded='true'] span[aria-hidden] {
    background: transparent;
  }

  .menu-button[aria-expanded='true'] span[aria-hidden]::before {
    translate: 0 0;
    rotate: 45deg;
  }

  .menu-button[aria-expanded='true'] span[aria-hidden]::after {
    translate: 0 0;
    rotate: -45deg;
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(4, 8, 18, 0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 80;
  }

  .mobile-menu {
    position: fixed;
    inset: 0;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: var(--space-lg);
    padding: var(--space-xl);
    background: var(--bg);
    color: var(--text);
    z-index: 90;
    overflow-y: auto;
  }

  .mobile-menu:focus {
    outline: none;
  }

  .mobile-menu__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mobile-menu__close {
    background: none;
    border: none;
    padding: 0.25rem;
    border-radius: var(--radius-full);
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
  }

  .mobile-menu__close svg {
    width: 20px;
    height: 20px;
  }

  .mobile-menu__nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-md);
  }

  .mobile-menu__nav a {
    display: block;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-lg);
    text-decoration: none;
    color: var(--text-secondary);
    border: 1px solid color-mix(in srgb, var(--border) 48%, transparent 52%);
    background: color-mix(in srgb, var(--bg-elev-1) 62%, transparent 38%);
  }

  .mobile-menu__nav a.active {
    color: var(--text);
    border-color: var(--accent-primary, var(--voyage-blue));
  }

  .mobile-menu__group {
    display: grid;
    gap: var(--space-xs);
  }

  .mobile-menu__group-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding: 0.75rem 0.9rem;
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in srgb, var(--border) 48%, transparent 52%);
    background: color-mix(in srgb, var(--bg-elev-1) 58%, transparent 42%);
    font: inherit;
    color: var(--text-secondary);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .mobile-menu__group-button:hover,
  .mobile-menu__group-button:focus-visible {
    color: var(--text-primary);
    border-color: color-mix(in srgb, var(--border-strong) 50%, transparent 50%);
    outline: none;
  }

  .mobile-menu__group-button svg {
    width: 1rem;
    height: 1rem;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .mobile-menu__group.open .mobile-menu__group-button {
    color: var(--text-primary);
  }

  .mobile-menu__group.open .mobile-menu__group-button svg {
    transform: rotate(180deg);
  }

  .mobile-menu__group ul {
    margin: 0;
    padding: var(--space-xs);
    list-style: none;
    display: grid;
    gap: var(--space-xs);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--border) 44%, transparent 56%);
    background: color-mix(in srgb, var(--bg-elev-1) 56%, transparent 44%);
  }

  .mobile-menu__group ul a {
    padding: 0.7rem 0.75rem;
  }

  .mobile-menu__link-title {
    display: block;
    font-weight: var(--weight-semibold);
  }

  .mobile-menu__link-description {
    display: block;
    font-size: var(--text-meta);
    color: var(--text-tertiary);
    margin-top: 0.25rem;
  }

  .mobile-menu__footer {
    display: grid;
    gap: var(--space-md);
  }

  .mobile-menu__toggles {
    display: flex;
    gap: var(--space-sm);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (min-width: 960px) {
    .desktop-nav {
      display: block;
      position: relative;
    }

    .menu-button {
      display: none;
    }

    .mobile-overlay,
    .mobile-menu {
      display: none !important;
    }

    .site-header__inner {
      padding: var(--space-sm) var(--space-xl);
    }
  }

  @media (max-width: 959px) {
    .site-header__utility,
    .site-header__cta {
      display: none;
    }

    .desktop-nav {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .site-header__inner {
      padding-inline: var(--space-lg);
    }

    .mobile-menu {
      padding: var(--space-lg);
    }
  }
</style>
