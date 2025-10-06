<script>
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  export let label = '';
  export let title = '';
  export let subtitle = '';
  export let mission = '';
  export let primaryAction = /** @type {{ href: string; label: string }} */ ({ href: '#', label: '' });
  export let secondaryAction = /** @type {{ href: string; label: string }} */ ({ href: '#', label: '' });
  export let products = /** @type {Array<{ id: string; name: string; status: string; mvp: string; cta: string; href: string }>} */ (
    []
  );
</script>

<section class="products-hero section" use:revealOnScroll>
  <div class="hero-backdrop" aria-hidden="true">
    <span class="hero-gradient hero-gradient--primary"></span>
    <span class="hero-gradient hero-gradient--secondary"></span>
  </div>

  <div class="container hero-shell">
    <div class="hero-copy" use:staggerReveal={{ stagger: 110 }}>
      {#if label}
        <span class="status-chip">{label}</span>
      {/if}

      <div class="hero-text">
        <h1>{title}</h1>
        {#if subtitle}
          <p class="hero-subtitle">{subtitle}</p>
        {/if}
      </div>

      {#if mission}
        <p class="hero-mission">{mission}</p>
      {/if}

      <div class="hero-actions">
        {#if primaryAction?.label}
          <a href={primaryAction.href} class="btn btn-gradient">{primaryAction.label}</a>
        {/if}
        {#if secondaryAction?.label}
          <a href={secondaryAction.href} class="btn btn-secondary hover-lift">{secondaryAction.label}</a>
        {/if}
      </div>
    </div>

    {#if products.length}
      <aside
        class="hero-overview"
        aria-label="Product launch overview"
        use:staggerReveal={{ delay: 120, stagger: 100 }}
      >
        <ul>
          {#each products as product (product.id)}
            <li class="product-card">
              <div class="product-card__header">
                <h2>{product.name}</h2>
                {#if product.status}
                  <span class="badge-pill">{product.status}</span>
                {/if}
              </div>
              {#if product.mvp}
                <p class="product-card__meta">{product.mvp}</p>
              {/if}
              {#if product.cta}
                <a href={product.href} class="inline-link">{product.cta}</a>
              {/if}
            </li>
          {/each}
        </ul>
      </aside>
    {/if}
  </div>
</section>

<style>
  .products-hero {
    position: relative;
    overflow: hidden;
    padding: clamp(5rem, 11vw, 8.5rem) 0 clamp(4rem, 9vw, 6.5rem);
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    isolation: isolate;
  }

  .hero-backdrop {
    position: absolute;
    inset: clamp(-18rem, -22vw, -8rem) -25% auto;
    height: clamp(20rem, 46vw, 32rem);
    pointer-events: none;
    z-index: -1;
  }

  .hero-gradient {
    position: absolute;
    width: clamp(18rem, 40vw, 28rem);
    height: clamp(18rem, 40vw, 28rem);
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.6;
  }

  .hero-gradient--primary {
    inset: 0 auto auto -8%;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.5), rgba(var(--aurora-purple-rgb), 0.42));
  }

  .hero-gradient--secondary {
    inset: auto -12% -40% auto;
    background: linear-gradient(145deg, rgba(var(--signal-yellow-rgb), 0.45), rgba(var(--cherry-red-rgb), 0.35));
  }

  .hero-shell {
    display: grid;
    gap: clamp(2.5rem, 5vw, 4rem);
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    align-items: start;
  }

  .hero-copy {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.2rem);
    align-content: start;
  }

  .hero-text {
    display: grid;
    gap: clamp(0.6rem, 2vw, 1rem);
  }

  h1 {
    margin: 0;
    font-size: clamp(2.8rem, 6vw, 4.2rem);
    letter-spacing: -0.035em;
    line-height: 1.05;
  }

  .hero-subtitle {
    margin: 0;
    font-size: clamp(1.1rem, 2.6vw, 1.6rem);
    color: var(--text-secondary);
  }

  .hero-mission {
    margin: 0;
    font-size: clamp(1.05rem, 2.4vw, 1.4rem);
    color: var(--text-secondary);
    max-width: 60ch;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .hero-overview {
    background: var(--surface-glass);
    border: 1px solid color-mix(in srgb, var(--border-strong) 45%, transparent);
    border-radius: var(--radius-2xl);
    padding: clamp(1.8rem, 3.6vw, 2.6rem);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(20px);
  }

  .hero-overview ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: clamp(1.2rem, 2.6vw, 1.8rem);
  }

  .product-card {
    display: grid;
    gap: 0.65rem;
  }

  .product-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .product-card__header h2 {
    margin: 0;
    font-size: clamp(1.3rem, 2.6vw, 1.7rem);
  }

  .product-card__meta {
    margin: 0;
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  @media (max-width: 960px) {
    .hero-shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .hero-overview {
      order: -1;
    }
  }

  @media (max-width: 640px) {
    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }

  :global([data-theme='dark']) .hero-overview {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 60%, rgba(255, 255, 255, 0.12) 40%);
    box-shadow: var(--shadow-md);
  }
</style>
