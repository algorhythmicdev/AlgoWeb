<script>
  import { _ } from 'svelte-i18n';
  import { footerLinks } from '$config/navigation';
  import { siteConfig } from '$config/seo';
  import { theme } from '$stores/theme';
</script>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand os-window">
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
      
      <nav class="footer-links-section os-window" aria-labelledby="footer-company-heading">
        <h4 id="footer-company-heading">{$_('footer.company')}</h4>
        <ul>
          {#each footerLinks.company as link}
            <li>
              <a href={link.href}>{$_(link.label)}</a>
            </li>
          {/each}
        </ul>
      </nav>

      <nav class="footer-links-section os-window" aria-labelledby="footer-products-heading">
        <h4 id="footer-products-heading">{$_('footer.products_title')}</h4>
        <ul>
          {#each footerLinks.platforms as link}
            <li>
              <a href={link.href}>{$_(link.label)}</a>
            </li>
          {/each}
        </ul>
      </nav>

      <nav class="footer-links-section os-window" aria-labelledby="footer-resources-heading">
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
    
    <div class="footer-bottom os-window">
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
    margin-top: var(--space-24);
    padding: clamp(4rem, 10vw, 6rem) 0 clamp(2rem, 6vw, 3rem);
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(120% 120% at 50% 0%, rgba(16, 28, 56, 0.78) 0%, rgba(8, 14, 32, 0.92) 55%, rgba(6, 10, 24, 0.96) 100%),
      linear-gradient(180deg, rgba(5, 8, 18, 0.94) 0%, rgba(5, 9, 20, 0.96) 100%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.86) 78%, rgba(214, 224, 250, 0.82) 22%);
    border-top: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.12) 55%, rgba(8, 14, 28, 0.6) 45%);
  }

  .footer::before {
    content: '';
    position: absolute;
    inset: auto -15% -40%;
    height: clamp(16rem, 30vw, 22rem);
    background: radial-gradient(circle at 65% 20%, rgba(var(--aurora-purple-rgb), 0.28), transparent 72%);
    filter: blur(160px);
    opacity: 0.5;
    pointer-events: none;
  }

  :global([data-base-theme='dark']) .footer::before {
    background: radial-gradient(circle at 60% 18%, rgba(var(--aurora-purple-rgb), 0.42), transparent 76%);
    opacity: 0.7;
  }

  .footer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 40%);
    pointer-events: none;
    mix-blend-mode: soft-light;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: clamp(2rem, 5vw, 3.4rem);
    margin-bottom: clamp(2rem, 6vw, 3.5rem);
    position: relative;
    z-index: 1;
  }

  .footer-grid > * {
    --surface-glass-blur: 26px;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 84%, rgba(var(--voyage-blue-rgb), 0.18) 16%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.34) 62%, rgba(255, 255, 255, 0.36) 38%);
    --surface-glass-bg: color-mix(in srgb, rgba(16, 28, 56, 0.86) 78%, rgba(var(--voyage-blue-rgb), 0.24) 22%);
    --surface-glass-border: color-mix(in srgb, rgba(92, 112, 160, 0.52) 62%, rgba(255, 255, 255, 0.18) 38%);
    --surface-glass-shadow: 0 32px 60px rgba(6, 12, 28, 0.38);
    --grain-opacity: 0.055;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.12) 4%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 66%, rgba(var(--voyage-blue-rgb), 0.26) 34%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 56%, rgba(var(--voyage-blue-rgb), 0.3) 44%);
    border-radius: var(--radius-2xl);
    padding: clamp(1.6rem, 3vw, 2.1rem);
  }

  .footer-brand {
    display: grid;
    gap: 0.75rem;
  }

  .footer-brand img {
    max-width: clamp(160px, 18vw, 200px);
    transition: opacity var(--duration-fast) var(--ease-out);
    filter: drop-shadow(0 18px 28px rgba(6, 12, 28, 0.45));
  }

  .footer-brand img:hover {
    opacity: 0.92;
  }

  .tagline {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .status {
    font-size: var(--text-small);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  .contact-info {
    display: grid;
    gap: 0.35rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .contact-info a { color: var(--text-primary); }

  .footer-links-section {
    display: grid;
    gap: clamp(1rem, 3vw, 1.5rem);
    align-content: start;
  }

  .footer-links-section h4 {
    font-size: var(--text-title);
    margin: 0;
    color: color-mix(in srgb, rgba(255, 255, 255, 0.9) 82%, rgba(192, 204, 236, 0.78) 18%);
  }

  .footer-links-section ul {
    display: grid;
    gap: 0.6rem;
    font-size: var(--text-small);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links-section a {
    position: relative;
    color: color-mix(in srgb, rgba(212, 220, 248, 0.85) 80%, rgba(255, 255, 255, 0.78) 20%);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out), text-decoration-color var(--duration-fast) var(--ease-out);
  }

  .footer-links-section a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.15rem;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .footer-links-section a:hover,
  .footer-links-section a:focus-visible {
    color: color-mix(in srgb, rgba(255, 255, 255, 0.95) 85%, rgba(var(--signal-yellow-rgb), 0.4) 15%);
    text-decoration: underline;
    text-decoration-color: currentColor;
  }

  .footer-links-section a:hover::after,
  .footer-links-section a:focus-visible::after {
    transform: scaleX(1);
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1.2rem, 3vw, 2rem);
    padding: clamp(1.6rem, 3vw, 2.2rem);
    --surface-glass-blur: 28px;
    --surface-glass-bg: color-mix(in srgb, rgba(18, 24, 40, 0.86) 72%, rgba(var(--aurora-purple-rgb), 0.28) 28%);
    --surface-glass-border: color-mix(in srgb, rgba(118, 132, 190, 0.5) 60%, rgba(255, 255, 255, 0.22) 40%);
    --surface-glass-shadow: 0 34px 64px rgba(8, 12, 28, 0.4);
    --grain-opacity: 0.06;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 94%, rgba(var(--aurora-purple-rgb), 0.14) 6%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 62%, rgba(var(--aurora-purple-rgb), 0.28) 38%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 54%, rgba(var(--aurora-purple-rgb), 0.28) 46%);
    border-radius: var(--radius-2xl);
    font-size: var(--text-small);
    color: var(--text-tertiary);
    position: relative;
    z-index: 1;
  }

  :global([data-base-theme='dark']) .footer-grid > * {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-2) 72%, rgba(var(--voyage-blue-rgb), 0.3) 28%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 60%, rgba(255, 255, 255, 0.18) 40%);
    --surface-glass-shadow: 0 30px 58px rgba(var(--voyage-blue-rgb), 0.3);
    --grain-opacity: 0.06;
  }

  :global([data-base-theme='dark']) .footer-bottom {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-2) 70%, rgba(var(--aurora-purple-rgb), 0.34) 30%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.52) 58%, rgba(255, 255, 255, 0.2) 42%);
    --surface-glass-shadow: 0 34px 64px rgba(var(--aurora-purple-rgb), 0.3);
    --grain-opacity: 0.065;
  }

  .social-links {
    display: flex;
    gap: clamp(1rem, 3vw, 1.5rem);
  }

  .social-links a {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    position: relative;
    color: color-mix(in srgb, rgba(212, 220, 248, 0.85) 82%, rgba(255, 255, 255, 0.8) 18%);
    text-decoration: none;
    font-weight: var(--weight-medium);
  }

  .social-links a::after {
    content: '';
    position: absolute;
    inset: auto 0 -0.1rem;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .social-links a:hover,
  .social-links a:focus-visible {
    color: color-mix(in srgb, rgba(255, 255, 255, 0.95) 85%, rgba(var(--signal-yellow-rgb), 0.45) 15%);
    text-decoration: underline;
  }

  .social-links a:hover::after,
  .social-links a:focus-visible::after {
    transform: scaleX(1);
  }

  @media (max-width: 900px) {
    .footer-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .footer-grid { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; text-align: center; }
  }
</style>
