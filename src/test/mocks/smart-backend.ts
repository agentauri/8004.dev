/**
 * Smart backend mock with stateful filtering logic
 * Generates a diverse pool of agents and applies actual filtering
 * to ensure test assertions are valid
 */

import type { AgentSummary } from '@/types/agent';
import { createMockAgentSummary } from '../fixtures/agents';

/**
 * Filter parameters extracted from URL or request body
 */
export interface ParsedFilters {
  query?: string;
  mcp?: boolean;
  a2a?: boolean;
  x402?: boolean;
  active?: boolean;
  chainIds?: number[];
  minRep?: number;
  maxRep?: number;
  skills?: string[];
  domains?: string[];
  filterMode?: 'AND' | 'OR';
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  cursor?: string;
}

/**
 * Protocol configuration for agent generation
 */
interface ProtocolConfig {
  hasMcp: boolean;
  hasA2a: boolean;
  x402support: boolean;
}

/**
 * All possible protocol combinations for diversity
 */
const PROTOCOL_CONFIGS: ProtocolConfig[] = [
  { hasMcp: false, hasA2a: false, x402support: false },
  { hasMcp: true, hasA2a: false, x402support: false },
  { hasMcp: false, hasA2a: true, x402support: false },
  { hasMcp: false, hasA2a: false, x402support: true },
  { hasMcp: true, hasA2a: true, x402support: false },
  { hasMcp: true, hasA2a: false, x402support: true },
  { hasMcp: false, hasA2a: true, x402support: true },
  { hasMcp: true, hasA2a: true, x402support: true },
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
 * Generate a diverse pool of agents for testing
 * Creates agents with all combinations of:
 * - 3 chains
 * - 8 protocol combinations
 * - 2 active states
 * - 6 reputation scores
 * = 3 * 8 * 2 * 6 = 288 agents
 */
export function generateDiverseAgentPool(): AgentSummary[] {
  const agents: AgentSummary[] = [];
  let id = 1;

  for (const chainId of CHAINS) {
    for (const proto of PROTOCOL_CONFIGS) {
      for (const active of [true, false]) {
        for (const repScore of REPUTATION_SCORES) {
          agents.push(
            createMockAgentSummary({
              id: `${chainId}:${id}`,
              chainId,
              tokenId: String(id),
              name: `Test Agent ${id}`,
              description: `Test agent on chain ${chainId} with rep ${repScore}`,
              active,
              reputationScore: repScore,
              reputationCount: 10,
              hasMcp: proto.hasMcp,
              hasA2a: proto.hasA2a,
              x402support: proto.x402support,
              walletAddress: `0x${id.toString().padStart(40, '0')}`,
            }),
          );
          id++;
        }
      }
    }
  }

  return agents;
}

/**
 * Apply filters to agent pool
 */
export function applyFilters(agents: AgentSummary[], filters: ParsedFilters): AgentSummary[] {
  let result = [...agents];

  // Text query filter (simple substring match for mock)
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
      // OR mode: at least one filter must match
      result = result.filter((a) => {
        const matches: boolean[] = [];
        if (filters.mcp === true) matches.push(a.hasMcp);
        if (filters.a2a === true) matches.push(a.hasA2a);
        if (filters.x402 === true) matches.push(a.x402support);
        return matches.length === 0 || matches.some((m) => m);
      });
    } else {
      // AND mode: all filters must match
      if (filters.mcp === true) result = result.filter((a) => a.hasMcp);
      if (filters.mcp === false) result = result.filter((a) => !a.hasMcp);
      if (filters.a2a === true) result = result.filter((a) => a.hasA2a);
      if (filters.a2a === false) result = result.filter((a) => !a.hasA2a);
      if (filters.x402 === true) result = result.filter((a) => a.x402support);
      if (filters.x402 === false) result = result.filter((a) => !a.x402support);
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
    result = result.filter((a) => (a.reputationScore ?? 0) >= filters.minRep!);
  }
  if (filters.maxRep !== undefined && filters.maxRep < 100) {
    result = result.filter((a) => (a.reputationScore ?? 100) <= filters.maxRep!);
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
          cmp = (a.reputationScore ?? 0) - (b.reputationScore ?? 0);
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
 * Parse filters from URL search params (GET /api/agents)
 */
export function parseUrlFilters(searchParams: URLSearchParams): ParsedFilters {
  const filters: ParsedFilters = {};

  const q = searchParams.get('q');
  if (q) filters.query = q;

  const mcp = searchParams.get('mcp');
  if (mcp) filters.mcp = mcp === 'true';

  const a2a = searchParams.get('a2a');
  if (a2a) filters.a2a = a2a === 'true';

  const x402 = searchParams.get('x402');
  if (x402) filters.x402 = x402 === 'true';

  const active = searchParams.get('active');
  if (active) filters.active = active === 'true';

  const chains = searchParams.get('chains');
  if (chains) {
    filters.chainIds = chains.split(',').map(Number).filter(Boolean);
  }

  const minRep = searchParams.get('minRep');
  if (minRep) filters.minRep = Number.parseInt(minRep, 10);

  const maxRep = searchParams.get('maxRep');
  if (maxRep) filters.maxRep = Number.parseInt(maxRep, 10);

  const filterMode = searchParams.get('filterMode');
  if (filterMode === 'OR') filters.filterMode = 'OR';

  const sort = searchParams.get('sort');
  if (sort) filters.sort = sort;

  const order = searchParams.get('order');
  if (order === 'asc' || order === 'desc') filters.order = order;

  const limit = searchParams.get('limit');
  if (limit) filters.limit = Number.parseInt(limit, 10);

  return filters;
}

/**
 * Parse filters from POST body (POST /api/search)
 */
export function parseBodyFilters(body: Record<string, unknown>): ParsedFilters {
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
 * Create a mock response object
 */
function mockResponse(agents: AgentSummary[], query?: string) {
  return {
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        success: true,
        data: agents,
        meta: {
          total: agents.length,
          hasMore: false,
          query,
        },
      }),
  };
}

/**
 * Creates a stateful mock backend that applies actual filtering logic
 */
export function createSmartBackendMock() {
  // Pre-generate diverse agent pool
  const agentPool = generateDiverseAgentPool();

  return {
    /**
     * The mock fetch handler
     */
    handler: async (
      url: string,
      options?: RequestInit,
    ): Promise<ReturnType<typeof mockResponse>> => {
      const isSearch = url.includes('/api/search');
      const isAgentsList = url.includes('/api/agents');

      if (isSearch && options?.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const filters = parseBodyFilters(body);
        const filtered = applyFilters(agentPool, filters);
        return mockResponse(filtered, filters.query);
      }

      if (isAgentsList) {
        const urlObj = new URL(url, 'http://localhost');
        const filters = parseUrlFilters(urlObj.searchParams);
        const filtered = applyFilters(agentPool, filters);
        return mockResponse(filtered);
      }

      // Default: return empty
      return mockResponse([]);
    },

    /**
     * Access to the agent pool for assertions
     */
    agentPool,

    /**
     * Get expected count for a filter configuration
     */
    getExpectedCount(filters: ParsedFilters): number {
      return applyFilters(agentPool, filters).length;
    },
  };
}

/**
 * Type for the smart backend mock
 */
export type SmartBackendMock = ReturnType<typeof createSmartBackendMock>;
