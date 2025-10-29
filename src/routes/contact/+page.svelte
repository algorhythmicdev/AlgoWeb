<script lang="ts">
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';

  let intent = 'consulting';
  let name = '';
  let email = '';
  let message = '';
  let resultMsg = '';
  let errors: Record<string, string> = {};

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    errors = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!emailRe.test(email)) errors.email = 'Enter a valid email.';
    if (message.trim().length < 10) errors.message = 'Give us a few details.';
    return Object.keys(errors).length === 0;
  }

  function submit(e: Event) {
    e.preventDefault();
    if (!validate()) return;

    const subject = `Website: ${intent} — ${name}`;
    const body = `${message}\n\nEmail: ${email}`;
    location.href = `mailto:hello@yourdomain.tld?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    resultMsg = 'Thanks! Your email app should open.';
  }
</script>

<svelte:head>
  <title>Contact — Algorhythmics</title>
  <meta name="description" content="Get in touch about consulting, Ideonautix, NodeVoyage, or education." />
</svelte:head>

<main id="main">
  <HeroEpic
    title="Let's Talk"
    subtitle="Get in Touch"
    description="Tell us what you want to achieve. We'll reply with a simple plan."
    variant="neural"
    particleType="waves"
    size="default"
  />

  <AnimatedDivider variant="gradient" theme="neural" spacing="spacious" />

  <section class="section">
    <div class="container stack prose" style="max-width:700px; margin:0 auto">
      {#if resultMsg}
        <RevealOnScroll animation="scale">
          <p aria-live="polite" style="text-align:center; color:var(--ai-cyber-1); font-weight:600; font-size:1.125rem">{resultMsg}</p>
        </RevealOnScroll>
      {/if}

      <RevealOnScroll animation="fade-up" delay={100}>
        <CardHalo halo="neural" glass>
          <form
            on:submit|preventDefault={submit}
            novalidate
            class="stack"
            style="padding:1.5rem"
          >
            <label for="intent">I'm contacting you about</label>
            <select id="intent" bind:value={intent} style="padding:0.75rem; border-radius:8px">
              <option value="consulting">Consulting</option>
              <option value="ideonautix">Ideonautix</option>
              <option value="nodevoyage">NodeVoyage</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>

            <label for="name">Name</label>
            <input id="name" bind:value={name} aria-invalid={!!errors.name} style="padding:0.75rem; border-radius:8px" />
            {#if errors.name}<div role="status" style="color:var(--ai-coral-1); font-size:0.875rem">{errors.name}</div>{/if}

            <label for="email">Email</label>
            <input id="email" type="email" bind:value={email} aria-invalid={!!errors.email} style="padding:0.75rem; border-radius:8px" />
            {#if errors.email}<div role="status" style="color:var(--ai-coral-1); font-size:0.875rem">{errors.email}</div>{/if}

            <label for="message">Message</label>
            <textarea id="message" rows="6" bind:value={message} aria-invalid={!!errors.message} style="padding:0.75rem; border-radius:8px"></textarea>
            {#if errors.message}<div role="status" style="color:var(--ai-coral-1); font-size:0.875rem">{errors.message}</div>{/if}

            <button class="btn btn-primary" type="submit" style="margin-top:1rem; padding:1rem">Send Message</button>
          </form>
        </CardHalo>
      </RevealOnScroll>
    </div>
  </section>
</main>
