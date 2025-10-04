<script>
  import { _ } from 'svelte-i18n';
  import { reveal, tilt } from '$utils/animations';
  import productsData from '$data/products.json';
</script>

<svelte:head>
  <title>Products - AlgoRhythmics</title>
  <meta name="description" content="Explore our AI-powered products: NodeVoyage travel platform and Ideonautix productivity suite" />
</svelte:head>

<!-- Hero Section -->
<section class="hero section-lg">
  <div class="container">
    <h1 class="hero-title" use:reveal>{$_('products.title')}</h1>
    <p class="hero-subtitle" use:reveal={{ delay: 200 }}>{$_('products.subtitle')}</p>
  </div>
</section>

<!-- Products Grid -->
<section class="section">
  <div class="container">
    <div class="products-grid">
      <!-- NodeVoyage -->
      <article class="product-card" use:reveal use:tilt>
        <div class="product-image">
          <img src={productsData.nodevoyage.hero} alt="NodeVoyage - AI Travel Companion" />
          <div class="product-badge">{$_('products.nodevoyage.status')}</div>
        </div>
        <div class="product-content">
          <div class="product-icon">
            <img src={productsData.nodevoyage.icon} alt="NodeVoyage Icon" />
          </div>
          <h2>{productsData.nodevoyage.name}</h2>
          <p class="product-tagline">{productsData.nodevoyage.tagline}</p>
          <p class="product-description">{$_('products.nodevoyage.description')}</p>
          <div class="product-meta">
            <span class="mvp-date">{$_('products.nodevoyage.mvp')}</span>
          </div>
          <div class="product-actions">
            <a href="/products/nodevoyage" class="btn btn-primary">
              {$_('products.nodevoyage.cta')}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </article>

      <!-- Ideonautix -->
      <article class="product-card" use:reveal={{ delay: 200 }} use:tilt>
        <div class="product-image">
          <img src={productsData.ideonautix.hero} alt="Ideonautix - Intelligence for Startups" />
          <div class="product-badge planning">{$_('products.ideonautix.status')}</div>
        </div>
        <div class="product-content">
          <div class="product-icon">
            <img src={productsData.ideonautix.icon} alt="Ideonautix Icon" />
          </div>
          <h2>{productsData.ideonautix.name}</h2>
          <p class="product-tagline">{productsData.ideonautix.tagline}</p>
          <p class="product-description">{$_('products.ideonautix.description')}</p>
          <div class="product-meta">
            <span class="mvp-date">{$_('products.ideonautix.mvp')}</span>
          </div>
          <div class="product-actions">
            <a href="/products/ideonautix" class="btn btn-primary">
              {$_('products.ideonautix.cta')}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section section">
  <div class="container">
    <div class="cta-card" use:reveal>
      <h2>Ready to Transform Your Workflow?</h2>
      <p>Join our community and be the first to experience our AI-powered platforms</p>
      <div class="cta-buttons">
        <a href="/community" class="btn btn-primary">Join Community</a>
        <a href="/contact" class="btn btn-secondary">Get in Touch</a>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    text-align: center;
    padding-top: 120px;
  }
  
  .hero-title {
    font-size: var(--text-hero);
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--space-4);
  }
  
  .hero-subtitle {
    font-size: var(--text-title);
    color: var(--text-secondary);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(500px, 100%), 1fr));
    gap: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .product-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    transition: all var(--duration-normal) var(--ease-out);
  }
  
  .product-card:hover {
    box-shadow: var(--shadow-2xl);
    border-color: var(--aurora-purple);
  }
  
  .product-image {
    position: relative;
    height: 300px;
    overflow: hidden;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-badge {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    padding: var(--space-2) var(--space-4);
    background: rgba(19, 81, 255, 0.9);
    backdrop-filter: blur(8px);
    border-radius: var(--radius-full);
    color: white;
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
  }
  
  .product-badge.planning {
    background: rgba(255, 193, 7, 0.9);
    color: #000;
  }
  
  .product-content {
    padding: var(--space-8);
  }
  
  .product-icon {
    width: 64px;
    height: 64px;
    margin-bottom: var(--space-4);
  }
  
  .product-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .product-content h2 {
    font-size: var(--text-display);
    margin-bottom: var(--space-2);
    color: var(--text-primary);
  }
  
  .product-tagline {
    font-size: var(--text-title);
    font-style: italic;
    color: var(--aurora-purple);
    margin-bottom: var(--space-4);
  }
  
  .product-description {
    font-size: var(--text-body);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-6);
  }
  
  .product-meta {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }
  
  .mvp-date {
    padding: var(--space-2) var(--space-4);
    background: var(--bg-elevated);
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
  }
  
  .product-actions {
    display: flex;
    gap: var(--space-4);
  }
  
  .product-actions .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  .cta-section {
    padding: var(--space-16) 0;
  }
  
  .cta-card {
    text-align: center;
    padding: var(--space-12);
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    border-radius: var(--radius-2xl);
    color: white;
  }
  
  .cta-card h2 {
    font-size: var(--text-hero);
    margin-bottom: var(--space-4);
  }
  
  .cta-card p {
    font-size: var(--text-title);
    margin-bottom: var(--space-8);
    opacity: 0.9;
  }
  
  .cta-buttons {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .cta-buttons .btn-primary {
    background: white;
    color: var(--voyage-blue);
  }
  
  .cta-buttons .btn-primary:hover {
    background: var(--bg-elevated);
  }
  
  .cta-buttons .btn-secondary {
    border-color: white;
    color: white;
  }
  
  .cta-buttons .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 1024px) {
    .products-grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
  }
  
  @media (max-width: 768px) {
    .hero {
      padding-top: 100px;
    }
    
    .hero-title {
      font-size: var(--text-hero);
    }
    
    .hero-subtitle {
      font-size: var(--text-body);
    }
    
    .product-image {
      height: 200px;
    }
    
    .product-content {
      padding: var(--space-5);
    }
    
    .product-content h2 {
      font-size: var(--text-headline);
    }
    
    .product-tagline {
      font-size: var(--text-body);
    }
    
    .cta-card {
      padding: var(--space-6);
    }
    
    .cta-card h2 {
      font-size: var(--text-headline);
    }
    
    .cta-card p {
      font-size: var(--text-body);
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-3);
    }
  }
</style>