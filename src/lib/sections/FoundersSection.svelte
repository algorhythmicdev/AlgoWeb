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
    <div class="founders-shell">
      <header class="founders-header">
        <div>
          <span class="eyebrow">{$_('founders.subtitle')}</span>
          <h2>{$_('founders.title')}</h2>
        </div>
        <p class="section-lead">{$_('story.vision_text')}</p>
      </header>

      <div class="founders-layout">
        <div class="founders-stack" use:staggerReveal={{ stagger: 140 }}>
          {#each founderProfiles as founder (founder.key)}
            <article class="founder-panel">
              <header class="founder-panel__header">
                <div class="founder-avatar">
                  <img src={founder.avatar} alt={founder.name} loading="lazy" />
                  <span class="founder-avatar__halo" aria-hidden="true"></span>
                </div>
                <div class="founder-panel__identity">
                  <span class="founder-panel__role">{founder.role}</span>
                  <h3>{founder.name}</h3>
                </div>
                <div class="founder-panel__contacts" aria-label={contactLabel}>
                  {#if founder.email}
                    <a class="contact-chip" href={`mailto:${founder.email}`}>{$_('founders.email_cta')}</a>
                  {/if}
                  {#if founder.linkedin}
                    <a class="contact-chip" href={founder.linkedin} target="_blank" rel="noreferrer">{$_('founders.linkedin_cta')}</a>
                  {/if}
                </div>
              </header>

              <p class="founder-panel__bio">{founder.bio}</p>

              <div class="founder-panel__focus">
                <span class="founder-panel__focus-label">{founder.focusLabel}</span>
                <p>{founder.focus}</p>
              </div>

              <div class="founder-panel__grid">
                {#if founder.expertise.length}
                  <div class="founder-panel__column" aria-label={expertiseLabel}>
                    <span class="founder-panel__eyebrow">{expertiseLabel}</span>
                    <ul class="founder-panel__chips">
                      {#each founder.expertise as item}
                        <li>{item}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                {#if founder.achievements.length}
                  <div class="founder-panel__column" aria-label={achievementsLabel}>
                    <span class="founder-panel__eyebrow">{achievementsLabel}</span>
                    <ul class="founder-panel__highlights">
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

        <aside class="founders-aside" use:staggerReveal={{ delay: 160, stagger: 80 }}>
          <div class="brand-stage">
            <span class="label">{$_('founders.slaff.brand_title')}</span>
            <div class="brand-grid">
              {#each brandClients as client}
                <span class="brand-chip">
                  <img src={client.logo} alt={client.name} loading="lazy" />
                  <span>{client.name}</span>
                </span>
              {/each}
            </div>
            <p class="brand-note">{$_('founders.slaff.brand_context')}</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</section>

<style>
  .founders-shell {
    display: grid;
    gap: clamp(2rem, 5vw, 3.6rem);
  }

  .founders-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: clamp(1.5rem, 4vw, 2.8rem);
  }

  .founders-header h2 {
    margin: 0;
  }

  .founders-header .section-lead {
    margin: 0;
    max-width: clamp(34ch, 44vw, 50ch);
    color: var(--text-secondary);
  }

  .founders-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: clamp(2.4rem, 5vw, 3.5rem);
    align-items: start;
  }

  .founders-stack {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
  }

  .founder-panel {
    position: relative;
    display: grid;
    gap: clamp(1.5rem, 3.2vw, 2.2rem);
    padding: clamp(1.8rem, 4vw, 2.6rem);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: linear-gradient(136deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.68));
    box-shadow: 0 28px 55px rgba(15, 23, 42, 0.12);
    overflow: hidden;
  }

  .founder-panel::before {
    content: '';
    position: absolute;
    inset: -40% -10% auto;
    height: 70%;
    background: radial-gradient(circle at 20% 40%, rgba(var(--voyage-blue-rgb), 0.18), transparent 70%),
      radial-gradient(circle at 80% 30%, rgba(var(--signal-yellow-rgb), 0.16), transparent 68%);
    opacity: 0.9;
    pointer-events: none;
  }

  .founder-panel__header {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: clamp(1rem, 2.4vw, 1.6rem);
    align-items: center;
    z-index: 1;
  }

  .founder-avatar {
    position: relative;
    width: clamp(76px, 12vw, 96px);
    height: clamp(76px, 12vw, 96px);
  }

  .founder-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 28px;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.75);
    position: relative;
    z-index: 1;
  }

  .founder-avatar__halo {
    content: '';
    position: absolute;
    inset: -15%;
    border-radius: 32px;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.32), rgba(var(--aurora-purple-rgb), 0.24));
    filter: blur(18px);
    opacity: 0.9;
  }

  .founder-panel__identity h3 {
    margin: 0;
    font-size: clamp(1.4rem, 3.2vw, 1.85rem);
  }

  .founder-panel__role {
    display: inline-block;
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(26, 33, 55, 0.62);
    margin-bottom: 0.35rem;
  }

  .founder-panel__contacts {
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
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(26, 33, 55, 0.12);
    text-decoration: none;
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .contact-chip:hover,
  .contact-chip:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.14);
  }

  .founder-panel__bio {
    margin: 0;
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    z-index: 1;
  }

  .founder-panel__focus {
    position: relative;
    padding: clamp(1rem, 2.6vw, 1.4rem);
    border-radius: clamp(1.4rem, 3vw, 2rem);
    background: rgba(var(--voyage-blue-rgb), 0.08);
    border: 1px solid rgba(var(--voyage-blue-rgb), 0.18);
    display: grid;
    gap: 0.6rem;
    z-index: 1;
  }

  .founder-panel__focus-label {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(var(--voyage-blue-rgb), 0.78);
  }

  .founder-panel__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: clamp(1.2rem, 3vw, 1.8rem);
    z-index: 1;
  }

  .founder-panel__column {
    display: grid;
    gap: 0.75rem;
  }

  .founder-panel__eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(26, 33, 55, 0.55);
  }

  .founder-panel__chips {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .founder-panel__chips li {
    padding: 0.4rem 1rem;
    border-radius: var(--radius-full);
    background: rgba(var(--aurora-purple-rgb), 0.12);
    color: rgba(32, 40, 72, 0.9);
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
  }

  .founder-panel__highlights {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.65rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: var(--leading-relaxed);
  }

  .founder-panel__highlights li::marker {
    color: rgba(var(--voyage-blue-rgb), 0.7);
  }

  .founders-aside {
    display: grid;
    gap: clamp(1.8rem, 3.5vw, 2.4rem);
  }

  .brand-stage {
    position: relative;
    display: grid;
    gap: clamp(1.2rem, 2.6vw, 1.8rem);
    padding: clamp(1.8rem, 3.6vw, 2.4rem);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: linear-gradient(140deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.65));
    box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
    overflow: hidden;
  }

  .brand-stage::before {
    content: '';
    position: absolute;
    inset: -35% -20% auto;
    height: 65%;
    background: radial-gradient(circle at 30% 40%, rgba(var(--voyage-blue-rgb), 0.16), transparent 70%),
      radial-gradient(circle at 70% 30%, rgba(var(--aurora-purple-rgb), 0.14), transparent 72%);
    opacity: 0.85;
    pointer-events: none;
  }

  .brand-stage .label {
    position: relative;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(26, 33, 55, 0.58);
  }

  .brand-grid {
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

  .brand-note {
    position: relative;
    margin: 0;
    color: rgba(26, 33, 55, 0.65);
    font-size: var(--text-small);
    line-height: var(--leading-relaxed);
  }

  :global([data-base-theme='dark']) .founder-panel {
    background: linear-gradient(136deg, rgba(20, 28, 48, 0.82), rgba(18, 24, 42, 0.72));
    border: 1px solid rgba(120, 146, 220, 0.35);
    box-shadow: 0 28px 55px rgba(2, 8, 18, 0.6);
  }

  :global([data-base-theme='dark']) .founder-panel__role {
    color: rgba(196, 210, 255, 0.7);
  }

  :global([data-base-theme='dark']) .founder-panel__focus {
    background: rgba(var(--voyage-blue-rgb), 0.12);
    border-color: rgba(var(--voyage-blue-rgb), 0.22);
  }

  :global([data-base-theme='dark']) .founder-panel__eyebrow {
    color: rgba(210, 220, 255, 0.6);
  }

  :global([data-base-theme='dark']) .founder-panel__chips li {
    background: rgba(124, 135, 242, 0.18);
    color: rgba(230, 236, 255, 0.88);
  }

  :global([data-base-theme='dark']) .contact-chip {
    background: rgba(13, 18, 32, 0.92);
    border-color: rgba(108, 128, 202, 0.4);
    color: rgba(224, 232, 255, 0.92);
  }

  :global([data-base-theme='dark']) .brand-stage {
    background: linear-gradient(140deg, rgba(20, 28, 48, 0.82), rgba(20, 28, 48, 0.68));
    border: 1px solid rgba(120, 146, 220, 0.32);
    box-shadow: 0 24px 50px rgba(2, 8, 18, 0.55);
  }

  :global([data-base-theme='dark']) .brand-chip {
    background: rgba(12, 18, 34, 0.92);
    border-color: rgba(120, 146, 220, 0.32);
    color: rgba(220, 232, 255, 0.88);
  }

  :global([data-theme='contrast']) .founder-panel,
  :global([data-theme='contrast']) .brand-stage {
    background: rgba(0, 0, 0, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.85);
    box-shadow: none;
  }

  :global([data-theme='contrast']) .contact-chip {
    background: #000;
    border: 2px solid #fff;
    color: #fff;
  }

  :global([data-theme='contrast']) .founder-panel__eyebrow {
    color: rgba(255, 255, 255, 0.72);
  }

  :global([data-theme='contrast']) .founder-panel__chips li {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  :global([data-theme='contrast']) .brand-chip {
    background: rgba(0, 0, 0, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.85);
    color: #fff;
  }

  @media (max-width: 1080px) {
    .founders-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .founders-aside {
      order: -1;
    }
  }

  @media (max-width: 640px) {
    .founder-panel__header {
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
    }

    .founder-panel__contacts {
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
