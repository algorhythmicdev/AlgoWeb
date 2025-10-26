<script lang="ts">
  import { base } from '$app/paths';
  import { Head } from '$lib/seo';
  const head = Head({ title:'Consulting', description:'Practical automation, data workflows, training.' });
  const services=['Automation & workflow design','Data integration and reporting','Team training and playbooks'];
  const process=['Kickoff & scope','Prototype in days','Iterate with feedback','Handover & training'];
  let pilotSpots=3;
  const contactHref = `${base}/contact`;
</script>
<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose section">
  <h1>Consulting</h1><p>We keep it practical and fast. Clear outcomes, shipped quickly.</p>
  <h2>Services</h2><ul>{#each services as s}<li>{s}</li>{/each}</ul>
  <h2>Process</h2><ol>{#each process as p}<li>{p}</li>{/each}</ol>
  <aside class="glass" style="padding:1rem;border-radius:12px">
    <strong>Pilot applications open.</strong><p>Spots left: {pilotSpots}</p><p><a class="btn btn-primary" href={contactHref}>Apply for a pilot</a></p>
  </aside>
</main>
