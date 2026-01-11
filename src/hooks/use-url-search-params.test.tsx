import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUrlSearchParams } from './use-url-search-params';

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockPathname = '/explore';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('useUrlSearchParams', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state parsing', () => {
    it('returns default values with empty search params', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      expect(result.current.query).toBe('');
      expect(result.current.page).toBe(1);
      expect(result.current.pageSize).toBe(20);
      expect(result.current.sortBy).toBe('relevance');
      expect(result.current.sortOrder).toBe('desc');
      expect(result.current.offset).toBe(0);
    });

    it('parses query from URL', () => {
      mockSearchParams = new URLSearchParams('q=test+search');
      const { result } = renderHook(() => useUrlSearchParams());
      expect(result.current.query).toBe('test search');
    });

    it('always returns page 1 (deprecated pagination)', () => {
      mockSearchParams = new URLSearchParams('page=3');
      const { result } = renderHook(() => useUrlSearchParams());
      // page is deprecated and always returns 1 - cursor pagination is used instead
      expect(result.current.page).toBe(1);
    });

    it('parses pageSize from URL', () => {
      mockSearchParams = new URLSearchParams('limit=50');
      const { result } = renderHook(() => useUrlSearchParams());
      expect(result.current.pageSize).toBe(50);
    });

    it('parses filters from URL', () => {
      mockSearchParams = new URLSearchParams('active=true&mcp=true&a2a=true&chains=11155111,84532');
      const { result } = renderHook(() => useUrlSearchParams());

      expect(result.current.filters.status).toContain('active');
      expect(result.current.filters.protocols).toContain('mcp');
      expect(result.current.filters.protocols).toContain('a2a');
      expect(result.current.filters.chains).toContain(11155111);
      expect(result.current.filters.chains).toContain(84532);
    });

    it('parses sorting from URL', () => {
      mockSearchParams = new URLSearchParams('sort=name&order=asc');
      const { result } = renderHook(() => useUrlSearchParams());

      expect(result.current.sortBy).toBe('name');
      expect(result.current.sortOrder).toBe('asc');
    });
  });

  describe('offset calculation (deprecated)', () => {
    it('always returns 0 for page 1 (offset deprecated)', () => {
      mockSearchParams = new URLSearchParams('page=1&limit=20');
      const { result } = renderHook(() => useUrlSearchParams());
      // offset is deprecated and always returns 0 - cursor pagination is used instead
      expect(result.current.offset).toBe(0);
    });

    it('always returns 0 regardless of page param (deprecated)', () => {
      mockSearchParams = new URLSearchParams('page=2&limit=20');
      const { result } = renderHook(() => useUrlSearchParams());
      // offset is deprecated and always returns 0
      expect(result.current.offset).toBe(0);
    });

    it('always returns 0 regardless of page size (deprecated)', () => {
      mockSearchParams = new URLSearchParams('page=3&limit=50');
      const { result } = renderHook(() => useUrlSearchParams());
      // offset is deprecated and always returns 0
      expect(result.current.offset).toBe(0);
    });
  });

  describe('setQuery', () => {
    it('updates query and resets page to 1', () => {
      mockSearchParams = new URLSearchParams('q=old&page=5');
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setQuery('new query');
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('q=new+query'),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.not.stringContaining('page=5'),
        expect.any(Object),
      );
    });

    it('handles empty query', () => {
      mockSearchParams = new URLSearchParams('q=test');
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setQuery('');
      });

      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('setPage', () => {
    it('is a no-op for backwards compatibility (deprecated)', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setPage(5);
      });

      // setPage is deprecated and does nothing - cursor pagination is used instead
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('ignores negative page values (deprecated no-op)', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setPage(-5);
      });

      // setPage is deprecated and does nothing
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('setPageSize', () => {
    it('updates page size and resets page to 1', () => {
      mockSearchParams = new URLSearchParams('limit=20&page=3');
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setPageSize(50);
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('limit=50'),
        expect.any(Object),
      );
    });
  });

  describe('setFilters', () => {
    it('updates filters and resets page to 1', () => {
      mockSearchParams = new URLSearchParams('page=5');
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setFilters({
          status: ['active'],
          protocols: ['mcp', 'a2a'],
          chains: [11155111],
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
        });
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('active=true'),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('mcp=true'),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('a2a=true'),
        expect.any(Object),
      );
    });

    it('handles reputation range filters', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setFilters({
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 20,
          maxReputation: 80,
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
        });
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('minRep=20'),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('maxRep=80'),
        expect.any(Object),
      );
    });

    it('handles skills and domains filters', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setFilters({
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: ['nlp', 'vision'],
          domains: ['tech'],
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
        });
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('skills=nlp%2Cvision'),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('domains=tech'),
        expect.any(Object),
      );
    });
  });

  describe('setSort', () => {
    it('updates sorting and resets page to 1', () => {
      mockSearchParams = new URLSearchParams('page=3');
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setSort('name', 'asc');
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('sort=name'),
        expect.any(Object),
      );
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('order=asc'),
        expect.any(Object),
      );
    });

    it('handles different sort fields', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setSort('reputation', 'desc');
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('sort=reputation'),
        expect.any(Object),
      );
      // Note: order=desc is the default, so it may not appear in URL when using default value
    });
  });

  describe('scroll behavior', () => {
    it('pushes with scroll: false', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setQuery('test');
      });

      expect(mockPush).toHaveBeenCalledWith(expect.any(String), { scroll: false });
    });
  });

  describe('URL structure', () => {
    it('constructs URL without pathname when no params', () => {
      mockSearchParams = new URLSearchParams('q=test');
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setFilters({
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
        });
      });

      // Should still include pathname
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
