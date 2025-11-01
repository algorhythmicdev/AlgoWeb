<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import BrandMark from '$lib/components/BrandMark.svelte';
  import LanguageSwitcher from '$lib/components/language-switcher.svelte';
  import ThemeToggle from '$lib/components/theme-toggle.svelte';
  $: t = $i18n;

  const items = [
    { href:'/', key:'nav.home' },
    { href:'/team', key:'nav.team' },
    { href:'/ideonautix', key:'nav.ideonautix' },
    { href:'/nodevoyage', key:'nav.nodevoyage' },
    { href:'/consulting', key:'nav.consulting' },
    { href:'/contact', key:'nav.contact' },
    { href:'/education', key:'nav.education' }
  ];
  const resolve = (href: string) => href === '/' ? (base || '/') : `${base}${href}`;
  const stripBase = (path: string) => base && path.startsWith(base) ? path.slice(base.length) || '/' : path || '/';
  $: current = stripBase($page.url.pathname).replace(/\/+$/,'') || '/';
  
  let mobileMenuOpen = false;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<div class="site-nav-wrap">
  <BrandMark />
  
  <button 
    class="mobile-menu-toggle" 
    aria-label="Toggle menu"
    aria-expanded={mobileMenuOpen}
    on:click={toggleMobileMenu}
  >
    <span class="hamburger" class:open={mobileMenuOpen}>
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>
  
  <nav class="container page" aria-label="Primary" class:mobile-open={mobileMenuOpen}>
    <ul>
      {#each items as i}
        <li><a href={resolve(i.href)} aria-current={current===i.href?'page':undefined} on:click={closeMobileMenu}>{t(i.key)}</a></li>
      {/each}
    </ul>
    <div class="controls">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  </nav>
</div>

{#if mobileMenuOpen}
  <div class="mobile-overlay" on:click={closeMobileMenu} role="presentation"></div>
{/if}

<style>
  .site-nav-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 1.5rem;
    position: relative;
  }
  
  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 1001;
  }
  
  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 28px;
    height: 24px;
    position: relative;
  }
  
  .hamburger span {
    display: block;
    height: 3px;
    width: 100%;
    background: var(--text-strong);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  .hamburger.open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }
  
  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger.open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
  
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 2rem;
  }
  
  nav ul {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: nowrap;
    padding: 0.375rem;
    background: color-mix(in srgb, var(--bg-elev-1) 60%, transparent);
    backdrop-filter: blur(var(--glass-blur, 24px));
    border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--control-border) 40%, transparent);
  }
  
  nav a {
    padding: 0.625rem 1.125rem;
    border-radius: 16px;
    font-weight: 500;
    transition: all var(--anim-fast, 200ms) var(--ease-apple, ease);
    backdrop-filter: blur(8px);
  }
  
  nav a:hover {
    background: color-mix(in srgb, var(--bg-elev-2) 70%, transparent);
    transform: translateY(-1px);
    box-shadow: var(--shadow-subtle);
  }
  
  nav a[aria-current="page"] {
    background: color-mix(in srgb, var(--primary) 15%, var(--bg-elev-2));
    outline: none;
    font-weight: 600;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--primary) 12%, transparent),
                inset 0 1px 0 color-mix(in srgb, white 10%, transparent);
  }
  
  .controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .mobile-overlay {
    display: none;
  }
  
  @media (max-width: 768px) {
    .mobile-menu-toggle {
      display: block;
    }
    
    nav {
      position: fixed;
      top: 0;
      right: -100%;
      height: 100vh;
      width: 280px;
      max-width: 80vw;
      background: var(--bg);
      backdrop-filter: blur(24px);
      flex-direction: column;
      justify-content: flex-start;
      padding: 5rem 1.5rem 2rem;
      gap: 2rem;
      transition: right 0.3s ease;
      z-index: 1000;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
      overflow-y: auto;
    }
    
    nav.mobile-open {
      right: 0;
    }
    
    nav ul {
      flex-direction: column;
      width: 100%;
      padding: 0;
      background: transparent;
      border: none;
      backdrop-filter: none;
      gap: 0.5rem;
    }
    
    nav li {
      width: 100%;
    }
    
    nav a {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.875rem 1.25rem;
    }
    
    .controls {
      width: 100%;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    
    .mobile-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  
  @media (max-width: 1024px) and (min-width: 769px) {
    .site-nav-wrap {
      flex-wrap: wrap;
    }
    
    nav {
      flex-direction: column;
      gap: 1rem;
    }
    
    nav ul {
      justify-content: center;
    }
  }
</style>
