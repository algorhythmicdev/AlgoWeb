<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { page } from '$app/stores';
  const items = [
    { href: '/',            label: 'Home' },
    { href: '/team',        label: 'Team' },
    { href: '/ideonautix',  label: 'Ideonautix' },
    { href: '/nodevoyage',  label: 'NodeVoyage' },
    { href: '/consulting',  label: 'Consulting' },
    { href: '/contact',     label: 'Contact' },
    { href: '/education',   label: 'Education' }
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
    {#each items as item}
      <li><a href={resolve(item.href)} aria-current={current === item.href ? 'page' : undefined}>{item.label}</a></li>
    {/each}
  </ul>
</nav>
