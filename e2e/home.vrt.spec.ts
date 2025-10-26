import { test, expect } from '@playwright/test';
import { createHash } from 'crypto';

// Keep the baseline as a hash so we avoid committing binary snapshot assets.

const baseURL = (process.env.PREVIEW_URL ?? 'http://localhost:5173').replace(/\/$/, '');

test('home renders key sections', async ({ page }) => {
  await page.goto(`${baseURL}/`);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('link', { name: /Ideonautix/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /NodeVoyage/i }).first()).toBeVisible();
  await expect(page.getByRole('contentinfo', { name: /Site footer/i })).toBeVisible();
});

const HOME_SNAPSHOT_HASH = '502464c44ebbc7a1f25bb5f83768b5a5c57d68a159d45abab4133a35855b1c8c';

test('home visual snapshot', async ({ page }) => {
  await page.goto(`${baseURL}/`);
  const buffer = await page.screenshot({ fullPage: true });
  const hash = createHash('sha256').update(buffer).digest('hex');
  expect(hash).toBe(HOME_SNAPSHOT_HASH);
});
