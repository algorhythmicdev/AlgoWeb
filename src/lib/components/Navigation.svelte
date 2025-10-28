<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { page } from '$app/stores';
  import { i18n } from '$lib/i18n';
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
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  const resolve = (href: string) => isExternal(href)
    ? href
    : href === '/'
      ? appBase || '/'
      : `${appBase}${href}`;
  const stripBase = (path: string) => appBase && path.startsWith(appBase) ? path.slice(appBase.length) || '/' : path || '/';
  $: current = stripBase($page.url.pathname).replace(/\/+$/,'') || '/';
</script>

<nav aria-label="Primary">
  <ul role="list" class="nav">
    {#each items as i}
      <li><a href={resolve(i.href)} aria-current={current===i.href?'page':undefined}>{t(i.key)}</a></li>
    {/each}
  </ul>
</nav>
