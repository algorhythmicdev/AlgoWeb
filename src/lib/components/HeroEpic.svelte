<script lang="ts">
  import { onMount } from 'svelte';
  import { base as appBase, asset } from '$app/paths';
  import ParticleSystem from './ParticleSystem.svelte';
  import MeshGradient from './MeshGradient.svelte';
  import { ripple } from '$lib/directives/ripple';
  
  export let title = 'Welcome';
  export let subtitle = '';
  export let description = '';
  export let ctaLabel = '';
  export let ctaHref = '';
  export let secondaryCtaLabel = '';
  export let secondaryCtaHref = '';
  export let variant: 'neural' | 'quantum' | 'cyber' | 'matrix' | 'coral' | 'minimal' = 'neural';
  export let particleType: 'neural' | 'dots' | 'matrix' | 'waves' | 'minimal' | 'none' = 'dots';
  export let size: 'default' | 'large' | 'epic' = 'default';
  export let videoSrc: string | null = null;
  export let videoPoster: string | null = null;
  
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  
  $: primaryHref = isExternal(ctaHref)
    ? ctaHref
    : ctaHref === '/'
      ? appBase || '/'
      : `${appBase}${ctaHref}`;
      
  $: secondaryHref = isExternal(secondaryCtaHref)
    ? secondaryCtaHref
    : secondaryCtaHref === '/'
      ? appBase || '/'
      : `${appBase}${secondaryCtaHref}`;
  
  $: videoUrl = videoSrc ? asset(videoSrc) : null;
  $: posterUrl = videoPoster ? asset(videoPoster) : null;
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<section 
  class="hero-section hero-{size} halo-{variant} gradient-{variant}"
  class:mounted
  class:has-video={videoUrl}
>
  {#if videoUrl}
    <div class="hero-video-container">
      <video
        class="hero-video"
        poster={posterUrl}
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      >
        <source src={videoUrl} type="video/webm" />
      </video>
      <div class="hero-video-overlay"></div>
    </div>
  {:else}
    <MeshGradient {variant} opacity={size === 'epic' ? 0.15 : size === 'large' ? 0.13 : 0.12} />
    
    {#if particleType !== 'none'}
      <ParticleSystem variant={particleType} density="medium" speed={0.8} />
    {/if}
  {/if}
  
  <div class="hero-content container">
    <div class="hero-text">
      {#if subtitle}
        <p class="hero-subtitle">{subtitle}</p>
      {/if}
      
      <h1 class="hero-title">{title}</h1>
      
      {#if description}
        <p class="hero-description">{description}</p>
      {/if}
      
      {#if ctaLabel || secondaryCtaLabel}
        <div class="hero-actions">
          {#if ctaLabel}
            <a 
              href={primaryHref} 
              class="btn btn-primary btn-hero"
              use:ripple
            >
              {ctaLabel}
            </a>
          {/if}
          
          {#if secondaryCtaLabel}
            <a 
              href={secondaryHref} 
              class="btn btn-secondary btn-hero"
            >
              {secondaryCtaLabel}
            </a>
          {/if}
        </div>
      {/if}
    </div>
    
    <slot />
  </div>
</section>

<style>
  .hero-section {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem 5rem;
    overflow: hidden;
    isolation: isolate;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  
  /* Variant-specific subtle gradients */
  .hero-section.halo-neural {
    background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--ai-neural-1) 3%, var(--bg)) 100%);
  }
  
  .hero-section.halo-quantum {
    background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--ai-quantum-1) 3%, var(--bg)) 100%);
  }
  
  .hero-section.halo-cyber {
    background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--ai-cyber-1) 3%, var(--bg)) 100%);
  }
  
  .hero-section.halo-matrix {
    background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--ai-matrix-1) 3%, var(--bg)) 100%);
  }
  
  .hero-section.halo-coral {
    background: linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--ai-coral-1) 3%, var(--bg)) 100%);
  }
  
  .hero-large {
    min-height: 70vh;
    padding: 8rem 2rem 5rem;
  }
  
  .hero-epic {
    min-height: 85vh;
    padding: 10rem 2rem 6rem;
  }
  
  .hero-default {
    /* Uses the base min-height from .hero-section */
  }
  
  .hero-content {
    position: relative;
    z-index: var(--z-content, 10);
    width: 100%;
    max-width: 1200px;
    opacity: 0;
    transition: opacity var(--anim-fast, 300ms) ease;
  }
  
  .mounted .hero-content {
    opacity: 1;
  }
  
  .hero-text {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .hero-subtitle {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    color: var(--halo-color-2, var(--primary));
    margin: 0 0 1rem;
    opacity: 0.9;
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 1.5rem;
    background: linear-gradient(
      135deg,
      var(--text-strong),
      var(--halo-color-1, var(--primary))
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-description {
    font-size: clamp(1.125rem, 2vw, 1.5rem);
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0 0 2.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-hero {
    padding: 0.875rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 14px;
    transition: 
      transform var(--anim-fast, 200ms) var(--ease-apple),
      box-shadow var(--anim-fast, 200ms) var(--ease-apple);
  }
  
  .btn-hero:hover {
    transform: translateY(-2px);
  }
  
  .btn-hero:active {
    transform: translateY(0);
  }
  
  .btn-secondary {
    background: var(--bg-elev-1);
    border: 1px solid var(--control-border);
    color: var(--text-strong);
  }
  
  .btn-secondary:hover {
    background: var(--bg-elev-2);
    box-shadow: var(--shadow-medium);
  }
  
  @media (max-width: 768px) {
    .hero-section {
      min-height: 50vh;
      padding: 4rem 1.5rem 3rem;
    }
    
    .hero-title {
      font-size: clamp(2rem, 8vw, 3rem);
    }
    
    .hero-description {
      font-size: 1rem;
    }
    
    .btn-hero {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }
  }
  
  /* Video background styles */
  .hero-video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }
  
  .hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }
  
  .hero-video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.5) 100%
    );
    z-index: 1;
  }
  
  .has-video .hero-content {
    z-index: 2;
  }
  
  .has-video .hero-title,
  .has-video .hero-description {
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
  
  .has-video .hero-title {
    -webkit-text-fill-color: white;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0.9)
    );
    -webkit-background-clip: text;
    background-clip: text;
  }
  
  .has-video .hero-description {
    color: rgba(255, 255, 255, 0.95);
  }
  
  .has-video .hero-subtitle {
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .hero-content {
      opacity: 1;
      transition: none;
    }
  }
</style>
