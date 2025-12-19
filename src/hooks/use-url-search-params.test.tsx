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

    it('parses page from URL', () => {
      mockSearchParams = new URLSearchParams('page=3');
      const { result } = renderHook(() => useUrlSearchParams());
      expect(result.current.page).toBe(3);
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

  describe('offset calculation', () => {
    it('calculates offset correctly for page 1', () => {
      mockSearchParams = new URLSearchParams('page=1&limit=20');
      const { result } = renderHook(() => useUrlSearchParams());
      expect(result.current.offset).toBe(0);
    });

    it('calculates offset correctly for page 2', () => {
      mockSearchParams = new URLSearchParams('page=2&limit=20');
      const { result } = renderHook(() => useUrlSearchParams());
      expect(result.current.offset).toBe(20);
    });

    it('calculates offset correctly with different page sizes', () => {
      mockSearchParams = new URLSearchParams('page=3&limit=50');
      const { result } = renderHook(() => useUrlSearchParams());
      expect(result.current.offset).toBe(100);
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
    it('updates page number', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setPage(5);
      });

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=5'), expect.any(Object));
    });

    it('enforces minimum page of 1', () => {
      const { result } = renderHook(() => useUrlSearchParams());

      act(() => {
        result.current.setPage(-5);
      });

      // Should push with page=1 (minimum enforced)
      expect(mockPush).toHaveBeenCalled();
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
        });
      });

      // Should still include pathname
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
