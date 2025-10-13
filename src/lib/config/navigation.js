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
    label: 'nav.services',
    href: '/services',
    icon: 'services'
  },
  {
    label: 'nav.educational_outreach',
    href: '/educational-outreach',
    icon: 'education'
  },
  {
    label: 'nav.resources',
    href: '/resources',
    icon: 'resources',
    children: [
      {
        label: 'nav.resources_blog',
        href: '/resources#blog',
        description: 'nav.resources_blog_desc'
      },
      {
        label: 'nav.resources_cases',
        href: '/resources#case-studies',
        description: 'nav.resources_cases_desc'
      },
      {
        label: 'nav.resources_events',
        href: '/resources#events',
        description: 'nav.resources_events_desc'
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
    { label: 'footer.services', href: '/services' },
    { label: 'footer.educational_outreach', href: '/educational-outreach' },
    { label: 'footer.contact', href: '/contact' }
  ],
  resources: [
    { label: 'footer.blog', href: '/resources#blog' },
    { label: 'footer.case_studies', href: '/resources#case-studies' },
    { label: 'footer.documentation', href: '/resources#documentation' },
    { label: 'footer.events', href: '/resources#events' }
  ],
  support: [
    { label: 'footer.nodevoyage', href: '/services#nodevoyage' },
    { label: 'footer.ideonautix', href: '/services#ideonautix' },
    { label: 'footer.consulting', href: '/services#consulting' },
    { label: 'footer.newsletter', href: '/resources#newsletter' }
  ],
  social: [
    { label: 'footer.social.linkedin', href: 'https://linkedin.com/company/algorhythmics', icon: 'linkedin' },
    { label: 'footer.social.twitter', href: 'https://twitter.com/algorhythmics', icon: 'twitter' },
    { label: 'footer.social.facebook', href: 'https://facebook.com/algorhythmics', icon: 'facebook' },
    { label: 'footer.social.email', href: 'mailto:AlgoRhythmics.dev@gmail.com', icon: 'email' }
  ]
};
