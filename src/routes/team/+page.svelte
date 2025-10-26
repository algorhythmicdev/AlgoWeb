<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { withBase } from '$utils/paths';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Team',
    description: 'Latvia-based team focused on practical AI.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'team', FALLBACK, activeLocale);
  $: head = Head(meta);
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/team')}>
  {@html hreflangLinks(data.pathname ?? '/team')}
</svelte:head>

<main id="main">
  <h1>Team</h1>
  <p><strong>Based in Daugavpils, Latvia.</strong> We design accessible AI tools and hands-on programs.</p>

  <section>
    <h2>Mission</h2>
    <p>Simple tools, clear guidance, and real outcomes for people, schools, and startups.</p>
  </section>

  <section>
    <h2>Partners & Background</h2>
    <ul>
      <li>LIAA (Latvian Investment and Development Agency)</li>
      <li>Reclame Fabriek (current workplace reference)</li>
    </ul>
  </section>

  <section>
    <h2>Contact</h2>
    <p>Reach the team on the <a href={withBase('/contact') ?? '/contact'}>Contact</a> page.</p>
  </section>
</main>
