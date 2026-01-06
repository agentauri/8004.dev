import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CATEGORY_LABELS,
  formatKeyCombo,
  groupShortcutsByCategory,
  useKeyboardShortcuts,
} from './use-keyboard-shortcuts';

describe('useKeyboardShortcuts', () => {
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

  describe('basic functionality', () => {
    it('returns initial state', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      expect(result.current.shortcuts).toEqual([]);
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.isEnabled).toBe(true); // keyboardShortcuts is enabled by default
    });

    it('registers a shortcut', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.register({
          id: 'test',
          description: 'Test shortcut',
          keys: 'Ctrl+K',
          category: 'search',
          handler: vi.fn(),
        });
      });

      expect(result.current.shortcuts).toHaveLength(1);
      expect(result.current.shortcuts[0].id).toBe('test');
    });

    it('unregisters a shortcut', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.register({
          id: 'test',
          description: 'Test shortcut',
          keys: 'Ctrl+K',
          category: 'search',
          handler: vi.fn(),
        });
      });

      expect(result.current.shortcuts).toHaveLength(1);

      act(() => {
        result.current.unregister('test');
      });

      expect(result.current.shortcuts).toHaveLength(0);
    });

    it('replaces existing shortcut with same id', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.register({
          id: 'test',
          description: 'Original',
          keys: 'Ctrl+K',
          category: 'search',
          handler: vi.fn(),
        });
      });

      act(() => {
        result.current.register({
          id: 'test',
          description: 'Updated',
          keys: 'Ctrl+J',
          category: 'navigation',
          handler: vi.fn(),
        });
      });

      expect(result.current.shortcuts).toHaveLength(1);
      expect(result.current.shortcuts[0].description).toBe('Updated');
      expect(result.current.shortcuts[0].keys).toBe('Ctrl+J');
    });
  });

  describe('modal controls', () => {
    it('opens modal', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.openModal();
      });

      expect(result.current.isModalOpen).toBe(true);
    });

    it('closes modal', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.openModal();
      });

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.isModalOpen).toBe(false);
    });

    it('toggles modal', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.toggleModal();
      });

      expect(result.current.isModalOpen).toBe(true);

      act(() => {
        result.current.toggleModal();
      });

      expect(result.current.isModalOpen).toBe(false);
    });
  });

  describe('keyboard event handling', () => {
    it('triggers shortcut handler on key press', () => {
      const handler = vi.fn();
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.register({
          id: 'test',
          description: 'Test',
          keys: 'Ctrl+K',
          category: 'search',
          handler,
        });
      });

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
          }),
        );
      });

      expect(handler).toHaveBeenCalled();
    });

    it('opens modal on ? key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: '?',
          }),
        );
      });

      expect(result.current.isModalOpen).toBe(true);
    });

    it('closes modal on Escape key', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.openModal();
      });

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'Escape',
          }),
        );
      });

      expect(result.current.isModalOpen).toBe(false);
    });

    it('does not trigger shortcut when disabled', () => {
      const handler = vi.fn();
      const { result } = renderHook(() => useKeyboardShortcuts());

      act(() => {
        result.current.register({
          id: 'test',
          description: 'Test',
          keys: 'Ctrl+K',
          category: 'search',
          handler,
          enabled: false,
        });
      });

      act(() => {
        window.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
          }),
        );
      });

      expect(handler).not.toHaveBeenCalled();
    });
  });
});

describe('formatKeyCombo', () => {
  it('formats single key', () => {
    expect(formatKeyCombo('k')).toBe('K');
  });

  it('formats Ctrl+Key combo', () => {
    // Test assumes non-Mac platform in test environment
    expect(formatKeyCombo('Ctrl+K')).toMatch(/Ctrl\+K|⌃K/);
  });

  it('formats special keys', () => {
    expect(formatKeyCombo('Escape')).toBe('Esc');
    expect(formatKeyCombo('ArrowUp')).toBe('↑');
    expect(formatKeyCombo('ArrowDown')).toBe('↓');
    expect(formatKeyCombo('ArrowLeft')).toBe('←');
    expect(formatKeyCombo('ArrowRight')).toBe('→');
  });

  it('formats question mark', () => {
    expect(formatKeyCombo('?')).toBe('?');
  });
});

describe('groupShortcutsByCategory', () => {
  it('groups shortcuts by category', () => {
    const shortcuts = [
      {
        id: '1',
        description: 'Search',
        keys: 'Ctrl+K',
        category: 'search' as const,
        handler: vi.fn(),
      },
      {
        id: '2',
        description: 'Navigate',
        keys: 'G',
        category: 'navigation' as const,
        handler: vi.fn(),
      },
      { id: '3', description: 'Filter', keys: 'F', category: 'search' as const, handler: vi.fn() },
    ];

    const grouped = groupShortcutsByCategory(shortcuts);

    expect(grouped.search).toHaveLength(2);
    expect(grouped.navigation).toHaveLength(1);
    expect(grouped.actions).toBeUndefined();
  });

  it('returns empty object for empty array', () => {
    const grouped = groupShortcutsByCategory([]);
    expect(Object.keys(grouped)).toHaveLength(0);
  });
});

describe('CATEGORY_LABELS', () => {
  it('has labels for all categories', () => {
    expect(CATEGORY_LABELS.navigation).toBe('Navigation');
    expect(CATEGORY_LABELS.search).toBe('Search');
    expect(CATEGORY_LABELS.actions).toBe('Actions');
    expect(CATEGORY_LABELS.ui).toBe('Interface');
  });
});
