/**
 * API Route Helpers
 *
 * Shared utilities for Next.js API routes to reduce duplication
 * in error handling and response formatting.
 */

import { NextResponse } from 'next/server';
import { BackendError } from './backend';
import {
  checkRateLimit,
  getRateLimitConfig,
  getRateLimitHeaders,
  type RateLimitConfig,
  rateLimitedResponse,
} from './rate-limit';

/**
 * Standard error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
}

/**
 * Standard success response structure
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Handles errors in API routes consistently.
 * Detects SyntaxError (invalid JSON), BackendError (backend API errors),
 * and falls back to a generic error response.
 *
 * @example
 * ```typescript
 * try {
 *   const data = await fetchData();
 *   return successResponse(data);
 * } catch (error) {
 *   return handleRouteError(error, 'Failed to fetch data', 'FETCH_ERROR');
 * }
 * ```
 */
export function handleRouteError(
  error: unknown,
  fallbackMessage: string,
  fallbackCode: string,
): NextResponse<ApiErrorResponse> {
  console.error('API error:', error);

  // Handle JSON parse errors
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false as const,
        error: 'Invalid JSON body',
        code: 'PARSE_ERROR',
      },
      { status: 400 },
    );
  }

  // Handle backend API errors
  if (error instanceof BackendError) {
    return NextResponse.json(
      {
        success: false as const,
        error: error.message,
        code: error.code,
      },
      { status: error.status || 500 },
    );
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : fallbackMessage;

  return NextResponse.json(
    {
      success: false as const,
      error: message,
      code: fallbackCode,
    },
    { status: 500 },
  );
}

/**
 * Response options for success responses
 */
export interface SuccessResponseOptions {
  meta?: Record<string, unknown>;
  headers?: HeadersInit;
}

/**
 * Creates a success response with optional metadata and headers.
 *
 * @example
 * ```typescript
 * return successResponse(agents, { meta: { total: 100 } });
 * return successResponse(agents, { headers: { 'Cache-Control': 's-maxage=60' } });
 * ```
 */
export function successResponse<T>(
  data: T,
  options?: SuccessResponseOptions,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(options?.meta && { meta: options.meta }),
    },
    options?.headers ? { headers: options.headers } : undefined,
  );
}

/**
 * Creates an error response with custom status code.
 *
 * @example
 * ```typescript
 * return errorResponse('Agent not found', 'NOT_FOUND', 404);
 * ```
 */
export function errorResponse(
  message: string,
  code: string,
  status = 500,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error: message,
      code,
    },
    { status },
  );
}

/**
 * Parses an integer parameter from URL search params.
 * Returns undefined if the param is not present or not a valid integer.
 *
 * @example
 * ```typescript
 * const limit = parseIntParam(searchParams.get('limit'));
 * ```
 */
export function parseIntParam(value: string | null): number | undefined {
  if (!value) return undefined;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? undefined : num;
}

/**
 * Parses a comma-separated list of integers from URL search params.
 * Returns empty array if param is not present.
 *
 * @example
 * ```typescript
 * const chainIds = parseIntArrayParam(searchParams.get('chainIds'));
 * ```
 */
export function parseIntArrayParam(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

/**
 * Parses a boolean parameter from URL search params.
 * Returns undefined if not present, true for 'true'/'1', false for 'false'/'0'.
 *
 * @example
 * ```typescript
 * const active = parseBoolParam(searchParams.get('active'));
 * ```
 */
export function parseBoolParam(value: string | null): boolean | undefined {
  if (!value) return undefined;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
}

/**
 * Extract client IP address from request headers.
 * Handles common proxy headers in order of preference.
 *
 * @example
 * ```typescript
 * const clientIp = getClientIp(request);
 * ```
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Check common proxy headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first (client IP)
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  // Fallback for local development
  return '127.0.0.1';
}

/**
 * Apply rate limiting to an API route.
 * Returns a Response if rate limited, null if allowed.
 *
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const rateLimitResponse = applyRateLimit(request);
 *   if (rateLimitResponse) return rateLimitResponse;
 *   // ... rest of handler
 * }
 * ```
 */
export function applyRateLimit(request: Request, config?: RateLimitConfig): Response | null {
  const clientIp = getClientIp(request);
  const pathname = new URL(request.url).pathname;
  const effectiveConfig = config ?? getRateLimitConfig(pathname);

  const result = checkRateLimit(`${clientIp}:${pathname}`, effectiveConfig);

  if (!result.success) {
    return rateLimitedResponse(result);
  }

  return null;
}

/**
 * Add rate limit headers to a NextResponse.
 *
 * @example
 * ```typescript
 * const response = successResponse(data);
 * return addRateLimitHeadersToResponse(response, request);
 * ```
 */
export function addRateLimitHeadersToResponse(
  response: NextResponse,
  request: Request,
  config?: RateLimitConfig,
): NextResponse {
  const clientIp = getClientIp(request);
  const pathname = new URL(request.url).pathname;
  const effectiveConfig = config ?? getRateLimitConfig(pathname);

  const result = checkRateLimit(`${clientIp}:${pathname}`, effectiveConfig);
  const headers = getRateLimitHeaders(result);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}
