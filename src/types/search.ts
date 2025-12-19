/**
 * Search-related type definitions
 */

import type { AgentSummary } from './agent';

/**
 * Search request parameters
 */
export interface SearchParams {
  q?: string;
  chains?: number[];
  mcp?: boolean;
  a2a?: boolean;
  x402?: boolean;
  active?: boolean;
  minRep?: number;
  maxRep?: number;
  skills?: string[];
  domains?: string[];
  sort?: SearchSortField;
  order?: SearchSortOrder;
  limit?: number;
  cursor?: string;
  filterMode?: 'AND' | 'OR';
  /** Filter by registration file presence (backend default is true) */
  hasRegistrationFile?: boolean;
}

/**
 * Available sort fields
 */
export type SearchSortField = 'relevance' | 'name' | 'reputation' | 'createdAt';

/**
 * Sort order
 */
export type SearchSortOrder = 'asc' | 'desc';

/**
 * Search results response
 */
export interface SearchResult {
  agents: AgentSummary[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * Filter state for search UI
 */
export interface SearchFilters {
  chains: number[];
  mcp: boolean | null;
  a2a: boolean | null;
  x402: boolean | null;
  active: boolean | null;
  minRep: number | null;
  maxRep: number | null;
}

/**
 * API success response wrapper
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    hasMore?: boolean;
    nextCursor?: string;
  };
}

/**
 * API error response wrapper
 */
export interface ApiError {
  success: false;
  error: string;
  code: string;
}

/**
 * Combined API response type
 */
export type ApiResult<T> = ApiResponse<T> | ApiError;

/**
 * Type guard for API success response
 */
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true;
}

/**
 * Type guard for API error response
 */
export function isApiError<T>(result: ApiResult<T>): result is ApiError {
  return result.success === false;
}
