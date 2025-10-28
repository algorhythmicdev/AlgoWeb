<script lang="ts">
  import { page } from '$app/stores';
  import { base as appBase } from '$app/paths';
  export let title = 'Algorhythmics';
  export let description = 'Practical AI, products, and education — built in Latvia.';
  $: url = $page.url?.href || '';
  $: canonical = url;
  const org = {
    '@context':'https://schema.org',
    '@type':'Organization',
    name:'Algorhythmics',
    url: canonical,
    sameAs: []
  };
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">{JSON.stringify(org)}</script>
</svelte:head>
