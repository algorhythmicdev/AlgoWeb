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
    gap: 0.25rem;
    align-items: center;
    flex-wrap: wrap;
  }
  
  nav a {
    padding: 0.5rem 0.875rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all var(--anim-fast, 200ms) var(--ease-apple, ease);
  }
  
  nav a:hover {
    background: var(--bg-elev-1);
  }
  
  nav a[aria-current="page"] {
    background: var(--bg-elev-2);
    outline: none;
    font-weight: 600;
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
      gap: 0.125rem;
      font-size: 0.875rem;
    }
    
    nav a {
      padding: 0.375rem 0.625rem;
    }
  }
</style>
