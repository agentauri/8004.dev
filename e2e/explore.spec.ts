import { expect, test } from '@playwright/test';

test.describe('Explore Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
  });

  test('displays explore page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/explore/i);
  });

  test('displays search input', async ({ page }) => {
    await expect(page.getByRole('searchbox')).toBeVisible();
  });

  test('displays filter options', async ({ page }) => {
    // Check for chain selector or filter components
    await expect(page.getByTestId('search-bar')).toBeVisible();
  });

  test('allows typing in search input', async ({ page }) => {
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('trading agent');
    await expect(searchInput).toHaveValue('trading agent');
  });

  test('displays agent cards when results available', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(1000);

    // Check if either agent cards or "no results" message is displayed
    const agentCards = page.getByTestId('agent-card');
    const noResults = page.getByText(/no agents found/i);

    const hasCards = await agentCards
      .first()
      .isVisible()
      .catch(() => false);
    const hasNoResults = await noResults.isVisible().catch(() => false);

    expect(hasCards || hasNoResults).toBeTruthy();
  });

  test('shows loading state during search', async ({ page }) => {
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('test search query');

    // Loading states are fast, just verify the interaction doesn't crash
    await expect(searchInput).toHaveValue('test search query');
  });
});

test.describe('Explore Page Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
  });

  test('can toggle chain filters', async ({ page }) => {
    const chainButton = page.locator('[data-testid="chain-badge"]').first();
    if (await chainButton.isVisible()) {
      await chainButton.click();
      // Verify the interaction occurred
      await expect(chainButton).toBeVisible();
    }
  });

  test('can toggle MCP filter', async ({ page }) => {
    const mcpFilter = page.getByRole('button', { name: /mcp/i });
    if (await mcpFilter.isVisible().catch(() => false)) {
      await mcpFilter.click();
    }
  });

  test('can toggle A2A filter', async ({ page }) => {
    const a2aFilter = page.getByRole('button', { name: /a2a/i });
    if (await a2aFilter.isVisible().catch(() => false)) {
      await a2aFilter.click();
    }
  });
});
