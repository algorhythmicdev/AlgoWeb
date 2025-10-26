<script lang="ts">
  import { withBase } from '$utils/paths';

  type Link = { href: string; label: string; resolved: string };
  type Partner = { name: string; description?: string };

  const withResolved = (items: { href: string; label: string }[]): Link[] =>
    items.map((item) => ({ ...item, resolved: withBase(item.href) ?? item.href }));

  const nav = withResolved([
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/ideonautix', label: 'Ideonautix' },
    { href: '/nodevoyage', label: 'NodeVoyage' },
    { href: '/consulting', label: 'Consulting' },
    { href: '/contact', label: 'Contact' },
    { href: '/education', label: 'Education' }
  ]);

  const legal = withResolved([
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/cookies', label: 'Cookies' }
  ]);

  const partners: Partner[] = [
    { name: 'LIAA', description: 'Latvian Investment and Development Agency' },
    { name: 'Reclame Fabriek', description: 'Brand storytelling partners' }
  ];
</script>

<footer class="glass" aria-label="Site footer" style="margin-top:2rem;padding:1.25rem">
  <nav aria-label="Footer">
    <ul role="list" class="nav">
      {#each nav as item}<li><a href={item.resolved}>{item.label}</a></li>{/each}
    </ul>
  </nav>
  <div class="partners" aria-label="Partners">
    {#each partners as partner}
      <span class="partner-chip" aria-label={`${partner.name} — ${partner.description ?? 'Partner'}`}>
        <strong>{partner.name}</strong>
        {#if partner.description}<small>{partner.description}</small>{/if}
      </span>
    {/each}
  </div>
  <ul role="list" class="nav">
    {#each legal as item}<li><a href={item.resolved}>{item.label}</a></li>{/each}
  </ul>
</footer>

<style>
  .partners {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin: 1rem 0;
  }

  .partner-chip {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    min-width: 8.5rem;
    padding: 0.5rem 0.85rem;
    border-radius: 0.85rem;
    border: 1px dashed color-mix(in oklab, var(--border) 80%, transparent);
    background: color-mix(in oklab, var(--surface) 88%, transparent);
    color: var(--text-subtle);
    text-align: center;
    line-height: 1.15;
    gap: 0.25rem;
  }

  .partner-chip strong {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }

  .partner-chip small {
    font-size: 0.75rem;
    letter-spacing: 0.01em;
  }
</style>
