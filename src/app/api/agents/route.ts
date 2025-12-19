/**
 * API route for searching agents
 * GET /api/agents?q=query&mcp=true&a2a=true&x402=true&active=true&filterMode=OR&limit=20&cursor=abc&chains=11155111,84532&domains=technology,finance&skills=code_generation&minRep=50&maxRep=100&sort=reputation&order=desc
 *
 * Supported filters:
 * - q: Text search
 * - mcp: MCP support filter
 * - a2a: A2A support filter
 * - x402: X.402 support filter
 * - active: Active status filter
 * - filterMode: AND or OR for combining protocol filters (default: AND)
 * - domains: OASF domains filter (comma-separated)
 * - skills: OASF skills filter (comma-separated)
 * - minRep: Minimum reputation score (0-100)
 * - maxRep: Maximum reputation score (0-100)
 * - sort: Sort field (relevance, name, createdAt, reputation)
 * - order: Sort order (asc, desc)
 * - limit: Number of results (max 100)
 * - cursor: Pagination cursor (JSON format: {"_global_offset": N})
 * - chains: Comma-separated chain IDs (e.g., chains=11155111,84532)
 * - chainId: Single chain filter (deprecated, use chains instead)
 */

import { backendFetch } from '@/lib/api/backend';
import { mapAgentsToSummaries } from '@/lib/api/mappers';
import {
  handleRouteError,
  parseIntArrayParam,
  parseIntParam,
  successResponse,
} from '@/lib/api/route-helpers';
import type { BackendAgent } from '@/types/backend';

interface BackendAgentsResponse {
  data: BackendAgent[];
  meta: {
    total: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build backend query params (only supported params)
    const backendParams: Record<string, string | number | boolean | undefined> = {};

    // Text search (q parameter per OpenAPI spec)
    const q = searchParams.get('q');
    if (q) backendParams.q = q;

    // Protocol filters
    const mcp = searchParams.get('mcp');
    if (mcp === 'true') backendParams.mcp = true;
    if (mcp === 'false') backendParams.mcp = false;

    const a2a = searchParams.get('a2a');
    if (a2a === 'true') backendParams.a2a = true;
    if (a2a === 'false') backendParams.a2a = false;

    const x402 = searchParams.get('x402');
    if (x402 === 'true') backendParams.x402 = true;
    if (x402 === 'false') backendParams.x402 = false;

    // Filter mode (AND or OR) for combining protocol filters
    const filterMode = searchParams.get('filterMode');
    if (filterMode === 'OR' || filterMode === 'AND') {
      backendParams.filterMode = filterMode;
    }

    // Active status filter
    const active = searchParams.get('active');
    if (active === 'true') backendParams.active = true;
    if (active === 'false') backendParams.active = false;

    // OASF domains filter (comma-separated)
    const domains = searchParams.get('domains');
    if (domains) backendParams.domains = domains;

    // hasRegistrationFile filter (default is true in backend, pass false to show all)
    const hasRegistrationFile = searchParams.get('hasRegistrationFile');
    if (hasRegistrationFile === 'false') {
      backendParams.hasRegistrationFile = false;
    }

    // Pagination
    const limit = parseIntParam(searchParams.get('limit'));
    if (limit && limit > 0 && limit <= 100) {
      backendParams.limit = limit;
    }

    const cursor = searchParams.get('cursor');
    if (cursor) backendParams.cursor = cursor;

    // Chain filter - backend supports CSV format: chains=11155111,84532
    const chains = parseIntArrayParam(searchParams.get('chains'));
    if (chains.length > 0) {
      backendParams.chains = chains.join(',');
    }

    // Direct chainId param (backwards compatibility)
    const chainId = parseIntParam(searchParams.get('chainId'));
    if (chainId && !backendParams.chains) {
      backendParams.chains = String(chainId);
    }

    // Reputation range filters
    const minRep = parseIntParam(searchParams.get('minRep'));
    if (minRep !== undefined) backendParams.minRep = minRep;

    const maxRep = parseIntParam(searchParams.get('maxRep'));
    if (maxRep !== undefined) backendParams.maxRep = maxRep;

    // OASF skills filter (comma-separated)
    const skills = searchParams.get('skills');
    if (skills) backendParams.skills = skills;

    // Sorting options
    const sort = searchParams.get('sort');
    if (sort) backendParams.sort = sort;

    const order = searchParams.get('order');
    if (order) backendParams.order = order;

    // Execute search via backend
    const response = await backendFetch<BackendAgentsResponse['data']>('/api/v1/agents', {
      params: backendParams,
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    // Map backend agents to frontend format
    const agents = mapAgentsToSummaries(response.data);

    return successResponse(agents, {
      meta: response.meta,
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to search agents', 'SEARCH_ERROR');
  }
}
