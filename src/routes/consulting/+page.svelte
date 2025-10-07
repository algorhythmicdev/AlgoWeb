<script>
  // @ts-nocheck
  import { _, json } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import { staggerReveal, tilt, particleExplode, morphBlob, ripple, magnetic } from '$utils/animations';
  import Toast from '$components/toast.svelte';
  import en from '$lib/i18n/en.json';

  const fallbackHeroRotating = Array.isArray(en.consulting?.hero_rotating)
    ? en.consulting.hero_rotating
    : [en.consulting.hero_subtitle];

  /**
   * @param {unknown} value
   * @returns {ReadonlyArray<string>}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? /** @type {string[]} */ (value)
      : fallbackHeroRotating;

  let heroRotating = fallbackHeroRotating;
  $: heroRotating = ensureStringArray($json?.('consulting.hero_rotating'));
  
  let formData = {
    company: '',
    name: '',
    email: '',
    phone: '',
    industry: '',
    description: ''
  };
  
  /** @type {Record<string, string>} */
  let errors = {};
  let isSubmitting = false;
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';
  let spotsRemaining = 3;
  const industryOptions = ['technology', 'fintech', 'ecommerce', 'healthcare', 'education', 'manufacturing', 'other'];
  
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function validatePhone(phone) {
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
  }
  
  function validateForm() {
    const newErrors = {};
    
    if (!formData.company.trim()) newErrors.company = $_('form.error_required');
    if (!formData.name.trim()) newErrors.name = $_('form.error_required');
    if (!formData.email.trim()) {
      newErrors.email = $_('form.error_required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = $_('form.error_email');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = $_('form.error_required');
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = $_('form.error_phone');
    }
    if (!formData.industry.trim()) newErrors.industry = $_('form.error_required');
    if (!formData.description.trim()) newErrors.description = $_('form.error_required');
    
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
      // Using Web3Forms (free service)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'YOUR_WEB3FORMS_KEY', // Get free at web3forms.com
          subject: `Consulting Pilot Application: ${formData.company}`,
          from_name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          industry: formData.industry,
          description: formData.description,
          to_email: 'AlgoRhythmics.dev@gmail.com'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toastMessage = $_('consulting.form_success');
        toastType = 'success';
        showToast = true;
        
        // Reset form
        formData = {
          company: '',
          name: '',
          email: '',
          phone: '',
          industry: '',
          description: ''
        };
        errors = {};
        
        // Decrease spots (in production, this would come from backend)
        spotsRemaining = Math.max(0, spotsRemaining - 1);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toastMessage = $_('consulting.form_error');
      toastType = 'error';
      showToast = true;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>{$_('consulting.meta_title')}</title>
</svelte:head>

{#if showToast}
  <Toast 
    message={toastMessage} 
    type={toastType} 
    onClose={() => showToast = false} 
  />
{/if}

<!-- Hero Section -->
<HeroWrapper
  class="hero hero--consulting hero--centered consulting-hero"
  showAside={false}
  introReveal={{ delay: 60, stagger: 130 }}
>
  <svelte:fragment slot="backdrop">
    <div class="consulting-hero__halo" aria-hidden="true">
      <span class="consulting-blob consulting-blob--one"></span>
      <span class="consulting-blob consulting-blob--two"></span>
      <span class="consulting-constellation consulting-constellation--one"></span>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="title">
    <h1 class="consulting-hero__title">{$_('consulting.hero_title')}</h1>
  </svelte:fragment>

    <svelte:fragment slot="lead">
    <div class="consulting-hero__headline">
      <AnimatedHeadline variant="glow" phrases={heroRotating} holdDuration={2600} />
    </div>
  </svelte:fragment>

    <svelte:fragment slot="description">
    <p class="consulting-hero__description">{$_('consulting.hero_subtitle')}</p>

<div class="consulting-hero__meta">
      <div class="spots-indicator">
        <div class="spots-number">{spotsRemaining}</div>
        <span>{$_('consulting.spots_remaining')}</span>
      </div>
      <a href="#form" class="btn btn-gradient">{$_('consulting.form_title')}</a>
    </div>
  </svelte:fragment>

    <svelte:fragment slot="highlights">
      {#if heroRotating.length > 1}
        <ul class="consulting-hero__phrases">
          {#each heroRotating.slice(1) as phrase, index}
            <li class="consulting-hero__phrase" aria-label={`Focus area ${index + 1}`}>{phrase}</li>
          {/each}
        </ul>
      {/if}
    </svelte:fragment>

  <div class="consulting-hero__features" use:staggerReveal>
    <div class="feature">
      <div class="feature-icon">
        <Icon name="target" size={26} />
      </div>
      <p>{$_('consulting.what_1')}</p>
    </div>
    <div class="feature">
      <div class="feature-icon">
        <Icon name="idea" size={26} />
      </div>
      <p>{$_('consulting.what_2')}</p>
    </div>
    <div class="feature">
      <div class="feature-icon">
        <Icon name="bolt" size={26} />
      </div>
      <p>{$_('consulting.what_3')}</p>
    </div>
  </div>
</HeroWrapper>

<!-- Application Form -->
<section class="form-section" id="form">
  <div class="container">
    <div class="form-wrapper os-window" use:tilt={{ max: 2 }}>
      <h2 class="form-title">{$_('consulting.form_title')}</h2>
      
      <form on:submit={handleSubmit}>
        <div class="form-grid">
          <div class="form-group" class:error={errors.company}>
            <label for="company" class="required">{$_('consulting.form_company')}</label>
            <input
              type="text"
              id="company"
              bind:value={formData.company}
              placeholder={$_('consulting.form_company_placeholder')}
              class:error={errors.company}
            />
            {#if errors.company}
              <span class="error-message">{errors.company}</span>
            {/if}
          </div>
          
          <div class="form-group" class:error={errors.name}>
            <label for="name" class="required">{$_('consulting.form_name')}</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              placeholder={$_('consulting.form_name_placeholder')}
              class:error={errors.name}
            />
            {#if errors.name}
              <span class="error-message">{errors.name}</span>
            {/if}
          </div>
          
          <div class="form-group" class:error={errors.email}>
            <label for="email" class="required">{$_('consulting.form_email')}</label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              placeholder={$_('consulting.form_email_placeholder')}
              class:error={errors.email}
            />
            {#if errors.email}
              <span class="error-message">{errors.email}</span>
            {/if}
          </div>
          
          <div class="form-group" class:error={errors.phone}>
            <label for="phone" class="required">{$_('consulting.form_phone')}</label>
            <input
              type="tel"
              id="phone"
              bind:value={formData.phone}
              placeholder={$_('consulting.form_phone_placeholder')}
              class:error={errors.phone}
            />
            {#if errors.phone}
              <span class="error-message">{errors.phone}</span>
            {/if}
          </div>
          
          <div class="form-group full-width" class:error={errors.industry}>
            <label for="industry" class="required">{$_('consulting.form_industry')}</label>
            <select
              id="industry"
              bind:value={formData.industry}
              class:error={errors.industry}
            >
              <option value="">{$_('consulting.select_industry')}</option>
              {#each industryOptions as option}
                <option value={option}>{$_(`consulting.industries.${option}`)}</option>
              {/each}
            </select>
            {#if errors.industry}
              <span class="error-message">{errors.industry}</span>
            {/if}
          </div>
          
          <div class="form-group full-width" class:error={errors.description}>
            <label for="description" class="required">{$_('consulting.form_description')}</label>
            <textarea
              id="description"
              bind:value={formData.description}
              rows="6"
              placeholder={$_('consulting.form_description_placeholder')}
              class:error={errors.description}
            ></textarea>
            {#if errors.description}
              <span class="error-message">{errors.description}</span>
            {/if}
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary btn-lg btn-block"
          disabled={isSubmitting}
          use:particleExplode
          use:ripple
          use:magnetic
        >
          {#if isSubmitting}
            <span class="spinner"></span>
            {$_('common.submitting')}
          {:else}
            {$_('consulting.form_submit')}
          {/if}
        </button>
        
        <p class="form-note">{$_('form.required_note')}</p>
      </form>
    </div>
    
    <!-- Benefits Section -->
    <div class="benefits-section" use:staggerReveal>
      <div class="benefit-card os-window">
        <h3>
          <Icon name="package" size={22} class="heading-icon" />
          <span>{$_('consulting.benefits_title')}</span>
        </h3>
        <ul>
          <li>{$_('consulting.benefit_1')}</li>
          <li>{$_('consulting.benefit_2')}</li>
          <li>{$_('consulting.benefit_3')}</li>
          <li>{$_('consulting.benefit_4')}</li>
        </ul>
      </div>

      <div class="benefit-card os-window">
        <h3>
          <Icon name="bolt" size={22} class="heading-icon" />
          <span>{$_('consulting.timeline_title')}</span>
        </h3>
        <ul>
          <li>{$_('consulting.week_1')}</li>
          <li>{$_('consulting.week_2')}</li>
          <li>{$_('consulting.week_3_12')}</li>
        </ul>
      </div>

      <div class="benefit-card os-window">
        <h3>
          <Icon name="check" size={22} class="heading-icon" />
          <span>{$_('consulting.requirements_title')}</span>
        </h3>
        <ul>
          <li>{$_('consulting.req_1')}</li>
          <li>{$_('consulting.req_2')}</li>
          <li>{$_('consulting.req_3')}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
:global(.hero--consulting) {
  --hero-padding-block-start: clamp(6rem, 14vw, 8.5rem);
  --hero-padding-block-end: clamp(4rem, 12vw, 6.5rem);
  --hero-shell-columns: minmax(0, 1fr);
  --hero-shell-gap: clamp(2.2rem, 4.5vw, 3.4rem);
  --hero-intro-gap: clamp(1.5rem, 3vw, 2.2rem);
  --hero-backdrop-inset: clamp(-5rem, -8vw, -2rem) -15% auto;
  --hero-backdrop-height: clamp(20rem, 36vw, 26rem);
  --hero-backdrop-gradient: radial-gradient(circle at 40% 40%, rgba(19, 81, 255, 0.26), transparent 72%);
  --hero-backdrop-blur: 140px;
  --hero-backdrop-opacity: 0.3;
  --hero-backdrop-opacity-light: 0.36;
  --hero-backdrop-opacity-dark: 0.22;
  overflow: hidden;
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
}

:global(.consulting-hero)::before {
  content: '';
  position: absolute;
  inset: clamp(-5rem, -8vw, -2rem) -15% auto;
  height: clamp(20rem, 36vw, 26rem);
  background: radial-gradient(circle at 40% 40%, var(--hero-glow-primary), transparent 70%);
  filter: blur(140px);
  opacity: 0.7;
  pointer-events: none;
}

.consulting-hero__title {
  margin: 0;
  text-align: center;
  font-size: clamp(2.35rem, 6.2vw, 3.4rem);
  letter-spacing: -0.02em;
  color: var(--heading-color);
}

.consulting-hero__headline {
  position: relative;
  display: inline-flex;
  justify-content: center;
  margin: clamp(1.1rem, 2.6vw, 1.6rem) auto 0;
  padding: clamp(0.55rem, 2vw, 0.85rem) clamp(1.25rem, 3vw, 1.8rem);
  border-radius: clamp(2.6rem, 6vw, 3.6rem);
  max-width: min(54ch, 100%);
  text-align: center;
  background: linear-gradient(126deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28), 0 22px 52px rgba(16, 28, 48, 0.26);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.consulting-hero__headline :global(.animated-headline) {
  max-width: min(50ch, 90vw);
}

.consulting-hero__description {
  margin: 0;
  max-width: 60ch;
  color: var(--text-secondary);
  font-size: clamp(1.05rem, 2.5vw, 1.4rem);
  text-align: center;
}

.consulting-hero__meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-top: clamp(1.4rem, 3vw, 1.9rem);
}

:global([data-base-theme='dark']) .consulting-hero__headline {
  background: linear-gradient(126deg, rgba(26, 32, 54, 0.82), rgba(26, 32, 54, 0.56));
  box-shadow: inset 0 0 0 1px rgba(120, 146, 220, 0.32), 0 24px 55px rgba(4, 12, 26, 0.42);
}

:global([data-theme='contrast']) .consulting-hero__headline {
  background: linear-gradient(126deg, rgba(0, 0, 0, 0.94), rgba(0, 0, 0, 0.72));
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.9);
}

.consulting-hero__halo {
  position: absolute;
  inset: -15% -10% auto;
  height: clamp(24rem, 40vw, 30rem);
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
}

.consulting-blob {
  position: absolute;
  width: clamp(200px, 32vw, 320px);
  height: clamp(200px, 32vw, 320px);
  background: var(--gradient-spectrum-1);
  opacity: var(--hero-orb-opacity);
  filter: blur(60px);
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  animation: consultingMorph 26s ease-in-out infinite;
}

.consulting-blob--one {
  top: -18%;
  left: -12%;
}

.consulting-blob--two {
  right: -10%;
  bottom: -24%;
  background: var(--gradient-spectrum-4);
  animation-delay: -12s;
}

.consulting-constellation {
  position: absolute;
  inset: 12% 18%;
  border-radius: var(--radius-2xl);
  background:
    radial-gradient(circle at 12% 20%, var(--hero-overlay-highlight) 0%, transparent 42%),
    radial-gradient(circle at 82% 32%, color-mix(in srgb, var(--hero-glow-accent) 70%, transparent 30%) 0%, transparent 48%),
    linear-gradient(120deg, color-mix(in srgb, var(--hero-glow-primary) 60%, transparent 40%), transparent);
  opacity: var(--hero-overlay-opacity);
  mix-blend-mode: var(--hero-overlay-blend);
  mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.9), transparent 70%);
  animation: consultingSweep 18s ease-in-out infinite;
}

.consulting-constellation--one {
  animation-delay: -6s;
}

@keyframes consultingMorph {
  0% {
    transform: translate3d(-4%, 2%, 0) scale(0.92) rotate(0deg);
  }
  50% {
    transform: translate3d(6%, -4%, 0) scale(1.05) rotate(6deg);
  }
  100% {
    transform: translate3d(-2%, 4%, 0) scale(0.94) rotate(-3deg);
  }
}

@keyframes consultingSweep {
  0%, 100% {
    opacity: 0.62;
    transform: scale(0.96) translate3d(-4%, -2%, 0);
  }
  40% {
    opacity: 0.88;
    transform: scale(1.06) translate3d(3%, 4%, 0);
  }
  70% {
    opacity: 0.74;
    transform: scale(1) translate3d(-2%, 2%, 0);
  }
}

.spots-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.4rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(19, 81, 255, 0.22);
  background: var(--bg-surface);
  background: color-mix(in srgb, var(--voyage-blue) 6%, transparent);
  backdrop-filter: blur(18px);
}

.spots-indicator span {
  font-size: var(--text-small);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.spots-number {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: var(--weight-semibold);
  color: var(--voyage-blue);
  line-height: 1;
}

.consulting-hero__features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(1.4rem, 3vw, 2rem);
  margin-top: clamp(1.8rem, 4vw, 2.4rem);
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.95rem 1.35rem;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: var(--bg-surface);
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--voyage-blue) 16%, transparent 84%);
  color: var(--voyage-blue);
}

.feature p {
  margin: 0;
  color: var(--text-secondary);
}

.form-section {
  padding: clamp(6rem, 14vw, 8rem) 0;
}

.form-wrapper {
  max-width: 760px;
  margin: 0 auto clamp(4rem, 8vw, 5rem);
  padding: clamp(2.6rem, 5vw, 3.4rem);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: var(--bg-surface);
  background: var(--surface-glass);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(24px);
}

.form-title {
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.6rem, 3vw, 2.2rem);
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-group.full-width {
    grid-column: 1 / -1;
  }

  .form-group label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: var(--weight-semibold);
    font-size: var(--text-small);
    margin-bottom: 0.1rem;
    color: var(--text-secondary);
  }

  .form-group label.required::after {
    content: ' *';
    color: var(--cherry-red);
    font-weight: var(--weight-semibold);
  }

.form-group input,
.form-group select,
.form-group textarea {
  padding: clamp(1rem, 2.4vw, 1.35rem);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(19, 81, 255, 0.16);
  background: var(--bg-surface);
  transition: border-color var(--duration-fast) var(--ease-out);
}

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--voyage-blue);
  }

  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: var(--cherry-red);
  }

  .error-message {
    color: var(--cherry-red);
    font-size: var(--text-small);
  }

  .btn-block {
    width: 100%;
    display: inline-flex;
    justify-content: center;
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

.benefits-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(1.8rem, 4vw, 2.4rem);
}

.benefit-card {
  padding: clamp(1.9rem, 3vw, 2.3rem);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: var(--bg-surface);
  background: var(--surface-glass);
  display: grid;
  gap: clamp(1.2rem, 3vw, 1.6rem);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(22px);
}

  .benefit-card h3 {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: clamp(1.2rem, 2.4vw, 1.6rem);
    color: var(--text-primary);
  }

:global(.heading-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--aurora-purple) 18%, transparent 82%);
  color: var(--aurora-purple);
}

  .benefit-card ul {
    display: grid;
    gap: 0.35rem;
    padding-left: 1.2rem;
    color: var(--text-secondary);
  }

@media (prefers-reduced-motion: reduce) {
  .consulting-blob,
  .consulting-constellation {
    animation: none;
  }
}

  @media (max-width: 960px) {
    :global(.hero--consulting) {
      --hero-shell-columns: minmax(0, 1fr);
      --hero-shell-gap: clamp(2rem, 6vw, 2.8rem);
    }
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>


