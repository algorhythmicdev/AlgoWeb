<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { autoslug } from '$lib/directives/autoslug';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import StickyControls from '$lib/components/StickyControls.svelte';
  import Card from '$lib/components/Card.svelte';
  let contentEl: HTMLElement | null = null;
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Team — Algorhythmics</title>
  <meta name="description" content="Based in Daugavpils, Latvia. We build accessible AI tools and give hands-on guidance." />
</svelte:head>

<main id="main" class="section container rhythm" bind:this={contentEl} use:autoslug>
  <div class="grid" style="grid-template-columns: minmax(0,2fr) minmax(240px,1fr); gap: var(--space-6)">
    <div class="rhythm">
      <h1 class="text-strong">Team</h1>
      <p><strong>Based in Daugavpils, Latvia.</strong> We build accessible AI tools and explain how to use them in plain language.</p>

      <Card heading="Our mission">
        <p>Make AI clear, useful, and safe for everyday work. We focus on simple flows, strong UX, and measurable outcomes.</p>
      </Card>

      <Card heading="Partners & background">
        <ul>
          <li><strong>LIAA (Latvian Investment and Development Agency):</strong> supporting education and innovation programmes.</li>
          <li><strong>Reclame Fabriek:</strong> current workplace reference for signage R&D experience.</li>
          <li><strong>Engineering + design:</strong> practical automation and product prototyping.</li>
          <li><strong>Real-world craft:</strong> founder's earlier career includes Michelin-level kitchens, which shaped our obsession with clear process and quality.</li>
        </ul>
      </Card>

      <h2 class="text-strong">How we work</h2>
      <ol>
        <li><strong>Listen:</strong> what you want, what you have, what's realistic.</li>
        <li><strong>Prototype:</strong> small, fast, safe to test.</li>
        <li><strong>Improve:</strong> ship a useful version, then refine with data.</li>
      </ol>

      <p>Need details? Go to <a href={contactHref}>Contact</a>.</p>
    </div>

    <div class="rhythm-tight">
      <TableOfContents container={contentEl} levels={['h2','h3']} />
      <StickyControls />
    </div>
  </div>
</main>
