<script lang="ts">
  import { Head } from '$lib/seo';
  import { canonicalFor } from '$lib/canonical';
  import { hreflangLinks } from '$lib/hreflang';
  import { _, locale as localeStore } from '$lib/i18n';
  import { buildMeta } from '$lib/meta';

  export let data: { pathname?: string; locale?: string } = {};

  const FALLBACK = {
    title: 'Contact',
    description: 'Get in touch about consulting or products.'
  };

  $: translate = $_;
  $: activeLocale = data.locale ?? $localeStore ?? 'en';
  $: meta = buildMeta(translate, 'contact', FALLBACK, activeLocale);
  $: head = Head(meta);

  let intent = 'consulting';
  let name = '';
  let email = '';
  let message = '';
  let sending = false;
  let resultMsg = '';
  let errorSummary = '';
  let errors: Record<string, string> = {};

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    errors = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!emailRe.test(email)) errors.email = 'Enter a valid email.';
    if (message.trim().length < 10) errors.message = 'Give us a few details.';
    errorSummary = Object.values(errors).join(' ');
    return Object.keys(errors).length === 0;
  }

  async function submit(e: Event) {
    e.preventDefault();
    if (!validate()) return;

    const endpoint = getContactEndpoint();

    if (!endpoint) {
      resultMsg = 'Thanks! Email client will open…';
      const subject = `Website: ${intent} — ${name}`;
      const mailto = `mailto:hello@yourdomain.tld?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}%0A%0AEmail:${encodeURIComponent(email)}`;
      window.location.href = mailto;
      return;
    }

    try {
      sending = true;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, name, email, message })
      });
      if (!res.ok) throw new Error('Failed to send');
      resultMsg = 'Message sent. We will reply soon.';
      name = email = message = '';
    } catch (err) {
      resultMsg = 'Could not send message. Please try email.';
      console.warn(err);
    } finally {
      sending = false;
    }
  }

  function getContactEndpoint() {
    const fromImportMeta =
      typeof import.meta !== 'undefined' && import.meta.env && 'PUBLIC_CONTACT_ENDPOINT' in import.meta.env
        ? (import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined)
        : undefined;

    if (fromImportMeta) {
      return fromImportMeta;
    }

    const fromProcess =
      (globalThis as { process?: { env?: Record<string, string | undefined> } })?.process?.env?.PUBLIC_CONTACT_ENDPOINT;

    return fromProcess ?? '';
  }
</script>

<svelte:head>
  {@html head}
  <link rel="canonical" href={canonicalFor(data.pathname ?? '/contact')}>
  {@html hreflangLinks(data.pathname ?? '/contact')}
</svelte:head>

<main id="main">
  <h1>Contact</h1>

  {#if errorSummary}
    <div role="alert" aria-live="assertive">{errorSummary}</div>
  {/if}
  {#if resultMsg}
    <p aria-live="polite">{resultMsg}</p>
  {/if}

  <form on:submit|preventDefault={submit} novalidate>
    <label for="intent">I’m contacting you about</label>
    <select id="intent" bind:value={intent}>
      <option value="consulting">Consulting</option>
      <option value="ideonautix">Ideonautix</option>
      <option value="nodevoyage">NodeVoyage</option>
      <option value="education">Education</option>
      <option value="other">Other</option>
    </select>

    <label for="name">Name</label>
    <input id="name" bind:value={name} aria-invalid={errors.name ? 'true' : 'false'} aria-describedby={errors.name ? 'name-err' : undefined} />
    {#if errors.name}<div id="name-err" role="status">{errors.name}</div>{/if}

    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} aria-invalid={errors.email ? 'true' : 'false'} aria-describedby={errors.email ? 'email-err' : undefined} />
    {#if errors.email}<div id="email-err" role="status">{errors.email}</div>{/if}

    <label for="message">Message</label>
    <textarea id="message" rows="6" bind:value={message} aria-invalid={errors.message ? 'true' : 'false'} aria-describedby={errors.message ? 'message-err' : undefined}></textarea>
    {#if errors.message}<div id="message-err" role="status">{errors.message}</div>{/if}

    <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
  </form>

  <!-- Optional calendar embed if you later set PUBLIC_CALENDAR_URL -->
  <!-- <iframe src="{PUBLIC_CALENDAR_URL}" title="Book a time" loading="lazy"></iframe> -->
</main>
