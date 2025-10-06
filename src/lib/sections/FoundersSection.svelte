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
    <header class="founders-header">
      <div class="founders-header__intro">
        <span class="eyebrow">{$_('founders.subtitle')}</span>
        <h2>{$_('founders.title')}</h2>
      </div>
      <p class="founders-header__lead">{$_('story.vision_text')}</p>
    </header>

    <div class="founders-grid" use:staggerReveal={{ stagger: 140 }}>
      {#each founderProfiles as founder (founder.key)}
        <article class="founder-card">
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
                <a class="contact-chip" href={`mailto:${founder.email}`}>{$_('founders.email_cta')}</a>
              {/if}
              {#if founder.linkedin}
                <a class="contact-chip" href={founder.linkedin} target="_blank" rel="noreferrer">{$_('founders.linkedin_cta')}</a>
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
                <span class="founder-card__eyebrow">{expertiseLabel}</span>
                <ul class="founder-card__chips">
                  {#each founder.expertise as item}
                    <li>{item}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            {#if founder.achievements.length}
              <div class="founder-card__column" aria-label={achievementsLabel}>
                <span class="founder-card__eyebrow">{achievementsLabel}</span>
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

    <aside class="founders-spotlight" use:staggerReveal={{ delay: 160, stagger: 80 }}>
      <div class="founders-spotlight__inner">
        <span class="founders-spotlight__label">{$_('founders.slaff.brand_title')}</span>
        <p class="founders-spotlight__lead">{$_('founders.slaff.brand_intro')}</p>
        <div class="founders-spotlight__brands">
          {#each brandClients as client}
            <span class="brand-chip">
              <img src={client.logo} alt={client.name} loading="lazy" />
              <span>{client.name}</span>
            </span>
          {/each}
        </div>
        <p class="founders-spotlight__note">{$_('founders.slaff.brand_context')}</p>
      </div>
    </aside>
  </div>
</section>

<style>
  .founders-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: clamp(1.6rem, 4vw, 2.8rem);
    margin-bottom: clamp(2.4rem, 5vw, 3.6rem);
  }

  .founders-header__intro h2 {
    margin: 0;
  }

  .founders-header__lead {
    margin: 0;
    max-width: clamp(36ch, 44vw, 54ch);
    color: var(--text-secondary);
  }

  .founders-grid {
    display: grid;
    gap: clamp(2rem, 4vw, 3.2rem);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .founder-card {
    position: relative;
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.1rem);
    padding: clamp(1.8rem, 4vw, 2.6rem);
    border-radius: clamp(1.8rem, 4vw, 2.6rem);
    border: 1px solid color-mix(in srgb, var(--border-strong) 45%, transparent);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.85) 70%, transparent);
    box-shadow: 0 28px 48px rgba(15, 23, 42, 0.12);
    overflow: hidden;
  }

  .founder-card::before {
    content: '';
    position: absolute;
    inset: -35% -20% auto;
    height: 70%;
    background: radial-gradient(circle at 20% 40%, rgba(var(--voyage-blue-rgb), 0.18), transparent 70%),
      radial-gradient(circle at 76% 26%, rgba(var(--aurora-purple-rgb), 0.16), transparent 68%);
    opacity: 0.85;
    pointer-events: none;
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
    border: 3px solid rgba(255, 255, 255, 0.8);
    position: relative;
    z-index: 1;
  }

  .founder-card__glow {
    content: '';
    position: absolute;
    inset: -18%;
    border-radius: 32px;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.32), rgba(var(--aurora-purple-rgb), 0.26));
    filter: blur(18px);
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

  .contact-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.45rem 1.1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.92) 80%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-strong) 35%, transparent);
    text-decoration: none;
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .contact-chip:hover,
  .contact-chip:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
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
    background: rgba(var(--voyage-blue-rgb), 0.08);
    border: 1px solid rgba(var(--voyage-blue-rgb), 0.18);
    display: grid;
    gap: 0.6rem;
    z-index: 1;
  }

  .founder-card__focus-label {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(var(--voyage-blue-rgb), 0.78);
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
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text-secondary) 60%, transparent);
  }

  .founder-card__chips {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .founder-card__chips li {
    padding: 0.4rem 1rem;
    border-radius: var(--radius-full);
    background: rgba(var(--aurora-purple-rgb), 0.12);
    color: rgba(32, 40, 72, 0.9);
    font-size: var(--text-small);
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
    border: 1px solid color-mix(in srgb, var(--border-strong) 45%, transparent);
    background: color-mix(in srgb, rgba(255, 255, 255, 0.86) 70%, transparent);
    box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
    overflow: hidden;
  }

  .founders-spotlight__inner::before {
    content: '';
    position: absolute;
    inset: -32% -18% auto;
    height: 68%;
    background: radial-gradient(circle at 32% 42%, rgba(var(--voyage-blue-rgb), 0.16), transparent 70%),
      radial-gradient(circle at 72% 28%, rgba(var(--aurora-purple-rgb), 0.16), transparent 72%);
    opacity: 0.85;
    pointer-events: none;
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

  .brand-chip {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(26, 33, 55, 0.12);
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  }

  .brand-chip img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .brand-chip span {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: rgba(26, 33, 55, 0.7);
  }

  .founders-spotlight__note {
    position: relative;
    margin: 0;
    color: rgba(26, 33, 55, 0.65);
    font-size: var(--text-small);
    line-height: var(--leading-relaxed);
  }

  :global([data-base-theme='dark']) .founder-card {
    background: linear-gradient(136deg, rgba(20, 28, 48, 0.82), rgba(18, 24, 42, 0.72));
    border: 1px solid rgba(120, 146, 220, 0.35);
    box-shadow: 0 28px 55px rgba(2, 8, 18, 0.6);
  }

  :global([data-base-theme='dark']) .founder-card__role {
    color: rgba(196, 210, 255, 0.7);
  }

  :global([data-base-theme='dark']) .founder-card__focus {
    background: rgba(var(--voyage-blue-rgb), 0.12);
    border-color: rgba(var(--voyage-blue-rgb), 0.22);
  }

  :global([data-base-theme='dark']) .founder-card__chips li {
    background: rgba(124, 135, 242, 0.18);
    color: rgba(230, 236, 255, 0.88);
  }

  :global([data-base-theme='dark']) .contact-chip {
    background: rgba(13, 18, 32, 0.92);
    border-color: rgba(108, 128, 202, 0.4);
    color: rgba(224, 232, 255, 0.92);
  }

  :global([data-base-theme='dark']) .founders-spotlight__inner {
    background: linear-gradient(140deg, rgba(20, 28, 48, 0.82), rgba(20, 28, 48, 0.68));
    border: 1px solid rgba(120, 146, 220, 0.32);
    box-shadow: 0 24px 50px rgba(2, 8, 18, 0.55);
  }

  :global([data-base-theme='dark']) .brand-chip {
    background: rgba(12, 18, 34, 0.92);
    border-color: rgba(120, 146, 220, 0.32);
    color: rgba(220, 232, 255, 0.88);
  }

  :global([data-theme='contrast']) .founder-card,
  :global([data-theme='contrast']) .founders-spotlight__inner {
    background: rgba(0, 0, 0, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: none;
  }

  :global([data-theme='contrast']) .contact-chip {
    background: #000;
    border: 2px solid #fff;
    color: #fff;
  }

  :global([data-theme='contrast']) .founder-card__chips li {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  :global([data-theme='contrast']) .brand-chip {
    background: rgba(0, 0, 0, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.85);
    color: #fff;
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
