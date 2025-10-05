<script>
  import { _ } from 'svelte-i18n';
  import { revealOnScroll, staggerReveal } from '$utils/animations';
  import productsData from '$data/products.json';

  /** @type {Array<'nodevoyage' | 'ideonautix'>} */
  const productKeys = ['nodevoyage', 'ideonautix'];
  const products = /** @type {Record<'nodevoyage' | 'ideonautix', any>} */ (productsData);
</script>

<svelte:head>
  <title>Products - AlgoRhythmics</title>
  <meta name="description" content="Explore our AI-powered products: NodeVoyage travel platform and Ideonautix productivity suite" />
</svelte:head>

<section class="hero section" use:revealOnScroll>
  <div class="container hero-container">
    <span class="eyebrow">{$_('products.title')}</span>
    <h1>{$_('products.subtitle')}</h1>
    <p>{$_('story.mission_text')}</p>
  </div>
</section>

<section class="catalog section-sm" use:revealOnScroll>
  <div class="container">
    <div class="catalog-grid" use:staggerReveal={{ stagger: 160 }}>
      {#each productKeys as key}
        {#if products[key]}
          <article class="catalog-card">
            <div class="catalog-header">
              <span class="kicker">{products[key].name}</span>
              <span class="badge-pill">{$_(`products.${key}.status`)}</span>
            </div>

            <h2>{products[key].tagline}</h2>
            <p>{$_(`products.${key}.description`)}</p>

            <div class="catalog-footer">
              <span class="launch">{$_(`products.${key}.mvp`)}</span>
              <a href={`/products/${key}`} class="btn btn-primary">{$_(`products.${key}.cta`)}</a>
            </div>
          </article>
        {/if}
      {/each}
    </div>
  </div>
</section>

<section class="cta section" use:revealOnScroll>
  <div class="container cta-card">
    <div class="cta-copy">
      <h2>Ready to transform your workflow?</h2>
      <p>Join our community and be the first to experience our AI-powered platforms.</p>
    </div>
    <div class="cta-actions">
      <a href="/community" class="btn btn-gradient">Join Community</a>
      <a href="/contact" class="btn btn-secondary hover-lift">Get in Touch</a>
    </div>
  </div>
</section>

<style>
  .hero-container {
    max-width: 720px;
    display: grid;
    gap: 1rem;
    text-align: center;
    margin: 0 auto;
  }

  .hero-container p { color: var(--text-secondary); }

  .catalog-grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.8rem);
  }

  .catalog-card {
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: clamp(2rem, 4vw, 3rem);
    background: var(--bg-surface);
    background: var(--surface-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
    display: grid;
    gap: clamp(1.5rem, 3vw, 2rem);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .catalog-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }

  .catalog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .catalog-card h2 {
    font-size: clamp(1.9rem, 3vw, 2.6rem);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .catalog-card p { color: var(--text-secondary); }

  .catalog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1.2rem, 3vw, 2rem);
    flex-wrap: wrap;
  }

  .launch {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .cta-card {
    background: var(--bg-surface);
    background: var(--surface-glass);
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: clamp(2.5rem, 5vw, 3.5rem);
    display: flex;
    flex-direction: column;
    gap: clamp(1.8rem, 4vw, 2.5rem);
    align-items: stretch;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
  }

  .cta-copy { display: grid; gap: 1rem; }
  .cta-copy p { color: var(--text-secondary); }

  .cta-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    .cta-actions { flex-direction: column; }
  }
</style>
