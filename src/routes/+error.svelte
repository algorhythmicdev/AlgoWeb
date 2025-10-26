<script lang="ts">
  export let error: Error & { message?: string };
  export let status: number;

  const isNotFound = status === 404;
  const detail = isNotFound ? 'The page you requested does not exist.' : error?.message ?? 'Please try again.';
</script>

<main id="main">
  <h1>{isNotFound ? 'Page not found' : 'Something went wrong'}</h1>
  <p>{detail}</p>
  <p><a href="/">Go home</a></p>
</main>
