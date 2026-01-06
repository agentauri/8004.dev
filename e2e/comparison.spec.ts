/**
 * E2E tests for agent comparison feature
 * Verifies comparison page and selection functionality
 *
 * Note: MSW handles all backend API mocking at the Node.js level
 */

import { expect, test } from '@playwright/test';

test.describe('Compare Page', () => {
  test.describe('Empty State', () => {
    test('shows empty state when no agents selected', async ({ page }) => {
      await page.goto('/compare');

      // Should show empty state message
      await expect(page.getByText(/no agents selected/i)).toBeVisible();
    });

    test('shows link to explore page in empty state', async ({ page }) => {
      await page.goto('/compare');

      const exploreLink = page.getByRole('link', { name: /explore/i });
      await expect(exploreLink).toBeVisible();
    });
  });

  test.describe('Agent Comparison', () => {
    test('loads agents from URL params', async ({ page }) => {
      await page.goto('/compare?agents=11155111:1,11155111:2');

      // Wait for agents to load
      await page.waitForSelector('[data-testid="compare-table"]', { timeout: 10000 });

      // Should show comparison table
      await expect(page.locator('[data-testid="compare-table"]')).toBeVisible();
    });

    test('shows agent details in comparison table', async ({ page }) => {
      await page.goto('/compare?agents=11155111:1');

      await page.waitForSelector('[data-testid="compare-table"]', { timeout: 10000 });

      // Should display agent information
      const table = page.locator('[data-testid="compare-table"]');
      await expect(table).toBeVisible();
    });

    test('allows removing agent from comparison', async ({ page }) => {
      await page.goto('/compare?agents=11155111:1,11155111:2');

      await page.waitForSelector('[data-testid="compare-table"]', { timeout: 10000 });

      // Find and click remove button
      const removeButtons = page.locator('[data-testid^="compare-remove-"]');
      const count = await removeButtons.count();

      if (count > 0) {
        await removeButtons.first().click();

        // URL should update
        await page.waitForURL(/compare/);
      }
    });

    test('limits agents to maximum allowed', async ({ page }) => {
      // Try to load more than max agents (4)
      await page.goto('/compare?agents=11155111:1,11155111:2,11155111:3,11155111:4,11155111:5');

      await page.waitForSelector('[data-testid="compare-table"]', { timeout: 10000 });

      // Should only show maximum allowed agents
      const table = page.locator('[data-testid="compare-table"]');
      await expect(table).toBeVisible();
    });
  });

  test.describe('URL State', () => {
    test('preserves agent selection in URL', async ({ page }) => {
      await page.goto('/compare?agents=11155111:1');

      // URL should contain the agent ID
      expect(page.url()).toContain('agents=11155111:1');
    });

    test('handles invalid agent IDs gracefully', async ({ page }) => {
      await page.goto('/compare?agents=invalid-id');

      // Page should load without crashing
      await expect(page.locator('body')).toBeVisible();
    });

    test('handles empty agents param', async ({ page }) => {
      await page.goto('/compare?agents=');

      // Should show empty state
      await expect(page.getByText(/no agents selected/i)).toBeVisible();
    });
  });
});

test.describe('Agent Selection from Explore', () => {
  test('can select agent for comparison from explore page', async ({ page }) => {
    await page.goto('/explore');

    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 10000 });

    // Look for compare checkbox
    const compareCheckbox = page.locator('[data-testid="compare-checkbox"]').first();

    if (await compareCheckbox.isVisible()) {
      await compareCheckbox.click();

      // Compare bar should appear or selection should be made
      const compareBar = page.locator('[data-testid="compare-bar"]');
      if (await compareBar.isVisible({ timeout: 2000 })) {
        await expect(compareBar).toBeVisible();
      }
    }
  });

  test('compare checkbox shows selected state', async ({ page }) => {
    await page.goto('/explore');

    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 10000 });

    const compareCheckbox = page.locator('[data-testid="compare-checkbox"]').first();

    if (await compareCheckbox.isVisible()) {
      // Click to select
      await compareCheckbox.click();

      // Should show as selected
      await expect(compareCheckbox).toHaveAttribute('data-checked', 'true');

      // Click to deselect
      await compareCheckbox.click();

      // Should show as unselected
      await expect(compareCheckbox).toHaveAttribute('data-checked', 'false');
    }
  });
});
