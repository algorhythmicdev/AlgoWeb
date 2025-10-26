<script lang="ts">
  import { base } from '$app/paths';
  import Halo from './Halo.svelte';
  export let title='Let’s create something awesome';
  export let lead='AI consulting + practical tools: NodeVoyage and Ideonautix.';
  export let ctaHref='/contact', ctaLabel='Talk to us';
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  $: resolved = isExternal(ctaHref)
    ? ctaHref
    : ctaHref === '/'
      ? base || '/'
      : `${base}${ctaHref}`;
</script>

<section class="section">
  <Halo intensity={1.2}>
    <div class="glass" style="padding:clamp(1rem,3vw,2rem);position:relative">
      <div style="position:absolute;inset:-10% -10% -30% -10%;background:var(--hero-gradient);opacity:.18;filter:blur(80px);z-index:-2"></div>
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
      <p><a class="btn btn-primary" href={resolved}>{ctaLabel}</a></p>
    </div>
  </Halo>
</section>
