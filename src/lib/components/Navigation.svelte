<script lang="ts">
  import { page } from '$app/stores';
  import { _ } from '$lib/i18n';

  const items = [
    { href: '/', key: 'home', fallback: 'Home' },
    { href: '/about', key: 'team', fallback: 'Team' },
    { href: '/ideonautix', key: 'ideonautix', fallback: 'Ideonautix' },
    { href: '/nodevoyage', key: 'nodevoyage', fallback: 'NodeVoyage' },
    { href: '/consulting', key: 'consulting', fallback: 'Consulting' },
    { href: '/education', key: 'education', fallback: 'Education' },
    { href: '/contact', key: 'contact', fallback: 'Contact' }
  ] as const;

  $: current = $page.url.pathname.replace(/\/+$/, '') || '/';
</script>

<nav aria-label={$_('nav.primary_label') || 'Primary navigation'}>
  <ul role="list" class="nav">
    {#each items as item}
      <li>
        <a href={item.href} aria-current={current === item.href ? 'page' : undefined}>
          {$_(`nav.${item.key}`) || item.fallback}
        </a>
      </li>
    {/each}
  </ul>
</nav>
