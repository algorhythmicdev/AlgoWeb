<script lang="ts">
  import { _, json } from 'svelte-i18n';
  import en from '$lib/i18n/en.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  type CTAConfig = {
    eyebrow: string;
    title: string;
    text: string;
    primary: string;
    secondary: string;
    points: string[];
  };

  const fallbackCta: CTAConfig = {
    eyebrow: en.home?.cta?.eyebrow ?? 'Keep exploring',
    title: en.home?.cta?.title ?? 'Stay in our orbit',
    text:
      en.home?.cta?.text ??
      'Join the calm OS community for roadmap drops, pilot invites, and accessibility rituals.',
    primary: en.home?.cta?.primary ?? 'Join the community',
    secondary: en.home?.cta?.secondary ?? 'Arrange a strategy session',
    points: Array.isArray(en.home?.cta?.points)
      ? en.home.cta.points.filter((point): point is string => typeof point === 'string')
      : []
  };

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const resolvePoints = (): string[] => {
    const value = $json?.('home.cta.points');
    if (Array.isArray(value)) {
      const points = value
        .map((point, index) => ensureString(point, fallbackCta.points[index] ?? ''))
        .filter(Boolean);
      if (points.length) return points;
    }

    return fallbackCta.points;
  };

  $: eyebrow = ensureString($_('home.cta.eyebrow'), fallbackCta.eyebrow);
  $: title = ensureString($_('home.cta.title'), fallbackCta.title);
  $: text = ensureString($_('home.cta.text'), fallbackCta.text);
  $: primaryCta = ensureString($_('home.cta.primary'), fallbackCta.primary);
  $: secondaryCta = ensureString($_('home.cta.secondary'), fallbackCta.secondary);
  $: points = resolvePoints();
</script>

<section class="cta section" id="orbit" use:revealOnScroll>
  <div class="container">
    <div class="cta-shell" role="region" aria-labelledby="cta-heading">
      <div class="cta-surface glass-card" data-variant="halo">
        <div class="cta-inner">
          <div class="cta-copy">
            {#if eyebrow}
              <span class="cta-eyebrow">{eyebrow}</span>
            {/if}

            <h2 id="cta-heading">{title}</h2>

            {#if text}
              <p class="cta-text">{text}</p>
            {/if}

            {#if points.length}
              <ul class="cta-points">
                {#each points as point, index}
                  <li class="cta-point">
                    <span class="cta-point__icon" aria-hidden="true"></span>
                    <span class="cta-point__text">{point}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>

          <div class="cta-actions" role="group" aria-label={$_('nav.talk_to_us')} use:staggerReveal={{ stagger: 120 }}>
            <a class="cta-action cta-action--primary" href="/community">
              <span>{primaryCta}</span>
            </a>
            <a class="cta-action cta-action--secondary" href="/consulting">
              <span>{secondaryCta}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .cta {
    padding-block: clamp(4rem, 12vw, 6rem);
    position: relative;
  }

  .cta-shell {
    position: relative;
  }

  .cta-shell::before,
  .cta-shell::after {
    content: '';
    position: absolute;
    inset: -12% -20% auto;
    height: clamp(14rem, 26vw, 20rem);
    background: radial-gradient(
      circle at 20% 30%,
      color-mix(in oklab, var(--grad-a) 34%, transparent) 0%,
      transparent 70%
    );
    opacity: 0.55;
    filter: blur(42px);
    z-index: 0;
    animation: float var(--duration-hero, 22s) ease-in-out infinite alternate;
  }

  .cta-shell::after {
    inset: auto -25% -30%;
    background: radial-gradient(
      circle at 70% 50%,
      color-mix(in oklab, var(--grad-b) 28%, transparent) 0%,
      transparent 68%
    );
    animation-duration: calc(var(--duration-hero, 22s) * 1.4);
  }

  .cta-surface {
    position: relative;
    overflow: hidden;
  }

  .cta-inner {
    position: relative;
    z-index: 1;
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.6rem);
    padding: clamp(2.4rem, 6vw, 3.4rem);
  }

  .cta-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 1rem;
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in oklab, var(--border) 64%, transparent);
    background: color-mix(in oklab, var(--bg-elev-2) 86%, transparent 14%);
    color: var(--text-tertiary);
  }

  .cta-eyebrow::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, var(--voyage-blue) 0%, transparent 70%);
  }

  h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 2.8rem);
    line-height: 1.1;
    background: var(--gradient-heading);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .cta-text {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.08rem, 2.4vw, 1.28rem);
    line-height: 1.6;
    text-wrap: balance;
  }

  .cta-points {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.85rem;
  }

  .cta-point {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    color: var(--text-secondary);
  }

  .cta-point__icon {
    width: 14px;
    height: 14px;
    margin-top: 0.35rem;
    border-radius: 6px;
    background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
    box-shadow: 0 4px 12px rgba(19, 81, 255, 0.28);
  }

  .cta-point__text {
    flex: 1;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .cta-action {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    padding: 0.95rem 1.8rem;
    border-radius: var(--radius-full);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    transition: transform 180ms var(--ease-out-soft), box-shadow 180ms var(--ease-out-soft);
  }

  .cta-action--primary {
    background: linear-gradient(135deg, var(--voyage-blue), var(--aurora-purple));
    color: #fff;
    box-shadow: 0 22px 38px rgba(19, 81, 255, 0.28);
  }

  .cta-action--primary:hover,
  .cta-action--primary:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 26px 44px rgba(19, 81, 255, 0.36);
  }

  .cta-action--secondary {
    border: 1px solid color-mix(in oklab, var(--border) 62%, transparent);
    background: color-mix(in oklab, var(--bg-elev-1) 86%, transparent 14%);
    color: var(--voyage-blue);
  }

  .cta-action--secondary:hover,
  .cta-action--secondary:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(10, 13, 20, 0.14);
  }

  .cta-action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
    outline-offset: 3px;
  }

  @keyframes float {
    from {
      transform: translate3d(0, -3%, 0) scale(1);
    }

    to {
      transform: translate3d(0, 3%, 0) scale(1.04);
    }
  }

  @media (max-width: 720px) {
    .cta-inner {
      padding: clamp(1.9rem, 5vw, 2.4rem);
    }

    .cta-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .cta-action {
      width: 100%;
    }
  }

  :global(html[data-theme='hc']) .cta-shell::before,
  :global(html[data-theme='hc']) .cta-shell::after {
    display: none;
  }

  :global(html[data-theme='hc']) .cta-surface {
    background: var(--bg-elev-1);
    border: 2px solid var(--border);
    box-shadow: none;
  }

  :global(html[data-theme='hc']) h2 {
    background: none;
    color: var(--text);
  }

  :global(html[data-theme='hc']) .cta-action--primary {
    background: var(--text);
    color: var(--bg);
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .cta-action--secondary {
    background: var(--bg-elev-1);
    border-color: var(--border);
    color: var(--text);
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .cta-shell::before,
    .cta-shell::after {
      animation: none;
    }

    .cta-action,
    .cta-action--primary,
    .cta-action--secondary {
      transition: none;
      transform: none !important;
      box-shadow: none !important;
    }
  }
</style>
