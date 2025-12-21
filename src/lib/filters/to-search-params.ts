/**
 * Convert SearchFiltersState to SearchParams for API calls
 *
 * Extracted from explore/page.tsx for reusability and testability
 */

import type { SearchFiltersState } from '@/components/organisms/search-filters';
import type { SearchParams } from '@/types/search';

/**
 * Options for converting filters to search params
 */
export interface ToSearchParamsOptions {
  /** Search query string */
  query: string;
  /** Current filter state from UI */
  filters: SearchFiltersState;
  /** Number of results per page */
  limit: number;
  /** Cursor for pagination (from previous response's nextCursor) */
  cursor?: string;
}

/**
 * Convert SearchFiltersState to SearchParams for the backend API
 *
 * Default behavior: Show only active agents with registration file
 * When showAllAgents is true: Show all agents including inactive and without metadata
 *
 * Note: Sorting is handled client-side, not sent to API.
 * This improves caching - the same data can be sorted multiple ways without refetching.
 *
 * @param options - Search options including query, filters, limit, and cursor
 * @returns SearchParams object for API call
 *
 * @example
 * ```tsx
 * // First page
 * const params = toSearchParams({
 *   query: 'trading agent',
 *   filters: { protocols: ['mcp'], chains: [11155111], ... },
 *   limit: 20,
 * });
 *
 * // Next page - use cursor from previous response
 * const nextParams = toSearchParams({
 *   query: 'trading agent',
 *   filters: { protocols: ['mcp'], chains: [11155111], ... },
 *   limit: 20,
 *   cursor: previousResponse.nextCursor,
 * });
 * ```
 */
export function toSearchParams(options: ToSearchParamsOptions): SearchParams;
/**
 * @deprecated Use options object instead. This signature will be removed.
 */
export function toSearchParams(
  query: string,
  filters: SearchFiltersState,
  limit: number,
  cursorOrOffset?: string | number,
): SearchParams;
export function toSearchParams(
  queryOrOptions: string | ToSearchParamsOptions,
  filters?: SearchFiltersState,
  limit?: number,
  cursorOrOffset?: string | number,
): SearchParams {
  // Handle both signatures for backwards compatibility
  let options: ToSearchParamsOptions;
  if (typeof queryOrOptions === 'object') {
    options = queryOrOptions;
  } else {
    // Legacy signature - convert offset to undefined (no cursor on first page)
    const cursor = typeof cursorOrOffset === 'string' ? cursorOrOffset : undefined;
    options = {
      query: queryOrOptions,
      filters: filters!,
      limit: limit!,
      cursor,
    };
  }

  const params: SearchParams = {};

  // Handle search query
  const trimmedQuery = options.query.trim();
  if (trimmedQuery) {
    params.q = trimmedQuery;
  }

  // Handle showAllAgents toggle vs default filtering
  applyStatusFilters(params, options.filters);

  // Apply protocol filters
  applyProtocolFilters(params, options.filters);

  // Apply chain filters
  applyChainFilters(params, options.filters);

  // Apply reputation filters
  applyReputationFilters(params, options.filters);

  // Apply taxonomy filters (skills and domains)
  applyTaxonomyFilters(params, options.filters);

  // Apply filter mode (only send OR, since AND is the default)
  if (options.filters.filterMode === 'OR') {
    params.filterMode = 'OR';
  }

  // Apply pagination
  params.limit = options.limit;
  if (options.cursor) {
    params.cursor = options.cursor;
  }

  return params;
}

/**
 * Apply status and showAllAgents logic to params
 */
function applyStatusFilters(params: SearchParams, filters: SearchFiltersState): void {
  if (filters.showAllAgents) {
    // Show all agents: pass hasRegistrationFile=false to include agents without metadata
    params.hasRegistrationFile = false;
    // Don't apply default active filter, but still respect explicit status selection
    if (filters.status.length === 1) {
      params.active = filters.status[0] === 'active';
    }
  } else {
    // Default: only active agents with registration file
    // Backend returns agents with registration file by default, so we only need active=true
    if (filters.status.length === 0) {
      // No explicit status filter, apply default: only active agents
      params.active = true;
    } else if (filters.status.length === 1) {
      params.active = filters.status[0] === 'active';
    }
    // Don't set hasRegistrationFile - backend defaults to true
  }
}

/**
 * Apply protocol filter flags (mcp, a2a, x402)
 */
function applyProtocolFilters(params: SearchParams, filters: SearchFiltersState): void {
  if (filters.protocols.includes('mcp')) {
    params.mcp = true;
  }
  if (filters.protocols.includes('a2a')) {
    params.a2a = true;
  }
  if (filters.protocols.includes('x402')) {
    params.x402 = true;
  }
}

/**
 * Apply chain ID filters
 */
function applyChainFilters(params: SearchParams, filters: SearchFiltersState): void {
  if (filters.chains.length > 0) {
    params.chains = filters.chains;
  }
}

/**
 * Apply reputation range filters
 */
function applyReputationFilters(params: SearchParams, filters: SearchFiltersState): void {
  if (filters.minReputation > 0) {
    params.minRep = filters.minReputation;
  }
  if (filters.maxReputation < 100) {
    params.maxRep = filters.maxReputation;
  }
}

/**
 * Apply OASF taxonomy filters (skills and domains)
 */
function applyTaxonomyFilters(params: SearchParams, filters: SearchFiltersState): void {
  if (filters.skills.length > 0) {
    params.skills = filters.skills;
  }
  if (filters.domains.length > 0) {
    params.domains = filters.domains;
  }
}

