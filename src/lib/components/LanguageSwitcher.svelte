<script lang="ts">
  import { onMount } from 'svelte';
  import { LANGS, lang } from '$lib/i18n';
  
  let current: typeof LANGS[number] = 'en';
  
  onMount(() => {
    const unsubscribe = lang.subscribe((l)=> current=l);
    return unsubscribe;
  });
  
  function set(l: typeof LANGS[number]) { lang.set(l); }
</script>

<div class="card surface-2 control" style="padding:.5rem;border-radius:10px;display:inline-flex;gap:.5rem;align-items:center">
  <label for="lang-select" class="text-secondary">Lang</label>
  <select id="lang-select" bind:value={current} on:change={(e)=> set((e.currentTarget as HTMLSelectElement).value as any)}>
    {#each LANGS as L}<option value={L}>{L.toUpperCase()}</option>{/each}
  </select>
</div>
