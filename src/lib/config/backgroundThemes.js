// @ts-nocheck
/**
 * Background Animation Themes
 * Page-specific floating shapes configuration aligned with the neutral surface system.
 */

const neutralGradient = (primary, accent) =>
  `radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--bg) 99.9%, rgba(${primary}, 0.01) 0.1%) 0%, color-mix(in srgb, var(--bg-elev-1) 99.9%, rgba(${accent}, 0.01) 0.1%) 44%, var(--bg) 100%)`;

export const backgroundThemes = {
  home: {
    name: 'home',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--aurora-purple-rgb)'),
    grainOpacity: 0,
    layers: {
      gradient: { filter: 'saturate(0.12) brightness(0.998)' },
      wash: { min: 0.0012, base: 0.002, span: 0.005, max: 0.0032 },
      flare: { min: 0.0008, base: 0.0016, span: 0.004, max: 0.0028 },
      veil: { color: 'rgba(16, 22, 33, 0.006)', max: 0.008 },
      film: { max: 0.0028 }
    },
    shapes: [
      { type: 'node', count: 3, color: 'voyage-blue', size: 'medium' },
      { type: 'sparkle', count: 2, color: 'signal-yellow', size: 'small' },
      { type: 'connection', count: 2, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'medium',
    interactivity: 'medium'
  },

  products: {
    name: 'products',
    palette: ['voyage-blue', 'signal-yellow', 'aurora-purple'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--signal-yellow-rgb)'),
    grainOpacity: 0,
    layers: {
      wash: { min: 0.0011, base: 0.0019, span: 0.0045, max: 0.003 },
      flare: { min: 0.0008, base: 0.0015, span: 0.004, max: 0.0026 },
      film: { max: 0.0026 }
    },
    shapes: [
      { type: 'connection', count: 2, color: 'voyage-blue', size: 'small' },
      { type: 'sparkle', count: 2, color: 'signal-yellow', size: 'small' },
      { type: 'node', count: 2, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  education: {
    name: 'education',
    palette: ['aurora-purple', 'signal-yellow', 'voyage-blue'],
    gradient: neutralGradient('var(--aurora-purple-rgb)', 'var(--signal-yellow-rgb)'),
    grainOpacity: 0,
    layers: {
      gradient: { filter: 'saturate(0.14) brightness(0.996)' },
      wash: { min: 0.0013, base: 0.0022, span: 0.005, max: 0.0034 },
      flare: { min: 0.0009, base: 0.0017, span: 0.004, max: 0.0028 },
      veil: { color: 'rgba(14, 22, 36, 0.007)', span: 0.01, max: 0.008 }
    },
    shapes: [
      { type: 'book', count: 3, color: 'aurora-purple', size: 'small' },
      { type: 'sparkle', count: 2, color: 'signal-yellow', size: 'small' },
      { type: 'node', count: 2, color: 'voyage-blue', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'medium',
    interactivity: 'medium'
  },

  about: {
    name: 'about',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--aurora-purple-rgb)'),
    grainOpacity: 0,
    layers: {
      gradient: { filter: 'saturate(0.12) brightness(0.996)' },
      wash: { min: 0.0012, base: 0.002, span: 0.005, max: 0.0031 },
      flare: { min: 0.0008, base: 0.0016, span: 0.004, max: 0.0028 },
      film: { max: 0.0028 }
    },
    shapes: [
      { type: 'timeline', count: 2, color: 'voyage-blue', size: 'small' },
      { type: 'sparkle', count: 2, color: 'signal-yellow', size: 'small' },
      { type: 'orbit', count: 1, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  resources: {
    name: 'resources',
    palette: ['voyage-blue', 'signal-yellow', 'aurora-purple'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--signal-yellow-rgb)'),
    grainOpacity: 0,
    layers: {
      wash: { min: 0.0012, base: 0.0021, span: 0.005, max: 0.0032 },
      flare: { min: 0.0009, base: 0.0017, span: 0.0042, max: 0.0029 },
      veil: { color: 'rgba(18, 24, 36, 0.007)', max: 0.008 }
    },
    shapes: [
      { type: 'speech-bubble', count: 3, color: 'voyage-blue', size: 'small' },
      { type: 'heart', count: 2, color: 'signal-yellow', size: 'small' },
      { type: 'star', count: 2, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  consulting: {
    name: 'consulting',
    palette: ['aurora-purple', 'voyage-blue', 'signal-yellow'],
    gradient: neutralGradient('var(--aurora-purple-rgb)', 'var(--voyage-blue-rgb)'),
    grainOpacity: 0,
    layers: {
      gradient: { filter: 'saturate(0.14) brightness(0.992)' },
      wash: { min: 0.0013, base: 0.0022, span: 0.0052, max: 0.0034 },
      flare: { min: 0.0009, base: 0.0018, span: 0.0042, max: 0.003 },
      veil: { color: 'rgba(18, 24, 36, 0.008)', max: 0.01 }
    },
    shapes: [
      { type: 'briefcase', count: 2, color: 'voyage-blue', size: 'small' },
      { type: 'lightbulb', count: 2, color: 'signal-yellow', size: 'small' },
      { type: 'document', count: 2, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  contact: {
    name: 'contact',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--aurora-purple-rgb)'),
    grainOpacity: 0,
    layers: {
      wash: { min: 0.0013, base: 0.0021, span: 0.005, max: 0.0032 },
      flare: { min: 0.0009, base: 0.0018, span: 0.0042, max: 0.003 },
      veil: { color: 'rgba(15, 23, 35, 0.008)', max: 0.01 }
    },
    shapes: [
      { type: 'email', count: 3, color: 'voyage-blue', size: 'small' },
      { type: 'phone', count: 2, color: 'aurora-purple', size: 'small' },
      { type: 'calendar', count: 2, color: 'signal-yellow', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  }
};

export function getThemeForPath(pathname) {
  if (pathname === '/') return backgroundThemes.home;
  if (pathname.includes('products')) return backgroundThemes.products;
  if (pathname.includes('education')) return backgroundThemes.education;
  if (pathname.includes('about')) return backgroundThemes.about;
  if (pathname.includes('resources')) return backgroundThemes.resources;
  if (pathname.includes('consulting')) return backgroundThemes.consulting;
  if (pathname.includes('contact')) return backgroundThemes.contact;
  return backgroundThemes.home;
}
