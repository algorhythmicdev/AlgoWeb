import { expect, test } from 'vitest';
import fs from 'node:fs';

test('contrast pairs file exists and has threshold', () => {
  const raw = fs.readFileSync('design/contrast-pairs.json', 'utf-8');
  const cfg = JSON.parse(raw);
  expect(typeof cfg.threshold).toBe('number');
  expect(Array.isArray(cfg.pairs)).toBe(true);
});
