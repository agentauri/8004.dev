import { describe, expect, it } from 'vitest';
import { parseUrlParams } from './parse-url-params';

describe('parseUrlParams', () => {
  describe('query parsing', () => {
    it('parses query parameter', () => {
      const params = new URLSearchParams('q=test');
      const result = parseUrlParams(params);
      expect(result.query).toBe('test');
    });

    it('returns empty string when no query', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.query).toBe('');
    });
  });

  describe('page parsing (deprecated)', () => {
    // Page parameter is deprecated - cursor-based pagination is managed in React state
    // Page always returns 1 for backwards compatibility
    it('ignores page parameter (always returns 1)', () => {
      const params = new URLSearchParams('page=3');
      const result = parseUrlParams(params);
      expect(result.page).toBe(1); // Page is deprecated, always 1
    });

    it('defaults to page 1', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.page).toBe(1);
    });

    it('returns 1 for any page value (deprecated)', () => {
      const params = new URLSearchParams('page=-5');
      const result = parseUrlParams(params);
      expect(result.page).toBe(1);
    });

    it('returns 1 for invalid page values', () => {
      const params = new URLSearchParams('page=invalid');
      const result = parseUrlParams(params);
      expect(result.page).toBe(1);
    });
  });

  describe('pageSize parsing', () => {
    it('parses valid limit values', () => {
      const params = new URLSearchParams('limit=50');
      const result = parseUrlParams(params);
      expect(result.pageSize).toBe(50);
    });

    it('defaults to 20 when not specified', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.pageSize).toBe(20);
    });

    it('defaults to 20 for invalid limit', () => {
      const params = new URLSearchParams('limit=15');
      const result = parseUrlParams(params);
      expect(result.pageSize).toBe(20);
    });
  });

  describe('status parsing', () => {
    it('parses active=true as active status', () => {
      const params = new URLSearchParams('active=true');
      const result = parseUrlParams(params);
      expect(result.filters.status).toEqual(['active']);
    });

    it('parses active=false as inactive status', () => {
      const params = new URLSearchParams('active=false');
      const result = parseUrlParams(params);
      expect(result.filters.status).toEqual(['inactive']);
    });

    it('returns empty array when no active param', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.filters.status).toEqual([]);
    });
  });

  describe('protocol parsing', () => {
    it('parses mcp=true', () => {
      const params = new URLSearchParams('mcp=true');
      const result = parseUrlParams(params);
      expect(result.filters.protocols).toContain('mcp');
    });

    it('parses a2a=true', () => {
      const params = new URLSearchParams('a2a=true');
      const result = parseUrlParams(params);
      expect(result.filters.protocols).toContain('a2a');
    });

    it('parses x402=true', () => {
      const params = new URLSearchParams('x402=true');
      const result = parseUrlParams(params);
      expect(result.filters.protocols).toContain('x402');
    });

    it('parses multiple protocols', () => {
      const params = new URLSearchParams('mcp=true&a2a=true');
      const result = parseUrlParams(params);
      expect(result.filters.protocols).toEqual(['mcp', 'a2a']);
    });
  });

  describe('chains parsing', () => {
    it('parses comma-separated chain IDs', () => {
      const params = new URLSearchParams('chains=11155111,84532');
      const result = parseUrlParams(params);
      expect(result.filters.chains).toEqual([11155111, 84532]);
    });

    it('filters invalid chain IDs', () => {
      const params = new URLSearchParams('chains=11155111,999999');
      const result = parseUrlParams(params);
      expect(result.filters.chains).toEqual([11155111]);
    });

    it('returns empty array when no chains', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.filters.chains).toEqual([]);
    });
  });

  describe('reputation parsing', () => {
    it('parses min and max reputation', () => {
      const params = new URLSearchParams('minRep=20&maxRep=80');
      const result = parseUrlParams(params);
      expect(result.filters.minReputation).toBe(20);
      expect(result.filters.maxReputation).toBe(80);
    });

    it('clamps reputation to 0-100', () => {
      const params = new URLSearchParams('minRep=-10&maxRep=150');
      const result = parseUrlParams(params);
      expect(result.filters.minReputation).toBe(0);
      expect(result.filters.maxReputation).toBe(100);
    });

    it('defaults to 0 and 100', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.filters.minReputation).toBe(0);
      expect(result.filters.maxReputation).toBe(100);
    });
  });

  describe('filterMode parsing', () => {
    it('parses OR mode', () => {
      const params = new URLSearchParams('filterMode=OR');
      const result = parseUrlParams(params);
      expect(result.filters.filterMode).toBe('OR');
    });

    it('defaults to AND mode', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.filters.filterMode).toBe('AND');
    });
  });

  describe('skills parsing', () => {
    it('parses comma-separated skills', () => {
      const params = new URLSearchParams('skills=nlp,vision');
      const result = parseUrlParams(params);
      expect(result.filters.skills).toEqual(['nlp', 'vision']);
    });

    it('filters empty strings', () => {
      const params = new URLSearchParams('skills=nlp,,vision');
      const result = parseUrlParams(params);
      expect(result.filters.skills).toEqual(['nlp', 'vision']);
    });
  });

  describe('domains parsing', () => {
    it('parses comma-separated domains', () => {
      const params = new URLSearchParams('domains=tech,finance');
      const result = parseUrlParams(params);
      expect(result.filters.domains).toEqual(['tech', 'finance']);
    });
  });

  describe('showAllAgents parsing', () => {
    it('parses showAll=true', () => {
      const params = new URLSearchParams('showAll=true');
      const result = parseUrlParams(params);
      expect(result.filters.showAllAgents).toBe(true);
    });

    it('defaults to false', () => {
      const params = new URLSearchParams();
      const result = parseUrlParams(params);
      expect(result.filters.showAllAgents).toBe(false);
    });
  });

  describe('sorting parsing', () => {
    it('parses valid sort field', () => {
      const params = new URLSearchParams('sort=name');
      const result = parseUrlParams(params);
      expect(result.sortBy).toBe('name');
    });

    it('defaults to relevance for invalid sort', () => {
      const params = new URLSearchParams('sort=invalid');
      const result = parseUrlParams(params);
      expect(result.sortBy).toBe('relevance');
    });

    it('parses sort order', () => {
      const params = new URLSearchParams('order=asc');
      const result = parseUrlParams(params);
      expect(result.sortOrder).toBe('asc');
    });

    it('defaults to desc for invalid order', () => {
      const params = new URLSearchParams('order=invalid');
      const result = parseUrlParams(params);
      expect(result.sortOrder).toBe('desc');
    });
  });
});
