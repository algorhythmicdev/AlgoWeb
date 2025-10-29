<script lang="ts">
  export let variant: 'gradient' | 'pulse' | 'wave' | 'particles' | 'simple' = 'gradient';
  export let theme: 'neural' | 'quantum' | 'cyber' | 'matrix' | 'mixed' = 'neural';
  export let spacing: 'compact' | 'normal' | 'spacious' = 'normal';
</script>

<div 
  class="divider-wrapper spacing-{spacing}"
  aria-hidden="true"
>
  <div class="animated-divider variant-{variant} theme-{theme}">
    {#if variant === 'particles'}
      <div class="divider-particle"></div>
      <div class="divider-particle"></div>
      <div class="divider-particle"></div>
    {/if}
  </div>
</div>

<style>
  .divider-wrapper {
    width: 100%;
    overflow: hidden;
  }
  
  .spacing-compact {
    margin: 1rem 0;
  }
  
  .spacing-normal {
    margin: 2rem 0;
  }
  
  .spacing-spacious {
    margin: 3rem 0;
  }
  
  .animated-divider {
    position: relative;
    height: 2px;
    width: 100%;
  }
  
  /* Gradient variant */
  .variant-gradient {
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--halo-color-1, var(--primary)) 20%,
      var(--halo-color-2, var(--accent-1)) 50%,
      var(--halo-color-1, var(--primary)) 80%,
      transparent 100%
    );
    opacity: 0.5;
  }
  
  .variant-gradient::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -20%;
    width: 30%;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--halo-color-2, var(--accent-1)),
      transparent
    );
    filter: blur(4px);
    animation: sweep-divider 3s ease-in-out infinite;
  }
  
  @keyframes sweep-divider {
    0% {
      transform: translateX(0);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(400%);
      opacity: 0;
    }
  }
  
  /* Pulse variant */
  .variant-pulse {
    background: var(--halo-color-1, var(--primary));
    opacity: 0.3;
  }
  
  .variant-pulse::before {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    animation: pulse-divider 2s ease-in-out infinite;
  }
  
  @keyframes pulse-divider {
    0%, 100% {
      transform: scaleX(0.8);
      opacity: 0.3;
    }
    50% {
      transform: scaleX(1);
      opacity: 0.6;
    }
  }
  
  /* Wave variant */
  .variant-wave {
    background: transparent;
    height: 20px;
  }
  
  .variant-wave::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--halo-color-1, var(--primary)) 50%,
      transparent 100%
    );
    clip-path: polygon(
      0% 50%,
      10% 30%,
      20% 50%,
      30% 70%,
      40% 50%,
      50% 30%,
      60% 50%,
      70% 70%,
      80% 50%,
      90% 30%,
      100% 50%
    );
    opacity: 0.4;
    animation: wave-divider 4s ease-in-out infinite;
  }
  
  @keyframes wave-divider {
    0%, 100% {
      transform: translateX(0) scaleY(1);
    }
    50% {
      transform: translateX(-10%) scaleY(1.2);
    }
  }
  
  /* Particles variant */
  .variant-particles {
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--halo-color-1, var(--primary)) 50%,
      transparent 100%
    );
    opacity: 0.3;
  }
  
  .divider-particle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--halo-color-2, var(--accent-1));
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    animation: particle-travel 3s ease-in-out infinite;
  }
  
  .divider-particle:nth-child(1) {
    animation-delay: 0s;
  }
  
  .divider-particle:nth-child(2) {
    animation-delay: 1s;
  }
  
  .divider-particle:nth-child(3) {
    animation-delay: 2s;
  }
  
  @keyframes particle-travel {
    0% {
      left: 0%;
      opacity: 0;
      transform: translateY(-50%) scale(0);
    }
    10% {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
    90% {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
    100% {
      left: 100%;
      opacity: 0;
      transform: translateY(-50%) scale(0);
    }
  }
  
  /* Simple variant */
  .variant-simple {
    background: linear-gradient(
      90deg,
      transparent,
      var(--divider) 10%,
      var(--divider) 90%,
      transparent
    );
    opacity: 0.6;
  }
  
  /* Theme colors */
  .theme-neural {
    --halo-color-1: var(--ai-neural-1);
    --halo-color-2: var(--ai-neural-2);
  }
  
  .theme-quantum {
    --halo-color-1: var(--ai-quantum-1);
    --halo-color-2: var(--ai-quantum-2);
  }
  
  .theme-cyber {
    --halo-color-1: var(--ai-cyber-1);
    --halo-color-2: var(--ai-cyber-2);
  }
  
  .theme-matrix {
    --halo-color-1: var(--ai-matrix-1);
    --halo-color-2: var(--ai-matrix-2);
  }
  
  .theme-mixed {
    --halo-color-1: var(--ai-neural-1);
    --halo-color-2: var(--ai-cyber-1);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .variant-gradient::after,
    .variant-pulse::before,
    .variant-wave::before,
    .divider-particle {
      animation: none;
    }
    
    .variant-gradient,
    .variant-pulse,
    .variant-wave,
    .variant-particles {
      opacity: 0.5;
    }
  }
  
  :root[data-theme="high-contrast"] .animated-divider {
    background: var(--border);
    opacity: 1;
  }
  
  :root[data-theme="high-contrast"] .animated-divider::before,
  :root[data-theme="high-contrast"] .animated-divider::after,
  :root[data-theme="high-contrast"] .divider-particle {
    display: none;
  }
</style>
