<script lang="ts">
  import { base } from '$app/paths';
  const nav = [
    { href: '/', label: 'Home' },{ href: '/team', label: 'Team' },
    { href: '/ideonautix', label: 'Ideonautix' },{ href: '/nodevoyage', label: 'NodeVoyage' },
    { href: '/consulting', label: 'Consulting' },{ href: '/contact', label: 'Contact' },
    { href: '/education', label: 'Education' }
  ];
  const legal = [{href:'/privacy',label:'Privacy'},{href:'/terms',label:'Terms'},{href:'/cookies',label:'Cookies'}];
  const partners = ['LIAA','Reclame Fabriek'];
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  const resolve = (href: string) => isExternal(href)
    ? href
    : href === '/'
      ? base || '/'
      : `${base}${href}`;
</script>

<footer class="glass section" aria-label="Site footer">
  <div class="container">
    <nav aria-label="Footer"><ul role="list" class="nav">{#each nav as i}<li><a href={resolve(i.href)}>{i.label}</a></li>{/each}</ul></nav>
    <div class="partner-list" role="list" aria-label="Partners">
      {#each partners as name}<span role="listitem" class="chip">{name}</span>{/each}
    </div>
    <ul role="list" class="nav">{#each legal as i}<li><a href={resolve(i.href)}>{i.label}</a></li>{/each}</ul>
  </div>
</footer>
