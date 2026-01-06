/**
 * E2E tests for explore page filter combinations
 * Uses pairwise testing to cover all parameter pair combinations efficiently
 *
 * Note: MSW handles all backend API mocking at the Node.js level
 * No browser-level mocks needed - see e2e/msw/handlers.ts
 */

import { expect, test } from '@playwright/test';

/**
 * Generate pairwise filter combinations for E2E testing
 * This is a simplified version that covers the most important combinations
 */
interface FilterCombination {
  id: string;
  name: string;
  params: string;
}

const PAIRWISE_COMBINATIONS: FilterCombination[] = [
  // Protocol + Chain combinations
  { id: 'mcp-sepolia', name: 'MCP on Sepolia', params: 'mcp=true&chains=11155111' },
  { id: 'mcp-base', name: 'MCP on Base', params: 'mcp=true&chains=84532' },
  { id: 'mcp-polygon', name: 'MCP on Polygon', params: 'mcp=true&chains=80002' },
  { id: 'a2a-sepolia', name: 'A2A on Sepolia', params: 'a2a=true&chains=11155111' },
  { id: 'a2a-base', name: 'A2A on Base', params: 'a2a=true&chains=84532' },
  { id: 'x402-sepolia', name: 'x402 on Sepolia', params: 'x402=true&chains=11155111' },

  // Protocol + Status combinations
  { id: 'mcp-active', name: 'Active MCP agents', params: 'mcp=true&active=true' },
  { id: 'mcp-inactive', name: 'Inactive MCP agents', params: 'mcp=true&active=false' },
  { id: 'a2a-active', name: 'Active A2A agents', params: 'a2a=true&active=true' },
  { id: 'x402-active', name: 'Active x402 agents', params: 'x402=true&active=true' },

  // Protocol + Reputation combinations
  { id: 'mcp-high-rep', name: 'MCP with high reputation', params: 'mcp=true&minRep=75' },
  { id: 'mcp-low-rep', name: 'MCP with low reputation', params: 'mcp=true&maxRep=25' },
  { id: 'a2a-mid-rep', name: 'A2A with mid reputation', params: 'a2a=true&minRep=25&maxRep=75' },

  // Chain + Status combinations
  { id: 'sepolia-active', name: 'Active on Sepolia', params: 'chains=11155111&active=true' },
  { id: 'base-inactive', name: 'Inactive on Base', params: 'chains=84532&active=false' },

  // Chain + Reputation combinations
  { id: 'sepolia-high-rep', name: 'High rep on Sepolia', params: 'chains=11155111&minRep=75' },
  { id: 'base-low-rep', name: 'Low rep on Base', params: 'chains=84532&maxRep=25' },

  // Multi-protocol combinations
  { id: 'mcp-a2a-and', name: 'MCP AND A2A', params: 'mcp=true&a2a=true' },
  { id: 'mcp-a2a-or', name: 'MCP OR A2A', params: 'mcp=true&a2a=true&filterMode=OR' },
  { id: 'mcp-x402-and', name: 'MCP AND x402', params: 'mcp=true&x402=true' },
  { id: 'a2a-x402-or', name: 'A2A OR x402', params: 'a2a=true&x402=true&filterMode=OR' },
  { id: 'all-protocols-and', name: 'All protocols AND', params: 'mcp=true&a2a=true&x402=true' },
  {
    id: 'all-protocols-or',
    name: 'All protocols OR',
    params: 'mcp=true&a2a=true&x402=true&filterMode=OR',
  },

  // Query + Filter combinations
  { id: 'query-mcp', name: 'Query with MCP', params: 'q=Test&mcp=true' },
  { id: 'query-chain', name: 'Query with chain', params: 'q=agent&chains=11155111' },
  { id: 'query-active', name: 'Query with active', params: 'q=Test&active=true' },
  { id: 'query-rep', name: 'Query with reputation', params: 'q=Test&minRep=50' },

  // Sort + Filter combinations
  { id: 'sort-name-mcp', name: 'Sort by name with MCP', params: 'sort=name&order=asc&mcp=true' },
  {
    id: 'sort-rep-chain',
    name: 'Sort by rep with chain',
    params: 'sort=reputation&order=desc&chains=11155111',
  },
  {
    id: 'sort-created-active',
    name: 'Sort by created with active',
    params: 'sort=createdAt&order=desc&active=true',
  },

  // Complex multi-filter combinations
  {
    id: 'complex-1',
    name: 'MCP + Sepolia + Active',
    params: 'mcp=true&chains=11155111&active=true',
  },
  { id: 'complex-2', name: 'A2A + Base + High rep', params: 'a2a=true&chains=84532&minRep=75' },
  {
    id: 'complex-3',
    name: 'x402 + Polygon + Inactive',
    params: 'x402=true&chains=80002&active=false',
  },
  {
    id: 'complex-4',
    name: 'MCP+A2A + Sepolia + Active',
    params: 'mcp=true&a2a=true&chains=11155111&active=true',
  },
  {
    id: 'complex-5',
    name: 'Query + MCP + Chain + Sort',
    params: 'q=Test&mcp=true&chains=11155111&sort=name&order=asc',
  },

  // Multi-chain combinations
  { id: 'multi-chain-1', name: 'Sepolia + Base', params: 'chains=11155111,84532' },
  { id: 'multi-chain-2', name: 'All chains', params: 'chains=11155111,84532,80002' },
  { id: 'multi-chain-mcp', name: 'Multi-chain with MCP', params: 'chains=11155111,84532&mcp=true' },
];

test.describe('Explore Page Filter Combinations', () => {
  for (const combo of PAIRWISE_COMBINATIONS) {
    test(`${combo.name} (${combo.id})`, async ({ page }) => {
      await page.goto(`/explore?${combo.params}`);

      // Wait for loading to complete
      await page.waitForSelector(
        '[data-testid="agent-card"], [data-testid="search-results"][data-state="empty"]',
        { timeout: 5000 },
      );

      // Check that either we have results or a proper "no results" message
      const cards = page.locator('[data-testid="agent-card"]');
      const noResults = page.locator('[data-testid="search-results"][data-state="empty"]');

      const cardCount = await cards.count();
      const hasNoResults = await noResults.isVisible().catch(() => false);

      // One of these should be true
      expect(cardCount > 0 || hasNoResults).toBeTruthy();
    });
  }
});

test.describe('Explore Page Filter Persistence', () => {
  test('Filters persist after page reload', async ({ page }) => {
    const params = 'mcp=true&chains=11155111&active=true';
    await page.goto(`/explore?${params}`);
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    // URL should still have params
    expect(page.url()).toContain('mcp=true');
    expect(page.url()).toContain('chains=11155111');
  });

  test('Clearing filters resets to default', async ({ page }) => {
    await page.goto('/explore?mcp=true&chains=11155111');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    // Click clear/reset button if available
    const clearButton = page.locator(
      '[data-testid="clear-filters"], button:has-text("Clear"), button:has-text("Reset")',
    );
    if (await clearButton.isVisible().catch(() => false)) {
      await clearButton.click();
      // Wait for URL to update after clearing filters
      await page.waitForURL(/\/explore(?:\?|$)/, { timeout: 5000 }).catch(() => {});

      // URL should be clean
      const url = page.url();
      expect(url.includes('mcp=true')).toBeFalsy();
    }
  });

  test('Adding filter updates URL dynamically', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });

    // Try to click MCP filter (CapabilityTag with data-type="mcp")
    const mcpButton = page.locator('[data-testid="capability-tag"][data-type="mcp"]').first();
    if (await mcpButton.isVisible().catch(() => false)) {
      await mcpButton.click();
      await page.waitForURL(/mcp=true/, { timeout: 10000 });
      expect(page.url()).toContain('mcp=true');
    }
  });
});

test.describe('Explore Page Results Validation', () => {
  test('Result count changes with filters', async ({ page }) => {
    // Get count without filters
    await page.goto('/explore');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });
    const initialCount = await page.locator('[data-testid="agent-card"]').count();

    // Apply restrictive filter
    await page.goto('/explore?mcp=true&a2a=true&x402=true');
    // Wait for either results or empty state
    await page
      .locator('[data-testid="agent-card"], [data-testid="search-results"][data-state="empty"]')
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});

    // Should have fewer or equal results
    const filteredCards = page.locator('[data-testid="agent-card"]');
    const noResults = page.locator('[data-testid="search-results"][data-state="empty"]');

    const filteredCount = await filteredCards.count();
    const hasNoResults = await noResults.isVisible().catch(() => false);

    // Either fewer results or no results message
    expect(filteredCount <= initialCount || hasNoResults).toBeTruthy();
  });

  test('OR mode returns more results than AND mode', async ({ page }) => {
    // AND mode
    await page.goto('/explore?mcp=true&a2a=true');
    await page.waitForSelector(
      '[data-testid="agent-card"], [data-testid="search-results"][data-state="empty"]',
      { timeout: 5000 },
    );
    const andCount = await page.locator('[data-testid="agent-card"]').count();

    // OR mode
    await page.goto('/explore?mcp=true&a2a=true&filterMode=OR');
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 5000 });
    const orCount = await page.locator('[data-testid="agent-card"]').count();

    // OR should return more or equal results
    expect(orCount).toBeGreaterThanOrEqual(andCount);
  });
});
