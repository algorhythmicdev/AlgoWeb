<script>
  import { _ } from 'svelte-i18n';
  import { footerLinks } from '$config/navigation';
  import { siteConfig } from '$config/seo';
  import { theme } from '$stores/theme';
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
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: clamp(2rem, 5vw, 3rem);
    margin-bottom: clamp(2rem, 6vw, 3rem);
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

  @media (max-width: 1024px) {
    .footer-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    .footer-grid {
      grid-template-columns: 1fr;
    }

    .footer-brand,
    .footer-links-section,
    .footer-bottom {
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

  :global([data-theme='hc']) .footer-bottom {
    border-top: 2px solid currentColor;
  }
</style>
