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
  {#if hasLabel}
    <span class="section-divider__label">{trimmedLabel}</span>
  {/if}
</div>

<style>
  .section-divider {
    position: relative;
    --section-divider-width: 1040px;
    width: min(100%, var(--section-divider-width));
    margin: var(--space-4xl) auto;
    display: grid;
    place-items: center;
    padding: var(--space-lg) var(--space-xl);
    --divider-accent: rgba(var(--voyage-blue-rgb), 0.68);
    --divider-secondary: rgba(var(--aurora-purple-rgb), 0.58);
    --divider-highlight: rgba(var(--signal-yellow-rgb), 0.48);
    --divider-base: rgba(255, 255, 255, 0.22);
    isolation: isolate;
  }

  .section-divider__blur {
    position: absolute;
    inset: calc(var(--space-md) * -1);
    border-radius: var(--radius-2xl);
    background: radial-gradient(
      ellipse at center,
      color-mix(in srgb, var(--divider-accent) 28%, transparent 72%) 0%,
      color-mix(in srgb, var(--divider-secondary) 22%, transparent 78%) 45%,
      transparent 85%
    );
    box-shadow: var(--shadow-glass-lg);
    filter: blur(32px);
    opacity: 0.72;
  }

  .section-divider__line {
    position: absolute;
    inset-inline: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in srgb, var(--divider-accent) 85%, var(--divider-base) 15%) 18%,
      color-mix(in srgb, var(--divider-secondary) 82%, var(--divider-highlight) 18%) 50%,
      color-mix(in srgb, var(--divider-highlight) 78%, var(--divider-base) 22%) 82%,
      transparent 100%
    );
    box-shadow: 0 0 24px color-mix(in srgb, var(--divider-accent) 45%, transparent 55%),
                0 8px 16px rgba(var(--ink-rgb), 0.12);
  }

  .section-divider__label {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 1.1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--glass-bg-lightest) 42%, transparent 58%);
    border: 1px solid color-mix(in srgb, var(--glass-border) 60%, transparent 40%);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.6)) saturate(1.02);
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.6)) saturate(1.02);
    font-size: var(--text-label);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: color-mix(in srgb, rgb(var(--voyage-blue-rgb)) 58%, rgba(255, 255, 255, 0.88) 42%);
  }

  .section-divider--aurora {
    --divider-accent: rgba(var(--aurora-purple-rgb), 0.75);
    --divider-secondary: rgba(var(--voyage-blue-rgb), 0.65);
    --divider-highlight: rgba(190, 210, 255, 0.58);
  }

  .section-divider--citrus {
    --divider-accent: rgba(var(--signal-yellow-rgb), 0.78);
    --divider-secondary: rgba(var(--voyage-blue-rgb), 0.62);
    --divider-highlight: rgba(255, 233, 185, 0.62);
  }

  .section-divider--voyage {
    --divider-accent: rgba(var(--voyage-blue-rgb), 0.78);
    --divider-secondary: rgba(var(--aurora-purple-rgb), 0.62);
    --divider-highlight: rgba(140, 196, 255, 0.56);
  }

  .section-divider--cherry {
    --divider-accent: rgba(var(--cherry-pop-rgb), 0.78);
    --divider-secondary: rgba(var(--aurora-purple-rgb), 0.64);
    --divider-highlight: rgba(255, 202, 209, 0.62);
  }

  .section-divider--neutral {
    --divider-accent: rgba(140, 160, 200, 0.62);
    --divider-secondary: rgba(180, 196, 226, 0.52);
    --divider-highlight: rgba(255, 255, 255, 0.48);
  }

  :global([data-base-theme='dark']) .section-divider__label {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.92) 70%, rgba(255, 255, 255, 0.08) 30%);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.22) 55%, rgba(var(--graphite-rgb), 0.6) 45%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.9) 70%, rgb(var(--voyage-blue-rgb)) 30%);
  }

  :global(html[data-theme='hc']) .section-divider__blur {
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
      margin-block: var(--space-3xl);
    }

    .section-divider__line {
      inset-inline: var(--space-lg);
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
