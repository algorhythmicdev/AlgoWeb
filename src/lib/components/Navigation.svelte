<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { onDestroy } from 'svelte';
  import { navigation } from '$stores/navigation';
  import LanguageSwitcher from './language-switcher.svelte';
  import ThemeToggle from './theme-toggle.svelte';
  import { mainNavigation } from '$config/navigation';

  let isScrolled = false;
  let lastKnownScrollY = 0;
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
    const scrollY = Math.max(0, lastKnownScrollY);
    isScrolled = scrollY > 32;
    navigation.updateScroll(scrollY);
    ticking = false;
  }

  function handleWindowScroll() {
    lastKnownScrollY = window.scrollY || 0;

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

<svelte:window on:scroll={handleWindowScroll} on:resize={handleResize} on:keydown={handleKeydown} />

<nav
  class="nav"
  class:nav-condensed={isScrolled}
  class:hidden={$navigation.scrollDirection === 'down' && $navigation.lastScrollY > 200}
  class:menu-open={$navigation.isMenuOpen}
>
  <div class="container nav-container">
    <a href="/" class="brand" aria-label={$_('nav.brand_aria')}>
      <img src="/images/brand/logo-main.webp" alt={$_('nav.brand_name')} width="148" height="40" />
    </a>

    <div class="nav-content">
      <div class="nav-links" class:open={$navigation.isMenuOpen} id="primary-navigation">
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
    background: color-mix(in srgb, var(--pure-white) 78%, rgba(255, 255, 255, 0) 22%);
    background-image:
      linear-gradient(120deg, rgba(19, 81, 255, 0.1) 0%, rgba(106, 56, 255, 0.08) 100%),
      var(--grain-texture);
    background-blend-mode: screen, soft-light;
    backdrop-filter: blur(26px);
    border-bottom: 1px solid color-mix(in srgb, var(--border-glass) 60%, rgba(17, 24, 39, 0.08) 40%);
    transition: transform var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out),
      border-color var(--duration-normal) var(--ease-out),
      background var(--duration-normal) var(--ease-out);
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
    border-bottom-left-radius: var(--radius-xl);
    border-bottom-right-radius: var(--radius-xl);
    overflow: hidden;
  }

  .nav.hidden { transform: translateY(-100%); }

  .nav-condensed {
    box-shadow: 0 24px 52px rgba(15, 20, 35, 0.12);
    border-bottom-color: rgba(15, 20, 35, 0.14);
    background: color-mix(in srgb, var(--pure-white) 82%, rgba(19, 81, 255, 0.08) 18%);
    background-image:
      linear-gradient(135deg, rgba(19, 81, 255, 0.12) 0%, rgba(106, 56, 255, 0.08) 40%, transparent 100%),
      var(--grain-texture);
    background-blend-mode: screen, soft-light;
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: clamp(1rem, 2vw, 1.35rem) 0;
  }

  .brand img {
    display: block;
    width: clamp(128px, 22vw, 148px);
    height: auto;
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
    background: var(--nav-gradient, var(--gradient-text));
    background-size: 220% 220%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    opacity: 0.75;
    transition: opacity var(--duration-fast) var(--ease-out);
    animation: navGradientDrift 14s ease-in-out infinite;
    animation-delay: calc(var(--nav-index, 0) * -1.6s);
  }

  .nav-link:hover span,
  .nav-link.active span { opacity: 1; }

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
    border: 1px solid transparent;
    background: var(--gradient-spectrum-4);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--pure-white);
    transition: all var(--duration-fast) var(--ease-out);
    backdrop-filter: blur(22px);
    box-shadow: 0 16px 32px rgba(19, 81, 255, 0.18);
  }

  .nav-cta:hover {
    background: var(--gradient-spectrum-5);
    color: var(--pure-white);
    border-color: transparent;
    box-shadow: 0 22px 46px rgba(19, 81, 255, 0.28);
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
      background: color-mix(in srgb, var(--surface-glass) 85%, transparent);
      background-image:
        linear-gradient(140deg, rgba(19, 81, 255, 0.14), rgba(106, 56, 255, 0.1)),
        var(--grain-texture);
      background-blend-mode: screen, soft-light;
      border: 1px solid color-mix(in srgb, var(--border-glass) 60%, rgba(17, 24, 39, 0.08) 40%);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(22px);
      max-height: calc(100vh - clamp(68px, 12vw, 80px) - 2rem);
      overflow-y: auto;
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

  @media (max-width: 600px) {
    .nav-container {
      padding: clamp(0.75rem, 6vw, 1rem) 0;
    }

    .nav-links {
      left: clamp(0.75rem, 5vw, 1rem);
      right: clamp(0.75rem, 5vw, 1rem);
      border-radius: var(--radius-xl);
      padding: clamp(1.6rem, 6vw, 2rem);
      gap: 1.2rem;
    }
  }

  @media (max-width: 420px) {
    .nav-links {
      left: clamp(0.6rem, 4vw, 0.85rem);
      right: clamp(0.6rem, 4vw, 0.85rem);
    }

    .nav-link {
      font-size: 1rem;
    }
  }

  :global([data-theme='dark']) .nav {
    background: color-mix(in srgb, rgba(8, 16, 34, 0.95) 85%, transparent);
    background-image:
      linear-gradient(130deg, rgba(47, 92, 220, 0.18) 0%, rgba(106, 56, 255, 0.16) 100%),
      var(--grain-texture);
    border-bottom-color: rgba(70, 120, 255, 0.3);
    box-shadow: 0 24px 58px rgba(2, 6, 18, 0.6);
  }

  :global([data-theme='dark']) .nav-condensed {
    background: color-mix(in srgb, rgba(8, 16, 34, 0.96) 90%, rgba(47, 92, 220, 0.16) 10%);
    border-bottom-color: rgba(90, 140, 255, 0.38);
  }

  :global([data-theme='dark']) .nav-link span {
    opacity: 0.82;
  }

  :global([data-theme='dark']) .nav-cta {
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

  @media (prefers-reduced-motion: reduce) {
    .nav-link span {
      animation: none;
      background-size: 100% 100%;
    }
  }

</style>
