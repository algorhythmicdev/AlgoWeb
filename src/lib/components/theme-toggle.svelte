<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  type Mode = 'light' | 'dark' | 'high-contrast-dark';
  const MODES: Mode[] = ['light','dark','high-contrast-dark'];

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

<div class="card surface-2 control" style="padding:.5rem;border-radius:10px;display:inline-flex;gap:.5rem;align-items:center">
  <span class="text-secondary" aria-hidden="true">Theme</span>
  <div role="radiogroup" aria-label="Theme mode" style="display:inline-flex;gap:.25rem">
    {#each MODES as m}
      <button
        type="button"
        role="radio"
        aria-checked={mode===m}
        class="btn"
        on:click={() => apply(m)}
        title={m === 'high-contrast-dark' ? 'High Contrast' : m[0].toUpperCase()+m.slice(1)}
      >
        {m==='high-contrast-dark' ? 'High Contrast' : (m==='light' ? 'Light' : 'Dark')}
      </button>
    {/each}
  </div>
</div>
