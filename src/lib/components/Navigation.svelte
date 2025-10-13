<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { tick } from 'svelte';
  import { navigation } from '$stores/navigation';
  import { theme } from '$stores/theme';
  import { Button } from '$lib/components';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle.svelte';
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
  $: navLogoSrc = !isMounted || $theme === 'light' ? '/images/brand/logo-main.png' : '/images/brand/logo-white.png';

  onMount(() => {
    isMounted = true;
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
    <a href="/" class="nav-brand" aria-label={$_('nav.brand_aria')}>
      <img
        src={navLogoSrc}
        alt={$_('nav.brand_name')}
        width="148"
        height="40"
      />
    </a>

    <div class="nav-groups">
      <div
        id="primary-navigation"
        class="nav-links os-window"
        role="navigation"
        aria-label={$_('nav.primary_label')}
        data-open={$navigation.isMenuOpen}
      >
        <ul class="nav-list">
          {#each mainNavigation as item}
            <li class={`nav-item${item.children ? ' nav-item--group' : ''}`}>
              <a
                href={item.href}
                class="nav-link"
                class:active={currentPath === item.href}
                on:click={() => navigation.closeMenu()}
              >
                <span class="nav-link__label">{$_(item.label)}</span>
              </a>

              {#if item.children?.length}
                <div
                  class="nav-submenu os-window"
                  data-variant="grid"
                  role="group"
                  aria-label={$_('nav.products_panel_label')}
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
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      </div>

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
    --surface-glass-blur: 26px;
    --surface-glass-bg:
      linear-gradient(
        120deg,
        color-mix(in srgb, var(--grad-a) 16%, transparent) 0%,
        color-mix(in srgb, var(--grad-b) 12%, transparent) 100%
      ),
      color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--voyage-blue-rgb), 0.16) 10%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.36) 62%, rgba(255, 255, 255, 0.36) 38%);
    --surface-glass-shadow: 0 24px 52px rgba(var(--voyage-blue-rgb), 0.18);
    --grain-opacity: 0.05;
    --grain-blend-mode: soft-light;
    --os-window-hc-bg: transparent;
    --os-window-hc-border: transparent;
    --os-window-hc-shadow: none;
    padding: 0;
    border-radius: 0;
    border: 0;
    border-bottom: 1px solid var(--surface-glass-border);
    overflow: visible;
    transition: transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out),
      background var(--duration-normal) var(--ease-out);
  }

  .nav-shell.hidden {
    transform: translateY(-100%);
  }

  .nav-shell.nav-condensed {
    --surface-glass-bg:
      linear-gradient(
        120deg,
        color-mix(in srgb, var(--grad-a) 18%, transparent) 0%,
        color-mix(in srgb, var(--grad-b) 14%, transparent) 100%
      ),
      color-mix(in srgb, var(--bg-elev-1) 84%, rgba(var(--voyage-blue-rgb), 0.24) 16%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 64%, rgba(255, 255, 255, 0.3) 36%);
    --surface-glass-shadow: 0 26px 56px rgba(10, 18, 36, 0.2);
    --grain-opacity: 0.065;
    border-bottom-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 64%, rgba(255, 255, 255, 0.3) 36%);
  }

  :global([data-base-theme='dark']) .nav-shell {
    --surface-glass-bg:
      linear-gradient(
        120deg,
        color-mix(in srgb, var(--grad-a) 20%, transparent) 0%,
        color-mix(in srgb, var(--grad-b) 16%, transparent) 100%
      ),
      color-mix(in srgb, var(--bg-elev-2) 84%, rgba(var(--voyage-blue-rgb), 0.32) 16%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 60%, rgba(255, 255, 255, 0.22) 40%);
    --surface-glass-shadow: 0 30px 58px rgba(var(--voyage-blue-rgb), 0.28);
    --grain-opacity: 0.07;
    border-bottom-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 60%, rgba(255, 255, 255, 0.22) 40%);
  }

  :global([data-base-theme='dark']) .nav-shell.nav-condensed {
    --surface-glass-bg:
      linear-gradient(
        120deg,
        color-mix(in srgb, var(--grad-a) 22%, transparent) 0%,
        color-mix(in srgb, var(--grad-b) 18%, transparent) 100%
      ),
      color-mix(in srgb, var(--bg-elev-2) 78%, rgba(var(--voyage-blue-rgb), 0.4) 22%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.56) 60%, rgba(255, 255, 255, 0.22) 40%);
    --surface-glass-shadow: 0 32px 64px rgba(var(--voyage-blue-rgb), 0.32);
    --grain-opacity: 0.08;
    border-bottom-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.56) 60%, rgba(255, 255, 255, 0.22) 40%);
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

  .nav-surface {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(1.5rem, 3vw, 2.75rem);
    padding: clamp(1rem, 2.5vw, 1.5rem) 0;
  }

  .nav-brand img {
    display: block;
    width: clamp(128px, 22vw, 152px);
    height: auto;
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
    overflow: visible;
  }

  .nav-links.os-window {
    --surface-glass-bg: transparent;
    --surface-glass-border: transparent;
    --surface-glass-shadow: none;
    --grain-opacity: 0;
    --os-window-hc-bg: transparent;
    --os-window-hc-border: transparent;
    --os-window-hc-shadow: none;
    padding: 0;
    border-radius: 0;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
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
    gap: 0.55rem;
    padding: 0.65rem 1.05rem;
    border-radius: var(--radius-full);
    font-size: 0.98rem;
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    border: 1px solid transparent;
    transition:
      color var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--text-primary);
    background: var(--surface-chip-bg);
    border-color: var(--surface-chip-border);
    box-shadow: var(--surface-chip-shadow);
    transform: translateY(-1px);
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

  .nav-item--group .nav-submenu {
    position: absolute;
    top: calc(100% + 0.75rem);
    left: 50%;
    transform: translate(-50%, 10px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    display: grid;
    gap: var(--space-sm);
    min-width: clamp(220px, 22vw, 320px);
    padding: clamp(0.85rem, 2vw, 1.25rem);
    border-radius: var(--radius-xl);
    --surface-glass-blur: 24px;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.18) 12%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.38) 60%, rgba(255, 255, 255, 0.32) 40%);
    --surface-glass-shadow: 0 24px 48px rgba(var(--voyage-blue-rgb), 0.2);
    --grain-opacity: 0.05;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.1) 4%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 68%, rgba(var(--voyage-blue-rgb), 0.24) 32%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 60%, rgba(var(--voyage-blue-rgb), 0.28) 40%);
    transition:
      opacity var(--duration-normal) var(--ease-out),
      transform var(--duration-normal) var(--ease-out),
      visibility var(--duration-normal) var(--ease-out);
    z-index: var(--z-elevated);
  }

  :global([data-base-theme='dark']) .nav-item--group .nav-submenu {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-2) 76%, rgba(var(--voyage-blue-rgb), 0.3) 24%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 60%, rgba(255, 255, 255, 0.2) 40%);
    --surface-glass-shadow: 0 28px 56px rgba(var(--voyage-blue-rgb), 0.28);
    --grain-opacity: 0.07;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 94%, rgba(var(--voyage-blue-rgb), 0.14) 6%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 64%, rgba(var(--voyage-blue-rgb), 0.26) 36%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 56%, rgba(var(--voyage-blue-rgb), 0.28) 44%);
  }

  .nav-item--group:hover .nav-submenu,
  .nav-item--group:focus-within .nav-submenu {
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

  .nav-submenu__link:hover,
  .nav-submenu__link:focus-visible {
    border-color: color-mix(in srgb, var(--surface-field-border) 68%, rgba(var(--aurora-purple-rgb), 0.28) 32%);
    transform: translateY(-2px);
  }

  .nav-submenu__title {
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
  }

  .nav-submenu__description {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .nav-actions {
    display: inline-flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1.25rem);
  }

  .nav-button {
    --btn-padding-y: 0.7rem;
    --btn-padding-x: 1.55rem;
    --btn-hover-translate: -3px;
    font-size: clamp(0.95rem, 1vw, 1rem);
  }

  .nav-trigger {
    position: relative;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: var(--surface-pill-bg);
    border: 1px solid var(--surface-pill-border);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: blur(18px) saturate(1.05);
    -webkit-backdrop-filter: blur(18px) saturate(1.05);
    gap: 6px;
    transition: background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
  }

  .nav-trigger span {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .nav-trigger:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .nav-shell.menu-open .nav-trigger span:nth-child(1) {
    transform: translateY(4px) rotate(45deg);
  }

  .nav-shell.menu-open .nav-trigger span:nth-child(2) {
    transform: translateY(-4px) rotate(-45deg);
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

    .nav-links {
      position: fixed;
      top: clamp(4.25rem, 12vw, 5.5rem);
      right: clamp(1.25rem, 5vw, 2rem);
      left: clamp(1.25rem, 5vw, 2rem);
      padding: clamp(1rem, 4vw, 1.5rem);
      border-radius: var(--radius-2xl);
      --surface-glass-blur: 26px;
      --surface-glass-bg:
        linear-gradient(
          135deg,
          color-mix(in srgb, var(--grad-a) 14%, transparent) 0%,
          color-mix(in srgb, var(--grad-b) 12%, transparent) 100%
        ),
        color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--voyage-blue-rgb), 0.18) 10%);
      --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.38) 60%, rgba(255, 255, 255, 0.32) 40%);
      --surface-glass-shadow: 0 28px 56px rgba(var(--voyage-blue-rgb), 0.24);
      --grain-opacity: 0.06;
      --grain-blend-mode: soft-light;
      --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.14) 4%);
      --os-window-hc-border: color-mix(in srgb, var(--border-strong) 66%, rgba(var(--voyage-blue-rgb), 0.26) 34%);
      --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 56%, rgba(var(--voyage-blue-rgb), 0.28) 44%);
      transform: translateY(-20px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition:
        opacity var(--duration-normal) var(--ease-out),
        transform var(--duration-normal) var(--ease-out),
        visibility var(--duration-normal) var(--ease-out);
    }

    .nav-links.os-window {
      backdrop-filter: var(--surface-glass-blur) saturate(1.08);
      -webkit-backdrop-filter: var(--surface-glass-blur) saturate(1.08);
    }

    :global([data-base-theme='dark']) .nav-links {
      --surface-glass-bg:
        linear-gradient(
          135deg,
          color-mix(in srgb, var(--grad-a) 18%, transparent) 0%,
          color-mix(in srgb, var(--grad-b) 14%, transparent) 100%
        ),
        color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--voyage-blue-rgb), 0.3) 18%);
      --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 60%, rgba(255, 255, 255, 0.22) 40%);
      --surface-glass-shadow: 0 32px 60px rgba(var(--voyage-blue-rgb), 0.3);
      --grain-opacity: 0.075;
    }

    .nav-links[data-open='true'] {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0);
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
    }

    .nav-item--group .nav-submenu {
      position: static;
      transform: none;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      --surface-glass-blur: 0px;
      --surface-glass-bg: transparent;
      --surface-glass-border: transparent;
      --surface-glass-shadow: none;
      --grain-opacity: 0;
      border: 0;
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
      gap: 0.85rem;
    }

    .nav-button {
      display: none;
    }

    .nav-trigger {
      display: inline-flex;
    }
  }

  @media (max-width: 600px) {
    .nav-surface {
      padding: clamp(0.85rem, 4vw, 1rem) 0;
    }

    .nav-brand img {
      width: clamp(116px, 40vw, 140px);
    }
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-links {
    background: transparent;
    border: 2px solid currentColor;
    box-shadow: none;
    --os-window-hc-bg: transparent;
    --os-window-hc-border: currentColor;
    --os-window-hc-shadow: none;
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

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-item--group .nav-submenu {
    --os-window-hc-bg: transparent;
    --os-window-hc-border: currentColor;
    --os-window-hc-shadow: none;
    border: 2px solid currentColor;
    box-shadow: none;
  }
</style>
