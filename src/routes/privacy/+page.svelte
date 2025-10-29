<script lang="ts">
  import { autoslug } from '$lib/directives/autoslug';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  let contentEl: HTMLElement | null = null;
</script>

<svelte:head>
  <title>Privacy Policy — Algorhythmics</title>
  <meta name="description" content="Plain-language privacy policy for this static website." />
</svelte:head>

<main id="main" class="section container rhythm" bind:this={contentEl} use:autoslug>
  <div class="grid" style="grid-template-columns: minmax(0,2fr) minmax(240px,1fr); gap: var(--space-6)">
    <div class="rhythm">
      <h1 class="text-strong">Privacy Policy</h1>
      <p>This is a static website. We do not collect personal data through forms on this site. If you email us, we will see the information you send and use it only to reply.</p>

      <h2 class="text-strong">What we collect</h2>
      <ul>
        <li>Basic technical logs from the hosting platform (GitHub Pages) for reliability and security.</li>
        <li>Emails you voluntarily send to us.</li>
      </ul>

      <h2 class="text-strong">What we do not do</h2>
      <ul>
        <li>No user accounts or trackers here.</li>
        <li>No sale of data.</li>
      </ul>

      <h2 class="text-strong">Your choices</h2>
      <p>To remove or correct information you shared by email, message us and we'll handle it.</p>

      <p>Last updated: 2025</p>
    </div>

    <div class="rhythm-tight">
      <TableOfContents container={contentEl} levels={['h2','h3']} />
    </div>
  </div>
</main>
