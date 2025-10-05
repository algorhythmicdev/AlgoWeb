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
              <span class="kicker">{$_(`products.${key}.name`)}</span>
              <span class="badge-pill">{$_(`products.${key}.status`)}</span>
            </div>

            <h2>{$_(`products.${key}.tagline`)}</h2>
            <p>{$_(`products.${key}.description`)}</p>

            <ul class="feature-pills">
              {#each (products[key].features ?? []).slice(0, 3) as feature}
                <li>
                  <span class="feature-icon">{feature.icon}</span>
                  <span>{$_(`${key}.features.${feature.id}.title`)}</span>
                </li>
              {/each}
            </ul>

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
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 18%, rgba(255, 255, 255, 0.32) 82%);
    border-radius: var(--radius-2xl);
    padding: clamp(2rem, 4vw, 3rem);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(19, 81, 255, 0.08) 18%);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(32px);
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
    border-color: color-mix(in srgb, var(--voyage-blue) 40%, rgba(255, 255, 255, 0.4) 60%);
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

  .feature-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .feature-pills li {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 72%, transparent);
    color: var(--text-secondary);
    font-size: var(--text-small);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    backdrop-filter: blur(18px);
  }

  .feature-icon {
    font-size: 1rem;
    filter: drop-shadow(0 4px 8px rgba(17, 24, 39, 0.12));
  }

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

  :global([data-theme='dark']) .catalog-card {
    background: color-mix(in srgb, var(--bg-surface) 78%, rgba(47, 92, 220, 0.22) 22%);
    border-color: color-mix(in srgb, rgba(74, 120, 255, 0.55) 60%, rgba(6, 12, 26, 0.65) 40%);
  }

  :global([data-theme='dark']) .catalog-card:hover {
    border-color: color-mix(in srgb, rgba(90, 135, 255, 0.66) 70%, rgba(6, 12, 26, 0.6) 30%);
  }

  :global([data-theme='dark']) .feature-pills li {
    background: color-mix(in srgb, rgba(17, 28, 58, 0.8) 70%, transparent);
    border-color: color-mix(in srgb, rgba(70, 120, 255, 0.45) 65%, transparent);
    color: var(--text-secondary);
  }
</style>
