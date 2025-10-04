<script>
  import { _ } from 'svelte-i18n';
  import { staggerReveal, tilt, particleExplode, ripple, magnetic } from '$utils/animations';
  import productsData from '$data/products.json';
  
  const product = productsData.nodevoyage;
  const features = product.features;
</script>

<svelte:head>
  <title>{product.name} - AlgoRhythmics</title>
  <meta name="description" content={product.description} />
</svelte:head>

<!-- Hero Section -->
<section class="product-hero">
  <div class="hero-background"></div>
  <div class="container">
    <div class="hero-content">
      <div class="status-badge">{$_('nodevoyage.status')}</div>
      <h1 class="hero-title">{product.name}</h1>
      <p class="hero-tagline">{product.tagline}</p>
      <p class="hero-description">{$_('nodevoyage.hero_description')}</p>
      
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" use:particleExplode use:ripple use:magnetic>
          {$_('nodevoyage.cta_primary')}
        </button>
        <a href="#features" class="btn btn-secondary btn-lg">
          {$_('nodevoyage.cta_secondary')}
        </a>
      </div>
      
      <div class="hero-stats" use:staggerReveal>
        <div class="stat">
          <div class="stat-value">{$_('nodevoyage.stat1_value')}</div>
          <div class="stat-label">{$_('nodevoyage.stat1_label')}</div>
        </div>
        <div class="stat">
          <div class="stat-value">{$_('nodevoyage.stat2_value')}</div>
          <div class="stat-label">{$_('nodevoyage.stat2_label')}</div>
        </div>
        <div class="stat">
          <div class="stat-value">{$_('nodevoyage.stat3_value')}</div>
          <div class="stat-label">{$_('nodevoyage.stat3_label')}</div>
        </div>
      </div>
    </div>
    
    <div class="hero-visual">
      <div class="device-mockup" use:tilt>
        <img src="/images/products/nodevoyage-hero.webp" alt="NodeVoyage Interface" />
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="features-section" id="features">
  <div class="container">
    <h2 class="section-title text-center">{$_('nodevoyage.features_title')}</h2>
    <p class="section-subtitle text-center">{$_('nodevoyage.features_subtitle')}</p>
    
    <div class="features-grid" use:staggerReveal={{ delay: 150 }}>
      {#each features as feature}
        <div class="feature-card glass-card" use:tilt={{ max: 5 }}>
          <div class="feature-icon">
            <div class="icon-wrapper">
              <span class="icon">{feature.icon}</span>
            </div>
          </div>
          <h3 class="feature-title">{feature.name}</h3>
          <p class="feature-description">{$_(`nodevoyage.features.${feature.id}`)}</p>
          <div class="feature-badge">{$_(`common.${feature.status}`)}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- How It Works Section -->
<section class="how-it-works section">
  <div class="container">
    <h2 class="section-title text-center">{$_('nodevoyage.how_title')}</h2>
    
    <div class="steps-row" use:staggerReveal={{ delay: 200 }}>
      <div class="step-box">
        <div class="step-number">01</div>
        <h3>{$_('nodevoyage.step1_title')}</h3>
        <p>{$_('nodevoyage.step1_desc')}</p>
      </div>
      
      <div class="step-box">
        <div class="step-number">02</div>
        <h3>{$_('nodevoyage.step2_title')}</h3>
        <p>{$_('nodevoyage.step2_desc')}</p>
      </div>
      
      <div class="step-box">
        <div class="step-number">03</div>
        <h3>{$_('nodevoyage.step3_title')}</h3>
        <p>{$_('nodevoyage.step3_desc')}</p>
      </div>
      
      <div class="step-box">
        <div class="step-number">04</div>
        <h3>{$_('nodevoyage.step4_title')}</h3>
        <p>{$_('nodevoyage.step4_desc')}</p>
      </div>
    </div>
  </div>
</section>

<!-- Tech Stack Section -->
<section class="tech-stack section bg-elevated">
  <div class="container">
    <h2 class="section-title text-center">{$_('nodevoyage.tech_title')}</h2>
    <p class="section-subtitle text-center">{$_('nodevoyage.tech_subtitle')}</p>
    
    <div class="tech-grid" use:staggerReveal>
      {#each product.techStack as tech}
        <div class="tech-badge glass-card">
          <span>{tech}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container">
    <div class="cta-card glass-card">
      <h2>{$_('nodevoyage.cta_title')}</h2>
      <p>{$_('nodevoyage.cta_description')}</p>
      <button class="btn btn-primary btn-lg" use:particleExplode use:ripple use:magnetic>
        {$_('nodevoyage.cta_button')}
      </button>
      <p class="cta-note">{$_('nodevoyage.cta_note')}</p>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .product-hero {
    position: relative;
    min-height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: var(--space-16) 0;
  }
  
  .hero-background {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(19, 81, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(106, 56, 255, 0.1) 0%, transparent 50%);
    animation: pulseGlow 8s ease-in-out infinite;
  }
  
  @keyframes pulseGlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  .hero-content {
    flex: 1;
    z-index: 1;
  }
  
  .status-badge {
    display: inline-block;
    padding: var(--space-2) var(--space-4);
    background: rgba(19, 81, 255, 0.1);
    border: 1px solid rgba(19, 81, 255, 0.3);
    border-radius: var(--radius-full);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    font-size: var(--text-small);
    margin-bottom: var(--space-4);
  }
  
  .hero-title {
    font-size: var(--text-hero);
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-3);
  }
  
  .hero-tagline {
    font-size: var(--text-headline);
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: var(--space-4);
  }
  
  .hero-description {
    font-size: var(--text-title);
    color: var(--text-secondary);
    max-width: 600px;
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-6);
  }
  
  .hero-actions {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }
  
  .hero-stats {
    display: flex;
    gap: var(--space-8);
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-value {
    font-size: var(--text-display);
    font-weight: var(--weight-black);
    color: var(--voyage-blue);
    line-height: 1;
  }
  
  .stat-label {
    font-size: var(--text-small);
    color: var(--text-secondary);
    margin-top: var(--space-2);
  }
  
  .hero-visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .device-mockup {
    position: relative;
    width: 100%;
    max-width: 500px;
    transform-style: preserve-3d;
  }
  
  .device-mockup img {
    width: 100%;
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-2xl);
  }
  
  /* Features Grid */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-12);
  }
  
  .feature-card {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    transition: all var(--duration-normal) var(--ease-out);
    position: relative;
  }
  
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-glass-hover);
  }
  
  .feature-icon {
    margin-bottom: var(--space-4);
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }
  
  .feature-title {
    font-size: var(--text-title);
    margin-bottom: var(--space-3);
  }
  
  .feature-description {
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-4);
  }
  
  .feature-badge {
    display: inline-block;
    padding: var(--space-1) var(--space-3);
    background: rgba(255, 211, 57, 0.1);
    border-radius: var(--radius-full);
    font-size: var(--text-caption);
    color: var(--signal-yellow);
    font-weight: var(--weight-semibold);
  }
  
  /* How It Works */
  .steps-row { 
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: 1rem;
    margin-top: var(--space-12);
  }
  .step-box { 
    text-align: center; 
    padding: var(--space-6); 
    min-height: 170px; 
    overflow-wrap: break-word; 
    box-sizing: border-box; 
  }
  
  .step-number {
    font-size: var(--text-mega);
    font-weight: var(--weight-black);
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-4);
  }
  
  .step-connector { display: none; }
  @media (max-width: 900px) {
    .steps-row { grid-template-columns: 2fr 2fr; }
  }
  @media (max-width: 550px) {
    .steps-row { grid-template-columns: 1fr; }
  }
  
  /* Tech Stack */
  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    justify-content: center;
    margin-top: var(--space-8);
  }
  
  .tech-badge {
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
    font-weight: var(--weight-semibold);
    transition: all var(--duration-normal) var(--ease-out);
  }
  
  .tech-badge:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: var(--shadow-lg);
  }
  
  /* CTA Section */
  .cta-section {
    padding: var(--space-20) 0;
  }
  
  .cta-card {
    text-align: center;
    padding: var(--space-12);
    border-radius: var(--radius-2xl);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cta-card h2 {
    font-size: var(--text-display);
    margin-bottom: var(--space-4);
  }
  
  .cta-card p {
    font-size: var(--text-title);
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
  }
  
  .cta-note {
    margin-top: var(--space-4);
    font-size: var(--text-small);
    color: var(--text-secondary);
    font-style: italic;
  }
  
  /* Glass Card Effect */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-glass);
  }
  
  @media (max-width: 768px) {
    .product-hero .container {
      flex-direction: column;
    }
    
    .hero-stats {
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .hero-actions {
      flex-direction: column;
    }
  }
</style>
