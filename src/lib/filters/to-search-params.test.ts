import { describe, expect, it } from 'vitest';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { toSearchParams } from './to-search-params';

const createDefaultFilters = (overrides: Partial<SearchFiltersState> = {}): SearchFiltersState => ({
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND',
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
  // Gap 1: Trust Score & Version Filters
  minTrustScore: 0,
  maxTrustScore: 100,
  // Gap 3: Curation Filters
  isCurated: false,
  curatedBy: '',
  // Gap 5: Endpoint Filters
  hasEmail: false,
  hasOasfEndpoint: false,
  // Gap 6: Reachability Filters
  hasRecentReachability: false,
  ...overrides,
});

describe('toSearchParams', () => {
  describe('query handling', () => {
    it('sets query when provided', () => {
      const result = toSearchParams('test query', createDefaultFilters(), 20, 0);
      expect(result.q).toBe('test query');
    });

    it('trims whitespace from query', () => {
      const result = toSearchParams('  test query  ', createDefaultFilters(), 20, 0);
      expect(result.q).toBe('test query');
    });

    it('does not set query for empty string', () => {
      const result = toSearchParams('', createDefaultFilters(), 20, 0);
      expect(result.q).toBeUndefined();
    });

    it('does not set query for whitespace only', () => {
      const result = toSearchParams('   ', createDefaultFilters(), 20, 0);
      expect(result.q).toBeUndefined();
    });
  });

  describe('status and showAllAgents', () => {
    it('defaults to active=true when no status filter', () => {
      const result = toSearchParams('', createDefaultFilters(), 20, 0);
      expect(result.active).toBe(true);
      expect(result.hasRegistrationFile).toBeUndefined();
    });

    it('sets active=true when status is active', () => {
      const result = toSearchParams('', createDefaultFilters({ status: ['active'] }), 20, 0);
      expect(result.active).toBe(true);
    });

    it('sets active=false when status is inactive', () => {
      const result = toSearchParams('', createDefaultFilters({ status: ['inactive'] }), 20, 0);
      expect(result.active).toBe(false);
    });

    it('does not set active when both status filters selected', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ status: ['active', 'inactive'] }),
        20,
        0,
      );
      // When both are selected, no active filter is applied
      expect(result.active).toBeUndefined();
    });

    it('sets hasRegistrationFile=false when showAllAgents is true', () => {
      const result = toSearchParams('', createDefaultFilters({ showAllAgents: true }), 20, 0);
      expect(result.hasRegistrationFile).toBe(false);
      // Should NOT set default active=true
      expect(result.active).toBeUndefined();
    });

    it('respects explicit status when showAllAgents is true', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ showAllAgents: true, status: ['active'] }),
        20,
        0,
      );
      expect(result.hasRegistrationFile).toBe(false);
      expect(result.active).toBe(true);
    });
  });

  describe('protocol filters', () => {
    it('sets mcp=true when mcp is selected', () => {
      const result = toSearchParams('', createDefaultFilters({ protocols: ['mcp'] }), 20, 0);
      expect(result.mcp).toBe(true);
    });

    it('sets a2a=true when a2a is selected', () => {
      const result = toSearchParams('', createDefaultFilters({ protocols: ['a2a'] }), 20, 0);
      expect(result.a2a).toBe(true);
    });

    it('sets x402=true when x402 is selected', () => {
      const result = toSearchParams('', createDefaultFilters({ protocols: ['x402'] }), 20, 0);
      expect(result.x402).toBe(true);
    });

    it('sets multiple protocol filters', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ protocols: ['mcp', 'a2a', 'x402'] }),
        20,
        0,
      );
      expect(result.mcp).toBe(true);
      expect(result.a2a).toBe(true);
      expect(result.x402).toBe(true);
    });

    it('does not set protocol filters when empty', () => {
      const result = toSearchParams('', createDefaultFilters(), 20, 0);
      expect(result.mcp).toBeUndefined();
      expect(result.a2a).toBeUndefined();
      expect(result.x402).toBeUndefined();
    });
  });

  describe('chain filters', () => {
    it('sets chains when provided', () => {
      const result = toSearchParams('', createDefaultFilters({ chains: [11155111, 84532] }), 20, 0);
      expect(result.chains).toEqual([11155111, 84532]);
    });

    it('does not set chains when empty', () => {
      const result = toSearchParams('', createDefaultFilters(), 20, 0);
      expect(result.chains).toBeUndefined();
    });
  });

  describe('reputation filters', () => {
    it('sets minRep when greater than 0', () => {
      const result = toSearchParams('', createDefaultFilters({ minReputation: 20 }), 20, 0);
      expect(result.minRep).toBe(20);
    });

    it('does not set minRep when 0', () => {
      const result = toSearchParams('', createDefaultFilters({ minReputation: 0 }), 20, 0);
      expect(result.minRep).toBeUndefined();
    });

    it('sets maxRep when less than 100', () => {
      const result = toSearchParams('', createDefaultFilters({ maxReputation: 80 }), 20, 0);
      expect(result.maxRep).toBe(80);
    });

    it('does not set maxRep when 100', () => {
      const result = toSearchParams('', createDefaultFilters({ maxReputation: 100 }), 20, 0);
      expect(result.maxRep).toBeUndefined();
    });

    it('sets both reputation bounds', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ minReputation: 20, maxReputation: 80 }),
        20,
        0,
      );
      expect(result.minRep).toBe(20);
      expect(result.maxRep).toBe(80);
    });
  });

  describe('taxonomy filters', () => {
    it('sets skills when provided', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ skills: ['nlp', 'code_generation'] }),
        20,
        0,
      );
      expect(result.skills).toEqual(['nlp', 'code_generation']);
    });

    it('does not set skills when empty', () => {
      const result = toSearchParams('', createDefaultFilters(), 20, 0);
      expect(result.skills).toBeUndefined();
    });

    it('sets domains when provided', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ domains: ['development', 'finance'] }),
        20,
        0,
      );
      expect(result.domains).toEqual(['development', 'finance']);
    });

    it('does not set domains when empty', () => {
      const result = toSearchParams('', createDefaultFilters(), 20, 0);
      expect(result.domains).toBeUndefined();
    });
  });

  describe('filter mode', () => {
    it('sets filterMode when OR', () => {
      const result = toSearchParams('', createDefaultFilters({ filterMode: 'OR' }), 20, 0);
      expect(result.filterMode).toBe('OR');
    });

    it('does not set filterMode when AND (default)', () => {
      const result = toSearchParams('', createDefaultFilters({ filterMode: 'AND' }), 20, 0);
      expect(result.filterMode).toBeUndefined();
    });
  });

  describe('trust score filters', () => {
    it('sets trustScoreMin when greater than 0', () => {
      const result = toSearchParams('', createDefaultFilters({ minTrustScore: 20 }), 20, 0);
      expect(result.trustScoreMin).toBe(20);
    });

    it('does not set trustScoreMin when 0', () => {
      const result = toSearchParams('', createDefaultFilters({ minTrustScore: 0 }), 20, 0);
      expect(result.trustScoreMin).toBeUndefined();
    });

    it('sets trustScoreMax when less than 100', () => {
      const result = toSearchParams('', createDefaultFilters({ maxTrustScore: 80 }), 20, 0);
      expect(result.trustScoreMax).toBe(80);
    });

    it('does not set trustScoreMax when 100', () => {
      const result = toSearchParams('', createDefaultFilters({ maxTrustScore: 100 }), 20, 0);
      expect(result.trustScoreMax).toBeUndefined();
    });
  });

  describe('curation filters', () => {
    it('sets isCurated when true', () => {
      const result = toSearchParams('', createDefaultFilters({ isCurated: true }), 20, 0);
      expect(result.isCurated).toBe(true);
    });

    it('does not set isCurated when false', () => {
      const result = toSearchParams('', createDefaultFilters({ isCurated: false }), 20, 0);
      expect(result.isCurated).toBeUndefined();
    });

    it('sets curatedBy when provided', () => {
      const result = toSearchParams('', createDefaultFilters({ curatedBy: '0x123' }), 20, 0);
      expect(result.curatedBy).toBe('0x123');
    });

    it('does not set curatedBy when empty', () => {
      const result = toSearchParams('', createDefaultFilters({ curatedBy: '' }), 20, 0);
      expect(result.curatedBy).toBeUndefined();
    });
  });

  describe('endpoint filters', () => {
    it('sets hasEmail when true', () => {
      const result = toSearchParams('', createDefaultFilters({ hasEmail: true }), 20, 0);
      expect(result.hasEmail).toBe(true);
    });

    it('does not set hasEmail when false', () => {
      const result = toSearchParams('', createDefaultFilters({ hasEmail: false }), 20, 0);
      expect(result.hasEmail).toBeUndefined();
    });

    it('sets hasOasfEndpoint when true', () => {
      const result = toSearchParams('', createDefaultFilters({ hasOasfEndpoint: true }), 20, 0);
      expect(result.hasOasfEndpoint).toBe(true);
    });

    it('does not set hasOasfEndpoint when false', () => {
      const result = toSearchParams('', createDefaultFilters({ hasOasfEndpoint: false }), 20, 0);
      expect(result.hasOasfEndpoint).toBeUndefined();
    });
  });

  describe('reachability filters', () => {
    it('sets hasRecentReachability when true', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ hasRecentReachability: true }),
        20,
        0,
      );
      expect(result.hasRecentReachability).toBe(true);
    });

    it('does not set hasRecentReachability when false', () => {
      const result = toSearchParams(
        '',
        createDefaultFilters({ hasRecentReachability: false }),
        20,
        0,
      );
      expect(result.hasRecentReachability).toBeUndefined();
    });
  });

  describe('pagination', () => {
    it('sets limit', () => {
      const result = toSearchParams('', createDefaultFilters(), 50, 0);
      expect(result.limit).toBe(50);
    });

    it('sets cursor when provided via options object', () => {
      const result = toSearchParams({
        query: '',
        filters: createDefaultFilters(),
        limit: 20,
        cursor: 'next-page-cursor-token',
      });
      expect(result.cursor).toBe('next-page-cursor-token');
    });

    it('does not set cursor when not provided', () => {
      const result = toSearchParams({
        query: '',
        filters: createDefaultFilters(),
        limit: 20,
      });
      expect(result.cursor).toBeUndefined();
    });

    it('ignores legacy offset parameter (deprecated)', () => {
      // Legacy signature with offset as 4th param is deprecated
      // Offset is no longer converted to cursor - use cursor directly
      const result = toSearchParams('', createDefaultFilters(), 20, 40);
      expect(result.cursor).toBeUndefined(); // Offset is now ignored
      expect(result.limit).toBe(20);
    });
  });

  describe('complex combinations', () => {
    it('handles multiple filters together', () => {
      const result = toSearchParams({
        query: 'trading agent',
        filters: createDefaultFilters({
          status: ['active'],
          protocols: ['mcp', 'a2a'],
          chains: [11155111],
          minReputation: 50,
          maxReputation: 90,
          skills: ['trading'],
          domains: ['finance'],
          filterMode: 'OR',
        }),
        limit: 10,
        cursor: 'cursor-for-page-2',
      });

      expect(result.q).toBe('trading agent');
      expect(result.active).toBe(true);
      expect(result.mcp).toBe(true);
      expect(result.a2a).toBe(true);
      expect(result.x402).toBeUndefined();
      expect(result.chains).toEqual([11155111]);
      expect(result.minRep).toBe(50);
      expect(result.maxRep).toBe(90);
      expect(result.skills).toEqual(['trading']);
      expect(result.domains).toEqual(['finance']);
      expect(result.filterMode).toBe('OR');
      expect(result.limit).toBe(10);
      expect(result.cursor).toBe('cursor-for-page-2');
    });
  });
});
