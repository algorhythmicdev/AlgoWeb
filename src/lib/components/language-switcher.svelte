<script lang="ts">
  import { onMount } from 'svelte';
  import { LANGS, lang, i18n } from '$lib/i18n';
  
  let current: typeof LANGS[number] = 'en';
  $: t = $i18n;
  
  onMount(() => {
    const unsubscribe = lang.subscribe((l)=> current=l);
    return unsubscribe;
  });
  
  function set(l: typeof LANGS[number]) { lang.set(l); }
</script>

<div class="card surface-2 control" style="padding:.5rem;border-radius:10px;display:inline-flex;gap:.5rem;align-items:center">
  <label for="lang-select" class="text-secondary">{t('language.label')}</label>
  <select id="lang-select" bind:value={current} on:change={(e)=> set((e.currentTarget as HTMLSelectElement).value as any)} aria-label={t('language_switcher.trigger_label')}>
    {#each LANGS as L}<option value={L}>{t(`language_switcher.languages.${L}.short`)}</option>{/each}
  </select>
</div>
