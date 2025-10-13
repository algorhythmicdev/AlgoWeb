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
    label: 'nav.products',
    href: '/products',
    icon: 'products'
  },
  {
    label: 'nav.consulting',
    href: '/consulting',
    icon: 'consulting'
  },
  {
    label: 'nav.education',
    href: '/education',
    icon: 'education'
  },
  {
    label: 'nav.about',
    href: '/about',
    icon: 'about'
  },
  {
    label: 'nav.resources',
    href: '/resources',
    icon: 'resources'
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
    { label: 'footer.story', href: '/about#story' },
    { label: 'footer.team', href: '/about#team' }
  ],
  products: [
    { label: 'footer.products.nodevoyage', href: '/products#nodevoyage' },
    { label: 'footer.products.ideonautix', href: '/products#ideonautix' },
    { label: 'footer.consulting', href: '/consulting' }
  ],
  resources: [
    { label: 'footer.blog', href: '/resources#blog' },
    { label: 'footer.case_studies', href: '/resources#case-studies' },
    { label: 'footer.education', href: '/education' }
  ],
  social: [
    { label: 'footer.social.linkedin', href: 'https://linkedin.com/company/algorhythmics', icon: 'linkedin' },
    { label: 'footer.social.github', href: 'https://github.com/algorhythmics', icon: 'github' },
    { label: 'footer.social.email', href: 'mailto:AlgoRhythmics.dev@gmail.com', icon: 'email' }
  ]
};
