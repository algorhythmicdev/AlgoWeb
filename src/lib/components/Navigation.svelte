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
    padding: 1.35rem 0;
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
    background: var(--gradient-text);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    opacity: 0.72;
    transition: opacity var(--duration-fast) var(--ease-out);
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
    border: 1px solid rgba(19, 81, 255, 0.22);
    background: color-mix(in srgb, var(--pure-white) 78%, rgba(19, 81, 255, 0.1) 22%);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
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

    .nav-link { font-size: 1.05rem; padding: 0.5rem 0; }

    .nav-actions { gap: var(--space-2); }

    .nav-cta { display: none; }

    .menu-toggle { display: inline-flex; }
  }
</style>
