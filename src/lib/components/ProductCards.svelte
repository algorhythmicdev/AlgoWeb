<script lang="ts">
  import { withBase } from '$utils/paths';

  const products = [
    { name: 'Ideonautix', href: '/ideonautix', summary: 'Startup education & productivity toolkit.' },
    { name: 'NodeVoyage', href: '/nodevoyage', summary: 'AI-assisted trip planning with Nodi.' }
  ].map((p) => ({ ...p, resolved: withBase(p.href) ?? p.href }));
</script>

<section aria-label="Products" class="grid">
  <h2 class="sr-only">Products</h2>
  {#each products as p}
    <a class="card" href={p.resolved}>
      <h3>{p.name}</h3>
      <p>{p.summary}</p>
    </a>
  {/each}
</section>

<style>
  .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); }
  .card { border: 1px solid currentColor; padding: 1rem; border-radius: .5rem; min-height: 8rem; }
  .card:hover { transform: translateY(-1px); }
</style>
