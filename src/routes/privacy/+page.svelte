<script lang="ts">
  import { Head } from '$lib/seo';
  const head = Head({ title: 'Privacy', description: 'How we handle your data in plain language.' });
  const points = [
    'We collect analytics-only traffic insights with no personal data.',
    'Emails you send are stored in a secure, access-controlled inbox.',
    'You can request data removal at any time by emailing privacy@algoweb.studio.'
  ];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>Privacy</h1>
  <p>We keep things simple. The site runs statically with no tracking pixels or third-party scripts.</p>

  <section>
    <h2>Key points</h2>
    <ul>{#each points as point}<li>{point}</li>{/each}</ul>
  </section>

  <p>Questions? Email <a href="mailto:privacy@algoweb.studio">privacy@algoweb.studio</a>.</p>
</main>
