// @ts-nocheck
/**
 * Background Animation Themes
 * Page-specific floating shapes configuration aligned with the neutral surface system.
 */

const neutralGradient = (primary, accent) =>
  `radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--bg) 96%, rgba(${primary}, 0.14) 4%) 0%, color-mix(in srgb, var(--bg-elev-1, var(--bg)) 98%, rgba(${accent}, 0.1) 2%) 46%, var(--bg) 100%)`;

export const backgroundThemes = {
  home: {
    name: 'home',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--aurora-purple-rgb)'),
    grainOpacity: 0.05,
    shapes: [
      { type: 'node', count: 10, color: 'voyage-blue', size: 'medium' },
      { type: 'sparkle', count: 8, color: 'signal-yellow', size: 'small' },
      { type: 'connection', count: 6, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'medium',
    interactivity: 'medium'
  },

  platforms: {
    name: 'platforms',
    palette: ['voyage-blue', 'signal-yellow', 'aurora-purple'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--signal-yellow-rgb)'),
    grainOpacity: 0.045,
    shapes: [
      { type: 'connection', count: 8, color: 'voyage-blue', size: 'small' },
      { type: 'sparkle', count: 6, color: 'signal-yellow', size: 'small' },
      { type: 'node', count: 4, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  community: {
    name: 'community',
    palette: ['voyage-blue', 'signal-yellow', 'aurora-purple'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--signal-yellow-rgb)'),
    grainOpacity: 0.05,
    shapes: [
      { type: 'speech-bubble', count: 10, color: 'voyage-blue', size: 'small' },
      { type: 'heart', count: 6, color: 'signal-yellow', size: 'small' },
      { type: 'star', count: 6, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  consulting: {
    name: 'consulting',
    palette: ['aurora-purple', 'voyage-blue', 'signal-yellow'],
    gradient: neutralGradient('var(--aurora-purple-rgb)', 'var(--voyage-blue-rgb)'),
    grainOpacity: 0.048,
    shapes: [
      { type: 'briefcase', count: 6, color: 'voyage-blue', size: 'small' },
      { type: 'lightbulb', count: 6, color: 'signal-yellow', size: 'small' },
      { type: 'document', count: 4, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  },

  contact: {
    name: 'contact',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient: neutralGradient('var(--voyage-blue-rgb)', 'var(--aurora-purple-rgb)'),
    grainOpacity: 0.05,
    shapes: [
      { type: 'email', count: 8, color: 'voyage-blue', size: 'small' },
      { type: 'phone', count: 5, color: 'aurora-purple', size: 'small' },
      { type: 'calendar', count: 5, color: 'signal-yellow', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'low',
    interactivity: 'medium'
  }
};

export function getThemeForPath(pathname) {
  if (pathname === '/') return backgroundThemes.home;
  if (pathname.includes('platforms')) return backgroundThemes.platforms;
  if (pathname.includes('community')) return backgroundThemes.community;
  if (pathname.includes('consulting')) return backgroundThemes.consulting;
  if (pathname.includes('contact')) return backgroundThemes.contact;
  return backgroundThemes.home;
}
