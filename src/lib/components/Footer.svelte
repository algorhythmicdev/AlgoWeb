<script lang="ts">
  import { base } from '$app/paths';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { partners } from '$lib/assets';

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
    isExternal(href) ? href : href === '/' ? base || '/' : `${base}${href}`;

  const partnerItems = partners();
</script>

<footer class="glass section" aria-label="Site footer">
  <div class="container">
    <nav aria-label="Footer">
      <ul role="list" class="nav">
        {#each nav as i}
          <li><a href={resolve(i.href)}>{i.label}</a></li>
        {/each}
      </ul>
    </nav>

    <div style="display:flex;gap:1rem;align-items:center;margin:1rem 0;">
      {#if partnerItems.length === 0}
        <div class="card" style="padding:.5rem 1rem;border-radius:8px">LIAA</div>
        <div class="card" style="padding:.5rem 1rem;border-radius:8px">Reclame Fabriek</div>
      {:else}
        {#each partnerItems as p}
          <AssetImage base={p.base} alt={p.base.split('/').pop() || 'Partner'} width={160} height={40} radius={6} />
        {/each}
      {/if}
    </div>

    <ul role="list" class="nav">
      {#each legal as i}
        <li><a href={resolve(i.href)}>{i.label}</a></li>
      {/each}
    </ul>
  </div>
</footer>
