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

import { backendFetch } from '@/lib/api/backend';
import { mapSearchResultsToSummaries } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendSearchResult } from '@/types/backend';

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

    // Validate query
    if (!body.query || typeof body.query !== 'string') {
      return errorResponse('Query is required', 'VALIDATION_ERROR', 400);
    }

    if (body.query.length < 1 || body.query.length > 1000) {
      return errorResponse('Query must be between 1 and 1000 characters', 'VALIDATION_ERROR', 400);
    }

    // Build backend request per OpenAPI spec
    const searchRequest: SearchRequest = {
      query: body.query,
      limit: body.limit ?? 20,
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

    // Execute search with Next.js fetch caching (60s revalidation)
    const response = await executeSemanticSearch(searchRequest);

    // Map results to frontend format
    const agents = mapSearchResultsToSummaries(response.data);

    return successResponse(agents, { meta: response.meta });
  } catch (error) {
    return handleRouteError(error, 'Failed to search agents', 'SEARCH_ERROR');
  }
}
