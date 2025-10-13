<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { onMount } from 'svelte';

  const hero = {
    title: 'Get in Touch with AlgoRhythmics',
    subtitle:
      'Questions about our platforms, partnerships, educational programmes, or community events? We are here for you.'
  };

  const contactCards = [
    {
      icon: 'email',
      title: 'General inquiries',
      copy:
        'Partnerships, media, or big ideas—send us a note and we will respond within two business days.',
      action: { label: 'Email the studio', href: 'mailto:AlgoRhythmics.dev@gmail.com' }
    },
    {
      icon: 'target',
      title: 'Customer support',
      copy:
        'Already using Ideonautix or NodeVoyage? Our support chatbot is available 24/7, or write to support@algorhythmics.ai.',
      action: { label: 'Open support chat', href: '/services#platforms' }
    },
    {
      icon: 'education',
      title: 'Educational outreach',
      copy:
        'Educators and community organisers can reach our outreach coordinators at education@algorhythmics.ai for tailored programmes.',
      action: { label: 'Contact outreach team', href: 'mailto:education@algorhythmics.ai' }
    },
    {
      icon: 'location',
      title: 'Visit us',
      copy:
        'Headquarters: 123 Innovation Way, Riga, LV-1001. Drop by during office hours or book a visit in advance.',
      action: { label: 'View on map', href: 'https://maps.google.com/?q=123+Innovation+Way+Riga+LV-1001' }
    }
  ];

  let formData = {
    name: '',
    email: '',
    message: ''
  };

  let errors: Record<string, string> = {};
  let status: 'idle' | 'success' | 'error' = 'idle';

  const resetStatus = () => {
    if (status !== 'idle') status = 'idle';
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = 'Please add your name.';
    if (!formData.email.trim()) next.email = 'We use this to reply.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = 'Add a valid email address.';
    if (!formData.message.trim()) next.message = 'Tell us how we can help.';
    errors = next;
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!validate()) {
      status = 'error';
      return;
    }

    const subject = encodeURIComponent(`Website inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:AlgoRhythmics.dev@gmail.com?subject=${subject}&body=${body}`;
    status = 'success';
    formData = { name: '', email: '', message: '' };
  };

  onMount(() => {
    resetStatus();
  });
</script>

<Hero variant="halo" title={hero.title} subtitle={hero.subtitle}>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href="mailto:AlgoRhythmics.dev@gmail.com" variant="gradient" size="lg">Email the studio</Button>
      <Button href="/resources#events" variant="secondary" size="lg">Join an event</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="contact-options" use:revealOnScroll>
  <div class="container contact-options__grid" use:staggerReveal>
    {#each contactCards as card (card.title)}
      <GlassCard class="contact-card" padding="lg" halo>
        <div class="card-icon">
          <Icon name={card.icon} size={28} />
        </div>
        <h3>{card.title}</h3>
        <p>{card.copy}</p>
        <Button href={card.action.href} variant="secondary" size="md">{card.action.label}</Button>
      </GlassCard>
    {/each}
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="contact-form" use:revealOnScroll>
  <div class="container">
    <GlassCard class="form-card" padding="lg" halo>
      <span class="section-eyebrow">Send a message</span>
      <h2>We reply within two business days</h2>
      <p>Please share your name, email, and what you would like to explore. We respect your privacy and handle all messages with care.</p>

      <form class="form" on:submit={handleSubmit}>
        <label>
          <span>Name</span>
          <input
            type="text"
            bind:value={formData.name}
            on:input={resetStatus}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {#if errors.name}
            <span class="field-error">{errors.name}</span>
          {/if}
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            bind:value={formData.email}
            on:input={resetStatus}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {#if errors.email}
            <span class="field-error">{errors.email}</span>
          {/if}
        </label>

        <label>
          <span>Message</span>
          <textarea
            rows="6"
            bind:value={formData.message}
            on:input={resetStatus}
            aria-invalid={errors.message ? 'true' : 'false'}
          ></textarea>
          {#if errors.message}
            <span class="field-error">{errors.message}</span>
          {/if}
        </label>

        <div class="form-actions">
          <Button type="submit" variant="gradient" size="lg">Send message</Button>
          <span class="form-note">By emailing us you agree to our respectful data handling.</span>
        </div>

        {#if status === 'success'}
          <p class="form-status" role="status">Thank you! Your email client is opening with a pre-filled message.</p>
        {:else if status === 'error' && Object.keys(errors).length}
          <p class="form-status" role="alert">Please fix the highlighted fields.</p>
        {/if}
      </form>
    </GlassCard>
  </div>
</section>

<style>
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .contact-options,
  .contact-form {
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }

  .contact-options__grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.contact-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  .card-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--voyage-blue-rgb), 0.18) 18%);
    color: var(--voyage-blue);
  }

  .section-eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.form-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
    max-width: 680px;
    margin: 0 auto;
  }

  .form {
    display: grid;
    gap: clamp(1rem, 3vw, 1.4rem);
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-weight: var(--weight-semibold);
  }

  input,
  textarea {
    font: inherit;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--surface-field-border, color-mix(in srgb, var(--border) 72%, transparent 28%));
    background: var(--surface-field-bg, color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%));
    color: var(--text);
  }

  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--voyage-blue);
    outline-offset: 2px;
  }

  .field-error {
    font-size: var(--text-small);
    color: var(--cherry-pop, #e0322c);
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .form-status {
    font-size: var(--text-small);
    color: var(--voyage-blue);
  }

  @media (min-width: 900px) {
    .contact-options__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .form-actions {
      align-items: center;
    }
  }
</style>

