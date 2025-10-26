<script lang="ts">
  import { page } from '$app/stores';
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  const head = Head({ title: 'Terms', description: 'Plain-language terms for using our site and tools.' });
  const commitments = [
    'Use our resources for lawful purposes and credit when resharing.',
    'Respect partner logos and trademarks featured on this site.',
    'Contact us before integrating our prototypes into commercial products.'
  ];
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor($page.url.pathname)}>
  {@html hreflangLinks($page.url.pathname)}
</svelte:head>

<main id="main">
  <h1>Terms</h1>
  <p>By visiting this site you agree to follow the simple guidelines below. We keep things human and collaborative.</p>

  <section>
    <h2>Commitments</h2>
    <ul>{#each commitments as item}<li>{item}</li>{/each}</ul>
  </section>

  <p>Need a signed agreement? Email <a href="mailto:legal@algoweb.studio">legal@algoweb.studio</a>.</p>
</main>
