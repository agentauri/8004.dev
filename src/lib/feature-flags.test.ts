import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearAllFeatureFlagOverrides,
  clearFeatureFlagOverride,
  FEATURE_FLAGS,
  getAllFeatureFlags,
  isFeatureEnabled,
  setFeatureFlagOverride,
} from './feature-flags';

describe('feature-flags', () => {
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage.store[key];
    }),
    clear: vi.fn(() => {
      mockLocalStorage.store = {};
    }),
  };

  beforeEach(() => {
    mockLocalStorage.store = {};
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  describe('isFeatureEnabled', () => {
    it('returns default value when no overrides exist', () => {
      expect(isFeatureEnabled('agentComparison')).toBe(FEATURE_FLAGS.agentComparison);
      expect(isFeatureEnabled('keyboardShortcuts')).toBe(FEATURE_FLAGS.keyboardShortcuts);
    });

    it('returns localStorage override when set', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: true,
      });

      expect(isFeatureEnabled('agentComparison')).toBe(true);
    });

    it('handles invalid JSON in localStorage gracefully', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = 'invalid-json';

      expect(isFeatureEnabled('agentComparison')).toBe(FEATURE_FLAGS.agentComparison);
    });

    it('returns default when flag not in overrides', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        bookmarks: true,
      });

      expect(isFeatureEnabled('agentComparison')).toBe(FEATURE_FLAGS.agentComparison);
    });
  });

  describe('getAllFeatureFlags', () => {
    it('returns all flags with their current values', () => {
      const flags = getAllFeatureFlags();

      expect(Object.keys(flags)).toEqual(Object.keys(FEATURE_FLAGS));
      expect(flags.agentComparison).toBe(FEATURE_FLAGS.agentComparison);
      expect(flags.keyboardShortcuts).toBe(FEATURE_FLAGS.keyboardShortcuts);
    });

    it('includes localStorage overrides', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: true,
        bookmarks: true,
      });

      const flags = getAllFeatureFlags();

      expect(flags.agentComparison).toBe(true);
      expect(flags.bookmarks).toBe(true);
      expect(flags.keyboardShortcuts).toBe(FEATURE_FLAGS.keyboardShortcuts);
    });
  });

  describe('setFeatureFlagOverride', () => {
    it('stores override in localStorage', () => {
      setFeatureFlagOverride('agentComparison', true);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'agent-explorer-feature-flags',
        JSON.stringify({ agentComparison: true }),
      );
    });

    it('preserves existing overrides', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        bookmarks: true,
      });

      setFeatureFlagOverride('agentComparison', true);

      const stored = JSON.parse(mockLocalStorage.store['agent-explorer-feature-flags']);
      expect(stored).toEqual({
        bookmarks: true,
        agentComparison: true,
      });
    });

    it('updates existing override value', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: false,
      });

      setFeatureFlagOverride('agentComparison', true);

      const stored = JSON.parse(mockLocalStorage.store['agent-explorer-feature-flags']);
      expect(stored.agentComparison).toBe(true);
    });
  });

  describe('clearFeatureFlagOverride', () => {
    it('removes specific override from localStorage', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: true,
        bookmarks: true,
      });

      clearFeatureFlagOverride('agentComparison');

      const stored = JSON.parse(mockLocalStorage.store['agent-explorer-feature-flags']);
      expect(stored).toEqual({ bookmarks: true });
    });

    it('removes storage key when no overrides remain', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: true,
      });

      clearFeatureFlagOverride('agentComparison');

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('agent-explorer-feature-flags');
    });

    it('handles missing override gracefully', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        bookmarks: true,
      });

      expect(() => clearFeatureFlagOverride('agentComparison')).not.toThrow();
    });
  });

  describe('clearAllFeatureFlagOverrides', () => {
    it('removes all overrides from localStorage', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: true,
        bookmarks: true,
      });

      clearAllFeatureFlagOverrides();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('agent-explorer-feature-flags');
    });

    it('handles empty localStorage gracefully', () => {
      expect(() => clearAllFeatureFlagOverrides()).not.toThrow();
    });
  });

  describe('SSR safety', () => {
    it('handles missing window gracefully', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      // These should not throw
      expect(() => setFeatureFlagOverride('agentComparison', true)).not.toThrow();
      expect(() => clearFeatureFlagOverride('agentComparison')).not.toThrow();
      expect(() => clearAllFeatureFlagOverrides()).not.toThrow();

      // isFeatureEnabled should return default
      expect(isFeatureEnabled('agentComparison')).toBe(FEATURE_FLAGS.agentComparison);

      global.window = originalWindow;
    });
  });
});
