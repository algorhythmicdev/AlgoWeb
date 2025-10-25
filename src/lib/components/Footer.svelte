<script lang="ts">
  import { withBase } from '$utils/paths';

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/ideonautix', label: 'Ideonautix' },
    { href: '/nodevoyage', label: 'NodeVoyage' },
    { href: '/consulting', label: 'Consulting' },
    { href: '/contact', label: 'Contact' },
    { href: '/education', label: 'Education' }
  ].map((i) => ({ ...i, resolved: withBase(i.href) ?? i.href }));

  const legal = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms',   label: 'Terms' },
    { href: '/cookies', label: 'Cookies' }
  ].map((i) => ({ ...i, resolved: withBase(i.href) ?? i.href }));

  const partners = [
    {
      name: 'LIAA',
      description: 'Latvian Investment and Development Agency'
    },
    {
      name: 'Reclame Fabriek',
      description: 'Creative partner reference'
    }
  ];
</script>

<footer aria-label="Site footer">
  <nav aria-label="Footer">
    <ul role="list" class="nav">
      {#each nav as i}<li><a href={i.resolved}>{i.label}</a></li>{/each}
    </ul>
  </nav>

  <ul role="list" class="partners" aria-label="Partners">
    {#each partners as p}
      <li>
        <span class="partner-chip" aria-label={`${p.name} — ${p.description}`}>
          <span aria-hidden="true">{p.name}</span>
        </span>
      </li>
    {/each}
  </ul>

  <ul role="list" class="legal">
    {#each legal as i}<li><a href={i.resolved}>{i.label}</a></li>{/each}
  </ul>
</footer>

<style>
  footer { padding: 2rem 0; border-top: 1px solid currentColor; opacity: .9 }
  .nav, .legal { display: flex; flex-wrap: wrap; gap: 1rem; }
  .partners { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; margin: 1rem 0; padding: 0; }
  .partner-chip { display: inline-flex; align-items: center; justify-content: center; padding: .5rem 1rem; border: 1px solid currentColor; border-radius: 999px; font-size: .875rem; letter-spacing: .02em; }
</style>
