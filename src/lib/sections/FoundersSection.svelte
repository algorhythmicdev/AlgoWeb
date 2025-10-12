<script lang="ts">
  import { _, json } from 'svelte-i18n';
  import { GlassCard } from '$lib/components';
  import foundersData from '$data/founders.json';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import en from '$lib/i18n/en.json';

  const founderKeys = /** @type {const} */ (['nikita', 'slaff']);

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;
  const ensureArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((item) => ensureString(item)).filter(Boolean) : [];

  const fallbackLabels = {
    expertise: 'Core strengths',
    achievements: 'Recent wins',
    contact: 'Direct lines'
  } as const;

  $: expertiseLabel = ensureString($_('home.founders.labels.expertise'), fallbackLabels.expertise);
  $: achievementsLabel = ensureString($_('home.founders.labels.achievements'), fallbackLabels.achievements);
  $: contactLabel = ensureString($_('home.founders.labels.contact'), fallbackLabels.contact);

  const toProfile = (key: (typeof founderKeys)[number]) => {
    const fallback = (foundersData as Record<string, any>)[key] ?? {};
    const translationBase = `home.founders.${key}`;

    const expertiseFromTranslations = ensureArray($json?.(`${translationBase}.expertise`));
    const achievementsFromData = ensureArray(fallback.currentPosition?.achievements).slice(0, 3);

    const focusLabelFallback =
      key === 'nikita'
        ? en.home?.founders?.nikita?.current_title
        : en.home?.founders?.slaff?.current_title;
    const focusFallback =
      key === 'nikita'
        ? en.home?.founders?.nikita?.current_position
        : en.home?.founders?.slaff?.position;

    return {
      key,
      avatar: ensureString(fallback.avatar, ''),
      name: ensureString($_(`${translationBase}.name`), ensureString(fallback.name, key)),
      role: ensureString($_(`${translationBase}.role`), ensureString(fallback.role, 'Founder')),
      bio: ensureString($_(`${translationBase}.bio`), ensureString(fallback.bio, '')),
      focusLabel: ensureString(
        $_(`${translationBase}.current_title`),
        ensureString(focusLabelFallback, 'Current focus')
      ),
      focus: ensureString(
        key === 'nikita'
          ? $_('home.founders.nikita.current_position')
          : $_('home.founders.slaff.position'),
        ensureString(focusFallback, '')
      ),
      expertise: expertiseFromTranslations.length
        ? expertiseFromTranslations
        : ensureArray(fallback.expertise).slice(0, 4),
      achievements: achievementsFromData,
      email: ensureString(fallback.email, ''),
      linkedin: ensureString(fallback.linkedin, '')
    };
  };

  $: founderProfiles = founderKeys.map((key) => toProfile(key));
  $: headerEyebrow = ensureString(
    $_('home.founders.subtitle'),
    'Two makers blending signage craft with calm AI'
  );
  $: headerTitle = ensureString($_('home.founders.title'), 'Meet the founders');
  $: headerLead = ensureString(
    $_('home.founders.nikita.current_position'),
    'Calm AI grows from signage discipline and deliberate engineering.'
  );
</script>

<section class="founders section" id="founders" use:revealOnScroll>
  <div class="container founders__layout">
    <header class="founders__header">
      <span class="eyebrow surface-chip" data-tone="accent">{headerEyebrow}</span>
      <h2>{headerTitle}</h2>
      <p>{headerLead}</p>
    </header>

    <div class="founders__grid" use:staggerReveal={{ stagger: 160 }}>
      {#each founderProfiles as founder (founder.key)}
        <GlassCard as="article" class="founder-card" padding="lg">
          <div class="founder-card__header">
            <div class="founder-card__identity">
              {#if founder.avatar}
                <img class="founder-card__avatar" src={founder.avatar} alt={founder.name} loading="lazy" />
              {:else}
                <div class="founder-card__avatar founder-card__avatar--placeholder" aria-hidden="true">{founder.name.charAt(0)}</div>
              {/if}
              <div>
                <span class="founder-card__role">{founder.role}</span>
                <h3>{founder.name}</h3>
              </div>
            </div>

            <div class="founder-card__contacts" aria-label={contactLabel}>
              {#if founder.email}
                <a class="surface-pill" href={`mailto:${founder.email}`}>
                  {$_('home.founders.email_cta') || 'Email'}
                </a>
              {/if}
              {#if founder.linkedin}
                <a
                  class="surface-pill"
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  {$_('home.founders.linkedin_cta') || 'LinkedIn'}
                </a>
              {/if}
            </div>
          </div>

          {#if founder.bio}
            <p class="founder-card__bio">{founder.bio}</p>
          {/if}

          {#if founder.focus}
            <div class="founder-card__focus">
              <span class="founder-card__label">{founder.focusLabel}</span>
              <p>{founder.focus}</p>
            </div>
          {/if}

          <div class="founder-card__details">
            {#if founder.expertise.length}
              <div>
                <span class="founder-card__label">{expertiseLabel}</span>
                <ul>
                  {#each founder.expertise as item}
                    <li>{item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if founder.achievements.length}
              <div>
                <span class="founder-card__label">{achievementsLabel}</span>
                <ul>
                  {#each founder.achievements as item}
                    <li>{item}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<style>
  .founders {
    padding-block: clamp(4rem, 12vw, 6rem);
  }

  .founders__layout {
    display: grid;
    gap: clamp(2rem, 6vw, 3rem);
  }

  .founders__header {
    display: grid;
    gap: 1rem;
    max-width: 680px;
  }

  .founders__header h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 2.8rem);
  }

  .founders__header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.25rem);
    line-height: 1.6;
  }

  .founders__grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.4rem);
  }

  @media (min-width: 900px) {
    .founders__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  :global(.founder-card) {
    display: grid;
    gap: 1.2rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--aurora-purple-rgb), 0.12) 6%);
    --surface-glass-border: color-mix(in srgb, var(--border) 68%, transparent 32%);
  }

  .founder-card__header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
  }

  .founder-card__identity {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .founder-card__avatar {
    width: clamp(64px, 12vw, 88px);
    height: clamp(64px, 12vw, 88px);
    border-radius: 24px;
    object-fit: cover;
    box-shadow: 0 18px 40px rgba(14, 22, 40, 0.16);
  }

  .founder-card__avatar--placeholder {
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--voyage-blue) 22%, transparent 78%);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    font-size: 1.8rem;
  }

  .founder-card__role {
    display: inline-block;
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.founder-card) h3 {
    margin: 0.2rem 0 0;
    font-size: clamp(1.6rem, 3.4vw, 2rem);
  }

  .founder-card__contacts {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .founder-card__contacts a {
    padding: 0.4rem 0.9rem;
    text-decoration: none;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .founder-card__contacts a:hover,
  .founder-card__contacts a:focus-visible {
    text-decoration: underline;
  }

  .founder-card__bio {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .founder-card__focus {
    display: grid;
    gap: 0.4rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--bg-elev-2) 92%, transparent 8%);
  }

  .founder-card__label {
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .founder-card__details {
    display: grid;
    gap: 1.2rem;
  }

  .founder-card__details ul {
    margin: 0.6rem 0 0;
    padding-left: 1.2rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .founder-card__details li + li {
    margin-top: 0.4rem;
  }
</style>
