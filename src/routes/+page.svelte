<script>
  import HeroSection from '$sections/HeroSection.svelte';
  import FoundersSection from '$sections/FoundersSection.svelte';
  import { _ } from 'svelte-i18n';
  import { revealOnScroll, staggerReveal, tilt, sparkleTrail, ripple } from '$utils/animations';
  import productsData from '$data/products.json';
  import timelineData from '$data/timeline.json';
</script>

<HeroSection />

<!-- Story Section -->
<section class="story section" id="story" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title text-center">{$_('story.title')}</h2>
    
    <div class="story-grid" use:staggerReveal={{ delay: 100, stagger: 150 }}>
      <div class="story-card" use:tilt={{ max: 5, scale: 1.01 }}>
        <h3>{$_('story.reality_title')}</h3>
        <p>{$_('story.reality_text')}</p>
      </div>
      
      <div class="story-card" use:tilt={{ max: 5, scale: 1.01 }}>
        <h3>{$_('story.mission_title')}</h3>
        <p>{$_('story.mission_text')}</p>
      </div>
      
      <div class="story-card" use:tilt={{ max: 5, scale: 1.01 }}>
        <h3>{$_('story.vision_title')}</h3>
        <p>{$_('story.vision_text')}</p>
      </div>
    </div>
  </div>
</section>

<FoundersSection />

<!-- Products Section -->
<section class="products section" id="products" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title text-center">{$_('products.title')}</h2>
    <p class="section-subtitle text-center">{$_('products.subtitle')}</p>
    
    <div class="products-grid" use:staggerReveal={{ delay: 100, stagger: 200 }}>
      <div class="product-card" use:tilt={{ max: 8, scale: 1.02 }}>
        <img src={productsData.nodevoyage.hero} alt="NodeVoyage" />
        <div class="product-content">
          <h3>{productsData.nodevoyage.name}</h3>
          <p class="tagline">{productsData.nodevoyage.tagline}</p>
          <p class="description">{$_('products.nodevoyage.description')}</p>
          <div class="product-meta">
            <span class="status">{$_('products.nodevoyage.status')}</span>
            <span class="mvp">{$_('products.nodevoyage.mvp')}</span>
          </div>
          <a href="/products/nodevoyage" class="btn btn-primary" use:sparkleTrail use:ripple>{$_('products.nodevoyage.cta')}</a>
        </div>
      </div>
      
      <div class="product-card" use:tilt={{ max: 8, scale: 1.02 }}>
        <img src={productsData.ideonautix.hero} alt="Ideonautix" />
        <div class="product-content">
          <h3>{productsData.ideonautix.name}</h3>
          <p class="tagline">{productsData.ideonautix.tagline}</p>
          <p class="description">{$_('products.ideonautix.description')}</p>
          <div class="product-meta">
            <span class="status">{$_('products.ideonautix.status')}</span>
            <span class="mvp">{$_('products.ideonautix.mvp')}</span>
          </div>
          <a href="/products/ideonautix" class="btn btn-primary" use:sparkleTrail use:ripple>{$_('products.ideonautix.cta')}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Timeline Section -->
<section class="timeline section" id="timeline" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title text-center">{$_('timeline.title')}</h2>
    <p class="section-subtitle text-center">{$_('timeline.subtitle')}</p>
    
    <div class="timeline-list" use:staggerReveal={{ delay: 100, stagger: 120 }}>
      {#each timelineData.milestones as milestone, index}
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <span class="date">{milestone.date}</span>
            <h3>{milestone.title}</h3>
            <p>{milestone.description}</p>
            {#if milestone.note}
              <p class="note">{milestone.note}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .section-title {
    font-size: var(--text-display);
    margin-bottom: var(--space-4);
  }
  
  .section-subtitle {
    font-size: var(--text-title);
    color: var(--text-secondary);
    margin-bottom: var(--space-12);
  }
  
  /* Story Section */
  .story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-6);
    align-items: stretch;
  }
  
  .story-card {
    padding: var(--space-6);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    transition: all var(--duration-normal) var(--ease-out);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 280px;
    justify-content: space-between;
  }
  
  .story-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-glass-hover);
  }
  
  .story-card h3 {
    font-size: var(--text-headline);
    margin-bottom: var(--space-3);
    color: var(--voyage-blue);
  }
  
  /* Products Section */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(450px, 100%), 1fr));
    gap: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .product-card {
    background: var(--bg-surface);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: all 300ms ease;
    display: flex;
    flex-direction: column;
  }
  
  .product-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-8px);
  }
  
  .product-card img {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }
  
  .product-content {
    padding: var(--space-6);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .product-content h3 {
    font-size: var(--text-headline);
    margin-bottom: var(--space-2);
  }
  
  .tagline {
    font-style: italic;
    color: var(--text-secondary);
    margin-bottom: var(--space-3);
  }
  
  .description {
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-4);
  }
  
  .product-meta {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
    flex-wrap: wrap;
    margin-top: auto;
  }
  
  .status, .mvp {
    padding: var(--space-1) var(--space-3);
    background: var(--bg-elevated);
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
  }
  
  /* Timeline Section */
  .timeline-list {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .timeline-list::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
  }
  
  .timeline-item {
    position: relative;
    padding-left: var(--space-12);
    margin-bottom: var(--space-8);
  }
  
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  
  .timeline-marker {
    position: absolute;
    left: 12px;
    top: 4px;
    width: 16px;
    height: 16px;
    background: var(--voyage-blue);
    border: 4px solid var(--bg-primary);
    border-radius: 50%;
  }
  
  .timeline-content {
    background: var(--bg-surface);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }
  
  .date {
    font-size: var(--text-small);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }
  
  .timeline-content h3 {
    font-size: var(--text-title);
    margin: var(--space-2) 0;
  }
  
  .note {
    font-size: var(--text-small);
    color: var(--text-secondary);
    font-style: italic;
    margin-top: var(--space-2);
  }
  
  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
    
    .product-card img {
      height: 200px;
    }
    
    .product-content {
      padding: var(--space-4);
    }
    
    .timeline-list::before {
      left: 12px;
    }
    
    .timeline-item {
      padding-left: var(--space-8);
      margin-bottom: var(--space-6);
    }
    
    .timeline-marker {
      left: 4px;
      width: 12px;
      height: 12px;
      border-width: 3px;
    }
    
    .timeline-content {
      padding: var(--space-3);
    }
  }
</style>
