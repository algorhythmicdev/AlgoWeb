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
    <div class="section-heading">
      <span class="eyebrow">{$_('founders.subtitle')}</span>
      <h2>{$_('founders.title')}</h2>
      <p class="section-lead">{$_('story.vision_text')}</p>
    </div>

    <div class="founders-grid" use:staggerReveal={{ stagger: 140 }}>
      {#each founderProfiles as founder (founder.key)}
        <article class="founder-card">
          <header class="founder-header">
            <img src={founder.avatar} alt={founder.name} loading="lazy" />
            <div>
              <span class="role">{founder.role}</span>
              <h3>{founder.name}</h3>
            </div>
          </header>

          <p class="bio">{founder.bio}</p>

          <div class="focus-block">
            <span class="label">{founder.focusLabel}</span>
            <p>{founder.focus}</p>
          </div>

          {#if founder.expertise.length}
            <div class="chip-list">
              {#each founder.expertise as item}
                <span>{item}</span>
              {/each}
            </div>
          {/if}

          {#if founder.achievements.length}
            <ul class="highlight-list">
              {#each founder.achievements as item}
                <li>{item}</li>
              {/each}
            </ul>
          {/if}

          <div class="contact-links">
            {#if founder.email}
              <a class="link-pill" href={`mailto:${founder.email}`}>{$_('founders.email_cta')}</a>
            {/if}
            {#if founder.linkedin}
              <a class="link-pill" href={founder.linkedin} target="_blank" rel="noreferrer">{$_('founders.linkedin_cta')}</a>
            {/if}
          </div>
        </article>
      {/each}
    </div>

    <div class="brand-stage" use:staggerReveal={{ delay: 160, stagger: 80 }}>
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
  </div>
</section>

<style>
  .section-heading {
    display: grid;
    gap: var(--space-md);
    max-width: clamp(38ch, 60vw, 62ch);
    margin-bottom: clamp(2.5rem, 6vw, 4rem);
  }

  .section-lead {
    color: var(--text-secondary);
  }

  .founders-grid {
    display: grid;
    gap: clamp(2rem, 5vw, 3.5rem);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    margin-bottom: clamp(2.5rem, 6vw, 4rem);
  }

  .founder-card {
    padding: var(--card-padding-xl);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.65);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-sm);
    display: grid;
    gap: var(--space-lg);
  }

  .founder-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .founder-header img {
    width: clamp(72px, 12vw, 96px);
    height: clamp(72px, 12vw, 96px);
    border-radius: var(--radius-full);
    object-fit: cover;
    border: 3px solid rgba(19, 81, 255, 0.18);
  }

  .founder-header h3 {
    margin: 0;
    font-size: clamp(1.4rem, 3vw, 1.8rem);
    color: var(--text-primary);
    -webkit-text-fill-color: initial;
    background: none;
    filter: none;
  }

  .founder-header .role {
    display: inline-block;
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(26, 33, 55, 0.6);
    margin-bottom: 0.35rem;
  }

  .focus-block .label {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(19, 81, 255, 0.75);
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .chip-list span {
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-full);
    background: rgba(19, 81, 255, 0.08);
    color: var(--voyage-blue);
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
  }

  .highlight-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: var(--space-sm);
  }

  .highlight-list li {
    color: var(--text-secondary);
    font-size: var(--text-small);
    line-height: var(--leading-relaxed);
    padding-left: 1.25rem;
    position: relative;
  }

  .highlight-list li::before {
    content: '';
    position: absolute;
    left: 0;
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--text-secondary) 30%);
  }

  .contact-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .link-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.5rem 1.2rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(26, 33, 55, 0.12);
    background: rgba(255, 255, 255, 0.92);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
  }

  .brand-stage {
    display: grid;
    gap: var(--space-md);
    padding: var(--card-padding-lg);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.88);
    box-shadow: var(--shadow-xs);
  }

  .brand-grid {
    display: grid;
    gap: var(--space-md);
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    align-items: center;
  }

  .brand-chip {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(26, 33, 55, 0.08);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-xs);
  }

  .brand-chip img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .brand-chip span {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
  }

  .brand-note {
    color: rgba(26, 33, 55, 0.65);
    font-size: var(--text-small);
    margin: 0;
  }

  @media (max-width: 640px) {
    .founder-card {
      padding: var(--card-padding-md);
    }

    .brand-stage {
      padding: var(--card-padding-md);
    }
  }
</style>
