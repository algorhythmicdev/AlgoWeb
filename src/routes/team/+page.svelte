<script lang="ts">
  import { Head } from '$lib/seo';
  import { withBase } from '$utils/paths';
  const head = Head({ title: 'Team', description: 'Latvia-based team focused on practical AI.' });
</script>
<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>Team</h1>
  <p><strong>Based in Daugavpils, Latvia.</strong> We design accessible AI tools and hands-on programs.</p>

  <section>
    <h2>Mission</h2>
    <p>Simple tools, clear guidance, and real outcomes for people, schools, and startups.</p>
  </section>

  <section>
    <h2>Partners & Background</h2>
    <ul>
      <li>LIAA (Latvian Investment and Development Agency)</li>
      <li>Reclame Fabriek (current workplace reference)</li>
    </ul>
  </section>

  <section>
    <h2>Contact</h2>
    <p>Reach the team on the <a href={withBase('/contact') ?? '/contact'}>Contact</a> page.</p>
  </section>
</main>
