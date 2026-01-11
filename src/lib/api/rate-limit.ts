/**
 * Rate limiting utilities for API routes
 *
 * Implements a sliding window rate limiter with configurable limits per endpoint type.
 * For production at scale, consider using Redis-based rate limiting (e.g., @upstash/ratelimit).
 */

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** Total limit */
  limit: number;
  /** Unix timestamp when the limit resets */
  reset: number;
}

/**
 * Request record for sliding window
 */
interface RequestRecord {
  count: number;
  windowStart: number;
}

/**
 * In-memory store for rate limit tracking
 * Note: This is cleared on server restart and doesn't work across multiple instances.
 * For production, use Redis or another distributed store.
 */
const requestStore = new Map<string, RequestRecord>();

/**
 * Cleanup old entries periodically (every 5 minutes)
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  const cutoff = now - windowMs;

  for (const [key, record] of requestStore) {
    if (record.windowStart < cutoff) {
      requestStore.delete(key);
    }
  }
}

/**
 * Default rate limit configurations by endpoint type
 */
export const RATE_LIMIT_CONFIGS = {
  /** Standard GET endpoints - 100 requests per minute */
  default: { limit: 100, windowMs: 60 * 1000 },
  /** Search endpoints (expensive) - 30 requests per minute */
  search: { limit: 30, windowMs: 60 * 1000 },
  /** Streaming endpoints - 10 concurrent connections per minute */
  stream: { limit: 10, windowMs: 60 * 1000 },
  /** POST endpoints (mutations) - 20 requests per minute */
  mutation: { limit: 20, windowMs: 60 * 1000 },
  /** Heavy computation endpoints - 5 requests per minute */
  heavy: { limit: 5, windowMs: 60 * 1000 },
} as const;

/**
 * Get the appropriate rate limit config for a path
 */
export function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Search and compose are expensive operations
  if (pathname.includes('/api/search') || pathname.includes('/api/compose')) {
    return RATE_LIMIT_CONFIGS.search;
  }

  // Streaming endpoints need stricter limits
  if (pathname.includes('/stream') || pathname.includes('/events')) {
    return RATE_LIMIT_CONFIGS.stream;
  }

  // Evaluation endpoints are compute-heavy
  if (pathname.includes('/evaluations') && !pathname.endsWith('/evaluations')) {
    return RATE_LIMIT_CONFIGS.heavy;
  }

  return RATE_LIMIT_CONFIGS.default;
}

/**
 * Check rate limit for a given identifier (usually IP address)
 *
 * Uses sliding window algorithm:
 * - Tracks request count within a time window
 * - Window slides forward with each new request
 * - Old requests outside the window are not counted
 *
 * @param identifier - Unique identifier for the client (usually IP)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 *
 * @example
 * ```typescript
 * const result = checkRateLimit('192.168.1.1', { limit: 100, windowMs: 60000 });
 * if (!result.success) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.default,
): RateLimitResult {
  const now = Date.now();
  const { limit, windowMs } = config;

  // Cleanup expired entries periodically
  cleanupExpiredEntries(windowMs);

  const record = requestStore.get(identifier);

  // First request from this identifier
  if (!record) {
    requestStore.set(identifier, { count: 1, windowStart: now });
    return {
      success: true,
      remaining: limit - 1,
      limit,
      reset: now + windowMs,
    };
  }

  // Check if window has expired
  if (now - record.windowStart >= windowMs) {
    // Reset window
    requestStore.set(identifier, { count: 1, windowStart: now });
    return {
      success: true,
      remaining: limit - 1,
      limit,
      reset: now + windowMs,
    };
  }

  // Within current window
  const newCount = record.count + 1;

  if (newCount > limit) {
    // Rate limited
    return {
      success: false,
      remaining: 0,
      limit,
      reset: record.windowStart + windowMs,
    };
  }

  // Update count
  record.count = newCount;

  return {
    success: true,
    remaining: limit - newCount,
    limit,
    reset: record.windowStart + windowMs,
  };
}

/**
 * Generate rate limit headers for response
 *
 * @param result - Rate limit check result
 * @returns Headers object with rate limit information
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.reset / 1000).toString(),
  };
}

/**
 * Create a rate limited response (429 Too Many Requests)
 *
 * @param result - Rate limit check result
 * @returns Response object with rate limit headers
 */
export function rateLimitedResponse(result: RateLimitResult): Response {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMITED',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        ...getRateLimitHeaders(result),
      },
    },
  );
}
