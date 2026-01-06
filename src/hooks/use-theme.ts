'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { captureError } from '@/lib/sentry';
import {
  applyTheme,
  getStoredTheme,
  parseStorageEventTheme,
  type ResolvedTheme,
  resolveTheme,
  saveTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from '@/lib/theme-utils';

// Re-export Theme type for consumers
export type { Theme } from '@/lib/theme-utils';

export interface UseThemeReturn {
  /** Current theme setting ('dark', 'light', or 'system') */
  theme: Theme;
  /** The resolved theme after considering system preference */
  resolvedTheme: ResolvedTheme;
  /** Set the theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between dark and light themes */
  toggleTheme: () => void;
  /** Whether the theme has been loaded from storage */
  isLoaded: boolean;
}

/**
 * Hook for managing application theme with localStorage persistence
 *
 * @example
 * ```tsx
 * const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
 *
 * // Set specific theme
 * setTheme('dark');
 * setTheme('light');
 * setTheme('system');
 *
 * // Toggle between dark/light
 * toggleTheme();
 * ```
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Use ref for stable toggleTheme reference
  const resolvedThemeRef = useRef<ResolvedTheme>(resolvedTheme);
  resolvedThemeRef.current = resolvedTheme;

  // Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    setResolvedTheme(resolveTheme(storedTheme));
    applyTheme(storedTheme);
    setIsLoaded(true);
  }, []);

  // Listen for system theme changes when using 'system' theme
  useEffect(() => {
    if (theme !== 'system') return;

    // Guard against matchMedia unavailability
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const newResolvedTheme: ResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolvedTheme);
        applyTheme('system');
      };

      // Support both old and new APIs for browser compatibility
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      // Legacy API for older browsers
      if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      captureError(error, {
        tags: { feature: 'theme', operation: 'media-query-listener' },
      });
    }
  }, [theme]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) return;

      const newTheme = parseStorageEventTheme(e.newValue);
      if (newTheme) {
        setThemeState(newTheme);
        setResolvedTheme(resolveTheme(newTheme));
        applyTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
    saveTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  // Use ref for stable reference across resolvedTheme changes
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = resolvedThemeRef.current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isLoaded,
  };
}
