<script lang="ts">
  import { withBase } from '$utils/paths';

  const products = [
    { name: 'Ideonautix', href: '/ideonautix', summary: 'Startup education & productivity toolkit.' },
    { name: 'NodeVoyage', href: '/nodevoyage', summary: 'AI-assisted trip planning with Nodi.' }
  ].map((p) => ({ ...p, resolved: withBase(p.href) ?? p.href }));
</script>

<section aria-label="Products" class="grid">
  {#each products as p}
    <a class="card glass product" href={p.resolved}>
      <h3>{p.name}</h3>
      <p>{p.summary}</p>
    </a>
  {/each}
</section>

<style>
  .product { transform-style: preserve-3d; will-change: transform; }
  .product:hover { transform: translateY(-3px) perspective(800px) rotateX(1.2deg); }
</style>
