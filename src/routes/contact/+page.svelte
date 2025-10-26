<script lang="ts">
  import { Head } from '$lib/seo'; const head=Head({title:'Contact',description:'Get in touch about consulting or products.'});
  let intent='consulting', name='', email='', message=''; let errors:Record<string,string>={}, resultMsg='';
  const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(){errors={}; if(!name.trim())errors.name='Please enter your name.'; if(!emailRe.test(email))errors.email='Enter a valid email.'; if(message.trim().length<10)errors.message='Give us a few details.'; return !Object.keys(errors).length;}
  function submit(e:Event){e.preventDefault(); if(!validate())return; const subject=`Website: ${intent} — ${name}`; const body=`${message}\n\nEmail: ${email}`; location.href=`mailto:hello@yourdomain.tld?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; resultMsg='Thanks! Your email app should open.';}
</script>
<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose section">
  <h1>Contact</h1>
  {#if resultMsg}<p aria-live="polite">{resultMsg}</p>{/if}
  <form on:submit|preventDefault={submit} novalidate>
    <label for="intent">I’m contacting you about</label>
    <select id="intent" bind:value={intent}>
      <option value="consulting">Consulting</option><option value="ideonautix">Ideonautix</option>
      <option value="nodevoyage">NodeVoyage</option><option value="education">Education</option><option value="other">Other</option>
    </select>
    <label for="name">Name</label>
    <input id="name" bind:value={name} aria-invalid={!!errors.name} />
    {#if errors.name}<div role="status">{errors.name}</div>{/if}
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} aria-invalid={!!errors.email} />
    {#if errors.email}<div role="status">{errors.email}</div>{/if}
    <label for="message">Message</label>
    <textarea id="message" rows="6" bind:value={message} aria-invalid={!!errors.message}></textarea>
    {#if errors.message}<div role="status">{errors.message}</div>{/if}
    <button class="btn btn-primary" type="submit">Send</button>
  </form>
</main>
