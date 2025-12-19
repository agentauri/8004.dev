import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Agent Explorer/);
  });

  test('displays header with logo', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AGENT EXPLORER' })).toBeVisible();
  });

  test('displays footer', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('has explore link in navigation', async ({ page }) => {
    const exploreLink = page.getByRole('link', { name: /explore/i });
    await expect(exploreLink).toBeVisible();
  });

  test('navigates to explore page when clicking explore link', async ({ page }) => {
    await page.getByRole('link', { name: /explore/i }).click();
    await expect(page).toHaveURL(/.*explore/);
  });
});
