<script lang="ts">
  export let items = [
    { q: 'What is Algorhythmics?', a: 'AI consulting + two products: NodeVoyage and Ideonautix.' },
    { q: 'Do you work with schools?', a: 'Yes. We build programs for Latvian schools and universities.' }
  ];
  let open = -1;
</script>

<section class="section">
  <h2>FAQ</h2>
  <div class="glass" style="padding:1rem">
    {#each items as it, idx}
      <button class="btn" aria-expanded={open===idx} on:click={() => open = open===idx ? -1 : idx}>{it.q}</button>
      {#if open===idx}<p style="margin:.5rem 0 1rem">{it.a}</p>{/if}
    {/each}
  </div>
</section>
