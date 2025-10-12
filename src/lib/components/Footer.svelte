<script>
  import { _ } from 'svelte-i18n';
  import { footerLinks } from '$config/navigation';
  import { siteConfig } from '$config/seo';
  import { theme } from '$stores/theme';
  import brands from '$lib/data/brands.json';

  /**
   * @param {unknown} value
   * @param {string} [fallback]
   * @returns {string}
   */
  const ensureString = (value, fallback = '') =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const fallbackPartnerTitle = 'Partners';
  const fallbackPartnerSummary =
    'We iterate alongside signage specialists so every AI prototype respects fabrication reality.';
  const fallbackPartnerRelationshipLabel = 'Relationship';
  const fallbackPartnerLocationLabel = 'Location';
  const fallbackPartnerVisitLabel = 'Visit site';

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

  $: partnerTitle = ensureString($_('footer.partners_title'), fallbackPartnerTitle);
  $: partnerSummary = ensureString($_('footer.partners_summary'), fallbackPartnerSummary);
  $: partnerRelationshipLabel = ensureString(
    $_('footer.partners_relationship'),
    fallbackPartnerRelationshipLabel
  );
  $: partnerLocationLabel = ensureString(
    $_('footer.partners_location'),
    fallbackPartnerLocationLabel
  );
  $: partnerVisitLabel = ensureString($_('footer.partners_visit'), fallbackPartnerVisitLabel);
</script>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img
          src={$theme === 'light' ? '/images/brand/logo-main.png' : '/images/brand/logo-white.png'}
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
      </div>

      <div class="footer-meta">
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

        <nav class="footer-links-section" aria-labelledby="footer-products-heading">
          <h4 id="footer-products-heading">{$_('footer.products_title')}</h4>
          <ul>
            {#each footerLinks.platforms as link}
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

        {#if featuredPartner}
          <aside class="footer-partners" aria-labelledby="footer-partners-heading">
            <h4 id="footer-partners-heading">{partnerTitle}</h4>
            <p class="footer-partners__summary">{partnerSummary}</p>

            <div class="footer-partner-card">
              {#if featuredPartner.logo}
                <img
                  src={featuredPartner.logo}
                  alt={featuredPartner.name}
                  loading="lazy"
                  decoding="async"
                  width="96"
                  height="48"
                />
              {/if}

              <div class="footer-partner-card__body">
                <p class="footer-partner-card__name">{featuredPartner.name}</p>

                {#if featuredPartner.relationship || featuredPartner.location}
                  <dl class="footer-partner-card__meta">
                    {#if featuredPartner.relationship}
                      <div>
                        <dt>{partnerRelationshipLabel}</dt>
                        <dd>{featuredPartner.relationship}</dd>
                      </div>
                    {/if}
                    {#if featuredPartner.location}
                      <div>
                        <dt>{partnerLocationLabel}</dt>
                        <dd>{featuredPartner.location}</dd>
                      </div>
                    {/if}
                  </dl>
                {/if}
              </div>
            </div>

            {#if featuredPartner.description}
              <p class="footer-partners__description">{featuredPartner.description}</p>
            {/if}

            {#if featuredPartner.website}
              <a
                class="footer-partners__cta"
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
          </aside>
        {/if}
      </div>
    </div>
    
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
  </div>
</footer>

<style>
  .footer {
    margin-top: clamp(3rem, 8vw, 5rem);
    padding: clamp(3rem, 8vw, 4.5rem) 0 clamp(2rem, 6vw, 3rem);
    background: color-mix(in srgb, var(--graphite, #0f141f) 88%, rgba(0, 0, 0, 0.12) 12%);
    color: color-mix(in srgb, #ffffff 90%, rgba(214, 224, 250, 0.85) 10%);
    border-top: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.18) 70%, rgba(0, 0, 0, 0.5) 30%);
  }

  .footer > .container {
    width: min(100%, var(--container-xl, 1200px));
    margin-inline: auto;
    padding-inline: clamp(1.5rem, 5vw, 3rem);
  }

  .footer-grid {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
    margin-bottom: clamp(2rem, 6vw, 3rem);
  }

  @media (min-width: 960px) {
    .footer-grid {
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 2fr);
      align-items: start;
    }
  }

  .footer-meta {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2rem);
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    align-items: start;
  }

  .footer-brand {
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.25rem);
    max-width: 32rem;
  }

  .footer-brand img {
    max-width: clamp(150px, 18vw, 200px);
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .footer-brand img:hover {
    opacity: 0.9;
  }

  .tagline,
  .status,
  .contact-info,
  .contact-info a {
    color: color-mix(in srgb, rgba(240, 243, 255, 0.88) 85%, rgba(214, 224, 250, 0.72) 15%);
    font-size: var(--text-small);
  }

  .status {
    font-weight: var(--weight-semibold);
  }

  .footer-links-section {
    display: grid;
    gap: clamp(1rem, 3vw, 1.5rem);
    align-content: start;
  }

  .footer-links-section h4 {
    margin: 0;
    font-size: var(--text-title);
    color: color-mix(in srgb, #ffffff 92%, rgba(214, 224, 250, 0.78) 8%);
  }

  .footer-links-section ul {
    display: grid;
    gap: 0.65rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .footer-partners {
    position: relative;
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.1rem);
    padding: clamp(1.25rem, 3vw, 1.75rem);
    border-radius: clamp(16px, 3vw, 24px);
    background: color-mix(in srgb, rgba(20, 28, 44, 0.88) 88%, rgba(255, 255, 255, 0.05) 12%);
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.16) 72%, rgba(0, 0, 0, 0.6) 28%);
    box-shadow: 0 22px 48px rgba(5, 9, 18, 0.45);
  }

  .footer-partners h4 {
    margin: 0;
    font-size: var(--text-title);
    color: color-mix(in srgb, #ffffff 94%, rgba(214, 224, 250, 0.78) 6%);
  }

  .footer-partners__summary,
  .footer-partners__description {
    margin: 0;
    color: color-mix(in srgb, rgba(240, 243, 255, 0.88) 80%, rgba(214, 224, 250, 0.72) 20%);
    font-size: var(--text-small);
    line-height: 1.6;
  }

  .footer-partner-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: clamp(0.9rem, 2.4vw, 1.2rem);
    align-items: center;
  }

  .footer-partner-card img {
    width: clamp(64px, 14vw, 96px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
  }

  .footer-partner-card__body {
    display: grid;
    gap: 0.5rem;
  }

  .footer-partner-card__name {
    margin: 0;
    font-size: clamp(1.05rem, 2.5vw, 1.3rem);
    font-weight: var(--weight-semibold);
    color: #ffffff;
  }

  .footer-partner-card__meta {
    margin: 0;
    display: grid;
    gap: 0.45rem;
  }

  .footer-partner-card__meta div {
    display: grid;
    gap: 0.2rem;
  }

  .footer-partner-card__meta dt {
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: color-mix(in srgb, rgba(214, 224, 250, 0.72) 80%, rgba(255, 255, 255, 0.78) 20%);
  }

  .footer-partner-card__meta dd {
    margin: 0;
    color: color-mix(in srgb, rgba(240, 243, 255, 0.88) 82%, rgba(214, 224, 250, 0.7) 18%);
  }

  .footer-partners__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    width: fit-content;
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, rgba(240, 243, 255, 0.92) 85%, rgba(214, 224, 250, 0.76) 15%);
    text-decoration: none;
    transition: color var(--duration-ui, 240ms) var(--ease-out),
      transform var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-partners__cta svg {
    transition: transform var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-partners__cta:hover,
  .footer-partners__cta:focus-visible {
    color: #ffffff;
  }

  .footer-partners__cta:hover svg,
  .footer-partners__cta:focus-visible svg {
    transform: translate(3px, -3px);
  }

  @media (max-width: 720px) {
    .footer-partner-card {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .footer-partner-card__body {
      align-items: center;
    }

    .footer-partner-card__meta {
      justify-items: center;
    }
  }

  .footer-links-section a,
  .social-links a {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: color-mix(in srgb, rgba(240, 243, 255, 0.9) 82%, rgba(214, 224, 250, 0.8) 18%);
    text-decoration: none;
    transition: color var(--duration-ui, 240ms) var(--ease-out),
      transform var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-links-section a::after,
  .social-links a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.2rem;
    width: 0;
    height: 2px;
    background: currentColor;
    transition: width var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-links-section a:hover,
  .footer-links-section a:focus-visible,
  .social-links a:hover,
  .social-links a:focus-visible {
    color: #ffffff;
  }

  .footer-links-section a:hover::after,
  .footer-links-section a:focus-visible::after,
  .social-links a:hover::after,
  .social-links a:focus-visible::after {
    width: 100%;
  }

  .footer-links-section a:focus-visible,
  .social-links a:focus-visible {
    outline: none;
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: clamp(1rem, 2.5vw, 1.5rem);
    padding-top: clamp(1.75rem, 4vw, 2.25rem);
    border-top: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.16) 70%, rgba(0, 0, 0, 0.5) 30%);
  }

  .copyright {
    margin: 0;
    font-size: var(--text-small);
    color: color-mix(in srgb, rgba(214, 224, 250, 0.85) 85%, rgba(255, 255, 255, 0.88) 15%);
  }

  .social-links {
    display: flex;
    gap: clamp(1rem, 2.5vw, 1.75rem);
  }

  @media (max-width: 768px) {
    .footer-brand,
    .footer-links-section,
    .footer-bottom,
    .footer-partners {
      text-align: center;
      align-items: center;
      justify-content: center;
    }

    .social-links {
      justify-content: center;
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

  :global([data-theme='hc']) .footer-links-section a::after,
  :global([data-theme='hc']) .social-links a::after {
    display: none;
  }

  :global([data-theme='hc']) .footer-partners {
    background: transparent;
    border: 2px solid currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .footer-partners__cta {
    color: var(--text);
  }

  :global([data-theme='hc']) .footer-bottom {
    border-top: 2px solid currentColor;
  }
</style>
