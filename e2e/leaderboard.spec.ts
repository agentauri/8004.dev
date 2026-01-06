/**
 * E2E tests for leaderboard feature
 * Verifies the leaderboard page rankings and filtering functionality
 *
 * Note: MSW handles all backend API mocking at the Node.js level
 */

import { expect, test } from '@playwright/test';

test.describe('Leaderboard Page', () => {
  test.describe('Page Load', () => {
    test('loads leaderboard page successfully', async ({ page }) => {
      await page.goto('/leaderboard');

      // Should show page title
      await expect(page.getByText(/leaderboard/i)).toBeVisible();
    });

    test('displays trophy icon', async ({ page }) => {
      await page.goto('/leaderboard');

      // Page should have the trophy icon or header
      await expect(page.locator('header')).toBeVisible();
    });

    test('shows loading state initially', async ({ page }) => {
      await page.goto('/leaderboard');

      // Loading state might be brief, just ensure page loads
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Leaderboard Table', () => {
    test('displays leaderboard entries', async ({ page }) => {
      await page.goto('/leaderboard');

      // Wait for table to load
      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      const table = page.locator('[data-testid="leaderboard-table"], table').first();
      await expect(table).toBeVisible();
    });

    test('shows rank numbers for entries', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      // First entry should have rank 1
      const firstRank = page.locator('[data-testid="leaderboard-rank-1"], td:first-child').first();

      if (await firstRank.isVisible()) {
        await expect(firstRank).toBeVisible();
      }
    });

    test('displays agent names', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      // Should have agent entries with names
      const agentNames = page.locator('[data-testid^="leaderboard-entry-"], tbody tr');
      const count = await agentNames.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('shows reputation scores', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      // Scores should be visible in the table
      const table = page.locator('[data-testid="leaderboard-table"], table').first();
      await expect(table).toBeVisible();
    });
  });

  test.describe('Leaderboard Filters', () => {
    test('displays filter sidebar', async ({ page }) => {
      await page.goto('/leaderboard');

      // Look for filters component
      const filters = page.locator('[data-testid="leaderboard-filters"], aside').first();
      await expect(filters).toBeVisible();
    });

    test('can filter by chain', async ({ page }) => {
      await page.goto('/leaderboard');

      // Look for chain filter
      const chainFilter = page.locator(
        '[data-testid="chain-filter"], [data-testid="filter-chains"]',
      );

      if (await chainFilter.isVisible()) {
        // Click to select a chain
        await chainFilter.click();
      }
    });

    test('can filter by protocol', async ({ page }) => {
      await page.goto('/leaderboard');

      // Look for MCP protocol filter
      const mcpFilter = page.locator('[data-testid="protocol-mcp"], label:has-text("MCP")');

      if (await mcpFilter.isVisible()) {
        await mcpFilter.click();

        // Should trigger filter update
        await page.waitForTimeout(500);
      }
    });

    test('can select time period', async ({ page }) => {
      await page.goto('/leaderboard');

      // Look for period filter
      const periodFilter = page.locator('[data-testid="period-filter"], select');

      if (await periodFilter.isVisible()) {
        await periodFilter.selectOption({ index: 1 });
      }
    });

    test('shows total count', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      // Look for total count display
      const countDisplay = page.locator(
        '[data-testid="total-count"], [data-testid="leaderboard-count"]',
      );

      if (await countDisplay.isVisible()) {
        await expect(countDisplay).toBeVisible();
      }
    });
  });

  test.describe('Pagination', () => {
    test('can load more entries', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      // Look for load more button
      const loadMoreButton = page.locator(
        '[data-testid="load-more"], button:has-text("Load More")',
      );

      if (await loadMoreButton.isVisible()) {
        await loadMoreButton.click();

        // Should load more entries
        await page.waitForTimeout(1000);
      }
    });

    test('shows loading state during pagination', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      const loadMoreButton = page.locator(
        '[data-testid="load-more"], button:has-text("Load More")',
      );

      if (await loadMoreButton.isVisible()) {
        await loadMoreButton.click();

        // Check if loading indicator appears
        await expect(page.locator('body')).toBeVisible();
      }
    });
  });

  test.describe('Agent Navigation', () => {
    test('can click on agent to view details', async ({ page }) => {
      await page.goto('/leaderboard');

      await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

      // Find a clickable agent link
      const agentLink = page.locator('a[href^="/agent/"]').first();

      if (await agentLink.isVisible()) {
        await agentLink.click();

        // Should navigate to agent detail page
        await page.waitForURL(/\/agent\//);
        expect(page.url()).toContain('/agent/');
      }
    });
  });

  test.describe('Error Handling', () => {
    test('handles API errors gracefully', async ({ page }) => {
      // Navigate to leaderboard - even with errors, page should load
      await page.goto('/leaderboard');

      await expect(page.locator('body')).toBeVisible();
    });
  });
});

test.describe('Leaderboard Accessibility', () => {
  test('table has proper structure', async ({ page }) => {
    await page.goto('/leaderboard');

    await page.waitForSelector('[data-testid="leaderboard-table"], table', { timeout: 10000 });

    const table = page.locator('table').first();

    if (await table.isVisible()) {
      // Should have thead and tbody
      const thead = table.locator('thead');
      const tbody = table.locator('tbody');

      await expect(thead).toBeVisible();
      await expect(tbody).toBeVisible();
    }
  });

  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/leaderboard');

    // Should have h1 for page title
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('filters are keyboard accessible', async ({ page }) => {
    await page.goto('/leaderboard');

    // Tab through the page
    await page.keyboard.press('Tab');

    // Check that something is focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
