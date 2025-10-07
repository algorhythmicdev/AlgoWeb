<script>
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  export let title = '';
  export let text = '';
  export let primaryLabel = '';
  export let secondaryLabel = '';
  export let primaryHref = '#';
  export let secondaryHref = '#';
</script>

<section class="products-cta section" use:revealOnScroll>
  <div class="container">
    <div class="cta-card" use:staggerReveal={{ stagger: 120 }}>
      <div class="cta-copy">
        {#if title}
          <h2>{title}</h2>
        {/if}
        {#if text}
          <p>{text}</p>
        {/if}
      </div>
      <div class="cta-actions">
        {#if primaryLabel}
          <a href={primaryHref} class="btn btn-gradient">{primaryLabel}</a>
        {/if}
        {#if secondaryLabel}
          <a href={secondaryHref} class="btn btn-secondary">{secondaryLabel}</a>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .products-cta {
    padding: clamp(3.5rem, 9vw, 5.5rem) 0 clamp(4rem, 10vw, 6rem);
  }

  .cta-card {
    display: grid;
    gap: clamp(1.6rem, 3.4vw, 2.2rem);
    padding: clamp(2.2rem, 4vw, 3.2rem);
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 68%, transparent);
    background: color-mix(in srgb, var(--surface-glass) 75%, transparent);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(20px);
  }

  .cta-copy {
    display: grid;
    gap: 0.8rem;
  }

  .cta-copy h2 {
    margin: 0;
    font-size: clamp(1.9rem, 3.6vw, 2.6rem);
  }

  .cta-copy p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (max-width: 640px) {
    .cta-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }

  :global([data-base-theme='dark']) .cta-card {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 55%, rgba(255, 255, 255, 0.12) 45%);
    box-shadow: var(--shadow-md);
    background: color-mix(in srgb, rgba(8, 12, 20, 0.88) 70%, rgba(var(--voyage-blue-rgb), 0.22) 30%);
  }
</style>
