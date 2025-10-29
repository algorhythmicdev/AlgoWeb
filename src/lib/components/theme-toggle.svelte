<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  type Mode = 'light' | 'dark' | 'high-contrast';
  const MODES: Mode[] = ['light','dark','high-contrast'];
  let mode: Mode = 'dark';

  function apply(m: Mode){
    if (!browser) return;
    document.documentElement.setAttribute('data-theme', m);
    localStorage.setItem('theme-mode', m);
    mode = m;
  }

  onMount(() => {
    const stored = (localStorage.getItem('theme-mode') as Mode) || 'dark';
    mode = stored;
    apply(mode);
  });
</script>

<div class="card control" style="display:inline-flex;gap:.25rem;align-items:center;padding:.5rem;border-radius:10px">
  <span class="visually-hidden">Theme</span>
  {#each MODES as m}
    <button
      class="btn"
      type="button"
      role="radio"
      aria-checked={mode===m}
      on:click={() => apply(m)}
      title={m}
    >{m}</button>
  {/each}
</div>
