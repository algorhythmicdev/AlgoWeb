<script lang="ts">
  import { Head } from '$lib/seo';
  import { PUBLIC_CONTACT_ENDPOINT } from '$env/static/public';

  const head = Head({
    title: 'Contact',
    description: 'Get in touch about consulting or products.'
  });

  const copy = {
    heading: 'Contact',
    fields: {
      name: 'Name',
      email: 'Email',
      message: 'Message'
    },
    submit: 'Send',
    sending: 'Sending…'
  } as const;

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

    if (!PUBLIC_CONTACT_ENDPOINT) {
      resultMsg = 'Thanks! Email client will open…';
      const mailto = `mailto:hello@yourdomain.tld?subject=Website contact from ${encodeURIComponent(
        name
      )}&body=${encodeURIComponent(message)}%0A%0AEmail:${encodeURIComponent(email)}`;
      window.location.href = mailto;
      return;
    }

    try {
      sending = true;
      const res = await fetch(PUBLIC_CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
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
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main">
  <h1>{copy.heading}</h1>

  {#if errorSummary}
    <div role="alert" aria-live="assertive">{errorSummary}</div>
  {/if}
  {#if resultMsg}
    <p aria-live="polite">{resultMsg}</p>
  {/if}

  <form on:submit|preventDefault={submit} novalidate>
    <label for="name">{copy.fields.name}</label>
    <input
      id="name"
      bind:value={name}
      aria-invalid={errors.name ? 'true' : 'false'}
      aria-describedby={errors.name ? 'name-err' : undefined}
    />
    {#if errors.name}<div id="name-err" role="status">{errors.name}</div>{/if}

    <label for="email">{copy.fields.email}</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      aria-invalid={errors.email ? 'true' : 'false'}
      aria-describedby={errors.email ? 'email-err' : undefined}
    />
    {#if errors.email}<div id="email-err" role="status">{errors.email}</div>{/if}

    <label for="message">{copy.fields.message}</label>
    <textarea
      id="message"
      rows="6"
      bind:value={message}
      aria-invalid={errors.message ? 'true' : 'false'}
      aria-describedby={errors.message ? 'message-err' : undefined}
    ></textarea>
    {#if errors.message}<div id="message-err" role="status">{errors.message}</div>{/if}

    <button type="submit" disabled={sending}>{sending ? copy.sending : copy.submit}</button>
  </form>
</main>
