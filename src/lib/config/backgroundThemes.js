/**
 * Background Animation Themes
 * Page-specific floating shapes configuration
 */

export const backgroundThemes = {
  home: {
    name: 'home',
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
  if (pathname.includes('nodevoyage')) return backgroundThemes.nodevoyage;
  if (pathname.includes('ideonautix')) return backgroundThemes.ideonautix;
  if (pathname.includes('community')) return backgroundThemes.community;
  if (pathname.includes('consulting')) return backgroundThemes.consulting;
  if (pathname.includes('contact')) return backgroundThemes.contact;
  return backgroundThemes.home;
}
