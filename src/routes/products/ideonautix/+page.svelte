<script>
  import { _ } from 'svelte-i18n';
  import { staggerReveal, tilt, particleExplode, morphGradient } from '$utils/animations';
  import productsData from '$data/products.json';
  
  const product = productsData.ideonautix;
  
  const microservices = [
    { id: 'pitch', icon: '🎯', name: 'Pitch Assistant', status: 'planning' },
    { id: 'revenue', icon: '📊', name: 'Revenue Boards', status: 'planning' },
    { id: 'team', icon: '👥', name: 'Team Dynamics', status: 'planning' },
    { id: 'market', icon: '🎪', name: 'Market Intelligence', status: 'planning' },
    { id: 'finance', icon: '💰', name: 'Finance Tracker', status: 'planning' },
    { id: 'growth', icon: '🚀', name: 'Growth Engine', status: 'planning' },
    { id: 'investor', icon: '💼', name: 'Investor Portal', status: 'planning' },
    { id: 'analytics', icon: '📈', name: 'Analytics Hub', status: 'planning' }
  ];
</script>

<svelte:head>
  <title>{product.name} - AlgoRhythmics</title>
</svelte:head>

<!-- Hero -->
<section class="product-hero">
  <div class="hero-gradient" use:morphGradient={{ colors: ['#6A38FF', '#1351FF', '#FFD339'] }}></div>
  <div class="container">
    <div class="hero-content">
      <div class="status-badge">{$_('ideonautix.status')}</div>
      <h1 class="hero-title">{product.name}</h1>
      <p class="hero-tagline">{product.tagline}</p>
      <p class="hero-description">{$_('ideonautix.hero_description')}</p>
      
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" use:particleExplode>
          {$_('ideonautix.cta_primary')}
        </button>
        <a href="#microservices" class="btn btn-secondary btn-lg">
          {$_('ideonautix.cta_secondary')}
        </a>
      </div>
      
      <div class="hero-stats" use:staggerReveal>
        <div class="stat">
          <div class="stat-value">{$_('ideonautix.stat1_value')}</div>
          <div class="stat-label">{$_('ideonautix.stat1_label')}</div>
        </div>
        <div class="stat">
          <div class="stat-value">{$_('ideonautix.stat2_value')}</div>
          <div class="stat-label">{$_('ideonautix.stat2_label')}</div>
        </div>
        <div class="stat">
          <div class="stat-value">{$_('ideonautix.stat3_value')}</div>
          <div class="stat-label">{$_('ideonautix.stat3_label')}</div>
        </div>
      </div>
    </div>
    
    <div class="hero-visual">
      <div class="dashboard-mockup" use:tilt>
        <img src="/images/products/ideonautix-hero.webp" alt="Ideonautix Dashboard" />
      </div>
    </div>
  </div>
</section>

<!-- Microservices Grid -->
<section class="microservices-section" id="microservices">
  <div class="container">
    <h2 class="section-title text-center">{$_('ideonautix.microservices_title')}</h2>
    <p class="section-subtitle text-center">{$_('ideonautix.microservices_subtitle')}</p>
    
    <div class="microservices-grid" use:staggerReveal={{ delay: 120 }}>
      {#each microservices as service}
        <div class="service-card glass-card" use:tilt={{ max: 8 }}>
          <div class="service-icon">{service.icon}</div>
          <h3>{service.name}</h3>
          <p>{$_(`ideonautix.${service.id}_desc`)}</p>
          <span class="status-badge">{$_(`common.${service.status}`)}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Featured Microservices Detail -->
<section class="featured-services section">
  <div class="container">
    <div class="service-detail glass-card" use:staggerReveal>
      <div class="service-content">
        <span class="service-number">01</span>
        <h3>{$_('ideonautix.pitch_title')}</h3>
        <p>{$_('ideonautix.pitch_desc')}</p>
        <ul>
          <li>AI-powered slide analysis</li>
          <li>Investor perspective scoring</li>
          <li>Competitive positioning insights</li>
          <li>Presentation flow optimization</li>
        </ul>
      </div>
      <div class="service-visual">
        <div class="visual-placeholder" use:morphGradient></div>
      </div>
    </div>
    
    <div class="service-detail glass-card reverse" use:staggerReveal>
      <div class="service-visual">
        <div class="visual-placeholder" use:morphGradient></div>
      </div>
      <div class="service-content">
        <span class="service-number">02</span>
        <h3>{$_('ideonautix.revenue_title')}</h3>
        <p>{$_('ideonautix.revenue_desc')}</p>
        <ul>
          <li>Real-time KPI dashboards</li>
          <li>Revenue forecasting models</li>
          <li>Customer acquisition metrics</li>
          <li>Burn rate calculations</li>
        </ul>
      </div>
    </div>
    
    <div class="service-detail glass-card" use:staggerReveal>
      <div class="service-content">
        <span class="service-number">03</span>
        <h3>{$_('ideonautix.team_title')}</h3>
        <p>{$_('ideonautix.team_desc')}</p>
        <ul>
          <li>Team health indicators</li>
          <li>Communication pattern analysis</li>
          <li>Productivity insights</li>
          <li>Collaboration recommendations</li>
        </ul>
      </div>
      <div class="service-visual">
        <div class="visual-placeholder" use:morphGradient></div>
      </div>
    </div>
  </div>
</section>

<!-- Integrations -->
<section class="integrations-section bg-elevated">
  <div class="container">
    <h2 class="section-title text-center">{$_('ideonautix.integrations_title')}</h2>
    <div class="integrations-grid" use:staggerReveal>
      {#each ['Slack', 'Google Workspace', 'Notion', 'GitHub', 'Stripe', 'QuickBooks', 'HubSpot', 'Salesforce'] as integration}
        <div class="integration-badge glass-card">
          <span>{integration}</span>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="container">
    <div class="cta-card glass-card">
      <h2>{$_('ideonautix.cta_title')}</h2>
      <p>{$_('ideonautix.cta_description')}</p>
      <button class="btn btn-primary btn-lg" use:particleExplode>
        Get Early Access
      </button>
      <p class="cta-note">MVP launching February 2026 • Be first in line</p>
    </div>
  </div>
</section>

<style>
  .product-hero {
    position: relative;
    min-height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: var(--space-16) 0;
  }
  
  .hero-gradient {
    position: absolute;
    inset: 0;
    opacity: 0.15;
  }
  
  .hero-content {
    flex: 1;
    z-index: 1;
  }
  
  .status-badge {
    display: inline-block;
    padding: var(--space-2) var(--space-4);
    background: rgba(106, 56, 255, 0.1);
    border: 1px solid rgba(106, 56, 255, 0.3);
    border-radius: var(--radius-full);
    color: var(--aurora-purple);
    font-weight: var(--weight-semibold);
    font-size: var(--text-small);
    margin-bottom: var(--space-4);
  }
  
  .hero-title {
    font-size: var(--text-hero);
    background: linear-gradient(135deg, var(--aurora-purple), var(--signal-yellow));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-3);
  }
  
  .microservices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-12);
  }
  
  .service-card {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    text-align: center;
    transition: all var(--duration-normal) var(--ease-out);
  }
  
  .service-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-glass-hover);
  }
  
  .service-icon {
    font-size: 3rem;
    margin-bottom: var(--space-4);
  }
  
  .service-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
    margin-bottom: var(--space-8);
  }
  
  .service-detail.reverse {
    direction: rtl;
  }
  
  .service-detail.reverse .service-content {
    direction: ltr;
  }
  
  .service-number {
    font-size: var(--text-display);
    font-weight: var(--weight-black);
    color: var(--aurora-purple);
    opacity: 0.2;
  }
  
  .service-content ul {
    list-style: none;
    margin-top: var(--space-4);
  }
  
  .service-content li {
    padding: var(--space-2) 0;
    padding-left: var(--space-6);
    position: relative;
  }
  
  .service-content li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--aurora-purple);
    font-weight: var(--weight-bold);
  }
  
  .visual-placeholder {
    width: 100%;
    height: 300px;
    border-radius: var(--radius-xl);
  }
  
  .integrations-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    justify-content: center;
    margin-top: var(--space-8);
  }
  
  .integration-badge {
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
    font-weight: var(--weight-semibold);
  }
  
  @media (max-width: 768px) {
    .service-detail {
      grid-template-columns: 1fr;
    }
  }
</style>
