<script>
  // @ts-nocheck
  import { _, json } from 'svelte-i18n';
  import { Button, Icon, FieldSupport } from '$lib/components';
  import Hero from '$lib/components/Hero.svelte';
  import SectionDivider from '$components/SectionDivider.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import MagneticTiltCard from '$lib/components/MagneticTiltCard.svelte';
  import Toast from '$components/toast.svelte';
  import en from '$lib/i18n/en.json';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const fallbackHeroRotating = Array.isArray(en.consulting?.hero_rotating)
    ? en.consulting.hero_rotating
    : [en.consulting.hero_subtitle];

  const ensureString = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback);

  const siteOrigin = (en.seo?.default_url ?? 'https://algorhythmics.com').replace(/\/$/, '');
  const canonicalUrl = `${siteOrigin}/consulting`;

  const fallbackTestimonial = {
    quote: ensureString(en.consulting?.hero_testimonial_quote, ''),
    name: ensureString(en.consulting?.hero_testimonial_name, ''),
    role: ensureString(en.consulting?.hero_testimonial_role, '')
  };

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

  let testimonial = fallbackTestimonial;
  $: testimonial = {
    quote: ensureString($json?.('consulting.hero_testimonial_quote'), fallbackTestimonial.quote),
    name: ensureString($json?.('consulting.hero_testimonial_name'), fallbackTestimonial.name),
    role: ensureString($json?.('consulting.hero_testimonial_role'), fallbackTestimonial.role)
  };

  const heroFeatureIcons = [
    { icon: 'target', copyKey: 'consulting.what_1', variant: 'halo' },
    { icon: 'idea', copyKey: 'consulting.what_2', variant: 'grid' },
    { icon: 'bolt', copyKey: 'consulting.what_3', variant: 'line' }
  ];
  
  let formData = {
    company: '',
    name: '',
    email: '',
    phone: '',
    industry: '',
    description: ''
  };

  const supportIds = {
    company: 'consulting-company-support',
    name: 'consulting-name-support',
    email: 'consulting-email-support',
    phone: 'consulting-phone-support',
    industry: 'consulting-industry-support',
    description: 'consulting-description-support'
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
  <link rel="canonical" href={canonicalUrl} />
</svelte:head>

{#if showToast}
  <Toast 
    message={toastMessage} 
    type={toastType} 
    onClose={() => showToast = false} 
  />
{/if}

<!-- Hero Section -->
<Hero
  variant="halo"
  title={$_('consulting.hero_title')}
  subtitle={$_('consulting.hero_subtitle')}
>
  <svelte:fragment slot="highlights">
    <div class="consulting-hero__headline surface-pill" data-tone="accent">
      <AnimatedHeadline variant="glow" phrases={heroRotating} holdDuration={2600} />
    </div>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="consulting-hero__meta">
      <div class="spots-indicator surface-pill" aria-live="polite" data-tone="accent">
        <div class="spots-number">{spotsRemaining}</div>
        <span>{$_('consulting.spots_remaining')}</span>
      </div>
      <Button href="#form" variant="gradient">{$_('consulting.form_title')}</Button>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="description">
    {#if testimonial.quote}
      <div class="consulting-hero__testimonial os-window">
        <div class="consulting-hero__testimonial-header">
          <span class="consulting-hero__testimonial-icon" aria-hidden="true">
            <Icon name="sparkles" size={18} />
          </span>
          <span class="consulting-hero__testimonial-label">{$_('consulting.hero_testimonial_label')}</span>
        </div>
        <p class="consulting-hero__quote">{testimonial.quote}</p>
        <p class="consulting-hero__attribution">
          <span>{testimonial.name}</span>
          <span>{testimonial.role}</span>
        </p>
      </div>
    {/if}
  </svelte:fragment>

  {#if heroRotating.length > 1}
    <ul class="consulting-hero__phrases">
      {#each heroRotating.slice(1) as phrase, index}
        <li class="consulting-hero__phrase" aria-label={`Focus area ${index + 1}`}>{phrase}</li>
      {/each}
    </ul>
  {/if}

  <svelte:fragment slot="aside">
    <div class="consulting-hero__features">
      {#each heroFeatureIcons as feature, index}
        <MagneticTiltCard
          class="hero-feature"
          data-variant={feature.variant}
          interactive={false}
          staggerOptions={{ delay: 140 + index * 80 }}
        >
          <div class="hero-feature__icon">
            <Icon name={feature.icon} size={26} />
          </div>
          <p>{$_(feature.copyKey)}</p>
        </MagneticTiltCard>
      {/each}
    </div>
  </svelte:fragment>
</Hero>

<SectionDivider tone="aurora" />

<!-- Application Form -->
<section class="form-section" id="form" use:revealOnScroll>
  <div class="container">
    <MagneticTiltCard class="form-card" interactive={false} staggerOptions={{ delay: 120 }}>
      <h2 class="form-title">{$_('consulting.form_title')}</h2>

      <form on:submit={handleSubmit}>
        <div class="form-grid" use:staggerReveal={{ stagger: 90, selector: '.form-group' }}>
          <div class="form-group" class:error={errors.company}>
            <label for="company" class="required">{$_('consulting.form_company')}</label>
            <input
              type="text"
              id="company"
              class="surface-field"
              bind:value={formData.company}
              placeholder={$_('consulting.form_company_placeholder')}
              class:error={errors.company}
              aria-describedby={supportIds.company}
              aria-invalid={Boolean(errors.company)}
            />
            <FieldSupport
              id={supportIds.company}
              tone={errors.company ? 'error' : 'helper'}
              message={errors.company ?? $_('form.helper_company')}
              announce="assertive"
            />
          </div>

          <div class="form-group" class:error={errors.name}>
            <label for="name" class="required">{$_('consulting.form_name')}</label>
            <input
              type="text"
              id="name"
              class="surface-field"
              bind:value={formData.name}
              placeholder={$_('consulting.form_name_placeholder')}
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
            <label for="email" class="required">{$_('consulting.form_email')}</label>
            <input
              type="email"
              id="email"
              class="surface-field"
              bind:value={formData.email}
              placeholder={$_('consulting.form_email_placeholder')}
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
          
          <div class="form-group" class:error={errors.phone}>
            <label for="phone" class="required">{$_('consulting.form_phone')}</label>
            <input
              type="tel"
              id="phone"
              class="surface-field"
              bind:value={formData.phone}
              placeholder={$_('consulting.form_phone_placeholder')}
              class:error={errors.phone}
              aria-describedby={supportIds.phone}
              aria-invalid={Boolean(errors.phone)}
            />
            <FieldSupport
              id={supportIds.phone}
              tone={errors.phone ? 'error' : 'helper'}
              message={errors.phone ?? $_('form.helper_phone')}
              announce="assertive"
            />
          </div>
          
          <div class="form-group full-width" class:error={errors.industry}>
            <label for="industry" class="required">{$_('consulting.form_industry')}</label>
            <select
              id="industry"
              class="surface-field"
              bind:value={formData.industry}
              class:error={errors.industry}
              aria-describedby={supportIds.industry}
              aria-invalid={Boolean(errors.industry)}
            >
              <option value="">{$_('consulting.select_industry')}</option>
              {#each industryOptions as option}
                <option value={option}>{$_(`consulting.industries.${option}`)}</option>
              {/each}
            </select>
            <FieldSupport
              id={supportIds.industry}
              tone={errors.industry ? 'error' : 'helper'}
              message={errors.industry ?? $_('form.helper_industry')}
              announce="assertive"
            />
          </div>
          
          <div class="form-group full-width" class:error={errors.description}>
            <label for="description" class="required">{$_('consulting.form_description')}</label>
            <textarea
              id="description"
              class="surface-field"
              bind:value={formData.description}
              rows="6"
              placeholder={$_('consulting.form_description_placeholder')}
              class:error={errors.description}
              aria-describedby={supportIds.description}
              aria-invalid={Boolean(errors.description)}
            ></textarea>
            <FieldSupport
              id={supportIds.description}
              tone={errors.description ? 'error' : 'helper'}
              message={errors.description ?? $_('form.helper_description')}
              announce="assertive"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <span class="spinner"></span>
            {$_('common.submitting')}
          {:else}
            {$_('consulting.form_submit')}
          {/if}
        </Button>

        <p class="form-note">{$_('form.required_note')}</p>
      </form>
    </MagneticTiltCard>
    
    <!-- Benefits Section -->
    <div class="benefits-section">
      <MagneticTiltCard class="benefit-card" interactive={false} staggerOptions={{ delay: 80 }}>
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
      </MagneticTiltCard>

      <MagneticTiltCard class="benefit-card" interactive={false} staggerOptions={{ delay: 140 }}>
        <h3>
          <Icon name="bolt" size={22} class="heading-icon" />
          <span>{$_('consulting.timeline_title')}</span>
        </h3>
        <ul>
          <li>{$_('consulting.week_1')}</li>
          <li>{$_('consulting.week_2')}</li>
          <li>{$_('consulting.week_3_12')}</li>
        </ul>
      </MagneticTiltCard>

      <MagneticTiltCard class="benefit-card" interactive={false} staggerOptions={{ delay: 200 }}>
        <h3>
          <Icon name="check" size={22} class="heading-icon" />
          <span>{$_('consulting.requirements_title')}</span>
        </h3>
        <ul>
          <li>{$_('consulting.req_1')}</li>
          <li>{$_('consulting.req_2')}</li>
          <li>{$_('consulting.req_3')}</li>
        </ul>
      </MagneticTiltCard>
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
  --hero-backdrop-gradient: radial-gradient(circle at 40% 40%, rgba(var(--voyage-blue-rgb), 0.26), transparent 72%);
  --hero-backdrop-blur: 140px;
  --hero-backdrop-opacity: 0.3;
  --hero-backdrop-opacity-light: 0.36;
  --hero-backdrop-opacity-dark: 0.22;
  overflow: hidden;
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
}

  .consulting-hero__headline {
    position: relative;
    display: inline-flex;
    justify-content: center;
    margin: clamp(1.1rem, 2.6vw, 1.6rem) auto 0;
    padding: clamp(0.55rem, 2vw, 0.85rem) clamp(1.25rem, 3vw, 1.8rem);
    border-radius: clamp(2.6rem, 6vw, 3.6rem);
    max-width: min(100%, var(--measure-lg));
    text-align: center;
  }

  .consulting-hero__headline :global(.animated-headline) {
    max-width: min(90vw, var(--measure-lg));
  }

.consulting-hero__meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-top: clamp(1.4rem, 3vw, 1.9rem);
}

  .consulting-hero__testimonial {
    margin: clamp(1.4rem, 3vw, 2.1rem) auto 0;
    max-width: min(100%, var(--measure-lg));
    text-align: left;
    gap: clamp(0.75rem, 2.4vw, 1.2rem);
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 82%, rgba(var(--aurora-purple-rgb), 0.24) 18%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.42) 58%, rgba(255, 255, 255, 0.36) 42%);
    --surface-glass-shadow: 0 26px 52px rgba(var(--aurora-purple-rgb), 0.26);
    --grain-opacity: 0.05;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--aurora-purple-rgb), 0.1) 4%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 64%, rgba(var(--aurora-purple-rgb), 0.24) 36%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 58%, rgba(var(--aurora-purple-rgb), 0.28) 42%);
  }

  :global([data-base-theme='dark']) .consulting-hero__testimonial {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-2) 70%, rgba(var(--aurora-purple-rgb), 0.36) 30%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.56) 56%, rgba(255, 255, 255, 0.24) 44%);
    --surface-glass-shadow: 0 32px 60px rgba(var(--aurora-purple-rgb), 0.34);
  }

  .consulting-hero__testimonial-header {
    display: inline-flex;
    align-items: center;
    gap: clamp(0.55rem, 1.6vw, 0.85rem);
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--voyage-blue) 54%, var(--aurora-purple) 46%);
  }

  .consulting-hero__testimonial-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(2rem, 4vw, 2.5rem);
    height: clamp(2rem, 4vw, 2.5rem);
    border-radius: var(--radius-full);
    background: var(--gradient-spectrum-3);
    color: color-mix(in srgb, var(--snow) 92%, rgba(var(--signal-yellow-rgb), 0.08) 8%);
    box-shadow: 0 18px 32px rgba(var(--voyage-blue-rgb), 0.18);
  }

  .consulting-hero__testimonial-icon :global(svg) {
    width: clamp(1rem, 2.6vw, 1.25rem);
    height: clamp(1rem, 2.6vw, 1.25rem);
  }

  .consulting-hero__testimonial-label {
    letter-spacing: inherit;
  }

  .consulting-hero__quote {
    margin: 0;
    font-size: clamp(1.1rem, 2.4vw, 1.45rem);
    color: var(--text-primary);
    line-height: var(--leading-snug);
  }

  .consulting-hero__quote::before,
  .consulting-hero__quote::after {
    color: var(--voyage-blue);
    font-size: 1.35em;
    vertical-align: top;
  }

  .consulting-hero__quote::before {
    content: '“';
    margin-right: 0.35rem;
  }

  .consulting-hero__quote::after {
    content: '”';
    margin-left: 0.35rem;
  }

  .consulting-hero__attribution {
    margin: 0;
    display: grid;
    gap: 0.25rem;
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .consulting-hero__attribution {
    color: var(--text-primary);
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .consulting-hero__testimonial-header {
    color: var(--text-primary);
  }

  :global(html[data-theme='hc']) .consulting-hero__quote {
    color: var(--text);
  }


.spots-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.4rem;
  border-radius: var(--radius-full);
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

:global(.hero-feature) {
  display: grid;
  gap: clamp(0.75rem, 2vw, 1.2rem);
  padding: clamp(1.1rem, 2.6vw, 1.8rem);
  border-radius: var(--radius-xl);
  text-align: left;
}

:global(.hero-feature__icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(2.3rem, 4vw, 2.7rem);
  height: clamp(2.3rem, 4vw, 2.7rem);
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: color-mix(in srgb, var(--snow) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
  box-shadow: 0 18px 32px rgba(var(--voyage-blue-rgb), 0.25);
}

:global(.hero-feature__icon) :global(svg) {
  width: clamp(1.05rem, 2.2vw, 1.3rem);
  height: clamp(1.05rem, 2.2vw, 1.3rem);
}

:global(.hero-feature) p {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: var(--leading-relaxed);
}

.form-section {
  padding: clamp(6rem, 14vw, 8rem) 0;
}

:global(.form-card) {
  width: min(100%, var(--container-md));
  margin: 0 auto clamp(4rem, 8vw, 5rem);
  padding: clamp(2.6rem, 5vw, 3.4rem);
  border-radius: var(--radius-2xl);
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
    color: var(--cherry-pop);
    font-weight: var(--weight-semibold);
  }

  .form-group textarea.surface-field {
    min-height: clamp(8rem, 22vw, 11rem);
    resize: vertical;
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

:global(.benefit-card) {
  padding: clamp(1.9rem, 3vw, 2.4rem);
  border-radius: var(--radius-2xl);
  display: grid;
  gap: clamp(1.2rem, 3vw, 1.7rem);
}

  :global(.benefit-card) h3 {
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

  :global(.benefit-card) ul {
    display: grid;
    gap: 0.35rem;
    padding-left: 1.2rem;
    color: var(--text-secondary);
  }

@media (prefers-reduced-motion: reduce) {
  :global(.consulting-hero__backdrop),
  :global(.consulting-hero__backdrop-drift) {
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


