<script lang="ts">
  import { base as appBase } from '$app/paths';
  import Halo from './Halo.svelte';
  import { ripple } from '$lib/directives/ripple';
  export let title='Let’s create something awesome';
  export let lead='AI consulting + practical tools: NodeVoyage and Ideonautix.';
  export let ctaHref='/contact', ctaLabel='Talk to us';
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  $: resolved = isExternal(ctaHref)
    ? ctaHref
    : ctaHref === '/'
      ? appBase || '/'
      : `${appBase}${ctaHref}`;
</script>

<section class="section beam-wrap">
  <div class="beam beam--dark" aria-hidden="true"></div>
  <Halo intensity={1.2}>
    <div class="glass scrim">
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
      <p><a class="btn btn-primary" href={resolved} use:ripple>{ctaLabel}</a></p>
    </div>
  </Halo>
</section>
