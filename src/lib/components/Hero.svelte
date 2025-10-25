<script lang="ts">
  import { withBase } from '$utils/paths';

  export let title = 'Let’s create something awesome';
  export let lead = 'AI consulting + practical tools: NodeVoyage and Ideonautix.';
  export let ctaHref = '/contact';
  export let ctaLabel = 'Talk to us';

  $: resolvedCta = withBase(ctaHref) ?? ctaHref;
</script>

<section class="hero">
  <h1>{title}</h1>
  <p class="lead">{lead}</p>
  <p><a class="btn" href={resolvedCta}>{ctaLabel}</a></p>
</section>

<style>
  .hero { padding: clamp(2rem, 6vw, 6rem) 0; }
  .lead { font-size: 1.125rem; opacity: .9; max-width: 60ch; }
  .btn { display: inline-block; padding: .6rem 1rem; border: 1px solid currentColor; border-radius: .5rem; }
</style>
