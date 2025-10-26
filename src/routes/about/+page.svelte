<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  onMount(() => { goto('/team', { replaceState: true }); });
</script>

<noscript>
  <meta http-equiv="refresh" content="0;url=/team" />
  <p>Moved to <a href="/team">/team</a>.</p>
</noscript>
