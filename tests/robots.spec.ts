import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

test('robots disallows crawling when PUBLIC_NOINDEX is true', async () => {
  vi.doMock('$app/paths', () => ({ base: '/AlgoWeb' }), { virtual: true });
  vi.doMock('$env/static/public', () => ({ PUBLIC_NOINDEX: 'true' }), { virtual: true });

  const { GET } = await import('../src/routes/robots.txt/+server.ts');

  const response = await GET({ url: new URL('https://example.com/AlgoWeb') } as Parameters<typeof GET>[0]);
  const body = await response.text();

  expect(body).toContain('Disallow: /');
  expect(body).toContain('Sitemap: https://example.com/AlgoWeb/sitemap.xml');
});
