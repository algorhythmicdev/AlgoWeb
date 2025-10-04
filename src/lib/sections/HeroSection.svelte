<script>
  import { _ } from 'svelte-i18n';
  import { typewriter, magnetic, parallax, morphGradient, sparkleTrail, ripple } from '$utils/animations';
</script>

<section class="hero section-lg">
  <div class="hero-background" use:parallax={{ intensity: 40 }}></div>
  <div class="container">
    <div class="status-badge">{$_('hero.status')}</div>
    
    <h1 class="hero-title" use:typewriter={{ text: 'AlgoRhythmics', speed: 32, loop: false }} aria-label="AlgoRhythmics - AI Innovation Lab">AlgoRhythmics</h1>
    
    <h2 class="hero-subheading">Where Logic Dances with Creativity</h2>
    
    <p class="hero-subtitle">{$_('hero.subtitle')}</p>
    
    <div class="hero-actions" role="group" aria-label="Main actions">
      <a href="/products" class="btn btn-primary" use:magnetic use:sparkleTrail use:ripple aria-describedby="products-description">
        {$_('hero.cta_products')}
      </a>
      <a href="/consulting" class="btn btn-secondary" use:magnetic use:sparkleTrail use:ripple aria-describedby="consulting-description">
        {$_('hero.cta_consulting')}
      </a>
    </div>
    
    <div class="scroll-indicator" role="img" aria-label="Scroll down to see more content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    overflow: hidden;
  }
  
  .hero-background {
    position: absolute;
    inset: 0;
    background: transparent;
    z-index: -1;
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
    font-size: clamp(2rem, 5vw, var(--text-mega));
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--space-4);
    max-width: 20ch;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.2;
  }
  
  .hero-subheading {
    font-size: clamp(1.1rem, 3vw, 1.6rem);
    font-weight: 400;
    color: var(--text-primary);
    margin-top: 0.75em;
    margin-bottom: var(--space-6);
    max-width: 30ch;
    margin-left: auto;
    margin-right: auto;
    animation: fadeIn 1s var(--ease-out) 0.3s both;
  }
  
  .hero-subtitle {
    font-size: clamp(var(--text-body), 2vw, var(--text-title));
    color: var(--text-secondary);
    max-width: min(800px, 90%);
    margin: 0 auto var(--space-8);
    line-height: 1.6;
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
      padding-top: var(--space-12);
    }
    
    .hero-title {
      font-size: var(--text-hero);
      margin-bottom: var(--space-3);
    }
    
    .hero-subheading {
      font-size: var(--text-title);
      margin-bottom: var(--space-4);
    }
    
    .hero-subtitle {
      font-size: var(--text-body);
      margin-bottom: var(--space-6);
    }
    
    .hero-actions {
      flex-direction: column;
      align-items: stretch;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .scroll-indicator {
      display: none;
    }
  }
</style>
