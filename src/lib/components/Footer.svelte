<script lang="ts">
  import { withBase } from '$utils/paths';
  import { _ } from '$lib/i18n';

  type LinkItem = {
    href: string;
    key: string;
    fallback: string;
  };

  const navItems: LinkItem[] = [
    { href: '/', key: 'nav.home', fallback: 'Home' },
    { href: '/team', key: 'nav.team', fallback: 'Team' },
    { href: '/ideonautix', key: 'nav.ideonautix', fallback: 'Ideonautix' },
    { href: '/nodevoyage', key: 'nav.nodevoyage', fallback: 'NodeVoyage' },
    { href: '/consulting', key: 'nav.consulting', fallback: 'Consulting' },
    { href: '/contact', key: 'nav.contact', fallback: 'Contact' },
    { href: '/education', key: 'nav.education', fallback: 'Education' }
  ];

  const legalItems: LinkItem[] = [
    { href: '/privacy', key: 'legal.privacy', fallback: 'Privacy' },
    { href: '/terms', key: 'legal.terms', fallback: 'Terms' },
    { href: '/cookies', key: 'legal.cookies', fallback: 'Cookies' }
  ];

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

  $: translate = $_;

  function translateOrFallback(key: string, fallback: string): string {
    if (translate) {
      const value = translate(key);
      if (value && value !== key) {
        return value;
      }
    }

    return fallback;
  }

  function translateLabel(item: LinkItem): string {
    return translateOrFallback(item.key, item.fallback);
  }

  const nav = navItems.map((item) => ({
    ...item,
    resolved: withBase(item.href) ?? item.href
  }));

  const legal = legalItems.map((item) => ({
    ...item,
    resolved: withBase(item.href) ?? item.href
  }));

  $: navLabel = translateOrFallback('footer.nav_label', 'Site navigation');
  $: partnersLabel = translateOrFallback('footer.partners_label', 'Partners');
  $: legalLabel = translateOrFallback('footer.legal_label', 'Legal');
</script>

<footer aria-label="Site footer">
  <nav aria-label={navLabel}>
    <ul role="list" class="nav">
      {#each nav as item}
        <li><a href={item.resolved}>{translateLabel(item)}</a></li>
      {/each}
    </ul>
  </nav>

  <ul role="list" class="partners" aria-label={partnersLabel}>
    {#each partners as p}
      <li>
        <span class="partner-chip" aria-label={`${p.name} — ${p.description}`}>
          <span aria-hidden="true">{p.name}</span>
        </span>
      </li>
    {/each}
  </ul>

  <ul role="list" class="legal" aria-label={legalLabel}>
    {#each legal as item}
      <li><a href={item.resolved}>{translateLabel(item)}</a></li>
    {/each}
  </ul>
</footer>

<style>
  footer { padding: 2rem 0; border-top: 1px solid currentColor; opacity: .9 }
  .nav, .legal { display: flex; flex-wrap: wrap; gap: 1rem; }
  .partners { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; margin: 1rem 0; padding: 0; }
  .partner-chip { display: inline-flex; align-items: center; justify-content: center; padding: .5rem 1rem; border: 1px solid currentColor; border-radius: 999px; font-size: .875rem; letter-spacing: .02em; }
</style>
