<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const hero = {
    title: 'Ideonautix',
    subtitle: 'Explore. Invent. Launch. Your modular AI workspace for founders, students, and creative teams.',
    description:
      'Ideonautix keeps momentum steady with copilots for pitching, research, and focus. Build presentations, run experiments, and manage rituals with explainable AI nudges that honour your process.',
    primaryCta: {
      href: '#pilot-request',
      label: 'Request pilot access'
    },
    secondaryCta: {
      href: '/solutions',
      label: 'Back to solutions overview'
    }
  } as const;

  const modules = [
    {
      icon: 'idea',
      title: 'Pitch Deck Assistant',
      copy:
        'Answer a short creative brief and Ideonautix drafts slides, speaker notes, and evidence to fit your audience—with transparent citations and edit history.'
    },
    {
      icon: 'chart',
      title: 'Competitive Dashboard',
      copy:
        'Track market shifts, competitor releases, and trend digests curated for your vertical. Summaries stay human-readable and exportable.'
    },
    {
      icon: 'bolt',
      title: 'Pomodoro Coach',
      copy:
        'Keep your rhythm with adaptive focus sessions, break prompts, and gentle accountability nudges based on your schedule.'
    },
    {
      icon: 'package',
      title: 'Workflow Library',
      copy:
        'Mix-and-match canvases for OKRs, research sprints, and retrospectives. Each template includes guidance drawn from our consulting rituals.'
    },
    {
      icon: 'ai',
      title: 'AI Brainstorm',
      copy:
        'Bounce ideas with a multilingual AI co-founder trained on ethical innovation playbooks. Every suggestion ships with rationale and references.'
    }
  ] as const;

  const useCases = [
    {
      name: 'Anna · Student entrepreneur',
      story:
        'Anna used Ideonautix to map a sustainable fashion concept. The pitch assistant built a grant-ready deck, while Pomodoro Coach kept her team on track for demo day.'
    },
    {
      name: 'SafeRide · Mobility startup',
      story:
        'SafeRide analysed competitors and regulatory news through the dashboard, rapidly iterated prototypes, and walked into investor meetings with confidence.'
    }
  ] as const;

  let pilotName = '';
  let pilotEmail = '';
  let pilotRole = 'founder';
  let pilotMessage = '';
  let pilotStatus: 'idle' | 'error' | 'success' = 'idle';
  let pilotError = '';

  const resetPilotStatus = () => {
    if (pilotStatus !== 'idle') pilotStatus = 'idle';
    pilotError = '';
  };

  const handlePilotSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const trimmedEmail = pilotEmail.trim();
    const trimmedName = pilotName.trim();
    if (!trimmedName || !trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      pilotStatus = 'error';
      pilotError = 'Share your name and a valid email so we can reach out.';
      return;
    }

    const subject = encodeURIComponent('Ideonautix pilot request');
    const body = encodeURIComponent(
      `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nRole: ${pilotRole}\nMessage: ${pilotMessage.trim()}`
    );
    window.location.href = `mailto:help@algorhythmics.com?subject=${subject}&body=${body}`;
    pilotStatus = 'success';
    pilotName = '';
    pilotEmail = '';
    pilotMessage = '';
    pilotRole = 'founder';
  };
</script>

<Hero variant="halo" align="center" title={hero.title} subtitle={hero.subtitle}>
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
        <strong>Pilot onboarding · Q1 2026</strong>
      </div>
      <div>
        <span class="hero-eyebrow">Modules</span>
        <strong>Pitch · Intelligence · Focus · Library</strong>
      </div>
      <div>
        <span class="hero-eyebrow">Promise</span>
        <strong>Explainable AI for builders</strong>
      </div>
    </div>
  </svelte:fragment>
</Hero>

<section class="section" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title">Tools that keep ideas moving</h2>
    <p class="section-lead">
      Ideonautix pairs playful visuals with serious operations. Every module lives inside a windowed workspace so you can drag,
      resize, and focus without losing the bigger picture.
    </p>

    <div class="module-grid" use:staggerReveal>
      {#each modules as module (module.title)}
        <GlassCard class="module-card" halo padding="lg" interactive>
          <div class="module-icon" aria-hidden="true">
            <Icon name={module.icon} size={28} />
          </div>
          <h3>{module.title}</h3>
          <p>{module.copy}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section" use:revealOnScroll>
  <div class="container status">
    <GlassCard class="status-card" padding="lg">
      <span class="section-eyebrow">Status & invitation</span>
      <h2>Pilot in early 2026</h2>
      <p>
        We are inviting a small circle of founders, educators, and student teams to shape Ideonautix. Pilot members test modules,
        share feedback in live sessions, and receive lifetime discounts when we launch publicly in spring 2026.
      </p>
      <ul class="status-list">
        <li>Multilingual interface: English & Latvian at pilot, Russian in beta.</li>
        <li>AAA contrast themes and reduced-motion support mirror our design system.</li>
        <li>All AI suggestions include citations and exportable audit trails.</li>
      </ul>
      <Button href="#pilot-request" variant="gradient">Join the pilot waitlist</Button>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section" use:revealOnScroll>
  <div class="container use-cases">
    <div class="use-cases-copy">
      <span class="section-eyebrow">Use cases</span>
      <h2>Stories from the lab</h2>
      <p>
        Ideonautix was born from our consulting rituals. Each pilot builds on real problems founders and educators face when they
        lack clear documentation or accessible AI support.
      </p>
    </div>
    <div class="use-cases-grid" use:staggerReveal>
      {#each useCases as story (story.name)}
        <GlassCard padding="md" class="use-case-card" halo>
          <h3>{story.name}</h3>
          <p>{story.story}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="cherry" />

<section id="pilot-request" class="section pilot" use:revealOnScroll>
  <div class="container">
    <GlassCard class="pilot-card" padding="lg" particles>
      <span class="section-eyebrow">Pilot access</span>
      <h2>Request an invite</h2>
      <p>
        Share a few details and we will follow up with onboarding options. We reply within one business day and respect your
        privacy—data is only used to coordinate pilot participation.
      </p>

      <form class="pilot-form" on:submit={handlePilotSubmit}>
        <div class="form-grid">
          <label>
            <span>Name</span>
            <input type="text" bind:value={pilotName} required on:input={resetPilotStatus} />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              bind:value={pilotEmail}
              required
              aria-invalid={pilotStatus === 'error' ? 'true' : 'false'}
              on:input={resetPilotStatus}
            />
          </label>

          <label>
            <span>Role</span>
            <select bind:value={pilotRole} on:change={resetPilotStatus}>
              <option value="founder">Founder / startup team</option>
              <option value="student">Student team</option>
              <option value="educator">Educator / mentor</option>
              <option value="other">Other collaborator</option>
            </select>
          </label>
        </div>

        <label>
          <span>What would you like to explore?</span>
          <textarea rows="4" bind:value={pilotMessage} on:input={resetPilotStatus}></textarea>
        </label>

        {#if pilotStatus === 'error' && pilotError}
          <p class="field-error">{pilotError}</p>
        {/if}

        <Button type="submit" variant="gradient" size="lg">Submit request</Button>

        {#if pilotStatus === 'success'}
          <p class="success">Thank you! We just opened an email draft—send it to confirm your spot.</p>
        {/if}
      </form>

      <p class="privacy-note">
        We only use the information you provide to coordinate pilot access. You can opt out at any time by emailing
        help@algorhythmics.com.
      </p>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section cta" use:revealOnScroll>
  <div class="container">
    <GlassCard class="cta-card" padding="lg" halo>
      <h2>Need hands-on support?</h2>
      <p>
        Our consulting team helps adapt Ideonautix modules for enterprise or education partners. We can tailor workflows, build
        governance, and train your crews.
      </p>
      <div class="cta-actions">
        <Button href="/consulting" variant="secondary">Consulting services</Button>
        <Button href="/contact" variant="gradient">Chat with us</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .section {
    padding: clamp(3rem, 8vw, 5rem) 0;
  }

  .section-title {
    font-family: var(--font-heading, 'Montserrat', sans-serif);
    font-size: clamp(2.1rem, 5vw, 2.9rem);
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
  }

  .section-lead {
    max-width: 52ch;
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

  .module-grid {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.5rem);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  :global(.module-card) h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  :global(.module-card) p {
    color: var(--text-secondary, color-mix(in srgb, var(--text) 78%, transparent 22%));
  }

  .module-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 16px;
    background: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.18) 70%, rgba(255, 255, 255, 0.82) 30%);
    display: grid;
    place-items: center;
    margin-bottom: 1rem;
    color: var(--ideonautix-accent, var(--aurora-purple));
  }

  .status {
    display: grid;
    gap: 2rem;
  }

  :global(.status-card) {
    display: grid;
    gap: 1.25rem;
  }

  .status-list {
    margin: 0;
    padding-left: 1.5rem;
    display: grid;
    gap: 0.5rem;
    color: var(--text-secondary, color-mix(in srgb, var(--text) 75%, transparent 25%));
  }

  .use-cases {
    display: grid;
    gap: clamp(2rem, 6vw, 3.5rem);
    align-items: start;
  }

  .use-cases-grid {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.4rem);
  }

  :global(.pilot-card) {
    display: grid;
    gap: 1.5rem;
  }

  .pilot-form {
    display: grid;
    gap: 1.5rem;
    max-width: 620px;
  }

  .form-grid {
    display: grid;
    gap: 1rem;
  }

  .form-grid label,
  .pilot-form label {
    display: grid;
    gap: 0.5rem;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent 20%);
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: color-mix(in srgb, var(--bg-elev-1) 96%, rgba(var(--aurora-purple-rgb), 0.08) 4%);
    color: var(--text);
  }

  textarea {
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 3px solid color-mix(in srgb, var(--ideonautix-accent, var(--aurora-purple)) 70%, var(--cherry-pop) 30%);
    outline-offset: 3px;
  }

  .field-error {
    color: var(--cherry-pop, #e0322c);
  }

  .success {
    color: var(--ideonautix-accent, var(--aurora-purple));
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
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  @media (min-width: 720px) {
    .form-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (min-width: 960px) {
    .use-cases {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    }

    .use-cases-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.module-card),
    :global(.status-card),
    :global(.use-case-card),
    :global(.pilot-card),
    :global(.cta-card) {
      transition: none;
    }
  }
</style>
