<script>
  import { _, json } from 'svelte-i18n';
  import foundersData from '$data/founders.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  const founderKeys = /** @type {const} */ (['nikita', 'slaff']);

  /**
   * @param {string} path
   * @returns {string[]}
   */
  const getList = (path) => {
    const value = $json?.(path);
    return Array.isArray(value) ? value : [];
  };

  const brandClients = (foundersData.nikita.brandExperience?.clients ?? []).slice(0, 6);

  const fallbackLabels = {
    expertise: 'Core strengths',
    achievements: 'Recent wins',
    contact: 'Direct lines'
  };

  /**
   * @param {string} path
   * @param {string} fallback
   */
  const readLabel = (path, fallback) => {
    const value = $json?.(path);
    return typeof value === 'string' && value.trim() ? value : fallback;
  };

  let expertiseLabel = fallbackLabels.expertise;
  let achievementsLabel = fallbackLabels.achievements;
  let contactLabel = fallbackLabels.contact;

  $: expertiseLabel = readLabel('founders.labels.expertise', fallbackLabels.expertise);
  $: achievementsLabel = readLabel('founders.labels.achievements', fallbackLabels.achievements);
  $: contactLabel = readLabel('founders.labels.contact', fallbackLabels.contact);

  $: founderProfiles = founderKeys.map((key) => {
    const expertise = getList(`founders.${key}.expertise`).slice(0, 3);
    const achievements = (foundersData[key].currentPosition?.achievements ?? []).slice(0, 2);

    return {
      key,
      avatar: foundersData[key].avatar,
      email: foundersData[key].email,
      linkedin: foundersData[key].linkedin,
      name: $_(`founders.${key}.name`),
      role: $_(`founders.${key}.role`),
      bio: $_(`founders.${key}.bio`),
      focusLabel: $_(`founders.${key}.current_title`),
      focus: key === 'nikita' ? $_('founders.nikita.current_position') : $_('founders.slaff.position'),
      expertise,
      achievements
    };
  });
</script>

<section class="founders section" id="founders" use:revealOnScroll>
  <div class="container">
    <div class="founders-layout layout-grid" data-gap="loose">
      <header class="founders-header col-span-7 sm:col-span-4">
        <div class="founders-header__intro">
          <span class="eyebrow surface-chip" data-tone="accent">{$_('founders.subtitle')}</span>
          <h2>{$_('founders.title')}</h2>
        </div>
        <p class="founders-header__lead">{$_('story.vision_text')}</p>
      </header>

      <aside class="founders-spotlight col-span-5 sm:col-span-4" use:staggerReveal={{ delay: 160, stagger: 80 }}>
        <div class="founders-spotlight__inner os-window" data-variant="line">
          <span class="founders-spotlight__label">{$_('founders.slaff.brand_title')}</span>
          <p class="founders-spotlight__lead">{$_('founders.slaff.brand_intro')}</p>
          <div class="founders-spotlight__brands">
            {#each brandClients as client}
              <span class="brand-chip surface-chip">
                <img src={client.logo} alt={client.name} loading="lazy" />
                <span>{client.name}</span>
              </span>
            {/each}
          </div>
          <p class="founders-spotlight__note">{$_('founders.slaff.brand_context')}</p>
        </div>
      </aside>

      <div class="founders-grid col-span-12" use:staggerReveal={{ stagger: 140 }}>
        {#each founderProfiles as founder, index (founder.key)}
          <article
            class="founder-card os-window"
            data-variant={index % 2 === 0 ? 'halo' : 'grid'}
          >
            <div class="founder-card__top">
              <div class="founder-card__avatar">
                <img src={founder.avatar} alt={founder.name} loading="lazy" />
                <span class="founder-card__glow" aria-hidden="true"></span>
              </div>
              <div class="founder-card__identity">
                <span class="founder-card__role">{founder.role}</span>
                <h3>{founder.name}</h3>
              </div>
              <div class="founder-card__contacts" aria-label={contactLabel}>
                {#if founder.email}
                  <a class="contact-chip surface-pill" href={`mailto:${founder.email}`}>
                    {$_('founders.email_cta')}
                  </a>
                {/if}
                {#if founder.linkedin}
                  <a
                    class="contact-chip surface-pill"
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {$_('founders.linkedin_cta')}
                  </a>
                {/if}
              </div>
            </div>

            <p class="founder-card__bio">{founder.bio}</p>

            <div class="founder-card__focus">
              <span class="founder-card__focus-label">{founder.focusLabel}</span>
              <p>{founder.focus}</p>
            </div>

            <div class="founder-card__details">
              {#if founder.expertise.length}
                <div class="founder-card__column" aria-label={expertiseLabel}>
                  <span class="founder-card__eyebrow surface-chip" data-tone="accent">{expertiseLabel}</span>
                  <ul class="founder-card__chips">
                    {#each founder.expertise as item}
                      <li>
                        <span class="surface-chip">{item}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if founder.achievements.length}
                <div class="founder-card__column" aria-label={achievementsLabel}>
                  <span class="founder-card__eyebrow surface-chip" data-tone="accent">{achievementsLabel}</span>
                  <ul class="founder-card__highlights">
                    {#each founder.achievements as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .founders-layout {
    gap: clamp(2rem, 5vw, 3.4rem);
    align-items: start;
  }

  .founders-header {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.4rem);
    align-content: start;
  }

  .founders-header__intro h2 {
    margin: 0;
  }

  .founders-header .surface-chip {
    --surface-chip-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.12) 4%);
    --surface-chip-hc-border: color-mix(in srgb, var(--border-strong) 62%, rgba(var(--voyage-blue-rgb), 0.26) 38%);
    --surface-chip-hc-color: var(--text);
  }

  .founders-header__lead {
    margin: 0;
    max-width: var(--measure-lg);
    color: var(--text-secondary);
    font-size: var(--text-subtitle);
    line-height: var(--leading-relaxed);
  }

  .founders-grid {
    display: grid;
    gap: clamp(2rem, 4vw, 3.2rem);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .founder-card {
    position: relative;
    display: grid;
    gap: clamp(1.4rem, 3vw, 2rem);
    padding: clamp(1.8rem, 4vw, 2.6rem);
    border-radius: clamp(1.8rem, 4vw, 2.6rem);
    overflow: hidden;
  }



  .founder-card__top {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: clamp(1rem, 2.6vw, 1.6rem);
    align-items: center;
    z-index: 1;
  }

  .founder-card__avatar {
    position: relative;
    width: clamp(74px, 10vw, 92px);
    height: clamp(74px, 10vw, 92px);
  }

  .founder-card__avatar img {
    width: 100%;
    height: 100%;
    border-radius: 28px;
    object-fit: cover;
    border: 3px solid color-mix(in srgb, var(--surface-pill-border) 60%, rgba(var(--voyage-blue-rgb), 0.24) 40%);
    position: relative;
    z-index: 1;
  }

  .founder-card__glow {
    display: none;
  }

  .founder-card__identity h3 {
    margin: 0;
    font-size: clamp(1.45rem, 3vw, 1.9rem);
  }

  .founder-card__role {
    display: inline-flex;
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text-secondary) 65%, transparent);
    margin-bottom: 0.35rem;
  }

  .founder-card__contacts {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .founder-card__bio {
    margin: 0;
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    z-index: 1;
  }

  .founder-card__focus {
    position: relative;
    padding: clamp(1rem, 2.6vw, 1.4rem);
    border-radius: clamp(1.4rem, 3vw, 2rem);
    background: var(--surface-pill-bg);
    border: 1px solid var(--surface-pill-border);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: blur(20px) saturate(1.1);
    -webkit-backdrop-filter: blur(20px) saturate(1.1);
    display: grid;
    gap: 0.6rem;
    z-index: 1;
  }

  .founder-card__focus-label {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text-secondary) 72%, transparent);
  }

  .founder-card__details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: clamp(1.2rem, 3vw, 1.8rem);
    z-index: 1;
  }

  .founder-card__column {
    display: grid;
    gap: 0.75rem;
  }

  .founder-card__eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    font-size: var(--text-small);
    letter-spacing: 0.06em;
    text-transform: none;
    color: color-mix(in srgb, var(--text-secondary) 58%, transparent);
  }

  .founder-card__eyebrow.surface-chip,
  .founder-card__chips .surface-chip,
  .brand-chip.surface-chip {
    --surface-chip-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--aurora-purple-rgb), 0.12) 4%);
    --surface-chip-hc-border: color-mix(in srgb, var(--border-strong) 60%, rgba(var(--aurora-purple-rgb), 0.32) 40%);
    --surface-chip-hc-color: var(--text);
  }

  .founder-card__chips {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .founder-card__chips .surface-chip {
    text-transform: none;
    letter-spacing: 0.04em;
    font-weight: var(--weight-medium);
  }

  .founder-card__highlights {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.65rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: var(--leading-relaxed);
  }

  .founder-card__highlights li::marker {
    color: rgba(var(--voyage-blue-rgb), 0.7);
  }

  .founders-spotlight {
    margin-top: clamp(2.4rem, 6vw, 3.6rem);
  }

  .founders-spotlight__inner {
    position: relative;
    display: grid;
    gap: clamp(1.4rem, 3vw, 2rem);
    padding: clamp(1.8rem, 3.6vw, 2.6rem);
    border-radius: clamp(1.8rem, 3.6vw, 2.4rem);
    overflow: hidden;
  }


  .founders-spotlight__label {
    position: relative;
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--text-secondary) 60%, transparent);
  }

  .founders-spotlight__lead {
    position: relative;
    margin: 0;
    color: var(--text-secondary);
  }

  .founders-spotlight__brands {
    position: relative;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    align-items: center;
  }

  .contact-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1.3rem;
    text-decoration: none;
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text-secondary) 76%, rgba(var(--voyage-blue-rgb), 0.16) 24%);
    background: var(--surface-pill-bg);
    border: 1px solid var(--surface-pill-border);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: blur(20px) saturate(1.08);
    -webkit-backdrop-filter: blur(20px) saturate(1.08);
    transition: color var(--duration-ui) var(--ease-out),
      border-color var(--duration-ui) var(--ease-out),
      background var(--duration-ui) var(--ease-out);
    --surface-pill-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.12) 4%);
    --surface-pill-hc-border: color-mix(in srgb, var(--border-strong) 62%, rgba(var(--voyage-blue-rgb), 0.26) 38%);
    --surface-pill-hc-color: var(--text);
  }

  .contact-chip:hover {
    background: color-mix(in srgb, var(--surface-pill-bg) 82%, rgba(var(--voyage-blue-rgb), 0.16) 18%);
    border-color: color-mix(in srgb, var(--surface-pill-border) 64%, rgba(var(--voyage-blue-rgb), 0.2) 36%);
    color: color-mix(in srgb, var(--voyage-blue) 68%, var(--text) 32%);
  }

  .contact-chip:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .founder-card__chips li {
    display: inline-flex;
  }

  .brand-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.95rem;
    text-transform: none;
    letter-spacing: 0.04em;
    font-weight: var(--weight-medium);
  }

  .brand-chip img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .brand-chip span {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    text-transform: none;
  }

  .founders-spotlight__note {
    position: relative;
    margin: 0;
    color: color-mix(in srgb, var(--text-secondary) 72%, transparent);
    font-size: var(--text-small);
    line-height: var(--leading-relaxed);
  }

  @media (max-width: 640px) {
    .founder-card__top {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
      gap: 1rem;
    }

    .founder-card__contacts {
      grid-column: 1 / -1;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .contact-chip {
      padding: 0.45rem 1rem;
    }
  }
</style>
