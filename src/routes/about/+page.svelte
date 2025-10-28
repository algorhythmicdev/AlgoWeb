<script lang="ts">
  import { base as appBase } from '$app/paths';
  const teamHref = `${appBase}/team`;
</script>

<svelte:head>
  <meta http-equiv="refresh" content={`0;url=${teamHref}`} />
</svelte:head>

<main class="container section prose">
  <h1 class="text-strong">Moved</h1>
  <p>This page has moved to <a href={teamHref}>Team</a>.</p>
  <p><a class="btn btn-primary" href={teamHref}>Go to Team</a></p>
</main>
