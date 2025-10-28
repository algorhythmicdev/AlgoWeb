<script lang="ts">
  export type Name = 'spark'|'check'|'bolt'|'map'|'clock'|'shield'|'book'|'users'|'gear'|'globe';
  export let name: Name = 'spark';
  export let size = 20;
  const paths: Record<Name,string> = {
    spark:'M12 2l2.5 6L21 11l-6.5 1L12 18l-2.5-6L3 11l6.5-3z',
    check:'M20 6l-11 11-5-5',
    bolt:'M13 2l-6 12h5l-1 8 6-12h-5l1-8z',
    map:'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z',
    clock:'M12 7v5l4 2',
    shield:'M12 2l8 4v5c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V6l8-4z',
    book:'M4 5a3 3 0 013-3h9v18h-9a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v12a1 1 0 001 1h7V4H7z',
    users:'M7 14a4 4 0 118 0m-10 6a6 6 0 1112 0',
    gear:'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z M3 12h3m12 0h3M12 3v3m0 12v3M5.1 5.1l2.1 2.1m9.6 9.6l2.1 2.1m0-13.8l-2.1 2.1M7.2 16.8l-2.1 2.1',
    globe:'M2 12h20M12 2a10 10 0 000 20m0-20a10 10 0 010 20M2 12h20M12 2c3 3 3 17 0 20'
  };
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
     width={size} height={size} fill="none" stroke="currentColor" stroke-width="1.75"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if name==='check'}
    <path d={paths.check}></path>
  {:else if name==='spark'}
    <path d={paths.spark}></path>
  {:else if name==='bolt'}
    <path d={paths.bolt}></path>
  {:else if name==='map'}
    <path d={paths.map}></path>
  {:else if name==='clock'}
    <path d={paths.clock}></path>
  {:else if name==='shield'}
    <path d={paths.shield}></path>
  {:else if name==='book'}
    <path d={paths.book}></path>
  {:else if name==='users'}
    <path d={paths.users}></path>
  {:else if name==='gear'}
    <path d={paths.gear}></path>
  {:else}
    <path d={paths.globe}></path>
  {/if}
</svg>
