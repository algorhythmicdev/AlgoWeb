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
      
      <div class="footer-links-section os-window">
        <h4>{$_('footer.company')}</h4>
        <ul>
          {#each footerLinks.company as link}
            <li><a href={link.href}>{$_(link.label)}</a></li>
          {/each}
        </ul>
      </div>
      
      <div class="footer-links-section os-window">
        <h4>{$_('footer.products_title')}</h4>
        <ul>
          {#each footerLinks.products as link}
            <li><a href={link.href}>{$_(link.label)}</a></li>
          {/each}
        </ul>
      </div>
      
      <div class="footer-links-section os-window">
        <h4>{$_('footer.resources')}</h4>
        <ul>
          {#each footerLinks.resources as link}
            <li><a href={link.href}>{$_(link.label)}</a></li>
          {/each}
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom os-window">
      <p class="copyright">{$_('footer.copyright')}</p>
      <div class="social-links">
        {#each footerLinks.social as social}
          <a href={social.href} target="_blank" rel="noopener noreferrer">
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
  }

  .footer::before {
    content: '';
    position: absolute;
    inset: auto -15% -40%;
    height: clamp(16rem, 30vw, 22rem);
    background: radial-gradient(circle at 60% 20%, rgba(var(--aurora-purple-rgb), 0.16), transparent 70%);
    filter: blur(120px);
    opacity: 0.6;
    pointer-events: none;
  }

  :global([data-base-theme='dark']) .footer::before {
    background: radial-gradient(circle at 60% 20%, rgba(var(--aurora-purple-rgb), 0.32), transparent 70%);
    opacity: 0.8;
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
    --surface-glass-shadow: 0 26px 52px rgba(var(--voyage-blue-rgb), 0.22);
    --grain-opacity: 0.045;
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
    max-width: 180px;
    transition: opacity var(--duration-fast) var(--ease-out);
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

  .footer-links-section h4 {
    font-size: var(--text-title);
    margin-bottom: 0.75rem;
  }

  .footer-links-section ul {
    display: grid;
    gap: 0.45rem;
    font-size: var(--text-small);
  }

  .footer-links-section a { color: var(--text-secondary); }

  .footer-links-section a:hover { color: var(--voyage-blue); }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1.2rem, 3vw, 2rem);
    padding: clamp(1.6rem, 3vw, 2.2rem);
    --surface-glass-blur: 28px;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 82%, rgba(var(--aurora-purple-rgb), 0.2) 18%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.34) 60%, rgba(255, 255, 255, 0.34) 40%);
    --surface-glass-shadow: 0 30px 56px rgba(var(--aurora-purple-rgb), 0.22);
    --grain-opacity: 0.05;
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

  .copyright { color: var(--text-secondary); }

  .social-links {
    display: flex;
    gap: var(--space-3);
  }

  .social-links a { color: var(--text-secondary); }

  .social-links a:hover { color: var(--voyage-blue); }

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
