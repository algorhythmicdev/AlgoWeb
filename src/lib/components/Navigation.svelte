<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { onDestroy } from 'svelte';
  import { navigation } from '$stores/navigation';
  import { theme } from '$stores/theme';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle.svelte';
  import { mainNavigation } from '$config/navigation';

  let isScrolled = false;
  let ticking = false;

  $: currentPath = $page.url.pathname;

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
  function handleKeydown(event) {
    if (event.key === 'Escape' && $navigation.isMenuOpen) {
      navigation.closeMenu();
    }
  }

  $: if (browser) {
    document.documentElement.classList.toggle('nav-menu-open', $navigation.isMenuOpen);
  }

  onDestroy(() => {
    if (browser) {
      document.documentElement.classList.remove('nav-menu-open');
    }
  });
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleResize} on:keydown={handleKeydown} />

<nav
  class="nav-shell"
  class:nav-condensed={isScrolled}
  class:hidden={$navigation.scrollDirection === 'down' && $navigation.lastScrollY > 200}
  class:menu-open={$navigation.isMenuOpen}
  aria-label={$_('nav.primary_label')}
>
  <div class="container nav-surface">
    <a href="/" class="nav-brand" aria-label={$_('nav.brand_aria')}>
      <img
        src={$theme === 'light' ? '/images/brand/logo-main.png' : '/images/brand/logo-white.png'}
        alt={$_('nav.brand_name')}
        width="148"
        height="40"
      />
    </a>

    <div class="nav-groups">
      <div
        id="primary-navigation"
        class="nav-links"
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
                {#if item.badge}
                  <span class="nav-link__badge">{$_(item.badge)}</span>
                {/if}
              </a>

              {#if item.children?.length}
                <div class="nav-submenu" role="group" aria-label={$_('nav.products_panel_label')}>
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
        <a href="/contact" class="nav-button" data-variant="primary">{$_('nav.talk_to_us')}</a>
        <button
          class="nav-trigger"
          on:click={() => navigation.toggleMenu()}
          aria-label={$_('nav.toggle_menu')}
          aria-expanded={$navigation.isMenuOpen}
          aria-controls="primary-navigation"
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
    background: color-mix(in srgb, var(--bg-surface) 78%, rgba(255, 255, 255, 0) 22%);
    background-image:
      linear-gradient(120deg, rgba(var(--voyage-blue-rgb), 0.12) 0%, rgba(var(--aurora-purple-rgb), 0.1) 100%),
      var(--grain-texture);
    background-blend-mode: screen, soft-light;
    backdrop-filter: blur(28px) saturate(135%);
    border-bottom: 1px solid color-mix(in srgb, var(--border-glass) 68%, rgba(17, 24, 39, 0.08) 32%);
    transition: transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out),
      background var(--duration-normal) var(--ease-out);
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  }

  .nav-shell.hidden {
    transform: translateY(-100%);
  }

  .nav-shell.nav-condensed {
    box-shadow: 0 24px 52px rgba(15, 20, 35, 0.12);
    border-bottom-color: color-mix(in srgb, var(--border-strong) 55%, rgba(12, 18, 34, 0.2) 45%);
    background: color-mix(in srgb, var(--bg-elevated) 78%, rgba(var(--voyage-blue-rgb), 0.16) 22%);
    background-image:
      linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.18) 0%, rgba(var(--aurora-purple-rgb), 0.12) 42%, transparent 100%),
      var(--grain-texture);
  }

  :global([data-base-theme='dark']) .nav-shell {
    background: color-mix(in srgb, rgba(6, 12, 26, 0.78) 68%, rgba(var(--voyage-blue-rgb), 0.26) 32%);
    background-image:
      linear-gradient(122deg, rgba(var(--voyage-blue-rgb), 0.24) 0%, rgba(var(--aurora-purple-rgb), 0.2) 100%),
      var(--grain-texture);
    border-bottom: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 60%, rgba(255, 255, 255, 0.08) 40%);
    box-shadow: 0 22px 54px rgba(4, 7, 18, 0.45);
  }

  :global([data-base-theme='dark']) .nav-shell.nav-condensed {
    background: color-mix(in srgb, rgba(8, 14, 30, 0.86) 62%, rgba(var(--voyage-blue-rgb), 0.28) 38%);
    background-image:
      linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.28) 0%, rgba(var(--aurora-purple-rgb), 0.22) 44%, transparent 100%),
      var(--grain-texture);
    box-shadow: 0 28px 68px rgba(3, 6, 18, 0.52);
    border-bottom-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 58%, rgba(255, 255, 255, 0.1) 42%);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-shell {
    background: #050505;
    border-bottom: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.8);
    background-image: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-shell.nav-condensed {
    background: #070707;
    border-bottom-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 22px 54px rgba(0, 0, 0, 0.82);
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
    transition:
      color var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--text-primary);
    background: color-mix(in srgb, var(--control-surface-hover) 78%, rgba(255, 255, 255, 0.1) 22%);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.14);
    transform: translateY(-1px);
  }

  .nav-link.active {
    color: var(--text-primary);
    background: color-mix(in srgb, var(--control-surface-hover) 82%, rgba(var(--voyage-blue-rgb), 0.12) 18%);
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.18);
  }

  .nav-link__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.1rem 0.55rem;
    font-size: 0.75rem;
    font-weight: var(--weight-semibold);
    border-radius: var(--radius-full);
    background: color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.22) 65%, rgba(255, 255, 255, 0.16) 35%);
    color: color-mix(in srgb, var(--text-strong) 82%, rgba(var(--voyage-blue-rgb), 0.28) 18%);
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
    background: var(--bg-surface);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, rgba(var(--voyage-blue-rgb), 0.18) 28%);
    box-shadow: 0 32px 68px rgba(15, 23, 42, 0.18);
    transition:
      opacity var(--duration-normal) var(--ease-out),
      transform var(--duration-normal) var(--ease-out),
      visibility var(--duration-normal) var(--ease-out);
    z-index: var(--z-elevated);
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
    background: color-mix(in srgb, var(--control-surface) 85%, rgba(255, 255, 255, 0.16) 15%);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 76%, rgba(var(--voyage-blue-rgb), 0.18) 24%);
    color: inherit;
    text-decoration: none;
    transition: border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
  }

  .nav-submenu__link:hover,
  .nav-submenu__link:focus-visible {
    border-color: color-mix(in srgb, var(--border-strong) 68%, rgba(var(--aurora-purple-rgb), 0.26) 32%);
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.65rem 1.25rem;
    border-radius: var(--radius-full);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.18) 52%, rgba(var(--aurora-purple-rgb), 0.18) 48%);
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 58%, rgba(255, 255, 255, 0.18) 42%);
    color: var(--text-primary);
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.18);
    transition:
      background var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }

  .nav-button:hover,
  .nav-button:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 24px 54px rgba(15, 23, 42, 0.22);
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.24) 56%, rgba(var(--aurora-purple-rgb), 0.22) 44%);
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
    background: color-mix(in srgb, var(--control-surface) 88%, rgba(255, 255, 255, 0.2) 12%);
    border: 1px solid var(--control-border);
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
      border: 1px solid color-mix(in srgb, var(--border-subtle) 75%, rgba(var(--voyage-blue-rgb), 0.16) 25%);
      background: color-mix(in srgb, var(--bg-surface) 88%, rgba(var(--voyage-blue-rgb), 0.14) 12%);
      box-shadow: 0 32px 68px rgba(15, 23, 42, 0.22);
      transform: translateY(-20px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition:
        opacity var(--duration-normal) var(--ease-out),
        transform var(--duration-normal) var(--ease-out),
        visibility var(--duration-normal) var(--ease-out);
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
      background: none;
      border: none;
      box-shadow: none;
      padding: 0;
      gap: 0.75rem;
      margin-top: 0.6rem;
    }

    .nav-submenu__link {
      background: color-mix(in srgb, var(--control-surface) 88%, rgba(255, 255, 255, 0.1) 12%);
      border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, rgba(var(--voyage-blue-rgb), 0.18) 30%);
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
    background: var(--bg-surface);
    border: 2px solid #000;
    box-shadow: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-button {
    background: #000;
    color: #fff;
    border-color: #000;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .nav-submenu__link {
    border: 2px solid #000;
    background: var(--bg-surface);
  }
</style>
