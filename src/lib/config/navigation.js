/**
 * @typedef {Object} NavigationChild
 * @property {string} label
 * @property {string} href
 * @property {string} [description]
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} label
 * @property {string} href
 * @property {string} icon
 * @property {NavigationChild[]} [children]
 * @property {string} [panelLabel]
 */

/**
 * Navigation Configuration
 */

/** @type {NavigationItem[]} */
export const mainNavigation = [
  {
    label: 'nav.home',
    href: '/',
    icon: 'home'
  },
  {
    label: 'nav.about',
    href: '/about',
    icon: 'about'
  },
  {
    label: 'nav.solutions',
    href: '/solutions',
    icon: 'services',
    panelLabel: 'nav.solutions_panel_label',
    children: [
      {
        label: 'nav.solutions_nodevoyage',
        href: '/nodevoyage',
        description: 'nav.solutions_nodevoyage_desc'
      },
      {
        label: 'nav.solutions_ideonautix',
        href: '/ideonautix',
        description: 'nav.solutions_ideonautix_desc'
      },
      {
        label: 'nav.solutions_consulting',
        href: '/consulting',
        description: 'nav.solutions_consulting_desc'
      }
    ]
  },
  {
    label: 'nav.contact',
    href: '/contact',
    icon: 'contact'
  }
];

export const footerLinks = {
  company: [
    { label: 'footer.about', href: '/about' },
    { label: 'footer.contact', href: '/contact' },
    { label: 'footer.educational_outreach', href: '/educational-outreach' }
  ],
  resources: [
    { label: 'footer.education_hub', href: '/education-hub' },
    { label: 'footer.blog', href: '/education-hub#insights' },
    { label: 'footer.case_studies', href: '/education-hub#case-studies' },
    { label: 'footer.toolkits', href: '/education-hub#toolkits' },
    { label: 'footer.events', href: '/education-hub#events' }
  ],
  support: [
    { label: 'footer.nodevoyage', href: '/nodevoyage' },
    { label: 'footer.ideonautix', href: '/ideonautix' },
    { label: 'footer.consulting', href: '/consulting' },
    { label: 'footer.newsletter', href: '/contact#newsletter' }
  ],
  social: [
    { label: 'footer.social.linkedin', href: 'https://linkedin.com/company/algorhythmics', icon: 'linkedin' },
    { label: 'footer.social.twitter', href: 'https://twitter.com/algorhythmics', icon: 'twitter' },
    { label: 'footer.social.facebook', href: 'https://facebook.com/algorhythmics', icon: 'facebook' },
    { label: 'footer.social.email', href: 'mailto:AlgoRhythmics.dev@gmail.com', icon: 'email' }
  ]
};
