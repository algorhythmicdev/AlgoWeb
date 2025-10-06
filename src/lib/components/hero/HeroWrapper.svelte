<script>
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  export let id = 'hero';
  export let showAside = true;
  export let introReveal = { stagger: 110 };
  export let asideReveal = { delay: 140, stagger: 130 };
  export let containerClass = '';
  export let introClass = '';
  export let asideClass = '';
  export let className = '';
  export let element = null;

  /** @type {Record<string, any>} */
  let restProps = {};
  let externalClass = '';

  $: ({ class: externalClass = '', ...restProps } = $$restProps);
  $: sectionClass = ['hero-wrapper', className, externalClass].filter(Boolean).join(' ');
</script>

<section class={sectionClass} id={id} bind:this={element} use:revealOnScroll {...restProps}>
  <slot name="backdrop" />
  <div class={`container hero-wrapper__shell ${containerClass}`}>
    <div class={`hero-wrapper__intro ${introClass}`} use:staggerReveal={introReveal}>
      <slot name="status" />
      <slot name="title" />
      <slot name="lead" />
      <slot name="description" />
      <slot name="actions" />
      <slot name="highlights" />
      <slot name="metrics" />
      <slot />
    </div>
    {#if showAside}
      <aside class={`hero-wrapper__aside ${asideClass}`} use:staggerReveal={asideReveal}>
        <slot name="aside" />
      </aside>
    {/if}
  </div>
</section>

<style>
  .hero-wrapper {
    --hero-padding-block-start: clamp(5.5rem, 11vw, 9rem);
    --hero-padding-block-end: clamp(4rem, 10vw, 7rem);
    --hero-backdrop-inset: clamp(-7rem, -12vw, -3rem) 0 auto;
    --hero-backdrop-height: clamp(14rem, 38vw, 28rem);
    --hero-backdrop-gradient: var(--gradient-hero);
    --hero-backdrop-blur: 140px;
    --hero-backdrop-opacity: 0.62;
    --hero-backdrop-opacity-light: 0.72;
    --hero-backdrop-opacity-dark: 0.48;
    --hero-shell-gap: clamp(2.5rem, 5vw, 4rem);
    --hero-shell-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    --hero-shell-align: start;
    --hero-intro-gap: clamp(1.4rem, 3vw, 2.2rem);
    --hero-intro-align: start;
    --hero-actions-gap: clamp(0.75rem, 1.8vw, 1rem);
    --hero-highlights-gap: 0.75rem;
    --hero-metrics-columns: 3;
    --hero-metrics-gap: clamp(1rem, 2.4vw, 1.5rem);
    --hero-aside-gap: clamp(1.5rem, 3vw, 2rem);
    position: relative;
    padding: var(--hero-padding-block-start) 0 var(--hero-padding-block-end);
    isolation: isolate;
  }

  .hero-wrapper::before {
    content: '';
    position: absolute;
    inset: var(--hero-backdrop-inset);
    height: var(--hero-backdrop-height);
    background: var(--hero-backdrop-gradient);
    opacity: var(--hero-backdrop-opacity);
    filter: blur(var(--hero-backdrop-blur));
    pointer-events: none;
    z-index: -1;
    transition: opacity 400ms var(--ease-in-out);
  }

  :global([data-theme='light']) .hero-wrapper::before {
    opacity: var(--hero-backdrop-opacity-light);
  }

  :global([data-base-theme='dark']) .hero-wrapper::before {
    opacity: var(--hero-backdrop-opacity-dark);
  }

  .hero-wrapper__shell {
    display: grid;
    gap: var(--hero-shell-gap);
    grid-template-columns: var(--hero-shell-columns);
    align-items: var(--hero-shell-align);
  }

  .hero-wrapper__intro {
    display: grid;
    gap: var(--hero-intro-gap);
    align-content: var(--hero-intro-align);
    color: var(--text-primary);
  }

  .hero-wrapper__intro :global(.hero-actions) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--hero-actions-gap);
    align-items: center;
  }

  .hero-wrapper__intro :global(.hero-highlights) {
    display: grid;
    gap: var(--hero-highlights-gap);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .hero-wrapper__intro :global(.hero-metrics) {
    display: grid;
    grid-template-columns: repeat(var(--hero-metrics-columns), minmax(0, 1fr));
    gap: var(--hero-metrics-gap);
  }

  .hero-wrapper__aside {
    display: grid;
    gap: var(--hero-aside-gap);
    align-content: start;
    color: var(--text-secondary);
  }

  :global([data-theme='contrast']) .hero-wrapper::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(0, 0, 0, 0.88) 100%);
    opacity: 0.82;
  }

  @media (max-width: 1024px) {
    .hero-wrapper__shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .hero-wrapper__aside {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .hero-wrapper {
      --hero-padding-block-start: clamp(4.5rem, 18vw, 6rem);
      --hero-padding-block-end: clamp(3rem, 12vw, 5rem);
    }
  }
</style>
