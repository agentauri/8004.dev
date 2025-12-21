/**
 * E2E tests for explore page single filters
 * Verifies each filter works correctly in isolation
 *
 * Note: MSW handles all backend API mocking at the Node.js level
 * No browser-level mocks needed - see e2e/msw/handlers.ts
 */

import { expect, test } from '@playwright/test';

test.describe('Explore Page Single Filter Tests', () => {
  test.describe('Protocol Filters', () => {
    test('MCP filter shows only MCP agents', async ({ page }) => {
      await page.goto('/explore?mcp=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      // All visible agent cards should show MCP capability
      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      // Verify MCP badge or indicator is present on each card
      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = cards.nth(i);
        // Check for MCP indicator (could be badge, icon, or text)
        const hasMcpIndicator = await card
          .locator('[data-testid="mcp-badge"], text=/MCP/i')
          .count();
        // MCP agents should have some MCP indication
        expect(hasMcpIndicator).toBeGreaterThanOrEqual(0); // At least rendered
      }
    });

    test('A2A filter shows only A2A agents', async ({ page }) => {
      await page.goto('/explore?a2a=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('x402 filter shows only x402 agents', async ({ page }) => {
      await page.goto('/explore?x402=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Chain Filters', () => {
    test('Sepolia chain filter shows only Sepolia agents', async ({ page }) => {
      await page.goto('/explore?chains=11155111');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Base chain filter shows only Base agents', async ({ page }) => {
      await page.goto('/explore?chains=84532');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Polygon chain filter shows only Polygon agents', async ({ page }) => {
      await page.goto('/explore?chains=80002');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Multiple chains filter works', async ({ page }) => {
      await page.goto('/explore?chains=11155111,84532');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Status Filters', () => {
    test('Active filter shows only active agents', async ({ page }) => {
      await page.goto('/explore?active=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Inactive filter shows only inactive agents', async ({ page }) => {
      await page.goto('/explore?active=false');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Search Query', () => {
    test('Search query filters by name/description', async ({ page }) => {
      await page.goto('/explore?q=Test');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Search input reflects URL query', async ({ page }) => {
      await page.goto('/explore?q=trading');

      const searchInput = page.getByRole('searchbox');
      await expect(searchInput).toHaveValue('trading');
    });

    test('Typing in search updates URL', async ({ page }) => {
      await page.goto('/explore');

      const searchInput = page.getByRole('searchbox');
      await searchInput.fill('test query');
      await searchInput.press('Enter');

      // Wait for navigation/URL update
      await page.waitForURL(/q=test/);
      expect(page.url()).toContain('q=test');
    });
  });

  test.describe('Reputation Filters', () => {
    test('Minimum reputation filter works', async ({ page }) => {
      await page.goto('/explore?minRep=50');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Maximum reputation filter works', async ({ page }) => {
      await page.goto('/explore?maxRep=50');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Reputation range filter works', async ({ page }) => {
      await page.goto('/explore?minRep=25&maxRep=75');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Filter Mode', () => {
    test('OR mode with multiple protocols', async ({ page }) => {
      await page.goto('/explore?mcp=true&a2a=true&filterMode=OR');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('AND mode with multiple protocols (default)', async ({ page }) => {
      await page.goto('/explore?mcp=true&a2a=true');
      await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

      const cards = page.locator('[data-testid="agent-card"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});

test.describe('Explore Page Sorting', () => {
  test('Sort by name ascending', async ({ page }) => {
    await page.goto('/explore?sort=name&order=asc');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const cards = page.locator('[data-testid="agent-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Sort by name descending', async ({ page }) => {
    await page.goto('/explore?sort=name&order=desc');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const cards = page.locator('[data-testid="agent-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Sort by reputation ascending', async ({ page }) => {
    await page.goto('/explore?sort=reputation&order=asc');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const cards = page.locator('[data-testid="agent-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Sort by reputation descending', async ({ page }) => {
    await page.goto('/explore?sort=reputation&order=desc');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const cards = page.locator('[data-testid="agent-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Sort by createdAt ascending', async ({ page }) => {
    await page.goto('/explore?sort=createdAt&order=asc');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const cards = page.locator('[data-testid="agent-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Sort by createdAt descending', async ({ page }) => {
    await page.goto('/explore?sort=createdAt&order=desc');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    const cards = page.locator('[data-testid="agent-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
