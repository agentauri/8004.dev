'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { captureError } from '@/lib/sentry';
import {
  applyTheme,
  DEFAULT_THEME,
  getStoredTheme,
  parseStorageEventTheme,
  type ResolvedTheme,
  resolveTheme,
  saveTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from '@/lib/theme-utils';

// Re-export types for consumers
export type { Theme } from '@/lib/theme-utils';

export interface ThemeContextValue {
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

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme to use (defaults to 'dark') */
  defaultTheme?: Theme;
  /** Force a specific theme (useful for testing) */
  forcedTheme?: ResolvedTheme;
  /** Disable transitions during theme changes (useful for testing) */
  disableTransitionOnChange?: boolean;
}

/**
 * Provider component for theme management
 *
 * @example
 * ```tsx
 * // In app/providers.tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  forcedTheme,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [currentResolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    forcedTheme ?? (defaultTheme === 'system' ? 'dark' : defaultTheme),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Use ref for stable toggleTheme reference
  const resolvedThemeRef = useRef<ResolvedTheme>(currentResolvedTheme);
  resolvedThemeRef.current = currentResolvedTheme;

  // Initialize theme from localStorage
  useEffect(() => {
    if (forcedTheme) {
      applyTheme(forcedTheme);
      setResolvedTheme(forcedTheme);
      setIsLoaded(true);
      return;
    }

    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    const resolved = resolveTheme(storedTheme);
    setResolvedTheme(resolved);
    applyTheme(storedTheme);
    setIsLoaded(true);
  }, [forcedTheme]);

  // Listen for system theme changes when using 'system' theme
  useEffect(() => {
    if (forcedTheme || theme !== 'system') return;

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
  }, [theme, forcedTheme]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (forcedTheme) return;

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
  }, [forcedTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (forcedTheme) return;

      // Optionally disable transitions during change
      if (disableTransitionOnChange && typeof document !== 'undefined') {
        const css = document.createElement('style');
        css.appendChild(
          document.createTextNode('*, *::before, *::after { transition: none !important; }'),
        );
        document.head.appendChild(css);

        // Force reflow to ensure styles are applied before removing transition disable
        (() => window.getComputedStyle(document.body))();

        setTimeout(() => {
          try {
            if (css.parentNode === document.head) {
              document.head.removeChild(css);
            }
          } catch (error) {
            captureError(error, {
              tags: { feature: 'theme', operation: 'transition-cleanup' },
            });
          }
        }, 1);
      }

      setThemeState(newTheme);
      setResolvedTheme(resolveTheme(newTheme));
      saveTheme(newTheme);
      applyTheme(newTheme);
    },
    [forcedTheme, disableTransitionOnChange],
  );

  // Use ref for stable reference across resolvedTheme changes
  const toggleTheme = useCallback(() => {
    const newTheme: Theme = resolvedThemeRef.current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: forcedTheme ?? theme,
      resolvedTheme: forcedTheme ?? currentResolvedTheme,
      setTheme,
      toggleTheme,
      isLoaded,
    }),
    [theme, currentResolvedTheme, setTheme, toggleTheme, isLoaded, forcedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 *
 * @example
 * ```tsx
 * const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();
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
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
}
