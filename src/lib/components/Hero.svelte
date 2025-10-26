<script lang="ts">
  import Halo from './Halo.svelte';
  import { withBase } from '$utils/paths';
  export let title = 'Let’s create something awesome';
  export let lead = 'AI consulting + practical tools: NodeVoyage and Ideonautix.';
  export let ctaHref = '/contact';
  export let ctaLabel = 'Talk to us';
  $: resolvedHref = withBase(ctaHref) ?? ctaHref;
</script>

<section class="hero">
  <Halo intensity={1.2}>
    <div class="hero-inner glass">
      <h1 class="title">{title}</h1>
      <p class="lead">{lead}</p>
      <p><a class="btn btn-primary" href={resolvedHref}>{ctaLabel}</a></p>
    </div>
  </Halo>
</section>

<style>
  .hero { padding: clamp(2rem, 6vw, 6rem) 0; position: relative; }
  .hero::after {
    content: ""; position: absolute; inset: -10% -10% -30% -10%;
    background: var(--hero-gradient);
    opacity: .18; filter: blur(80px);
    z-index: -2;
  }
  .hero-inner { padding: clamp(1.25rem, 2vw, 2rem); }
  .title { font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.1; margin: 0 0 .5rem; }
</style>
