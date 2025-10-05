<script>
  // @ts-nocheck
  import { _ } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import { staggerReveal, tilt, particleExplode, morphBlob, ripple, magnetic } from '$utils/animations';
  import Toast from '$components/toast.svelte';
  
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
  <title>{$_('consulting.hero_title')} - AlgoRhythmics</title>
</svelte:head>

{#if showToast}
  <Toast 
    message={toastMessage} 
    type={toastType} 
    onClose={() => showToast = false} 
  />
{/if}

<!-- Hero Section -->
<section class="consulting-hero">
  <div class="consulting-hero__halo" aria-hidden="true">
    <span class="consulting-blob consulting-blob--one"></span>
    <span class="consulting-blob consulting-blob--two"></span>
    <span class="consulting-constellation consulting-constellation--one"></span>
  </div>
  <div class="container hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">{$_('consulting.hero_title')}</span>
      <h1>{$_('consulting.hero_subtitle')}</h1>

      <div class="spots-indicator">
        <div class="spots-number">{spotsRemaining}</div>
        <span>{$_('consulting.spots_remaining')}</span>
      </div>

      <div class="hero-features" use:staggerReveal>
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
    </div>

    <div class="hero-cta">
      <p>{$_('consulting.what_title')}</p>
      <a href="#form" class="btn btn-primary">{$_('consulting.form_title')}</a>
    </div>
  </div>
</section>

<!-- Application Form -->
<section class="form-section" id="form">
  <div class="container">
    <div class="form-wrapper glass-card" use:tilt={{ max: 2 }}>
      <h2 class="form-title">{$_('consulting.form_title')}</h2>
      
      <form on:submit={handleSubmit}>
        <div class="form-grid">
          <div class="form-group" class:error={errors.company}>
            <label for="company">{$_('consulting.form_company')} *</label>
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
            <label for="name">{$_('consulting.form_name')} *</label>
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
            <label for="email">{$_('consulting.form_email')} *</label>
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
            <label for="phone">{$_('consulting.form_phone')} *</label>
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
            <label for="industry">{$_('consulting.form_industry')} *</label>
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
            <label for="description">{$_('consulting.form_description')} *</label>
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
        
        <p class="form-note">* Required fields</p>
      </form>
    </div>
    
    <!-- Benefits Section -->
    <div class="benefits-section" use:staggerReveal>
      <div class="benefit-card glass-card">
        <h3>
          <Icon name="package" size={22} class="heading-icon" />
          <span>What You Get</span>
        </h3>
        <ul>
          <li>Free AI strategy consultation</li>
          <li>Technical implementation plan</li>
          <li>3 months of advisory support</li>
          <li>Priority access to our products</li>
        </ul>
      </div>

      <div class="benefit-card glass-card">
        <h3>
          <Icon name="bolt" size={22} class="heading-icon" />
          <span>Process Timeline</span>
        </h3>
        <ul>
          <li><strong>Week 1:</strong> Initial consultation</li>
          <li><strong>Week 2:</strong> Strategy development</li>
          <li><strong>Week 3-12:</strong> Implementation support</li>
        </ul>
      </div>

      <div class="benefit-card glass-card">
        <h3>
          <Icon name="check" size={22} class="heading-icon" />
          <span>Requirements</span>
        </h3>
        <ul>
          <li>Based in Europe or willing to work CET hours</li>
          <li>Committed to AI transformation</li>
          <li>Open to collaboration and feedback</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
.consulting-hero {
  padding: clamp(6rem, 14vw, 8.5rem) 0;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
}

.consulting-hero::before {
  content: '';
  position: absolute;
  inset: clamp(-5rem, -8vw, -2rem) -15% auto;
  height: clamp(20rem, 36vw, 26rem);
  background: radial-gradient(circle at 40% 40%, rgba(19, 81, 255, 0.2), transparent 70%);
  filter: blur(140px);
  opacity: 0.7;
  pointer-events: none;
}

.consulting-hero__halo {
  position: absolute;
  inset: -15% -10% auto;
  height: clamp(24rem, 40vw, 30rem);
  pointer-events: none;
  overflow: hidden;
}

.consulting-blob {
  position: absolute;
  width: clamp(200px, 32vw, 320px);
  height: clamp(200px, 32vw, 320px);
  background: var(--gradient-spectrum-1);
  opacity: 0.35;
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
    radial-gradient(circle at 12% 20%, rgba(255, 255, 255, 0.35) 0%, transparent 42%),
    radial-gradient(circle at 82% 32%, rgba(255, 211, 57, 0.3) 0%, transparent 48%),
    linear-gradient(120deg, rgba(19, 81, 255, 0.1), rgba(106, 56, 255, 0));
  opacity: 0.75;
  mix-blend-mode: screen;
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

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: clamp(2.6rem, 5vw, 3.8rem);
  align-items: center;
}

.hero-copy {
  display: grid;
  gap: clamp(1.6rem, 3vw, 2.2rem);
}

  .hero-copy h1 {
    font-size: clamp(2.2rem, 5vw, 3rem);
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
  width: fit-content;
}

  .spots-number {
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
    line-height: 1;
  }

.hero-features {
  display: flex;
  flex-wrap: wrap;
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

.hero-cta {
  background: var(--bg-surface);
  background: var(--surface-glass);
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: var(--radius-2xl);
  padding: clamp(2.4rem, 5vw, 3.1rem);
  display: grid;
  gap: clamp(1.4rem, 3vw, 2rem);
  justify-items: start;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(24px);
}

  .hero-cta p {
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

:global([data-theme='dark']) .consulting-hero__halo .consulting-blob {
  opacity: 0.45;
}

:global([data-theme='dark']) .consulting-hero__halo .consulting-constellation {
  opacity: 0.82;
}

@media (prefers-reduced-motion: reduce) {
  .consulting-blob,
  .consulting-constellation {
    animation: none;
  }
}

  @media (max-width: 960px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .hero-cta {
      justify-items: stretch;
    }
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
