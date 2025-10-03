<script>
  import { _ } from 'svelte-i18n';
  import { typewriter, magnetic } from '$utils/animations';
</script>

<section class="hero section-lg">
  <div class="container">
    <div class="status-badge">{$_('hero.status')}</div>
    
    <h1 class="hero-title" use:typewriter={{ speed: 100 }}>
      {$_('hero.title')}
    </h1>
    
    <p class="hero-tagline">{$_('hero.tagline')}</p>
    
    <p class="hero-subtitle">{$_('hero.subtitle')}</p>
    
    <div class="hero-actions">
      <a href="/products" class="btn btn-primary" use:magnetic>
        {$_('hero.cta_products')}
      </a>
      <a href="/consulting" class="btn btn-secondary" use:magnetic>
        {$_('hero.cta_consulting')}
      </a>
    </div>
    
    <div class="scroll-indicator">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</section>

<style>
  .hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    text-align: center;
    position: relative;
  }
  
  .status-badge {
    display: inline-block;
    padding: var(--space-2) var(--space-4);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    color: var(--voyage-blue);
    font-weight: var(--weight-medium);
    margin-bottom: var(--space-6);
    animation: fadeIn 0.8s var(--ease-out);
  }
  
  .hero-title {
    font-size: var(--text-mega);
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--space-4);
  }
  
  .hero-tagline {
    font-size: var(--text-hero);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-6);
    animation: fadeIn 1s var(--ease-out) 0.3s both;
  }
  
  .hero-subtitle {
    font-size: var(--text-title);
    color: var(--text-secondary);
    max-width: 800px;
    margin: 0 auto var(--space-8);
    line-height: var(--leading-relaxed);
    animation: fadeIn 1s var(--ease-out) 0.6s both;
  }
  
  .hero-actions {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeIn 1s var(--ease-out) 0.9s both;
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    color: var(--text-secondary);
    animation: bounce 2s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(10px);
    }
  }
  
  @media (max-width: 768px) {
    .hero {
      min-height: 80vh;
    }
    
    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
