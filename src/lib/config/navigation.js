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
    label: 'nav.consulting',
    href: '/consulting',
    icon: 'services'
  },
  {
    label: 'nav.nodevoyage',
    href: '/nodevoyage',
    icon: 'services'
  },
  {
    label: 'nav.ideonautix',
    href: '/ideonautix',
    icon: 'services'
  },
  {
    label: 'nav.contact',
    href: '/contact',
    icon: 'info'
  }
];

export const footerLinks = {
  company: [
    { label: 'footer.about', href: '/about' },
    { label: 'footer.contact', href: '/contact' }
  ],
  solutions: [
    { label: 'footer.consulting', href: '/consulting' },
    { label: 'footer.nodevoyage', href: '/nodevoyage' },
    { label: 'footer.ideonautix', href: '/ideonautix' }
  ],
  legal: [
    { label: 'footer.about', href: '/about' },
    { label: 'footer.contact', href: '/contact' }
  ],
  social: [
    { label: 'footer.social.linkedin', href: 'https://linkedin.com/company/algorhythmics', icon: 'linkedin' },
    { label: 'footer.social.twitter', href: 'https://twitter.com/algorhythmics', icon: 'twitter' },
    { label: 'footer.social.facebook', href: 'https://facebook.com/algorhythmics', icon: 'facebook' },
    { label: 'footer.social.email', href: 'mailto:AlgoRhythmics.dev@gmail.com', icon: 'email' }
  ]
};
