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
    label: 'nav.platforms',
    href: '/platforms',
    icon: 'products',
    children: [
      {
        label: 'nav.nodevoyage',
        href: '/platforms#nodevoyage',
        description: 'nav.nodevoyage_desc'
      },
      {
        label: 'nav.ideonautix',
        href: '/platforms#ideonautix',
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
    icon: 'consulting'
  },
  {
    label: 'nav.about',
    href: '/#story',
    icon: 'about'
  }
];

export const footerLinks = {
  company: [
    { label: 'footer.about', href: '/#story' },
    { label: 'footer.founders', href: '/#founders' },
    { label: 'footer.vision', href: '/#vision' }
  ],
  platforms: [
    { label: 'footer.nodevoyage', href: '/platforms#nodevoyage' },
    { label: 'footer.ideonautix', href: '/platforms#ideonautix' },
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
