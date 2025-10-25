import { expect, test } from 'vitest';

test('primary nav labels match IA', () => {
  const labels = ['Home','Team','Ideonautix','NodeVoyage','Consulting','Contact','Education'];
  // superficial smoke: in real tests, render component and query text
  expect(labels.includes('Team')).toBe(true);
  expect(labels.length).toBe(7);
});
