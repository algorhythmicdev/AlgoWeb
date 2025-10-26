<script lang="ts">
  export let src = ''; // e.g., local mp4 or hosted demo URL
  let open=false;
</script>

<div class="section">
  <button class="btn btn-primary" on:click={() => open=true}>Open demo</button>
  {#if open}
    <div class="glass" style="position:fixed;inset:0;padding:2rem" role="dialog" aria-modal="true">
      <button class="btn" on:click={() => open=false} style="position:absolute;top:1rem;right:1rem">Close</button>
      <div class="container">
        <video src={src} controls style="width:100%;max-height:80vh"></video>
      </div>
    </div>
  {/if}
</div>
