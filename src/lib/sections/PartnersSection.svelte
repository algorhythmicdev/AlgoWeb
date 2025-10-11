<script lang="ts">
  import { _, json } from 'svelte-i18n';
  import brands from '$data/brands.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

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

  const partnerOrder = ['reclameFabriek', 'liaa'] as const;
  const partnerLabels = {
    current: 'Active partnership',
    aspirational: 'Next partnership',
    scale: 'Scale at a glance',
    innovation: 'Innovation focus',
    reach: 'Projected reach',
    programs: 'Programs in motion'
  } as const;

  const ensureArray = (value: unknown): string[] => (Array.isArray(value) ? value : []);

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

  const ensureLabel = (path: string, fallback: string): string => {
    const value = $json?.(path);
    return typeof value === 'string' && value.trim() ? value : fallback;
  };

  const toReadableKey = (value: string) =>
    value
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase())
      .trim();

  let currentLabel: string = partnerLabels.current;
  let aspirationalLabel: string = partnerLabels.aspirational;
  let scaleLabel: string = partnerLabels.scale;
  let innovationLabel: string = partnerLabels.innovation;
  let reachLabel: string = partnerLabels.reach;
  let programsLabel: string = partnerLabels.programs;

  $: currentLabel = ensureLabel('partners.labels.current', partnerLabels.current);
  $: aspirationalLabel = ensureLabel('partners.labels.aspirational', partnerLabels.aspirational);
  $: scaleLabel = ensureLabel('partners.labels.scale', partnerLabels.scale);
  $: innovationLabel = ensureLabel('partners.labels.innovation', partnerLabels.innovation);
  $: reachLabel = ensureLabel('partners.labels.reach', partnerLabels.reach);
  $: programsLabel = ensureLabel('partners.labels.programs', partnerLabels.programs);

  const toPartner = (key: (typeof partnerOrder)[number]): Partner => {
    const rawSource = (brands as Record<string, unknown>)[key];
    const raw = (rawSource && typeof rawSource === 'object'
      ? (rawSource as Record<string, unknown>)
      : {}) as Record<string, unknown>;
    const type = (raw.type as 'current' | 'aspirational') ?? 'current';

    const base: Partner = {
      id: key,
      type,
      name: String(raw.name ?? key),
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
      programs:
        type === 'aspirational'
          ? ensureArray(raw.targetPrograms)
          : undefined,
      innovation: ensureArray(raw.innovation)
    };

    if (type === 'aspirational' && !base.programs?.length) {
      base.programs = ensureArray(raw.initiatives);
    }

    return base;
  };

  const partnerCards = partnerOrder.map((key) => toPartner(key));
  const majorClients = Array.isArray(brands.majorClients) ? brands.majorClients.slice(0, 8) : [];
</script>

<section class="partners section" id="partners" use:revealOnScroll>
  <div class="container">
    <header class="partners__intro">
      <span class="eyebrow">{$_('partners.eyebrow') || 'Allies in motion'}</span>
      <h2>{$_('partners.title') || 'Building with trusted operators'}</h2>
      <p>{$_('partners.description') || 'We operate with signage manufacturers today and line up public-sector allies for the next education wave.'}</p>
    </header>

    <div class="partners__grid" use:staggerReveal={{ stagger: 160 }}>
      {#each partnerCards as partner (partner.id)}
        <article class="partner-card os-window" data-variant={partner.type === 'current' ? 'grid' : 'line'}>
          <div class="partner-card__header">
            <div class="partner-card__badge" data-type={partner.type}>
              {partner.type === 'current' ? currentLabel : aspirationalLabel}
            </div>
            {#if partner.logo}
              <img
                class="partner-card__logo"
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                width="192"
                height="64"
                sizes="(max-width: 768px) 160px, 192px"
              />
            {/if}
          </div>

          <div class="partner-card__body">
            <h3>{partner.name}</h3>
            {#if partner.relationship}
              <p class="partner-card__relationship">{partner.relationship}</p>
            {/if}
            {#if partner.description}
              <p>{partner.description}</p>
            {/if}

            <dl class="partner-card__details">
              {#if partner.location}
                <div>
                  <dt>{$_('partners.location') || 'Location'}</dt>
                  <dd>{partner.location}</dd>
                </div>
              {/if}

              {#if partner.founded}
                <div>
                  <dt>{$_('partners.founded') || 'Founded'}</dt>
                  <dd>{partner.founded}</dd>
                </div>
              {/if}

              {#if partner.website}
                <div>
                  <dt>{$_('partners.website') || 'Website'}</dt>
                  <dd>
                    <a class="partner-card__link" href={partner.website} target="_blank" rel="noreferrer">
                      {partner.website.replace(/^https?:\/\//, '')}
                    </a>
                  </dd>
                </div>
              {/if}
            </dl>
          </div>

          {#if partner.scale || partner.innovation?.length || partner.programs?.length}
            <div class="partner-card__meta surface-panel">
              {#if partner.scale}
                <div class="partner-card__block">
                  <span class="partner-card__label">{partner.type === 'current' ? scaleLabel : reachLabel}</span>
                  <ul>
                    {#each Object.entries(partner.scale) as [label, value]}
                      <li>
                        <span class="partner-card__meta-key">{toReadableKey(label)}</span>
                        <span class="partner-card__meta-value">{value}</span>
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

              {#if partner.note}
                <p class="partner-card__note">{partner.note}</p>
              {/if}
            </div>
          {/if}
        </article>
      {/each}
    </div>

    {#if majorClients.length}
      <aside class="partners__clients os-window" data-variant="halo" aria-label={$_('partners.clients_label') || 'Selected clients'}>
        <header>
          <span class="partners__clients-eyebrow">{$_('partners.clients_title') || "Global brands we've supported"}</span>
          <p>{$_('partners.clients_description') || 'Our manufacturing heritage brings signage discipline trusted by global retail, finance, and aviation leaders.'}</p>
        </header>
        <ul class="partners__client-list">
          {#each majorClients as client}
            <li class="partners__client surface-panel">
              <span class="partners__client-name">{client.name}</span>
              <span class="partners__client-category">{client.category}</span>
              <span class="partners__client-region">{client.region}</span>
            </li>
          {/each}
        </ul>
      </aside>
    {/if}
  </div>
</section>

<style>
  .partners__intro {
    display: grid;
    gap: clamp(0.9rem, 2.2vw, 1.4rem);
    max-width: min(68ch, 100%);
    margin-bottom: clamp(2.4rem, 6vw, 3.8rem);
  }

  .partners__intro h2 {
    margin: 0;
    background: var(--gradient-heading);
    -webkit-background-clip: text;
    color: transparent;
    background-clip: text;
  }

  .partners__intro p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.22rem);
    line-height: 1.68;
  }

  .partners__grid {
    display: grid;
    gap: clamp(1.8rem, 4vw, 2.6rem);
    margin-bottom: clamp(2.4rem, 6vw, 3.6rem);
  }

  .partner-card {
    display: grid;
    gap: clamp(1.4rem, 3.2vw, 2rem);
    padding: clamp(1.8rem, 3.6vw, 2.6rem);
    border-radius: clamp(1.6rem, 3.6vw, 2.4rem);
  }

  .partner-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1.2rem, 3vw, 1.8rem);
    flex-wrap: wrap;
  }

  .partner-card__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 1.1rem;
    border-radius: var(--radius-full, 999px);
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: var(--weight-semibold);
    background: color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--aurora-purple-rgb), 0.18) 18%);
    border: 1px solid color-mix(in srgb, var(--border) 55%, rgba(var(--aurora-purple-rgb), 0.22) 45%);
    color: var(--text-tertiary);
  }

  .partner-card__badge[data-type='aspirational'] {
    background: color-mix(in srgb, var(--bg-elev-2) 75%, rgba(var(--signal-yellow-rgb), 0.24) 25%);
    border-color: color-mix(in srgb, var(--border) 48%, rgba(var(--signal-yellow-rgb), 0.3) 52%);
    color: color-mix(in srgb, var(--text) 78%, rgba(var(--signal-yellow-rgb), 0.38) 22%);
  }

  .partner-card__logo {
    height: clamp(32px, 6vw, 48px);
    width: auto;
    filter: drop-shadow(0 12px 24px rgba(10, 13, 20, 0.1));
  }

  .partner-card__body h3 {
    margin: 0;
    font-size: clamp(1.6rem, 3.2vw, 2.2rem);
    line-height: 1.18;
  }

  .partner-card__relationship {
    margin: 0.35rem 0 0.6rem;
    font-size: var(--text-small);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .partner-card__body p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.68;
  }

  .partner-card__details {
    margin: clamp(1.2rem, 2.6vw, 1.8rem) 0 0;
    display: grid;
    gap: 0.75rem;
  }

  .partner-card__details div {
    display: grid;
    gap: 0.2rem;
  }

  .partner-card__details dt {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text-tertiary);
  }

  .partner-card__details dd {
    margin: 0;
    color: var(--text-secondary);
  }

  .partner-card__link {
    color: inherit;
    text-decoration: none;
    position: relative;
  }

  .partner-card__link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: 0.32;
    transition: opacity 160ms var(--ease-in-out);
  }

  .partner-card__link:hover::after,
  .partner-card__link:focus-visible::after {
    opacity: 1;
  }

  .partner-card__meta {
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.6rem);
    padding: clamp(1.2rem, 2.8vw, 1.8rem);
    border-radius: clamp(1.2rem, 3vw, 1.8rem);
    --surface-panel-bg: color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--voyage-blue-rgb), 0.16) 18%);
    --surface-panel-border: color-mix(in srgb, var(--border) 54%, rgba(var(--voyage-blue-rgb), 0.24) 46%);
    --surface-panel-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.12) 4%);
    --surface-panel-hc-border: color-mix(in srgb, var(--border-strong) 64%, rgba(var(--voyage-blue-rgb), 0.24) 36%);
  }

  .partner-card[data-variant='line'] .partner-card__meta {
    --surface-panel-bg: color-mix(in srgb, var(--bg-elev-2) 78%, rgba(var(--signal-yellow-rgb), 0.18) 22%);
    --surface-panel-border: color-mix(in srgb, var(--border) 46%, rgba(var(--signal-yellow-rgb), 0.28) 54%);
    --surface-panel-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--signal-yellow-rgb), 0.12) 4%);
    --surface-panel-hc-border: color-mix(in srgb, var(--border-strong) 62%, rgba(var(--signal-yellow-rgb), 0.3) 38%);
  }

  .partner-card__block {
    display: grid;
    gap: 0.65rem;
  }

  .partner-card__label {
    font-size: var(--text-small);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .partner-card__block ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.55rem;
  }

  .partner-card__meta-key {
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-tertiary);
  }

  .partner-card__meta-value {
    font-weight: var(--weight-semibold, 600);
  }

  .partner-card__note {
    margin: 0;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-lg, 18px);
    background: color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.22) 52%, rgba(255, 255, 255, 0.75) 48%);
    color: color-mix(in srgb, var(--text) 80%, rgba(var(--signal-yellow-rgb), 0.48) 20%);
    font-size: var(--text-small);
  }

  .partners__clients {
    display: grid;
    gap: clamp(1.4rem, 3vw, 2rem);
    padding: clamp(1.8rem, 3.4vw, 2.4rem);
    border-radius: clamp(1.6rem, 3.4vw, 2.2rem);
  }

  .partners__clients header {
    display: grid;
    gap: 0.6rem;
  }

  .partners__clients-eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .partners__clients p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  .partners__client-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: clamp(0.8rem, 2vw, 1.2rem);
  }

  .partners__client {
    display: grid;
    gap: 0.3rem;
    padding: 0.9rem 1.1rem;
    border-radius: var(--radius-lg, 18px);
    --surface-panel-bg: color-mix(in srgb, var(--bg-elev-2) 80%, rgba(var(--voyage-blue-rgb), 0.1) 20%);
    --surface-panel-border: color-mix(in srgb, var(--border) 58%, rgba(var(--voyage-blue-rgb), 0.22) 42%);
    --surface-panel-shadow: 0 16px 28px rgba(var(--voyage-blue-rgb), 0.12);
    --surface-panel-hc-bg: color-mix(in srgb, var(--bg) 98%, rgba(var(--voyage-blue-rgb), 0.1) 2%);
    --surface-panel-hc-border: color-mix(in srgb, var(--border-strong) 66%, rgba(var(--voyage-blue-rgb), 0.24) 34%);
  }

  .partners__client-name {
    font-weight: var(--weight-semibold, 600);
  }

  .partners__client-category {
    font-size: var(--text-small);
    color: var(--text-tertiary);
    letter-spacing: 0.08em;
  }

  .partners__client-region {
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .partner-card__meta {
      padding: 1rem 1.2rem;
    }

    .partner-card__details {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }
  }

  :global(html[data-theme='dark']) .partner-card__meta {
    --surface-panel-bg: color-mix(in srgb, var(--bg-elev-2) 76%, rgba(var(--aurora-purple-rgb), 0.24) 24%);
    --surface-panel-border: color-mix(in srgb, var(--border) 44%, rgba(var(--aurora-purple-rgb), 0.32) 56%);
    --surface-panel-hc-bg: color-mix(in srgb, var(--bg) 94%, rgba(var(--aurora-purple-rgb), 0.16) 6%);
    --surface-panel-hc-border: color-mix(in srgb, var(--border-strong) 60%, rgba(var(--aurora-purple-rgb), 0.32) 40%);
  }

  :global(html[data-theme='dark']) .partner-card[data-variant='line'] .partner-card__meta {
    --surface-panel-bg: color-mix(in srgb, var(--bg-elev-2) 70%, rgba(var(--signal-yellow-rgb), 0.26) 30%);
    --surface-panel-border: color-mix(in srgb, var(--border) 38%, rgba(var(--signal-yellow-rgb), 0.38) 62%);
    --surface-panel-hc-bg: color-mix(in srgb, var(--bg) 92%, rgba(var(--signal-yellow-rgb), 0.18) 8%);
    --surface-panel-hc-border: color-mix(in srgb, var(--border-strong) 56%, rgba(var(--signal-yellow-rgb), 0.4) 44%);
  }

  :global(html[data-theme='hc']) .partner-card__badge,
  :global(html[data-theme='hc']) .partners__clients-eyebrow,
  :global(html[data-theme='hc']) .partner-card__label {
    color: var(--text);
  }
</style>
