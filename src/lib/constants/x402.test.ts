import { describe, expect, it } from 'vitest';
import {
  ENDPOINT_COSTS,
  ENDPOINT_COSTS_MICRO,
  formatUSDC,
  getEndpointCost,
  isPaidEndpoint,
  PAID_ENDPOINTS,
  parseUSDC,
  X402_CONFIG,
} from './x402';

describe('x402 constants', () => {
  describe('X402_CONFIG', () => {
    it('has correct network identifier', () => {
      expect(X402_CONFIG.network).toBe('eip155:8453');
    });

    it('has correct chain ID for Base mainnet', () => {
      expect(X402_CONFIG.chainId).toBe(8453);
    });

    it('has correct USDC asset identifier', () => {
      expect(X402_CONFIG.asset).toBe(
        'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      );
    });

    it('has correct USDC address', () => {
      expect(X402_CONFIG.usdcAddress).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
    });

    it('has correct payTo address', () => {
      expect(X402_CONFIG.payTo).toBe('0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D');
    });

    it('has correct USDC decimals', () => {
      expect(X402_CONFIG.usdcDecimals).toBe(6);
    });
  });

  describe('PAID_ENDPOINTS', () => {
    it('contains compose endpoint', () => {
      expect(PAID_ENDPOINTS).toContain('/api/compose');
    });

    it('contains evaluations endpoint', () => {
      expect(PAID_ENDPOINTS).toContain('/api/evaluations');
    });

    it('contains evaluate endpoint', () => {
      expect(PAID_ENDPOINTS).toContain('/api/evaluate');
    });

    it('has exactly 3 endpoints', () => {
      expect(PAID_ENDPOINTS).toHaveLength(3);
    });
  });

  describe('ENDPOINT_COSTS', () => {
    it('has correct cost for compose', () => {
      expect(ENDPOINT_COSTS['/api/compose']).toBe(0.05);
    });

    it('has correct cost for evaluations', () => {
      expect(ENDPOINT_COSTS['/api/evaluations']).toBe(0.05);
    });

    it('has correct cost for evaluate', () => {
      expect(ENDPOINT_COSTS['/api/evaluate']).toBe(0.05);
    });
  });

  describe('ENDPOINT_COSTS_MICRO', () => {
    it('has correct micro-units for compose (50000 = $0.05)', () => {
      expect(ENDPOINT_COSTS_MICRO['/api/compose']).toBe(50000n);
    });

    it('has correct micro-units for evaluations', () => {
      expect(ENDPOINT_COSTS_MICRO['/api/evaluations']).toBe(50000n);
    });

    it('has correct micro-units for evaluate', () => {
      expect(ENDPOINT_COSTS_MICRO['/api/evaluate']).toBe(50000n);
    });
  });

  describe('isPaidEndpoint', () => {
    it('returns true for /api/compose', () => {
      expect(isPaidEndpoint('/api/compose')).toBe(true);
    });

    it('returns true for /api/compose with path', () => {
      expect(isPaidEndpoint('/api/compose/123')).toBe(true);
    });

    it('returns true for /api/evaluations', () => {
      expect(isPaidEndpoint('/api/evaluations')).toBe(true);
    });

    it('returns true for /api/evaluate', () => {
      expect(isPaidEndpoint('/api/evaluate')).toBe(true);
    });

    it('returns true for /api/evaluate with agent ID', () => {
      expect(isPaidEndpoint('/api/evaluate/11155111:123')).toBe(true);
    });

    it('returns false for /api/agents', () => {
      expect(isPaidEndpoint('/api/agents')).toBe(false);
    });

    it('returns false for /api/search', () => {
      expect(isPaidEndpoint('/api/search')).toBe(false);
    });

    it('returns false for /', () => {
      expect(isPaidEndpoint('/')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isPaidEndpoint('')).toBe(false);
    });
  });

  describe('getEndpointCost', () => {
    it('returns 0.05 for /api/compose', () => {
      expect(getEndpointCost('/api/compose')).toBe(0.05);
    });

    it('returns 0.05 for /api/evaluations', () => {
      expect(getEndpointCost('/api/evaluations')).toBe(0.05);
    });

    it('returns 0.05 for /api/evaluate', () => {
      expect(getEndpointCost('/api/evaluate')).toBe(0.05);
    });

    it('returns 0.05 for /api/evaluate with path', () => {
      expect(getEndpointCost('/api/evaluate/11155111:123')).toBe(0.05);
    });

    it('returns undefined for non-paid endpoint', () => {
      expect(getEndpointCost('/api/agents')).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      expect(getEndpointCost('')).toBeUndefined();
    });
  });

  describe('formatUSDC', () => {
    it('formats 50000 micro-units as $0.05', () => {
      expect(formatUSDC(50000)).toBe('$0.05');
    });

    it('formats bigint 50000n as $0.05', () => {
      expect(formatUSDC(50000n)).toBe('$0.05');
    });

    it('formats 1000000 micro-units as $1.00', () => {
      expect(formatUSDC(1000000)).toBe('$1.00');
    });

    it('formats 0 as $0.00', () => {
      expect(formatUSDC(0)).toBe('$0.00');
    });

    it('formats 100 micro-units as $0.00', () => {
      expect(formatUSDC(100)).toBe('$0.00');
    });

    it('formats 1234567 micro-units as $1.23', () => {
      expect(formatUSDC(1234567)).toBe('$1.23');
    });
  });

  describe('parseUSDC', () => {
    it('parses $0.05 to 50000n', () => {
      expect(parseUSDC(0.05)).toBe(50000n);
    });

    it('parses $1.00 to 1000000n', () => {
      expect(parseUSDC(1.0)).toBe(1000000n);
    });

    it('parses $0 to 0n', () => {
      expect(parseUSDC(0)).toBe(0n);
    });

    it('parses $0.01 to 10000n', () => {
      expect(parseUSDC(0.01)).toBe(10000n);
    });

    it('parses $10.50 to 10500000n', () => {
      expect(parseUSDC(10.5)).toBe(10500000n);
    });
  });
});
