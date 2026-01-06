import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
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

  describe('initialization', () => {
    it('returns initial value when nothing is stored', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current.value).toBe('initial');
      expect(result.current.exists).toBe(false);
    });

    it('returns stored value when it exists', () => {
      mockLocalStorage.store['agent-explorer-test-key'] = JSON.stringify('stored-value');

      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current.value).toBe('stored-value');
      expect(result.current.exists).toBe(true);
    });

    it('handles complex objects', () => {
      const storedData = { name: 'Test', count: 42, nested: { flag: true } };
      mockLocalStorage.store['agent-explorer-complex'] = JSON.stringify(storedData);

      const { result } = renderHook(() =>
        useLocalStorage('complex', { name: '', count: 0, nested: { flag: false } }),
      );

      expect(result.current.value).toEqual(storedData);
    });

    it('handles arrays', () => {
      const storedArray = ['item1', 'item2', 'item3'];
      mockLocalStorage.store['agent-explorer-array'] = JSON.stringify(storedArray);

      const { result } = renderHook(() => useLocalStorage<string[]>('array', []));

      expect(result.current.value).toEqual(storedArray);
    });

    it('uses custom prefix', () => {
      mockLocalStorage.store['custom-prefix-key'] = JSON.stringify('custom-value');

      const { result } = renderHook(() =>
        useLocalStorage('key', 'initial', { prefix: 'custom-prefix' }),
      );

      expect(result.current.value).toBe('custom-value');
    });

    it('handles invalid JSON gracefully', () => {
      mockLocalStorage.store['agent-explorer-invalid'] = 'not-valid-json';

      const { result } = renderHook(() => useLocalStorage('invalid', 'fallback'));

      expect(result.current.value).toBe('fallback');
    });
  });

  describe('setValue', () => {
    it('updates state and localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      act(() => {
        result.current.setValue('new-value');
      });

      expect(result.current.value).toBe('new-value');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'agent-explorer-test',
        JSON.stringify('new-value'),
      );
    });

    it('supports functional updates', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        result.current.setValue((prev) => prev + 1);
      });

      expect(result.current.value).toBe(1);

      act(() => {
        result.current.setValue((prev) => prev + 10);
      });

      expect(result.current.value).toBe(11);
    });

    it('updates exists flag', () => {
      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      expect(result.current.exists).toBe(false);

      act(() => {
        result.current.setValue('value');
      });

      expect(result.current.exists).toBe(true);
    });

    it('handles array updates', () => {
      const { result } = renderHook(() => useLocalStorage<string[]>('bookmarks', []));

      act(() => {
        result.current.setValue((prev) => [...prev, 'agent-1']);
      });

      expect(result.current.value).toEqual(['agent-1']);

      act(() => {
        result.current.setValue((prev) => [...prev, 'agent-2']);
      });

      expect(result.current.value).toEqual(['agent-1', 'agent-2']);
    });
  });

  describe('remove', () => {
    it('removes value from localStorage', () => {
      mockLocalStorage.store['agent-explorer-test'] = JSON.stringify('stored');

      const { result } = renderHook(() => useLocalStorage('test', 'initial'));

      act(() => {
        result.current.remove();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('agent-explorer-test');
      expect(result.current.value).toBe('initial');
      expect(result.current.exists).toBe(false);
    });
  });

  describe('cross-tab synchronization', () => {
    it('updates when storage event fires', () => {
      const { result } = renderHook(() => useLocalStorage('sync-test', 'initial'));

      act(() => {
        mockLocalStorage.store['agent-explorer-sync-test'] = JSON.stringify('updated-from-tab');

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'agent-explorer-sync-test',
            newValue: JSON.stringify('updated-from-tab'),
          }),
        );
      });

      expect(result.current.value).toBe('updated-from-tab');
    });

    it('resets to initial when key is removed in another tab', () => {
      mockLocalStorage.store['agent-explorer-sync-test'] = JSON.stringify('stored');

      const { result } = renderHook(() => useLocalStorage('sync-test', 'initial'));

      expect(result.current.value).toBe('stored');

      act(() => {
        delete mockLocalStorage.store['agent-explorer-sync-test'];

        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'agent-explorer-sync-test',
            newValue: null,
          }),
        );
      });

      expect(result.current.value).toBe('initial');
      expect(result.current.exists).toBe(false);
    });

    it('ignores events for different keys', () => {
      const { result } = renderHook(() => useLocalStorage('my-key', 'initial'));

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'agent-explorer-other-key',
            newValue: JSON.stringify('other-value'),
          }),
        );
      });

      expect(result.current.value).toBe('initial');
    });
  });

  describe('custom serialization', () => {
    it('uses custom serializer', () => {
      const customSerializer = vi.fn((value: string) => `CUSTOM:${value}`);

      const { result } = renderHook(() =>
        useLocalStorage<string>('custom', 'initial', { serializer: customSerializer }),
      );

      act(() => {
        result.current.setValue('test');
      });

      expect(customSerializer).toHaveBeenCalledWith('test');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('agent-explorer-custom', 'CUSTOM:test');
    });

    it('uses custom deserializer', () => {
      mockLocalStorage.store['agent-explorer-custom'] = 'PREFIX:stored-value';

      const customDeserializer = vi.fn((value: string) => value.replace('PREFIX:', ''));

      const { result } = renderHook(() =>
        useLocalStorage('custom', 'initial', { deserializer: customDeserializer }),
      );

      expect(customDeserializer).toHaveBeenCalledWith('PREFIX:stored-value');
      expect(result.current.value).toBe('stored-value');
    });
  });
});
