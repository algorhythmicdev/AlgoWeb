<script lang="ts">
  import { Head } from '$lib/seo';
  const head = Head({ title: 'Contact', description: 'Get in touch about consulting or products.' });
  const topics = [
    { label: 'Consulting & automation', mail: 'consulting@algoweb.studio' },
    { label: 'Education programs', mail: 'education@algoweb.studio' },
    { label: 'Partnerships', mail: 'partners@algoweb.studio' }
  ];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>Contact</h1>
  <p>We reply within one working day. Let us know how we can help and we will follow up with a short plan.</p>

  <section>
    <h2>Direct email</h2>
    <ul>
      {#each topics as topic}
        <li>
          <strong>{topic.label}:</strong>
          <a href={`mailto:${topic.mail}`}>{topic.mail}</a>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2>Prefer a meeting?</h2>
    <p>Send us a note and include a Calendly link or two time options. We can meet via Google Meet or Zoom.</p>
    <p><a class="btn btn-primary" href="mailto:hello@algoweb.studio">hello@algoweb.studio</a></p>
  </section>
</main>
