<script lang="ts">
  import { base } from '$app/paths';
  export let status: number;
  const homeHref = base || '/';
</script>
<main id="main" class="prose section">
  <h1>{status===404?'Page not found':'Something went wrong'}</h1>
  <p><a class="btn" href={homeHref}>Go home</a></p>
</main>
