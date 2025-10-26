<script lang="ts">
  import { page } from '$app/stores';
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { withBase } from '$utils/paths';
  const head = Head({ title: 'Education', description: 'Practical AI programs for schools and universities.' });
  const programs = ['AI literacy workshops for classrooms','Teacher coaching with ready-to-run lesson kits','Student project labs with community mentors'];
  const outcomes = ['Confident faculty who can run sessions without extra prep','Reusable materials updated each term','Documented results for grant and accreditation reports'];
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor($page.url.pathname)}>
  {@html hreflangLinks($page.url.pathname)}
</svelte:head>

<main id="main">
  <h1>Education</h1>
  <p>We build plain-language AI programs for schools and universities in Latvia.</p>
  <p>Everything is built to run offline-first with optional companion videos and worksheets.</p>

  <section>
    <h2>Programs</h2>
    <ul>{#each programs as item}<li>{item}</li>{/each}</ul>
  </section>

  <section>
    <h2>Outcomes</h2>
    <ul>{#each outcomes as item}<li>{item}</li>{/each}</ul>
  </section>

  <p><a class="btn btn-primary" href={withBase('/contact') ?? '/contact'}>Schedule a workshop</a></p>
</main>
