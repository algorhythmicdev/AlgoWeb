<script>
  import { Head } from '$lib/seo';
  import { _ } from '$lib/i18n';
  const head = Head({
    title: 'Education',
    description: 'Programs for schools and universities in plain language.'
  });
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>{$_('education.title') || 'Education'}</h1>
  <p>
    {$_('education.description') ||
      'We’re preparing practical, easy-to-run AI programs for schools and universities. This page grows with real content.'}
  </p>
</main>
