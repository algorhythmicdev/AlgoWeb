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
        src={$theme === 'dark' ? '/images/brand/logo-white.webp' : '/images/brand/logo-main.webp'}
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

  :global([data-theme='dark']) .nav {
    background: color-mix(in srgb, rgba(6, 12, 26, 0.78) 70%, rgba(var(--voyage-blue-rgb), 0.24) 30%);
    background-image:
      linear-gradient(122deg, rgba(var(--voyage-blue-rgb), 0.22) 0%, rgba(var(--aurora-purple-rgb), 0.2) 100%),
      var(--grain-texture);
    border-bottom: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 62%, rgba(255, 255, 255, 0.08) 38%);
    box-shadow: 0 22px 54px rgba(4, 7, 18, 0.45);
  }

  :global([data-theme='dark']) .nav.nav-condensed {
    background: color-mix(in srgb, rgba(8, 14, 30, 0.86) 62%, rgba(var(--voyage-blue-rgb), 0.28) 38%);
    background-image:
      linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.28) 0%, rgba(var(--aurora-purple-rgb), 0.22) 44%, transparent 100%),
      var(--grain-texture);
    box-shadow: 0 28px 68px rgba(3, 6, 18, 0.52);
    border-bottom-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 58%, rgba(255, 255, 255, 0.1) 42%);
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
    gap: 0.35rem;
    align-items: center;
    font-weight: var(--weight-medium);
    padding: 0.25rem 0;
  }

  .nav-link span {
    color: color-mix(in srgb, var(--text-secondary) 88%, rgba(var(--voyage-blue-rgb), 0.1) 12%);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover span,
  .nav-link.active span {
    color: var(--text-primary);
  }

  :global(html[data-theme='dark']) .nav-link span {
    color: color-mix(in srgb, var(--text-tertiary) 84%, rgba(var(--voyage-blue-rgb), 0.24) 16%);
  }

  :global(html[data-theme='dark']) .nav-link:hover span,
  :global(html[data-theme='dark']) .nav-link.active span {
    color: var(--text-primary);
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -0.55rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, rgba(19, 81, 255, 0), rgba(19, 81, 255, 0.65), rgba(106, 56, 255, 0));
    transform: scaleX(0);
    transform-origin: center;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover::after,
  .nav-link.active::after { transform: scaleX(1); }

  .nav-badge {
    font-size: var(--text-caption);
    color: var(--voyage-blue);
    background: rgba(19, 81, 255, 0.1);
    border-radius: var(--radius-full);
    padding: 0.1rem 0.45rem;
    font-weight: var(--weight-semibold);
  }

  :global([data-theme='dark']) .nav-badge {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 65%, rgba(6, 12, 26, 0.78) 35%);
    color: rgba(228, 236, 255, 0.94);
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

  .nav-overlay {
    position: fixed;
    inset: 0;
    background: rgba(4, 9, 26, 0.38);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-normal) var(--ease-out);
    z-index: calc(var(--z-sticky) - 2);
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

    .nav-links.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    .nav-link {
      font-size: 1.05rem;
      padding: 0.65rem 0;
      justify-content: space-between;
    }

    .nav-actions { gap: var(--space-2); }

    .nav-cta { display: none; }

    .menu-toggle { display: inline-flex; }
  }

  :global([data-theme='dark']) .nav-cta {
    background: var(--gradient-primary);
    border-color: transparent;
    color: var(--pure-white);
    box-shadow: 0 24px 52px rgba(2, 6, 18, 0.56);
  }

  :global([data-theme='dark']) .nav-links {
    background: color-mix(in srgb, rgba(8, 18, 40, 0.88) 88%, transparent);
    border-color: rgba(70, 120, 255, 0.32);
  }

  @keyframes navGradientDrift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  /* motion-safe adjustments */
  @media (prefers-reduced-motion: reduce) {
    .nav {
      transition: none;
    }

    .nav-link span {
      transition: none;
    }
  }
</style>
