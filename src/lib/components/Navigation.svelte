<script>
  import { page } from '$app/stores';
  import { _ } from 'svelte-i18n';
  import { navigation } from '$stores/navigation';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import { mainNavigation } from '$config/navigation';
  
  let isScrolled = false;
  
  $: currentPath = $page.url.pathname;
  
  function handleScroll() {
    const scrollY = window.scrollY;
    isScrolled = scrollY > 50;
    navigation.updateScroll(scrollY);
  }
</script>

<svelte:window on:scroll={handleScroll} />

<nav class="nav" class:scrolled={isScrolled} class:hidden={$navigation.scrollDirection === 'down' && $navigation.lastScrollY > 200}>
  <div class="container nav-container">
    <a href="/" class="logo">
      <img src="/images/brand/logo-main.webp" alt="AlgoRhythmics" width="150" height="40" />
    </a>
    
    <div class="nav-links" class:open={$navigation.isMenuOpen}>
      {#each mainNavigation as item}
        <a 
          href={item.href} 
          class="nav-link" 
          class:active={currentPath === item.href}
          on:click={() => navigation.closeMenu()}
        >
          {$_(item.label)}
          {#if item.badge}
            <span class="badge">{$_(item.badge)}</span>
          {/if}
        </a>
      {/each}
    </div>
    
    <div class="nav-actions">
      <LanguageSwitcher />
      <ThemeToggle />
      <button 
        class="menu-toggle" 
        on:click={() => navigation.toggleMenu()}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
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
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border-bottom: 1px solid var(--glass-border);
    transition: all var(--duration-normal) var(--ease-out);
  }
  
  .nav.hidden {
    transform: translateY(-100%);
  }
  
  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-3);
    padding-bottom: var(--space-3);
  }
  
  .logo img {
    display: block;
    height: 40px;
    width: auto;
  }
  
  .nav-links {
    display: flex;
    gap: var(--space-6);
    align-items: center;
  }
  
  .nav-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-weight: var(--weight-medium);
    color: var(--text-primary);
    transition: color var(--duration-fast) var(--ease-out);
    white-space: nowrap;
  }
  
  .nav-link:hover {
    color: var(--voyage-blue);
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--voyage-blue);
  }
  
  .badge {
    display: inline-block;
    padding: 2px 8px;
    font-size: var(--text-caption);
    background: var(--signal-yellow);
    color: var(--ink);
    border-radius: var(--radius-full);
    font-weight: var(--weight-semibold);
  }
  
  .nav-actions {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }
  
  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    padding: var(--space-2);
    background: transparent;
  }
  
  .menu-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      flex-direction: column;
      background: var(--bg-surface);
      padding: var(--space-4);
      box-shadow: var(--shadow-lg);
      transform: translateX(-100%);
      transition: transform var(--duration-normal) var(--ease-out);
    }
    
    .nav-links.open {
      transform: translateX(0);
    }
    
    .menu-toggle {
      display: flex;
    }
  }
</style>
