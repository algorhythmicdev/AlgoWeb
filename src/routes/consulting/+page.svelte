<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { autoslug } from '$lib/directives/autoslug';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import StickyControls from '$lib/components/StickyControls.svelte';
  let contentEl: HTMLElement | null = null;
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Consulting — Practical AI for teams</title>
  <meta name="description" content="Automation, data flows, training, and quick prototypes. Clear outcomes in plain language." />
</svelte:head>

<main id="main" class="section container rhythm" bind:this={contentEl} use:autoslug>
  <div class="grid" style="grid-template-columns: minmax(0,2fr) minmax(240px,1fr); gap: var(--space-6)">
    <div class="rhythm">
      <h1 class="text-strong">Consulting</h1>
      <p>We make useful things that save time. We set up small, safe prototypes, then grow them with your team.</p>

      <h2 class="text-strong">Services</h2>
      <ul>
        <li><strong>Automation:</strong> connect tools, cut manual steps, reduce errors.</li>
        <li><strong>Data & reporting:</strong> simple dashboards and alerts that people actually use.</li>
        <li><strong>Training:</strong> short sessions and playbooks; your team keeps the gains.</li>
      </ul>

      <h2 class="text-strong">Process</h2>
      <ol>
        <li><strong>Kickoff:</strong> what to improve and what you already have.</li>
        <li><strong>Prototype:</strong> a first working version in days.</li>
        <li><strong>Refine:</strong> adjust with feedback and basic metrics.</li>
        <li><strong>Handover:</strong> docs, training, and a simple plan to maintain.</li>
      </ol>

      <h2 class="text-strong">Outcomes</h2>
      <ul>
        <li>Fewer manual steps and fewer errors.</li>
        <li>Faster reporting and decisions.</li>
        <li>Clear ownership and easy maintenance.</li>
      </ul>

      <aside class="card surface-2 control" style="padding:1rem;border-radius:12px">
        <strong>Pilot applications open.</strong>
        <p>We take a small number of pilots every month. If you want in, reach out.</p>
        <p><a class="btn btn-primary" href={contactHref}>Apply for a pilot</a></p>
      </aside>
    </div>

    <div class="rhythm-tight">
      <TableOfContents container={contentEl} levels={['h2','h3']} />
      <StickyControls />
    </div>
  </div>
</main>
