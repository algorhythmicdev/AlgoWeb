<script lang="ts">
  import { page } from '$app/stores';
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { withBase } from '$utils/paths';
  const head = Head({ title: 'Consulting', description: 'Practical automation, data workflows, and training.' });
  const services = ['Automation & workflow design','Data integration and reporting','Team training and playbooks'];
  const process = ['Kickoff & scope in a single working session','Prototype together in days, not months','Review with stakeholders and document next steps'];
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor($page.url.pathname)}>
  {@html hreflangLinks($page.url.pathname)}
</svelte:head>

<main id="main">
  <h1>Consulting</h1>
  <p>We partner with teams who need clear outcomes quickly. Every engagement ships tangible assets.</p>
  <p>Our focus is on simple automation, reliable data visibility, and internal training that sticks.</p>

  <section>
    <h2>Services</h2>
    <ul>{#each services as item}<li>{item}</li>{/each}</ul>
  </section>

  <section>
    <h2>Process</h2>
    <ul>{#each process as step}<li>{step}</li>{/each}</ul>
  </section>

  <p><a class="btn btn-primary" href={withBase('/contact') ?? '/contact'}>Start a project</a></p>
</main>
