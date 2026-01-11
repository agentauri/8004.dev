/**
 * Tests for rate limiting utilities
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRateLimitConfig,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
  rateLimitedResponse,
} from './rate-limit';

describe('rate-limit', () => {
  beforeEach(() => {
    // Reset the module to clear the in-memory store between tests
    vi.resetModules();
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', async () => {
      // Re-import to get fresh state
      const { checkRateLimit: check } = await import('./rate-limit');
      const uniqueId = `test-${Date.now()}-${Math.random()}`;

      const result = check(uniqueId, { limit: 5, windowMs: 60000 });

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.limit).toBe(5);
    });

    it('should decrement remaining count on subsequent requests', async () => {
      const { checkRateLimit: check } = await import('./rate-limit');
      const uniqueId = `test-${Date.now()}-${Math.random()}`;
      const config = { limit: 5, windowMs: 60000 };

      check(uniqueId, config); // 4 remaining
      check(uniqueId, config); // 3 remaining
      const result = check(uniqueId, config); // 2 remaining

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should block requests when limit is exceeded', async () => {
      const { checkRateLimit: check } = await import('./rate-limit');
      const uniqueId = `test-${Date.now()}-${Math.random()}`;
      const config = { limit: 3, windowMs: 60000 };

      check(uniqueId, config); // 2 remaining
      check(uniqueId, config); // 1 remaining
      check(uniqueId, config); // 0 remaining
      const result = check(uniqueId, config); // Should be blocked

      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', async () => {
      const { checkRateLimit: check } = await import('./rate-limit');
      const uniqueId = `test-${Date.now()}-${Math.random()}`;
      const config = { limit: 2, windowMs: 100 }; // 100ms window

      check(uniqueId, config); // 1 remaining
      check(uniqueId, config); // 0 remaining

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      const result = check(uniqueId, config); // Should be reset

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(1);
    });

    it('should track different identifiers separately', async () => {
      const { checkRateLimit: check } = await import('./rate-limit');
      const id1 = `test-1-${Date.now()}-${Math.random()}`;
      const id2 = `test-2-${Date.now()}-${Math.random()}`;
      const config = { limit: 2, windowMs: 60000 };

      // Exhaust limit for id1
      check(id1, config);
      check(id1, config);
      const result1 = check(id1, config);

      // id2 should still have full limit
      const result2 = check(id2, config);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(1);
    });
  });

  describe('getRateLimitConfig', () => {
    it('should return search config for search endpoints', () => {
      expect(getRateLimitConfig('/api/search')).toEqual(RATE_LIMIT_CONFIGS.search);
      expect(getRateLimitConfig('/api/search/stream')).toEqual(RATE_LIMIT_CONFIGS.search);
    });

    it('should return search config for compose endpoints', () => {
      expect(getRateLimitConfig('/api/compose')).toEqual(RATE_LIMIT_CONFIGS.search);
    });

    it('should return stream config for streaming endpoints', () => {
      expect(getRateLimitConfig('/api/events')).toEqual(RATE_LIMIT_CONFIGS.stream);
    });

    it('should return default config for standard endpoints', () => {
      expect(getRateLimitConfig('/api/agents')).toEqual(RATE_LIMIT_CONFIGS.default);
      expect(getRateLimitConfig('/api/chains')).toEqual(RATE_LIMIT_CONFIGS.default);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const result = {
        success: true,
        remaining: 50,
        limit: 100,
        reset: 1700000000000,
      };

      const headers = getRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('50');
      expect(headers['X-RateLimit-Reset']).toBe('1700000000');
    });
  });

  describe('rateLimitedResponse', () => {
    it('should return 429 response', () => {
      const result = {
        success: false,
        remaining: 0,
        limit: 100,
        reset: Date.now() + 30000,
      };

      const response = rateLimitedResponse(result);

      expect(response.status).toBe(429);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('X-RateLimit-Limit')).toBe('100');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    });

    it('should include retry-after header', () => {
      const result = {
        success: false,
        remaining: 0,
        limit: 100,
        reset: Date.now() + 30000,
      };

      const response = rateLimitedResponse(result);

      expect(response.headers.get('Retry-After')).toBeTruthy();
      const retryAfter = Number.parseInt(response.headers.get('Retry-After') ?? '0', 10);
      expect(retryAfter).toBeGreaterThan(0);
      expect(retryAfter).toBeLessThanOrEqual(30);
    });
  });
});
