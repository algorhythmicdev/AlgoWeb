<script lang="ts">
  import { withBase } from '$utils/paths';

  type Link = { href: string; label: string; resolved: string };
  type PartnerLogo = { src: string; alt: string; pending?: boolean };

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

  const partners: PartnerLogo[] = [
    { src: '/images/partners/liaa.png', alt: 'LIAA', pending: true },
    { src: '/images/partners/reclamefabriek.png', alt: 'Reclame Fabriek', pending: true }
  ];

  const partnerSrc = (path: string) => withBase(path) ?? path;

  let missingPartners = new Set<string>();

  const markMissing = (path: string | null | undefined) => {
    if (!path || missingPartners.has(path)) return;
    const next = new Set(missingPartners);
    next.add(path);
    missingPartners = next;
  };
</script>

<footer class="glass" aria-label="Site footer" style="margin-top:2rem;padding:1.25rem">
  <nav aria-label="Footer">
    <ul role="list" class="nav">
      {#each nav as item}<li><a href={item.resolved}>{item.label}</a></li>{/each}
    </ul>
  </nav>
  <div class="partners" aria-label="Partners">
    {#each partners as partner}
      {#if partner.pending || missingPartners.has(partner.src)}
        <span class="partner-fallback" role="img" aria-label={partner.alt}>{partner.alt}</span>
      {:else}
        <img
          src={partnerSrc(partner.src)}
          alt={partner.alt}
          loading="lazy"
          height="28"
          on:error={() => markMissing(partner.src)}
        />
      {/if}
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

  .partner-fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.75rem;
    border: 1px dashed var(--border);
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--text-subtle);
    background: color-mix(in oklab, var(--surface) 88%, transparent);
    text-transform: uppercase;
  }
</style>
