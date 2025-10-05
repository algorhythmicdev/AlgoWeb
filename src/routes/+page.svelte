<script>
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
    gap: 0.6rem;
    max-width: 840px;
    margin-bottom: var(--space-10);
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
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .story-card {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    box-shadow: var(--shadow-xs);
    display: grid;
    gap: 0.85rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .story-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .story-card p { color: var(--text-secondary); }

  .products {
    background: var(--bg-muted);
  }

  .product-list {
    display: grid;
    gap: var(--space-3);
  }

  .product-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: var(--space-6);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    box-shadow: var(--shadow-sm);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .product-row:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .product-meta { display: grid; gap: 0.6rem; }

  .product-meta h3 { 
    font-size: clamp(1.8rem, 3vw, 2.4rem);
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
    padding: 0.5rem 0.9rem;
    background: var(--bg-muted);
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .status-pill .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--voyage-blue);
    display: inline-flex;
  }

  .product-body { display: grid; gap: var(--space-3); }

  .product-body p { color: var(--text-secondary); }

  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
  }

  .product-link:hover { color: var(--aurora-purple); }

  .timeline-grid {
    position: relative;
    display: grid;
    gap: var(--space-6);
    padding-left: 1.5rem;
  }

  .timeline-grid::before {
    content: '';
    position: absolute;
    left: 0.45rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border-strong);
  }

  .timeline-item {
    position: relative;
    display: flex;
    gap: var(--space-4);
  }

  .timeline-marker {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--voyage-blue);
    margin-top: 0.4rem;
    flex-shrink: 0;
  }

  .timeline-content {
    display: grid;
    gap: 0.5rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    box-shadow: var(--shadow-xs);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
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
    .product-row { grid-template-columns: 1fr; }
    .timeline-grid { padding-left: 0; }
    .timeline-grid::before { left: 8px; }
    .timeline-item { flex-direction: column; padding-left: 24px; }
  }
</style>
