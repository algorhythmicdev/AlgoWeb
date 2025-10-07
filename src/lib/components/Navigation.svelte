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

  const navGradients = [
    'var(--gradient-spectrum-1)',
    'var(--gradient-spectrum-2)',
    'var(--gradient-spectrum-3)',
    'var(--gradient-spectrum-4)',
    'var(--gradient-spectrum-5)'
  ];

  function updateScrollState() {
    const scrollY = window.scrollY;
    isScrolled = scrollY > 32;
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
  class="nav"
  class:nav-condensed={isScrolled}
  class:hidden={$navigation.scrollDirection === 'down' && $navigation.lastScrollY > 200}
  class:menu-open={$navigation.isMenuOpen}
>
  <div class="container nav-container">
    <a href="/" class="brand" aria-label={$_('nav.brand_aria')}>
      <img
        src={$theme === 'light' ? '/images/brand/logo-main.png' : '/images/brand/logo-white.png'}
        alt={$_('nav.brand_name')}
        width="148"
        height="40"
      />
    </a>

    <div class="nav-content">
      <div id="primary-navigation" class="nav-links" class:open={$navigation.isMenuOpen}>
        {#each mainNavigation as item, index}
          <a
            href={item.href}
            class="nav-link"
            class:active={currentPath === item.href}
            on:click={() => navigation.closeMenu()}
            style={`--nav-gradient:${navGradients[index % navGradients.length]}; --nav-index:${index};`}
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
        <button
          class="menu-toggle"
          on:click={() => navigation.toggleMenu()}
          aria-label={$_('nav.toggle_menu')}
          aria-expanded={$navigation.isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </div>
</nav>

<button
  type="button"
  class="nav-overlay"
  class:visible={$navigation.isMenuOpen}
  aria-hidden="true"
  tabindex="-1"
  on:click={() => navigation.closeMenu()}
></button>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-sticky);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(255, 255, 255, 0) 18%);
    background-image:
      linear-gradient(120deg, rgba(var(--voyage-blue-rgb), 0.12) 0%, rgba(var(--aurora-purple-rgb), 0.1) 100%),
      var(--grain-texture);
    background-blend-mode: screen, soft-light;
    backdrop-filter: blur(28px) saturate(130%);
    border-bottom: 1px solid color-mix(in srgb, var(--border-glass) 68%, rgba(17, 24, 39, 0.08) 32%);
    transition: transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out),
      background var(--duration-normal) var(--ease-out);
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  }

  .nav.hidden { transform: translateY(-100%); }

  .nav-condensed {
    box-shadow: 0 24px 52px rgba(15, 20, 35, 0.12);
    border-bottom-color: color-mix(in srgb, var(--border-strong) 55%, rgba(12, 18, 34, 0.2) 45%);
    background: color-mix(in srgb, var(--bg-elevated) 78%, rgba(var(--voyage-blue-rgb), 0.16) 22%);
    background-image:
      linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.16) 0%, rgba(var(--aurora-purple-rgb), 0.12) 40%, transparent 100%),
      var(--grain-texture);
    background-blend-mode: screen, soft-light;
  }

  :global([data-base-theme='dark']) .nav {
    background: color-mix(in srgb, rgba(6, 12, 26, 0.78) 70%, rgba(var(--voyage-blue-rgb), 0.24) 30%);
    background-image:
      linear-gradient(122deg, rgba(var(--voyage-blue-rgb), 0.22) 0%, rgba(var(--aurora-purple-rgb), 0.2) 100%),
      var(--grain-texture);
    border-bottom: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 62%, rgba(255, 255, 255, 0.08) 38%);
    box-shadow: 0 22px 54px rgba(4, 7, 18, 0.45);
  }

  :global([data-base-theme='dark']) .nav.nav-condensed {
    background: color-mix(in srgb, rgba(8, 14, 30, 0.86) 62%, rgba(var(--voyage-blue-rgb), 0.28) 38%);
    background-image:
      linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.28) 0%, rgba(var(--aurora-purple-rgb), 0.22) 44%, transparent 100%),
      var(--grain-texture);
    box-shadow: 0 28px 68px rgba(3, 6, 18, 0.52);
    border-bottom-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 58%, rgba(255, 255, 255, 0.1) 42%);
  }

  :global([data-theme='contrast']) .nav {
    background: #050505;
    border-bottom: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.8);
    background-image: none;
  }

  :global([data-theme='contrast']) .nav.nav-condensed {
    background: #070707;
    border-bottom-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 22px 54px rgba(0, 0, 0, 0.82);
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.35rem 0;
  }

  .brand img {
    display: block;
    width: clamp(128px, 22vw, 148px);
    height: auto;
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .nav-content {
    display: flex;
    align-items: center;
    gap: var(--space-6);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: clamp(1.6rem, 3vw, 2.2rem);
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: clamp(0.35rem, 0.8vw, 0.55rem);
    font-weight: var(--weight-semibold);
    padding: clamp(0.35rem, 0.8vw, 0.55rem) clamp(0.75rem, 1.4vw, 1rem);
    border-radius: var(--radius-full);
    color: var(--text-secondary);
    transition: background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .nav-link span {
    color: inherit;
    font-size: var(--text-small);
    letter-spacing: 0.01em;
    text-transform: none;
    white-space: nowrap;
  }

  .nav-link:hover,
  .nav-link:focus-visible,
  .nav-link.active {
    background: color-mix(in srgb, var(--accent-primary) 14%, transparent 86%);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  :global(html[data-base-theme='dark']) .nav-link {
    color: color-mix(in srgb, #cfd8f6 80%, rgba(var(--aurora-purple-rgb), 0.28) 20%);
  }

  :global(html[data-base-theme='dark']) .nav-link:hover,
  :global(html[data-base-theme='dark']) .nav-link.active {
    color: var(--text-primary);
    background: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.2) 60%, rgba(var(--voyage-blue-rgb), 0.2) 40%);
  }

  .nav-badge {
    font-size: var(--text-caption);
    color: var(--accent-primary);
    background: color-mix(in srgb, var(--accent-primary) 12%, transparent 88%);
    border-radius: var(--radius-full);
    padding: 0.15rem 0.55rem;
    border: 1px solid rgba(var(--accent-primary-rgb), 0.32);
  }

  :global([data-base-theme='dark']) .nav-badge {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 65%, rgba(6, 12, 26, 0.78) 35%);
    color: rgba(228, 236, 255, 0.94);
  }

  :global([data-theme='contrast']) .nav-badge {
    background: #ffffff;
    color: #000000;
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
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(19, 81, 255, 0.22);
    background: color-mix(in srgb, var(--pure-white) 78%, rgba(19, 81, 255, 0.1) 22%);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--pure-white);
    transition: all var(--duration-fast) var(--ease-out);
    backdrop-filter: blur(22px);
    box-shadow: 0 16px 32px rgba(19, 81, 255, 0.12);
  }

  .nav-cta:hover {
    background: var(--gradient-primary);
    color: var(--pure-white);
    border-color: transparent;
    box-shadow: 0 22px 46px rgba(19, 81, 255, 0.24);
  }

  :global([data-base-theme='dark']) .nav-cta {
    background: linear-gradient(145deg, rgba(var(--voyage-blue-rgb), 0.32) 0%, rgba(var(--aurora-purple-rgb), 0.28) 70%);
    border-color: rgba(102, 140, 255, 0.42);
    box-shadow: 0 18px 42px rgba(4, 7, 18, 0.55);
    color: rgba(236, 242, 255, 0.95);
  }

  :global([data-theme='contrast']) .nav-cta {
    background: #ffffff;
    color: #000000;
    border-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.68);
  }

  :global([data-theme='contrast']) .nav-cta:hover {
    background: #ffd339;
    color: #000000;
    border-color: #ffd339;
    box-shadow: 0 18px 42px rgba(255, 211, 57, 0.45);
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

  :global([data-theme='contrast']) .menu-toggle span {
    background: #ffffff;
  }

  .nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(4, 9, 26, 0.38);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-normal) var(--ease-out);
    z-index: calc(var(--z-sticky) - 2);
  }

  :global([data-theme='contrast']) .nav-overlay {
    background: rgba(255, 255, 255, 0.18);
  }

  .nav-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }

  @media (max-width: 960px) {
    .nav-content { gap: var(--space-3); }
    .nav-links {
      position: fixed;
      top: clamp(68px, 12vw, 80px);
      left: clamp(1rem, 5vw, 1.5rem);
      right: clamp(1rem, 5vw, 1.5rem);
      flex-direction: column;
      align-items: stretch;
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      background: color-mix(in srgb, var(--pure-white) 78%, rgba(19, 81, 255, 0.08) 22%);
      background-image: var(--grain-texture);
      background-blend-mode: soft-light;
      border: 1px solid color-mix(in srgb, var(--border-glass) 60%, rgba(17, 24, 39, 0.08) 40%);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(22px);
      transform: translateY(-20px);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--duration-normal) var(--ease-out),
        transform var(--duration-normal) var(--ease-out);
    }

    :global([data-base-theme='dark']) .nav-links {
      background: color-mix(in srgb, rgba(12, 18, 40, 0.9) 75%, rgba(var(--voyage-blue-rgb), 0.3) 25%);
      border-color: rgba(94, 130, 240, 0.42);
      box-shadow: 0 26px 56px rgba(2, 6, 18, 0.64);
    }

    :global([data-theme='contrast']) .nav-links {
      background: #050505;
      border-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.82);
    }

    .nav-links.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    .nav-link {
      font-size: 1.05rem;
      padding: 0.65rem clamp(0.75rem, 3vw, 1.15rem);
      justify-content: space-between;
      border-radius: var(--radius-lg);
    }
  }
  /* motion-safe adjustments */
  @media (prefers-reduced-motion: reduce) {
    .nav {
      transition: none;
    }

    .nav-link span {
    color: inherit;
    font-size: var(--text-small);
    letter-spacing: 0.01em;
    text-transform: none;
    white-space: nowrap;
  }
  }
</style>



