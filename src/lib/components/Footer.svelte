<script>
  import { _ } from 'svelte-i18n';
  import { footerLinks } from '$config/navigation';
  import { siteConfig } from '$config/seo';
</script>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/images/brand/logo-main.webp" alt="AlgoRhythmics" width="180" height="48" />
        <p class="tagline">{$_('footer.tagline')}</p>
        <p class="status">{$_('footer.status')}</p>
        <div class="contact-info">
          <p>{$_('footer.location')}</p>
          <a href="mailto:{siteConfig.contact.email}">{siteConfig.contact.email}</a>
        </div>
      </div>
      
      <div class="footer-links-section">
        <h4>{$_('footer.company')}</h4>
        <ul>
          {#each footerLinks.company as link}
            <li><a href={link.href}>{$_(link.label)}</a></li>
          {/each}
        </ul>
      </div>
      
      <div class="footer-links-section">
        <h4>{$_('footer.products_title')}</h4>
        <ul>
          {#each footerLinks.products as link}
            <li><a href={link.href}>{$_(link.label)}</a></li>
          {/each}
        </ul>
      </div>
      
      <div class="footer-links-section">
        <h4>{$_('footer.resources')}</h4>
        <ul>
          {#each footerLinks.resources as link}
            <li><a href={link.href}>{$_(link.label)}</a></li>
          {/each}
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p class="copyright">{$_('footer.copyright')}</p>
      <div class="social-links">
        {#each footerLinks.social as social}
          <a href={social.href} target="_blank" rel="noopener noreferrer">
            {social.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--bg-surface);
    border-top: 1px solid var(--border-color);
    padding: var(--space-12) 0 var(--space-6);
    margin-top: var(--space-24);
  }
  
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: var(--space-8);
    margin-bottom: var(--space-8);
  }
  
  .footer-brand {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .footer-brand img {
    max-width: 180px;
  }
  
  .tagline {
    color: var(--text-secondary);
    font-style: italic;
    font-size: var(--text-small);
  }
  
  .status {
    font-size: var(--text-small);
    color: var(--voyage-blue);
    font-weight: var(--weight-medium);
  }
  
  .contact-info {
    margin-top: var(--space-3);
    color: var(--text-secondary);
    font-size: var(--text-small);
  }
  
  .contact-info a {
    color: var(--voyage-blue);
    display: block;
    margin-top: var(--space-1);
  }
  
  .footer-links-section h4 {
    font-size: var(--text-title);
    margin-bottom: var(--space-3);
    color: var(--text-primary);
  }
  
  .footer-links-section ul {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    list-style: none;
  }
  
  .footer-links-section a {
    color: var(--text-secondary);
    transition: color var(--duration-fast) var(--ease-out);
    font-size: var(--text-small);
  }
  
  .footer-links-section a:hover {
    color: var(--voyage-blue);
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-color);
  }
  
  .copyright {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }
  
  .social-links {
    display: flex;
    gap: var(--space-4);
  }
  
  .social-links a {
    color: var(--text-secondary);
    font-size: var(--text-small);
    transition: color var(--duration-fast) var(--ease-out);
  }
  
  .social-links a:hover {
    color: var(--voyage-blue);
  }
  
  @media (max-width: 768px) {
    .footer-grid {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
    
    .footer-bottom {
      flex-direction: column;
      gap: var(--space-3);
      text-align: center;
    }
  }
</style>
