<script lang="ts">
  type SectionDividerTone = 'neutral' | 'voyage' | 'aurora' | 'citrus' | 'cherry';
  export let tone: SectionDividerTone = 'neutral';
  export let label: string | null = null;

  $: trimmedLabel = typeof label === 'string' ? label.trim() : '';
  $: hasLabel = trimmedLabel.length > 0;
  $: toneClass = `section-divider--${tone}`;
  $: ariaLabel = hasLabel ? trimmedLabel : undefined;
</script>

<div
  class={`section-divider ${toneClass}`}
  role="separator"
  aria-label={ariaLabel}
  aria-hidden={hasLabel ? undefined : 'true'}
>
  <div class="section-divider__blur" aria-hidden="true"></div>
  <div class="section-divider__line" aria-hidden="true"></div>
  <div class="section-divider__grain" aria-hidden="true"></div>
  {#if hasLabel}
    <span class="section-divider__label">{trimmedLabel}</span>
  {/if}
</div>

<style>
  .section-divider {
    position: relative;
    width: min(100%, var(--section-divider-width, 1040px));
    margin: clamp(3rem, 8vw, 5rem) auto;
    display: grid;
    place-items: center;
    padding: clamp(0.75rem, 3vw, 1.5rem) clamp(1.5rem, 5vw, 2.5rem);
    --divider-accent: rgba(var(--voyage-blue-rgb), 0.45);
    --divider-secondary: rgba(var(--aurora-purple-rgb), 0.34);
    --divider-highlight: rgba(var(--signal-yellow-rgb), 0.3);
    --divider-base: rgba(255, 255, 255, 0.12);
    isolation: isolate;
  }

  .section-divider__blur {
    position: absolute;
    inset: 0;
    border-radius: clamp(2rem, 6vw, 3rem);
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--divider-accent) 72%, transparent 28%) 0%,
      color-mix(in srgb, var(--divider-secondary) 68%, transparent 32%) 52%,
      color-mix(in srgb, var(--divider-highlight) 62%, transparent 38%) 100%
    );
    opacity: 0.75;
    filter: blur(28px);
    animation: section-divider-shimmer 24s ease-in-out infinite alternate;
  }

  .section-divider__line {
    position: absolute;
    inset-inline: clamp(1.5rem, 8vw, 6rem);
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in srgb, var(--divider-accent) 60%, var(--divider-base) 40%) 18%,
      color-mix(in srgb, var(--divider-secondary) 55%, var(--divider-base) 45%) 50%,
      color-mix(in srgb, var(--divider-highlight) 50%, var(--divider-base) 50%) 82%,
      transparent 100%
    );
    box-shadow: 0 0 32px rgba(14, 18, 36, 0.18);
  }

  .section-divider__grain {
    position: absolute;
    inset: -1px;
    border-radius: clamp(2rem, 6vw, 3rem);
    background-image: var(--grain, var(--grain-texture));
    opacity: 0.06;
    mix-blend-mode: soft-light;
  }

  .section-divider__label {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1.25rem;
    border-radius: 999px;
    background: color-mix(in srgb, rgba(255, 255, 255, 0.08) 55%, rgba(14, 18, 36, 0.38) 45%);
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.38) 60%, rgba(14, 18, 36, 0.32) 40%);
    backdrop-filter: blur(18px) saturate(1.05);
    -webkit-backdrop-filter: blur(18px) saturate(1.05);
    font-size: var(--text-label, 0.75rem);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: color-mix(in srgb, rgb(var(--voyage-blue-rgb)) 65%, rgba(255, 255, 255, 0.9) 35%);
  }

  .section-divider--aurora {
    --divider-accent: rgba(var(--aurora-purple-rgb), 0.58);
    --divider-secondary: rgba(var(--voyage-blue-rgb), 0.45);
    --divider-highlight: rgba(190, 210, 255, 0.36);
  }

  .section-divider--citrus {
    --divider-accent: rgba(var(--signal-yellow-rgb), 0.58);
    --divider-secondary: rgba(var(--voyage-blue-rgb), 0.42);
    --divider-highlight: rgba(255, 233, 185, 0.42);
  }

  .section-divider--voyage {
    --divider-accent: rgba(var(--voyage-blue-rgb), 0.6);
    --divider-secondary: rgba(var(--aurora-purple-rgb), 0.38);
    --divider-highlight: rgba(140, 196, 255, 0.32);
  }

  .section-divider--cherry {
    --divider-accent: rgba(var(--cherry-pop-rgb), 0.6);
    --divider-secondary: rgba(var(--aurora-purple-rgb), 0.4);
    --divider-highlight: rgba(255, 202, 209, 0.38);
  }

  .section-divider--neutral {
    --divider-accent: rgba(140, 160, 200, 0.4);
    --divider-secondary: rgba(180, 196, 226, 0.32);
    --divider-highlight: rgba(255, 255, 255, 0.25);
  }

  :global([data-base-theme='dark']) .section-divider__label {
    background: color-mix(in srgb, rgba(12, 18, 36, 0.72) 70%, rgba(255, 255, 255, 0.08) 30%);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.22) 55%, rgba(12, 18, 36, 0.6) 45%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.9) 70%, rgb(var(--voyage-blue-rgb)) 30%);
  }

  :global(html[data-theme='hc']) .section-divider__blur,
  :global(html[data-theme='hc']) .section-divider__grain {
    display: none;
  }

  :global(html[data-theme='hc']) .section-divider__line {
    background: color-mix(in srgb, currentColor 65%, transparent 35%);
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .section-divider__label {
    background: transparent;
    border-color: currentColor;
    color: currentColor;
  }

  @media (max-width: 768px) {
    .section-divider {
      margin-block: clamp(2.5rem, 10vw, 3.5rem);
    }

    .section-divider__line {
      inset-inline: clamp(1rem, 8vw, 3rem);
    }
  }

  @keyframes section-divider-shimmer {
    0% {
      transform: translate3d(-4%, 0, 0) scale(1);
      opacity: 0.65;
    }
    50% {
      transform: translate3d(4%, 0, 0) scale(1.02);
      opacity: 0.78;
    }
    100% {
      transform: translate3d(-3%, 0, 0) scale(1);
      opacity: 0.7;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .section-divider__blur {
      animation: none;
    }
  }
</style>
