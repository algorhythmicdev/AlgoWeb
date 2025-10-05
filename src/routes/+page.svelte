<script lang="ts">
  // @ts-nocheck
  import HeroSection from '$sections/HeroSection.svelte';
  import FoundersSection from '$sections/FoundersSection.svelte';
  import { _ } from 'svelte-i18n';
  import { revealOnScroll, staggerReveal } from '$utils/animations';
  import productsData from '$data/products.json';
  import timelineData from '$data/timeline.json';

  const productKeys = ['nodevoyage', 'ideonautix'];
</script>

<HeroSection />

<section class="story section" id="story" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('story.title')}</span>
      <h2>{$_('story.vision_title')}</h2>
      <p>{$_('story.vision_text')}</p>
    </div>

    <div class="story-grid" use:staggerReveal={{ stagger: 160 }}>
      <article class="story-card">
        <span class="kicker">{$_('story.reality_title')}</span>
        <p>{$_('story.reality_text')}</p>
      </article>

      <article class="story-card">
        <span class="kicker">{$_('story.mission_title')}</span>
        <p>{$_('story.mission_text')}</p>
      </article>
    </div>
  </div>
</section>

<FoundersSection />

<section class="products section" id="products" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('products.title')}</span>
      <h2>{$_('products.subtitle')}</h2>
    </div>

    <div class="product-list">
      {#each productKeys as key}
        {#if productsData[key]}
          <article class="product-row" use:staggerReveal={{ stagger: 140 }}>
            <div class="product-meta">
              <span class="kicker">{$_(`products.${key}.name`)}</span>
              <h3>{$_(`products.${key}.tagline`)}</h3>
              <div class="status-pill">
                <span>{$_(`products.${key}.status`)}</span>
                <span class="dot"></span>
                <span>{$_(`products.${key}.mvp`)}</span>
              </div>
            </div>

            <div class="product-body">
              <p>{$_(`products.${key}.description`)}</p>
              <a class="product-link" href={`/products/${key}`}>
                <span>{$_(`products.${key}.cta`)}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
          </article>
        {/if}
      {/each}
    </div>
  </div>
</section>

<section class="timeline section" id="timeline" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('timeline.title')}</span>
      <h2>{$_('timeline.subtitle')}</h2>
    </div>

    <div class="timeline-grid">
      {#each timelineData.milestones as milestone, index}
        <article class="timeline-item" use:staggerReveal={{ delay: 80 + index * 60 }}>
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <span class="timeline-date">{new Date(`${milestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })}</span>
            <h3>{$_(`timeline.milestones.${milestone.id}.title`)}</h3>
            <p>{$_(`timeline.milestones.${milestone.id}.description`)}</p>
            {#if $_(`timeline.milestones.${milestone.id}.note`)}
              <p class="timeline-note">{$_(`timeline.milestones.${milestone.id}.note`)}</p>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .section-heading {
    display: grid;
    gap: var(--space-lg);
    max-width: min(900px, 90%);
    margin-bottom: var(--space-4xl);
  }

  .section-heading h2 {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .section-heading p { color: var(--text-secondary); }

  .story-grid {
    display: grid;
    gap: var(--grid-gap-xl);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    margin-top: var(--space-2xl);
  }

  .story-card {
    padding: var(--card-padding-lg);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: var(--surface-glass);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    display: grid;
    gap: var(--space-lg);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: all var(--duration-normal) var(--ease-out);
    position: relative;
    overflow: hidden;
    margin-bottom: var(--card-margin-bottom);
  }

  .story-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 255, 255, 0.7);
  }

  .story-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .story-card:hover::before {
    opacity: 1;
  }

  .story-card p { color: var(--text-secondary); }

  .product-list {
    display: grid;
    gap: var(--grid-gap-2xl);
    margin-top: var(--space-2xl);
  }

  .product-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: var(--space-3xl);
    padding: var(--card-padding-xl);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: var(--surface-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: all var(--duration-normal) var(--ease-out);
    position: relative;
    overflow: hidden;
    margin-bottom: var(--card-margin-bottom);
  }

  .product-row:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
    border-color: rgba(255, 255, 255, 0.8);
  }

  .product-row::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .product-row:hover::before {
    opacity: 1;
  }

  .product-meta { display: grid; gap: 0.9rem; }

  .product-meta h3 {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    border-radius: var(--radius-full);
    padding: 0.55rem 1.1rem;
    background: rgba(19, 81, 255, 0.08);
    background: color-mix(in srgb, var(--voyage-blue) 12%, transparent);
    border: 1px solid rgba(19, 81, 255, 0.18);
    font-size: var(--text-small);
    color: var(--voyage-blue);
  }

  .status-pill .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-flex;
  }

  .product-body { display: grid; gap: 1.2rem; }

  .product-body p { color: var(--text-secondary); }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
  }

  .product-link:hover { color: var(--aurora-purple); }

  .timeline-grid {
    position: relative;
    display: grid;
    gap: var(--space-4xl);
    padding-left: var(--space-xl);
    margin-top: var(--space-2xl);
  }

  .timeline-grid::before {
    content: '';
    position: absolute;
    left: 0.45rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, rgba(19, 81, 255, 0.32), transparent 80%);
  }

  .timeline-item {
    position: relative;
    display: flex;
    gap: clamp(1.6rem, 4vw, 2.5rem);
  }

  .timeline-marker {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    margin-top: 0.4rem;
    flex-shrink: 0;
    box-shadow: 0 0 0 6px rgba(19, 81, 255, 0.08);
  }

  .timeline-content {
    display: grid;
    gap: var(--space-md);
    background: var(--surface-glass);
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: var(--card-padding-lg);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: all var(--duration-normal) var(--ease-out);
    position: relative;
    overflow: hidden;
    margin-bottom: var(--card-margin-bottom);
  }

  .timeline-content:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: rgba(255, 255, 255, 0.7);
  }

  .timeline-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .timeline-content:hover::before {
    opacity: 1;
  }

  .timeline-date {
    font-size: var(--text-small);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .timeline-content p { color: var(--text-secondary); }

  .timeline-note { color: var(--voyage-blue); font-size: var(--text-small); }

  @media (max-width: 960px) {
    .product-row { 
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
    .timeline-grid { 
      padding-left: 0;
      gap: var(--space-2xl);
    }
    .timeline-grid::before { display: none; }
    .timeline-item { 
      flex-direction: column; 
      padding-left: 0;
      gap: var(--space-md);
    }
    .timeline-marker { margin-left: 6px; }
    .story-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
    .section-heading {
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }
  }
  
  @media (max-width: 768px) {
    .product-row {
      padding: var(--card-padding-md);
      gap: var(--space-md);
    }
    .story-card {
      padding: var(--card-padding-md);
      gap: var(--space-md);
    }
    .timeline-content {
      padding: var(--card-padding-md);
      gap: var(--space-sm);
    }
    .section-heading {
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
    }
  }
</style>
