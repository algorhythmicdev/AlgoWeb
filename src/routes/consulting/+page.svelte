<script>
  import { _ } from 'svelte-i18n';
  import { staggerReveal, tilt, particleExplode, morphBlob, ripple, magnetic } from '$utils/animations';
  import Toast from '$components/Toast.svelte';
  
  let formData = {
    company: '',
    name: '',
    email: '',
    phone: '',
    industry: '',
    description: ''
  };
  
  let errors = {};
  let isSubmitting = false;
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';
  let spotsRemaining = 3;
  
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
  <div class="hero-background">
    <svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
      <path use:morphBlob={{ duration: 8000, scale: 1.3 }} fill="url(#gradient1)" opacity="0.3"/>
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1351FF;stop-opacity:0.2" />
          <stop offset="50%" style="stop-color:#6A38FF;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#FFD339;stop-opacity:0.1" />
        </linearGradient>
      </defs>
    </svg>
  </div>
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">{$_('consulting.hero_title')}</h1>
      <p class="hero-subtitle">{$_('consulting.hero_subtitle')}</p>
      
      <div class="spots-indicator">
        <div class="spots-number">{spotsRemaining}</div>
        <div class="spots-text">{$_('consulting.spots_remaining')}</div>
      </div>
      
      <div class="hero-features" use:staggerReveal>
        <div class="feature">
          <div class="feature-icon">🎯</div>
          <h3>{$_('consulting.what_1')}</h3>
        </div>
        <div class="feature">
          <div class="feature-icon">💡</div>
          <h3>{$_('consulting.what_2')}</h3>
        </div>
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <h3>{$_('consulting.what_3')}</h3>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Application Form -->
<section class="form-section">
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
              placeholder="Acme Corp"
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
              placeholder="John Doe"
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
              placeholder="john@acme.com"
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
              placeholder="+371 12345678"
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
              <option value="">Select industry...</option>
              <option value="technology">Technology</option>
              <option value="fintech">FinTech</option>
              <option value="ecommerce">E-commerce</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
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
              placeholder="Tell us about your AI needs, current challenges, and what you hope to achieve..."
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
        <h3>🎁 What You Get</h3>
        <ul>
          <li>Free AI strategy consultation</li>
          <li>Technical implementation plan</li>
          <li>3 months of advisory support</li>
          <li>Priority access to our products</li>
        </ul>
      </div>
      
      <div class="benefit-card glass-card">
        <h3>⚡ Process Timeline</h3>
        <ul>
          <li><strong>Week 1:</strong> Initial consultation</li>
          <li><strong>Week 2:</strong> Strategy development</li>
          <li><strong>Week 3-12:</strong> Implementation support</li>
        </ul>
      </div>
      
      <div class="benefit-card glass-card">
        <h3>✅ Requirements</h3>
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
  /* Hero Section */
  .consulting-hero {
    position: relative;
    padding: var(--space-20) 0 var(--space-16);
    overflow: hidden;
  }
  
  .hero-background { display: none; }
  
  .hero-content {
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .hero-title {
    font-size: var(--text-hero);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }
  
  .hero-subtitle {
    font-size: var(--text-headline);
    color: var(--text-secondary);
    margin-bottom: var(--space-8);
  }
  
  .spots-indicator {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-6);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 2px solid var(--signal-yellow);
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-12);
  }
  
  .spots-number {
    font-size: 4rem;
    font-weight: var(--weight-black);
    color: var(--signal-yellow);
    line-height: 1;
  }
  
  .spots-text {
    font-size: var(--text-small);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .hero-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-12);
  }
  
  .feature {
    text-align: center;
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: var(--space-3);
  }
  
  .feature h3 {
    font-size: var(--text-title);
    color: var(--text-primary);
  }
  
  /* Form Section */
  .form-section {
    padding: var(--space-16) 0;
  }
  
  .form-wrapper {
    max-width: 800px;
    margin: 0 auto var(--space-12);
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
  }
  
  .form-title {
    font-size: var(--text-display);
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group.full-width {
    grid-column: 1 / -1;
  }
  
  .form-group label {
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-2);
    color: var(--text-primary);
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: var(--space-3) var(--space-4);
    background: var(--bg-elevated);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    font-size: var(--text-body);
    color: var(--text-primary);
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--voyage-blue);
    box-shadow: 0 0 0 4px rgba(19, 81, 255, 0.1);
    transform: translateY(-2px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .form-group input:valid,
  .form-group textarea:valid,
  .form-group select:valid {
    border-color: var(--voyage-blue);
    background: linear-gradient(135deg, rgba(19, 81, 255, 0.05), rgba(255, 211, 57, 0.05));
  }
  
  .form-group input:invalid:not(:placeholder-shown),
  .form-group textarea:invalid:not(:placeholder-shown),
  .form-group select:invalid:not(:placeholder-shown) {
    border-color: var(--cherry-red);
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: var(--cherry-red);
  }
  
  .error-message {
    color: var(--cherry-red);
    font-size: var(--text-small);
    margin-top: var(--space-1);
  }
  
  .form-note {
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--text-small);
    margin-top: var(--space-4);
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
  
  /* Benefits Section */
  .benefits-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-6);
  }
  
  .benefit-card {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
  }
  
  .benefit-card h3 {
    font-size: var(--text-title);
    margin-bottom: var(--space-4);
  }
  
  .benefit-card ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .benefit-card li {
    padding-left: var(--space-6);
    position: relative;
    color: var(--text-secondary);
  }
  
  .benefit-card li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--signal-yellow);
    font-weight: var(--weight-bold);
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
