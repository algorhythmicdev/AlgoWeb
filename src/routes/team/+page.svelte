<script lang="ts">
  import { Head } from '$lib/seo';
  import { withBase } from '$utils/paths';
  const head = Head({ title: 'Team', description: 'Latvia-based team focused on practical AI.' });
  const strengths = ['Product strategy + facilitation','Applied AI prototyping','Curriculum design for schools & incubators'];
  const ways = ['Co-create with founders and educators','Document every experiment for reuse','Ship in static-friendly stacks'];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>Team</h1>
  <p><strong>Based in Daugavpils, Latvia.</strong> We design accessible AI tools and hands-on programs.</p>
  <p>We combine product, engineering, and education backgrounds to help partners move from ideas to working pilots.</p>

  <section>
    <h2>Strengths</h2>
    <ul>{#each strengths as item}<li>{item}</li>{/each}</ul>
  </section>

  <section>
    <h2>How we work</h2>
    <ul>{#each ways as item}<li>{item}</li>{/each}</ul>
  </section>

  <p><a class="btn btn-primary" href={withBase('/contact') ?? '/contact'}>Connect with the team</a></p>
</main>
