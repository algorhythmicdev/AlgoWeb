<script>
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toastMessage = 'Please fix the errors in the form';
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
  <div class="hero-background" use:morphGradient={{ colors: ['#1351FF', '#6A38FF', '#FFD339'], speed: 4000 }}></div>
  <div class="container">
    <h1 class="hero-title" use:typewriter={{ text: $_('contact.hero_title'), speed: 100, loop: false }}>{$_('contact.hero_title')}</h1>
    <p class="hero-subtitle">{$_('contact.hero_subtitle')}</p>
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
              placeholder="John Doe"
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
              placeholder="john@example.com"
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
              placeholder="Partnership opportunity"
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
              placeholder="Your message..."
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
            class="btn btn-secondary btn-lg btn-block"
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
    position: relative;
    padding: var(--space-20) 0 var(--space-8);
    text-align: center;
    overflow: hidden;
  }
  
  .hero-background { display: none; }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  .hero-title {
    font-size: var(--text-hero);
    background: linear-gradient(135deg, var(--aurora-purple), var(--voyage-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-4);
  }
  
  .hero-subtitle {
    font-size: var(--text-headline);
    color: var(--text-secondary);
  }
  
  .contact-section {
    padding: var(--space-16) 0;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--space-8);
  }
  
  .form-container,
  .calendar-card,
  .info-card,
  .social-card {
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
  }
  
  .form-container h2,
  .calendar-card h3,
  .info-card h3,
  .social-card h3 {
    margin-bottom: var(--space-6);
  }
  
  .form-group {
    margin-bottom: var(--space-6);
  }
  
  .form-group label {
    display: block;
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-2);
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: var(--bg-elevated);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    font-size: var(--text-body);
    color: var(--text-primary);
    font-family: inherit;
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--aurora-purple);
    box-shadow: 0 0 0 4px rgba(106, 56, 255, 0.1);
    transform: translateY(-2px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .form-group input:valid,
  .form-group textarea:valid {
    border-color: var(--voyage-blue);
    background: linear-gradient(135deg, rgba(19, 81, 255, 0.05), rgba(106, 56, 255, 0.05));
  }
  
  .form-group input:invalid:not(:placeholder-shown),
  .form-group textarea:invalid:not(:placeholder-shown) {
    border-color: var(--cherry-red);
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .form-group input.error,
  .form-group textarea.error {
    border-color: var(--cherry-red);
  }
  
  .error-message {
    display: block;
    color: var(--cherry-red);
    font-size: var(--text-small);
    margin-top: var(--space-1);
  }
  
  .btn-block {
    width: 100%;
  }
  
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: var(--space-2);
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .info-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }
  
  .calendar-card p {
    color: var(--text-secondary);
    margin-bottom: var(--space-4);
  }
  
  .info-item {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  .info-icon {
    font-size: 2rem;
  }
  
  .info-label {
    font-size: var(--text-small);
    color: var(--text-secondary);
    margin-bottom: var(--space-1);
  }
  
  .info-value {
    color: var(--text-primary);
    font-weight: var(--weight-medium);
  }
  
  .social-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .social-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--bg-elevated);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    font-weight: var(--weight-medium);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .social-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }
  
  .social-link:hover::before {
    left: 100%;
  }
  
  .social-link:hover {
    transform: translateX(8px) scale(1.02);
    background: linear-gradient(135deg, var(--aurora-purple), var(--voyage-blue));
    color: white;
    box-shadow: 0 8px 25px rgba(106, 56, 255, 0.3);
  }
  
  .social-icon {
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
