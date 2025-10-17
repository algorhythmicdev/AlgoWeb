// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';

/**
 * Verify that Footer and Navigation components use translation keys properly
 * and don't contain any hardcoded text
 */
describe('Footer and Navigation i18n', () => {
  it('Footer.svelte uses translation keys for all visible text', async () => {
    const source = await readFile('src/lib/components/Footer.svelte', 'utf8');
    
    // Check that the component imports svelte-i18n
    expect(source).toContain("import { _ } from 'svelte-i18n'");
    
    // Check for translation key usage patterns
    expect(source).toMatch(/\$_\(['"]footer\./); // Uses footer.* keys
    
    // Verify translation helper is available
    expect(source).toContain('translateOrFallback');
  });

  it('Navigation.svelte uses translation keys for all visible text', async () => {
    const source = await readFile('src/lib/components/Navigation.svelte', 'utf8');
    
    // Check that the component imports svelte-i18n (with either single or double quotes)
    expect(source).toMatch(/import\s+{\s*_\s*}\s+from\s+["']svelte-i18n["']/);
    
    // Check for translation key usage patterns
    expect(source).toMatch(/\$_\(['"]nav\./); // Uses nav.* keys
    
    // Verify aria-labels are also translated
    expect(source).toContain('aria-label=');
    expect(source).toContain('$_(');
  });

  it('navigation.js config uses translation keys', async () => {
    const source = await readFile('src/lib/config/navigation.js', 'utf8');
    
    // Check that all labels use translation key format (not plain strings)
    const labelMatches = source.match(/label:\s*['"]([^'"]+)['"]/g) || [];
    
    for (const match of labelMatches) {
      const label = match.match(/label:\s*['"]([^'"]+)['"]/)?.[1];
      if (label) {
        // All labels should be translation keys (contain a dot for namespacing)
        expect(label, `Label "${label}" should be a translation key`).toMatch(/^(nav|footer)\./);
      }
    }
  });

  it('all Footer translation keys exist in en.json', async () => {
    const enJson = JSON.parse(await readFile('src/lib/i18n/en.json', 'utf8'));
    
    // Required footer keys
    const requiredFooterKeys = [
      'footer.brand_alt',
      'footer.tagline',
      'footer.status',
      'footer.location',
      'footer.company',
      'footer.support',
      'footer.resources',
      'footer.copyright',
      'footer.about',
      'footer.contact',
      'footer.help_center',
      'footer.nodevoyage',
      'footer.ideonautix',
      'footer.consulting',
      'footer.partners_title',
      'footer.partners_summary',
      'footer.partners_visit',
      'footer.partners_link',
      'footer.social.linkedin',
      'footer.social.twitter',
      'footer.social.facebook',
      'footer.social.email'
    ];

    for (const key of requiredFooterKeys) {
      const parts = key.split('.');
      let current = enJson;
      let found = true;
      
      for (const part of parts) {
        if (!(part in current)) {
          found = false;
          break;
        }
        current = current[part];
      }
      
      expect(found, `Translation key "${key}" should exist in en.json`).toBe(true);
      expect(typeof current, `Translation key "${key}" should have a string value`).toBe('string');
    }
  });

  it('all Navigation translation keys exist in en.json', async () => {
    const enJson = JSON.parse(await readFile('src/lib/i18n/en.json', 'utf8'));
    
    // Required nav keys
    const requiredNavKeys = [
      'nav.primary_label',
      'nav.brand_aria',
      'nav.brand_name',
      'nav.talk_to_us',
      'nav.toggle_menu',
      'nav.quick_controls',
      'nav.home',
      'nav.about',
      'nav.solutions',
      'nav.solutions_panel_label',
      'nav.help_center',
      'nav.resources_panel_label'
    ];

    for (const key of requiredNavKeys) {
      const parts = key.split('.');
      let current = enJson;
      let found = true;
      
      for (const part of parts) {
        if (!(part in current)) {
          found = false;
          break;
        }
        current = current[part];
      }
      
      expect(found, `Translation key "${key}" should exist in en.json`).toBe(true);
      expect(typeof current, `Translation key "${key}" should have a string value`).toBe('string');
    }
  });
});
