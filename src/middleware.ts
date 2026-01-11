/**
 * Next.js Middleware for API security
 *
 * Applies rate limiting to all API routes to prevent abuse.
 * Rate limits are configured per endpoint type in src/lib/api/rate-limit.ts
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  checkRateLimit,
  getRateLimitConfig,
  getRateLimitHeaders,
  rateLimitedResponse,
} from '@/lib/api/rate-limit';

/**
 * Get client identifier for rate limiting
 * Uses X-Forwarded-For header (from proxies/load balancers) or falls back to other identifiers
 */
function getClientIdentifier(request: NextRequest): string {
  // Try X-Forwarded-For first (set by proxies/load balancers like Vercel, Cloudflare)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP in the chain (original client)
    return forwardedFor.split(',')[0].trim();
  }

  // Try X-Real-IP (nginx and some CDNs)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Try CF-Connecting-IP (Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // Fall back to a combination of user-agent and accept-language as identifier
  // This isn't ideal but provides some level of differentiation
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  const acceptLang = request.headers.get('accept-language') ?? 'unknown';
  return `anon:${simpleHash(userAgent + acceptLang)}`;
}

/**
 * Simple hash function for fallback identifier
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get client identifier and rate limit config for this endpoint
  const clientId = getClientIdentifier(request);
  const config = getRateLimitConfig(pathname);

  // Create a unique key combining client ID and endpoint pattern
  // This allows different limits for different endpoint types
  const rateLimitKey = `${clientId}:${getEndpointPattern(pathname)}`;

  // Check rate limit
  const result = checkRateLimit(rateLimitKey, config);

  // If rate limited, return 429 response
  if (!result.success) {
    return rateLimitedResponse(result);
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  const headers = getRateLimitHeaders(result);

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Get endpoint pattern for rate limiting grouping
 * Groups similar endpoints together (e.g., all /api/agents/[id] routes)
 */
function getEndpointPattern(pathname: string): string {
  // Search endpoints
  if (pathname.startsWith('/api/search')) return 'search';

  // Compose endpoints
  if (pathname.startsWith('/api/compose')) return 'compose';

  // Streaming/events endpoints
  if (pathname.includes('/stream') || pathname === '/api/events') return 'stream';

  // Evaluation endpoints
  if (pathname.includes('/evaluations')) return 'evaluations';

  // Agent detail endpoints (with dynamic ID)
  if (pathname.match(/^\/api\/agents\/[^/]+/)) return 'agent-detail';

  // Intent endpoints
  if (pathname.startsWith('/api/intents')) return 'intents';

  // Default: use the base path
  return pathname.split('/').slice(0, 3).join('/');
}

/**
 * Middleware config - only run on API routes
 */
export const config = {
  matcher: '/api/:path*',
};
