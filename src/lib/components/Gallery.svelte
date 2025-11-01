<script lang="ts">
  import { onMount } from 'svelte';
  import AssetImage from './AssetImage.svelte';
  import CardHalo from './CardHalo.svelte';
  import RevealOnScroll from './RevealOnScroll.svelte';
  
  export let items: Array<{ src: string | null; alt: string }> = [];
  export let halo: 'neural' | 'quantum' | 'cyber' | 'matrix' | 'coral' = 'cyber';
  export let columns: 2 | 3 | 4 = 3;
  
  let selectedIndex = -1;
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
  
  function openLightbox(index: number) {
    selectedIndex = index;
  }
  
  function closeLightbox() {
    selectedIndex = -1;
  }
  
  function nextImage() {
    if (items.length === 0) return;
    selectedIndex = (selectedIndex + 1) % items.length;
  }
  
  function prevImage() {
    if (items.length === 0) return;
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (selectedIndex === -1) return;
    
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'ArrowLeft') prevImage();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="gallery grid-{columns}" class:mounted>
  {#each items as item, i}
    <RevealOnScroll animation="scale" delay={100 * (i + 1)}>
      <button
        class="gallery-item"
        on:click={() => openLightbox(i)}
        aria-label="View {item.alt}"
      >
        <CardHalo {halo} glass interactive>
          <AssetImage src={item.src} alt={item.alt} />
        </CardHalo>
      </button>
    </RevealOnScroll>
  {/each}
</div>

{#if selectedIndex >= 0 && selectedIndex < items.length}
  <div class="lightbox" on:click={closeLightbox} on:keydown={(e) => e.key === 'Escape' && closeLightbox()} role="dialog" tabindex="0" aria-modal="true" aria-label="Image viewer">
    <button class="lightbox-close" on:click={closeLightbox} aria-label="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
    
    <button class="lightbox-nav lightbox-prev" on:click|stopPropagation={prevImage} aria-label="Previous">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    
    <div class="lightbox-content">
      <img src={items[selectedIndex].src || ''} alt={items[selectedIndex].alt} />
      <p class="lightbox-caption">{items[selectedIndex].alt}</p>
    </div>
    
    <button class="lightbox-nav lightbox-next" on:click|stopPropagation={nextImage} aria-label="Next">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>
{/if}

<style>
  .gallery {
    display: grid;
    gap: 1.5rem;
    opacity: 0;
    transition: opacity var(--anim-normal, 400ms) var(--ease-apple, ease);
  }
  
  .gallery.mounted {
    opacity: 1;
  }
  
  .grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
  
  .gallery-item {
    all: unset;
    cursor: pointer;
    display: block;
    transition: transform var(--anim-fast, 200ms) var(--ease-apple, ease);
  }
  
  .gallery-item:hover {
    transform: translateY(-4px);
  }
  
  .gallery-item:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 4px;
    border-radius: 12px;
  }
  
  /* Lightbox */
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn var(--anim-fast, 200ms) var(--ease-apple, ease);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: scaleIn var(--anim-normal, 400ms) var(--ease-apple, ease);
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .lightbox-content img {
    max-width: 100%;
    max-height: calc(90vh - 4rem);
    object-fit: contain;
    border-radius: 12px;
    box-shadow: var(--shadow-epic);
  }
  
  .lightbox-caption {
    text-align: center;
    color: white;
    font-size: 1rem;
    font-weight: 500;
  }
  
  .lightbox-close,
  .lightbox-nav {
    all: unset;
    position: absolute;
    cursor: pointer;
    color: white;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--anim-fast, 200ms) var(--ease-apple, ease);
  }
  
  .lightbox-close {
    top: 2rem;
    right: 2rem;
  }
  
  .lightbox-close:hover,
  .lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  .lightbox-prev {
    left: 2rem;
  }
  
  .lightbox-next {
    right: 2rem;
  }
  
  @media (max-width: 768px) {
    .lightbox {
      padding: 1rem;
    }
    
    .lightbox-close {
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
    }
    
    .lightbox-nav {
      width: 40px;
      height: 40px;
    }
    
    .lightbox-prev {
      left: 1rem;
    }
    
    .lightbox-next {
      right: 1rem;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .gallery,
    .lightbox,
    .lightbox-content {
      animation: none;
      transition: none;
    }
  }
</style>
