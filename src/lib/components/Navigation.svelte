<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onDestroy, onMount, tick } from 'svelte';
  import { _ } from '$lib/i18n';
  import { Button } from '$lib/components';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle-dropdown.svelte';
  import { mainNavigation } from '$config/navigation';
  import { stripBase, withBase } from '$utils/paths';

  const brandLogo = {
    svg: withBase('/images/brand/logo-main.svg') ?? '/images/brand/logo-main.svg',
    png: withBase('/images/brand/logo-main.png') ?? '/images/brand/logo-main.png'
  };

  let menuOpen = false;
  let activeDropdown: number | null = null;
  let openMobileGroup: number | null = null;
  let mobileMenu: HTMLElement | null = null;
  let menuControl: HTMLButtonElement | null = null;

  $: currentPath = stripBase($page.url.pathname);

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
    <a href={withBase('/')} class="brand" aria-label={$_('nav.brand_aria')}>
      <picture>
        <source srcset={brandLogo.svg} type="image/svg+xml" />
        <img src={brandLogo.png} alt={$_('nav.brand_name')} width="148" height="40" />
      </picture>
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
                        <a href={withBase(child.href)} on:click={handleLinkFollow} class="desktop-nav__dropdown-link">
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
              <a href={withBase(item.href)} class="desktop-nav__link" class:active={isRouteActive(item)}>{$_(item.label)}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="site-header__actions">
      <div class="site-header__utility" role="group" aria-label={$_('nav.quick_controls')}>
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
        <a href={withBase('/')} class="brand" on:click={handleLinkFollow}>
          <picture>
            <source srcset={brandLogo.svg} type="image/svg+xml" />
            <img src={brandLogo.png} alt={$_('nav.brand_name')} width="120" height="32" />
          </picture>
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
                        <a href={withBase(child.href)} on:click={handleLinkFollow}>
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
              <a href={withBase(item.href)} on:click={handleLinkFollow} class:active={isRouteActive(item)}>
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
    --header-blur: calc(var(--glass-blur) * 0.6);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(var(--header-blur)) saturate(1.05);
    -webkit-backdrop-filter: blur(var(--header-blur)) saturate(1.05);
    background: color-mix(in srgb, var(--bg-elev-1) 66%, transparent 34%);
    border-bottom: var(--border-width-hairline) solid
      color-mix(in srgb, var(--border-strong) 28%, transparent 72%);
    box-shadow: 0 var(--border-width-hairline) 0
      color-mix(in srgb, var(--border) 22%, transparent 78%);
  }

  .site-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-lg);
    padding: var(--space-md) clamp(var(--space-lg), 5vw, var(--space-2xl));
    width: min(100%, var(--container-2xl));
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
    letter-spacing: var(--tracking-tight);
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
    --desktop-nav-padding-block: calc(var(--space-sm) + var(--space-3xs));
    border-radius: var(--radius-full);
    padding: var(--desktop-nav-padding-block) var(--space-4);
    font-size: var(--text-meta);
    font-weight: var(--weight-medium);
    border: var(--border-width-hairline) solid transparent;
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
    gap: calc(var(--space-sm) * 0.8);
  }

  .desktop-nav__trigger svg {
    inline-size: calc(var(--space-4) * 0.85);
    block-size: calc(var(--space-4) * 0.85);
  }

  .desktop-nav__dropdown {
    position: absolute;
    margin-top: calc(var(--space-sm) + var(--space-3xs));
    inset-inline-start: 0;
    background: color-mix(in srgb, var(--surface-glass-bg) 82%, transparent 18%);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--surface-glass-border) 54%, transparent 46%);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    padding: var(--space-md);
    min-width: calc(var(--space-4) * 16);
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
    gap: var(--space-3xs);
    text-decoration: none;
    color: var(--text-secondary);
    padding: calc(var(--space-sm) + var(--space-3xs));
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
    gap: var(--space-sm);
  }

  .site-header__utility {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .site-header__cta {
    display: inline-flex;
  }

  .site-header__cta :global(*) {
    white-space: nowrap;
  }

  .menu-button {
    --menu-control-size: var(--size-icon-md);
    --menu-icon-width: calc(var(--space-6) - var(--space-xs));
    --menu-icon-stroke: var(--border-width-thin);
    --menu-icon-offset: calc(var(--space-sm) * 0.5);
    position: relative;
    inline-size: var(--menu-control-size);
    block-size: var(--menu-control-size);
    border-radius: var(--radius-full);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--surface-pill-border) 52%, transparent 48%);
    background: color-mix(in srgb, var(--surface-pill-bg) 58%, transparent 42%);
    box-shadow: var(--surface-pill-shadow);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .menu-button:hover {
    transform: translateY(calc(-1 * var(--border-width-hairline)));
  }

  .menu-button span[aria-hidden] {
    position: relative;
    inline-size: var(--menu-icon-width);
    block-size: var(--menu-icon-stroke);
    border-radius: var(--radius-full);
    background: currentColor;
  }

  .menu-button span[aria-hidden]::before,
  .menu-button span[aria-hidden]::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    block-size: var(--menu-icon-stroke);
    border-radius: var(--radius-full);
    background: currentColor;
    transform-origin: center;
  }

  .menu-button span[aria-hidden]::before {
    translate: 0 calc(-1 * var(--menu-icon-offset));
  }

  .menu-button span[aria-hidden]::after {
    translate: 0 var(--menu-icon-offset);
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
    --mobile-overlay-blur: calc(var(--glass-blur) * 0.28);
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, var(--night) 65%, transparent 35%);
    backdrop-filter: blur(var(--mobile-overlay-blur));
    -webkit-backdrop-filter: blur(var(--mobile-overlay-blur));
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
    padding: var(--space-3xs);
    border-radius: var(--radius-full);
    inline-size: var(--size-icon-sm);
    block-size: var(--size-icon-sm);
    display: grid;
    place-items: center;
  }

  .mobile-menu__close svg {
    inline-size: var(--icon-glyph-sm);
    block-size: var(--icon-glyph-sm);
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
    padding: calc(var(--space-sm) + var(--space-2xs)) var(--space-4);
    border-radius: var(--radius-lg);
    text-decoration: none;
    color: var(--text-secondary);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--border) 48%, transparent 52%);
    background: color-mix(in srgb, var(--bg-elev-1) 62%, transparent 38%);
  }

  .mobile-menu__nav a.active {
    color: var(--text);
    border-color: var(--accent-primary);
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
    padding: calc(var(--space-sm) + var(--space-3xs))
      calc(var(--space-sm) + var(--space-2xs));
    border-radius: var(--radius-lg);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--border) 48%, transparent 52%);
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
    inline-size: var(--space-4);
    block-size: var(--space-4);
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
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--border) 44%, transparent 56%);
    background: color-mix(in srgb, var(--bg-elev-1) 56%, transparent 44%);
  }

  .mobile-menu__group ul a {
    padding: calc(var(--space-sm) + var(--space-3xs))
      calc(var(--space-sm) + var(--space-3xs) / 2);
  }

  .mobile-menu__link-title {
    display: block;
    font-weight: var(--weight-semibold);
  }

  .mobile-menu__link-description {
    display: block;
    font-size: var(--text-meta);
    color: var(--text-tertiary);
    margin-top: var(--space-3xs);
  }

  .mobile-menu__footer {
    display: grid;
    gap: var(--space-md);
  }

  .mobile-menu__toggles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  @media (min-width: 60rem) {
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

  @media (max-width: 59.9375rem) {
    .site-header__utility,
    .site-header__cta {
      display: none;
    }

    .desktop-nav {
      display: none;
    }
  }

  @media (max-width: 37.5rem) {
    .site-header__inner {
      padding-inline: var(--space-lg);
    }

    .mobile-menu {
      padding: var(--space-lg);
    }
  }
</style>
