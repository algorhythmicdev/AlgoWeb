<script lang="ts">
  import { page } from '$app/stores';
  import { withBase, stripBase } from '$utils/paths';
  import { _ } from '$lib/i18n';

  type NavItem = {
    href: string;
    key: string;
    fallback: string;
  };

  const items: NavItem[] = [
    { href: '/', key: 'nav.home', fallback: 'Home' },
    { href: '/team', key: 'nav.team', fallback: 'Team' },
    { href: '/ideonautix', key: 'nav.ideonautix', fallback: 'Ideonautix' },
    { href: '/nodevoyage', key: 'nav.nodevoyage', fallback: 'NodeVoyage' },
    { href: '/consulting', key: 'nav.consulting', fallback: 'Consulting' },
    { href: '/contact', key: 'nav.contact', fallback: 'Contact' },
    { href: '/education', key: 'nav.education', fallback: 'Education' }
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

  function resolveLabel(item: NavItem): string {
    return translateOrFallback(item.key, item.fallback);
  }

  const nav = items.map((item) => ({
    ...item,
    resolved: withBase(item.href) ?? item.href
  }));

  $: current = (stripBase($page.url.pathname) || '/').replace(/\/+$/, '') || '/';
  $: label = translateOrFallback('nav.primary_label', 'Primary navigation');
</script>

<nav aria-label={label}>
  <ul role="list" class="nav">
    {#each nav as item}
      <li>
        <a href={item.resolved} aria-current={current === item.href ? 'page' : undefined}>
          {resolveLabel(item)}
        </a>
      </li>
    {/each}
  </ul>
</nav>
