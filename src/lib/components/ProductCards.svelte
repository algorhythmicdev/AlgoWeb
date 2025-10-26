<script lang="ts">
  import { base } from '$app/paths';
  import { tilt } from '$lib/directives/tilt';
  import { reveal } from '$lib/directives/reveal';
  import { ripple } from '$lib/directives/ripple';
  const products = [
    { name: 'Ideonautix', href: '/ideonautix', summary: 'Startup education & productivity toolkit.' },
    { name: 'NodeVoyage', href: '/nodevoyage', summary: 'AI-assisted trip planning with Nodi.' }
  ];
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  const resolve = (href: string) => isExternal(href)
    ? href
    : href === '/'
      ? base || '/'
      : `${base}${href}`;
</script>

<section class="section">
  <h2>Products</h2>
  <div class="grid">
    {#each products as p}
      <a class="card glass glossy" href={resolve(p.href)} use:tilt use:reveal use:ripple>
        <h3>{p.name}</h3>
        <p>{p.summary}</p>
      </a>
    {/each}
  </div>
</section>
