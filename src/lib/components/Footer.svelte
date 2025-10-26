<script lang="ts">
  import { base } from '$app/paths';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { partners as partnerList } from '$lib/assets';
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
  const resolve = (href: string) => isExternal(href)
    ? href
    : href === '/'
      ? base || '/'
      : `${base}${href}`;
</script>

<footer class="glass section" aria-label="Site footer">
  <div class="container">
    <nav aria-label="Footer">
      <ul role="list" class="nav">
        {#each nav as item}
          <li><a href={resolve(item.href)}>{item.label}</a></li>
        {/each}
      </ul>
    </nav>
    <div style="display:flex;gap:1rem;align-items:center;margin:1rem 0;flex-wrap:wrap;">
      {#each partnerList as p}
        <AssetImage entry={p} width={160} height={40} radius={6} />
      {/each}
    </div>
    <ul role="list" class="nav">
      {#each legal as item}
        <li><a href={resolve(item.href)}>{item.label}</a></li>
      {/each}
    </ul>
  </div>
</footer>
