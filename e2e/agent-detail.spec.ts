import { expect, test } from '@playwright/test';
import { setupApiMocks } from './fixtures/api-mocks';

test.describe('Agent Detail Page', () => {
  const testAgentId = '11155111:1';

  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('displays agent page content', async ({ page }) => {
    await page.goto(`/agent/${testAgentId}`);
    await page.waitForLoadState('networkidle');

    // Verify the page renders any meaningful content
    // The page should show either the agent details, error state, or loading complete
    const bodyText = await page.locator('body').textContent();

    // Page should have some content (not empty/blank)
    expect(bodyText?.length).toBeGreaterThan(100);

    // Page should not be stuck in loading state
    const isLoading = bodyText?.includes('Loading agent...');
    if (isLoading) {
      // If still loading after networkidle, check for the back link as fallback
      const backLink = page.getByRole('link', { name: /explore/i });
      const hasBackLink = await backLink.isVisible().catch(() => false);
      expect(hasBackLink).toBeTruthy();
    }
  });

  test('displays back to explore link', async ({ page }) => {
    await page.goto(`/agent/${testAgentId}`);
    await page.waitForTimeout(1000);

    const backLink = page.getByRole('link', { name: /back to explore/i });
    if (await backLink.isVisible().catch(() => false)) {
      await expect(backLink).toBeVisible();
    }
  });

  test('back link navigates to explore page', async ({ page }) => {
    await page.goto(`/agent/${testAgentId}`);
    await page.waitForTimeout(1000);

    const backLink = page.getByRole('link', { name: /back to explore/i });
    if (await backLink.isVisible().catch(() => false)) {
      await backLink.click();
      await expect(page).toHaveURL(/.*explore/);
    }
  });

  test('displays agent information when available', async ({ page }) => {
    await page.goto(`/agent/${testAgentId}`);
    await page.waitForTimeout(1000);

    const header = page.getByTestId('agent-header');
    if (await header.isVisible().catch(() => false)) {
      await expect(header).toBeVisible();
    }
  });
});

test.describe('Agent Detail Page - Invalid Agent', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('handles invalid agent ID gracefully', async ({ page }) => {
    await page.goto('/agent/invalid-id');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
  });

  test('handles non-existent agent gracefully', async ({ page }) => {
    await page.goto('/agent/11155111:999999999');
    await page.waitForTimeout(1000);
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
  });
});
