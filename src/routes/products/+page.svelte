<script>
  import { _ } from 'svelte-i18n';
  import HeroWrapper from '$components/hero/HeroWrapper.svelte';
  import ProductDemoPreview from '$components/ProductDemoPreview.svelte';
  import Icon from '$components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$utils/animations';
  import productsData from '$data/products.json';

  const productIds = /** @type {const} */ (['nodevoyage', 'ideonautix']);

  const highlightMeta = productIds
    .map((id) => ({
      id,
      accent: id === 'nodevoyage' ? 'voyage' : 'aurora',
      ...(productsData[id] ?? {})
    }))
    .filter((entry) => entry && entry.id);
</script>

<svelte:head>
  <title>{$_('products.meta_title')}</title>
  <meta name="description" content={$_('products.meta_description')} />
</svelte:head>

<HeroWrapper class="hero hero--products hero--centered section" showAside={false} introReveal={{ stagger: 120 }}>
  <svelte:fragment slot="status">
    <span class="products-hero__label">{$_('products.hero_label')}</span>
  </svelte:fragment>

  <svelte:fragment slot="title">
    <h1 class="products-hero__headline">{$_('products.title')}</h1>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    <p class="products-hero__subtitle">{$_('products.subtitle')}</p>
  </svelte:fragment>

  <p class="products-hero__description">{$_('products.description')}</p>

  <div class="hero-actions">
    <a href="#products-grid" class="btn btn-gradient">{$_('products.primary_cta')}</a>
    <a href="/contact" class="btn btn-secondary hover-lift">{$_('products.secondary_cta')}</a>
  </div>
</HeroWrapper>

<section class="product-highlights section" id="products-grid" use:revealOnScroll>
  <div class="container">
    <div class="section-heading" use:staggerReveal={{ stagger: 120 }}>
      <span class="eyebrow text-gradient">{$_('products.grid_label')}</span>
      <h2>{$_('products.grid_title')}</h2>
      <p>{$_('products.grid_description')}</p>
    </div>

    <div class="highlight-grid" use:staggerReveal={{ selector: '.highlight-card', stagger: 140 }}>
      {#each highlightMeta as product (product.id)}
        <article class={`highlight-card highlight-card--${product.id} os-window`}>
          <header class="highlight-card__header">
            <span class="highlight-card__status">{$_(`products.${product.id}.status`)}</span>
            <h2>{$_(`products.${product.id}.name`)}</h2>
            <p class="highlight-card__tagline">{$_(`products.${product.id}.tagline`)}</p>
          </header>

          <p class="highlight-card__description">{$_(`products.${product.id}.description`)}</p>

          <ul class="highlight-card__features">
            {#each (product.features ?? []) as feature}
              <li>
                <span class="feature-icon">
                  <Icon name={feature.icon} size={26} />
                </span>
                <div class="feature-copy">
                  <span class="feature-name">{$_(`${product.id}.features.${feature.id}.title`)}</span>
                  <p>{$_(`${product.id}.features.${feature.id}.description`)}</p>
                </div>
              </li>
            {/each}
          </ul>

          <div class="highlight-card__meta">
            <span class="highlight-card__launch">{$_(`products.${product.id}.mvp`)}</span>
            {#if product.domain}
              <span class="highlight-card__domain">{product.domain}</span>
            {/if}
          </div>

          <div class="highlight-card__actions">
            {#if product.url}
              <a
                class={`btn btn-gradient btn-${product.accent}`}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {$_(`products.${product.id}.cta`)}
              </a>
            {/if}
            <a href="/community" class="btn btn-tertiary hover-lift">{$_('products.community_cta')}</a>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="demo-previews section-sm" id="demos" use:revealOnScroll>
  <div class="container">
    <div class="demo-previews__header" use:staggerReveal={{ stagger: 100 }}>
      <span class="eyebrow text-gradient">{$_('products.demos.title')}</span>
      <h2>{$_('products.demos.subtitle')}</h2>
      <p>{$_('products.demos.description')}</p>
    </div>

    <div class="demo-previews__grid" use:staggerReveal={{ stagger: 140 }}>
      {#each highlightMeta as product (product.id)}
        <ProductDemoPreview
          title={$_(`products.demos.${product.id}.title`)}
          description={$_(`products.demos.${product.id}.description`)}
          host={$_(`products.demos.${product.id}.host`)}
          href={product.url}
          cta={$_(`products.demos.${product.id}.cta`)}
          accent={product.accent === 'voyage' ? 'voyage' : 'aurora'}
        />
      {/each}
    </div>
  </div>
</section>

<section class="cta section" use:revealOnScroll>
  <div class="container cta-card">
    <div class="cta-copy">
      <h2>{$_('products.cta_title')}</h2>
      <p>{$_('products.cta_text')}</p>
    </div>
    <div class="cta-actions">
      <a href="/community" class="btn btn-gradient">{$_('products.cta_join')}</a>
      <a href="/contact" class="btn btn-secondary hover-lift">{$_('products.cta_contact')}</a>
    </div>
  </div>
</section>

<style>
  :global(.hero--products) {
    --hero-padding-block-start: clamp(5.2rem, 11vw, 8.4rem);
    --hero-padding-block-end: clamp(4rem, 9vw, 6.4rem);
    --hero-shell-columns: minmax(0, 1fr);
    --hero-shell-gap: clamp(2.2rem, 5vw, 3.4rem);
    --hero-intro-gap: clamp(1.4rem, 3vw, 2.2rem);
    --hero-actions-gap: 1rem;
    --hero-backdrop-inset: -22% -32% auto;
    --hero-backdrop-height: clamp(18rem, 34vw, 28rem);
    --hero-backdrop-gradient: linear-gradient(120deg, rgba(19, 81, 255, 0.2), rgba(106, 56, 255, 0.12));
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }

  :global(.hero--products .hero-wrapper__intro) {
    max-width: min(100%, var(--container-xl));
    margin: 0 auto;
    justify-items: center;
    text-align: center;
    position: relative;
  }

  .products-hero__label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--surface-glass-strong) 70%, rgba(255, 255, 255, 0.2) 30%);
    border: 1px solid color-mix(in srgb, var(--border-glass) 72%, rgba(255, 255, 255, 0.3) 28%);
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  :global([data-base-theme='dark']) .products-hero__label {
    background: color-mix(in srgb, rgba(10, 16, 32, 0.82) 60%, rgba(var(--voyage-blue-rgb), 0.36) 40%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 62%, rgba(255, 255, 255, 0.18) 38%);
  }

  :global([data-theme='contrast']) .products-hero__label {
    background: rgba(0, 0, 0, 0.82);
    border-color: rgba(255, 255, 255, 0.72);
  }

  .products-hero__headline {
    font-size: var(--text-display);
    line-height: 1.05;
    letter-spacing: -0.02em;
    background: var(--gradient-heading-strong);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;
  }

  .products-hero__subtitle {
    max-width: min(100%, 52ch);
    color: var(--text-secondary);
    font-size: clamp(1.1rem, 2.8vw, 1.65rem);
    margin: 0;
  }

  .products-hero__description {
    max-width: min(100%, 60ch);
    color: var(--text-secondary);
    font-size: clamp(1rem, 2.2vw, 1.25rem);
    margin: 0;
  }

  .product-highlights {
    padding-top: clamp(4rem, 12vw, 6rem);
  }

  .section-heading {
    text-align: center;
    max-width: min(100%, 72ch);
    margin: 0 auto clamp(3rem, 8vw, 4rem);
  }

  .section-heading h2 {
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .highlight-grid {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .highlight-card {
    display: grid;
    gap: clamp(1.2rem, 3vw, 1.8rem);
    padding: clamp(1.8rem, 3.6vw, 2.6rem);
    border-radius: var(--radius-2xl);
    position: relative;
    overflow: hidden;
    transition: transform var(--duration-hero) var(--ease-out), box-shadow var(--duration-hero) var(--ease-out);
  }

  .highlight-card::before {
    content: '';
    position: absolute;
    inset: -20% -30% auto;
    height: clamp(14rem, 32vw, 24rem);
    background: linear-gradient(140deg, rgba(var(--aurora-purple-rgb), 0.22), rgba(var(--voyage-blue-rgb), 0.12));
    filter: blur(120px);
    opacity: 0.4;
    pointer-events: none;
    transition: opacity var(--duration-hero) var(--ease-in-out);
  }

  .highlight-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
  }

  .highlight-card:hover::before { opacity: 0.6; }

  .highlight-card__header {
    display: grid;
    gap: 0.75rem;
  }

  .highlight-card__status {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    background: color-mix(in srgb, var(--surface-glass) 70%, rgba(var(--aurora-purple-rgb), 0.18) 30%);
  }

  .highlight-card__tagline {
    font-size: clamp(1.1rem, 2.6vw, 1.45rem);
    color: var(--text-secondary);
    margin: 0;
  }

  .highlight-card__description {
    color: var(--text-secondary);
    margin: 0;
  }

  .highlight-card__features {
    display: grid;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .highlight-card__features li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.85rem;
    align-items: start;
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--surface-glass) 72%, rgba(var(--voyage-blue-rgb), 0.14) 28%);
  }

  .feature-copy span {
    font-weight: var(--weight-semibold);
    display: block;
  }

  .feature-copy p {
    margin: 0.25rem 0 0;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .highlight-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .highlight-card__domain {
    font-family: var(--font-mono, var(--font-body));
    letter-spacing: 0.04em;
  }

  .highlight-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  .btn-voyage {
    background: linear-gradient(120deg, rgba(var(--voyage-blue-rgb), 0.92), rgba(var(--aurora-purple-rgb), 0.82));
  }

  .btn-aurora {
    background: linear-gradient(120deg, rgba(var(--aurora-purple-rgb), 0.92), rgba(var(--signal-yellow-rgb), 0.72));
  }

  .demo-previews__header {
    text-align: center;
    max-width: min(100%, 64ch);
    margin: 0 auto clamp(2.5rem, 7vw, 3.5rem);
  }

  .cta-card {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(1.5rem, 3vw, 2.5rem);
    align-items: center;
    padding: clamp(2.4rem, 5vw, 3.4rem);
    border-radius: var(--radius-2xl);
    background: var(--surface-glass-strong);
    border: 1px solid var(--border-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
  }

  .cta-copy p {
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  @media (max-width: 720px) {
    .highlight-card__features li { grid-template-columns: 1fr; }
    .highlight-card__features li .feature-copy { order: 2; }
    .highlight-card__features li .feature-icon { order: 1; margin-bottom: 0.4rem; }
    .cta-actions { justify-content: flex-start; }
  }
</style>
