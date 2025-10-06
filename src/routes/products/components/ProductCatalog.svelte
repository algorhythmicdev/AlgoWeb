<script>
  import { Icon } from '$lib/components';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  export let products = /** @type {Array<{
    id: string;
    name: string;
    status: string;
    tagline: string;
    description: string;
    mvp: string;
    cta: string;
    href: string;
    features: Array<{ id: string; icon: string; title: string; description: string }>
  }>} */ ([]);
</script>

<section class="product-catalog section" use:revealOnScroll>
  <div class="container">
    <div class="catalog-grid" use:staggerReveal={{ stagger: 140 }}>
      {#each products as product (product.id)}
        <article class="catalog-card">
          <header>
            <div class="catalog-card__top">
              <span class="kicker">{product.name}</span>
              {#if product.status}
                <span class="badge-pill">{product.status}</span>
              {/if}
            </div>
            {#if product.tagline}
              <h3>{product.tagline}</h3>
            {/if}
          </header>

          {#if product.description}
            <p class="catalog-card__description">{product.description}</p>
          {/if}

          {#if product.features?.length}
            <ul class="catalog-features">
              {#each product.features as feature (feature.id)}
                <li>
                  <span class="feature-icon">
                    <Icon name={feature.icon} size={26} />
                  </span>
                  <div>
                    <strong>{feature.title}</strong>
                    {#if feature.description}
                      <p>{feature.description}</p>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}

          <footer class="catalog-card__footer">
            {#if product.mvp}
              <span class="catalog-card__meta">{product.mvp}</span>
            {/if}
            {#if product.cta}
              <a href={product.href} class="btn btn-primary">{product.cta}</a>
            {/if}
          </footer>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .product-catalog {
    padding: clamp(3.5rem, 9vw, 6rem) 0;
  }

  .catalog-grid {
    display: grid;
    gap: clamp(1.6rem, 3.6vw, 2.6rem);
  }

  @media (min-width: 980px) {
    .catalog-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .catalog-card {
    display: grid;
    gap: clamp(1.2rem, 2.8vw, 1.8rem);
    padding: clamp(1.8rem, 3.4vw, 2.6rem);
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 68%, transparent);
    background: color-mix(in srgb, var(--surface-glass) 75%, transparent);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(22px);
    transition: transform 220ms var(--ease-out), box-shadow 220ms var(--ease-out);
  }

  .catalog-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .catalog-card header {
    display: grid;
    gap: 0.75rem;
  }

  .catalog-card__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .catalog-card h3 {
    margin: 0;
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    line-height: 1.1;
  }

  .catalog-card__description {
    margin: 0;
    color: var(--text-secondary);
  }

  .catalog-features {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 1rem;
  }

  .catalog-features li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.9rem;
    align-items: start;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--bg-muted) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 65%, transparent);
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--voyage-blue) 16%, transparent);
    color: var(--voyage-blue);
  }

  .catalog-features strong {
    display: block;
    font-weight: var(--weight-semibold);
  }

  .catalog-features p {
    margin: 0.35rem 0 0;
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .catalog-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .catalog-card__meta {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  @media (max-width: 640px) {
    .catalog-card__footer {
      flex-direction: column;
      align-items: stretch;
    }
  }

  :global([data-base-theme='dark']) .catalog-card {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 55%, rgba(255, 255, 255, 0.12) 45%);
    box-shadow: var(--shadow-md);
    background: color-mix(in srgb, rgba(8, 12, 20, 0.88) 70%, rgba(var(--voyage-blue-rgb), 0.22) 30%);
  }

  :global([data-base-theme='dark']) .catalog-features li {
    background: color-mix(in srgb, rgba(12, 18, 30, 0.82) 70%, rgba(var(--voyage-blue-rgb), 0.2) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.28) 60%, rgba(255, 255, 255, 0.12) 40%);
  }
</style>
