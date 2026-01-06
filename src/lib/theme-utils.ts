/**
 * Shared theme utilities for theme management
 * Used by both useTheme hook and ThemeProvider context
 */

import { captureError } from './sentry';

/**
 * Theme type - represents the user's theme preference
 * - 'dark': Force dark theme
 * - 'light': Force light theme
 * - 'system': Follow system preference
 */
export type Theme = 'dark' | 'light' | 'system';

/**
 * Resolved theme - the actual theme applied to the UI
 * This is always either 'dark' or 'light', never 'system'
 */
export type ResolvedTheme = 'dark' | 'light';

/** localStorage key for theme preference */
export const THEME_STORAGE_KEY = 'agent-explorer-theme';

/** Default theme when no preference is set or on error */
export const DEFAULT_THEME: Theme = 'dark';

/** Valid theme values for type guard */
const VALID_THEMES: readonly Theme[] = ['dark', 'light', 'system'] as const;

/**
 * Type guard to check if a value is a valid Theme
 */
export function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && VALID_THEMES.includes(value as Theme);
}

/**
 * Gets the current system color scheme preference
 * Falls back to 'dark' if matchMedia is unavailable
 */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';

  try {
    if (typeof window.matchMedia !== 'function') {
      return 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    captureError(error, {
      tags: { feature: 'theme', operation: 'system-detection' },
    });
    return 'dark';
  }
}

/**
 * Gets the stored theme from localStorage
 * Returns DEFAULT_THEME if:
 * - localStorage is unavailable
 * - No value is stored
 * - Stored value is invalid
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidTheme(stored)) {
      return stored;
    }
    // No stored value or invalid value - this is normal for first visit
  } catch (error) {
    captureError(error, {
      tags: { feature: 'theme', operation: 'read' },
      extra: { storageKey: THEME_STORAGE_KEY },
    });
  }

  return DEFAULT_THEME;
}

/**
 * Saves theme preference to localStorage
 * @returns true if save was successful, false otherwise
 */
export function saveTheme(theme: Theme): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch (error) {
    captureError(error, {
      tags: { feature: 'theme', operation: 'write' },
      extra: { storageKey: THEME_STORAGE_KEY, attemptedTheme: theme },
    });
    return false;
  }
}

/**
 * Applies theme to the document by updating classes and color-scheme
 * Safe to call on server (no-op if document is unavailable)
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const effectiveTheme: ResolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove('dark', 'light');

  // Add new theme class
  root.classList.add(effectiveTheme);

  // Update color-scheme for native elements (scrollbars, form controls, etc.)
  root.style.colorScheme = effectiveTheme;
}

/**
 * Resolves a theme to its effective value
 */
export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

/**
 * Validates and parses a storage event value
 * @returns The valid theme or null if invalid
 */
export function parseStorageEventTheme(newValue: string | null): Theme | null {
  if (isValidTheme(newValue)) {
    return newValue;
  }

  if (newValue !== null) {
    // Log unexpected values for debugging
    captureError(new Error('Invalid theme value in storage event'), {
      tags: { feature: 'theme', operation: 'storage-sync' },
      level: 'warning',
      extra: { receivedValue: newValue, expectedValues: VALID_THEMES },
    });
  }

  return null;
}
