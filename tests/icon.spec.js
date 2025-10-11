import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte/svelte5';
import Icon from '../src/lib/components/icons/Icon.svelte';

describe('Icon component', () => {
  it('renders the requested glyph with custom dimensions', () => {
    const { container } = render(Icon, { name: 'ai', size: 32, className: 'test-icon' });
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
    expect(svg?.classList.contains('test-icon')).toBe(true);
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('falls back to the generic glyph when icon is unknown', () => {
    const { container } = render(Icon, { name: 'unknown-symbol' });
    const fallbackCircle = container.querySelector('svg circle');
    expect(fallbackCircle).not.toBeNull();
  });
});
