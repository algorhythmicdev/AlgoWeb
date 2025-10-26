<script lang="ts">
  import { Head } from '$lib/seo';
  const head = Head({ title:'Cookies', description:'Cookie usage policy for the AlgoWeb static site.' });
  const details = [
    'Essential cookies: none. The site runs entirely static on GitHub Pages.',
    'Analytics: we may add privacy-friendly analytics with no tracking cookies.',
    'Third-party embeds: none at launch. External tools open in new tabs.'
  ];
</script>
<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose section">
  <h1>Cookies</h1>
  <p>We currently do not set cookies. If this changes, we will update this page and announce it in the footer.</p>
  <h2>Details</h2><ul>{#each details as item}<li>{item}</li>{/each}</ul>
  <p>Questions? Email <a href="mailto:privacy@algoweb.studio">privacy@algoweb.studio</a>.</p>
</main>
