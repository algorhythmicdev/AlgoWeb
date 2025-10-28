<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { autoslug } from '$lib/directives/autoslug';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import StickyControls from '$lib/components/StickyControls.svelte';
  let contentEl: HTMLElement | null = null;
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Terms of Use — Algorhythmics</title>
  <meta name="description" content="Plain-language terms for browsing this site and contacting us." />
</svelte:head>

<main id="main" class="section container rhythm" bind:this={contentEl} use:autoslug>
  <div class="grid" style="grid-template-columns: minmax(0,2fr) minmax(240px,1fr); gap: var(--space-6)">
    <div class="rhythm">
      <h1 class="text-strong">Terms of Use</h1>
      <p>By using this site, you agree to these simple terms.</p>

      <h2 class="text-strong">Use of content</h2>
      <p>Content on this site is provided "as is" for information only. Do not rely on it as legal, medical, or financial advice.</p>

      <h2 class="text-strong">No warranty</h2>
      <p>We try to keep information accurate, but there may be mistakes or changes. Use the site at your own risk.</p>

      <h2 class="text-strong">Contact</h2>
      <p>Questions? Visit <a href={contactHref}>Contact</a>.</p>

      <p>Last updated: 2025</p>
    </div>

    <div class="rhythm-tight">
      <TableOfContents container={contentEl} levels={['h2','h3']} />
      <StickyControls />
    </div>
  </div>
</main>
