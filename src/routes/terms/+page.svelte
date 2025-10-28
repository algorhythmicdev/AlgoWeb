<script lang="ts">
  import { base as appBase } from '$app/paths';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Terms of Use — Algorhythmics</title>
  <meta name="description" content="Plain-language terms for browsing this site and contacting us." />
</svelte:head>

<main id="main" class="prose section">
  <h1 class="text-strong">Terms of Use</h1>
  <p>By using this site, you agree to these simple terms.</p>

  <h2 class="text-strong">Use of content</h2>
  <p>Content on this site is provided “as is” for information only. Do not rely on it as legal, medical, or financial advice.</p>

  <h2 class="text-strong">No warranty</h2>
  <p>We try to keep information accurate, but there may be mistakes or changes. Use the site at your own risk.</p>

  <h2 class="text-strong">Contact</h2>
  <p>Questions? Visit <a href={contactHref}>Contact</a>.</p>

  <p>Last updated: 2025</p>
</main>
