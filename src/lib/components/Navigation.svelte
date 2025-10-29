<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
  import BrandMark from '$lib/components/BrandMark.svelte';
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
  const resolve = (href: string) => href === '/' ? (appBase || '/') : `${appBase}${href}`;
  const stripBase = (path: string) => appBase && path.startsWith(appBase) ? path.slice(appBase.length) || '/' : path || '/';
  $: current = stripBase($page.url.pathname).replace(/\/+$/,'') || '/';
</script>

<div class="site-nav-wrap">
  <BrandMark />
  <nav class="site-nav" aria-label="Primary">
    <ul class="nav-list" role="list">
      {#each items as i}
        <li>
          <a href={resolve(i.href)} aria-current={current===i.href?'page':undefined}>{t(i.key)}</a>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .site-nav-wrap{
    display:flex;
    align-items:center;
    gap:1rem;
  }
  .site-nav{ background: transparent; }
  .nav-list{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: .875rem 1.25rem;
  }
  .nav-list a{
    text-decoration: none;
    color: var(--text-secondary, var(--text));
    font-weight: 500;
  }
  .nav-list a[aria-current="page"]{
    font-weight: 600;
    color: var(--text-strong, var(--text));
  }
</style>
