// @ts-nocheck
/**
 * Background Animation Themes
 * Page-specific floating shapes configuration
 */

export const backgroundThemes = {
  home: {
    name: 'home',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient:
      'radial-gradient(120% 120% at 50% 0%, rgba(255, 244, 217, 0.42) 0%, rgba(19, 81, 255, 0.28) 36%, rgba(106, 56, 255, 0.18) 68%, rgba(255, 210, 89, 0.12) 100%)',
    grainOpacity: 0.08,
    shapes: [
      { type: 'node', count: 20, color: 'voyage-blue', size: 'medium' },
      { type: 'brain', count: 8, color: 'aurora-purple', size: 'large' },
      { type: 'connection', count: 15, color: 'voyage-blue', size: 'small' },
      { type: 'sparkle', count: 12, color: 'signal-yellow', size: 'small' }
    ],
    animation: 'gentle-float',
    density: 'medium',
    interactivity: 'high'
  },
  
  nodevoyage: {
    name: 'nodevoyage',
    palette: ['voyage-blue', 'signal-yellow', 'aurora-purple'],
    gradient:
      'linear-gradient(140deg, rgba(12, 35, 82, 0.92) 0%, rgba(18, 80, 196, 0.78) 45%, rgba(18, 140, 210, 0.54) 68%, rgba(250, 221, 120, 0.32) 100%)',
    grainOpacity: 0.07,
    shapes: [
      { type: 'map-node', count: 25, color: 'voyage-blue', size: 'medium' },
      { type: 'location-pin', count: 15, color: 'signal-yellow', size: 'small' },
      { type: 'compass', count: 5, color: 'voyage-blue', size: 'large' },
      { type: 'plane', count: 3, color: 'aurora-purple', size: 'medium' },
      { type: 'route-line', count: 10, color: 'aurora-purple', size: 'small' }
    ],
    animation: 'travel-flow',
    density: 'high',
    interactivity: 'very-high'
  },
  
  ideonautix: {
    name: 'ideonautix',
    palette: ['aurora-purple', 'voyage-blue', 'signal-yellow'],
    gradient:
      'linear-gradient(135deg, rgba(36, 20, 64, 0.94) 0%, rgba(72, 44, 118, 0.82) 40%, rgba(120, 92, 182, 0.6) 68%, rgba(209, 196, 246, 0.35) 100%)',
    grainOpacity: 0.075,
    shapes: [
      { type: 'chart-bar', count: 15, color: 'aurora-purple', size: 'medium' },
      { type: 'lightning', count: 10, color: 'signal-yellow', size: 'small' },
      { type: 'gear', count: 8, color: 'aurora-purple', size: 'medium' },
      { type: 'checkmark', count: 20, color: 'signal-yellow', size: 'small' },
      { type: 'graph-line', count: 12, color: 'voyage-blue', size: 'medium' }
    ],
    animation: 'productive-pulse',
    density: 'medium',
    interactivity: 'medium'
  },
  
  community: {
    name: 'community',
    palette: ['voyage-blue', 'signal-yellow', 'aurora-purple'],
    gradient:
      'linear-gradient(140deg, rgba(16, 44, 96, 0.9) 0%, rgba(47, 76, 164, 0.72) 55%, rgba(255, 201, 92, 0.28) 100%)',
    grainOpacity: 0.07,
    shapes: [
      { type: 'speech-bubble', count: 18, color: 'voyage-blue', size: 'medium' },
      { type: 'heart', count: 12, color: 'signal-yellow', size: 'small' },
      { type: 'star', count: 15, color: 'aurora-purple', size: 'small' },
      { type: 'thumbs-up', count: 8, color: 'signal-yellow', size: 'small' }
    ],
    animation: 'social-bounce',
    density: 'high',
    interactivity: 'high'
  },
  
  consulting: {
    name: 'consulting',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient:
      'linear-gradient(140deg, rgba(12, 36, 78, 0.92) 0%, rgba(75, 49, 135, 0.74) 52%, rgba(255, 209, 110, 0.28) 100%)',
    grainOpacity: 0.065,
    shapes: [
      { type: 'briefcase', count: 12, color: 'voyage-blue', size: 'medium' },
      { type: 'lightbulb', count: 15, color: 'signal-yellow', size: 'medium' },
      { type: 'handshake', count: 8, color: 'aurora-purple', size: 'large' },
      { type: 'document', count: 10, color: 'voyage-blue', size: 'small' }
    ],
    animation: 'professional-drift',
    density: 'low',
    interactivity: 'medium'
  },
  
  contact: {
    name: 'contact',
    palette: ['voyage-blue', 'aurora-purple', 'signal-yellow'],
    gradient:
      'linear-gradient(140deg, rgba(10, 32, 70, 0.9) 0%, rgba(60, 48, 120, 0.72) 55%, rgba(255, 209, 120, 0.28) 100%)',
    grainOpacity: 0.07,
    shapes: [
      { type: 'email', count: 15, color: 'voyage-blue', size: 'medium' },
      { type: 'phone', count: 10, color: 'aurora-purple', size: 'small' },
      { type: 'calendar', count: 12, color: 'voyage-blue', size: 'medium' },
      { type: 'location', count: 8, color: 'signal-yellow', size: 'small' }
    ],
    animation: 'communication-flow',
    density: 'medium',
    interactivity: 'medium'
  }
};

export function getThemeForPath(pathname) {
  if (pathname === '/') return backgroundThemes.home;
  if (pathname.includes('platforms')) return backgroundThemes.nodevoyage;
  if (pathname.includes('nodevoyage')) return backgroundThemes.nodevoyage;
  if (pathname.includes('ideonautix')) return backgroundThemes.ideonautix;
  if (pathname.includes('community')) return backgroundThemes.community;
  if (pathname.includes('consulting')) return backgroundThemes.consulting;
  if (pathname.includes('contact')) return backgroundThemes.contact;
  return backgroundThemes.home;
}
