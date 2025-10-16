<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { tick } from 'svelte';
  import { navigation } from '$stores/navigation';
  import { theme } from '$stores/theme';
  import { Button } from '$lib/components';
  import GlassCard from './GlassCard.svelte';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle-dropdown.svelte';
  import { mainNavigation } from '$config/navigation';

  let isScrolled = false;
  let ticking = false;
  /** @type {HTMLElement | null} */
  let menuGroup = null;
  /** @type {HTMLElement | null} */
  let menuTrigger = null;
  let currentPath = '';
  /** @type {HTMLElement | null} */
  let restoreFocusTarget = null;
  let wasMenuOpen = false;
  let lockedScrollY = 0;
  let isScrollLocked = false;
  let isMounted = false;
  let isCompactViewport = false;
  $: navLogoSrc = !isMounted || $theme === 'light' ? '/images/brand/logo-main.svg' : '/images/brand/logo-white.svg';

  onMount(() => {
    isMounted = true;

    if (browser) {
      isCompactViewport = window.innerWidth <= 960;
    }
  });

  const focusableSelectors = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  /**
   * @param {Element | null} element
   */
  const isElementVisible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.hidden) return false;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
    if (element.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    const rects = element.getClientRects();
    return rects.length > 0;
  };

  /**
   * @returns {HTMLElement[]}
   */
  const getFocusableMenuItems = () => {
    if (!menuGroup) return [];
    const group = /** @type {HTMLElement} */ (menuGroup);

    return /** @type {HTMLElement[]} */ (
      Array.from(group.querySelectorAll(focusableSelectors)).filter((element) => {
        if (!(element instanceof HTMLElement)) return false;
        return isElementVisible(element);
      })
    );
  };

  function updateScrollState() {
    const scrollY = window.scrollY;
    isScrolled = scrollY > 28;
    navigation.updateScroll(scrollY);
    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollState);
    }
  }

  function handleResize() {
    isCompactViewport = window.innerWidth <= 960;

    if (window.innerWidth > 960 && $navigation.isMenuOpen) {
      navigation.closeMenu();
    }
  }

  /** @param {KeyboardEvent} event */
  function handleMenuFocusTrap(event) {
    if (!$navigation.isMenuOpen || event.key !== 'Tab') {
      return;
    }

    const focusableItems = getFocusableMenuItems();
    if (focusableItems.length === 0) return;

    const activeElement = document.activeElement;
    const first = focusableItems[0];
    const last = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
   * @param {HTMLElement} node
   */
  const focusTrap = (node) => {
    /** @param {KeyboardEvent} event */
    const onKeydown = (event) => handleMenuFocusTrap(event);
    node.addEventListener('keydown', onKeydown);

    return {
      destroy() {
        node.removeEventListener('keydown', onKeydown);
      }
    };
  };

  const lockScroll = () => {
    if (!browser || isScrollLocked) return;
    lockedScrollY = window.scrollY;
    const { style } = document.body;
    style.position = 'fixed';
    style.top = `-${lockedScrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    isScrollLocked = true;
  };

  const unlockScroll = () => {
    if (!browser || !isScrollLocked) return;
    const { style } = document.body;
    style.position = '';
    style.top = '';
    style.left = '';
    style.right = '';
    style.width = '';
    isScrollLocked = false;
    window.scrollTo(0, lockedScrollY);
  };

  /** @param {KeyboardEvent} event */
  function handleKeydown(event) {
    if (event.key === 'Escape' && $navigation.isMenuOpen) {
      navigation.closeMenu();
    }
  }

  $: currentPath = $page.url?.pathname ?? '';

  /**
   * @type {(item: { href?: string; children?: { href?: string }[] } | null | undefined) => boolean}
   */
  const isItemActive = (item) => {
    if (!item || typeof item !== 'object') return false;
    if (currentPath === item.href) return true;
    if (Array.isArray(item.children)) {
      return item.children.some(
        /** @type {(child: { href?: string }) => boolean} */
        ((child) => typeof child?.href === 'string' && currentPath.startsWith(child.href))
      );
    }
    return false;
  };

  $: if (browser) {
    document.documentElement.classList.toggle('nav-menu-open', $navigation.isMenuOpen);
  }

  onDestroy(() => {
    if (browser) {
      document.documentElement.classList.remove('nav-menu-open');
    }
    unlockScroll();
  });

  afterUpdate(async () => {
    if (!browser) return;

    if ($navigation.isMenuOpen !== wasMenuOpen) {
      if ($navigation.isMenuOpen) {
        lockScroll();
      } else {
        unlockScroll();
      }

      if ($navigation.isMenuOpen) {
        restoreFocusTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        await tick();
        const focusableItems = getFocusableMenuItems();
        const primaryLink = focusableItems.find((element) =>
          element instanceof HTMLElement && element.closest('.nav-links')
        );

        if (primaryLink instanceof HTMLElement) {
          primaryLink.focus({ preventScroll: true });
        } else if (focusableItems[0] instanceof HTMLElement) {
          focusableItems[0].focus({ preventScroll: true });
        } else if (menuTrigger) {
          menuTrigger.focus({ preventScroll: true });
        }
      } else {
        await tick();
        if (restoreFocusTarget && document.contains(restoreFocusTarget)) {
          restoreFocusTarget.focus({ preventScroll: true });
        } else if (menuTrigger) {
          menuTrigger.focus({ preventScroll: true });
        }
        restoreFocusTarget = null;
      }

      wasMenuOpen = $navigation.isMenuOpen;
    }
  });
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleResize} on:keydown={handleKeydown} />

<nav
  class="nav-shell os-window"
  class:nav-condensed={isScrolled}
  class:hidden={$navigation.scrollDirection === 'down' && $navigation.lastScrollY > 200}
  class:menu-open={$navigation.isMenuOpen}
  aria-label={$_('nav.primary_label')}
  use:focusTrap
>
  <div class="container nav-surface">
    <div class="nav-leading">
      <div class="nav-window-controls" aria-hidden="true">
        <span class="nav-window-control nav-window-control--close"></span>
        <span class="nav-window-control nav-window-control--minimise"></span>
        <span class="nav-window-control nav-window-control--expand"></span>
      </div>

      <a href="/" class="nav-brand" aria-label={$_('nav.brand_aria')}>
        <img
          src={navLogoSrc}
          alt={$_('nav.brand_name')}
          width="148"
          height="40"
        />
      </a>
    </div>

    <div class="nav-groups">
      <GlassCard
        as="nav"
        id="primary-navigation"
        class="nav-links"
        role="navigation"
        aria-label={$_('nav.primary_label')}
        data-open={$navigation.isMenuOpen}
        aria-hidden={isCompactViewport && !$navigation.isMenuOpen ? 'true' : undefined}
        padding="sm"
      >
        <div class="nav-mobile-header">
          <a
            href="/"
            class="nav-mobile-brand"
            aria-label={$_('nav.brand_aria')}
            on:click={() => navigation.closeMenu()}
          >
            <img
              src={navLogoSrc}
              alt={$_('nav.brand_name')}
              width="148"
              height="40"
            />
          </a>
        </div>

        <ul class="nav-list">
          {#each mainNavigation as item}
            <li class={`nav-item${item.children ? ' nav-item--group' : ''}`}>
              <a
                href={item.href}
                class="nav-link"
                class:active={isItemActive(item)}
                on:click={() => navigation.closeMenu()}
              >
                <span class="nav-link__label">{$_(item.label)}</span>
              </a>

              {#if item.children?.length}
                <GlassCard
                  class="nav-submenu"
                  role="group"
                  aria-label={item.panelLabel ? $_(item.panelLabel) : $_('nav.resources_panel_label')}
                  padding="sm"
                >
                  {#each item.children as child}
                    <a
                      href={child.href}
                      class="nav-submenu__link"
                      on:click={() => navigation.closeMenu()}
                    >
                      <span class="nav-submenu__title">{$_(child.label)}</span>
                      {#if child.description}
                        <span class="nav-submenu__description">{$_(child.description)}</span>
                      {/if}
                    </a>
                  {/each}
                </GlassCard>
              {/if}
            </li>
          {/each}
        </ul>

        <div class="nav-mobile-controls" role="group" aria-labelledby="nav-mobile-controls-heading">
          <p id="nav-mobile-controls-heading" class="nav-mobile-controls__label">
            {$_('nav.quick_controls')}
          </p>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </GlassCard>

      <div class="nav-actions">
        <LanguageSwitcher />
        <ThemeToggle />
        <Button href="/contact" class="nav-button" variant="gradient" elevate>
          {$_('nav.talk_to_us')}
        </Button>
        <button
          class="nav-trigger"
          on:click={() => navigation.toggleMenu()}
          aria-label={$_('nav.toggle_menu')}
          aria-expanded={$navigation.isMenuOpen}
          aria-controls="primary-navigation"
          bind:this={menuTrigger}
        >
          <span></span>
          <span></span>
          <span class="sr-only">{$_('nav.toggle_menu')}</span>
        </button>
      </div>
    </div>
  </div>
</nav>

<button
  type="button"
  class="nav-overlay"
  data-visible={$navigation.isMenuOpen}
  aria-hidden="true"
  tabindex="-1"
  on:click={() => navigation.closeMenu()}
></button>

<style>
  .nav-shell {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: var(--z-sticky);
    padding: 0;
    border-radius: 0;
    border: 0;
    background: color-mix(in srgb, var(--glass-bg-lightest) 54%, transparent 46%);
    border-bottom: 1px solid color-mix(in srgb, var(--glass-border) 62%, transparent 38%);
    box-shadow: 0 18px 60px rgba(var(--ink-rgb), 0.08);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.85)) saturate(1.04);
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.85)) saturate(1.04);
    overflow: visible;
    transition:
      transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out),
      background var(--duration-normal) var(--ease-out);
  }

  .nav-shell > .container {
    width: min(100%, var(--container-xl, 1200px));
    margin-inline: auto;
    padding-inline: clamp(1.75rem, 5vw, 2.75rem);
  }

  @media (max-width: 960px) {
    .nav-shell > .container {
      padding-inline: clamp(1.25rem, 6vw, 2rem);
    }
  }

  @media (max-width: 600px) {
    .nav-shell > .container {
      padding-inline: clamp(0.85rem, 5vw, 1.4rem);
    }
  }

  .nav-shell.hidden {
    transform: translateY(-100%);
  }

  .nav-shell.nav-condensed {
    background: color-mix(in srgb, var(--glass-bg-light) 52%, transparent 48%);
    border-bottom-color: color-mix(in srgb, var(--glass-border-strong) 62%, transparent 38%);
    box-shadow: 0 22px 70px rgba(var(--ink-rgb), 0.12);
  }

  :global([data-base-theme='dark']) .nav-shell {
    background: color-mix(
      in srgb,
      rgba(var(--graphite-rgb), 0.72) 52%,
      rgba(var(--voyage-blue-rgb), 0.34) 48%
    );
    border-bottom-color: color-mix(
      in srgb,
      rgba(var(--voyage-blue-rgb), 0.34) 54%,
      rgba(var(--snow-rgb), 0.16) 46%
    );
    box-shadow: 0 22px 68px rgba(4, 12, 30, 0.38);
  }

  :global([data-base-theme='dark']) .nav-shell.nav-condensed {
    background: color-mix(
      in srgb,
      rgba(var(--graphite-rgb), 0.78) 50%,
      rgba(var(--voyage-blue-rgb), 0.38) 50%
    );
    border-bottom-color: color-mix(
      in srgb,
      rgba(var(--voyage-blue-rgb), 0.4) 54%,
      rgba(var(--snow-rgb), 0.16) 46%
    );
    box-shadow: 0 26px 82px rgba(1, 6, 20, 0.48);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-shell {
    background: transparent;
    border: 0;
    border-bottom: 2px solid currentColor;
    box-shadow: none;
    background-image: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-shell.nav-condensed {
    border-bottom-color: currentColor;
  }

  :global([data-base-theme='dark']) .nav-window-controls {
    background: color-mix(in srgb, rgba(12, 18, 32, 0.72) 82%, transparent 18%);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.24) 64%, transparent 36%);
    box-shadow: 0 18px 32px rgba(2, 8, 20, 0.32);
  }

  :global([data-base-theme='dark']) .nav-window-control--close {
    background: color-mix(in srgb, var(--cherry-pop) 70%, rgba(255, 255, 255, 0.1) 30%);
  }

  :global([data-base-theme='dark']) .nav-window-control--minimise {
    background: color-mix(in srgb, var(--signal-yellow) 74%, rgba(255, 255, 255, 0.08) 26%);
  }

  :global([data-base-theme='dark']) .nav-window-control--expand {
    background: color-mix(in srgb, var(--voyage-blue) 68%, rgba(255, 255, 255, 0.14) 32%);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-window-controls {
    background: transparent;
    border: 1px solid currentColor;
    box-shadow: none;
    padding: 0.3rem 0.35rem;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-window-control {
    background: currentColor;
    border-color: currentColor;
    box-shadow: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-window-control::after {
    display: none;
  }

  .nav-surface {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(1.5rem, 3vw, 2.75rem);
    padding: clamp(1rem, 2.5vw, 1.5rem) 0;
  }

  .nav-leading {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1.1rem);
  }

  .nav-leading,
  .nav-links,
  .nav-actions {
    min-width: 0;
  }

  .nav-window-controls {
    display: flex;
    align-items: center;
    gap: clamp(0.4rem, 1vw, 0.65rem);
    padding: clamp(0.3rem, 1vw, 0.45rem) clamp(0.4rem, 1.2vw, 0.55rem);
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--surface-chip-bg) 70%, transparent 30%);
    border: 1px solid color-mix(in srgb, var(--surface-chip-border) 60%, transparent 40%);
    box-shadow: 0 12px 28px rgba(var(--ink-rgb), 0.08);
  }

  .nav-window-control {
    width: clamp(0.6rem, 1.1vw, 0.75rem);
    height: clamp(0.6rem, 1.1vw, 0.75rem);
    position: relative;
    border-radius: var(--radius-full);
    border: 1px solid transparent;
    box-shadow: inset 0 1px 2px rgba(var(--snow-rgb), 0.35), 0 1px 2px rgba(var(--ink-rgb), 0.18);
  }

  .nav-window-control--close {
    background: color-mix(in srgb, var(--cherry-pop) 82%, var(--snow) 18%);
    border-color: color-mix(in srgb, var(--cherry-pop) 62%, rgba(var(--ink-rgb), 0.08) 38%);
  }

  .nav-window-control--minimise {
    background: color-mix(in srgb, var(--signal-yellow) 86%, var(--snow) 14%);
    border-color: color-mix(in srgb, var(--signal-yellow) 58%, rgba(var(--ink-rgb), 0.12) 42%);
  }

  .nav-window-control--expand {
    background: color-mix(in srgb, var(--voyage-blue) 78%, var(--snow) 22%);
    border-color: color-mix(in srgb, var(--voyage-blue) 60%, rgba(var(--ink-rgb), 0.1) 40%);
  }

  .nav-window-control::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(var(--snow-rgb), 0.45), rgba(var(--snow-rgb), 0));
    opacity: 0.75;
    pointer-events: none;
  }

  @media (max-width: 720px) {
    .nav-window-controls {
      display: none;
    }
  }

  .nav-brand img {
    display: block;
    width: clamp(7rem, 20vw, 10rem);
    height: auto;
    max-width: 100%;
  }

  .nav-groups {
    display: flex;
    align-items: center;
    gap: clamp(1.25rem, 2.6vw, 2.25rem);
    flex: 1;
    justify-content: flex-end;
  }

  .nav-links {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: clamp(0.9rem, 2vw, 1.35rem);
    padding: clamp(0.55rem, 1.8vw, 0.85rem) clamp(0.9rem, 3vw, 1.6rem);
    margin: 0 0 0 auto;
    max-width: min(100%, 860px);
    background: none;
    --card-gap: clamp(0.5rem, 1.4vw, 0.9rem);
    --glass-card-radius: clamp(1.65rem, 4vw, 2.6rem);
    --glass-card-veil-opacity: 0.32;
    --glass-card-highlight: rgba(var(--snow-rgb, 244, 246, 255), 0.24);
    --glass-card-halo-opacity: 0.18;
    --glass-card-halo-blur: 32px;
    --glass-card-halo: rgba(var(--signal-yellow-rgb), 0.26);
    --glass-card-spot-a: rgba(var(--voyage-blue-rgb), 0.14);
    --glass-card-spot-b: rgba(var(--aurora-purple-rgb), 0.12);
    --glass-card-border: color-mix(in srgb, var(--glass-border-strong) 70%, transparent 30%);
    --glass-card-shadow: 0 22px 60px rgba(var(--ink-rgb), 0.12);
    --glass-card-surface: color-mix(in srgb, var(--glass-bg-lighter) 90%, transparent 10%);
  }

  :global([data-base-theme='dark']) .nav-links {
    --glass-card-surface: color-mix(
      in srgb,
      rgba(var(--graphite-rgb), 0.86) 70%,
      rgba(var(--voyage-blue-rgb), 0.32) 30%
    );
    --glass-card-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 62%, rgba(255, 255, 255, 0.24) 38%);
    --glass-card-shadow: 0 28px 78px rgba(2, 10, 28, 0.35);
    --glass-card-halo: rgba(var(--aurora-purple-rgb), 0.28);
  }

  .nav-list {
    display: flex;
    align-items: center;
    gap: clamp(1rem, 2vw, 1.75rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
  }

  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: clamp(0.4rem, 1.5vw, 0.6rem);
    padding: clamp(0.55rem, 1.8vw, 0.75rem) clamp(0.9rem, 2.5vw, 1.2rem);
    border-radius: var(--radius-full);
    font-size: clamp(0.95rem, 2vw, 1.05rem);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    border: 1px solid transparent;
    outline: none;
    white-space: nowrap;
    transition:
      color var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover {
    color: var(--text-primary);
    background: var(--surface-chip-bg);
    border-color: var(--surface-chip-border);
    box-shadow: var(--surface-chip-shadow);
    transform: translateY(-1px);
  }

  .nav-link:focus-visible {
    color: var(--text-primary);
    background: var(--surface-chip-bg);
    border-color: var(--surface-chip-border);
    transform: translateY(-1px);
    --nav-focus-shadow-base: var(--surface-chip-shadow);
    box-shadow: var(--focus-ring-shadow), var(--nav-focus-shadow-base);
    animation: navFocusPulse 1.6s ease-in-out infinite;
  }

  .nav-link.active {
    color: var(--text-primary);
    background: color-mix(in srgb, var(--surface-chip-bg) 82%, rgba(var(--voyage-blue-rgb), 0.18) 18%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 62%, rgba(var(--voyage-blue-rgb), 0.2) 38%);
    box-shadow: var(--surface-chip-shadow);
  }

  .nav-item--group {
    align-items: stretch;
  }

  .nav-item--group .nav-link {
    padding-right: 1.25rem;
  }

  :global(.nav-item--group .nav-submenu) {
    position: absolute;
    top: calc(100% + 0.75rem);
    left: 50%;
    transform: translate(-50%, 10px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    display: grid;
    gap: clamp(0.6rem, 1.6vw, 0.95rem);
    min-width: clamp(240px, 24vw, 340px);
    padding: clamp(0.85rem, 2vw, 1.25rem);
    --card-gap: clamp(0.65rem, 2vw, 0.95rem);
    --glass-card-radius: clamp(1.4rem, 3vw, 2.2rem);
    --glass-card-surface: color-mix(in srgb, var(--glass-bg-lighter) 88%, transparent 12%);
    --glass-card-border: color-mix(in srgb, var(--glass-border-strong) 72%, transparent 28%);
    --glass-card-shadow: 0 26px 76px rgba(var(--ink-rgb), 0.16);
    --glass-card-veil-opacity: 0.38;
    --glass-card-halo-opacity: 0.24;
    --glass-card-halo: rgba(var(--signal-yellow-rgb), 0.28);
    --glass-card-halo-blur: 40px;
    transition:
      opacity var(--duration-normal) var(--ease-out),
      transform var(--duration-normal) var(--ease-out),
      visibility var(--duration-normal) var(--ease-out);
    z-index: var(--z-elevated);
  }

  :global([data-base-theme='dark'] .nav-item--group .nav-submenu) {
    --glass-card-surface: color-mix(
      in srgb,
      rgba(var(--graphite-rgb), 0.92) 70%,
      rgba(var(--voyage-blue-rgb), 0.34) 30%
    );
    --glass-card-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 62%, rgba(255, 255, 255, 0.24) 38%);
    --glass-card-shadow: 0 32px 82px rgba(2, 10, 28, 0.42);
    --glass-card-veil-opacity: 0.44;
    --glass-card-halo: rgba(var(--aurora-purple-rgb), 0.32);
  }

  :global(.nav-item--group:hover .nav-submenu),
  :global(.nav-item--group:focus-within .nav-submenu) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translate(-50%, 0);
  }

  .nav-submenu__link {
    display: grid;
    gap: 0.35rem;
    padding: clamp(0.75rem, 1.6vw, 1rem);
    border-radius: var(--radius-lg);
    background: var(--surface-field-bg);
    border: 1px solid var(--surface-field-border);
    box-shadow: var(--surface-chip-shadow);
    color: inherit;
    text-decoration: none;
    transition: border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
  }

  .nav-submenu__link:hover {
    border-color: color-mix(in srgb, var(--surface-field-border) 68%, rgba(var(--aurora-purple-rgb), 0.28) 32%);
    transform: translateY(-2px);
  }

  .nav-submenu__link:focus-visible {
    border-color: color-mix(in srgb, var(--surface-field-border) 68%, rgba(var(--aurora-purple-rgb), 0.28) 32%);
    transform: translateY(-2px);
    box-shadow: var(--focus-ring-shadow);
  }

  .nav-submenu__title {
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
  }

  .nav-submenu__description {
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .nav-actions {
    display: inline-flex;
    align-items: center;
    gap: clamp(0.6rem, 2vw, 1.15rem);
    flex-shrink: 0;
    min-width: 0;
    flex-wrap: nowrap;
  }

  .nav-mobile-controls {
    display: none;
  }

  .nav-mobile-header {
    display: none;
  }

  .nav-mobile-brand {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
  }

  .nav-mobile-brand img {
    display: block;
    width: clamp(7.5rem, 38vw, 11rem);
    height: auto;
    max-width: 100%;
  }

  .nav-mobile-controls__label {
    font-size: clamp(0.75rem, 1.4vw, 0.85rem);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    color: var(--text-tertiary);
    margin: 0;
  }

  .nav-button {
    --btn-padding-y: clamp(0.6rem, 1.8vw, 0.85rem);
    --btn-padding-x: clamp(1.2rem, 3vw, 1.75rem);
    --btn-hover-translate: -3px;
    font-size: clamp(0.9rem, 2vw, 1.05rem);
    white-space: nowrap;
  }

  .nav-trigger {
    position: relative;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: clamp(2.75rem, 12vw, 3.25rem);
    height: clamp(2.75rem, 12vw, 3.25rem);
    border-radius: var(--radius-full);
    background: var(--surface-pill-bg);
    border: 1px solid var(--surface-pill-border);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: blur(18px) saturate(1.05);
    -webkit-backdrop-filter: blur(18px) saturate(1.05);
    gap: clamp(0.3rem, 2vw, 0.4rem);
    transition: background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
  }

  .nav-trigger span {
    display: block;
    width: clamp(1rem, 4.5vw, 1.25rem);
    height: clamp(0.125rem, 0.5vw, 0.15rem);
    border-radius: var(--radius-full);
    background: currentColor;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .nav-trigger:focus-visible {
    outline: none;
    --nav-focus-shadow-base: var(--surface-pill-shadow);
    box-shadow: var(--focus-ring-shadow), var(--nav-focus-shadow-base);
    animation: navFocusPulse 1.6s ease-in-out infinite;
  }

  .nav-shell.menu-open .nav-trigger span:nth-child(1) {
    transform: translateY(clamp(0.225rem, 1vw, 0.3rem)) rotate(45deg);
  }

  .nav-shell.menu-open .nav-trigger span:nth-child(2) {
    transform: translateY(clamp(-0.225rem, -1vw, -0.3rem)) rotate(-45deg);
  }

  .nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 6, 18, 0.4);
    backdrop-filter: blur(6px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-normal) var(--ease-out);
    z-index: calc(var(--z-sticky) - 1);
  }

  .nav-overlay[data-visible='true'] {
    opacity: 1;
    pointer-events: auto;
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

  @keyframes navFocusPulse {
    0%,
    100% {
      box-shadow: var(--focus-ring-shadow), var(--nav-focus-shadow-base, transparent);
    }

    50% {
      box-shadow:
        0 0 0 4px color-mix(in srgb, var(--focus-ring-color, var(--voyage-blue)) 70%, transparent 30%),
        var(--nav-focus-shadow-base, transparent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-link:focus-visible,
    .nav-trigger:focus-visible {
      animation: none;
    }
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-link:focus-visible {
    box-shadow: var(--focus-ring-contrast);
    animation: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-submenu__link:focus-visible {
    box-shadow: var(--focus-ring-contrast);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-trigger:focus-visible {
    box-shadow: var(--focus-ring-contrast);
    animation: none;
  }

  @media (max-width: 1200px) {
    .nav-list {
      gap: clamp(0.65rem, 1.8vw, 1.25rem);
    }

    .nav-link {
      padding: 0.6rem 0.95rem;
    }
  }

  @media (max-width: 960px) {
    .nav-groups {
      gap: 0.75rem;
    }

    .nav-mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: clamp(0.75rem, 4vw, 1.25rem);
      padding-bottom: clamp(0.35rem, 2vw, 0.6rem);
      border-bottom: 1px solid color-mix(in srgb, var(--surface-field-border) 78%, transparent 22%);
    }

    .nav-list {
      margin-top: clamp(0.6rem, 3vw, 0.9rem);
    }

    .nav-links {
      position: fixed;
      top: clamp(4.25rem, 12vw, 5.5rem);
      right: clamp(1.25rem, 5vw, 2rem);
      left: clamp(1.25rem, 5vw, 2rem);
      width: auto;
      max-width: none;
      padding: clamp(1rem, 4vw, 1.5rem);
      border-radius: clamp(1.9rem, 6vw, 2.8rem);
      flex-direction: column;
      align-items: stretch;
      gap: clamp(1rem, 4vw, 1.5rem);
      --card-gap: clamp(0.75rem, 3vw, 1.1rem);
      --glass-card-radius: clamp(1.9rem, 6vw, 2.8rem);
      --glass-card-surface: color-mix(in srgb, var(--glass-bg-lighter) 88%, rgba(var(--voyage-blue-rgb), 0.08) 12%);
      --glass-card-border: color-mix(in srgb, var(--glass-border-strong) 70%, rgba(var(--voyage-blue-rgb), 0.22) 30%);
      --glass-card-shadow: var(--shadow-3xl);
      --glass-card-veil-opacity: 0.44;
      --glass-card-halo-opacity: 0.28;
      --glass-card-halo: rgba(var(--aurora-purple-rgb), 0.32);
      backdrop-filter: blur(26px) saturate(1.12);
      -webkit-backdrop-filter: blur(26px) saturate(1.12);
      transform: translateY(-20px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      max-height: calc(100vh - clamp(5.25rem, 14vw, 7rem));
      overflow-y: auto;
      transition:
        opacity var(--duration-normal) var(--ease-out),
        transform var(--duration-normal) var(--ease-out),
        visibility var(--duration-normal) var(--ease-out);
    }

    .nav-shell:not(.menu-open) .nav-links {
      display: none;
    }

    .nav-shell.menu-open .nav-links {
      display: flex;
    }

    :global([data-base-theme='dark']) .nav-links {
      --glass-card-surface: color-mix(
        in srgb,
        rgba(var(--graphite-rgb), 0.9) 70%,
        rgba(var(--voyage-blue-rgb), 0.3) 30%
      );
      --glass-card-border: color-mix(
        in srgb,
        rgba(var(--voyage-blue-rgb), 0.52) 60%,
        rgba(255, 255, 255, 0.22) 40%
      );
      --glass-card-shadow: 0 46px 120px rgba(1, 6, 24, 0.46);
      --glass-card-halo: rgba(var(--voyage-blue-rgb), 0.36);
    }

    :global(.nav-links[data-open='true']) {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0);
    }

    :global(.nav-links[data-open='true'])::-webkit-scrollbar {
      width: 0.45rem;
    }

    :global(.nav-links[data-open='true'])::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, rgba(var(--ink-rgb), 0.25) 70%, transparent 30%);
      border-radius: var(--radius-full);
    }

    .nav-list {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .nav-item {
      flex-direction: column;
      align-items: stretch;
    }

    .nav-link {
      width: 100%;
      justify-content: space-between;
      padding: clamp(0.75rem, 3vw, 1rem) clamp(0.9rem, 4vw, 1.25rem);
    }

    :global(.nav-item--group .nav-submenu) {
      position: static;
      transform: none;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      --glass-card-surface: transparent;
      --glass-card-border: transparent;
      --glass-card-shadow: none;
      --glass-card-veil-opacity: 0;
      --glass-card-halo-opacity: 0;
      border: none;
      padding: 0;
      gap: 0.75rem;
      margin-top: 0.6rem;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }

    .nav-submenu__link {
      background: var(--surface-field-bg);
      border: 1px solid var(--surface-field-border);
    }

    .nav-actions {
      gap: clamp(0.6rem, 3vw, 0.9rem);
    }

    .nav-button {
      display: none;
    }

    .nav-trigger {
      display: inline-flex;
    }

    .nav-mobile-controls {
      display: grid;
      gap: clamp(0.75rem, 4vw, 1.1rem);
      margin-top: clamp(0.75rem, 4vw, 1.25rem);
      padding-top: clamp(0.75rem, 4vw, 1.1rem);
      border-top: 1px solid color-mix(in srgb, var(--surface-field-border) 80%, transparent 20%);
      grid-template-columns: minmax(0, 1fr);
      align-items: center;
    }

    .nav-mobile-controls :global(.language-switcher),
    .nav-mobile-controls :global(.theme-switcher) {
      width: 100%;
    }

    .nav-mobile-controls :global(.language-switcher) {
      display: flex;
      justify-content: center;
    }

    .nav-mobile-controls :global(.language-switcher .current-lang) {
      width: 100%;
      justify-content: space-between;
    }

    .nav-mobile-controls :global(.theme-switcher) {
      display: flex;
      justify-content: center;
      max-width: 100%;
    }

    .nav-mobile-controls :global(.theme-switcher .theme-option__body) {
      min-width: clamp(2.6rem, 22vw, 3.2rem);
    }
  }

  @media (max-width: 720px) {
    .nav-surface {
      gap: clamp(0.85rem, 4vw, 1.35rem);
    }

    .nav-leading {
      flex: 1 1 auto;
    }

    .nav-groups {
      flex: 0 0 auto;
    }

    .nav-actions {
      margin-left: auto;
    }
  }

  @media (max-width: 640px) {
    .nav-shell > .container {
      padding-inline: clamp(0.75rem, 5.5vw, 1.15rem);
    }

    .nav-surface {
      justify-content: flex-start;
      gap: clamp(0.75rem, 5vw, 1.1rem);
      padding-block: clamp(0.75rem, 5vw, 1rem);
    }

    .nav-leading {
      display: none;
    }

    .nav-groups {
      width: 100%;
      justify-content: flex-start;
    }

    .nav-actions {
      width: 100%;
      justify-content: flex-start;
      gap: clamp(0.4rem, 4vw, 0.65rem);
    }

    .nav-actions :global(.language-switcher),
    .nav-actions :global(.theme-switcher) {
      display: none;
    }

    .nav-trigger {
      display: inline-flex;
      width: clamp(48px, 14vw, 56px);
      height: clamp(48px, 14vw, 56px);
    }
  }

  @media (max-width: 600px) {
    .nav-surface {
      padding: clamp(0.8rem, 3.5vw, 1rem) 0;
      align-items: center;
    }

    .nav-brand img {
      width: clamp(6.5rem, 36vw, 8.5rem);
    }

    .nav-links {
      top: clamp(4.5rem, 14vw, 5.5rem);
      right: clamp(0.85rem, 5vw, 1.4rem);
      left: clamp(0.85rem, 5vw, 1.4rem);
      max-height: calc(100vh - clamp(5rem, 16vw, 7rem));
    }
  }

  @media (max-width: 520px) {
    .nav-links {
      top: clamp(4.25rem, 16vw, 5.25rem);
      left: clamp(0.75rem, 5vw, 1.2rem);
      right: clamp(0.75rem, 5vw, 1.2rem);
      max-height: calc(100vh - clamp(4.75rem, 18vw, 6.75rem));
    }

    .nav-actions :global(.language-switcher),
    .nav-actions :global(.theme-switcher) {
      display: none;
    }

    .nav-mobile-controls {
      gap: clamp(0.6rem, 4.5vw, 0.95rem);
    }
  }

  @media (max-width: 440px) {
    .nav-surface {
      gap: clamp(0.85rem, 6vw, 1.15rem);
    }

    .nav-brand img {
      width: clamp(5.5rem, 40vw, 8rem);
    }

    .nav-actions {
      gap: clamp(0.35rem, 2.5vw, 0.6rem);
      flex-wrap: nowrap;
    }

    .nav-mobile-controls {
      gap: clamp(0.55rem, 4vw, 0.9rem);
    }
  }

  @media (max-width: 500px) {
    .nav-actions :global(.theme-toggle .nav-toggle-text),
    .nav-actions :global(.language-switcher .nav-toggle-text) {
      display: none;
    }
    
    .nav-menu {
      flex-direction: column;
    }

    .nav-brand img {
      width: clamp(5rem, 32vw, 6.5rem);
    }
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-links {
    background: transparent;
    border: 2px solid currentColor;
    box-shadow: none;
    --glass-card-surface: transparent;
    --glass-card-border: currentColor;
    --glass-card-shadow: none;
    --glass-card-veil-opacity: 0;
    --glass-card-halo-opacity: 0;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast']) .nav-links::before),
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast']) .nav-links::after),
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast']) .nav-item--group .nav-submenu::before),
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast']) .nav-item--group .nav-submenu::after) {
    display: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-button {
    --btn-bg: currentColor;
    --btn-border: currentColor;
    --btn-color: var(--bg);
    --btn-shadow: none;
    --btn-hover-shadow: none;
    --btn-hover-translate: 0;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-submenu__link {
    border: 2px solid currentColor;
    background: transparent;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast']) .nav-item--group .nav-submenu) {
    border: 2px solid currentColor;
    box-shadow: none;
    --glass-card-surface: transparent;
    --glass-card-border: currentColor;
    --glass-card-shadow: none;
    --glass-card-veil-opacity: 0;
    --glass-card-halo-opacity: 0;
  }
</style>

