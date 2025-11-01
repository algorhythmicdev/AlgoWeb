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
</script>

<div class="site-nav-wrap">
  <BrandMark />
  <nav class="container page" aria-label="Primary">
    <ul>
      {#each items as i}
        <li><a href={resolve(i.href)} aria-current={current===i.href?'page':undefined}>{t(i.key)}</a></li>
      {/each}
    </ul>
    <div class="controls">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  </nav>
</div>

<style>
  .site-nav-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 1.5rem;
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
  
  @media (max-width: 1024px) {
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
  
  @media (max-width: 640px) {
    nav ul {
      gap: 0.375rem;
      font-size: 0.875rem;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding: 0.25rem;
      border-radius: 18px;
    }
    
    nav ul::-webkit-scrollbar {
      display: none;
    }
    
    nav a {
      padding: 0.5rem 0.875rem;
      white-space: nowrap;
      border-radius: 14px;
    }
  }
</style>
