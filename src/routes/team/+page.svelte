<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { Head } from '$lib/seo';
  const head=Head({title:'Team',description:'Latvia-based team focused on practical AI.'});
  const contactHref = `${appBase}/contact`;
</script>
<svelte:head>{@html head}</svelte:head>
<main id="main" class="prose section">
  <h1>Team</h1>
  <p><strong>Based in Daugavpils, Latvia.</strong> We design accessible AI tools and hands-on programs.</p>
  <h2>Mission</h2><p>Simple tools, clear guidance, and real outcomes for people, schools, and startups.</p>
  <h2>Partners & Background</h2>
  <ul><li>LIAA (Latvian Investment and Development Agency)</li><li>Reclame Fabriek (current workplace reference)</li></ul>
  <h2>Contact</h2><p>Reach the team on the <a href={contactHref}>Contact</a> page.</p>
</main>
