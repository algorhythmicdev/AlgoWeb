<script lang="ts">
  export let items = [
    { date: '2024–2025', text: 'Built and aligned the Algorhythmics core vision.' },
    { date: '2025 Q3–Q4', text: 'Public website + early product previews.' }
  ];
</script>

<section aria-label="Timeline">
  <h2 class="visually-hidden">Timeline</h2>
  <ol class="timeline">
    {#each items as i}
      <li><strong>{i.date}</strong> — {i.text}</li>
    {/each}
  </ol>
</section>

<style>
  .timeline { list-style: none; padding: 0; display: grid; gap: .5rem; }
</style>
