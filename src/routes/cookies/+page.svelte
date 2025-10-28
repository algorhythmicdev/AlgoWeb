<script lang="ts">
  import { autoslug } from '$lib/directives/autoslug';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import StickyControls from '$lib/components/StickyControls.svelte';
  let contentEl: HTMLElement | null = null;
</script>

<svelte:head>
  <title>Cookies — Algorhythmics</title>
  <meta name="description" content="Cookie information for this static website." />
</svelte:head>

<main id="main" class="section container rhythm" bind:this={contentEl} use:autoslug>
  <div class="grid" style="grid-template-columns: minmax(0,2fr) minmax(240px,1fr); gap: var(--space-6)">
    <div class="rhythm">
      <h1 class="text-strong">Cookies</h1>
      <p>This static site does not set tracking cookies. The hosting platform (GitHub Pages) may use necessary technical cookies to deliver the site.</p>
      <p>For more details about hosting behavior, see GitHub's documentation.</p>
      <p>Last updated: 2025</p>
    </div>

    <div class="rhythm-tight">
      <TableOfContents container={contentEl} levels={['h2','h3']} />
      <StickyControls />
    </div>
  </div>
</main>
