<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { page } from '$app/stores';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { partners } from '$lib/presentAssets';

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/ideonautix', label: 'Ideonautix' },
    { href: '/nodevoyage', label: 'NodeVoyage' },
    { href: '/consulting', label: 'Consulting' },
    { href: '/contact', label: 'Contact' },
    { href: '/education', label: 'Education' }
  ];
  const legal = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/cookies', label: 'Cookies' }
  ];

  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  const resolve = (href: string) =>
    isExternal(href) ? href : href === '/' ? appBase || '/' : `${appBase}${href}`;
  const stripBase = (path: string) =>
    appBase && path.startsWith(appBase) ? path.slice(appBase.length) || '/' : path || '/';
  const normalize = (href: string) => (isExternal(href) ? null : href.replace(/\/+$/, '') || '/');
  const partnerAlt = (path: string) => (path.split('/').pop() || 'Partner').replace(/\.[^.]+$/, '');

  $: current = stripBase($page.url.pathname).replace(/\/+$/, '') || '/';
  const isCurrent = (href: string) => {
    const normalized = normalize(href);
    return normalized ? normalized === current : false;
  };

</script>

<footer class="section surface-1 control" aria-label="Site footer">
  <div class="container">
    <nav aria-label="Footer">
      <ul role="list" class="nav">
        {#each nav as i}
          <li>
            <a href={resolve(i.href)} aria-current={isCurrent(i.href) ? 'page' : undefined}>{i.label}</a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="divider" style="margin:.75rem 0"></div>

    <div style="display:flex;gap:1rem;align-items:center;margin:1rem 0;">
      {#if partners.length === 0}
        <div class="card surface-2 control" style="padding:.5rem 1rem;border-radius:8px">LIAA</div>
        <div class="card surface-2 control" style="padding:.5rem 1rem;border-radius:8px">Reclame Fabriek</div>
      {:else}
        {#each partners as p}
          <AssetImage src={p} alt={partnerAlt(p)} width={160} height={40} radius={6} />
        {/each}
      {/if}
    </div>

    <div class="divider" style="margin:.75rem 0"></div>

    <ul role="list" class="nav">
      {#each legal as i}
        <li>
          <a href={resolve(i.href)} aria-current={isCurrent(i.href) ? 'page' : undefined}>{i.label}</a>
        </li>
      {/each}
    </ul>
  </div>
</footer>
