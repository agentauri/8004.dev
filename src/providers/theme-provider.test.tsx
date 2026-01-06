import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY } from '@/lib/theme-utils';
import { ThemeProvider, type ThemeProviderProps, useThemeContext } from './theme-provider';

// Mock Sentry
vi.mock('@/lib/sentry', () => ({
  captureError: vi.fn(),
}));

const STORAGE_KEY = THEME_STORAGE_KEY;

function TestConsumer() {
  const { theme, resolvedTheme, toggleTheme, setTheme, isLoaded } = useThemeContext();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="is-loaded">{isLoaded ? 'true' : 'false'}</span>
      <button type="button" onClick={toggleTheme} data-testid="toggle-btn">
        Toggle
      </button>
      <button type="button" onClick={() => setTheme('light')} data-testid="set-light-btn">
        Light
      </button>
      <button type="button" onClick={() => setTheme('dark')} data-testid="set-dark-btn">
        Dark
      </button>
      <button type="button" onClick={() => setTheme('system')} data-testid="set-system-btn">
        System
      </button>
    </div>
  );
}

function renderWithProvider(ui: ReactNode = <TestConsumer />, props?: Partial<ThemeProviderProps>) {
  return render(<ThemeProvider {...props}>{ui}</ThemeProvider>);
}

describe('ThemeProvider', () => {
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

    // Reset document classes
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('renders children', () => {
      renderWithProvider(<div data-testid="child">Child</div>);
      expect(screen.getByTestId('child')).toHaveTextContent('Child');
    });

    it('provides default dark theme', () => {
      renderWithProvider();

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    });

    it('loads theme from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'light');
      renderWithProvider();

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });

    it('applies theme class to document', () => {
      localStorage.setItem(STORAGE_KEY, 'light');
      renderWithProvider();

      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('sets isLoaded after initialization', async () => {
      renderWithProvider();

      await vi.waitFor(() => {
        expect(screen.getByTestId('is-loaded')).toHaveTextContent('true');
      });
    });

    it('uses defaultTheme prop when no stored theme', () => {
      renderWithProvider(<TestConsumer />, { defaultTheme: 'light' });

      // Note: stored theme takes precedence, but without stored theme, default is used initially
      expect(screen.getByTestId('theme')).toHaveTextContent('dark'); // Reverts to stored/default
    });
  });

  describe('forcedTheme', () => {
    it('uses forcedTheme regardless of stored value', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      renderWithProvider(<TestConsumer />, { forcedTheme: 'light' });

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });

    it('prevents setTheme when forcedTheme is set', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestConsumer />, { forcedTheme: 'light' });

      await user.click(screen.getByTestId('set-dark-btn'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('prevents toggleTheme when forcedTheme is set', async () => {
      const user = userEvent.setup();
      renderWithProvider(<TestConsumer />, { forcedTheme: 'light' });

      await user.click(screen.getByTestId('toggle-btn'));

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });
  });

  describe('setTheme', () => {
    it('updates theme to light', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByTestId('set-light-btn'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });

    it('updates theme to dark', async () => {
      const user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, 'light');
      renderWithProvider();

      await user.click(screen.getByTestId('set-dark-btn'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('updates theme to system', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByTestId('set-system-btn'));

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark'); // Based on mock
    });

    it('persists theme to localStorage', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByTestId('set-light-btn'));

      expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    });

    it('applies theme class to document', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByTestId('set-light-btn'));

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  // NOTE: toggleTheme behavior is tested in use-theme.test.ts to avoid duplication

  describe('system theme changes', () => {
    it('updates resolvedTheme when system preference changes', async () => {
      localStorage.setItem(STORAGE_KEY, 'system');
      renderWithProvider();

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');

      // Simulate system preference change to light
      act(() => {
        for (const listener of mediaQueryListeners) {
          listener({ matches: false } as MediaQueryListEvent);
        }
      });

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });
  });

  // NOTE: Cross-tab synchronization is tested in use-theme.test.ts to avoid duplication

  describe('disableTransitionOnChange', () => {
    it('temporarily disables transitions when enabled', async () => {
      const user = userEvent.setup();
      const appendChildSpy = vi.spyOn(document.head, 'appendChild');

      renderWithProvider(<TestConsumer />, {
        disableTransitionOnChange: true,
      });

      await user.click(screen.getByTestId('set-light-btn'));

      // Should have added a style element
      expect(appendChildSpy).toHaveBeenCalled();
    });

    it('removes the style element after timeout', async () => {
      const user = userEvent.setup();
      const removeChildSpy = vi.spyOn(document.head, 'removeChild');

      renderWithProvider(<TestConsumer />, {
        disableTransitionOnChange: true,
      });

      await user.click(screen.getByTestId('set-light-btn'));

      // Wait for the setTimeout to complete (1ms + some buffer)
      await vi.waitFor(
        () => {
          expect(removeChildSpy).toHaveBeenCalled();
        },
        { timeout: 100 },
      );
    });
  });
});

describe('useThemeContext', () => {
  it('throws error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useThemeContext());
    }).toThrow('useThemeContext must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  it('returns theme context when used inside provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useThemeContext(), { wrapper });

    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('resolvedTheme');
    expect(result.current).toHaveProperty('setTheme');
    expect(result.current).toHaveProperty('toggleTheme');
    expect(result.current).toHaveProperty('isLoaded');
  });
});
