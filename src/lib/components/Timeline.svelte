<script lang="ts">
  export let items=[
    {date:'2025-10-13',text:'First public commits for the Algorhythmics site.'},
    {date:'2025-10-25',text:'Replaced preview assets with text-first placeholders ahead of design pass.'},
    {date:'2025-10-26',text:'Locked static build setup and marketing asset stubs for Pages deploy.'}
  ];
</script>
<section class="section">
  <h2>Timeline</h2>
  <ol style="list-style:none;padding:0;display:grid;gap:.5rem">
    {#each items as i}<li class="card" style="padding:.75rem"><strong>{i.date}</strong> — {i.text}</li>{/each}
  </ol>
</section>
