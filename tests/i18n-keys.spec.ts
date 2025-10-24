import { expect, test } from 'vitest';
import lv from '../src/lib/translations/lv.json';
import ru from '../src/lib/translations/ru.json';

const REQUIRED_KEYS = [
  'nav.home',
  'nav.team',
  'nav.ideonautix',
  'nav.nodevoyage',
  'nav.consulting',
  'nav.education',
  'nav.contact',
  'cta.primary',
  'cta.secondary',
  'common.loading',
  'common.close'
];

function flat(o: any, path = '', out: Record<string, 1> = {}) {
  Object.entries(o).forEach(([k, v]) => {
    const p = path ? `${path}.${k}` : k;
    if (v && typeof v === 'object') flat(v, p, out);
    else out[p] = 1;
  });
  return out;
}

test('lv/ru have at least nav/cta/common keys present in en', () => {
  const lvKeys = Object.keys(flat({ nav: lv['nav'], cta: lv['cta'], common: lv['common'] }));
  const ruKeys = Object.keys(flat({ nav: ru['nav'], cta: ru['cta'], common: ru['common'] }));
  REQUIRED_KEYS.forEach((key) => {
    expect(lvKeys).toContain(key);
    expect(ruKeys).toContain(key);
  });
});
