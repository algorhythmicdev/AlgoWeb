<script lang="ts">
  import { base } from '$app/paths';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>Education — Algorhythmics</title>
  <meta name="description" content="Short, practical AI programs for Latvian schools and universities." />
</svelte:head>

<main id="main">
  <section class="page container">
  <div class="card">
    <h1>Education</h1>
    <p>Short, practical AI programs for Latvian schools and universities. Clear lessons, safe tools, projects you can run.</p>
    <h2>Program examples</h2>
    <ul>
      <li>AI basics for students: how it works, where it's useful, and what to avoid.</li>
      <li>Product thinking: turn a real problem into a small prototype.</li>
      <li>Data skills: collecting, cleaning, and making sense of information.</li>
    </ul>
    <p>To collaborate, go to <a href={contactHref}>Contact</a>.</p>
  </div>
</section>
</main>
