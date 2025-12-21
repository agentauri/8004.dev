/**
 * E2E tests for explore page edge cases
 * Tests unusual or boundary conditions
 *
 * Note: MSW handles all backend API mocking at the Node.js level
 * No browser-level mocks needed - see e2e/msw/handlers.ts
 */

import { expect, test } from '@playwright/test';

test.describe('Explore Page Edge Cases', () => {

  test.describe('Empty and Default States', () => {
    test('No filters shows default results', async ({ page }) => {
      await page.goto('/explore');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Empty query string treated as no query', async ({ page }) => {
      await page.goto('/explore?q=');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Whitespace-only query treated as empty', async ({ page }) => {
      await page.goto('/explore?q=%20%20%20');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Special Characters', () => {
    test('Query with special characters', async ({ page }) => {
      await page.goto('/explore?q=test%20%26%20agent');
      // Should not error
      await page.waitForTimeout(1000);

      // Page should load without errors
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('Query with unicode characters', async ({ page }) => {
      await page.goto('/explore?q=%E3%82%A8%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88');
      // Should not error
      await page.waitForTimeout(1000);

      // Page should load without errors
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('Query with emoji', async ({ page }) => {
      await page.goto('/explore?q=%F0%9F%A4%96');
      // Should not error
      await page.waitForTimeout(1000);

      // Page should load without errors
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Boundary Values', () => {
    test('Reputation min equals max', async ({ page }) => {
      await page.goto('/explore?minRep=50&maxRep=50');
      await page.waitForSelector('[data-testid="agent-card"], [data-testid="no-results"]', {
        timeout: 5000,
      });

      // Should work without errors
      const cards = page.locator('[data-testid="agent-card"]');
      const noResults = page.locator('[data-testid="no-results"], text=/no agents found/i');

      const hasCards = await cards
        .first()
        .isVisible()
        .catch(() => false);
      const hasNoResults = await noResults.isVisible().catch(() => false);

      expect(hasCards || hasNoResults).toBeTruthy();
    });

    test('Reputation range 0-100 (full range)', async ({ page }) => {
      await page.goto('/explore?minRep=0&maxRep=100');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Very long query string', async ({ page }) => {
      const longQuery = 'a'.repeat(500);
      await page.goto(`/explore?q=${longQuery}`);
      await page.waitForTimeout(1000);

      // Should not crash
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Invalid Parameters', () => {
    test('Invalid chain ID ignored gracefully', async ({ page }) => {
      await page.goto('/explore?chains=99999');
      await page.waitForSelector('[data-testid="agent-card"], [data-testid="no-results"]', {
        timeout: 5000,
      });

      // Should not crash - either shows no results or ignores invalid chain
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('Invalid boolean values handled', async ({ page }) => {
      await page.goto('/explore?mcp=maybe&active=yes');
      await page.waitForTimeout(1000);

      // Should not crash
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('Invalid sort field handled', async ({ page }) => {
      await page.goto('/explore?sort=invalid&order=sideways');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      // Should fall back to default sort
      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Negative reputation values handled', async ({ page }) => {
      await page.goto('/explore?minRep=-10&maxRep=150');
      await page.waitForTimeout(1000);

      // Should not crash
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Conflicting Filters', () => {
    test('All protocols AND with all chains', async ({ page }) => {
      await page.goto('/explore?mcp=true&a2a=true&x402=true&chains=11155111,84532,80002');
      await page.waitForSelector('[data-testid="agent-card"], [data-testid="no-results"]', {
        timeout: 5000,
      });

      // Should work - may return few or no results
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('Active and inactive both in URL', async ({ page }) => {
      // This is invalid - should handle gracefully
      await page.goto('/explore?active=true&active=false');
      await page.waitForTimeout(1000);

      // Should not crash
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });

    test('Min reputation greater than max', async ({ page }) => {
      await page.goto('/explore?minRep=80&maxRep=20');
      await page.waitForSelector('[data-testid="agent-card"], [data-testid="no-results"]', {
        timeout: 5000,
      });

      // Should handle gracefully - probably no results
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Show All Agents Toggle', () => {
    test('showAll parameter works', async ({ page }) => {
      await page.goto('/explore?showAll=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('showAll combined with other filters', async ({ page }) => {
      await page.goto('/explore?showAll=true&mcp=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Pagination Edge Cases', () => {
    test('First page loads correctly', async ({ page }) => {
      await page.goto('/explore');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(20); // Default page size
    });

    test('Page parameter in URL', async ({ page }) => {
      await page.goto('/explore?page=1');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      // Should work normally
      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Invalid page number handled', async ({ page }) => {
      await page.goto('/explore?page=-1');
      await page.waitForTimeout(1000);

      // Should not crash
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  });
});

test.describe('Explore Page Accessibility', () => {
  test('Search input has accessible name', async ({ page }) => {
    await page.goto('/explore');

    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
    // Should have accessible name
    await expect(searchInput).toHaveAttribute('aria-label', /.+/);
  });

  test('Filter buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/explore');

    // Tab to first filter button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate with keyboard
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('Agent cards are focusable', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const firstCard = page.locator('[data-testid="agent-card"]').first();
    await expect(firstCard).toBeVisible();
  });
});
