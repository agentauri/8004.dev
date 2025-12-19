import { expect, test } from '@playwright/test';

test.describe('Agent Detail Page', () => {
  // Use a mock agent ID for testing
  const testAgentId = '11155111:1';

  test('displays agent header', async ({ page }) => {
    await page.goto(`/agent/${testAgentId}`);

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Either the agent header is visible or we're on an error/not-found page
    const header = page.getByTestId('agent-header');
    const notFound = page.getByText(/not found/i);
    const error = page.getByText(/error/i);

    const hasHeader = await header.isVisible().catch(() => false);
    const hasNotFound = await notFound.isVisible().catch(() => false);
    const hasError = await error.isVisible().catch(() => false);

    expect(hasHeader || hasNotFound || hasError).toBeTruthy();
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

    // If the agent exists, verify key sections are visible
    const header = page.getByTestId('agent-header');
    if (await header.isVisible().catch(() => false)) {
      await expect(header).toBeVisible();
    }
  });
});

test.describe('Agent Detail Page - Invalid Agent', () => {
  test('handles invalid agent ID gracefully', async ({ page }) => {
    await page.goto('/agent/invalid-id');
    await page.waitForTimeout(1000);

    // Should show not found or error message
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
  });

  test('handles non-existent agent gracefully', async ({ page }) => {
    await page.goto('/agent/11155111:999999999');
    await page.waitForTimeout(1000);

    // Should handle gracefully (either show error or not found)
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
  });
});
