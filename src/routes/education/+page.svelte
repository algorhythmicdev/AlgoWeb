<script lang="ts">
  import { base as appBase } from '$app/paths';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Education — Programs for schools and universities</title>
  <meta name="description" content="Plain-language AI programs for Latvia. Built for real outcomes." />
</svelte:head>

<main id="main" class="prose section">
  <h1 class="text-strong">Education</h1>
  <p>We design short, practical AI programs for schools and universities in Latvia. Clear lessons, safe tools, and simple projects you can actually run.</p>

  <h2 class="text-strong">Program examples</h2>
  <ul>
    <li><strong>AI basics for students:</strong> how it works, where it’s useful, and what to avoid.</li>
    <li><strong>Product thinking:</strong> turn a real problem into a small prototype.</li>
    <li><strong>Data skills:</strong> collecting, cleaning, and making sense of information.</li>
  </ul>

  <p>This page will grow as programs roll out. For collaboration, go to <a href={contactHref}>Contact</a>.</p>
</main>
