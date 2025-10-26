<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  const target = `${base}/team`;

  onMount(() => {
    goto(target, { replaceState: true });
  });
</script>

<noscript>
  <meta http-equiv="refresh" content={`0;url=${target}`} />
  <p>Moved to <a href={target}>Team</a>.</p>
</noscript>
