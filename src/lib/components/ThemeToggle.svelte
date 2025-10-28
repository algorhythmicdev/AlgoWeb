<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  const MODES = ['light','dark','high-contrast-light','high-contrast-dark'] as const;
  type Mode = typeof MODES[number];
  let mode: Mode = 'dark';
  
  function apply(m: Mode) {
    if (!browser) return;
    document.documentElement.setAttribute('data-theme', m);
    localStorage.setItem('theme-mode', m);
    mode = m;
  }
  
  onMount(() => {
    const stored = localStorage.getItem('theme-mode') as Mode;
    mode = stored || 'dark';
    apply(mode);
  });
</script>

<div class="card surface-2 control" style="padding:.5rem;border-radius:10px;display:inline-flex;gap:.5rem;align-items:center">
  <label for="theme-select" class="text-secondary">Theme</label>
  <select id="theme-select" on:change={(e)=>apply((e.currentTarget as HTMLSelectElement).value as Mode)} bind:value={mode}>
    {#each MODES as m}<option value={m}>{m}</option>{/each}
  </select>
</div>
