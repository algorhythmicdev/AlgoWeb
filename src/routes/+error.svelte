<script lang="ts">
  export let status: number | undefined = undefined;
  import { base as appBase } from '$app/paths';
  const homeHref = appBase || '/';
</script>

<main class="container section prose">
  <h1 class="text-strong">{status || 404}</h1>
  <p>That page doesn't live here anymore.</p>
  <p><a class="btn btn-primary" href={homeHref}>Go to Home</a></p>
</main>
