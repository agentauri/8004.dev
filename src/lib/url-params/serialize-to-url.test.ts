import { describe, expect, it } from 'vitest';
import type { UrlSearchState } from './parse-url-params';
import { serializeToUrl } from './serialize-to-url';

const createDefaultState = (): UrlSearchState => ({
  query: '',
  page: 1,
  pageSize: 20,
  sortBy: 'relevance',
  sortOrder: 'desc',
  filters: {
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
    erc8004Version: '',
    mcpVersion: '',
    a2aVersion: '',
    // Gap 3: Curation Filters
    isCurated: false,
    curatedBy: '',
    // Gap 5: Endpoint Filters
    hasEmail: false,
    hasOasfEndpoint: false,
    // Gap 6: Reachability Filters
    hasRecentReachability: false,
  },
});

describe('serializeToUrl', () => {
  describe('query serialization', () => {
    it('includes query when not empty', () => {
      const state = { ...createDefaultState(), query: 'test' };
      const result = serializeToUrl(state);
      expect(result.get('q')).toBe('test');
    });

    it('trims query whitespace', () => {
      const state = { ...createDefaultState(), query: '  test  ' };
      const result = serializeToUrl(state);
      expect(result.get('q')).toBe('test');
    });

    it('excludes empty query', () => {
      const state = { ...createDefaultState(), query: '' };
      const result = serializeToUrl(state);
      expect(result.has('q')).toBe(false);
    });
  });

  describe('page serialization (deprecated)', () => {
    // Page parameter is deprecated - cursor-based pagination is managed in React state
    // Page is never serialized to URL
    it('never includes page (deprecated - use cursor)', () => {
      const state = { ...createDefaultState(), page: 3 };
      const result = serializeToUrl(state);
      expect(result.has('page')).toBe(false); // Page is never serialized
    });

    it('excludes page when 1', () => {
      const state = { ...createDefaultState(), page: 1 };
      const result = serializeToUrl(state);
      expect(result.has('page')).toBe(false);
    });
  });

  describe('pageSize serialization', () => {
    it('includes limit when not default', () => {
      const state = { ...createDefaultState(), pageSize: 50 };
      const result = serializeToUrl(state);
      expect(result.get('limit')).toBe('50');
    });

    it('excludes limit when default (20)', () => {
      const state = { ...createDefaultState(), pageSize: 20 };
      const result = serializeToUrl(state);
      expect(result.has('limit')).toBe(false);
    });
  });

  describe('status serialization', () => {
    it('sets active=true for active status', () => {
      const state = createDefaultState();
      state.filters.status = ['active'];
      const result = serializeToUrl(state);
      expect(result.get('active')).toBe('true');
    });

    it('sets active=false for inactive status', () => {
      const state = createDefaultState();
      state.filters.status = ['inactive'];
      const result = serializeToUrl(state);
      expect(result.get('active')).toBe('false');
    });

    it('excludes active when no status', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('active')).toBe(false);
    });
  });

  describe('protocol serialization', () => {
    it('sets mcp=true when mcp selected', () => {
      const state = createDefaultState();
      state.filters.protocols = ['mcp'];
      const result = serializeToUrl(state);
      expect(result.get('mcp')).toBe('true');
    });

    it('sets a2a=true when a2a selected', () => {
      const state = createDefaultState();
      state.filters.protocols = ['a2a'];
      const result = serializeToUrl(state);
      expect(result.get('a2a')).toBe('true');
    });

    it('sets x402=true when x402 selected', () => {
      const state = createDefaultState();
      state.filters.protocols = ['x402'];
      const result = serializeToUrl(state);
      expect(result.get('x402')).toBe('true');
    });

    it('sets all protocols when multiple selected', () => {
      const state = createDefaultState();
      state.filters.protocols = ['mcp', 'a2a', 'x402'];
      const result = serializeToUrl(state);
      expect(result.get('mcp')).toBe('true');
      expect(result.get('a2a')).toBe('true');
      expect(result.get('x402')).toBe('true');
    });
  });

  describe('chains serialization', () => {
    it('includes comma-separated chains', () => {
      const state = createDefaultState();
      state.filters.chains = [11155111, 84532];
      const result = serializeToUrl(state);
      expect(result.get('chains')).toBe('11155111,84532');
    });

    it('excludes chains when empty', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('chains')).toBe(false);
    });
  });

  describe('reputation serialization', () => {
    it('includes minRep when > 0', () => {
      const state = createDefaultState();
      state.filters.minReputation = 20;
      const result = serializeToUrl(state);
      expect(result.get('minRep')).toBe('20');
    });

    it('includes maxRep when < 100', () => {
      const state = createDefaultState();
      state.filters.maxReputation = 80;
      const result = serializeToUrl(state);
      expect(result.get('maxRep')).toBe('80');
    });

    it('excludes default reputation values', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('minRep')).toBe(false);
      expect(result.has('maxRep')).toBe(false);
    });
  });

  describe('filterMode serialization', () => {
    it('includes filterMode when OR', () => {
      const state = createDefaultState();
      state.filters.filterMode = 'OR';
      const result = serializeToUrl(state);
      expect(result.get('filterMode')).toBe('OR');
    });

    it('excludes filterMode when AND (default)', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('filterMode')).toBe(false);
    });
  });

  describe('skills serialization', () => {
    it('includes comma-separated skills', () => {
      const state = createDefaultState();
      state.filters.skills = ['nlp', 'vision'];
      const result = serializeToUrl(state);
      expect(result.get('skills')).toBe('nlp,vision');
    });

    it('excludes skills when empty', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('skills')).toBe(false);
    });
  });

  describe('domains serialization', () => {
    it('includes comma-separated domains', () => {
      const state = createDefaultState();
      state.filters.domains = ['tech', 'finance'];
      const result = serializeToUrl(state);
      expect(result.get('domains')).toBe('tech,finance');
    });

    it('excludes domains when empty', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('domains')).toBe(false);
    });
  });

  describe('showAllAgents serialization', () => {
    it('includes showAll when true', () => {
      const state = createDefaultState();
      state.filters.showAllAgents = true;
      const result = serializeToUrl(state);
      expect(result.get('showAll')).toBe('true');
    });

    it('excludes showAll when false', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('showAll')).toBe(false);
    });
  });

  describe('sorting serialization', () => {
    it('includes sort when not relevance', () => {
      const state = { ...createDefaultState(), sortBy: 'name' as const };
      const result = serializeToUrl(state);
      expect(result.get('sort')).toBe('name');
    });

    it('excludes sort when relevance', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('sort')).toBe(false);
    });

    it('includes order when not desc', () => {
      const state = { ...createDefaultState(), sortOrder: 'asc' as const };
      const result = serializeToUrl(state);
      expect(result.get('order')).toBe('asc');
    });

    it('excludes order when desc', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.has('order')).toBe(false);
    });
  });

  describe('default state', () => {
    it('produces empty params for default state', () => {
      const state = createDefaultState();
      const result = serializeToUrl(state);
      expect(result.toString()).toBe('');
    });
  });
});
