<script>
  // @ts-nocheck
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { _, json } from 'svelte-i18n';
  import { Icon, FieldSupport } from '$lib/components';
  import Hero from '$lib/components/Hero.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import MagneticTiltCard from '$lib/components/MagneticTiltCard.svelte';
  import Toast from '$components/toast.svelte';
  import en from '$lib/i18n/en.json';

  const fallbackHeroPhrases = Array.isArray(en.contact?.hero_rotating)
    ? en.contact.hero_rotating
    : [en.contact.hero_subtitle];
  const ensureString = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback);
  const fallbackHeroCtas = Array.isArray(en.contact?.hero_ctas)
    ? en.contact.hero_ctas.filter((item) => item && typeof item === 'object')
    : [
        {
          label: 'Email the studio',
          description: 'Direct founder inbox for partnerships, pilots, and press.',
          cta: 'Write an email',
          action: 'mailto:AlgoRhythmics.dev@gmail.com'
        },
        {
          label: 'Book a strategy call',
          description: 'Schedule a 30-minute OS-native workshop with our founders.',
          cta: 'Open calendar',
          action: 'calendly'
        },
        {
          label: 'Join the community',
          description: 'Vote on features, review open metrics, and co-create releases.',
          cta: 'Enter Discord',
          action: 'https://discord.gg/algorhythmics'
        }
      ];

  /**
   * @param {unknown} value
   * @returns {ReadonlyArray<string>}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? /** @type {string[]} */ (value)
      : fallbackHeroPhrases;

  /**
   * @param {unknown} value
   * @param {Array<{ label: string; description: string; cta: string; action: string }>} fallback
   */
  const ensureHeroCtas = (value, fallback) => {
    if (!Array.isArray(value)) return fallback;
    const entries = value
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const label = ensureString(item.label);
        const description = ensureString(item.description);
        const cta = ensureString(item.cta);
        const action = ensureString(item.action);
        if (!label || !cta || !action) return null;
        return { label, description, cta, action };
      })
      .filter(Boolean);
    return entries.length ? /** @type {Array<{ label: string; description: string; cta: string; action: string }>} */ (entries) : fallback;
  };

  let heroPhrases = fallbackHeroPhrases;
  $: heroPhrases = ensureStringArray($json?.('contact.hero_rotating'));

  let heroCtas = ensureHeroCtas(fallbackHeroCtas, fallbackHeroCtas);
  $: heroCtas = ensureHeroCtas($json?.('contact.hero_ctas'), fallbackHeroCtas);
  
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  const supportIds = {
    name: 'contact-name-support',
    email: 'contact-email-support',
    subject: 'contact-subject-support',
    message: 'contact-message-support'
  };
  
  /** @type {Record<string, string>} */
  let errors = {};
  let isSubmitting = false;
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';
  let calendlyLoaded = false;
  
  onMount(() => {
    if (!browser) return;

    const existing = document.querySelector('script[data-calendly-widget]');
    if (existing) {
      calendlyLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.calendlyWidget = 'true';
    script.onload = () => {
      calendlyLoaded = true;
    };
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  });
  
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function validateForm() {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = $_('form.error_required');
    if (!formData.email.trim()) {
      newErrors.email = $_('form.error_required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = $_('form.error_email');
    }
    if (!formData.subject.trim()) newErrors.subject = $_('form.error_required');
    if (!formData.message.trim()) newErrors.message = $_('form.error_required');
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toastMessage = $_('form.error_validation');
      toastType = 'error';
      showToast = true;
      return;
    }
    
    isSubmitting = true;
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY',
          subject: `Contact Form: ${formData.subject}`,
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
          to_email: 'AlgoRhythmics.dev@gmail.com'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toastMessage = $_('contact.form_success');
        toastType = 'success';
        showToast = true;
        
        formData = { name: '', email: '', subject: '', message: '' };
        errors = {};
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toastMessage = $_('contact.form_error');
      toastType = 'error';
      showToast = true;
    } finally {
      isSubmitting = false;
    }
  }
  
  function openCalendly() {
    if (!browser) {
      window.open('https://calendly.com/algorhythmics-dev', '_blank');
      return;
    }

    if (window.Calendly && calendlyLoaded) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/algorhythmics-dev'
      });
    } else {
      window.open('https://calendly.com/algorhythmics-dev', '_blank');
    }
  }
</script>

<svelte:head>
  <title>{$_('contact.meta_title')}</title>
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
</svelte:head>

{#if showToast}
  <Toast message={toastMessage} type={toastType} onClose={() => showToast = false} />
{/if}

<!-- Hero Section -->
<Hero variant="line" title={$_('contact.hero_title')} subtitle={$_('contact.hero_subtitle')}>
  <div class="contact-hero">
    <div class="contact-hero__headline">
      <AnimatedHeadline variant="pulse" phrases={heroPhrases} holdDuration={2800} />
    </div>

    {#if heroCtas.length}
      <div class="contact-hero__cta-grid">
        {#each heroCtas as item (item.label)}
          {#if item.action === 'calendly'}
            <button
              type="button"
              class="contact-hero__cta glass-card"
              on:click={openCalendly}
            >
              <span class="contact-hero__cta-label">{item.label}</span>
              {#if item.description}
                <span class="contact-hero__cta-description">{item.description}</span>
              {/if}
              <span class="contact-hero__cta-action">{item.cta}</span>
            </button>
          {:else}
            <a
              class="contact-hero__cta glass-card"
              href={item.action}
              target={item.action.startsWith('http') ? '_blank' : undefined}
              rel={item.action.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span class="contact-hero__cta-label">{item.label}</span>
              {#if item.description}
                <span class="contact-hero__cta-description">{item.description}</span>
              {/if}
              <span class="contact-hero__cta-action">{item.cta}</span>
            </a>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</Hero>

<!-- Contact Content -->
<section class="contact-section">
  <div class="container">
    <div class="contact-grid">
      <!-- Contact Form -->
      <MagneticTiltCard class="form-card" interactive={false}>
        <h2>{$_('contact.form_title')}</h2>

        <form on:submit={handleSubmit}>
      <div class="form-group" class:error={errors.name}>
        <label for="name" class="required">{$_('contact.form_name')}</label>
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          placeholder={$_('contact.form_name_placeholder')}
          class:error={errors.name}
          aria-describedby={supportIds.name}
          aria-invalid={Boolean(errors.name)}
        />
        <FieldSupport
          id={supportIds.name}
          tone={errors.name ? 'error' : 'helper'}
          message={errors.name ?? $_('form.helper_name')}
          announce="assertive"
        />
      </div>

      <div class="form-group" class:error={errors.email}>
        <label for="email" class="required">{$_('contact.form_email')}</label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          placeholder={$_('contact.form_email_placeholder')}
          class:error={errors.email}
          aria-describedby={supportIds.email}
          aria-invalid={Boolean(errors.email)}
        />
        <FieldSupport
          id={supportIds.email}
          tone={errors.email ? 'error' : 'helper'}
          message={errors.email ?? $_('form.helper_email')}
          announce="assertive"
        />
      </div>
          
      <div class="form-group" class:error={errors.subject}>
        <label for="subject" class="required">{$_('contact.form_subject')}</label>
        <input
          type="text"
          id="subject"
          bind:value={formData.subject}
          placeholder={$_('contact.form_subject_placeholder')}
          class:error={errors.subject}
          aria-describedby={supportIds.subject}
          aria-invalid={Boolean(errors.subject)}
        />
        <FieldSupport
          id={supportIds.subject}
          tone={errors.subject ? 'error' : 'helper'}
          message={errors.subject ?? $_('form.helper_subject')}
          announce="assertive"
        />
      </div>
          
      <div class="form-group" class:error={errors.message}>
        <label for="message" class="required">{$_('contact.form_message')}</label>
        <textarea
          id="message"
          bind:value={formData.message}
          rows="6"
          placeholder={$_('contact.form_message_placeholder')}
          class:error={errors.message}
          aria-describedby={supportIds.message}
          aria-invalid={Boolean(errors.message)}
        ></textarea>
        <FieldSupport
          id={supportIds.message}
          tone={errors.message ? 'error' : 'helper'}
          message={errors.message ?? $_('form.helper_message')}
          announce="assertive"
        />
      </div>
          
          <button
            type="submit"
            class="btn btn-primary btn-lg btn-block"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <span class="spinner"></span>
              {$_('contact.form_sending')}
            {:else}
              {$_('contact.form_submit')}
            {/if}
          </button>
        </form>
      </MagneticTiltCard>

      <!-- Contact Info & Calendar -->
      <div class="info-container">
        <!-- Calendar Widget -->
        <MagneticTiltCard class="calendar-card" interactive={false}>
          <h3>{$_('contact.calendar_title')}</h3>
          <p>{$_('contact.calendar_subtitle')}</p>
          <button
            class="calendar-button btn btn-secondary btn-lg btn-block"
            on:click={openCalendly}
            disabled={!calendlyLoaded}
          >
            <Icon name="calendar" size={20} class="button-icon" />
            <span>{$_('contact.calendar_button')}</span>
          </button>
        </MagneticTiltCard>

        <!-- Contact Information -->
        <MagneticTiltCard class="info-card" interactive={false}>
          <h3>{$_('contact.info_title')}</h3>

          <div class="info-item">
            <div class="info-icon">
              <Icon name="mail" size={22} />
            </div>
            <div>
              <div class="info-label">{$_('contact.info_email')}</div>
              <a href={`mailto:${$_('contact.info_email_value')}`} class="info-value">
                {$_('contact.info_email_value')}
              </a>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <Icon name="location" size={22} />
            </div>
            <div>
              <div class="info-label">{$_('contact.info_location')}</div>
              <div class="info-value">{$_('contact.info_location_value')}</div>
            </div>
          </div>
        </MagneticTiltCard>

        <!-- Social Links -->
        <MagneticTiltCard class="social-card" interactive={false}>
          <h3>{$_('contact.social_title')}</h3>
          <div class="social-links">
            <a href="https://linkedin.com/company/algorhythmics" class="social-link" target="_blank" rel="noopener">
              <span class="social-icon">
                <Icon name="linkedin" size={18} />
              </span>
              {$_('contact.social_linkedin')}
            </a>
            <a href="https://github.com/algorhythmics" class="social-link" target="_blank" rel="noopener">
              <span class="social-icon">
                <Icon name="github" size={18} />
              </span>
              {$_('contact.social_github')}
            </a>
            <a href="https://twitter.com/algorhythmics" class="social-link" target="_blank" rel="noopener">
              <span class="social-icon">
                <Icon name="twitter" size={18} />
              </span>
              {$_('contact.social_twitter')}
            </a>
          </div>
        </MagneticTiltCard>
      </div>
    </div>
  </div>
</section>

<style>
  :global(.hero--contact) {
    --hero-padding-block-start: clamp(6rem, 14vw, 8rem);
    --hero-padding-block-end: clamp(3.5rem, 10vw, 5.5rem);
    --hero-backdrop-inset: clamp(-5rem, -8vw, -2rem) -12% auto;
    --hero-backdrop-height: clamp(18rem, 32vw, 24rem);
    --hero-backdrop-gradient: radial-gradient(circle at 50% 40%, rgba(19, 81, 255, 0.24), transparent 72%);
    --hero-backdrop-opacity: 0.34;
    --hero-backdrop-opacity-light: 0.4;
    --hero-backdrop-opacity-dark: 0.25;
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }

  :global(.contact-hero)::before {
    content: '';
    position: absolute;
    inset: clamp(-5rem, -8vw, -2rem) -12% auto;
    height: clamp(18rem, 32vw, 24rem);
    background: radial-gradient(circle at 50% 40%, var(--hero-glow-primary), transparent 70%);
    filter: blur(140px);
    opacity: 0.7;
    pointer-events: none;
  }

  .contact-hero :global(h1) {
    margin: 0;
    text-align: center;
    font-size: clamp(2.8rem, 6.5vw, 3.9rem);
    letter-spacing: -0.02em;
  }

  .contact-hero__headline {
    position: relative;
    display: inline-flex;
    justify-content: center;
    margin: clamp(1.1rem, 2.6vw, 1.6rem) auto 0;
    padding: clamp(0.55rem, 2vw, 0.9rem) clamp(1.25rem, 3vw, 1.75rem);
    border-radius: clamp(2.4rem, 6vw, 3.4rem);
    max-width: min(100%, var(--measure-lg));
    text-align: center;
    background: linear-gradient(126deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.12));
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 24px 55px rgba(22, 30, 56, 0.28);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .contact-hero__headline :global(.animated-headline) {
    width: 100%;
  }

  .contact-hero :global(p) {
    margin: 0;
    max-width: var(--measure-lg);
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.4rem);
    text-align: center;
  }

  .contact-hero__cta-grid {
    display: grid;
    gap: clamp(1rem, 2.8vw, 1.8rem);
    margin: clamp(1.6rem, 3vw, 2.4rem) auto 0;
    width: min(100%, var(--container-lg));
  }

  .contact-hero__cta {
    display: grid;
    gap: 0.65rem;
    padding: clamp(1.25rem, 3vw, 1.85rem);
    text-align: left;
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.3) 58%, rgba(255, 255, 255, 0.45) 42%);
    background: color-mix(in srgb, var(--surface-glass) 86%, rgba(var(--aurora-purple-rgb), 0.14) 14%);
    box-shadow: 0 20px 48px rgba(12, 22, 48, 0.18);
  }

  .contact-hero__cta-label {
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text-tertiary) 70%, rgba(var(--voyage-blue-rgb), 0.32) 30%);
  }

  .contact-hero__cta-description {
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    color: var(--text-secondary);
  }

  .contact-hero__cta-action {
    font-weight: var(--weight-semibold);
    color: var(--accent-primary);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .contact-hero__cta-action {
    color: var(--text-primary);
  }

  :global([data-base-theme='dark']) .contact-hero__cta-label {
    color: color-mix(in srgb, rgba(214, 224, 255, 0.82) 68%, rgba(var(--signal-yellow-rgb), 0.3) 32%);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .contact-hero__cta-label {
    color: var(--text-primary);
  }

  @media (min-width: 768px) {
    .contact-hero__cta-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  :global([data-base-theme='dark']) .contact-hero__headline {
    background: linear-gradient(126deg, rgba(28, 36, 64, 0.84), rgba(28, 36, 64, 0.58));
    box-shadow: inset 0 0 0 1px rgba(120, 146, 220, 0.36), 0 24px 55px rgba(4, 12, 26, 0.45);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .contact-hero__headline {
    background: linear-gradient(126deg, rgba(0, 0, 0, 0.94), rgba(0, 0, 0, 0.74));
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.9);
  }


  .contact-section {
    padding: clamp(6rem, 14vw, 8rem) 0;
  }

  .contact-grid {
    display: grid;
    gap: clamp(2.4rem, 5vw, 3.5rem);
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: start;
  }

:global(.form-card) form {
  display: grid;
  gap: clamp(1.2rem, 3vw, 1.8rem);
}

  .form-group {
    display: grid;
    gap: 0.5rem;
  }

  .form-group label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: var(--weight-semibold);
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .form-group label.required::after {
    content: ' *';
    color: var(--cherry-pop);
    font-weight: var(--weight-semibold);
  }

.form-group input,
.form-group textarea {
  padding: clamp(1.1rem, 2.4vw, 1.4rem);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(19, 81, 255, 0.16);
  background: var(--bg-surface);
  transition: border-color var(--duration-fast) var(--ease-out);
}

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--voyage-blue);
  }

  .form-group input.error,
  .form-group textarea.error { border-color: var(--cherry-pop); }

  .btn-block { width: 100%; display: inline-flex; justify-content: center; }

:global(.form-card),
:global(.calendar-card),
:global(.info-card),
:global(.social-card) {
  display: grid;
  gap: clamp(1.2rem, 3vw, 1.8rem);
  padding: clamp(2rem, 4vw, 2.6rem);
  border-radius: var(--radius-2xl);
  border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.34) 58%, rgba(255, 255, 255, 0.45) 42%);
  background: color-mix(in srgb, var(--surface-glass) 86%, rgba(var(--aurora-purple-rgb), 0.12) 14%);
  box-shadow: 0 26px 60px rgba(10, 18, 36, 0.2);
  backdrop-filter: blur(24px);
}

  .info-item,
  .social-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .info-icon,
  .social-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--voyage-blue) 14%, transparent 86%);
    color: var(--voyage-blue);
  }

  .social-icon {
    background: color-mix(in srgb, var(--aurora-purple) 18%, transparent 82%);
    color: var(--aurora-purple);
  }

  :global(.button-icon) {
    display: inline-flex;
  }

  .info-value,
  .social-link { color: var(--text-secondary); }

.calendar-button,
.social-link {
  transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
}

.calendar-button {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.4rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(19, 81, 255, 0.22);
  background: var(--bg-surface);
  background: color-mix(in srgb, var(--voyage-blue) 6%, transparent);
  color: var(--text-primary);
  backdrop-filter: blur(18px);
}

  .calendar-button:hover,
  .social-link:hover {
    color: var(--voyage-blue);
    border-color: rgba(19, 81, 255, 0.38);
  }

  @media (max-width: 960px) {
    .contact-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    :global(.hero--contact) {
      --hero-padding-block-start: clamp(5rem, 18vw, 6.5rem);
      --hero-padding-block-end: clamp(3.5rem, 14vw, 5rem);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    :global(.contact-hero__backdrop),
    :global(.contact-hero__backdrop-spotlight) {
      inset: -32% -24% auto;
    }

    :global(.form-card),
    :global(.calendar-card),
    :global(.info-card),
    :global(.social-card) {
      padding: clamp(1.6rem, 8vw, 2rem);
      border-radius: var(--radius-xl);
    }

    .contact-grid {
      gap: clamp(2rem, 8vw, 2.6rem);
    }
  }

  @media (max-width: 480px) {
    :global(.form-card),
    :global(.calendar-card),
    :global(.info-card),
    :global(.social-card) {
      padding: clamp(1.4rem, 10vw, 1.8rem);
    }
  }
</style>


