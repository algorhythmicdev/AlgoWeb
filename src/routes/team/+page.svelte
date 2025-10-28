<script lang="ts">
  import { base as appBase } from '$app/paths';
  const contactHref = `${appBase}/contact`;
</script>

<svelte:head>
  <title>Team — Algorhythmics</title>
  <meta name="description" content="Based in Daugavpils, Latvia. We build accessible AI tools and give hands-on guidance." />
</svelte:head>

<main id="main" class="prose section">
  <h1 class="text-strong">Team</h1>
  <p><strong>Based in Daugavpils, Latvia.</strong> We build accessible AI tools and explain how to use them in plain language.</p>

  <h2 class="text-strong">Mission</h2>
  <p>Make AI clear, useful, and safe for everyday work. We focus on simple flows, strong UX, and measurable outcomes.</p>

  <h2 class="text-strong">Background</h2>
  <ul>
    <li><strong>Engineering + design:</strong> practical automation and product prototyping.</li>
    <li><strong>Real-world craft:</strong> founder’s earlier career includes Michelin-level kitchens, which shaped our obsession with clear process and quality.</li>
    <li><strong>R&D work:</strong> ongoing engineering experience in signage R&D at Reclame Fabriek (reference only).</li>
  </ul>

  <h2 class="text-strong">How we work</h2>
  <ol>
    <li><strong>Listen:</strong> what you want, what you have, what’s realistic.</li>
    <li><strong>Prototype:</strong> small, fast, safe to test.</li>
    <li><strong>Improve:</strong> ship a useful version, then refine with data.</li>
  </ol>

  <p>Need details? Go to <a href={contactHref}>Contact</a>.</p>
</main>
