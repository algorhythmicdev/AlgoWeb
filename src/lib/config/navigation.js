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
    icon: 'products'
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
    { label: 'footer.nodevoyage', href: 'https://nodevoyage.algorhythmics.dev', external: true },
    { label: 'footer.ideonautix', href: 'https://ideonautix.algorhythmics.dev', external: true },
    { label: 'footer.roadmap', href: '/#timeline' }
  ],
  resources: [
    { label: 'footer.community', href: '/community' },
    { label: 'footer.consulting', href: '/consulting' },
    { label: 'footer.contact', href: '/contact' }
  ],
  social: [
    { label: 'footer.social.linkedin', href: 'https://linkedin.com/company/algorhythmics', icon: 'linkedin' },
    { label: 'footer.social.github', href: 'https://github.com/algorhythmics', icon: 'github' },
    { label: 'footer.social.email', href: 'mailto:AlgoRhythmics.dev@gmail.com', icon: 'email' }
  ]
};
