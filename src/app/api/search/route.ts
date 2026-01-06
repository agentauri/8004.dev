/**
 * API route for semantic search
 * POST /api/search
 *
 * Body (per OpenAPI spec):
 * {
 *   query: string;
 *   limit?: number;
 *   cursor?: string;
 *   minScore?: number;
 *   sort?: 'relevance' | 'name' | 'createdAt' | 'reputation';
 *   order?: 'asc' | 'desc';
 *   filters?: {
 *     chainIds?: number[];
 *     active?: boolean;
 *     mcp?: boolean;
 *     a2a?: boolean;
 *     x402?: boolean;
 *     skills?: string[];
 *     domains?: string[];
 *     filterMode?: 'AND' | 'OR';
 *   };
 * }
 */

import { backendFetch, shouldUseMockData } from '@/lib/api/backend';
import { mapSearchResultsToSummaries } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import { validateLimit, validateSearchQuery } from '@/lib/api/validation';
import type { BackendSearchResult } from '@/types/backend';

/**
 * Generate mock search results for development/testing when backend is not available
 */
function getMockSearchResults(query: string, limit: number): BackendSearchResult[] {
  const allResults: BackendSearchResult[] = [
    {
      id: '11155111:1',
      chainId: 11155111,
      tokenId: '1',
      name: 'CodeReview Pro',
      description:
        'An AI-powered code review assistant that helps developers improve code quality.',
      active: true,
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      supportedTrust: [],
      searchScore: 0.95,
    },
    {
      id: '84532:2',
      chainId: 84532,
      tokenId: '2',
      name: 'Trading Assistant',
      description: 'Automated trading helper for cryptocurrency markets.',
      active: true,
      hasMcp: true,
      hasA2a: false,
      x402Support: true,
      supportedTrust: [],
      searchScore: 0.88,
    },
    {
      id: '11155111:3',
      chainId: 11155111,
      tokenId: '3',
      name: 'Data Analyzer',
      description: 'Data analysis specialist for business intelligence.',
      active: true,
      hasMcp: false,
      hasA2a: true,
      x402Support: false,
      supportedTrust: [],
      searchScore: 0.82,
    },
    {
      id: '80002:4',
      chainId: 80002,
      tokenId: '4',
      name: 'Content Writer',
      description: 'AI content creator for marketing and blogs.',
      active: true,
      hasMcp: true,
      hasA2a: true,
      x402Support: true,
      supportedTrust: [],
      searchScore: 0.78,
    },
  ];

  // Simple query filtering (case-insensitive partial match)
  const lowerQuery = query.toLowerCase();
  const filtered = allResults.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) || r.description.toLowerCase().includes(lowerQuery),
  );

  // Return filtered results or all if no matches
  const results = filtered.length > 0 ? filtered : allResults;
  return results.slice(0, limit);
}

interface SearchRequestBody {
  query: string;
  limit?: number;
  cursor?: string;
  minScore?: number;
  sort?: 'relevance' | 'name' | 'createdAt' | 'reputation';
  order?: 'asc' | 'desc';
  filters?: {
    chainIds?: number[];
    active?: boolean;
    mcp?: boolean;
    a2a?: boolean;
    x402?: boolean;
    skills?: string[];
    domains?: string[];
    filterMode?: 'AND' | 'OR';
  };
}

interface BackendSearchResponse {
  data: BackendSearchResult[];
  meta: {
    query: string;
    total: number;
    limit: number;
  };
}

interface SearchRequest {
  query: string;
  limit: number;
  cursor?: string;
  minScore?: number;
  sort?: SearchRequestBody['sort'];
  order?: SearchRequestBody['order'];
  filters?: SearchRequestBody['filters'];
}

/**
 * Execute semantic search against backend.
 * Caching is disabled because POST body parameters (sort, filters, etc.)
 * are not included in Next.js cache key - only URL is used.
 */
async function executeSemanticSearch(searchRequest: SearchRequest) {
  // Note: Don't use `next: { revalidate }` for POST requests
  // Next.js uses URL as cache key, ignoring the request body.
  // This causes all POST requests to return the same cached response
  // regardless of sort, filters, and other body parameters.
  // TanStack Query handles client-side caching instead.
  const response = await backendFetch<BackendSearchResponse['data']>('/api/v1/search', {
    method: 'POST',
    body: searchRequest,
    cache: 'no-store',
  });
  return { data: response.data, meta: response.meta };
}

export async function POST(request: Request) {
  try {
    const body: SearchRequestBody = await request.json();

    // Validate and sanitize query with strict validation
    const queryValidation = validateSearchQuery(body.query);
    if (!queryValidation.valid) {
      return errorResponse(queryValidation.error, queryValidation.code, 400);
    }

    // Build backend request per OpenAPI spec
    const searchRequest: SearchRequest = {
      query: queryValidation.query,
      limit: validateLimit(body.limit, 100, 20),
      minScore: body.minScore,
      filters: body.filters,
    };

    // Add cursor for pagination (backend uses cursor-based pagination)
    if (body.cursor) {
      searchRequest.cursor = body.cursor;
    }

    // Add sorting parameters
    if (body.sort) {
      searchRequest.sort = body.sort;
    }
    if (body.order) {
      searchRequest.order = body.order;
    }

    // Execute search with fallback to mock data
    let data: BackendSearchResult[] = [];
    let meta: { query: string; total: number; limit: number } = {
      query: searchRequest.query,
      total: 0,
      limit: searchRequest.limit,
    };

    try {
      const response = await executeSemanticSearch(searchRequest);
      data = response.data;
      meta = {
        query: response.meta?.query ?? searchRequest.query,
        total: response.meta?.total ?? data.length,
        limit: response.meta?.limit ?? searchRequest.limit,
      };
    } catch (error) {
      // Fallback to mock data if backend not configured or endpoint not available
      if (shouldUseMockData(error)) {
        console.warn('Backend /api/v1/search not available, using mock data');
        data = getMockSearchResults(searchRequest.query, searchRequest.limit);
        meta = {
          query: searchRequest.query,
          total: data.length,
          limit: searchRequest.limit,
        };
      } else {
        throw error;
      }
    }

    // Map results to frontend format
    const agents = mapSearchResultsToSummaries(data);

    return successResponse(agents, { meta });
  } catch (error) {
    return handleRouteError(error, 'Failed to search agents', 'SEARCH_ERROR');
  }
}
