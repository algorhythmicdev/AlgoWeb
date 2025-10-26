<script lang="ts">
  export let items=[
    {quote:'They helped us automate a weekly report without changing our stack.',by:'Operations lead, regional SaaS team'},
    {quote:'Our students finally saw how AI fits into real projects.',by:'Coordinator, Daugavpils programming school'}
  ];
  let i=0; const next=()=>i=(i+1)%items.length, prev=()=>i=(i-1+items.length)%items.length;
</script>
<section class="section">
  <h2>Testimonials</h2>
  <div class="glass" style="padding:1rem">
    <blockquote><p>“{items[i].quote}”</p><footer>— {items[i].by}</footer></blockquote>
    <div style="display:flex;gap:.5rem"><button class="btn" on:click={prev}>Prev</button><button class="btn" on:click={next}>Next</button></div>
  </div>
</section>
