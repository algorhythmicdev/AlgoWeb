<script lang="ts">
  export let steps: { title: string; text: string; }[] = [];
</script>

<section class="section">
  <div class="container readable">
    <ol class="steps">
      {#each steps as s, i}
        <li class="card halo reveal" style="--i:{i}">
          <div class="num">{i + 1}</div>
          <div>
            <h3 class="text-strong" style="margin:0">{s.title}</h3>
            <p style="margin:.25rem 0 0">{s.text}</p>
          </div>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .steps { list-style: none; padding:0; margin:0; display:grid; gap: 20px; }
  .steps > li { display:grid; grid-template-columns: 48px 1fr; align-items:start; gap: 16px; }
  .num {
    width:48px;height:48px;border-radius:12px;
    background: var(--sep-grad); color: #fff; display:grid; place-items:center;
    font-weight:700;
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  }
</style>
