import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY } from '@/lib/theme-utils';
import { useTheme } from './use-theme';

// Mock Sentry
vi.mock('@/lib/sentry', () => ({
  captureError: vi.fn(),
}));

const STORAGE_KEY = THEME_STORAGE_KEY;

describe('useTheme', () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mediaQueryListeners: Array<(e: MediaQueryListEvent) => void>;
  let storageListeners: Array<(e: StorageEvent) => void>;

  beforeEach(() => {
    localStorage.clear();
    mediaQueryListeners = [];
    storageListeners = [];

    // Mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
        mediaQueryListeners.push(listener);
      },
      removeEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
        const index = mediaQueryListeners.indexOf(listener);
        if (index > -1) mediaQueryListeners.splice(index, 1);
      },
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;

    // Track storage event listeners
    const originalAddEventListener = window.addEventListener.bind(window);
    window.addEventListener = vi.fn(
      (event: string, listener: EventListenerOrEventListenerObject) => {
        if (event === 'storage') {
          storageListeners.push(listener as (e: StorageEvent) => void);
        }
        return originalAddEventListener(event, listener);
      },
    ) as unknown as typeof window.addEventListener;

    // Mock document.documentElement
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.style.colorScheme = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('returns default dark theme when no stored value', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('loads theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('loads system theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'system');
      // Mock system prefers dark
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('ignores invalid stored values', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
    });

    it('sets isLoaded to true after initialization', async () => {
      const { result } = renderHook(() => useTheme());

      // isLoaded becomes true after useEffect runs
      await vi.waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });
    });

    // NOTE: DOM class application is tested in theme-utils.test.ts (applyTheme)
  });

  describe('setTheme', () => {
    it('updates theme to dark', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });

    it('updates theme to light', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    });

    it('updates theme to system', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      // resolvedTheme should be based on system preference (dark in our mock)
      expect(result.current.resolvedTheme).toBe('dark');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('system');
    });

    // NOTE: DOM class application is tested in theme-utils.test.ts (applyTheme)
  });

  describe('toggleTheme', () => {
    it('toggles from dark to light', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('toggles from light to dark', () => {
      localStorage.setItem(STORAGE_KEY, 'light');
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });

    it('toggles based on resolved theme when system is set', () => {
      localStorage.setItem(STORAGE_KEY, 'system');
      // System prefers dark
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      // Should toggle to light since resolved was dark
      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('persists toggled theme to localStorage', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    });
  });

  describe('system theme changes', () => {
    it('updates resolvedTheme when system preference changes', async () => {
      localStorage.setItem(STORAGE_KEY, 'system');

      // Start with system preferring dark
      const { result } = renderHook(() => useTheme());

      expect(result.current.resolvedTheme).toBe('dark');

      // Simulate system preference change to light
      act(() => {
        for (const listener of mediaQueryListeners) {
          listener({ matches: false } as MediaQueryListEvent);
        }
      });

      expect(result.current.resolvedTheme).toBe('light');
    });

    it('does not react to system changes when theme is explicit', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      const { result } = renderHook(() => useTheme());

      expect(result.current.resolvedTheme).toBe('dark');

      // Simulate system preference change - should have no effect
      act(() => {
        for (const listener of mediaQueryListeners) {
          listener({ matches: false } as MediaQueryListEvent);
        }
      });

      // Should still be dark since we're not using system theme
      expect(result.current.theme).toBe('dark');
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('cross-tab synchronization', () => {
    it('updates theme when storage changes in another tab', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');

      // Simulate storage change from another tab
      act(() => {
        for (const listener of storageListeners) {
          listener({
            key: STORAGE_KEY,
            newValue: 'light',
          } as StorageEvent);
        }
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('ignores storage changes for other keys', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        for (const listener of storageListeners) {
          listener({
            key: 'other-key',
            newValue: 'light',
          } as StorageEvent);
        }
      });

      expect(result.current.theme).toBe('dark');
    });

    it('handles system theme from storage change', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        for (const listener of storageListeners) {
          listener({
            key: STORAGE_KEY,
            newValue: 'system',
          } as StorageEvent);
        }
      });

      expect(result.current.theme).toBe('system');
      expect(result.current.resolvedTheme).toBe('dark'); // Based on mock
    });

    // NOTE: DOM class application is tested in theme-utils.test.ts (applyTheme)
  });

  describe('localStorage error handling', () => {
    it('handles localStorage.getItem throwing', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');

      getItemSpy.mockRestore();
    });

    it('handles localStorage.setItem throwing', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useTheme());

      // Should not throw
      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');

      setItemSpy.mockRestore();
    });
  });

  describe('return value stability', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() => useTheme());

      const initialSetTheme = result.current.setTheme;
      const initialToggleTheme = result.current.toggleTheme;

      rerender();

      expect(result.current.setTheme).toBe(initialSetTheme);
      expect(result.current.toggleTheme).toBe(initialToggleTheme);
    });
  });

  describe('cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useTheme());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
    });
  });
});
