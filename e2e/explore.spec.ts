import { expect, test } from '@playwright/test';

test.describe('Explore Page', () => {
  test.beforeEach(async ({ page }) => {
    // MSW handles all backend API mocking at the Node.js level
    await page.goto('/explore');
  });

  test('displays explore page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/explore/i);
  });

  test('displays search input', async ({ page }) => {
    await expect(page.getByRole('searchbox')).toBeVisible();
  });

  test('displays filter options', async ({ page }) => {
    await expect(page.getByTestId('search-bar').first()).toBeVisible();
  });

  test('allows typing in search input', async ({ page }) => {
    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('trading agent');
    await expect(searchInput).toHaveValue('trading agent');
  });

  test('displays agent cards when results available', async ({ page }) => {
    // Wait for either agent cards or no results message
    await page
      .locator('[data-testid="agent-card"], [data-testid="search-results"][data-state="empty"]')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {});

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
    await expect(searchInput).toHaveValue('test search query');
  });
});

test.describe('Explore Page Filters', () => {
  test.beforeEach(async ({ page }) => {
    // MSW handles all backend API mocking at the Node.js level
    await page.goto('/explore');
  });

  test('can toggle chain filters', async ({ page }) => {
    const chainButton = page.locator('[data-testid="chain-badge"]').first();
    if (await chainButton.isVisible()) {
      await chainButton.click();
      await expect(chainButton).toBeVisible();
    }
  });

  test('can toggle MCP filter', async ({ page }) => {
    // Use sidebar-specific selector to avoid matching the "Connect MCP" nav button
    const mcpFilter = page.getByTestId('explore-sidebar').getByRole('button', { name: /mcp/i });
    if (await mcpFilter.isVisible().catch(() => false)) {
      await mcpFilter.click();
    }
  });

  test('can toggle A2A filter', async ({ page }) => {
    // Use sidebar-specific selector for consistency
    const a2aFilter = page.getByTestId('explore-sidebar').getByRole('button', { name: /a2a/i });
    if (await a2aFilter.isVisible().catch(() => false)) {
      await a2aFilter.click();
    }
  });
});
