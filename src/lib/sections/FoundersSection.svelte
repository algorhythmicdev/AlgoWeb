<script>
  import { _, json } from 'svelte-i18n';
  import foundersData from '$data/founders.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  const founderKeys = /** @type {const} */ (['nikita', 'slaff']);
  let activeFounder = 'nikita';

  $: slaffAchievements = (() => {
    const value = $json?.('founders.slaff.achievements');
    return Array.isArray(value) ? value : [];
  })();

  $: nikitaExpertise = (() => {
    const value = $json?.('founders.nikita.expertise');
    return Array.isArray(value) ? value : [];
  })();

  const slaffExpertise = foundersData.slaff.expertise ?? [];
  const nikitaHighlights = foundersData.nikita.currentPosition?.achievements ?? [];
  const brandClients = foundersData.nikita.brandExperience?.clients ?? foundersData.slaff.brandExperience?.clients ?? [];
  const slaffInternational = foundersData.slaff.internationalExposure ?? [];

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
    </div>

    <div class="founders-grid" use:staggerReveal={{ delay: 80, stagger: 160 }}>
      {#each founderKeys as key}
        <article
          class="founder-card"
          class:active={activeFounder === key}
          on:mouseenter={() => activateFounder(key)}
          on:focusin={() => activateFounder(key)}
          aria-labelledby={`founder-${key}-name`}
        >
          <header>
            <div class="avatar">
              <img src={foundersData[key].avatar} alt={$_(`founders.${key}.name`)} loading="lazy" />
            </div>
            <div class="identity">
              <h3 id={`founder-${key}-name`}>{$_(`founders.${key}.name`)}</h3>
              <p class="role">{$_(`founders.${key}.role`)}</p>
              <div class="identity-meta">
                {#if foundersData[key].currentPosition?.company}
                  <span class="badge-pill">{foundersData[key].currentPosition.company}</span>
                {/if}
                {#if foundersData[key].currentPosition?.location}
                  <span class="location">{foundersData[key].currentPosition.location}</span>
                {/if}
              </div>
            </div>
          </header>

          <p class="bio">
            {key === 'nikita' ? $_('founders.nikita.bio') : $_('founders.slaff.philosophy')}
          </p>

          <div class="profile-grid">
            <div class="profile-card focus-card">
              <span class="label">{$_(`founders.${key}.current_title`)}</span>
              <p>{key === 'nikita' ? $_('founders.nikita.current_position') : $_('founders.slaff.position')}</p>
            </div>

            <div class="profile-card strengths">
              <span class="label">Core expertise</span>
              <div class="chip-list">
                {#each key === 'nikita' ? nikitaExpertise : slaffExpertise as skill}
                  <span>{skill}</span>
                {/each}
              </div>
            </div>

            <div class="profile-card highlights">
              <span class="label">Recent highlights</span>
              <ul>
                {#each key === 'nikita' ? nikitaHighlights : slaffAchievements as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>

            <div class="profile-card network">
              <span class="label">{$_('founders.slaff.brand_title')}</span>
              <div class="network-grid">
                {#if key === 'nikita'}
                  {#each foundersData.nikita.brandExperience.clients.slice(0, 4) as client}
                    <span>{client.name}</span>
                  {/each}
                {:else}
                  {#each slaffInternational as event}
                    <span>{event.flag} {event.name} · {event.year}</span>
                  {/each}
                {/if}
              </div>
            </div>

            <div class="profile-card vision">
              <span class="label">{$_('story.vision_title')}</span>
              <p>{key === 'slaff' ? $_('founders.slaff.algorhythmics_vision') : $_('story.vision_text')}</p>
            </div>
          </div>

          <div class="founder-links">
            {#if foundersData[key].email}
              <a class="link-pill" href={`mailto:${foundersData[key].email}`}>Email</a>
            {/if}
            {#if foundersData[key].linkedin}
              <a class="link-pill" href={foundersData[key].linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            {/if}
          </div>
        </article>
      {/each}
    </div>

    <div class="brand-stage">
      <span class="label">{$_('founders.slaff.brand_title')}</span>
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          {#each brandClients.concat(brandClients) as client, index}
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

  .founders-grid {
    display: grid;
    gap: clamp(2rem, 5vw, 3.5rem);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .founder-card {
    background: color-mix(in srgb, var(--bg-surface) 78%, rgba(19, 81, 255, 0.08));
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 18%, transparent);
    border-radius: var(--radius-2xl);
    padding: clamp(2rem, 4vw, 2.8rem);
    display: grid;
    gap: clamp(1.4rem, 3vw, 2rem);
    box-shadow: 0 24px 60px rgba(12, 24, 52, 0.12);
    backdrop-filter: blur(24px);
    position: relative;
    transition: transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
    outline: none;
  }

  .founder-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: radial-gradient(circle at calc(var(--hero-pointer-x, 0.5) * 100%) calc(var(--hero-pointer-y, 0.45) * 100%), rgba(19, 81, 255, 0.22), transparent 70%);
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-out);
    pointer-events: none;
    z-index: 0;
  }

  .founder-card:focus-visible {
    border-color: color-mix(in srgb, var(--voyage-blue) 32%, transparent);
    box-shadow: 0 28px 64px rgba(19, 81, 255, 0.22);
  }

  .founder-card.active,
  .founder-card:hover {
    transform: translateY(-6px);
    border-color: color-mix(in srgb, var(--voyage-blue) 28%, transparent);
    box-shadow: 0 32px 70px rgba(19, 81, 255, 0.18);
  }

  .founder-card.active::before,
  .founder-card:hover::before {
    opacity: 1;
  }

  .founder-card > * { position: relative; z-index: 1; }

  header {
    display: flex;
    align-items: center;
    gap: clamp(1.2rem, 3vw, 1.8rem);
  }

  .avatar {
    width: 96px;
    height: 96px;
    border-radius: 32% 46% 38% 54% / 46% 42% 58% 54%;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 20%, transparent);
    box-shadow: 0 16px 32px rgba(12, 24, 52, 0.22);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .identity h3 {
    font-size: clamp(1.6rem, 2.8vw, 2.1rem);
  }

  .role {
    color: var(--text-secondary);
    font-weight: var(--weight-medium);
  }

  .identity-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.6rem;
    align-items: center;
  }

  .identity-meta .location {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .bio {
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  .profile-grid {
    display: grid;
    gap: clamp(1.1rem, 3vw, 1.6rem);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-card {
    background: color-mix(in srgb, var(--bg-muted) 80%, transparent);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 16%, transparent);
    border-radius: var(--radius-xl);
    padding: 1.4rem 1.6rem;
    display: grid;
    gap: 0.8rem;
  }

  .profile-card .label {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--voyage-blue) 65%, var(--text-tertiary) 35%);
    font-weight: var(--weight-semibold);
  }

  .focus-card,
  .vision,
  .network {
    grid-column: 1 / -1;
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .chip-list span {
    padding: 0.55rem 1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--voyage-blue) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 18%, transparent);
    font-size: var(--text-small);
  }

  .profile-card ul {
    display: grid;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .profile-card ul li::before {
    content: '•';
    color: color-mix(in srgb, var(--voyage-blue) 80%, var(--text-secondary) 20%);
    margin-right: 0.5rem;
  }

  .network-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .network-grid span {
    padding: 0.55rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--aurora-purple) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--aurora-purple) 18%, transparent);
    font-size: var(--text-small);
  }

  .vision p {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .founder-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .link-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.3rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--voyage-blue) 22%, transparent);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(19, 81, 255, 0.08));
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .link-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(19, 81, 255, 0.18);
  }

  .brand-stage {
    margin-top: clamp(3.5rem, 8vw, 5rem);
    background: color-mix(in srgb, var(--bg-surface) 78%, rgba(106, 56, 255, 0.08));
    border-radius: var(--radius-2xl);
    border: 1px solid color-mix(in srgb, var(--aurora-purple) 22%, transparent);
    padding: clamp(1.8rem, 4vw, 2.4rem);
    display: grid;
    gap: 1.2rem;
    box-shadow: 0 24px 60px rgba(30, 22, 56, 0.16);
    backdrop-filter: blur(22px);
  }

  .brand-stage .label {
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--aurora-purple) 68%, var(--text-tertiary) 32%);
    font-weight: var(--weight-semibold);
  }

  .marquee {
    position: relative;
    overflow: hidden;
  }

  .marquee-track {
    display: flex;
    gap: clamp(1.4rem, 3vw, 2rem);
    animation: marquee 32s linear infinite;
  }

  .brand-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1.1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-muted) 78%, transparent);
    border: 1px solid color-mix(in srgb, var(--aurora-purple) 16%, transparent);
    font-size: var(--text-small);
    color: var(--text-secondary);
    min-width: 140px;
  }

  .brand-chip img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: grayscale(1);
    opacity: 0.75;
  }

  .brand-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none;
    }
  }

  @media (max-width: 980px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .founder-card {
      padding: 1.8rem;
    }

    header {
      flex-direction: column;
      align-items: flex-start;
    }

    .avatar {
      width: 80px;
      height: 80px;
    }

    .identity-meta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
