<script>
  import { _ } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { footerLinks } from '$config/navigation';
  import { theme } from '$stores/theme';
  import brands from '$lib/data/brands.json';
  import { translateOrFallback } from '$lib/utils';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Container from '$lib/components/Container.svelte';
  import { withBase } from '$utils/paths';

  /**
   * @param {unknown} value
   * @param {string} [fallback]
   * @returns {string}
   */
  const ensureString = (value, fallback = '') =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  let isMounted = false;

  /**
   * @param {string} path
   */
  const assetPath = (path) => withBase(path) ?? path;

  $: footerLogo = (!isMounted || $theme === 'light')
    ? {
        svg: assetPath('/images/brand/logo-main.svg'),
        png: assetPath('/images/brand/logo-main.png')
      }
    : {
        svg: assetPath('/images/brand/logo-white.svg'),
        png: assetPath('/images/brand/logo-white.png')
      };

  onMount(() => {
    isMounted = true;
  });

  const fallbackPartnerTitle = 'Partners';
  const fallbackPartnerSummary =
    'We iterate alongside signage specialists so every AI prototype respects fabrication reality.';
  const fallbackPartnerVisitLabel = 'Visit site';
  const fallbackPartnerLinkLabel = 'Meet our collaborators';

  /**
   * @param {unknown} source
   */
  const toFeaturedPartner = (source) => {
    if (!source || typeof source !== 'object') return null;
    const record = /** @type {Record<string, unknown>} */ (source);
    const name = ensureString(record.name, '');
    if (!name) return null;

    const website = ensureString(record.website, '');

    const logo = ensureString(record.logo, '');
    const resolvedLogo = logo ? withBase(logo) ?? logo : '';

    return {
      name,
      description: ensureString(record.description, ''),
      relationship: ensureString(record.relationship ?? record.note, ''),
      location: ensureString(record.location, ''),
      logo: resolvedLogo,
      website,
      websiteLabel: website.replace(/^https?:\/\//, '')
    };
  };

  const featuredPartner = toFeaturedPartner(
    brands && typeof brands === 'object' && 'reclameFabriek' in brands
      ? /** @type {Record<string, unknown>} */ (brands).reclameFabriek
      : null
  );

  const hasHref = (value) => typeof value === 'string' && value.trim().length > 0;
  const isExternalLink = (href) => hasHref(href) && /^https?:/i.test(href ?? '');

  $: socialLinks = footerLinks.social.filter((item) => hasHref(item.href));

  /**
   * @param {string} key
   * @param {string} fallback
   */
  const translate = (key, fallback) => translateOrFallback($_, key, fallback);

  $: partnerTitle = translate('footer.partners_title', fallbackPartnerTitle);
  $: partnerSummary = translate('footer.partners_summary', fallbackPartnerSummary);
  $: partnerVisitLabel = translate('footer.partners_visit', fallbackPartnerVisitLabel);
  $: partnerLinkLabel = translate('footer.partners_link', fallbackPartnerLinkLabel);
</script>

<footer class="footer">
  <Container class="footer__inner">
    <div class="footer-grid">
      <GlassCard as="section" class="footer-card footer-card--brand" particles padding="lg">
        <picture>
          <source srcset={footerLogo.svg} type="image/svg+xml" />
          <img
            src={footerLogo.png}
            alt={$_('footer.brand_alt')}
            width="180"
            height="48"
          />
        </picture>
        <p class="note">{$_('footer.note')}</p>
      </GlassCard>

      <GlassCard as="section" class="footer-card footer-card--links" halo padding="lg">
        <nav class="footer-links-section" aria-labelledby="footer-company-heading">
          <h4 id="footer-company-heading">{$_('footer.company')}</h4>
          <ul>
              {#each footerLinks.company as link}
                <li>
                  <a href={withBase(link.href)}>{$_(link.label)}</a>
                </li>
              {/each}
          </ul>
        </nav>

        <nav class="footer-links-section" aria-labelledby="footer-solutions-heading">
          <h4 id="footer-solutions-heading">{$_('footer.solutions')}</h4>
          <ul>
              {#each footerLinks.solutions as link}
                <li>
                  <a href={withBase(link.href)}>{$_(link.label)}</a>
                </li>
              {/each}
          </ul>
        </nav>

        <nav class="footer-links-section" aria-labelledby="footer-legal-heading">
          <h4 id="footer-legal-heading">{$_('footer.legal')}</h4>
          <ul>
            {#each footerLinks.legal as link}
              <li>
                {#if link.href}
                  <a href={withBase(link.href)}>{$_(link.label)}</a>
                {:else}
                  <span class="footer-link footer-link--disabled" aria-disabled="true">
                    {$_(link.label)}
                  </span>
                {/if}
              </li>
            {/each}
          </ul>
        </nav>

        <aside class="footer-partners" aria-labelledby="footer-partners-heading">
          <h4 id="footer-partners-heading">{partnerTitle}</h4>
          <p class="footer-partners__summary">{partnerSummary}</p>

          <div class="footer-partners__actions">
            {#if featuredPartner?.logo && featuredPartner?.website}
              <a
                class="footer-partners__logo"
                href={featuredPartner.website}
                target="_blank"
                rel="noreferrer"
                aria-label={`${partnerVisitLabel}: ${featuredPartner.name}`}
              >
                <img src={featuredPartner.logo} alt="" loading="lazy" aria-hidden="true" />
              </a>
            {:else}
              <a class="footer-partners__cta" href={withBase('/about#team')}>{partnerLinkLabel}</a>
            {/if}

            {#if featuredPartner?.website}
              <a
                class="footer-partners__cta footer-partners__cta--external"
                href={featuredPartner.website}
                target="_blank"
                rel="noreferrer"
                aria-label={`${partnerVisitLabel}: ${featuredPartner.name}`}
              >
                <span>{partnerVisitLabel}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M5.333 10.667 10.667 5.333M10.667 5.333h-4m4 0v4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            {/if}
          </div>
        </aside>
      </GlassCard>
    </div>

    <GlassCard as="section" class="footer-card footer-card--bottom" padding="md">
      <div class="footer-bottom">
        <p class="copyright">{$_('footer.copyright')}</p>
        <div class="social-links">
          {#each socialLinks as social (social.label)}
            <a
              href={social.href}
              target={isExternalLink(social.href) ? '_blank' : undefined}
              rel={isExternalLink(social.href) ? 'noopener noreferrer' : undefined}
              aria-label={$_(social.label)}
            >
              {$_(social.label)}
            </a>
          {/each}
        </div>
      </div>
    </GlassCard>
  </Container>
</footer>

<style>
  .footer {
    --footer-text: var(--text-secondary);
    --footer-strong: var(--text-strong);
    --footer-muted: var(--text-tertiary);
    --footer-border: var(--border);
    --footer-border-width: var(--border-width-hairline);
    --footer-logo-max: calc(var(--space-4) * 12.5);
    --footer-partner-logo-max: calc(var(--space-4) * 10.25);
    --footer-card-min: calc(var(--space-4) * 12.5);
    --footer-cta-tracking: var(--tracking-meta);
    --footer-social-tracking: var(--control-tile-label-tracking-md);
    margin-top: var(--space-4xl);
    padding: var(--space-3xl) 0 var(--space-xl);
    position: relative;
    background: color-mix(in srgb, var(--bg) 88%, transparent 12%);
    color: var(--footer-text);
    border-top: var(--footer-border-width) solid
      color-mix(in srgb, var(--glass-border) 56%, transparent 44%);
  }

  :global(.footer__inner) {
    width: min(100%, var(--container-xl));
    margin-inline: auto;
    padding-inline: var(--space-xl);
    display: grid;
    gap: var(--space-3xl);
  }

  .footer-grid {
    display: grid;
    gap: var(--space-2xl);
  }

  @media (min-width: 60rem) {
    .footer-grid {
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 2fr);
      align-items: stretch;
    }
  }

  :global(.footer-card) {
    display: grid;
    gap: var(--space-lg);
    color: var(--footer-text);
  }

  :global(.footer-card--brand) {
    align-content: start;
    gap: var(--space-md);
  }

  :global(.footer-card--brand) img {
    max-width: var(--footer-logo-max);
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  :global(.footer-card--brand) img:hover {
    opacity: 0.9;
  }

  .note {
    color: var(--footer-text);
    font-size: var(--text-small);
  }

  :global(.footer-card--links) {
    gap: var(--space-xl);
  }

  .footer-links-section h4,
  .footer-partners h4 {
    margin: 0;
    font-size: var(--text-title);
    color: var(--footer-strong);
  }

  .footer-links-section ul {
    display: grid;
    gap: var(--space-sm);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .footer-links-section a {
    color: inherit;
    text-decoration: none;
    font-size: var(--text-small);
    transition: color var(--duration-ui) var(--ease-out);
  }

  .footer-links-section a:hover,
  .footer-links-section a:focus-visible {
    color: var(--link);
  }

  .footer-link--disabled {
    display: inline-flex;
    align-items: center;
    font-size: var(--text-small);
    color: var(--footer-muted);
    cursor: default;
    text-decoration: none;
  }

  .footer-partners {
    display: grid;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--glass-bg-light) 52%, transparent 48%);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--glass-border) 60%, transparent 40%);
    box-shadow: var(--shadow-glass-md);
  }

  .footer-partners__summary {
    margin: 0;
    color: var(--footer-text);
    font-size: var(--text-small);
    line-height: 1.6;
  }

  .footer-partners__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .footer-partners__logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-lg);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--footer-border) 65%, transparent 35%);
    background: color-mix(in srgb, var(--glass-bg-lightest) 70%, transparent 30%);
    box-shadow: inset 0 0 0 var(--border-width-hairline)
      color-mix(in srgb, var(--glass-border) 30%, transparent 70%);
    transition: transform var(--duration-ui) var(--ease-out),
      border-color var(--duration-ui) var(--ease-out),
      background-color var(--duration-ui) var(--ease-out);
  }

  .footer-partners__logo:hover,
  .footer-partners__logo:focus-visible {
    transform: translateY(calc(-1 * var(--border-width-thin)));
    border-color: color-mix(in srgb, var(--footer-border) 40%, var(--accent-primary) 60%);
    background: color-mix(in srgb, var(--glass-bg-lightest) 82%, transparent 18%);
  }

  .footer-partners__logo img {
    display: block;
    width: min(100%, var(--footer-partner-logo-max));
    height: auto;
  }

  .footer-partners__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-full);
    border: var(--border-width-hairline) solid
      color-mix(in srgb, var(--footer-border) 65%, transparent 35%);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--footer-cta-tracking);
    text-transform: uppercase;
    text-decoration: none;
    color: var(--footer-text);
    transition: color var(--duration-ui) var(--ease-out),
      border-color var(--duration-ui) var(--ease-out),
      background-color var(--duration-ui) var(--ease-out);
  }

  .footer-partners__cta svg {
    transition: transform var(--duration-ui) var(--ease-out);
  }

  .footer-partners__cta:hover,
  .footer-partners__cta:focus-visible {
    color: var(--footer-strong);
    border-color: color-mix(in srgb, var(--footer-border) 40%, var(--accent-primary) 60%);
    background: color-mix(in srgb, var(--glass-bg-lightest) 60%, transparent 40%);
  }

  .footer-partners__cta:hover svg,
  .footer-partners__cta:focus-visible svg {
    transform: translateX(var(--space-3xs));
  }

  .footer-partners__cta--external svg {
    inline-size: var(--space-4);
    block-size: var(--space-4);
  }

  :global(.footer-card--bottom) {
    padding-block: var(--space-lg);
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    align-items: center;
    justify-content: space-between;
  }

  .footer-bottom a {
    color: var(--footer-text);
    text-decoration: none;
    font-size: var(--text-small);
    transition: color var(--duration-ui) var(--ease-out);
  }

  .footer-bottom a:hover,
  .footer-bottom a:focus-visible {
    color: var(--link);
  }

  .social-links {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .social-links a {
    letter-spacing: var(--footer-social-tracking);
    text-transform: uppercase;
  }

  @media (max-width: 60rem) {
    :global(.footer-card--links) {
      grid-template-columns: repeat(auto-fit, minmax(var(--footer-card-min), 1fr));
    }
  }

  @media (max-width: 48rem) {
    .footer-partners__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .footer-partners__cta {
      justify-content: center;
    }
  }

  @media (max-width: 40rem) {
    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  :global([data-theme='hc']) .footer {
    background: var(--bg);
    color: var(--text);
    border-top: var(--border-width-thin) solid currentColor;
  }

  :global([data-theme='hc']) .footer-links-section a,
  :global([data-theme='hc']) .social-links a {
    color: var(--text);
  }

  :global([data-theme='hc']) .footer-partners {
    background: transparent;
    border: var(--border-width-thin) solid currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .footer-partners__cta {
    color: var(--text);
    border-color: currentColor;
  }

  :global([data-theme='hc']) .footer-bottom {
    border-top: var(--border-width-thin) solid currentColor;
  }

  :global([data-base-theme='dark']) .footer {
    --footer-text: var(--text-secondary);
    --footer-strong: var(--text-strong);
    --footer-muted: color-mix(in srgb, var(--text-secondary) 68%, rgba(var(--night-rgb), 0.5) 32%);
    --footer-border: color-mix(in srgb, var(--border-strong) 64%, transparent 36%);
    background: color-mix(in srgb, rgba(var(--night-rgb), 0.86) 70%, rgba(var(--voyage-blue-rgb), 0.12) 30%);
    border-top: var(--footer-border-width) solid var(--footer-border);
  }

</style>



