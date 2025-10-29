<script lang="ts">
  import { base } from '$app/paths';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Consulting — Algorhythmics</title>
  <meta name="description" content="We make useful things that save time." />
</svelte:head>

<main id="main">
  <section class="page container grid cols-2">
  <div class="card">
    <h1>Consulting</h1>
    <p>We make useful things that save time. We set up small, safe prototypes, then grow them with your team.</p>
    <h2>Services</h2>
    <ul>
      <li><strong>Automation</strong>: connect tools, cut manual steps, reduce errors.</li>
      <li><strong>Data & reporting</strong>: simple dashboards and alerts people actually use.</li>
      <li><strong>Training</strong>: short sessions and playbooks; your team keeps the gains.</li>
    </ul>
    <h2>Process</h2>
    <ol>
      <li><strong>Kickoff</strong>: what to improve and what you already have.</li>
      <li><strong>Prototype</strong>: a working version in days.</li>
      <li><strong>Refine</strong>: adjust with feedback and basic metrics.</li>
      <li><strong>Handover</strong>: docs and a simple plan to maintain.</li>
    </ol>
  </div>

  <div class="card frost">
    <h3>Pilot applications</h3>
    <p>We open a small number of pilots each month.</p>
    <a class="btn btn-primary" href={contactHref}>Apply for a pilot</a>
  </div>
</section>
</main>
