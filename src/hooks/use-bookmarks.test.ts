import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type BookmarkedAgent,
  MAX_BOOKMARKS,
  MAX_SAVED_SEARCHES,
  useBookmarks,
} from './use-bookmarks';

describe('useBookmarks', () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => mockLocalStorage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockLocalStorage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      delete mockLocalStorage[key];
    });

    // Clear mock storage
    for (const key of Object.keys(mockLocalStorage)) {
      delete mockLocalStorage[key];
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockAgent = (
    overrides: Partial<BookmarkedAgent> = {},
  ): Omit<BookmarkedAgent, 'bookmarkedAt'> => ({
    agentId: '11155111:123',
    name: 'Test Agent',
    chainId: 11155111,
    description: 'A test agent',
    ...overrides,
  });

  describe('bookmarks', () => {
    it('starts with empty bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarks).toEqual([]);
    });

    it('loads existing bookmarks from localStorage', () => {
      const existingBookmarks: BookmarkedAgent[] = [
        {
          agentId: '11155111:123',
          name: 'Existing Agent',
          chainId: 11155111,
          bookmarkedAt: Date.now(),
        },
      ];
      mockLocalStorage['agent-explorer-bookmarks'] = JSON.stringify(existingBookmarks);

      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].name).toBe('Existing Agent');
    });

    it('adds a bookmark', () => {
      const { result } = renderHook(() => useBookmarks());
      const agent = createMockAgent();

      act(() => {
        const added = result.current.addBookmark(agent);
        expect(added).toBe(true);
      });

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].agentId).toBe('11155111:123');
      expect(result.current.bookmarks[0].bookmarkedAt).toBeDefined();
    });

    it('does not add duplicate bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());
      const agent = createMockAgent();

      act(() => {
        result.current.addBookmark(agent);
      });

      act(() => {
        const added = result.current.addBookmark(agent);
        expect(added).toBe(false);
      });

      expect(result.current.bookmarks).toHaveLength(1);
    });

    it('removes a bookmark', () => {
      const { result } = renderHook(() => useBookmarks());
      const agent = createMockAgent();

      act(() => {
        result.current.addBookmark(agent);
      });

      expect(result.current.bookmarks).toHaveLength(1);

      act(() => {
        result.current.removeBookmark('11155111:123');
      });

      expect(result.current.bookmarks).toHaveLength(0);
    });

    it('toggles bookmark on', () => {
      const { result } = renderHook(() => useBookmarks());
      const agent = createMockAgent();

      act(() => {
        const isNowBookmarked = result.current.toggleBookmark(agent);
        expect(isNowBookmarked).toBe(true);
      });

      expect(result.current.bookmarks).toHaveLength(1);
    });

    it('toggles bookmark off', () => {
      const { result } = renderHook(() => useBookmarks());
      const agent = createMockAgent();

      act(() => {
        result.current.addBookmark(agent);
      });

      act(() => {
        const isNowBookmarked = result.current.toggleBookmark(agent);
        expect(isNowBookmarked).toBe(false);
      });

      expect(result.current.bookmarks).toHaveLength(0);
    });

    it('checks if agent is bookmarked', () => {
      const { result } = renderHook(() => useBookmarks());
      const agent = createMockAgent();

      expect(result.current.isBookmarked('11155111:123')).toBe(false);

      act(() => {
        result.current.addBookmark(agent);
      });

      expect(result.current.isBookmarked('11155111:123')).toBe(true);
    });

    it('clears all bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(createMockAgent({ agentId: '11155111:1' }));
        result.current.addBookmark(createMockAgent({ agentId: '11155111:2' }));
        result.current.addBookmark(createMockAgent({ agentId: '11155111:3' }));
      });

      expect(result.current.bookmarks).toHaveLength(3);

      act(() => {
        result.current.clearBookmarks();
      });

      expect(result.current.bookmarks).toHaveLength(0);
    });

    it('respects MAX_BOOKMARKS limit', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add max bookmarks
      act(() => {
        for (let i = 0; i < MAX_BOOKMARKS; i++) {
          result.current.addBookmark(createMockAgent({ agentId: `11155111:${i}` }));
        }
      });

      expect(result.current.bookmarks).toHaveLength(MAX_BOOKMARKS);

      // Try to add one more
      act(() => {
        const added = result.current.addBookmark(createMockAgent({ agentId: '11155111:999' }));
        expect(added).toBe(false);
      });

      expect(result.current.bookmarks).toHaveLength(MAX_BOOKMARKS);
    });

    it('filters bookmarks by chain', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(createMockAgent({ agentId: '11155111:1', chainId: 11155111 }));
        result.current.addBookmark(createMockAgent({ agentId: '84532:2', chainId: 84532 }));
        result.current.addBookmark(createMockAgent({ agentId: '11155111:3', chainId: 11155111 }));
      });

      const sepoliaBookmarks = result.current.getBookmarksByChain(11155111);
      expect(sepoliaBookmarks).toHaveLength(2);

      const baseBookmarks = result.current.getBookmarksByChain(84532);
      expect(baseBookmarks).toHaveLength(1);
    });

    it('adds new bookmarks at the beginning', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(createMockAgent({ agentId: '11155111:1', name: 'First' }));
      });

      act(() => {
        result.current.addBookmark(createMockAgent({ agentId: '11155111:2', name: 'Second' }));
      });

      expect(result.current.bookmarks[0].name).toBe('Second');
      expect(result.current.bookmarks[1].name).toBe('First');
    });
  });

  describe('saved searches', () => {
    it('starts with empty saved searches', () => {
      const { result } = renderHook(() => useBookmarks());

      expect(result.current.savedSearches).toEqual([]);
    });

    it('saves a search', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        const saved = result.current.saveSearch({
          name: 'My Search',
          query: 'trading bot',
          filters: { mcp: true, chains: [11155111] },
        });
        expect(saved).toBe(true);
      });

      expect(result.current.savedSearches).toHaveLength(1);
      expect(result.current.savedSearches[0].name).toBe('My Search');
      expect(result.current.savedSearches[0].query).toBe('trading bot');
      expect(result.current.savedSearches[0].id).toBeDefined();
      expect(result.current.savedSearches[0].savedAt).toBeDefined();
    });

    it('removes a saved search', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.saveSearch({
          name: 'Test Search',
          query: 'test',
          filters: {},
        });
      });

      const searchId = result.current.savedSearches[0].id;

      act(() => {
        result.current.removeSearch(searchId);
      });

      expect(result.current.savedSearches).toHaveLength(0);
    });

    it('clears all saved searches', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.saveSearch({ name: 'Search 1', query: 'a', filters: {} });
        result.current.saveSearch({ name: 'Search 2', query: 'b', filters: {} });
      });

      expect(result.current.savedSearches).toHaveLength(2);

      act(() => {
        result.current.clearSavedSearches();
      });

      expect(result.current.savedSearches).toHaveLength(0);
    });

    it('respects MAX_SAVED_SEARCHES limit', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add max saved searches
      act(() => {
        for (let i = 0; i < MAX_SAVED_SEARCHES; i++) {
          result.current.saveSearch({
            name: `Search ${i}`,
            query: `query ${i}`,
            filters: {},
          });
        }
      });

      expect(result.current.savedSearches).toHaveLength(MAX_SAVED_SEARCHES);

      // Try to add one more
      act(() => {
        const saved = result.current.saveSearch({
          name: 'Extra Search',
          query: 'extra',
          filters: {},
        });
        expect(saved).toBe(false);
      });

      expect(result.current.savedSearches).toHaveLength(MAX_SAVED_SEARCHES);
    });
  });

  describe('export/import', () => {
    it('exports bookmarks and saved searches as JSON', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(createMockAgent());
        result.current.saveSearch({ name: 'Test', query: 'test', filters: {} });
      });

      const exported = result.current.exportBookmarks();
      const parsed = JSON.parse(exported);

      expect(parsed.version).toBe(1);
      expect(parsed.exportedAt).toBeDefined();
      expect(parsed.bookmarks).toHaveLength(1);
      expect(parsed.savedSearches).toHaveLength(1);
    });

    it('imports bookmarks from JSON', () => {
      const { result } = renderHook(() => useBookmarks());

      const importData = JSON.stringify({
        version: 1,
        bookmarks: [
          {
            agentId: '11155111:999',
            name: 'Imported Agent',
            chainId: 11155111,
            bookmarkedAt: Date.now(),
          },
        ],
        savedSearches: [
          {
            id: 'imported-search',
            name: 'Imported Search',
            query: 'imported',
            filters: {},
            savedAt: Date.now(),
          },
        ],
      });

      act(() => {
        const { imported, errors } = result.current.importBookmarks(importData);
        expect(imported).toBe(2);
        expect(errors).toBe(0);
      });

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].name).toBe('Imported Agent');
      expect(result.current.savedSearches).toHaveLength(1);
    });

    it('skips duplicate bookmarks during import', () => {
      const { result } = renderHook(() => useBookmarks());

      // Add existing bookmark
      act(() => {
        result.current.addBookmark(createMockAgent({ agentId: '11155111:123' }));
      });

      const importData = JSON.stringify({
        bookmarks: [
          {
            agentId: '11155111:123', // Duplicate
            name: 'Duplicate',
            chainId: 11155111,
            bookmarkedAt: Date.now(),
          },
          {
            agentId: '11155111:456', // New
            name: 'New Agent',
            chainId: 11155111,
            bookmarkedAt: Date.now(),
          },
        ],
        savedSearches: [],
      });

      act(() => {
        const { imported, errors } = result.current.importBookmarks(importData);
        expect(imported).toBe(1);
        expect(errors).toBe(1);
      });

      expect(result.current.bookmarks).toHaveLength(2);
    });

    it('handles invalid JSON during import', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        const { imported, errors } = result.current.importBookmarks('invalid json');
        expect(imported).toBe(0);
        expect(errors).toBe(1);
      });
    });

    it('validates bookmark format during import', () => {
      const { result } = renderHook(() => useBookmarks());

      const importData = JSON.stringify({
        bookmarks: [
          { invalid: 'bookmark' }, // Missing required fields
          { agentId: 'missing-colon', name: 'Bad', chainId: 1, bookmarkedAt: 1 }, // Invalid agentId format
          { agentId: '11155111:1', name: 'Valid', chainId: 11155111, bookmarkedAt: 1 }, // Valid
        ],
        savedSearches: [],
      });

      act(() => {
        const { imported, errors } = result.current.importBookmarks(importData);
        expect(imported).toBe(1);
        expect(errors).toBe(2);
      });
    });

    it('respects limits during import', () => {
      const { result } = renderHook(() => useBookmarks());

      // Fill up bookmarks to near limit
      act(() => {
        for (let i = 0; i < MAX_BOOKMARKS - 1; i++) {
          result.current.addBookmark(createMockAgent({ agentId: `11155111:${i}` }));
        }
      });

      // Try to import multiple
      const importData = JSON.stringify({
        bookmarks: [
          { agentId: '84532:1', name: 'Import 1', chainId: 84532, bookmarkedAt: 1 },
          { agentId: '84532:2', name: 'Import 2', chainId: 84532, bookmarkedAt: 2 },
          { agentId: '84532:3', name: 'Import 3', chainId: 84532, bookmarkedAt: 3 },
        ],
        savedSearches: [],
      });

      act(() => {
        const { imported } = result.current.importBookmarks(importData);
        expect(imported).toBe(1); // Only 1 should fit
      });

      expect(result.current.bookmarks).toHaveLength(MAX_BOOKMARKS);
    });
  });

  describe('persistence', () => {
    it('persists bookmarks to localStorage', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(createMockAgent());
      });

      // Key is 'agent-explorer-bookmarks' (prefix 'agent-explorer' + '-' + 'bookmarks')
      expect(mockLocalStorage['agent-explorer-bookmarks']).toBeDefined();
      const stored = JSON.parse(mockLocalStorage['agent-explorer-bookmarks']);
      expect(stored).toHaveLength(1);
      expect(stored[0].agentId).toBe('11155111:123');
    });

    it('persists saved searches to localStorage', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.saveSearch({ name: 'Test', query: 'test', filters: {} });
      });

      // Key is 'agent-explorer-saved-searches' (prefix 'agent-explorer' + '-' + 'saved-searches')
      expect(mockLocalStorage['agent-explorer-saved-searches']).toBeDefined();
      const stored = JSON.parse(mockLocalStorage['agent-explorer-saved-searches']);
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Test');
    });
  });
});
