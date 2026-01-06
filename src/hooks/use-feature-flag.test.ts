import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFeatureFlag, useFeatureFlagToggle } from './use-feature-flag';

describe('useFeatureFlag', () => {
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage.store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage.store[key];
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

  describe('useFeatureFlag', () => {
    it('returns default value for disabled flag', () => {
      const { result } = renderHook(() => useFeatureFlag('agentComparison'));
      expect(result.current).toBe(false);
    });

    it('returns default value for enabled flag', () => {
      const { result } = renderHook(() => useFeatureFlag('keyboardShortcuts'));
      expect(result.current).toBe(true);
    });

    it('returns override value from localStorage', () => {
      mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
        agentComparison: true,
      });

      const { result } = renderHook(() => useFeatureFlag('agentComparison'));
      expect(result.current).toBe(true);
    });

    it('updates when localStorage changes', () => {
      const { result } = renderHook(() => useFeatureFlag('agentComparison'));
      expect(result.current).toBe(false);

      act(() => {
        mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
          agentComparison: true,
        });

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'agent-explorer-feature-flags',
            newValue: JSON.stringify({ agentComparison: true }),
          }),
        );
      });

      expect(result.current).toBe(true);
    });

    it('ignores unrelated storage events', () => {
      const { result } = renderHook(() => useFeatureFlag('agentComparison'));
      expect(result.current).toBe(false);

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'some-other-key',
            newValue: 'some-value',
          }),
        );
      });

      expect(result.current).toBe(false);
    });
  });

  describe('useFeatureFlagToggle', () => {
    it('returns isEnabled state', () => {
      const { result } = renderHook(() => useFeatureFlagToggle('agentComparison'));
      expect(result.current.isEnabled).toBe(false);
    });

    it('toggles flag state', () => {
      const { result } = renderHook(() => useFeatureFlagToggle('agentComparison'));

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isEnabled).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('sets flag to specific value', () => {
      const { result } = renderHook(() => useFeatureFlagToggle('agentComparison'));

      act(() => {
        result.current.setEnabled(true);
      });

      expect(result.current.isEnabled).toBe(true);

      act(() => {
        result.current.setEnabled(false);
      });

      expect(result.current.isEnabled).toBe(false);
    });

    it('syncs with storage events', () => {
      const { result } = renderHook(() => useFeatureFlagToggle('agentComparison'));

      act(() => {
        mockLocalStorage.store['agent-explorer-feature-flags'] = JSON.stringify({
          agentComparison: true,
        });

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'agent-explorer-feature-flags',
            newValue: JSON.stringify({ agentComparison: true }),
          }),
        );
      });

      expect(result.current.isEnabled).toBe(true);
    });
  });
});
