import { test, expect } from '@playwright/test';

const baseURL = (process.env.PREVIEW_URL ?? 'http://localhost:5173').replace(/\/$/, '');

test('ideonautix basic', async ({ page }) => {
  await page.goto(`${baseURL}/ideonautix`);
  await expect(page.locator('h1')).toContainText('Ideonautix');
});
