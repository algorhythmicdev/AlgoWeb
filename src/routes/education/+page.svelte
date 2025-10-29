<script lang="ts">
  import { base as appBase } from '$app/paths';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Education — Algorhythmics</title>
  <meta name="description" content="Practical AI education programs for Latvia. Clear lessons, safe tools, simple projects." />
</svelte:head>

<main id="main">
  <section class="section">
    <div class="container stack">
      <h1 class="text-strong">Education</h1>
      <p class="text-secondary">We design short, practical AI programs for schools and universities in Latvia. Clear lessons, safe tools, and simple projects you can actually run.</p>

      <h2 class="text-strong">Program examples</h2>
      <ul class="stack">
        <li><strong>AI basics for students:</strong> how it works, where it’s useful, what to avoid.</li>
        <li><strong>Product thinking:</strong> turn a real problem into a small prototype.</li>
        <li><strong>Data skills:</strong> collecting, cleaning, and making sense of information.</li>
      </ul>
      <p class="text-secondary">This page will grow as programs roll out. For collaboration, go to <a href={contactHref}>Contact</a>.</p>
    </div>
  </section>
</main>
