<script lang="ts">
  export let container: HTMLElement | null = null;
  export let levels: ('h2'|'h3')[] = ['h2','h3'];
  let items: { id: string; text: string; level: 'h2'|'h3' }[] = [];

  function refresh() {
    if (!container) return;
    items = [];
    levels.forEach(level => {
      container.querySelectorAll(level).forEach(h => {
        const el = h as HTMLElement;
        if (el.id && el.textContent) {
          items.push({ id: el.id, text: el.textContent.trim(), level });
        }
      });
    });
  }
  $: refresh();
</script>

{#if items.length > 1}
<nav class="card surface-2 control py-4" aria-label="On this page">
  <div class="h-stack">
    <h3>On this page</h3>
    <ul class="rhythm-tight" style="list-style:none;padding:0;margin:0">
      {#each items as it}
        <li style="margin-left:{it.level==='h3' ? '1rem' : '0'}">
          <a href={`#${it.id}`}>{it.text}</a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
{/if}
