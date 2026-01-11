import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';

/**
 * A bookmarked agent entry.
 */
export interface BookmarkedAgent {
  /** Agent ID in format "chainId:tokenId" */
  agentId: string;
  /** Agent name for display without re-fetching */
  name: string;
  /** Chain ID for filtering */
  chainId: number;
  /** Optional description snippet */
  description?: string;
  /** Timestamp when bookmarked */
  bookmarkedAt: number;
}

/**
 * A saved search entry.
 */
export interface SavedSearch {
  /** Unique ID for the saved search */
  id: string;
  /** User-defined name for this search */
  name: string;
  /** Search query string */
  query: string;
  /** Serialized search filters */
  filters: SavedSearchFilters;
  /** Timestamp when saved */
  savedAt: number;
}

/**
 * Filters that can be saved with a search.
 */
export interface SavedSearchFilters {
  chains?: number[];
  mcp?: boolean;
  a2a?: boolean;
  x402?: boolean;
  active?: boolean;
  minRep?: number;
  maxRep?: number;
  skills?: string[];
  domains?: string[];
  sort?: string;
  order?: 'asc' | 'desc';
  filterMode?: 'AND' | 'OR';
}

/**
 * Storage keys for bookmarks data.
 * Note: useLocalStorage adds 'agent-explorer-' prefix automatically
 */
const STORAGE_KEYS = {
  BOOKMARKED_AGENTS: 'bookmarks',
  SAVED_SEARCHES: 'saved-searches',
} as const;

/**
 * Maximum number of bookmarks allowed.
 */
export const MAX_BOOKMARKS = 100;

/**
 * Maximum number of saved searches allowed.
 */
export const MAX_SAVED_SEARCHES = 50;

/**
 * Return type for useBookmarks hook.
 */
export interface UseBookmarksResult {
  /** List of bookmarked agents */
  bookmarks: BookmarkedAgent[];
  /** List of saved searches */
  savedSearches: SavedSearch[];
  /** Check if an agent is bookmarked */
  isBookmarked: (agentId: string) => boolean;
  /** Add an agent to bookmarks */
  addBookmark: (agent: Omit<BookmarkedAgent, 'bookmarkedAt'>) => boolean;
  /** Remove an agent from bookmarks */
  removeBookmark: (agentId: string) => void;
  /** Toggle bookmark status */
  toggleBookmark: (agent: Omit<BookmarkedAgent, 'bookmarkedAt'>) => boolean;
  /** Clear all bookmarks */
  clearBookmarks: () => void;
  /** Save a search */
  saveSearch: (search: Omit<SavedSearch, 'id' | 'savedAt'>) => boolean;
  /** Remove a saved search */
  removeSearch: (searchId: string) => void;
  /** Clear all saved searches */
  clearSavedSearches: () => void;
  /** Get bookmarks filtered by chain */
  getBookmarksByChain: (chainId: number) => BookmarkedAgent[];
  /** Export bookmarks as JSON */
  exportBookmarks: () => string;
  /** Import bookmarks from JSON */
  importBookmarks: (json: string) => { imported: number; errors: number };
}

/**
 * Generate a unique ID for saved searches.
 */
function generateSearchId(): string {
  return `search-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate a bookmarked agent entry.
 */
function isValidBookmark(bookmark: unknown): bookmark is BookmarkedAgent {
  if (!bookmark || typeof bookmark !== 'object') return false;
  const b = bookmark as Record<string, unknown>;
  return (
    typeof b.agentId === 'string' &&
    b.agentId.includes(':') &&
    typeof b.name === 'string' &&
    typeof b.chainId === 'number' &&
    typeof b.bookmarkedAt === 'number'
  );
}

/**
 * Hook for managing bookmarked agents and saved searches.
 *
 * @example
 * ```tsx
 * function AgentCard({ agent }: { agent: Agent }) {
 *   const { isBookmarked, toggleBookmark } = useBookmarks();
 *   const bookmarked = isBookmarked(agent.id);
 *
 *   return (
 *     <button onClick={() => toggleBookmark({
 *       agentId: agent.id,
 *       name: agent.name,
 *       chainId: agent.chainId,
 *     })}>
 *       {bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useBookmarks(): UseBookmarksResult {
  const { value: bookmarks, setValue: setBookmarks } = useLocalStorage<BookmarkedAgent[]>(
    STORAGE_KEYS.BOOKMARKED_AGENTS,
    [],
  );

  const { value: savedSearches, setValue: setSavedSearches } = useLocalStorage<SavedSearch[]>(
    STORAGE_KEYS.SAVED_SEARCHES,
    [],
  );

  // Create a Set of bookmarked agent IDs for O(1) lookup
  const bookmarkIds = useMemo(() => new Set(bookmarks.map((b) => b.agentId)), [bookmarks]);

  const isBookmarked = useCallback(
    (agentId: string): boolean => {
      return bookmarkIds.has(agentId);
    },
    [bookmarkIds],
  );

  const addBookmark = useCallback(
    (agent: Omit<BookmarkedAgent, 'bookmarkedAt'>): boolean => {
      // Check conditions using current bookmarks state (via bookmarkIds for O(1) lookup)
      // These checks happen synchronously before setState
      if (bookmarkIds.has(agent.agentId)) {
        return false; // Already bookmarked
      }

      if (bookmarks.length >= MAX_BOOKMARKS) {
        return false; // Limit reached
      }

      // Conditions met, add the bookmark
      setBookmarks((prevBookmarks) => {
        // Double-check in case of race conditions with rapid clicks
        if (prevBookmarks.some((b) => b.agentId === agent.agentId)) {
          return prevBookmarks;
        }

        if (prevBookmarks.length >= MAX_BOOKMARKS) {
          return prevBookmarks;
        }

        const newBookmark: BookmarkedAgent = {
          ...agent,
          bookmarkedAt: Date.now(),
        };

        return [newBookmark, ...prevBookmarks];
      });

      return true;
    },
    [setBookmarks, bookmarkIds, bookmarks.length],
  );

  const removeBookmark = useCallback(
    (agentId: string): void => {
      setBookmarks((prev) => prev.filter((b) => b.agentId !== agentId));
    },
    [setBookmarks],
  );

  const toggleBookmark = useCallback(
    (agent: Omit<BookmarkedAgent, 'bookmarkedAt'>): boolean => {
      if (isBookmarked(agent.agentId)) {
        removeBookmark(agent.agentId);
        return false;
      }
      return addBookmark(agent);
    },
    [isBookmarked, addBookmark, removeBookmark],
  );

  const clearBookmarks = useCallback((): void => {
    setBookmarks([]);
  }, [setBookmarks]);

  const saveSearch = useCallback(
    (search: Omit<SavedSearch, 'id' | 'savedAt'>): boolean => {
      // Check limit synchronously before setState
      if (savedSearches.length >= MAX_SAVED_SEARCHES) {
        return false;
      }

      setSavedSearches((prevSearches) => {
        // Double-check in case of race conditions
        if (prevSearches.length >= MAX_SAVED_SEARCHES) {
          return prevSearches;
        }

        const newSearch: SavedSearch = {
          ...search,
          id: generateSearchId(),
          savedAt: Date.now(),
        };

        return [newSearch, ...prevSearches];
      });

      return true;
    },
    [setSavedSearches, savedSearches.length],
  );

  const removeSearch = useCallback(
    (searchId: string): void => {
      setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
    },
    [setSavedSearches],
  );

  const clearSavedSearches = useCallback((): void => {
    setSavedSearches([]);
  }, [setSavedSearches]);

  const getBookmarksByChain = useCallback(
    (chainId: number): BookmarkedAgent[] => {
      return bookmarks.filter((b) => b.chainId === chainId);
    },
    [bookmarks],
  );

  const exportBookmarks = useCallback((): string => {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        bookmarks,
        savedSearches,
      },
      null,
      2,
    );
  }, [bookmarks, savedSearches]);

  const importBookmarks = useCallback(
    (json: string): { imported: number; errors: number } => {
      let imported = 0;
      let errors = 0;

      try {
        const data = JSON.parse(json);

        // Process bookmarks first to calculate valid ones
        if (Array.isArray(data.bookmarks)) {
          const existingBookmarkIds = new Set(bookmarks.map((b) => b.agentId));
          const validBookmarks: BookmarkedAgent[] = [];

          for (const bookmark of data.bookmarks) {
            if (isValidBookmark(bookmark) && !existingBookmarkIds.has(bookmark.agentId)) {
              if (bookmarks.length + validBookmarks.length < MAX_BOOKMARKS) {
                validBookmarks.push(bookmark);
                imported++;
              }
            } else {
              errors++;
            }
          }

          if (validBookmarks.length > 0) {
            setBookmarks((prev) => [...validBookmarks, ...prev]);
          }
        }

        // Process saved searches
        if (Array.isArray(data.savedSearches)) {
          const existingSearchIds = new Set(savedSearches.map((s) => s.id));
          const validSearches: SavedSearch[] = [];

          for (const search of data.savedSearches) {
            if (
              search &&
              typeof search.name === 'string' &&
              !existingSearchIds.has(search.id) &&
              savedSearches.length + validSearches.length < MAX_SAVED_SEARCHES
            ) {
              validSearches.push({
                ...search,
                id: generateSearchId(), // Generate new ID to avoid conflicts
              });
              imported++;
            } else {
              errors++;
            }
          }

          if (validSearches.length > 0) {
            setSavedSearches((prev) => [...validSearches, ...prev]);
          }
        }
      } catch {
        errors++;
      }

      return { imported, errors };
    },
    [bookmarks, savedSearches, setBookmarks, setSavedSearches],
  );

  return {
    bookmarks,
    savedSearches,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks,
    saveSearch,
    removeSearch,
    clearSavedSearches,
    getBookmarksByChain,
    exportBookmarks,
    importBookmarks,
  };
}
