<script lang="ts">
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';

  let intent = 'consulting';
  let name = '';
  let email = '';
  let company = '';
  let message = '';
  let resultMsg = '';
  let errors: Record<string, string> = {};

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const intentInfo: Record<string, { icon: string; description: string }> = {
    consulting: { 
      icon: 'briefcase', 
      description: 'Get expert AI consulting for your business needs'
    },
    ideonautix: { 
      icon: 'lightbulb', 
      description: 'Learn about our startup education and productivity toolkit'
    },
    nodevoyage: { 
      icon: 'map', 
      description: 'Discover AI-powered travel planning with Nodi'
    },
    education: { 
      icon: 'graduation-cap', 
      description: 'Explore our AI programs for schools and universities'
    },
    other: { 
      icon: 'message-circle', 
      description: 'Share your ideas or questions with us'
    }
  };

  function validate() {
    errors = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!emailRe.test(email)) errors.email = 'Enter a valid email.';
    if (message.trim().length < 10) errors.message = 'Give us a few details (at least 10 characters).';
    return Object.keys(errors).length === 0;
  }

  function submit(e: Event) {
    e.preventDefault();
    if (!validate()) return;

    const subject = `Website: ${intent} — ${name}`;
    const body = `${message}\n\n---\nFrom: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}`;
    location.href = `mailto:algorhythmics.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    resultMsg = 'Thanks! Your email app should open momentarily.';
  }

  $: currentIntentInfo = intentInfo[intent];
</script>

<svelte:head>
  <title>Contact — Algorhythmics</title>
  <meta name="description" content="Get in touch about consulting, Ideonautix, NodeVoyage, or education." />
</svelte:head>

<main id="main">
  <HeroEpic
    title="Let's Talk"
    subtitle="Get in Touch"
    description="Tell us what you want to achieve. We'll reply with a simple plan."
    variant="neural"
    particleType="minimal"
    size="large"
    animatedTitle={true}
  />

  <AnimatedDivider variant="gradient" theme="neural" spacing="spacious" />

  <section class="section contact-section">
    <div class="container">
      <div class="contact-grid">
        <!-- Contact Information -->
        <div class="contact-info">
          <RevealOnScroll animation="fade-up" delay={100}>
            <CardHalo halo="cyber" glass>
              <div class="info-card">
                <h2 class="info-title">Get in Touch</h2>
                <p class="info-description">We're here to help bring your ideas to life with AI-powered solutions.</p>
                
                <div class="contact-methods">
                  <div class="method-item">
                    <div class="method-icon">
                      <Icon name="mail" />
                    </div>
                    <div>
                      <h3>Email Us</h3>
                      <p>algorhythmics.dev@gmail.com</p>
                    </div>
                  </div>
                  
                  <div class="method-item">
                    <div class="method-icon">
                      <Icon name="map-pin" />
                    </div>
                    <div>
                      <h3>Location</h3>
                      <p>Daugavpils, Latvia</p>
                    </div>
                  </div>
                  
                  <div class="method-item">
                    <div class="method-icon">
                      <Icon name="clock" />
                    </div>
                    <div>
                      <h3>Response Time</h3>
                      <p>Within 24-48 hours</p>
                    </div>
                  </div>
                </div>

                <div class="info-highlight">
                  <Icon name="sparkles" />
                  <p>We support projects in EN, LV, and RU languages</p>
                </div>
              </div>
            </CardHalo>
          </RevealOnScroll>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-wrapper">
          {#if resultMsg}
            <RevealOnScroll animation="scale">
              <div class="success-message" role="status" aria-live="polite">
                <Icon name="check-circle" />
                <p>{resultMsg}</p>
              </div>
            </RevealOnScroll>
          {/if}

          <RevealOnScroll animation="fade-up" delay={200}>
            <CardHalo halo="neural" glass>
              <form on:submit|preventDefault={submit} novalidate class="contact-form">
                <h2 class="form-title">Send us a message</h2>
                
                <div class="form-group">
                  <label for="intent" class="form-label">
                    <Icon name="target" />
                    What are you interested in?
                  </label>
                  <select id="intent" bind:value={intent} class="form-select">
                    <option value="consulting">AI Consulting</option>
                    <option value="ideonautix">Ideonautix Platform</option>
                    <option value="nodevoyage">NodeVoyage Platform</option>
                    <option value="education">Education Programs</option>
                    <option value="other">General Inquiry</option>
                  </select>
                  <div class="intent-info">
                    <Icon name={currentIntentInfo.icon} />
                    <span>{currentIntentInfo.description}</span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="name" class="form-label">
                      <Icon name="user" />
                      Your Name *
                    </label>
                    <input 
                      id="name" 
                      bind:value={name} 
                      aria-invalid={!!errors.name}
                      class="form-input"
                      placeholder="John Doe"
                    />
                    {#if errors.name}
                      <div role="status" class="form-error">
                        <Icon name="alert-circle" />
                        {errors.name}
                      </div>
                    {/if}
                  </div>

                  <div class="form-group">
                    <label for="email" class="form-label">
                      <Icon name="mail" />
                      Email Address *
                    </label>
                    <input 
                      id="email" 
                      type="email" 
                      bind:value={email} 
                      aria-invalid={!!errors.email}
                      class="form-input"
                      placeholder="john@example.com"
                    />
                    {#if errors.email}
                      <div role="status" class="form-error">
                        <Icon name="alert-circle" />
                        {errors.email}
                      </div>
                    {/if}
                  </div>
                </div>

                <div class="form-group">
                  <label for="company" class="form-label">
                    <Icon name="building" />
                    Company / Organization (Optional)
                  </label>
                  <input 
                    id="company" 
                    bind:value={company} 
                    class="form-input"
                    placeholder="Your Company Name"
                  />
                </div>

                <div class="form-group">
                  <label for="message" class="form-label">
                    <Icon name="message-square" />
                    Your Message *
                  </label>
                  <textarea 
                    id="message" 
                    rows="6" 
                    bind:value={message} 
                    aria-invalid={!!errors.message}
                    class="form-textarea"
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                  {#if errors.message}
                    <div role="status" class="form-error">
                      <Icon name="alert-circle" />
                      {errors.message}
                    </div>
                  {/if}
                  <div class="char-count" class:near-limit={message.length >= 10}>
                    {message.length} characters
                  </div>
                </div>

                <button class="btn btn-primary btn-submit" type="submit">
                  <Icon name="send" />
                  Send Message
                </button>
              </form>
            </CardHalo>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  .contact-section {
    margin: 4rem 0;
  }
  
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 3rem;
    align-items: start;
  }
  
  /* Contact Info */
  .info-card {
    padding: 2rem;
  }
  
  .info-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: var(--text-strong);
  }
  
  .info-description {
    color: var(--text-secondary);
    margin: 0 0 2rem;
    line-height: 1.6;
  }
  
  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .method-item {
    display: flex;
    gap: 1rem;
    align-items: start;
  }
  
  .method-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--bg-elev-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ai-cyber-1);
    flex-shrink: 0;
  }
  
  .method-item h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
    color: var(--text-strong);
  }
  
  .method-item p {
    font-size: 0.9rem;
    margin: 0;
    color: var(--text-secondary);
  }
  
  .info-highlight {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 1rem;
    background: var(--bg-elev-1);
    border-radius: 10px;
    border-left: 3px solid var(--ai-cyber-1);
  }
  
  .info-highlight p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  /* Contact Form */
  .contact-form {
    padding: 2rem;
  }
  
  .form-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 2rem;
    color: var(--text-strong);
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-strong);
    font-size: 0.95rem;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid var(--control-border);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text-strong);
    font-size: 1rem;
    transition: all 0.2s ease;
    font-family: inherit;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--ai-neural-1);
    box-shadow: 0 0 0 3px var(--ai-neural-1, rgba(100, 100, 255, 0.1));
  }
  
  .form-input[aria-invalid="true"],
  .form-textarea[aria-invalid="true"] {
    border-color: var(--ai-coral-1);
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .intent-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: var(--bg-elev-1);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .form-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    color: var(--ai-coral-1);
    font-size: 0.875rem;
  }
  
  .char-count {
    text-align: right;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }
  
  .char-count.near-limit {
    color: var(--ai-cyber-1);
    font-weight: 600;
  }
  
  .btn-submit {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .success-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--bg-elev-1);
    border: 2px solid var(--ai-cyber-1);
    border-radius: 12px;
    color: var(--ai-cyber-1);
    font-weight: 600;
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 1024px) {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .contact-section {
      margin: 3rem 0;
    }
    
    .info-card,
    .contact-form {
      padding: 1.5rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .info-title {
      font-size: 1.5rem;
    }
    
    .form-title {
      font-size: 1.5rem;
    }
  }
</style>
