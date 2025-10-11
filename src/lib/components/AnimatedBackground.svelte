<script lang="ts">
  import ThemedBackground from './ThemedBackground.svelte';
  import HaloFX from './HaloFX.svelte';

  export let halo: boolean = true;
  export let tone: 'primary' | 'aurora' | 'voyage' | 'citrus' | 'evergreen' = 'primary';
</script>

<ThemedBackground />
{#if halo}
  <HaloFX {tone} />
{/if}
