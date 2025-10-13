<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const hero = {
    titleKey: 'contact.page.hero.title',
    titleFallback: 'Get in Touch with AlgoRhythmics',
    subtitleKey: 'contact.page.hero.subtitle',
    subtitleFallback:
      'Questions about our platforms, partnerships, educational programmes, or community events? We are here for you.',
    actions: [
      {
        href: 'mailto:AlgoRhythmics.dev@gmail.com',
        variant: 'gradient' as const,
        labelKey: 'contact.page.hero.cta_email',
        labelFallback: 'Email the studio'
      },
      {
        href: '/resources#events',
        variant: 'secondary' as const,
        labelKey: 'contact.page.hero.cta_events',
        labelFallback: 'Join an event'
      }
    ]
  } as const;

  const contactCards = [
    {
      icon: 'email',
      titleKey: 'contact.page.cards.general.title',
      titleFallback: 'General inquiries',
      copyKey: 'contact.page.cards.general.copy',
      copyFallback:
        'Partnerships, media, or big ideas—send us a note and we will respond within two business days.',
      action: {
        href: 'mailto:AlgoRhythmics.dev@gmail.com',
        labelKey: 'contact.page.cards.general.cta',
        labelFallback: 'Email the studio'
      }
    },
    {
      icon: 'target',
      titleKey: 'contact.page.cards.support.title',
      titleFallback: 'Customer support',
      copyKey: 'contact.page.cards.support.copy',
      copyFallback:
        'Already using Ideonautix or NodeVoyage? Our support chatbot is available 24/7, or write to support@algorhythmics.ai.',
      action: {
        href: '/services#platforms',
        labelKey: 'contact.page.cards.support.cta',
        labelFallback: 'Open support chat'
      }
    },
    {
      icon: 'education',
      titleKey: 'contact.page.cards.education.title',
      titleFallback: 'Educational outreach',
      copyKey: 'contact.page.cards.education.copy',
      copyFallback:
        'Educators and community organisers can reach our outreach coordinators at education@algorhythmics.ai for tailored programmes.',
      action: {
        href: 'mailto:education@algorhythmics.ai',
        labelKey: 'contact.page.cards.education.cta',
        labelFallback: 'Contact outreach team'
      }
    },
    {
      icon: 'location',
      titleKey: 'contact.page.cards.visit.title',
      titleFallback: 'Visit us',
      copyKey: 'contact.page.cards.visit.copy',
      copyFallback:
        'Headquarters: 123 Innovation Way, Riga, LV-1001. Drop by during office hours or book a visit in advance.',
      action: {
        href: 'https://maps.google.com/?q=123+Innovation+Way+Riga+LV-1001',
        labelKey: 'contact.page.cards.visit.cta',
        labelFallback: 'View on map'
      }
    }
  ] as const;

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
    if (!formData.name.trim()) next.name = t('contact.page.form.errors.name_required', 'Please add your name.');
    if (!formData.email.trim()) next.email = t('contact.page.form.errors.email_required', 'We use this to reply.');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = t('contact.page.form.errors.email_invalid', 'Add a valid email address.');
    if (!formData.message.trim()) next.message = t('contact.page.form.errors.message_required', 'Tell us how we can help.');
    errors = next;
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!validate()) {
      status = 'error';
      return;
    }

    const subject = encodeURIComponent(
      t('contact.page.form.mailto_subject', 'Website inquiry from {name}').replace('{name}', formData.name)
    );
    const bodyTemplate = t(
      'contact.page.form.mailto_body',
      'Name: {name}\nEmail: {email}\n\n{message}'
    );
    const body = encodeURIComponent(
      bodyTemplate
        .replace('{name}', formData.name)
        .replace('{email}', formData.email)
        .replace('{message}', formData.message)
    );
    window.location.href = `mailto:AlgoRhythmics.dev@gmail.com?subject=${subject}&body=${body}`;
    status = 'success';
    formData = { name: '', email: '', message: '' };
  };

  onMount(() => {
    resetStatus();
  });
</script>

<Hero variant="halo" title={t(hero.titleKey, hero.titleFallback)} subtitle={t(hero.subtitleKey, hero.subtitleFallback)}>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      {#each hero.actions as action (action.href)}
        <Button href={action.href} variant={action.variant} size="lg">{t(action.labelKey, action.labelFallback)}</Button>
      {/each}
    </div>
  </svelte:fragment>
</Hero>

<section class="contact-options" use:revealOnScroll>
  <div class="container">
    <h2 class="contact-options__heading">{t('contact.page.cards.heading', 'Ways to connect')}</h2>
    <div class="contact-options__grid" use:staggerReveal>
      {#each contactCards as card (card.titleKey)}
        <GlassCard class="contact-card" padding="lg" halo>
          <div class="card-icon">
            <Icon name={card.icon} size={28} />
          </div>
          <h3>{t(card.titleKey, card.titleFallback)}</h3>
          <p>{t(card.copyKey, card.copyFallback)}</p>
          <Button href={card.action.href} variant="secondary" size="md">{t(card.action.labelKey, card.action.labelFallback)}</Button>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="contact-form" use:revealOnScroll>
  <div class="container">
    <GlassCard class="form-card" padding="lg" halo>
      <span class="section-eyebrow">{t('contact.page.form.eyebrow', 'Send a message')}</span>
      <h2>{t('contact.page.form.title', 'We reply within two business days')}</h2>
      <p>{t('contact.page.form.description', 'Please share your name, email, and what you would like to explore. We respect your privacy and handle all messages with care.')}</p>

      <form class="form" on:submit={handleSubmit}>
        <label>
          <span>{t('contact.page.form.fields.name.label', 'Name')}</span>
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
          <span>{t('contact.page.form.fields.email.label', 'Email')}</span>
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
          <span>{t('contact.page.form.fields.message.label', 'Message')}</span>
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
          <Button type="submit" variant="gradient" size="lg">{t('contact.page.form.submit', 'Send message')}</Button>
          <span class="form-note">{t('contact.page.form.note', 'By emailing us you agree to our respectful data handling.')}</span>
        </div>

        {#if status === 'success'}
          <p class="form-status" role="status">{t('contact.page.form.success', 'Thank you! Your email client is opening with a pre-filled message.')}</p>
        {:else if status === 'error' && Object.keys(errors).length}
          <p class="form-status" role="alert">{t('contact.page.form.error', 'Please fix the highlighted fields.')}</p>
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

  .contact-options__heading {
    margin: 0 0 clamp(1.5rem, 4vw, 2.5rem);
    text-align: center;
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    font-weight: var(--weight-semibold);
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

