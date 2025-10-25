<script lang="ts">
  export let items: { title: string; description?: string }[] = [];
</script>

<div class="gallery">
  {#each items as i}
    <figure>
      <div class="preview" aria-hidden="true">{i.title.slice(0, 2)}</div>
      <figcaption>
        <strong>{i.title}</strong>
        {#if i.description}<p>{i.description}</p>{/if}
      </figcaption>
    </figure>
  {/each}
</div>

<style>
  .gallery { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); }
  figure { border: 1px solid currentColor; border-radius: .75rem; padding: 1rem; display: grid; gap: .5rem; }
  .preview { display: inline-flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; border-radius: .75rem; border: 1px dashed currentColor; font-weight: 600; letter-spacing: .08em; }
  figcaption { display: grid; gap: .25rem; }
  figcaption p { margin: 0; font-size: .9rem; opacity: .85; }
</style>
