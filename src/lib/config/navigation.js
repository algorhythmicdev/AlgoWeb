/**
 * Navigation Configuration
 */

export const mainNavigation = [
  {
    label: 'nav.home',
    href: '/',
    icon: 'home'
  },
  {
    label: 'nav.products',
    href: '/products',
    icon: 'products',
    children: [
      {
        label: 'nav.nodevoyage',
        href: '/products/nodevoyage',
        description: 'nav.nodevoyage_desc'
      },
      {
        label: 'nav.ideonautix',
        href: '/products/ideonautix',
        description: 'nav.ideonautix_desc'
      }
    ]
  },
  {
    label: 'nav.community',
    href: '/community',
    icon: 'community'
  },
  {
    label: 'nav.consulting',
    href: '/consulting',
    icon: 'consulting',
    badge: 'nav.pilot_badge'
  },
  {
    label: 'nav.contact',
    href: '/contact',
    icon: 'contact'
  }
];

export const footerLinks = {
  company: [
    { label: 'footer.about', href: '/#story' },
    { label: 'footer.founders', href: '/#founders' },
    { label: 'footer.vision', href: '/#vision' }
  ],
  products: [
    { label: 'footer.nodevoyage', href: '/products/nodevoyage' },
    { label: 'footer.ideonautix', href: '/products/ideonautix' },
    { label: 'footer.roadmap', href: '/#timeline' }
  ],
  resources: [
    { label: 'footer.community', href: '/community' },
    { label: 'footer.consulting', href: '/consulting' },
    { label: 'footer.contact', href: '/contact' }
  ],
  social: [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/algorhythmics', icon: 'linkedin' },
    { label: 'GitHub', href: 'https://github.com/algorhythmics', icon: 'github' },
    { label: 'Email', href: 'mailto:AlgoRhythmics.dev@gmail.com', icon: 'email' }
  ]
};
