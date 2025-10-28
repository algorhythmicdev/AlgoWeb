<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base as appBase } from '$app/paths';
  const teamHref = `${appBase}/team`;
  onMount(() => goto(teamHref, { replaceState: true }));
</script>
<noscript>
  <meta http-equiv="refresh" content={`0;url=${teamHref}`} />
  <p>Moved to <a href={teamHref}>team</a>.</p>
</noscript>
