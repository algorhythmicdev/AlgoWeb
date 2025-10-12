<script lang="ts">
  import { _, json } from 'svelte-i18n';
  import { GlassCard } from '$lib/components';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { translateOrFallback } from '$lib/utils';
  import partnersSource from '$lib/data/brands.json';
  import en from '$lib/i18n/en.json';

  type PartnerRecord = {
    key: string;
    name: string;
    type: string;
    relationship: string;
    location: string;
    summary: string;
    logo: string;
    website: string;
    highlights: string[];
  };

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;
  const ensureArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((item) => ensureString(item)).filter(Boolean) : [];

  const fallbackPartners = (en.home?.partners ?? {}) as Record<string, any>;
  const fallbackFeatured = (fallbackPartners.featured ?? {}) as Record<string, any>;
  const fallbackItems = (fallbackFeatured.items ?? {}) as Record<string, any>;

  const toPartnerRecord = (key: string, source: unknown): PartnerRecord | null => {
    if (!source || typeof source !== 'object') return null;
    const record = source as Record<string, unknown>;
    const name = ensureString(record.name, '');
    if (!name) return null;

    const innovationHighlights = ensureArray(record.innovation).slice(0, 3);
    const fallbackHighlights = ensureArray(fallbackItems[key]?.highlights ?? innovationHighlights);

    return {
      key,
      name,
      type: ensureString(record.type, 'current'),
      relationship: ensureString(record.relationship ?? record.note, ''),
      location: ensureString(record.location ?? record.city, ''),
      summary: ensureString(
        fallbackItems[key]?.summary,
        ensureString(record.description ?? fallbackFeatured.summary, '')
      ),
      logo: ensureString(record.logo, ''),
      website: ensureString(record.website, ''),
      highlights: fallbackHighlights.length
        ? fallbackHighlights
        : innovationHighlights.length
          ? innovationHighlights
          : ensureArray(fallbackFeatured.highlights)
    };
  };

  const partnersDataset = partnersSource as Record<string, unknown>;

  const partners = Object.entries(partnersDataset)
    .map(([key, value]) => toPartnerRecord(key, value))
    .filter((partner): partner is PartnerRecord => Boolean(partner));

  const translate = (key: string, fallback: string): string => translateOrFallback($_, key, fallback);

  const resolveSummary = (partner: PartnerRecord): string =>
    translate(`home.partners.featured.items.${partner.key}.summary`, partner.summary);

  const resolveHighlights = (partner: PartnerRecord): string[] => {
    const translatedList = $json?.(`home.partners.featured.items.${partner.key}.highlights`);
    if (Array.isArray(translatedList)) {
      const cleaned = translatedList.map((item, index) => ensureString(item, partner.highlights[index] ?? '')).filter(Boolean);
      if (cleaned.length) return cleaned.slice(0, 4);
    }

    return partner.highlights.slice(0, 4);
  };

  $: partnerCards = partners.map((partner) => ({
    ...partner,
    summary: resolveSummary(partner),
    highlights: resolveHighlights(partner)
  }));

  const fallbackEyebrow = ensureString(fallbackPartners.eyebrow, 'Collaborators');
  const fallbackTitle = ensureString(fallbackPartners.title, 'Partners who keep us sharp');
  const fallbackDescription = ensureString(
    fallbackPartners.description,
    'Signage experts and educators keep our prototypes practical and production-ready.'
  );
  const fallbackRelationship = ensureString(fallbackFeatured.relationship_label, 'Relationship');
  const fallbackLocation = ensureString(fallbackFeatured.location_label, 'Based in');
  const fallbackHighlights = ensureString(fallbackFeatured.highlights_label, 'Why it matters');
  const fallbackVisit = ensureString(fallbackFeatured.cta, 'Visit site');
  const fallbackVisitAria = ensureString(fallbackFeatured.aria, 'Visit {name}');

  $: eyebrow = translate('home.partners.eyebrow', fallbackEyebrow);
  $: title = translate('home.partners.title', fallbackTitle);
  $: description = translate('home.partners.description', fallbackDescription);
  $: relationshipLabel = translate('home.partners.featured.relationship_label', fallbackRelationship);
  $: locationLabel = translate('home.partners.featured.location_label', fallbackLocation);
  $: highlightsLabel = translate('home.partners.featured.highlights_label', fallbackHighlights);
  $: visitLabel = translate('home.partners.featured.cta', fallbackVisit);
  $: visitAria = translate('home.partners.featured.aria', fallbackVisitAria);
</script>

<section class="partners section" id="partners" use:revealOnScroll>
  <div class="container partners__layout">
    <header class="partners__header">
      {#if eyebrow}
        <span class="eyebrow surface-chip" data-tone="accent">{eyebrow}</span>
      {/if}
      <h2>{title}</h2>
      {#if description}
        <p>{description}</p>
      {/if}
    </header>

    {#if partnerCards.length}
      <div class="partners__grid" use:staggerReveal={{ stagger: 160 }}>
        {#each partnerCards as partner (partner.key)}
          <GlassCard as="article" class="partner-card" padding="lg">
            <div class="partner-card__header">
              <div class="partner-card__identity">
                {#if partner.logo}
                  <img
                    class="partner-card__logo"
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    decoding="async"
                  />
                {/if}
                <div>
                  {#if partner.relationship}
                    <span class="partner-card__meta-label">{relationshipLabel}</span>
                    <p class="partner-card__meta-value">{partner.relationship}</p>
                  {/if}
                  <h3>{partner.name}</h3>
                  {#if partner.location}
                    <p class="partner-card__location">{locationLabel}: {partner.location}</p>
                  {/if}
                </div>
              </div>
              {#if partner.website}
                <a
                  class="partner-card__cta"
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={visitAria.replace('{name}', partner.name)}
                >
                  <span>{visitLabel}</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M6 12 12 6M12 6H7.5M12 6v4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              {/if}
            </div>

            {#if partner.summary}
              <p class="partner-card__summary">{partner.summary}</p>
            {/if}

            {#if partner.highlights.length}
              <div class="partner-card__highlights">
                <span class="partner-card__meta-label">{highlightsLabel}</span>
                <ul>
                  {#each partner.highlights as highlight}
                    <li>{highlight}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </GlassCard>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .partners {
    padding-block: clamp(4rem, 10vw, 6rem);
  }

  .partners__layout {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
  }

  .partners__header {
    display: grid;
    gap: 0.9rem;
    max-width: 720px;
  }

  .partners__header h2 {
    margin: 0;
    font-size: clamp(2rem, 4.6vw, 2.8rem);
  }

  .partners__header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.25rem);
    line-height: 1.6;
  }

  .partners__grid {
    display: grid;
    gap: clamp(1.6rem, 4vw, 2.4rem);
  }

  @media (min-width: 900px) {
    .partners__grid {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
  }

  :global(.partner-card) {
    display: grid;
    gap: clamp(1.2rem, 3vw, 1.8rem);
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 96%, rgba(var(--voyage-blue-rgb), 0.08) 4%);
    --surface-glass-border: color-mix(in srgb, var(--border) 68%, transparent 32%);
  }

  .partner-card__header {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(1rem, 3vw, 1.4rem);
    justify-content: space-between;
    align-items: flex-start;
  }

  .partner-card__identity {
    display: flex;
    gap: clamp(0.9rem, 2.6vw, 1.2rem);
    align-items: center;
  }

  .partner-card__logo {
    width: clamp(72px, 14vw, 96px);
    height: clamp(48px, 10vw, 64px);
    object-fit: contain;
    filter: drop-shadow(0 18px 38px rgba(12, 20, 40, 0.14));
  }

  .partner-card__meta-label {
    display: inline-block;
    font-size: var(--text-small);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .partner-card__meta-value {
    margin: 0.3rem 0 0.5rem;
    font-size: clamp(1rem, 2.4vw, 1.2rem);
    color: var(--text-secondary);
  }

  .partner-card__location {
    margin: 0.2rem 0 0;
    color: var(--text-tertiary);
    font-size: var(--text-small);
  }

  .partner-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.8rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--border) 72%, transparent 28%);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    color: var(--link);
    transition: color var(--duration-ui, 240ms) var(--ease-out), border-color var(--duration-ui, 240ms) var(--ease-out);
  }

  .partner-card__cta svg {
    transition: transform var(--duration-ui, 240ms) var(--ease-out);
  }

  .partner-card__cta:hover,
  .partner-card__cta:focus-visible {
    color: var(--accent-primary);
    border-color: color-mix(in srgb, var(--accent-primary) 52%, transparent 48%);
  }

  .partner-card__cta:hover svg,
  .partner-card__cta:focus-visible svg {
    transform: translate(3px, -3px);
  }

  .partner-card__summary {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .partner-card__highlights {
    display: grid;
    gap: 0.6rem;
  }

  .partner-card__highlights ul {
    margin: 0;
    padding-left: 1.2rem;
    color: var(--text-secondary);
    display: grid;
    gap: 0.5rem;
  }

  @media (max-width: 640px) {
    .partner-card__identity {
      flex-direction: column;
      align-items: flex-start;
    }

    .partner-card__cta {
      width: 100%;
      justify-content: center;
    }
  }
</style>
