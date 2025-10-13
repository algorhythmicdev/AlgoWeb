<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const hero = {
    title: 'NodeVoyage',
    subtitle:
      'Fun. Travel. Memories. Community. Your AI travel companion that keeps every explorer in the loop.',
    description:
      'Describe your dream journey and Nodi orchestrates an itinerary with accessibility, sustainability, and surprise in mind. Plan with friends in real time, translate signs on the go, and capture stories that outlast the flight home.',
    primaryCta: {
      href: '#explorers-club',
      label: 'Join the Explorers Club'
    },
    secondaryCta: {
      href: '/solutions',
      label: 'Back to solutions overview'
    }
  } as const;

  const featureCards = [
    {
      icon: 'map',
      title: 'Smart Trip Planner',
      copy:
        'Tell Nodi how you want to feel on your next adventure. NodeVoyage balances hidden gems with essentials, optimises routes, and adjusts for mobility or sensory needs automatically.'
    },
    {
      icon: 'people',
      title: 'Collaborative Crews',
      copy:
        'Invite family, friends, or classmates into a shared travel canvas. Vote on ideas, track who is editing, and keep everyone aligned with calm notifications.'
    },
    {
      icon: 'device',
      title: 'AR Translation & Capture',
      copy:
        'Use the mobile app to translate menus, capture audio notes, or pin AR “memory anchors” to revisit favourite spots later.'
    },
    {
      icon: 'target',
      title: 'Eco & Community Missions',
      copy:
        'Earn badges for low-impact choices, community storytelling, and cultural challenges curated with local partners.'
    },
    {
      icon: 'idea',
      title: 'Travel Journal & Reel',
      copy:
        'After the trip, NodeVoyage weaves your photos, notes, and check-ins into a shareable story or highlight reel—always with edit controls and privacy toggles.'
    }
  ] as const;

  const roadmap = [
    {
      phase: 'Alpha launch',
      timing: 'April 2026',
      details:
        'First wave of explorers test collaborative itineraries, AR translation, and sustainability missions alongside our team.'
    },
    {
      phase: 'Public beta',
      timing: 'June 2026',
      details:
        'Expanded language support, travel journal exports, and integrations with accessibility partners land for summer adventures.'
    },
    {
      phase: 'Community rollout',
      timing: 'Late 2026',
      details:
        'Goal of 10,000 travellers across Latvia and neighbouring regions, with classroom pilots and tourism collaborations.'
    }
  ] as const;

  const differentiators = [
    {
      icon: 'bolt',
      title: 'AI that explains itself',
      copy: 'Every itinerary comes with plain-language reasoning, accessible alternatives, and opt-out controls.'
    },
    {
      icon: 'chart',
      title: 'Inclusive by default',
      copy: 'AAA contrast themes, reduced-motion support, and multi-language content are core—not add-ons.'
    },
    {
      icon: 'package',
      title: 'Built with partners',
      copy: 'Co-designed with travel educators, accessibility advocates, and signage specialists from Ideju Kauss programmes.'
    }
  ] as const;

  let explorerEmail = '';
  let explorerName = '';
  let explorerStatus: 'idle' | 'error' | 'success' = 'idle';
  let explorerError = '';

  const resetExplorerStatus = () => {
    if (explorerStatus !== 'idle') explorerStatus = 'idle';
    explorerError = '';
  };

  const handleExplorerSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const trimmedEmail = explorerEmail.trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      explorerStatus = 'error';
      explorerError = 'Add a valid email so we can send your invite.';
      return;
    }

    const namePart = explorerName.trim() ? `Name: ${explorerName.trim()}%0A` : '';
    const subject = encodeURIComponent('NodeVoyage Explorers Club signup');
    const body = encodeURIComponent(`${namePart}Email: ${trimmedEmail}`);
    window.location.href = `mailto:help@algorhythmics.com?subject=${subject}&body=${body}`;
    explorerStatus = 'success';
    explorerName = '';
    explorerEmail = '';
  };
</script>

<Hero variant="aurora" align="center" title={hero.title} subtitle={hero.subtitle}>
  <svelte:fragment slot="description">
    <p>{hero.description}</p>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href={hero.primaryCta.href} variant="gradient" size="lg">{hero.primaryCta.label}</Button>
      <Button href={hero.secondaryCta.href} variant="secondary" size="lg">{hero.secondaryCta.label}</Button>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="highlights">
    <div class="hero-highlights">
      <div>
        <span class="hero-eyebrow">Status</span>
        <strong>Alpha in progress</strong>
      </div>
      <div>
        <span class="hero-eyebrow">Focus</span>
        <strong>Collaborative, sustainable travel</strong>
      </div>
      <div>
        <span class="hero-eyebrow">Next milestone</span>
        <strong>Public beta · June 2026</strong>
      </div>
    </div>
  </svelte:fragment>
</Hero>

<section class="section section--features" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title">What makes NodeVoyage different?</h2>
    <p class="section-lead">
      NodeVoyage feels like a playful travel OS: windowed layouts, frosted panels, and an AI buddy who keeps plans tidy
      while celebrating spontaneity.
    </p>

    <div class="feature-grid" use:staggerReveal>
      {#each featureCards as card (card.title)}
        <GlassCard class="feature-card" halo padding="lg" interactive>
          <div class="feature-icon" aria-hidden="true">
            <Icon name={card.icon} size={28} />
          </div>
          <h3>{card.title}</h3>
          <p>{card.copy}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section section--roadmap" use:revealOnScroll>
  <div class="container roadmap">
    <div>
      <span class="section-eyebrow">Roadmap</span>
      <h2>2026 journey</h2>
      <p>
        We are building NodeVoyage out in the open. Each phase brings more collaborative magic while reinforcing accessibility,
        localisation, and transparent AI coaching.
      </p>
    </div>
    <ol class="roadmap-list">
      {#each roadmap as item (item.phase)}
        <li class="roadmap-item">
          <GlassCard padding="md">
            <span class="roadmap-phase">{item.phase}</span>
            <span class="roadmap-timing">{item.timing}</span>
            <p>{item.details}</p>
          </GlassCard>
        </li>
      {/each}
    </ol>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section section--differentiators" use:revealOnScroll>
  <div class="container differentiators">
    <div class="differentiators-copy">
      <span class="section-eyebrow">Why explorers stay</span>
      <h2>Calm, trustworthy travel intelligence</h2>
      <p>
        NodeVoyage blends signage-inspired clarity with travel storytelling. It is approachable for first-time travellers and
        powerful for adventure planners who want deeper context.
      </p>
      <Button href="/contact" variant="gradient">Partner with us</Button>
    </div>
    <div class="differentiators-grid" use:staggerReveal>
      {#each differentiators as item (item.title)}
        <GlassCard padding="md" class="differentiator-card" halo>
          <div class="feature-icon" aria-hidden="true">
            <Icon name={item.icon} size={26} />
          </div>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="voyage" />

<section id="explorers-club" class="section explorers section--explorers" use:revealOnScroll>
  <div class="container">
    <GlassCard class="explorers-card" padding="lg" particles>
      <span class="section-eyebrow">NodeVoyage Explorers Club</span>
      <h2>Be first aboard the beta</h2>
      <p>
        Leave your details to receive early access invites, mission briefs, and behind-the-scenes updates as we prepare the
        public beta. We keep emails minimal and never share your contact.
      </p>

      <form class="explorers-form" on:submit={handleExplorerSubmit}>
        <div class="form-field">
          <label for="explorer-name">Name (optional)</label>
          <input
            id="explorer-name"
            name="name"
            type="text"
            bind:value={explorerName}
            on:input={resetExplorerStatus}
          />
        </div>

        <div class="form-field">
          <label for="explorer-email">Email</label>
          <input
            id="explorer-email"
            name="email"
            type="email"
            bind:value={explorerEmail}
            required
            aria-invalid={explorerStatus === 'error' ? 'true' : 'false'}
            on:input={resetExplorerStatus}
          />
          {#if explorerStatus === 'error' && explorerError}
            <span class="field-error">{explorerError}</span>
          {/if}
        </div>

        <Button type="submit" variant="gradient" size="lg">Request invite</Button>

        {#if explorerStatus === 'success'}
          <p class="success">Thanks! We just opened your email client so you can confirm the request.</p>
        {/if}
      </form>

      <p class="privacy-note">
        By joining, you agree to receive NodeVoyage development updates. You can unsubscribe anytime and we will only use your
        email for these messages.
      </p>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section cta section--cta" use:revealOnScroll>
  <div class="container">
    <GlassCard class="cta-card" padding="lg" halo>
      <h2>Curious about Ideonautix too?</h2>
      <p>
        If you are exploring NodeVoyage for team retreats or student programmes, take a look at Ideonautix—our startup OS that
        keeps creative projects on track. Both platforms share the same inclusive design system.
      </p>
      <div class="cta-actions">
        <Button href="/ideonautix" variant="secondary">Explore Ideonautix</Button>
        <Button href="/contact" variant="gradient">Talk to our team</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .section {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: clamp(3rem, 8vw, 5rem) 0;
  }

  .section > .container {
    position: relative;
    z-index: 1;
  }

  .section::before,
  .section::after {
    content: '';
    position: absolute;
    inset: -18% -18% -24% -18%;
    border-radius: clamp(36px, 7vw, 64px);
    pointer-events: none;
    opacity: 0.85;
    z-index: 0;
  }

  .section::after {
    background-image: var(--grain, var(--grain-texture));
    background-size: 280px 280px;
    mix-blend-mode: soft-light;
    opacity: 0.08;
  }

  .section--features::before {
    background:
      radial-gradient(85% 95% at 18% 18%, rgba(var(--voyage-blue-rgb), 0.32), transparent 70%),
      radial-gradient(60% 80% at 78% 26%, rgba(var(--aurora-purple-rgb), 0.28), transparent 72%),
      linear-gradient(140deg, rgba(var(--signal-yellow-rgb), 0.24), transparent 62%);
    animation: voyageDrift 46s ease-in-out infinite alternate;
  }

  .section--roadmap::before {
    inset: -24% -26% -30% -26%;
    border-radius: clamp(42px, 9vw, 72px);
    background:
      conic-gradient(from 200deg, rgba(var(--voyage-blue-rgb), 0.2), rgba(var(--aurora-purple-rgb), 0.24), rgba(var(--voyage-blue-rgb), 0.18), rgba(var(--signal-yellow-rgb), 0.18), rgba(var(--aurora-purple-rgb), 0.22));
    mask: radial-gradient(88% 88% at 48% 20%, rgba(0, 0, 0, 0.82), transparent 82%);
    animation: mapSweep 54s linear infinite;
  }

  .section--differentiators::before {
    background:
      radial-gradient(70% 90% at 18% 32%, rgba(var(--signal-yellow-rgb), 0.2), transparent 72%),
      radial-gradient(80% 110% at 82% 12%, rgba(var(--voyage-blue-rgb), 0.28), transparent 76%),
      linear-gradient(160deg, rgba(var(--aurora-purple-rgb), 0.22), transparent 58%);
    animation: voyageDrift 52s ease-in-out infinite alternate-reverse;
  }

  .section--explorers::before {
    inset: -22% -18% -26% -18%;
    border-radius: clamp(40px, 8vw, 68px);
    background:
      radial-gradient(95% 110% at 20% 24%, rgba(var(--voyage-blue-rgb), 0.32), transparent 74%),
      radial-gradient(75% 105% at 78% 18%, rgba(var(--signal-yellow-rgb), 0.2), transparent 72%),
      linear-gradient(180deg, rgba(var(--ink-rgb), 0.12), transparent 72%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--voyage-blue) 26%, transparent 74%);
  }

  .section--cta::before {
    inset: -18% -22% -30% -22%;
    border-radius: clamp(48px, 10vw, 80px);
    background:
      radial-gradient(120% 120% at 12% 18%, rgba(var(--aurora-purple-rgb), 0.26), transparent 74%),
      radial-gradient(85% 110% at 84% 20%, rgba(var(--voyage-blue-rgb), 0.26), transparent 72%),
      linear-gradient(120deg, rgba(var(--signal-yellow-rgb), 0.18), transparent 60%);
    animation: voyageDrift 40s ease-in-out infinite;
  }

  .section--roadmap::after {
    opacity: 0.06;
  }

  .section--explorers::after {
    opacity: 0.1;
  }

  .section-title {
    font-family: var(--font-heading, 'Montserrat', sans-serif);
    font-size: clamp(2.1rem, 5vw, 2.9rem);
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
  }

  .section-lead {
    max-width: 48ch;
    margin-bottom: clamp(2rem, 6vw, 3rem);
    color: var(--text-secondary, color-mix(in srgb, var(--text) 80%, transparent 20%));
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .hero-highlights {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    text-align: left;
  }

  .hero-eyebrow {
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.75rem;
    color: var(--text-tertiary, color-mix(in srgb, var(--text) 65%, transparent 35%));
    margin-bottom: 0.25rem;
  }

  .feature-grid {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.5rem);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  :global(.feature-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.18) 12%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 40%, transparent 60%);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 68%, var(--aurora-purple) 32%);
  }

  :global(.feature-card) h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  :global(.feature-card) p {
    color: var(--text-secondary, color-mix(in srgb, var(--text) 78%, transparent 22%));
  }

  .feature-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 16px;
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.15) 70%, rgba(255, 255, 255, 0.8) 30%);
    display: grid;
    place-items: center;
    margin-bottom: 1rem;
    color: var(--nodevoyage-highlight, var(--signal-yellow));
  }

  .feature-icon :global(svg) {
    color: inherit;
  }

  .roadmap {
    display: grid;
    gap: clamp(2rem, 6vw, 3rem);
    align-items: start;
  }

  .roadmap-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 1.5rem;
  }

  .roadmap-item::marker {
    content: '';
  }

  .roadmap-phase {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .roadmap-timing {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: var(--text-tertiary, color-mix(in srgb, var(--text) 62%, transparent 38%));
    margin-bottom: 0.5rem;
  }

  .differentiators {
    display: grid;
    gap: clamp(2rem, 6vw, 3.5rem);
    align-items: start;
  }

  .differentiators-copy {
    display: grid;
    gap: 1rem;
  }

  .differentiators-grid {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.4rem);
  }

  :global(.differentiator-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--voyage-blue-rgb), 0.15) 10%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 36%, transparent 64%);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 62%, var(--signal-yellow) 38%);
  }

  :global(.differentiator-card) h3 {
    margin-bottom: 0.5rem;
  }

  :global(.explorers-card) {
    display: grid;
    gap: 1.5rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 86%, rgba(var(--voyage-blue-rgb), 0.2) 14%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 42%, transparent 58%);
    --surface-glass-shadow: 0 28px 70px rgba(14, 28, 54, 0.26);
    --focus-ring-color: color-mix(in srgb, var(--signal-yellow) 58%, var(--voyage-blue) 42%);
  }

  .explorers-form {
    display: grid;
    gap: 1.25rem;
    max-width: 520px;
  }

  .form-field {
    display: grid;
    gap: 0.5rem;
  }

  .form-field label {
    font-weight: 600;
  }

  .form-field input {
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent 20%);
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: color-mix(in srgb, var(--bg-elev-1) 96%, rgba(var(--voyage-blue-rgb), 0.06) 4%);
    color: var(--text);
  }

  .form-field input:focus {
    outline: 3px solid color-mix(in srgb, var(--nodevoyage-highlight) 70%, var(--voyage-blue) 30%);
    outline-offset: 3px;
  }

  .field-error {
    color: var(--cherry-pop, #e0322c);
    font-size: 0.9rem;
  }

  .success {
    color: var(--nodevoyage-highlight, var(--signal-yellow));
    font-weight: 600;
  }

  .privacy-note {
    font-size: 0.95rem;
    color: var(--text-tertiary, color-mix(in srgb, var(--text) 60%, transparent 40%));
  }

  :global(.cta-card) {
    display: grid;
    gap: 1.2rem;
    text-align: center;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.22) 12%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 38%, transparent 62%);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 66%, var(--aurora-purple) 34%);
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  @keyframes voyageDrift {
    0% {
      transform: translate3d(-2%, -1%, 0) scale(1.02) rotate(-1deg);
    }

    50% {
      transform: translate3d(1.5%, 1.5%, 0) scale(1.04) rotate(1deg);
    }

    100% {
      transform: translate3d(-1%, 2%, 0) scale(1.01) rotate(-0.6deg);
    }
  }

  @keyframes mapSweep {
    0% {
      transform: rotate(0deg) scale(1.08);
    }

    100% {
      transform: rotate(360deg) scale(1.08);
    }
  }

  @media (min-width: 960px) {
    .roadmap {
      grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
    }

    .differentiators {
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
    }

    .differentiators-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .section::before {
      animation: none;
    }

    :global(.feature-card),
    :global(.differentiator-card),
    :global(.explorers-card),
    :global(.cta-card) {
      transition: none;
    }
  }
</style>
