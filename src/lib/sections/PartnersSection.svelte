<script lang="ts">
  import { _, json } from 'svelte-i18n';
  import { GlassCard } from '$lib/components';
  import brands from '$data/brands.json';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  type Partner = {
    id: string;
    type: 'current' | 'aspirational';
    name: string;
    relationship?: string;
    description?: string;
    note?: string;
    logo?: string;
    website?: string;
    location?: string;
    founded?: number;
    scale?: Record<string, string> | undefined;
    programs?: string[] | undefined;
    innovation?: string[] | undefined;
  };

  type Client = {
    name: string;
    logo?: string;
    category?: string;
    region?: string;
  };

  const ensureArray = (value: unknown): string[] => (Array.isArray(value) ? value : []).map((item) =>
    typeof item === 'string' && item.trim().length ? item.trim() : ''
  ).filter(Boolean);
  const ensureRecord = (value: unknown): Record<string, string> | undefined => {
    if (typeof value !== 'object' || value === null) return undefined;
    const entries = Object.entries(value as Record<string, unknown>).reduce<Record<string, string>>(
      (acc, [key, val]) => {
        if (typeof val === 'string' && val.trim()) {
          acc[key] = val;
        }
        return acc;
      },
      {}
    );
    return Object.keys(entries).length ? entries : undefined;
  };
  const ensureLabel = (path: string, fallback: string) => {
    const value = $json?.(path);
    return typeof value === 'string' && value.trim().length ? value.trim() : fallback;
  };

  const partnerOrder = ['reclameFabriek', 'liaa'] as const;
  const partnerLabels = {
    current: 'Active partnership',
    aspirational: 'Future partnership',
    scale: 'Scale',
    reach: 'Reach',
    innovation: 'Innovation focus',
    programs: 'Programmes'
  } as const;

  $: currentLabel = ensureLabel('home.partners.labels.current', partnerLabels.current);
  $: aspirationalLabel = ensureLabel('home.partners.labels.aspirational', partnerLabels.aspirational);
  $: scaleLabel = ensureLabel('home.partners.labels.scale', partnerLabels.scale);
  $: reachLabel = ensureLabel('home.partners.labels.reach', partnerLabels.reach);
  $: innovationLabel = ensureLabel('home.partners.labels.innovation', partnerLabels.innovation);
  $: programsLabel = ensureLabel('home.partners.labels.programs', partnerLabels.programs);

  const toReadableKey = (value: string) =>
    value
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase())
      .trim();

  const toPartner = (key: (typeof partnerOrder)[number]): Partner => {
    const rawSource = (brands as Record<string, unknown>)[key];
    const raw = (rawSource && typeof rawSource === 'object'
      ? (rawSource as Record<string, unknown>)
      : {}) as Record<string, unknown>;
    const type = (raw.type as 'current' | 'aspirational') ?? 'current';

    const base: Partner = {
      id: key,
      type,
      name: typeof raw.name === 'string' ? raw.name : key,
      relationship: typeof raw.relationship === 'string' ? raw.relationship : undefined,
      description: typeof raw.description === 'string' ? raw.description : undefined,
      note: typeof raw.note === 'string' ? raw.note : undefined,
      logo: typeof raw.logo === 'string' ? raw.logo : undefined,
      website: typeof raw.website === 'string' ? raw.website : undefined,
      location: typeof raw.location === 'string' ? raw.location : undefined,
      founded: typeof raw.founded === 'number' ? raw.founded : undefined,
      scale:
        ensureRecord(raw.scale) ??
        (type === 'aspirational' ? ensureRecord(raw.projectedReach) : undefined),
      programs: type === 'aspirational' ? ensureArray(raw.targetPrograms) : undefined,
      innovation: ensureArray(raw.innovation)
    };

    if (type === 'aspirational' && !base.programs?.length) {
      base.programs = ensureArray(raw.initiatives);
    }

    return base;
  };

  const partnerCards = partnerOrder.map((key) => toPartner(key));
  const majorClients: Client[] = Array.isArray(brands.majorClients)
    ? (brands.majorClients as Array<Record<string, unknown>>)
        .map((entry) => ({
          name: typeof entry.name === 'string' ? entry.name : '',
          logo: typeof entry.logo === 'string' ? entry.logo : undefined,
          category: typeof entry.category === 'string' ? entry.category : undefined,
          region: typeof entry.region === 'string' ? entry.region : undefined
        }))
        .filter((client) => client.name)
        .slice(0, 8)
    : [];

  const typeLabel = (type: Partner['type']) => (type === 'current' ? currentLabel : aspirationalLabel);
</script>

<section class="partners section" id="partners" use:revealOnScroll>
  <div class="container partners__layout">
    <header class="partners__header">
      <span class="eyebrow">{$_('home.partners.eyebrow') || 'Collaborators'}</span>
      <h2>{$_('home.partners.title') || 'Partners who keep us sharp'}</h2>
      <p>
        {$_('home.partners.description') ||
          'We build with signage experts today and nurture education partners so our programmes have real impact.'}
      </p>
    </header>

    <div class="partners__grid" use:staggerReveal={{ stagger: 160 }}>
      {#each partnerCards as partner (partner.id)}
        <GlassCard class="partner-card" padding="lg">
          <div class="partner-card__header">
            <div class="partner-card__logo-wrap">
              {#if partner.logo}
                <img
                  class="partner-card__logo"
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  width="160"
                  height="64"
                />
              {:else}
                <div class="partner-card__logo partner-card__logo--placeholder" aria-hidden="true">{partner.name.charAt(0)}</div>
              {/if}
            </div>
            <div class="partner-card__meta">
              <span class="partner-card__badge" data-type={partner.type}>{typeLabel(partner.type)}</span>
              <h3>{partner.name}</h3>
            </div>
          </div>

          {#if partner.relationship}
            <p class="partner-card__relationship">{partner.relationship}</p>
          {/if}

          {#if partner.description}
            <p class="partner-card__description">{partner.description}</p>
          {/if}

          <dl class="partner-card__details">
            {#if partner.location}
              <div>
                <dt>{$_('home.partners.location') || 'Location'}</dt>
                <dd>{partner.location}</dd>
              </div>
            {/if}

            {#if partner.founded}
              <div>
                <dt>{$_('home.partners.founded') || 'Founded'}</dt>
                <dd>{partner.founded}</dd>
              </div>
            {/if}

            {#if partner.website}
              <div>
                <dt>{$_('home.partners.website') || 'Website'}</dt>
                <dd>
                  <a class="partner-card__link" href={partner.website} target="_blank" rel="noreferrer">
                    {partner.website.replace(/^https?:\/\//, '')}
                  </a>
                </dd>
              </div>
            {/if}

            {#if partner.note}
              <div>
                <dt>{$_('home.partners.note') || 'Note'}</dt>
                <dd>{partner.note}</dd>
              </div>
            {/if}
          </dl>

          {#if partner.scale || partner.programs?.length || partner.innovation?.length}
            <div class="partner-card__extra">
              {#if partner.scale}
                <div class="partner-card__block">
                  <span class="partner-card__label">{partner.type === 'current' ? scaleLabel : reachLabel}</span>
                  <ul>
                    {#each Object.entries(partner.scale) as [label, value]}
                      <li>
                        <span class="partner-card__key">{toReadableKey(label)}</span>
                        <span>{value}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if partner.innovation?.length}
                <div class="partner-card__block">
                  <span class="partner-card__label">{innovationLabel}</span>
                  <ul>
                    {#each partner.innovation as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                </div>
              {/if}

              {#if partner.programs?.length}
                <div class="partner-card__block">
                  <span class="partner-card__label">{programsLabel}</span>
                  <ul>
                    {#each partner.programs as item}
                      <li>{item}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}
        </GlassCard>
      {/each}
    </div>

    {#if majorClients.length}
      <GlassCard class="partners__clients" padding="lg">
        <div>
          <span class="partners__clients-label">{$_('home.partners.clients_label') || 'Clients'}</span>
          <p>
            {$_('home.partners.clients_description') ||
              'Years of signage delivery for retail, finance, and aviation means our AI work stands on proven operations.'}
          </p>
        </div>
        <div class="partners__client-list">
          {#each majorClients as client}
            <span class="partner-chip">
              {#if client.logo}
                <img src={client.logo} alt={client.name} loading="lazy" />
              {:else}
                <span class="partner-chip__placeholder" aria-hidden="true">{client.name.charAt(0)}</span>
              {/if}
              <span class="partner-chip__label">
                <strong>{client.name}</strong>
                {#if client.region}
                  <small>{client.region}</small>
                {/if}
              </span>
            </span>
          {/each}
        </div>
      </GlassCard>
    {/if}
  </div>
</section>

<style>
  .partners {
    padding-block: clamp(4rem, 12vw, 6rem);
  }

  .partners__layout {
    display: grid;
    gap: clamp(2rem, 6vw, 3rem);
  }

  .partners__header {
    display: grid;
    gap: 1rem;
    max-width: 700px;
  }

  .partners__header h2 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 2.6rem);
  }

  .partners__header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.25rem);
    line-height: 1.6;
  }

  .partners__grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.4rem);
  }

  @media (min-width: 900px) {
    .partners__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  :global(.partner-card) {
    display: grid;
    gap: 1.2rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--voyage-blue-rgb), 0.12) 6%);
    --surface-glass-border: color-mix(in srgb, var(--border) 68%, transparent 32%);
  }

  .partner-card__header {
    display: flex;
    gap: 1.2rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .partner-card__logo-wrap {
    flex-shrink: 0;
  }

  .partner-card__logo {
    width: clamp(120px, 20vw, 160px);
    height: auto;
    object-fit: contain;
  }

  .partner-card__logo--placeholder {
    display: grid;
    place-items: center;
    width: clamp(120px, 20vw, 160px);
    height: clamp(60px, 8vw, 80px);
    border-radius: var(--radius);
    background: color-mix(in srgb, var(--voyage-blue) 24%, transparent 76%);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    font-size: 1.8rem;
  }

  .partner-card__meta h3 {
    margin: 0.2rem 0 0;
    font-size: clamp(1.4rem, 3vw, 1.9rem);
  }

  .partner-card__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-2) 92%, transparent 8%);
    color: var(--text-tertiary);
  }

  .partner-card__badge[data-type='aspirational'] {
    background: color-mix(in srgb, var(--signal-yellow) 18%, var(--bg-elev-2) 82%);
    color: var(--text);
  }

  .partner-card__relationship {
    margin: 0;
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
  }

  .partner-card__description {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .partner-card__details {
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }

  .partner-card__details div {
    display: grid;
    gap: 0.2rem;
  }

  .partner-card__details dt {
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .partner-card__details dd {
    margin: 0;
    color: var(--text-secondary);
  }

  .partner-card__link {
    color: var(--voyage-blue);
    text-decoration: none;
  }

  .partner-card__link:hover,
  .partner-card__link:focus-visible {
    text-decoration: underline;
  }

  .partner-card__extra {
    display: grid;
    gap: 1rem;
    padding-top: 0.6rem;
    border-top: 1px solid color-mix(in srgb, var(--border) 70%, transparent 30%);
  }

  .partner-card__block {
    display: grid;
    gap: 0.4rem;
  }

  .partner-card__label {
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .partner-card__block ul {
    margin: 0;
    padding-left: 1.2rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .partner-card__key {
    font-weight: var(--weight-medium);
  }

  :global(.partners__clients) {
    display: grid;
    gap: 1rem;
    align-items: center;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--signal-yellow-rgb), 0.12) 6%);
  }

  @media (min-width: 900px) {
    :global(.partners__clients) {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }

  .partners__clients-label {
    display: inline-flex;
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-2) 92%, transparent 8%);
    color: var(--text-tertiary);
  }

  :global(.partners__clients) p {
    margin: 0.8rem 0 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .partners__client-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .partner-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.9rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--bg-elev-2) 92%, transparent 8%);
  }

  .partner-chip img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .partner-chip__placeholder {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--voyage-blue) 22%, transparent 78%);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  .partner-chip__label {
    display: grid;
    gap: 0.2rem;
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .partner-chip__label strong {
    color: var(--text);
  }
</style>
