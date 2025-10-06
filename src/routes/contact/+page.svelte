<script>
  // @ts-nocheck
  import { browser } from '$app/environment';
  import { _, json } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { staggerReveal, tilt, particleExplode, sparkleTrail, ripple, magnetic, morphGradient } from '$utils/animations';
  import Toast from '$components/toast.svelte';
  import en from '$lib/i18n/en.json';

  const fallbackHeroPhrases = Array.isArray(en.contact?.hero_rotating)
    ? en.contact.hero_rotating
    : [en.contact.hero_subtitle];

  /**
   * @param {unknown} value
   * @returns {ReadonlyArray<string>}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? /** @type {string[]} */ (value)
      : fallbackHeroPhrases;

  let heroPhrases = fallbackHeroPhrases;
  let heroPhraseIndex = 0;
  /** @type {ReturnType<typeof setInterval> | null} */
  let heroPhraseTimer = null;
  /** @type {HTMLElement | null} */
  let heroSectionEl = null;
  let hasMounted = false;
  let isHeroVisible = false;
  let prefersReducedMotion = false;
  /** @type {IntersectionObserver | null} */
  let heroObserver = null;
  /** @type {MediaQueryList | null} */
  let motionQuery = null;

  function handleMotionChange(event) {
    prefersReducedMotion = event.matches;
    syncHeroRotation();
  }

  function startHeroRotation() {
    if (!hasMounted || heroPhraseTimer || heroPhrases.length <= 1 || prefersReducedMotion || !isHeroVisible) {
      return;
    }

    heroPhraseTimer = setInterval(() => {
      heroPhraseIndex = (heroPhraseIndex + 1) % heroPhrases.length;
    }, 4200);
  }

  function stopHeroRotation() {
    if (heroPhraseTimer) {
      clearInterval(heroPhraseTimer);
      heroPhraseTimer = null;
    }
  }

  function syncHeroRotation() {
    if (!hasMounted) return;
    if (heroPhrases.length <= 1 || prefersReducedMotion || !isHeroVisible) {
      stopHeroRotation();
    } else {
      startHeroRotation();
    }
  }

  $: heroPhrases = ensureStringArray($json?.('contact.hero_rotating'));
  $: if (heroPhraseIndex >= heroPhrases.length) {
    heroPhraseIndex = 0;
  }
  $: syncHeroRotation();

  onMount(() => {
    hasMounted = true;

    if (typeof window !== 'undefined') {
      if ('IntersectionObserver' in window) {
        heroObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.target === heroSectionEl) {
                isHeroVisible = entry.isIntersecting;
                syncHeroRotation();
              }
            }
          },
          { threshold: 0.35 }
        );

        if (heroSectionEl) {
          heroObserver.observe(heroSectionEl);
        }
      } else {
        isHeroVisible = true;
      }

      motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion = motionQuery.matches;

      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', handleMotionChange);
      } else if (motionQuery.addListener) {
        motionQuery.addListener(handleMotionChange);
      }

      syncHeroRotation();
    }
  });

  onDestroy(() => {
    stopHeroRotation();

    if (heroObserver && heroSectionEl) {
      heroObserver.unobserve(heroSectionEl);
      heroObserver.disconnect();
    }

    if (motionQuery) {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else if (motionQuery.removeListener) {
        motionQuery.removeListener(handleMotionChange);
      }
    }
  });
  
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
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
<HeroWrapper
  class="hero hero--contact"
  bind:element={heroSectionEl}
  showAside={false}
  introReveal={{ delay: 80, stagger: 140 }}
>
  <svelte:fragment slot="backdrop">
    <div class="contact-hero__backdrop" aria-hidden="true">
      <span class="contact-orb contact-orb--primary"></span>
      <span class="contact-orb contact-orb--secondary"></span>
      <span class="contact-node contact-node--one"></span>
      <span class="contact-node contact-node--two"></span>
      <span class="contact-node contact-node--three"></span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="status">
    <span class="eyebrow">{$_('contact.hero_title')}</span>
  </svelte:fragment>

  <svelte:fragment slot="title">
    <h1 class="contact-hero__headline" aria-live="polite" aria-atomic="true">
      <span class="sr-only">{heroPhrases[heroPhraseIndex] ?? $_('contact.hero_subtitle')}</span>
      {#each heroPhrases as phrase, index}
        <span
          class="contact-hero__phrase"
          class:contact-hero__phrase--active={index === heroPhraseIndex}
          aria-hidden={index !== heroPhraseIndex}
        >
          {phrase}
        </span>
      {/each}
    </h1>
  </svelte:fragment>
</HeroWrapper>

<!-- Contact Content -->
<section class="contact-section">
  <div class="container">
    <div class="contact-grid">
      <!-- Contact Form -->
      <div class="form-container glass-card" use:tilt={{ max: 3, scale: 1.01 }}>
        <h2 use:sparkleTrail>{$_('contact.form_title')}</h2>
        
        <form on:submit={handleSubmit}>
          <div class="form-group" class:error={errors.name}>
            <label for="name" class="required">{$_('contact.form_name')}</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              placeholder={$_('contact.form_name_placeholder')}
              class:error={errors.name}
            />
            {#if errors.name}
              <span class="error-message">{errors.name}</span>
            {/if}
          </div>
          
          <div class="form-group" class:error={errors.email}>
            <label for="email" class="required">{$_('contact.form_email')}</label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              placeholder={$_('contact.form_email_placeholder')}
              class:error={errors.email}
            />
            {#if errors.email}
              <span class="error-message">{errors.email}</span>
            {/if}
          </div>
          
          <div class="form-group" class:error={errors.subject}>
            <label for="subject" class="required">{$_('contact.form_subject')}</label>
            <input
              type="text"
              id="subject"
              bind:value={formData.subject}
              placeholder={$_('contact.form_subject_placeholder')}
              class:error={errors.subject}
            />
            {#if errors.subject}
              <span class="error-message">{errors.subject}</span>
            {/if}
          </div>
          
          <div class="form-group" class:error={errors.message}>
            <label for="message" class="required">{$_('contact.form_message')}</label>
            <textarea
              id="message"
              bind:value={formData.message}
              rows="6"
              placeholder={$_('contact.form_message_placeholder')}
              class:error={errors.message}
            ></textarea>
            {#if errors.message}
              <span class="error-message">{errors.message}</span>
            {/if}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-lg btn-block"
            disabled={isSubmitting}
            use:particleExplode
            use:ripple
            use:magnetic
            use:sparkleTrail
          >
            {#if isSubmitting}
              <span class="spinner"></span>
              {$_('contact.form_sending')}
            {:else}
              {$_('contact.form_submit')}
            {/if}
          </button>
        </form>
      </div>
      
      <!-- Contact Info & Calendar -->
      <div class="info-container">
        <!-- Calendar Widget -->
        <div class="calendar-card glass-card" use:tilt={{ max: 3, scale: 1.01 }}>
          <h3 use:sparkleTrail>{$_('contact.calendar_title')}</h3>
          <p>{$_('contact.calendar_subtitle')}</p>
          <button
            class="calendar-button btn btn-secondary btn-lg btn-block"
            on:click={openCalendly}
            disabled={!calendlyLoaded}
            use:particleExplode
            use:ripple
            use:magnetic
            use:sparkleTrail
          >
            <Icon name="calendar" size={20} class="button-icon" />
            <span>{$_('contact.calendar_button')}</span>
          </button>
        </div>
        
        <!-- Contact Information -->
        <div class="info-card glass-card" use:staggerReveal>
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
        </div>
        
        <!-- Social Links -->
        <div class="social-card glass-card" use:tilt={{ max: 2 }}>
          <h3 use:sparkleTrail>{$_('contact.social_title')}</h3>
          <div class="social-links">
            <a href="https://linkedin.com/company/algorhythmics" class="social-link" target="_blank" rel="noopener" use:particleExplode use:magnetic>
              <span class="social-icon">
                <Icon name="linkedin" size={18} />
              </span>
              {$_('contact.social_linkedin')}
            </a>
            <a href="https://github.com/algorhythmics" class="social-link" target="_blank" rel="noopener" use:particleExplode use:magnetic>
              <span class="social-icon">
                <Icon name="github" size={18} />
              </span>
              {$_('contact.social_github')}
            </a>
            <a href="https://twitter.com/algorhythmics" class="social-link" target="_blank" rel="noopener" use:particleExplode use:magnetic>
              <span class="social-icon">
                <Icon name="twitter" size={18} />
              </span>
              {$_('contact.social_twitter')}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  :global(.hero--contact) {
    --hero-padding-block-start: clamp(6rem, 14vw, 8rem);
    --hero-padding-block-end: clamp(3.5rem, 10vw, 5.5rem);
    --hero-shell-columns: minmax(0, 1fr);
    --hero-shell-gap: clamp(2rem, 4vw, 2.6rem);
    --hero-intro-gap: clamp(1.4rem, 3vw, 2.1rem);
    --hero-backdrop-inset: clamp(-5rem, -8vw, -2rem) -12% auto;
    --hero-backdrop-height: clamp(18rem, 32vw, 24rem);
    --hero-backdrop-gradient: radial-gradient(circle at 50% 40%, rgba(19, 81, 255, 0.24), transparent 72%);
    --hero-backdrop-opacity: 0.34;
    --hero-backdrop-opacity-light: 0.4;
    --hero-backdrop-opacity-dark: 0.25;
    text-align: center;
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }

  .contact-hero::before {
    content: '';
    position: absolute;
    inset: clamp(-5rem, -8vw, -2rem) -12% auto;
    height: clamp(18rem, 32vw, 24rem);
    background: radial-gradient(circle at 50% 40%, var(--hero-glow-primary), transparent 70%);
    filter: blur(140px);
    opacity: 0.7;
    pointer-events: none;
  }

  .contact-hero__headline {
    position: relative;
    display: grid;
    place-items: center;
    margin: clamp(1.1rem, 2.8vw, 1.8rem) auto 0;
    min-height: clamp(3.4rem, 6vw, 4.6rem);
    max-width: min(100%, 48ch);
  }

  .contact-hero__phrase {
    grid-area: 1 / 1;
    opacity: 0;
    transform: translateY(24px) scale(0.97);
    filter: blur(12px);
    transition: opacity 380ms var(--ease-out), transform 380ms var(--ease-out), filter 380ms var(--ease-out);
    padding-inline: clamp(0.3rem, 1vw, 0.65rem);
    border-radius: var(--radius-full);
  }

  .contact-hero__phrase--active {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
    animation: contactPhraseIn 820ms var(--ease-spring);
    background: linear-gradient(135deg, var(--hero-phrase-bg-strong), color-mix(in srgb, var(--hero-phrase-bg-soft) 60%, var(--hero-glow-accent) 40%));
    box-shadow: var(--hero-phrase-shadow);
  }

  @keyframes contactPhraseIn {
    0% {
      opacity: 0;
      transform: translateY(32px) scale(0.94);
      filter: blur(16px);
    }
    60% {
      opacity: 1;
      transform: translateY(-6px) scale(1.01);
      filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
    }
  }

  .contact-hero__backdrop {
    position: absolute;
    inset: -20% -10%;
    pointer-events: none;
    filter: blur(0);
    z-index: -1;
  }

  .contact-orb {
    position: absolute;
    width: clamp(240px, 36vw, 320px);
    height: clamp(240px, 36vw, 320px);
    border-radius: 50%;
    opacity: var(--hero-orb-opacity);
    filter: blur(60px);
    transform: translate3d(0, 0, 0);
    animation: contactOrbDrift 24s ease-in-out infinite;
  }

  .contact-orb--primary {
    top: -10%;
    left: -12%;
    background: var(--gradient-spectrum-1);
    animation-duration: 28s;
  }

  .contact-orb--secondary {
    bottom: -18%;
    right: -6%;
    background: var(--gradient-spectrum-3);
    animation-duration: 32s;
    animation-delay: -6s;
  }

  .contact-node {
    position: absolute;
    width: clamp(38px, 6vw, 52px);
    height: clamp(38px, 6vw, 52px);
    border-radius: var(--radius-full);
    background: var(--hero-overlay-highlight);
    box-shadow: 0 18px 42px color-mix(in srgb, var(--hero-glow-primary) 50%, rgba(2, 6, 18, 0.4) 50%);
    mix-blend-mode: var(--hero-overlay-blend);
    opacity: calc(var(--hero-overlay-opacity) * 0.9);
    animation: contactNodeFloat 16s ease-in-out infinite;
  }

  .contact-node--one { top: 28%; left: 12%; background: color-mix(in srgb, var(--hero-glow-primary) 80%, var(--hero-overlay-subtle) 20%); }
  .contact-node--two { top: 52%; right: 20%; background: color-mix(in srgb, var(--hero-glow-accent) 70%, var(--hero-overlay-highlight) 30%); animation-delay: -4s; }
  .contact-node--three { bottom: 18%; left: 32%; background: color-mix(in srgb, var(--hero-glow-secondary) 75%, var(--hero-overlay-subtle) 25%); animation-delay: -2s; }

  @keyframes contactOrbDrift {
    0% {
      transform: translate3d(-4%, -2%, 0) scale(0.96);
    }
    50% {
      transform: translate3d(6%, 4%, 0) scale(1.04);
    }
    100% {
      transform: translate3d(-2%, 2%, 0) scale(0.98);
    }
  }

  @keyframes contactNodeFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(8px, -16px, 0) scale(1.08);
    }
  }

  :global(.hero--contact h1) {
    font-size: clamp(2.2rem, 5vw, 3rem);
    margin-top: 0.75rem;
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

  @media (prefers-reduced-motion: reduce) {
    .contact-orb,
    .contact-node {
      animation: none;
    }
  }

form {
  display: grid;
  gap: clamp(1.2rem, 3vw, 1.8rem);
  padding: clamp(2.4rem, 5vw, 3.2rem);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: var(--bg-surface);
  background: var(--surface-glass);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(24px);
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
    color: var(--cherry-red);
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
  .form-group textarea.error { border-color: var(--cherry-red); }
  .error-message { color: var(--cherry-red); font-size: var(--text-small); }

  .btn-block { width: 100%; display: inline-flex; justify-content: center; }

.calendar-card,
.info-card,
.social-card {
  display: grid;
  gap: clamp(1.2rem, 3vw, 1.8rem);
  padding: clamp(2rem, 4vw, 2.6rem);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: var(--bg-surface);
  background: var(--surface-glass);
  box-shadow: var(--shadow-sm);
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

    .contact-hero__backdrop {
      inset: -32% -24%;
    }

    :global(.hero--contact) h1 {
      font-size: clamp(2rem, 8vw, 2.6rem);
    }

    form,
    .calendar-card,
    .info-card,
    .social-card {
      padding: clamp(1.6rem, 8vw, 2rem);
      border-radius: var(--radius-xl);
    }

    .contact-grid {
      gap: clamp(2rem, 8vw, 2.6rem);
    }
  }

  @media (max-width: 480px) {
    .contact-orb {
      width: clamp(180px, 60vw, 240px);
      height: clamp(180px, 60vw, 240px);
    }

    .contact-node {
      width: clamp(32px, 10vw, 42px);
      height: clamp(32px, 10vw, 42px);
    }

    form,
    .calendar-card,
    .info-card,
    .social-card {
      padding: clamp(1.4rem, 10vw, 1.8rem);
    }
  }
</style>
