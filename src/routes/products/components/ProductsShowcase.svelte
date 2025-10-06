<script>
  import { onMount } from 'svelte';
  import { ProductDemoPreview } from '$lib/components';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  export let title = '';
  export let subtitle = '';
  export let demos = /** @type {Array<{ id: string; title: string; description: string; host: string; href: string; cta: string; accent: 'aurora' | 'voyage' }>} */ (
    []
  );

  let activeDemo = demos[0]?.id;

  onMount(() => {
    if (!activeDemo && demos.length) {
      activeDemo = demos[0].id;
    }
  });

  $: if (demos.length && !demos.find((demo) => demo.id === activeDemo)) {
    activeDemo = demos[0]?.id;
  }

  $: activeDemoData = demos.find((demo) => demo.id === activeDemo);
</script>

<section class="products-showcase section" id="demos" use:revealOnScroll>
  <div class="container">
    <header class="showcase-header" use:staggerReveal={{ stagger: 90 }}>
      {#if title}
        <h2>{title}</h2>
      {/if}
      {#if subtitle}
        <p>{subtitle}</p>
      {/if}
    </header>

    <div class="showcase-layout">
      {#if demos.length > 1}
        <div class="showcase-tabs" role="tablist" aria-label={title}>
          {#each demos as demo, index (demo.id)}
            <button
              type="button"
              class:active={demo.id === activeDemo}
              role="tab"
              aria-selected={demo.id === activeDemo}
              tabindex={demo.id === activeDemo ? 0 : -1}
              aria-controls={`demo-panel-${demo.id}`}
              id={`demo-tab-${demo.id}`}
              on:click={() => (activeDemo = demo.id)}
            >
              <span class="tab-index">{index + 1}</span>
              <span class="tab-label">{demo.title}</span>
            </button>
          {/each}
        </div>
      {/if}

      {#if activeDemoData}
        <div
          class="showcase-panel"
          role="tabpanel"
          aria-labelledby={`demo-tab-${activeDemoData.id}`}
          id={`demo-panel-${activeDemoData.id}`}
          use:staggerReveal={{ delay: 120, stagger: 110 }}
        >
          <ProductDemoPreview
            title={activeDemoData.title}
            description={activeDemoData.description}
            host={activeDemoData.host}
            href={activeDemoData.href}
            cta={activeDemoData.cta}
            accent={activeDemoData.accent}
          />
        </div>
      {/if}

      {#if demos.length > 1}
        <div class="showcase-meta" use:staggerReveal={{ delay: 160, stagger: 90 }}>
          <ul>
            {#each demos as demo (demo.id)}
              <li class:active={demo.id === activeDemo}>
                <div class="meta-heading">
                  <span>{demo.title}</span>
                  {#if demo.host}
                    <small>{demo.host}</small>
                  {/if}
                </div>
                {#if demo.description}
                  <p>{demo.description}</p>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .products-showcase {
    position: relative;
    padding: clamp(4rem, 10vw, 6.5rem) 0;
  }

  .products-showcase::before {
    content: '';
    position: absolute;
    inset: 12% 6% auto;
    height: clamp(12rem, 28vw, 18rem);
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.18), rgba(var(--aurora-purple-rgb), 0.12));
    filter: blur(120px);
    opacity: 0.6;
    pointer-events: none;
  }

  .showcase-header {
    display: grid;
    gap: clamp(0.6rem, 1.8vw, 1rem);
    max-width: 680px;
    margin-bottom: clamp(2rem, 5vw, 3rem);
  }

  .showcase-header h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 2.6rem);
  }

  .showcase-header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  }

  .showcase-layout {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.8rem);
  }

  .showcase-tabs {
    display: inline-flex;
    gap: 0.6rem;
    padding: 0.45rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 65%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    width: fit-content;
  }

  .showcase-tabs button {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 1.2rem;
    border-radius: var(--radius-full);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-weight: var(--weight-medium);
    cursor: pointer;
    transition: background 220ms var(--ease-out), color 220ms var(--ease-out);
  }

  .showcase-tabs button:hover,
  .showcase-tabs button:focus-visible {
    background: color-mix(in srgb, var(--voyage-blue) 18%, transparent);
    color: var(--text-primary);
    outline: none;
  }

  .showcase-tabs button.active {
    background: var(--gradient-sheen);
    color: var(--text-on-gradient);
  }

  .tab-index {
    font-variant-numeric: tabular-nums;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .tab-label {
    white-space: nowrap;
  }

  .showcase-panel {
    display: grid;
  }

  .showcase-meta ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 1rem;
  }

  .showcase-meta li {
    padding: 1.2rem 1.4rem;
    border-radius: var(--radius-xl);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 65%, transparent);
    background: color-mix(in srgb, var(--bg-muted) 72%, transparent);
    transition: border-color 220ms var(--ease-out), transform 220ms var(--ease-out);
  }

  .showcase-meta li.active {
    border-color: color-mix(in srgb, var(--voyage-blue) 30%, rgba(255, 255, 255, 0.65) 70%);
    transform: translateY(-4px);
  }

  .showcase-meta p {
    margin: 0.4rem 0 0;
    color: var(--text-secondary);
  }

  .meta-heading {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    font-weight: var(--weight-semibold);
  }

  .meta-heading small {
    color: var(--text-tertiary);
    font-size: 0.85rem;
  }

  @media (min-width: 960px) {
    .showcase-layout {
      grid-template-columns: minmax(0, 0.45fr) minmax(0, 1fr);
      align-items: start;
    }

    .showcase-panel {
      grid-column: 2;
    }

    .showcase-meta {
      grid-column: 1;
      grid-row: span 2;
      position: sticky;
      top: clamp(6rem, 14vw, 8rem);
    }
  }

  @media (max-width: 720px) {
    .showcase-tabs {
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
    }

    .showcase-tabs button {
      flex: 1 1 auto;
      justify-content: center;
    }
  }

  :global([data-theme='dark']) .products-showcase::before {
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.25), rgba(var(--aurora-purple-rgb), 0.2));
    opacity: 0.5;
  }

  :global([data-theme='dark']) .showcase-meta li {
    background: color-mix(in srgb, rgba(12, 18, 30, 0.85) 70%, rgba(var(--voyage-blue-rgb), 0.25) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.28) 60%, rgba(255, 255, 255, 0.12) 40%);
  }
</style>
