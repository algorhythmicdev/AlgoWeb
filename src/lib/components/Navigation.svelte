<script lang="ts">
  import { page } from '$app/stores';
  import { withBase, stripBase } from '$utils/paths';
  const items = [
    { href: '/',            label: 'Home' },
    { href: '/team',        label: 'Team' },
    { href: '/ideonautix',  label: 'Ideonautix' },
    { href: '/nodevoyage',  label: 'NodeVoyage' },
    { href: '/consulting',  label: 'Consulting' },
    { href: '/contact',     label: 'Contact' },
    { href: '/education',   label: 'Education' }
  ];
  const nav = items.map((item) => ({ ...item, resolved: withBase(item.href) ?? item.href }));
  $: current = stripBase($page.url.pathname).replace(/\/+$/, '') || '/';
</script>

<header class="header">
  <nav aria-label="Primary">
    <ul role="list" class="nav">
      {#each nav as item}
        <li>
          <a href={item.resolved} aria-current={current === item.href ? 'page' : undefined}>
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>
