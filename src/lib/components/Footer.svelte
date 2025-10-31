<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { page } from '$app/stores';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { partners } from '$lib/presentAssets';

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: '/ideonautix', label: 'Ideonautix' },
    { href: '/nodevoyage', label: 'NodeVoyage' },
    { href: '/consulting', label: 'Consulting' },
    { href: '/contact', label: 'Contact' },
    { href: '/education', label: 'Education' }
  ];
  const legal = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/cookies', label: 'Cookies' }
  ];

  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  const resolve = (href: string) =>
    isExternal(href) ? href : href === '/' ? appBase || '/' : `${appBase}${href}`;
  const stripBase = (path: string) =>
    appBase && path.startsWith(appBase) ? path.slice(appBase.length) || '/' : path || '/';
  const normalize = (href: string) => (isExternal(href) ? null : href.replace(/\/+$/, '') || '/');
  const partnerAlt = (path: string) => (path.split('/').pop() || 'Partner').replace(/\.[^.]+$/, '');

  $: current = stripBase($page.url.pathname).replace(/\/+$/, '') || '/';
  const isCurrent = (href: string) => {
    const normalized = normalize(href);
    return normalized ? normalized === current : false;
  };

</script>

<footer class="section surface-1 control footer" aria-label="Site footer">
  <div class="container">
    <div class="footer-content">
      <nav aria-label="Footer navigation" class="footer-nav">
        <ul role="list" class="nav">
          {#each nav as i}
            <li>
              <a href={resolve(i.href)} aria-current={isCurrent(i.href) ? 'page' : undefined}>{i.label}</a>
            </li>
          {/each}
        </ul>
      </nav>

      <div class="divider"></div>

      <div class="partners-section">
        <p class="partners-label">Our Partners</p>
        <div class="partners-logos">
          {#if partners.length === 0}
            <div class="partner-badge">LIAA</div>
            <div class="partner-badge">Reclame Fabriek</div>
          {:else}
            {#each partners as p}
              <AssetImage src={p} alt={partnerAlt(p)} width={160} height={40} radius={6} />
            {/each}
          {/if}
        </div>
      </div>

      <div class="divider"></div>

      <div class="footer-bottom">
        <ul role="list" class="legal-nav">
          {#each legal as i}
            <li>
              <a href={resolve(i.href)} aria-current={isCurrent(i.href) ? 'page' : undefined}>{i.label}</a>
            </li>
          {/each}
        </ul>
        <p class="copyright">© {new Date().getFullYear()} Algorhythmics. All rights reserved.</p>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    padding: 3rem 0 2rem;
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-nav {
    width: 100%;
    margin-bottom: 1.5rem;
  }
  
  .nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 2rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav a {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  
  .nav a:hover {
    color: var(--text-strong);
  }
  
  .nav a[aria-current="page"] {
    color: var(--primary);
    font-weight: 600;
  }
  
  .divider {
    width: 100%;
    max-width: 600px;
    height: 1px;
    background: var(--border);
    margin: 1.5rem 0;
  }
  
  .partners-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .partners-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin: 0;
  }
  
  .partners-logos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    align-items: center;
  }
  
  .partner-badge {
    padding: 0.75rem 1.5rem;
    background: var(--bg-elev-1);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-weight: 600;
    color: var(--text-strong);
    font-size: 0.95rem;
  }
  
  .footer-bottom {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .legal-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .legal-nav a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  
  .legal-nav a:hover {
    color: var(--text-secondary);
  }
  
  .copyright {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0.5rem 0 0;
  }
  
  @media (max-width: 768px) {
    .footer {
      padding: 2rem 0 1.5rem;
    }
    
    .nav {
      gap: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    
    .partners-logos {
      gap: 1rem;
    }
    
    .partner-badge {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  }
</style>
