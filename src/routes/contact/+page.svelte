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
    titleFallback: 'Let’s build calm AI together',
    subtitleKey: 'contact.page.hero.subtitle',
    subtitleFallback:
      'AlgoRhythmics operates remotely from Latvia, serving partners worldwide. Reach out for product pilots, consulting, or community collaborations.',
    actions: [
      {
        href: 'mailto:help@algorhythmics.com',
        variant: 'gradient' as const,
        labelKey: 'contact.page.hero.cta_email',
        labelFallback: 'Email help@algorhythmics.com'
      },
      {
        href: '/solutions',
        variant: 'secondary' as const,
        labelKey: 'contact.page.hero.cta_events',
        labelFallback: 'Explore our solutions'
      }
    ]
  } as const;

  const contactCards = [
    {
      icon: 'email',
      titleKey: 'contact.page.cards.general.title',
      titleFallback: 'General enquiries',
      copyKey: 'contact.page.cards.general.copy',
      copyFallback:
        'Questions about AlgoRhythmics or our roadmap? Drop us a line and we will reply within one business day.',
      action: {
        href: 'mailto:help@algorhythmics.com',
        labelKey: 'contact.page.cards.general.cta',
        labelFallback: 'Email help@algorhythmics.com'
      }
    },
    {
      icon: 'target',
      titleKey: 'contact.page.cards.support.title',
      titleFallback: 'Product pilots & consulting',
      copyKey: 'contact.page.cards.support.copy',
      copyFallback:
        'Partner with us on NodeVoyage, Ideonautix, or bespoke consulting engagements. We co-design pilots and long-term rollouts.',
      action: {
        href: '/solutions',
        labelKey: 'contact.page.cards.support.cta',
        labelFallback: 'View solutions overview'
      }
    },
    {
      icon: 'education',
      titleKey: 'contact.page.cards.education.title',
      titleFallback: 'Education & community',
      copyKey: 'contact.page.cards.education.copy',
      copyFallback:
        'Schools, libraries, and community organisations can reach our outreach coordinators at education@algorhythmics.com.',
      action: {
        href: 'mailto:education@algorhythmics.com',
        labelKey: 'contact.page.cards.education.cta',
        labelFallback: 'Email the outreach team'
      }
    },
    {
      icon: 'idea',
      titleKey: 'contact.page.cards.visit.title',
      titleFallback: 'Partnerships & media',
      copyKey: 'contact.page.cards.visit.copy',
      copyFallback:
        'For collaborations, press enquiries, or speaking invitations, contact hello@algorhythmics.com and we will coordinate a session.',
      action: {
        href: 'mailto:hello@algorhythmics.com',
        labelKey: 'contact.page.cards.visit.cta',
        labelFallback: 'Email hello@algorhythmics.com'
      }
    }
  ] as const;

  let formData = {
    name: '',
    email: '',
    reason: 'general',
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
    if (!formData.reason.trim()) next.reason = t('contact.page.form.errors.reason_required', 'Select a reason.');
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
      t('contact.page.form.mailto_subject', 'Website enquiry from {name} ({reason})')
        .replace('{name}', formData.name)
        .replace('{reason}', formData.reason)
    );
    const bodyTemplate = t(
      'contact.page.form.mailto_body',
      'Name: {name}\nEmail: {email}\nReason: {reason}\n\n{message}'
    );
    const body = encodeURIComponent(
      bodyTemplate
        .replace('{name}', formData.name)
        .replace('{email}', formData.email)
        .replace('{reason}', formData.reason)
        .replace('{message}', formData.message)
    );
    window.location.href = `mailto:help@algorhythmics.com?subject=${subject}&body=${body}`;
    status = 'success';
    formData = { name: '', email: '', reason: 'general', message: '' };
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
          <span>{t('contact.page.form.fields.reason.label', 'Reason for contacting')}</span>
          <select bind:value={formData.reason} on:change={resetStatus} aria-invalid={errors.reason ? 'true' : 'false'}>
            <option value="general">{t('contact.page.form.fields.reason.options.general', 'General question')}</option>
            <option value="consulting">{t('contact.page.form.fields.reason.options.consulting', 'Consulting or pilot')}</option>
            <option value="education">{t('contact.page.form.fields.reason.options.education', 'Education & community')}</option>
            <option value="media">{t('contact.page.form.fields.reason.options.media', 'Media or partnership')}</option>
          </select>
          {#if errors.reason}
            <span class="field-error">{errors.reason}</span>
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

<SectionDivider tone="aurora" />

<section id="newsletter" class="contact-newsletter" use:revealOnScroll>
  <div class="container">
    <GlassCard class="newsletter-card" padding="lg">
      <span class="section-eyebrow">Studio updates</span>
      <h2>{t('contact.page.newsletter.title', 'Subscribe for launch updates')}</h2>
      <p>
        {t(
          'contact.page.newsletter.copy',
          'Get a quarterly roundup on NodeVoyage, Ideonautix, and our consulting stories. No spam—just honest progress.'
        )}
      </p>
      <div class="newsletter-actions">
        <Button href="mailto:newsletter@algorhythmics.com" variant="gradient">{t(
            'contact.page.newsletter.cta',
            'Email newsletter@algorhythmics.com'
          )}</Button>
        <Button href="/solutions" variant="secondary">{t(
            'contact.page.newsletter.secondary',
            'Read about our solutions'
          )}</Button>
      </div>
      <p class="newsletter-note">
        {t(
          'contact.page.newsletter.note',
          'Prefer a form? Mention “Newsletter” in the message above and we will add you manually.'
        )}
      </p>
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
  .contact-form,
  .contact-newsletter {
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
  select,
  textarea {
    font: inherit;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--surface-field-border, color-mix(in srgb, var(--border) 72%, transparent 28%));
    background: var(--surface-field-bg, color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%));
    color: var(--text);
  }

  input:focus-visible,
  select:focus-visible,
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

  .contact-newsletter :global(.newsletter-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
  }

  .newsletter-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    justify-content: center;
  }

  .newsletter-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
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

