/**
 * Smart Playwright API mocking helper with actual filtering logic
 * Generates diverse agent pool and applies real filters for E2E testing
 */

import type { Page } from '@playwright/test';

/**
 * Agent structure for mock responses
 */
interface MockAgent {
  id: string;
  chainId: number;
  tokenId: string;
  name: string;
  description: string;
  walletAddress: string;
  active: boolean;
  reputationScore: number;
  reputationCount: number;
  hasMcp: boolean;
  hasA2a: boolean;
  x402Support: boolean;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number;
  matchReasons?: string[];
}

/**
 * Protocol configuration for agent generation
 */
interface ProtocolConfig {
  hasMcp: boolean;
  hasA2a: boolean;
  x402Support: boolean;
}

/**
 * All possible protocol combinations
 */
const PROTOCOL_CONFIGS: ProtocolConfig[] = [
  { hasMcp: false, hasA2a: false, x402Support: false },
  { hasMcp: true, hasA2a: false, x402Support: false },
  { hasMcp: false, hasA2a: true, x402Support: false },
  { hasMcp: false, hasA2a: false, x402Support: true },
  { hasMcp: true, hasA2a: true, x402Support: false },
  { hasMcp: true, hasA2a: false, x402Support: true },
  { hasMcp: false, hasA2a: true, x402Support: true },
  { hasMcp: true, hasA2a: true, x402Support: true },
];

/**
 * Supported chains
 */
const CHAINS = [11155111, 84532, 80002];

/**
 * Reputation score buckets
 */
const REPUTATION_SCORES = [0, 25, 50, 75, 90, 100];

/**
 * Generate a diverse pool of agents (288 total)
 */
function generateDiverseAgentPool(): MockAgent[] {
  const agents: MockAgent[] = [];
  let id = 1;
  const now = new Date();

  for (const chainId of CHAINS) {
    for (const proto of PROTOCOL_CONFIGS) {
      for (const active of [true, false]) {
        for (const repScore of REPUTATION_SCORES) {
          const createdAt = new Date(now.getTime() - id * 1000 * 60 * 60);
          agents.push({
            id: `${chainId}:${id}`,
            chainId,
            tokenId: String(id),
            name: `Test Agent ${id}`,
            description: `Test agent on chain ${chainId} with rep ${repScore}`,
            walletAddress: `0x${id.toString().padStart(40, '0')}`,
            active,
            reputationScore: repScore,
            reputationCount: 10,
            hasMcp: proto.hasMcp,
            hasA2a: proto.hasA2a,
            x402Support: proto.x402Support,
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString(),
          });
          id++;
        }
      }
    }
  }

  return agents;
}

/**
 * Parsed filters from request
 */
interface ParsedFilters {
  query?: string;
  mcp?: boolean;
  a2a?: boolean;
  x402?: boolean;
  active?: boolean;
  chainIds?: number[];
  minRep?: number;
  maxRep?: number;
  filterMode?: 'AND' | 'OR';
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
}

/**
 * Apply filters to agent pool
 */
function applyFilters(agents: MockAgent[], filters: ParsedFilters): MockAgent[] {
  let result = [...agents];

  // Text query filter
  if (filters.query?.trim()) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
    );
    // Add relevance scores
    result = result.map((a) => ({
      ...a,
      relevanceScore: 55 + Math.floor(Math.random() * 40),
      matchReasons: ['semantic match'],
    }));
  }

  // Protocol filters
  const hasProtocolFilters =
    filters.mcp !== undefined || filters.a2a !== undefined || filters.x402 !== undefined;

  if (hasProtocolFilters) {
    if (filters.filterMode === 'OR') {
      result = result.filter((a) => {
        const matches: boolean[] = [];
        if (filters.mcp === true) matches.push(a.hasMcp);
        if (filters.a2a === true) matches.push(a.hasA2a);
        if (filters.x402 === true) matches.push(a.x402Support);
        return matches.length === 0 || matches.some((m) => m);
      });
    } else {
      if (filters.mcp === true) result = result.filter((a) => a.hasMcp);
      if (filters.mcp === false) result = result.filter((a) => !a.hasMcp);
      if (filters.a2a === true) result = result.filter((a) => a.hasA2a);
      if (filters.a2a === false) result = result.filter((a) => !a.hasA2a);
      if (filters.x402 === true) result = result.filter((a) => a.x402Support);
      if (filters.x402 === false) result = result.filter((a) => !a.x402Support);
    }
  }

  // Status filter
  if (filters.active !== undefined) {
    result = result.filter((a) => a.active === filters.active);
  }

  // Chain filter
  if (filters.chainIds && filters.chainIds.length > 0) {
    result = result.filter((a) => filters.chainIds!.includes(a.chainId));
  }

  // Reputation filters
  if (filters.minRep !== undefined && filters.minRep > 0) {
    result = result.filter((a) => a.reputationScore >= filters.minRep!);
  }
  if (filters.maxRep !== undefined && filters.maxRep < 100) {
    result = result.filter((a) => a.reputationScore <= filters.maxRep!);
  }

  // Apply sorting
  if (filters.sort) {
    const order = filters.order === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sort) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'reputation':
          cmp = a.reputationScore - b.reputationScore;
          break;
        case 'createdAt':
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'relevance':
          cmp = (a.relevanceScore ?? 0) - (b.relevanceScore ?? 0);
          break;
        default:
          cmp = 0;
      }
      return cmp * order;
    });
  }

  // Apply limit
  const limit = filters.limit ?? 20;
  result = result.slice(0, limit);

  return result;
}

/**
 * Parse filters from URL search params
 */
function parseUrlFilters(url: string): ParsedFilters {
  const urlObj = new URL(url, 'http://localhost');
  const filters: ParsedFilters = {};

  const q = urlObj.searchParams.get('q');
  if (q) filters.query = q;

  const mcp = urlObj.searchParams.get('mcp');
  if (mcp) filters.mcp = mcp === 'true';

  const a2a = urlObj.searchParams.get('a2a');
  if (a2a) filters.a2a = a2a === 'true';

  const x402 = urlObj.searchParams.get('x402');
  if (x402) filters.x402 = x402 === 'true';

  const active = urlObj.searchParams.get('active');
  if (active) filters.active = active === 'true';

  const chains = urlObj.searchParams.get('chains');
  if (chains) {
    filters.chainIds = chains
      .split(',')
      .map(Number)
      .filter((n) => !Number.isNaN(n));
  }

  const minRep = urlObj.searchParams.get('minRep');
  if (minRep) filters.minRep = Number.parseInt(minRep, 10);

  const maxRep = urlObj.searchParams.get('maxRep');
  if (maxRep) filters.maxRep = Number.parseInt(maxRep, 10);

  const filterMode = urlObj.searchParams.get('filterMode');
  if (filterMode === 'OR') filters.filterMode = 'OR';

  const sort = urlObj.searchParams.get('sort');
  if (sort) filters.sort = sort;

  const order = urlObj.searchParams.get('order');
  if (order === 'asc' || order === 'desc') filters.order = order;

  const limit = urlObj.searchParams.get('limit');
  if (limit) filters.limit = Number.parseInt(limit, 10);

  return filters;
}

/**
 * Parse filters from POST body
 */
function parseBodyFilters(body: Record<string, unknown>): ParsedFilters {
  const filters: ParsedFilters = {};

  if (body.query) filters.query = body.query as string;
  if (body.limit) filters.limit = body.limit as number;
  if (body.sort) filters.sort = body.sort as string;
  if (body.order) filters.order = body.order as 'asc' | 'desc';

  const bodyFilters = body.filters as Record<string, unknown> | undefined;
  if (bodyFilters) {
    if (bodyFilters.mcp !== undefined) filters.mcp = bodyFilters.mcp as boolean;
    if (bodyFilters.a2a !== undefined) filters.a2a = bodyFilters.a2a as boolean;
    if (bodyFilters.x402 !== undefined) filters.x402 = bodyFilters.x402 as boolean;
    if (bodyFilters.active !== undefined) filters.active = bodyFilters.active as boolean;
    if (bodyFilters.chainIds) filters.chainIds = bodyFilters.chainIds as number[];
    if (bodyFilters.filterMode) filters.filterMode = bodyFilters.filterMode as 'AND' | 'OR';
  }

  return filters;
}

/**
 * Build response structure
 */
function buildResponse(agents: MockAgent[], query?: string) {
  return {
    success: true,
    data: agents,
    meta: {
      total: agents.length,
      hasMore: false,
      query,
    },
  };
}

/**
 * Build agent detail response
 */
function buildAgentDetailResponse(agent: MockAgent) {
  return {
    success: true,
    data: {
      ...agent,
      endpoint: `https://agent-${agent.tokenId}.example.com`,
      oasfSchema: {
        interfaces: [
          {
            name: 'test-interface',
            description: 'Test interface',
            methods: [],
          },
        ],
      },
    },
    meta: {},
  };
}

/**
 * Setup smart API mocks for E2E tests
 */
export async function setupSmartApiMocks(page: Page): Promise<void> {
  // Pre-generate diverse agent pool
  const agentPool = generateDiverseAgentPool();

  // Mock stats endpoint
  await page.route('**/api/stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          totalAgents: agentPool.length,
          activeAgents: agentPool.filter((a) => a.active).length,
          chainsSupported: CHAINS.length,
          totalTransactions: 1000,
        },
      }),
    });
  });

  // Mock taxonomy endpoint
  await page.route('**/api/taxonomy', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          skills: ['trading', 'analytics', 'coding'],
          domains: ['defi', 'nft', 'gaming'],
        },
      }),
    });
  });

  // Mock search endpoint (POST /api/search)
  await page.route('**/api/search', async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    let filters: ParsedFilters = {};
    try {
      const body = request.postDataJSON();
      filters = parseBodyFilters(body);
    } catch {
      // Empty body is fine
    }

    const result = applyFilters(agentPool, filters);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildResponse(result, filters.query)),
    });
  });

  // Mock agents list endpoint (GET /api/agents)
  await page.route(/\/api\/agents(\?.*)?$/, async (route) => {
    const request = route.request();
    const url = request.url();

    // Check if this is a detail request (has :id pattern)
    if (/\/api\/agents\/\d+:\d+/.test(url)) {
      await route.continue();
      return;
    }

    const filters = parseUrlFilters(url);
    const result = applyFilters(agentPool, filters);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildResponse(result)),
    });
  });

  // Mock similar agents endpoint
  await page.route(/\/api\/agents\/\d+:\d+\/similar/, async (route) => {
    const result = agentPool.slice(0, 3);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: result,
        meta: { total: 3 },
      }),
    });
  });

  // Mock agent detail endpoint
  await page.route(/\/api\/agents\/\d+:\d+$/, async (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/agents\/(\d+:\d+)$/);
    const agentId = match?.[1];

    const agent = agentPool.find((a) => a.id === agentId);

    if (agent) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildAgentDetailResponse(agent)),
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

/**
 * Get agent pool for assertions in tests
 */
export function getAgentPool(): MockAgent[] {
  return generateDiverseAgentPool();
}

/**
 * Count agents matching filters (for test assertions)
 */
export function countMatchingAgents(filters: ParsedFilters): number {
  const pool = generateDiverseAgentPool();
  return applyFilters(pool, filters).length;
}

export type { MockAgent, ParsedFilters };
