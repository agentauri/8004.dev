/**
 * Backend API Client
 *
 * Helper for making authenticated requests to the 8004.dev backend API.
 * This client handles authentication, error handling, and response parsing.
 *
 * IMPORTANT: This module should only be used in server-side code (API routes).
 * Never import this in client components as it exposes the API key.
 */

/**
 * Get environment variables at runtime (not at module load time)
 * This is important for testing where env vars are set after module import
 */
function getApiUrl(): string | undefined {
  return process.env.BACKEND_API_URL;
}

function getApiKey(): string | undefined {
  return process.env.BACKEND_API_KEY;
}

/**
 * Custom error class for backend API errors
 */
export class BackendError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

/**
 * Options for backend fetch requests
 */
export interface BackendFetchOptions {
  /** Query parameters to append to the URL */
  params?: Record<string, string | number | boolean | string[] | number[] | undefined>;
  /** HTTP method (defaults to GET) */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Cache mode for the request */
  cache?: RequestCache;
  /** Next.js fetch options for caching */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Backend API response wrapper
 */
export interface BackendResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    hasMore?: boolean;
    nextCursor?: string;
    query?: string;
  };
}

/**
 * Backend API error response
 */
export interface BackendErrorResponse {
  success: false;
  error: string;
  code: string;
  requestId?: string;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: BackendFetchOptions['params']): string {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new BackendError('BACKEND_API_URL is not configured', 'CONFIG_ERROR', 500);
  }

  const url = new URL(`${apiUrl}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        // Handle array parameters (e.g., chainIds[]=1&chainIds[]=2)
        value.forEach((v) => {
          url.searchParams.append(`${key}[]`, String(v));
        });
      } else {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Make an authenticated request to the backend API
 *
 * @param endpoint - API endpoint (e.g., '/api/v1/agents')
 * @param options - Request options
 * @returns Parsed response data
 * @throws BackendError if the request fails
 *
 * @example
 * ```typescript
 * // GET request with params
 * const agents = await backendFetch<AgentsResponse>('/api/v1/agents', {
 *   params: { limit: 10, active: true }
 * });
 *
 * // POST request with body
 * const results = await backendFetch<SearchResponse>('/api/v1/search', {
 *   method: 'POST',
 *   body: { query: 'AI assistant', limit: 5 }
 * });
 * ```
 */
export async function backendFetch<T>(
  endpoint: string,
  options: BackendFetchOptions = {},
): Promise<BackendResponse<T>> {
  const { params, method = 'GET', body, headers = {}, cache, next } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new BackendError('BACKEND_API_KEY is not configured', 'CONFIG_ERROR', 500);
  }

  const url = buildUrl(endpoint, params);

  const fetchOptions: RequestInit & { next?: BackendFetchOptions['next'] } = {
    method,
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (next) {
    fetchOptions.next = next;
  }

  let response: Response;

  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    // Network error or fetch failure
    throw new BackendError(
      error instanceof Error ? error.message : 'Network error',
      'NETWORK_ERROR',
      0,
    );
  }

  let data: BackendResponse<T> | BackendErrorResponse;

  try {
    data = await response.json();
  } catch {
    // Response is not valid JSON
    throw new BackendError('Invalid JSON response from backend', 'PARSE_ERROR', response.status);
  }

  if (!response.ok || !data.success) {
    const errorData = data as BackendErrorResponse;
    throw new BackendError(
      errorData.error || `Request failed (status ${response.status})`,
      errorData.code || 'REQUEST_FAILED',
      response.status,
    );
  }

  return data as BackendResponse<T>;
}

/**
 * Check if backend API is healthy
 *
 * @returns true if healthy, false otherwise
 */
export async function isBackendHealthy(): Promise<boolean> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return false;

  try {
    const response = await fetch(`${apiUrl}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache health checks
      cache: 'no-store',
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Get the configured backend API URL
 * Useful for debugging and logging
 */
export function getBackendUrl(): string | undefined {
  return getApiUrl();
}
