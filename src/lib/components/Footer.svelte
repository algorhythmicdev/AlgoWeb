<script>
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { footerLinks } from '$config/navigation';
  import { siteConfig } from '$config/seo';
  import { theme } from '$stores/theme';
  import brands from '$lib/data/brands.json';
  import { translateOrFallback } from '$lib/utils';

  /**
   * @param {unknown} value
   * @param {string} [fallback]
   * @returns {string}
   */
  const ensureString = (value, fallback = '') =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  let isMounted = false;
  $: footerLogoSrc = !isMounted || $theme === 'light' ? '/images/brand/logo-main.png' : '/images/brand/logo-white.png';

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
      <div class="footer-brand">
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
            <a class="footer-partners__cta" href="/about#team">{partnerLinkLabel}</a>

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
    --footer-text: var(--text-secondary);
    --footer-strong: var(--text-strong);
    --footer-muted: var(--text-tertiary);
    --footer-border: var(--border);
    margin-top: clamp(3rem, 8vw, 5rem);
    padding: clamp(3rem, 8vw, 4.5rem) 0 clamp(2rem, 6vw, 3rem);
    position: relative;
    background: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--ink-rgb), 0.06) 8%);
    color: var(--footer-text);
    border-top: 1px solid var(--footer-border);
    backdrop-filter: blur(8px) saturate(1.04);
    -webkit-backdrop-filter: blur(8px) saturate(1.04);
    overflow: hidden;
  }

  .footer::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: var(--grain, var(--grain-texture));
    background-size: 320px 320px;
    mix-blend-mode: soft-light;
    opacity: 0.04;
  }

  .footer > .container {
    position: relative;
    z-index: 1;
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
    color: var(--footer-text);
    font-size: var(--text-small);
  }

  .contact-info a {
    text-decoration: none;
    transition: color var(--duration-ui, 240ms) var(--ease-out);
  }

  .contact-info a:hover,
  .contact-info a:focus-visible {
    color: var(--link);
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
    color: var(--footer-strong);
  }

  .footer-links-section ul {
    display: grid;
    gap: 0.65rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .footer-partners {
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.1rem);
    padding: clamp(1.25rem, 3vw, 1.75rem);
    border-radius: clamp(16px, 3vw, 24px);
    background: var(--bg-elev-2);
    border: 1px solid var(--footer-border);
  }

  .footer-partners h4 {
    margin: 0;
    font-size: var(--text-title);
    color: var(--footer-strong);
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
    gap: 0.6rem;
  }

  .footer-partners__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--footer-border) 70%, transparent 30%);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--footer-text);
    transition: color var(--duration-ui, 240ms) var(--ease-out),
      border-color var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-partners__cta svg {
    transition: transform var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-partners__cta:hover,
  .footer-partners__cta:focus-visible {
    color: var(--accent-primary);
    border-color: color-mix(in srgb, var(--accent-primary) 52%, transparent 48%);
  }

  .footer-partners__cta:hover svg,
  .footer-partners__cta:focus-visible svg {
    transform: translate(3px, -3px);
  }

  .footer-partners__cta--external {
    color: var(--link);
  }

  .footer-links-section a,
  .social-links a {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--footer-text);
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
    background: color-mix(in srgb, var(--link) 70%, transparent 30%);
    transition: width var(--duration-ui, 240ms) var(--ease-out);
  }

  .footer-links-section a:hover,
  .footer-links-section a:focus-visible,
  .social-links a:hover,
  .social-links a:focus-visible {
    color: var(--link);
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
    border-top: 1px solid var(--footer-border);
  }

  .copyright {
    margin: 0;
    font-size: var(--text-small);
    color: var(--footer-muted);
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
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
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

  :global([data-base-theme='dark']) .footer {
    --footer-text: var(--text-secondary);
    --footer-strong: var(--text-strong);
    --footer-muted: color-mix(in srgb, var(--text-secondary) 70%, rgba(var(--night-rgb), 0.56) 30%);
    --footer-border: color-mix(in srgb, var(--border-strong) 70%, transparent 30%);
    background: rgba(var(--night-rgb), 0.82);
    border-top: 1px solid var(--footer-border);
    box-shadow: 0 -12px 32px rgba(var(--ink-rgb), 0.32);
    backdrop-filter: blur(var(--glass-blur, 10px)) saturate(1.08);
    -webkit-backdrop-filter: blur(var(--glass-blur, 10px)) saturate(1.08);
  }

  :global([data-base-theme='dark']) .footer::before {
    opacity: 0.06;
  }
</style>


