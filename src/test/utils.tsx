import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

/**
 * Creates a QueryClientProvider wrapper for testing hooks with TanStack Query.
 *
 * Uses test-optimized options:
 * - retry: false (no automatic retries in tests)
 * - gcTime: 0 (immediate garbage collection)
 *
 * @example
 * ```tsx
 * const { result } = renderHook(() => useMyHook(), {
 *   wrapper: createQueryWrapper(),
 * });
 * ```
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

/**
 * Creates a fresh QueryClient for tests that need direct access to the client.
 *
 * @example
 * ```tsx
 * const queryClient = createTestQueryClient();
 * queryClient.setQueryData(['key'], data);
 * ```
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

/**
 * Creates a mock localStorage for testing.
 * Returns the mock storage object and cleanup function.
 *
 * @example
 * ```tsx
 * let mockStorage: MockLocalStorage;
 *
 * beforeEach(() => {
 *   mockStorage = createLocalStorageMock();
 * });
 *
 * afterEach(() => {
 *   mockStorage.cleanup();
 * });
 * ```
 */
export interface MockLocalStorage {
  storage: Record<string, string>;
  cleanup: () => void;
}

export function createLocalStorageMock(): MockLocalStorage {
  const storage: Record<string, string> = {};

  const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
  const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
  const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
  const clearSpy = vi.spyOn(Storage.prototype, 'clear');

  getItemSpy.mockImplementation((key) => storage[key] ?? null);
  setItemSpy.mockImplementation((key, value) => {
    storage[key] = value;
  });
  removeItemSpy.mockImplementation((key) => {
    delete storage[key];
  });
  clearSpy.mockImplementation(() => {
    for (const key of Object.keys(storage)) {
      delete storage[key];
    }
  });

  return {
    storage,
    cleanup: () => {
      getItemSpy.mockRestore();
      setItemSpy.mockRestore();
      removeItemSpy.mockRestore();
      clearSpy.mockRestore();
    },
  };
}

/**
 * Creates a mock fetch function for API tests.
 *
 * @example
 * ```tsx
 * const { mockFetch, cleanup } = createFetchMock();
 *
 * mockFetch.mockResolvedValue({
 *   json: () => Promise.resolve({ success: true, data: [] }),
 * });
 * ```
 */
export interface MockFetch {
  mockFetch: ReturnType<typeof vi.fn>;
  cleanup: () => void;
}

export function createFetchMock(): MockFetch {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;
  global.fetch = mockFetch;

  return {
    mockFetch,
    cleanup: () => {
      global.fetch = originalFetch;
    },
  };
}

/**
 * Creates a mock matchMedia for theme/responsive tests.
 *
 * @param prefersDark - Whether the mock should report dark mode preference
 *
 * @example
 * ```tsx
 * const { listeners, cleanup } = createMatchMediaMock(true);
 *
 * // Simulate system theme change
 * listeners.forEach(l => l({ matches: false } as MediaQueryListEvent));
 * ```
 */
export interface MockMatchMedia {
  listeners: Array<(e: MediaQueryListEvent) => void>;
  cleanup: () => void;
}

export function createMatchMediaMock(prefersDark = true): MockMatchMedia {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];

  const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: prefersDark ? query === '(prefers-color-scheme: dark)' : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.push(listener);
    },
    removeEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    },
    dispatchEvent: vi.fn(),
  }));

  const originalMatchMedia = window.matchMedia;
  window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;

  return {
    listeners,
    cleanup: () => {
      window.matchMedia = originalMatchMedia;
    },
  };
}
