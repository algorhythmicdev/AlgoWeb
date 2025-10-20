<script>
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { footerLinks } from '$config/navigation';
  import { siteConfig } from '$config/seo';
  import { theme } from '$stores/theme';
  import brands from '$lib/data/brands.json';
  import { translateOrFallback } from '$lib/utils';
  import GlassCard from '$lib/components/GlassCard.svelte';

  /**
   * @param {unknown} value
   * @param {string} [fallback]
   * @returns {string}
   */
  const ensureString = (value, fallback = '') =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  let isMounted = false;
  $: footerLogoSrc = !isMounted || $theme === 'light' ? '/images/brand/logo-main.svg' : '/images/brand/logo-white.svg';

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

    return {
      name,
      description: ensureString(record.description, ''),
      relationship: ensureString(record.relationship ?? record.note, ''),
      location: ensureString(record.location, ''),
      logo: ensureString(record.logo, ''),
      website,
      websiteLabel: website.replace(/^https?:\/\//, '')
    };
  };

  const featuredPartner = toFeaturedPartner(
    brands && typeof brands === 'object' && 'reclameFabriek' in brands
      ? /** @type {Record<string, unknown>} */ (brands).reclameFabriek
      : null
  );

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
  <div class="container">
    <div class="footer-grid">
      <GlassCard as="section" class="footer-card footer-card--brand" particles padding="lg">
        <img
          src={footerLogoSrc}
          alt={$_('footer.brand_alt')}
          width="180"
          height="48"
        />
        <p class="tagline">{$_('footer.tagline')}</p>
        <p class="status">{$_('footer.status')}</p>
        <div class="contact-info">
          <p>{$_('footer.location')}</p>
          <a href="mailto:{siteConfig.contact.email}">{siteConfig.contact.email}</a>
        </div>
      </GlassCard>

      <GlassCard as="section" class="footer-card footer-card--links" halo padding="lg">
        <nav class="footer-links-section" aria-labelledby="footer-company-heading">
          <h4 id="footer-company-heading">{$_('footer.company')}</h4>
          <ul>
            {#each footerLinks.company as link}
              <li>
                <a href={link.href}>{$_(link.label)}</a>
              </li>
            {/each}
          </ul>
        </nav>

        <nav class="footer-links-section" aria-labelledby="footer-support-heading">
          <h4 id="footer-support-heading">{$_('footer.support')}</h4>
          <ul>
            {#each footerLinks.support as link}
              <li>
                <a href={link.href}>{$_(link.label)}</a>
              </li>
            {/each}
          </ul>
        </nav>

        <nav class="footer-links-section" aria-labelledby="footer-resources-heading">
          <h4 id="footer-resources-heading">{$_('footer.resources')}</h4>
          <ul>
            {#each footerLinks.resources as link}
              <li>
                <a href={link.href}>{$_(link.label)}</a>
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
              <a class="footer-partners__cta" href="/about#team">{partnerLinkLabel}</a>
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
          {#each footerLinks.social as social}
            <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={$_(social.label)}>
              {$_(social.label)}
            </a>
          {/each}
        </div>
      </div>
    </GlassCard>
  </div>
</footer>

<style>
  .footer {
    --footer-text: var(--text-secondary);
    --footer-strong: var(--text-strong);
    --footer-muted: var(--text-tertiary);
    --footer-border: var(--border);
    margin-top: var(--space-4xl);
    padding: var(--space-3xl) 0 var(--space-xl);
    position: relative;
    background: color-mix(in srgb, var(--bg) 88%, transparent 12%);
    color: var(--footer-text);
    border-top: 1px solid color-mix(in srgb, var(--glass-border) 56%, transparent 44%);
  }

  .footer > .container {
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

  @media (min-width: 960px) {
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
    max-width: 200px;
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  :global(.footer-card--brand) img:hover {
    opacity: 0.9;
  }

  .tagline,
  .status,
  .contact-info,
  .contact-info a {
    color: var(--footer-text);
    font-size: var(--text-small);
  }

  .status {
    font-weight: var(--weight-semibold);
    letter-spacing: 0.02em;
  }

  .contact-info a {
    text-decoration: none;
    transition: color var(--duration-ui, 240ms) var(--ease-out);
  }

  .contact-info a:hover,
  .contact-info a:focus-visible {
    color: var(--link);
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
    transition: color var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-links-section a:hover,
  .footer-links-section a:focus-visible {
    color: var(--link);
  }

  .footer-partners {
    display: grid;
    gap: var(--space-md);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--glass-bg-light) 52%, transparent 48%);
    border: 1px solid color-mix(in srgb, var(--glass-border) 60%, transparent 40%);
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
    border: 1px solid color-mix(in srgb, var(--footer-border) 65%, transparent 35%);
    background: color-mix(in srgb, var(--glass-bg-lightest) 70%, transparent 30%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--glass-border) 30%, transparent 70%);
    transition: transform var(--duration-ui) var(--ease-out),
      border-color var(--duration-ui) var(--ease-out),
      background-color var(--duration-ui) var(--ease-out);
  }

  .footer-partners__logo:hover,
  .footer-partners__logo:focus-visible {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--footer-border) 40%, var(--accent-primary) 60%);
    background: color-mix(in srgb, var(--glass-bg-lightest) 82%, transparent 18%);
  }

  .footer-partners__logo img {
    display: block;
    width: min(164px, 100%);
    height: auto;
  }

  .footer-partners__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--footer-border) 65%, transparent 35%);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--footer-text);
    transition: color var(--duration-ui) var(--ease-out),
      border-color var(--duration-ui) var(--ease-out),
      background-color var(--duration-ui) var(--ease-out);
  }

  .footer-partners__cta svg {
    transition: transform var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-partners__cta:hover,
  .footer-partners__cta:focus-visible {
    color: var(--footer-strong);
    border-color: color-mix(in srgb, var(--footer-border) 40%, var(--accent-primary) 60%);
    background: color-mix(in srgb, var(--glass-bg-lightest) 60%, transparent 40%);
  }

  .footer-partners__cta:hover svg,
  .footer-partners__cta:focus-visible svg {
    transform: translateX(4px);
  }

  .footer-partners__cta--external svg {
    width: 1rem;
    height: 1rem;
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
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  @media (max-width: 960px) {
    :global(.footer-card--links) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .footer-partners__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .footer-partners__cta {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  :global([data-theme='hc']) .footer {
    background: var(--bg);
    color: var(--text);
    border-top: 2px solid currentColor;
  }

  :global([data-theme='hc']) .footer-links-section a,
  :global([data-theme='hc']) .social-links a {
    color: var(--text);
  }

  :global([data-theme='hc']) .footer-partners {
    background: transparent;
    border: 2px solid currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .footer-partners__cta {
    color: var(--text);
    border-color: currentColor;
  }

  :global([data-theme='hc']) .footer-bottom {
    border-top: 2px solid currentColor;
  }

  :global([data-base-theme='dark']) .footer {
    --footer-text: var(--text-secondary);
    --footer-strong: var(--text-strong);
    --footer-muted: color-mix(in srgb, var(--text-secondary) 68%, rgba(var(--night-rgb), 0.5) 32%);
    --footer-border: color-mix(in srgb, var(--border-strong) 64%, transparent 36%);
    background: color-mix(in srgb, rgba(var(--night-rgb), 0.86) 70%, rgba(var(--voyage-blue-rgb), 0.12) 30%);
    border-top: 1px solid var(--footer-border);
  }

</style>



