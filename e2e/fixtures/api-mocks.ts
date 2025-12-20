/**
 * Playwright API mocking helper
 * Intercepts local Next.js API routes and returns mock responses
 */

import type { Page } from '@playwright/test';
import {
  buildAgentDetailResponse,
  buildSearchResponse,
  buildSimilarAgentsResponse,
  buildStatsResponse,
  buildTaxonomyResponse,
  mockAgents,
} from './mock-data';

/**
 * Setup API mocks for E2E tests
 * This intercepts fetch requests to the local Next.js API routes
 */
export async function setupApiMocks(page: Page): Promise<void> {
  // Mock stats endpoint
  await page.route('**/api/stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildStatsResponse()),
    });
  });

  // Mock taxonomy endpoint
  await page.route('**/api/taxonomy', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildTaxonomyResponse()),
    });
  });

  // Mock search endpoint (POST /api/search)
  await page.route('**/api/search', async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    let query = '';
    let filters: Record<string, unknown> = {};

    try {
      const body = request.postDataJSON();
      query = body?.query || '';
      filters = body?.filters || {};
    } catch {
      // Empty body is fine
    }

    let result = [...mockAgents];

    // Apply text filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
      );
    }

    // Apply capability filters
    if (filters.mcp === true) result = result.filter((a) => a.hasMcp);
    if (filters.a2a === true) result = result.filter((a) => a.hasA2a);
    if (filters.x402 === true) result = result.filter((a) => a.x402support);
    if (filters.active === true) result = result.filter((a) => a.active);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildSearchResponse(result, query)),
    });
  });

  // Mock agents list endpoint (GET /api/agents) - must use regex to not match detail
  await page.route(/\/api\/agents(\?.*)?$/, async (route) => {
    const request = route.request();
    const url = request.url();

    // Check if this is a detail request (has :id pattern)
    if (/\/api\/agents\/\d+:\d+/.test(url)) {
      // Let the detail handler catch this
      await route.continue();
      return;
    }

    // This is a list request
    const urlObj = new URL(url);
    const chainParam = urlObj.searchParams.get('chains');
    const mcpParam = urlObj.searchParams.get('mcp');
    const a2aParam = urlObj.searchParams.get('a2a');
    const x402Param = urlObj.searchParams.get('x402');

    let result = [...mockAgents];

    // Apply chain filter
    if (chainParam) {
      const chainIds = chainParam.split(',').map(Number);
      result = result.filter((a) => chainIds.includes(a.chainId));
    }

    // Apply capability filters
    if (mcpParam === 'true') result = result.filter((a) => a.hasMcp);
    if (a2aParam === 'true') result = result.filter((a) => a.hasA2a);
    if (x402Param === 'true') result = result.filter((a) => a.x402support);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildSearchResponse(result, '')),
    });
  });

  // Mock similar agents endpoint (GET /api/agents/:id/similar)
  // Must be registered before agent detail to match more specific path first
  await page.route(/\/api\/agents\/\d+:\d+\/similar/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildSimilarAgentsResponse()),
    });
  });

  // Mock agent detail endpoint (GET /api/agents/:id)
  await page.route(/\/api\/agents\/\d+:\d+$/, async (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/agents\/(\d+:\d+)$/);
    const agentId = match?.[1];

    const agent = mockAgents.find((a) => a.id === agentId);

    if (agent) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildAgentDetailResponse()),
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Agent not found',
          code: 'NOT_FOUND',
        }),
      });
    }
  });
}
