import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  DEFAULT_THEME,
  getStoredTheme,
  getSystemTheme,
  isValidTheme,
  parseStorageEventTheme,
  resolveTheme,
  saveTheme,
  THEME_STORAGE_KEY,
} from './theme-utils';

// Mock Sentry
vi.mock('./sentry', () => ({
  captureError: vi.fn(),
}));

describe('theme-utils', () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => mockLocalStorage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockLocalStorage[key] = value;
    });

    // Clear mock storage
    for (const key of Object.keys(mockLocalStorage)) {
      delete mockLocalStorage[key];
    }

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isValidTheme', () => {
    it('returns true for valid themes', () => {
      expect(isValidTheme('dark')).toBe(true);
      expect(isValidTheme('light')).toBe(true);
      expect(isValidTheme('system')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isValidTheme('invalid')).toBe(false);
      expect(isValidTheme('')).toBe(false);
      expect(isValidTheme(null)).toBe(false);
      expect(isValidTheme(undefined)).toBe(false);
      expect(isValidTheme(123)).toBe(false);
      expect(isValidTheme({})).toBe(false);
      expect(isValidTheme('<script>alert(1)</script>')).toBe(false);
    });
  });

  describe('getSystemTheme', () => {
    it('returns dark when system prefers dark mode', () => {
      expect(getSystemTheme()).toBe('dark');
    });

    it('returns light when system prefers light mode', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query !== '(prefers-color-scheme: dark)',
          media: query,
        })),
      });
      expect(getSystemTheme()).toBe('light');
    });

    it('returns dark when matchMedia is unavailable', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      });
      expect(getSystemTheme()).toBe('dark');
    });

    it('returns dark when matchMedia throws', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => {
          throw new Error('matchMedia error');
        }),
      });
      expect(getSystemTheme()).toBe('dark');
    });
  });

  describe('getStoredTheme', () => {
    it('returns stored theme when valid', () => {
      mockLocalStorage[THEME_STORAGE_KEY] = 'light';
      expect(getStoredTheme()).toBe('light');
    });

    it('returns DEFAULT_THEME when no value stored', () => {
      expect(getStoredTheme()).toBe(DEFAULT_THEME);
    });

    it('returns DEFAULT_THEME when invalid value stored', () => {
      mockLocalStorage[THEME_STORAGE_KEY] = 'invalid';
      expect(getStoredTheme()).toBe(DEFAULT_THEME);
    });

    it('returns DEFAULT_THEME when localStorage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      expect(getStoredTheme()).toBe(DEFAULT_THEME);
    });
  });

  describe('saveTheme', () => {
    it('saves valid theme and returns true', () => {
      expect(saveTheme('light')).toBe(true);
      expect(mockLocalStorage[THEME_STORAGE_KEY]).toBe('light');
    });

    it('returns false when localStorage throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });
      expect(saveTheme('dark')).toBe(false);
    });
  });

  describe('applyTheme', () => {
    beforeEach(() => {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.style.colorScheme = '';
    });

    it('applies dark theme', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('applies light theme', () => {
      applyTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('applies system theme based on preference', () => {
      applyTheme('system');
      // matchMedia is mocked to prefer dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes previous theme class when switching', () => {
      document.documentElement.classList.add('light');
      applyTheme('dark');
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('resolveTheme', () => {
    it('returns dark for dark theme', () => {
      expect(resolveTheme('dark')).toBe('dark');
    });

    it('returns light for light theme', () => {
      expect(resolveTheme('light')).toBe('light');
    });

    it('returns system preference for system theme', () => {
      // matchMedia is mocked to prefer dark
      expect(resolveTheme('system')).toBe('dark');
    });
  });

  describe('parseStorageEventTheme', () => {
    it('returns valid theme', () => {
      expect(parseStorageEventTheme('dark')).toBe('dark');
      expect(parseStorageEventTheme('light')).toBe('light');
      expect(parseStorageEventTheme('system')).toBe('system');
    });

    it('returns null for invalid values', () => {
      expect(parseStorageEventTheme('invalid')).toBe(null);
      expect(parseStorageEventTheme('')).toBe(null);
    });

    it('returns null for null value without logging', async () => {
      const sentry = await import('./sentry');
      const captureErrorSpy = vi.spyOn(sentry, 'captureError').mockClear();
      expect(parseStorageEventTheme(null)).toBe(null);
      expect(captureErrorSpy).not.toHaveBeenCalled();
    });

    it('logs error for non-null invalid values', async () => {
      const sentry = await import('./sentry');
      const captureErrorSpy = vi.spyOn(sentry, 'captureError').mockClear();
      parseStorageEventTheme('invalid-value');
      expect(captureErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          tags: { feature: 'theme', operation: 'storage-sync' },
        }),
      );
    });
  });

  // NOTE: Constants are type-checked at compile time, no runtime tests needed
});
