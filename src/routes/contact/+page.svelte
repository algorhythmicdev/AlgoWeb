<script>
  // @ts-nocheck
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { staggerReveal, tilt, particleExplode, sparkleTrail, ripple, magnetic, morphGradient, typewriter } from '$utils/animations';
  import Toast from '$components/Toast.svelte';
  
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
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => { calendlyLoaded = true; };
    document.head.appendChild(script);
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
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/algorhythmics-dev'
      });
    }
  }
</script>

<svelte:head>
  <title>{$_('contact.hero_title')} - AlgoRhythmics</title>
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
</svelte:head>

{#if showToast}
  <Toast message={toastMessage} type={toastType} onClose={() => showToast = false} />
{/if}

<!-- Hero Section -->
<section class="contact-hero">
  <div class="container">
    <span class="eyebrow">{$_('contact.hero_title')}</span>
    <h1>{$_('contact.hero_subtitle')}</h1>
  </div>
</section>

<!-- Contact Content -->
<section class="contact-section">
  <div class="container">
    <div class="contact-grid">
      <!-- Contact Form -->
      <div class="form-container glass-card" use:tilt={{ max: 3, scale: 1.01 }}>
        <h2 use:sparkleTrail>{$_('contact.form_title')}</h2>
        
        <form on:submit={handleSubmit}>
          <div class="form-group" class:error={errors.name}>
            <label for="name">{$_('contact.form_name')} *</label>
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
            <label for="email">{$_('contact.form_email')} *</label>
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
            <label for="subject">{$_('contact.form_subject')} *</label>
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
            <label for="message">{$_('contact.form_message')} *</label>
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
              Sending...
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
            📅 {$_('contact.calendar_button')}
          </button>
        </div>
        
        <!-- Contact Information -->
        <div class="info-card glass-card" use:staggerReveal>
          <h3>{$_('contact.info_title')}</h3>
          
          <div class="info-item">
            <div class="info-icon">📧</div>
            <div>
              <div class="info-label">{$_('contact.info_email')}</div>
              <a href="mailto:AlgoRhythmics.dev@gmail.com" class="info-value">
                AlgoRhythmics.dev@gmail.com
              </a>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">📍</div>
            <div>
              <div class="info-label">{$_('contact.info_location')}</div>
              <div class="info-value">Daugavpils, Latvia</div>
            </div>
          </div>
        </div>
        
        <!-- Social Links -->
        <div class="social-card glass-card" use:tilt={{ max: 2 }}>
          <h3 use:sparkleTrail>{$_('contact.social_title')}</h3>
          <div class="social-links">
            <a href="https://linkedin.com/company/algorhythmics" class="social-link" target="_blank" rel="noopener" use:particleExplode use:magnetic>
              <span class="social-icon">💼</span>
              LinkedIn
            </a>
            <a href="https://github.com/algorhythmics" class="social-link" target="_blank" rel="noopener" use:particleExplode use:magnetic>
              <span class="social-icon">💻</span>
              GitHub
            </a>
            <a href="https://twitter.com/algorhythmics" class="social-link" target="_blank" rel="noopener" use:particleExplode use:magnetic>
              <span class="social-icon">🐦</span>
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-hero {
    padding: var(--space-16) 0;
    text-align: center;
    background: var(--bg-muted);
  }

  .contact-hero h1 {
    font-size: clamp(2.2rem, 5vw, 3rem);
    margin-top: 0.75rem;
  }

  .contact-section {
    padding: var(--space-16) 0;
  }

  .contact-grid {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: start;
  }

  form {
    display: grid;
    gap: var(--space-3);
  }

  .form-group {
    display: grid;
    gap: 0.5rem;
  }

  .form-group label { font-weight: var(--weight-semibold); }

  .form-group input,
  .form-group textarea {
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
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
    gap: var(--space-3);
  }

  .info-item,
  .social-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .info-icon,
  .social-icon { font-size: 1.2rem; }

  .info-value,
  .social-link { color: var(--text-secondary); }

  .calendar-button,
  .social-link {
    transition: color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
  }

  .calendar-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.8rem 1.2rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }

  .calendar-button:hover,
  .social-link:hover {
    color: var(--voyage-blue);
  }

  @media (max-width: 960px) {
    .contact-grid { grid-template-columns: 1fr; }
  }
</style>
