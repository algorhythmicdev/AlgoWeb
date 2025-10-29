<script lang="ts">
  import { base as appBase } from '$app/paths';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Consulting — Algorhythmics</title>
  <meta name="description" content="Automation, data workflows, and training delivered with clear outcomes." />
</svelte:head>

<main id="main">
  <section class="section">
    <div class="container stack">
      <h1 class="text-strong">Consulting</h1>
      <p class="text-secondary">We make useful things that save time. We set up small, safe prototypes, then grow them with your team.</p>

      <div class="grid-3">
        <div class="card">
          <h3 class="text-strong">Services</h3>
          <ul class="stack">
            <li><strong>Automation:</strong> connect tools, cut manual steps, reduce errors.</li>
            <li><strong>Data &amp; reporting:</strong> small dashboards and alerts people actually use.</li>
            <li><strong>Training:</strong> short sessions and playbooks; your team keeps the gains.</li>
          </ul>
        </div>

        <div class="card">
          <h3 class="text-strong">Process</h3>
          <ol class="stack">
            <li><strong>Kickoff:</strong> what to improve and what you already have.</li>
            <li><strong>Prototype:</strong> a first working version in days.</li>
            <li><strong>Refine:</strong> adjust with feedback and basic metrics.</li>
            <li><strong>Handover:</strong> docs, training, and a simple plan to maintain.</li>
          </ol>
        </div>

        <div class="card">
          <h3 class="text-strong">Outcomes</h3>
          <ul class="stack">
            <li>Fewer manual steps and fewer errors.</li>
            <li>Faster reporting and decisions.</li>
            <li>Clear ownership and easy maintenance.</li>
          </ul>
        </div>
      </div>

      <div class="card" style="margin-top:var(--space-8);">
        <h3 class="text-strong" style="margin:0 0 .5rem">Pilot applications open.</h3>
        <p class="text-secondary" style="margin:0 0 1rem">We take a small number of pilots each month.</p>
        <a class="btn btn-primary" href={contactHref}>Apply for a pilot</a>
      </div>
    </div>
  </section>
</main>
