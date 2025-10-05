<script>
  import { _, json } from 'svelte-i18n';
  import foundersData from '$data/founders.json';
  import { revealOnScroll, staggerReveal, tilt } from '$utils/animations';

  const founderKeys = /** @type {const} */ (['nikita', 'slaff']);
  let activeFounder = 'nikita';

  /**
   * @template T
   * @param {T[] | null | undefined} list
   * @param {number} [count=4]
   * @returns {T[]}
   */
  const limit = (list, count = 4) => (Array.isArray(list) ? list.slice(0, count) : []);

  $: nikitaExpertise = limit(foundersData.nikita.expertise);
  $: slaffExpertise = limit(foundersData.slaff.expertise);
  $: nikitaHighlights = limit(foundersData.nikita.currentPosition?.achievements);
  $: slaffHighlights = limit(foundersData.slaff.currentPosition?.achievements);
  $: nikitaBrands = limit(foundersData.nikita.brandExperience?.clients, 6);
  $: slaffJourneys = limit(foundersData.slaff.internationalExposure, 4);

  $: slaffAchievements = (() => {
    const value = $json?.('founders.slaff.achievements');
    return Array.isArray(value) ? limit(value) : slaffHighlights;
  })();

  /** @param {'nikita' | 'slaff'} key */
  function activateFounder(key) {
    activeFounder = key;
  }
</script>

<section class="founders section" id="founders" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('founders.subtitle')}</span>
      <h2>{$_('founders.title')}</h2>
      <p class="section-lead">{$_('story.vision_text')}</p>
    </div>

    <div class="founder-tabs" role="tablist" aria-label="Founders">
      {#each founderKeys as key}
        <button
          role="tab"
          class="founder-tab"
          class:active={activeFounder === key}
          aria-selected={activeFounder === key}
          aria-controls={`panel-${key}`}
          id={`tab-${key}`}
          on:click={() => activateFounder(key)}
          on:mouseenter={() => activateFounder(key)}
        >
          <img src={foundersData[key].avatar} alt={$_(`founders.${key}.name`)} loading="lazy" />
          <span>
            <strong>{$_(`founders.${key}.name`)}</strong>
            <small>{$_(`founders.${key}.role`)}</small>
          </span>
        </button>
      {/each}
    </div>

    <div class="founder-stage">
      {#each founderKeys as key}
        <div
          id={`panel-${key}`}
          role="tabpanel"
          class="founder-profile"
          class:active={activeFounder === key}
          aria-labelledby={`tab-${key}`}
          tabindex="0"
        >
          <header class="profile-header">
            <div class="profile-identity">
              <img src={foundersData[key].avatar} alt={$_(`founders.${key}.name`)} loading="lazy" />
              <div>
                <h3>{$_(`founders.${key}.name`)}</h3>
                <p class="role">{$_(`founders.${key}.role`)}</p>
                <div class="meta">
                  {#if foundersData[key].currentPosition?.company}
                    <span class="badge">{foundersData[key].currentPosition.company}</span>
                  {/if}
                  {#if foundersData[key].currentPosition?.location}
                    <span class="badge subtle">{foundersData[key].currentPosition.location}</span>
                  {/if}
                </div>
              </div>
            </div>
            <div class="current-role">
              <span class="label">{$_(`founders.${key}.current_title`)}</span>
              <p>{key === 'nikita' ? $_('founders.nikita.current_position') : $_('founders.slaff.position')}</p>
            </div>
          </header>

          <div class="profile-intro">
            <p>{key === 'nikita' ? $_('founders.nikita.bio') : $_('founders.slaff.philosophy')}</p>
          </div>

          <div class="profile-grid" use:staggerReveal={{ delay: 120, stagger: 130 }}>
            <div class="profile-card focus" use:tilt={{ max: 7, scale: 1.02 }}>
              <span class="label">Core Expertise</span>
              <div class="chip-list">
                {#each key === 'nikita' ? nikitaExpertise : slaffExpertise as skill}
                  <span>{skill}</span>
                {/each}
              </div>
            </div>

            <div class="profile-card achievements" use:tilt={{ max: 7, scale: 1.02 }}>
              <span class="label">Recent Highlights</span>
              <ul>
                {#each (key === 'nikita' ? nikitaHighlights : slaffAchievements) as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>

            <div class="profile-card signature" use:tilt={{ max: 7, scale: 1.02 }}>
              <span class="label">Signature Work</span>
              {#if key === 'nikita'}
                <div class="logo-grid">
                  {#each nikitaBrands as brand}
                    <span>
                      <img src={brand.logo} alt={brand.name} loading="lazy" />
                      <small>{brand.name}</small>
                    </span>
                  {/each}
                </div>
              {:else}
                <ul class="journey-list">
                  {#each slaffJourneys as trip}
                    <li>{trip.flag} {trip.name} • {trip.year}</li>
                  {/each}
                </ul>
              {/if}
            </div>

            <div class="profile-card vision" use:tilt={{ max: 7, scale: 1.02 }}>
              <span class="label">Vision for AlgoRhythmics</span>
              <p>{key === 'nikita' ? $_('story.vision_text') : $_('founders.slaff.algorhythmics_vision')}</p>
            </div>
          </div>

          <footer class="profile-links">
            {#if foundersData[key].email}
              <a class="link-pill" href={`mailto:${foundersData[key].email}`}>Email</a>
            {/if}
            {#if foundersData[key].linkedin}
              <a class="link-pill" href={foundersData[key].linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            {/if}
          </footer>
        </div>
      {/each}
    </div>

    <div class="brand-stage">
      <span class="label">{$_('founders.slaff.brand_title')}</span>
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          {#each (foundersData.nikita.brandExperience?.clients ?? []).concat(foundersData.nikita.brandExperience?.clients ?? []) as client, index}
            <span class="brand-chip" style={`--i:${index}`}>
              <img src={client.logo} alt={client.name} loading="lazy" />
              <span>{client.name}</span>
            </span>
          {/each}
        </div>
      </div>
      <p class="brand-note">{$_('founders.slaff.brand_context')}</p>
    </div>
  </div>
</section>

<style>
  .section-heading {
    display: grid;
    gap: 0.8rem;
    max-width: 720px;
    margin-bottom: clamp(3rem, 6vw, 4.5rem);
  }

  .founder-stage {
    position: relative;
  }

  .founder-profile {
    display: none;
    flex-direction: column;
    gap: clamp(1.8rem, 4vw, 2.6rem);
    background: color-mix(in srgb, var(--bg-surface) 86%, rgba(19, 81, 255, 0.08) 14%);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 22%, rgba(255, 255, 255, 0.4) 78%);
    border-radius: clamp(2.2rem, 6vw, 3rem);
    padding: clamp(2.2rem, 5vw, 3.4rem);
    box-shadow: 0 42px 90px rgba(15, 23, 42, 0.16);
  }

  .founder-profile.active {
    display: flex;
  }

  .profile-header {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(1.4rem, 3vw, 2.2rem);
    justify-content: space-between;
    align-items: center;
  }

  .profile-identity {
    display: flex;
    align-items: center;
    gap: 1.4rem;
  }

  .profile-identity img {
    width: clamp(82px, 12vw, 110px);
    height: clamp(82px, 12vw, 110px);
    border-radius: var(--radius-2xl);
    object-fit: cover;
    box-shadow: 0 18px 40px rgba(19, 81, 255, 0.18);
  }

  .role {
    color: var(--text-secondary);
    font-weight: var(--weight-medium);
  }

  .meta {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    background: color-mix(in srgb, var(--bg-muted) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
  }

  .badge.subtle {
    background: color-mix(in srgb, var(--bg-muted) 60%, transparent);
    color: var(--text-tertiary);
  }

  .current-role {
    max-width: 28rem;
    display: grid;
    gap: 0.6rem;
    padding: 1.4rem;
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--bg-surface) 88%, rgba(19, 81, 255, 0.08) 12%);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.22) 60%, rgba(255, 255, 255, 0.36) 40%);
  }

  .profile-card.achievements li {
    padding: 0.7rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(19, 81, 255, 0.15);
    color: var(--text-secondary);
    background: color-mix(in srgb, var(--bg-muted) 55%, transparent);
  }

  .profile-intro p {
    font-size: clamp(1.05rem, 2vw, 1.18rem);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
    background: rgba(19, 81, 255, 0.06);
    padding: clamp(1.4rem, 3vw, 2rem);
    border-radius: var(--radius-xl);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.18) 50%, rgba(255, 255, 255, 0.4) 50%);
  }

  .profile-grid {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2.2rem);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .profile-card {
    display: grid;
    gap: 0.9rem;
    padding: clamp(1.4rem, 3vw, 2.1rem);
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--bg-surface) 88%, rgba(19, 81, 255, 0.08) 12%);
    border: 1px solid color-mix(in srgb, rgba(19, 81, 255, 0.2) 60%, rgba(255, 255, 255, 0.34) 40%);
    box-shadow: var(--shadow-sm);
  }

  .profile-card .label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: var(--text-small);
    color: var(--text-tertiary);
    font-weight: var(--weight-semibold);
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .chip-list span {
    padding: 0.45rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 70%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    font-size: var(--text-small);
  }

  .profile-card ul {
    display: grid;
    gap: 0.6rem;
    list-style: none;
    color: var(--text-secondary);
  }

  .profile-card li {
    position: relative;
    padding-left: 1.2rem;
  }

  .profile-card li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--text-secondary) 30%);
  }

  .logo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
    gap: 0.9rem;
  }

  .logo-grid span {
    display: grid;
    gap: 0.35rem;
    place-items: center;
    padding: 0.85rem;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: var(--surface-glass);
    box-shadow: var(--shadow-xs);
  }

  .link-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(16px);
  }

  .logo-grid span img {
    max-width: 72px;
    filter: grayscale(1);
    opacity: 0.72;
  }

  .brand-stage {
    margin-top: clamp(3rem, 6vw, 4rem);
    display: grid;
    gap: 1rem;
    background: color-mix(in srgb, var(--bg-surface) 80%, rgba(106, 56, 255, 0.08) 20%);
    border: 1px solid color-mix(in srgb, rgba(106, 56, 255, 0.28) 60%, rgba(255, 255, 255, 0.35) 40%);
    border-radius: clamp(2rem, 5vw, 2.8rem);
    padding: clamp(1.8rem, 4vw, 2.6rem);
    box-shadow: 0 32px 72px rgba(15, 23, 42, 0.14);
  }

  .brand-stage .label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: var(--text-small);
    color: var(--text-tertiary);
    font-weight: var(--weight-semibold);
  }

  .marquee {
    overflow: hidden;
  }

  .marquee-track {
    display: flex;
    gap: 1.4rem;
    animation: marquee 26s linear infinite;
  }


  @media (max-width: 960px) {
    .founder-tab {
      justify-content: flex-start;
    }

    .profile-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .current-role {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .profile-identity {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .profile-identity img {
      width: 72px;
      height: 72px;
    }

    .profile-card {
      padding: clamp(1.1rem, 6vw, 1.6rem);
    }
  }

</style>
