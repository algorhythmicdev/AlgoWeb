<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { withBase } from '$utils/paths';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Consulting',
    description: 'Practical automation, data workflows, and training.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'consulting', FALLBACK, activeLocale);
  $: head = Head(meta);

  const services = [
    'Automation & workflow design',
    'Data integration and reporting',
    'Team training and playbooks'
  ];

  const process = [
    'Kickoff & scope (1–2 calls)',
    'Prototype in days (not months)',
    'Iterate with real feedback',
    'Handover & training'
  ];

  let pilotSpots = 3; // placeholder counter for UI signal; real backend would drive this
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/consulting')}>
  {@html hreflangLinks(data.pathname ?? '/consulting')}
</svelte:head>

<main id="main">
  <h1>Consulting</h1>
  <p>We keep it practical and fast. Clear outcomes, shipped quickly.</p>

  <h2>Services</h2>
  <ul>{#each services as s}<li>{s}</li>{/each}</ul>

  <h2>Process</h2>
  <ol>{#each process as p}<li>{p}</li>{/each}</ol>

  <aside aria-label="Pilot program" style="border:1px solid currentColor;padding:1rem;border-radius:.5rem">
    <strong>Pilot applications open.</strong>
    <p>Spots left: {pilotSpots}</p>
    <p><a class="btn" href={withBase('/contact') ?? '/contact'}>Apply for a pilot</a></p>
  </aside>
</main>
