<script lang="ts">
  import { _, json } from 'svelte-i18n';
  import en from '$lib/i18n/en.json';
  import { Button, GlassCard } from '$lib/components';
  import { revealOnScroll } from '$lib/animations';

  type CTAConfig = {
    eyebrow: string;
    title: string;
    community: string;
    consulting: string;
    primary: string;
    secondary: string;
    points: string[];
  };

  const fallbackCta: CTAConfig = {
    eyebrow: en.home?.cta?.eyebrow ?? 'Keep exploring',
    title: 'Stay in our orbit',
    community:
      en.home?.cta?.text ??
      'Get monthly roadmap notes, accessibility tips, and early access invites across NodeVoyage and Ideonautix.',
    consulting:
      'Prefer a guided walkthrough? Book a calm strategy chat and we will map your next steps together.',
    primary: en.home?.cta?.primary ?? 'Join the community',
    secondary: en.home?.cta?.secondary ?? 'Book a calm strategy chat',
    points: Array.isArray(en.home?.cta?.points)
      ? en.home.cta.points.filter((point): point is string => typeof point === 'string')
      : []
  };

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const resolvePoints = (): string[] => {
    const value = $json?.('home.cta.points');
    const unique = (source: string[]) => Array.from(new Set(source)).filter(Boolean).slice(0, 3);

    if (Array.isArray(value)) {
      const cleaned = value
        .map((point, index) => ensureString(point, fallbackCta.points[index] ?? ''))
        .filter(Boolean);
      if (cleaned.length) {
        return unique(cleaned);
      }
    }

    return unique(fallbackCta.points);
  };

  $: eyebrow = ensureString($_('home.cta.eyebrow'), fallbackCta.eyebrow);
  $: title = ensureString($_('home.cta.title'), fallbackCta.title);
  $: communityText = ensureString($_('home.cta.text'), fallbackCta.community);
  $: consultingText = ensureString($_('home.cta.consulting'), fallbackCta.consulting);
  $: primaryCta = ensureString($_('home.cta.primary'), fallbackCta.primary);
  $: secondaryCta = ensureString($_('home.cta.secondary'), fallbackCta.secondary);
  $: points = resolvePoints();
  $: actionsLabel = ensureString($_('nav.talk_to_us'), 'Talk with us');
</script>

<section class="cta section" id="orbit" use:revealOnScroll>
  <div class="container">
    <GlassCard class="cta-card" padding="lg">
      <header class="cta-card__header">
        {#if eyebrow}
          <span class="cta-eyebrow">{eyebrow}</span>
        {/if}
        <h2>{title}</h2>
      </header>

      <div class="cta-card__copy">
        <p>{communityText}</p>
        <p>{consultingText}</p>
      </div>

      {#if points.length}
        <ul class="cta-points">
          {#each points as point}
            <li>
              <span class="cta-point__icon" aria-hidden="true"></span>
              <span>{point}</span>
            </li>
          {/each}
        </ul>
      {/if}

      <div class="cta-actions" role="group" aria-label={actionsLabel}>
        <Button variant="gradient" href="/community">
          <span>{primaryCta}</span>
        </Button>
        <Button variant="secondary" href="/consulting">
          <span>{secondaryCta}</span>
        </Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .cta {
    padding-block: clamp(4rem, 12vw, 6rem);
  }

  :global(.cta-card) {
    display: grid;
    gap: clamp(1.6rem, 4vw, 2.2rem);
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--voyage-blue-rgb), 0.12) 6%);
    --surface-glass-border: color-mix(in srgb, var(--border) 70%, transparent 30%);
  }

  .cta-card__header {
    display: grid;
    gap: 0.8rem;
  }

  .cta-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--border) 70%, transparent 30%);
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .cta-card__header h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 2.6rem);
  }

  .cta-card__copy {
    display: grid;
    gap: 0.9rem;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.25rem);
    line-height: 1.6;
  }

  .cta-points {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.8rem;
  }

  .cta-points li {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: var(--weight-medium);
  }

  .cta-point__icon {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, var(--voyage-blue) 0%, transparent 70%);
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--voyage-blue) 18%, transparent 82%);
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .cta-actions :global(.button) {
    min-width: clamp(200px, 36vw, 240px);
  }

  @media (max-width: 720px) {
    .cta-actions :global(.button) {
      width: 100%;
    }
  }
</style>
