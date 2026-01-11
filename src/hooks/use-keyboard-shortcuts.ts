import { useCallback, useEffect, useState } from 'react';
import { useFeatureFlag } from './use-feature-flag';

/**
 * Keyboard shortcut definition.
 */
export interface KeyboardShortcut {
  /** Unique identifier */
  id: string;
  /** Human-readable description */
  description: string;
  /** Key combination (e.g., 'Ctrl+K', '?', 'Escape') */
  keys: string;
  /** Category for grouping in modal */
  category: ShortcutCategory;
  /** Handler function */
  handler: () => void;
  /** Whether shortcut is enabled */
  enabled?: boolean;
}

export type ShortcutCategory = 'navigation' | 'search' | 'actions' | 'ui';

/**
 * Parse key combination string into parts.
 */
function parseKeyCombo(keys: string): {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  key: string;
} {
  const parts = keys.toLowerCase().split('+');
  return {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
    key: parts[parts.length - 1],
  };
}

/**
 * Check if keyboard event matches key combination.
 */
function matchesKeyCombo(event: KeyboardEvent, keys: string): boolean {
  const combo = parseKeyCombo(keys);
  const eventKey = event.key.toLowerCase();

  // Check modifiers
  if (combo.ctrl !== event.ctrlKey) return false;
  if (combo.shift !== event.shiftKey) return false;
  if (combo.alt !== event.altKey) return false;
  if (combo.meta !== event.metaKey) return false;

  // Check key
  return eventKey === combo.key;
}

/**
 * Options for useKeyboardShortcuts hook.
 */
export interface UseKeyboardShortcutsOptions {
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
  /** Disable shortcuts when focused on input elements */
  disableOnInput?: boolean;
}

/**
 * Return type for useKeyboardShortcuts hook.
 */
export interface UseKeyboardShortcutsResult {
  /** Register a new shortcut */
  register: (shortcut: KeyboardShortcut) => void;
  /** Unregister a shortcut by ID */
  unregister: (id: string) => void;
  /** All registered shortcuts */
  shortcuts: KeyboardShortcut[];
  /** Open shortcuts modal */
  openModal: () => void;
  /** Close shortcuts modal */
  closeModal: () => void;
  /** Toggle shortcuts modal */
  toggleModal: () => void;
  /** Whether modal is open */
  isModalOpen: boolean;
  /** Whether shortcuts feature is enabled */
  isEnabled: boolean;
}

/**
 * Hook for managing keyboard shortcuts.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { register, unregister, openModal, isModalOpen } = useKeyboardShortcuts();
 *
 *   useEffect(() => {
 *     register({
 *       id: 'search-focus',
 *       description: 'Focus search input',
 *       keys: 'Ctrl+K',
 *       category: 'search',
 *       handler: () => document.getElementById('search')?.focus(),
 *     });
 *
 *     return () => unregister('search-focus');
 *   }, [register, unregister]);
 *
 *   return <ShortcutsModal isOpen={isModalOpen} onClose={closeModal} />;
 * }
 * ```
 */
export function useKeyboardShortcuts(
  options: UseKeyboardShortcutsOptions = {},
): UseKeyboardShortcutsResult {
  const { preventDefault = true, disableOnInput = true } = options;

  const isEnabled = useFeatureFlag('keyboardShortcuts');
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  const register = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => {
      // Replace if exists, add if new
      const exists = prev.some((s) => s.id === shortcut.id);
      if (exists) {
        return prev.map((s) => (s.id === shortcut.id ? shortcut : s));
      }
      return [...prev, shortcut];
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Handle keyboard events
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if disabled on input and currently focused on input element
      if (disableOnInput && event.target) {
        const target = event.target as HTMLElement;
        const tagName = target.tagName?.toLowerCase();
        const isEditable = target.isContentEditable;

        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || isEditable) {
          // Allow Escape key to work even in inputs
          if (event.key !== 'Escape') {
            return;
          }
        }
      }

      // Check '?' for help modal (common convention)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (preventDefault) event.preventDefault();
        toggleModal();
        return;
      }

      // Check Escape to close modal
      if (event.key === 'Escape' && isModalOpen) {
        if (preventDefault) event.preventDefault();
        closeModal();
        return;
      }

      // Check registered shortcuts
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        if (matchesKeyCombo(event, shortcut.keys)) {
          if (preventDefault) event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, shortcuts, isModalOpen, preventDefault, disableOnInput, toggleModal, closeModal]);

  return {
    register,
    unregister,
    shortcuts,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    isEnabled,
  };
}

/**
 * Detect if the user is on a Mac/Apple device.
 * Uses modern userAgentData API with fallback to userAgent string.
 */
function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Modern API (Chrome 90+, Edge 90+)
  // biome-ignore lint/suspicious/noExplicitAny: userAgentData is not in standard Navigator type yet
  const userAgentData = (navigator as any).userAgentData;
  if (userAgentData?.platform) {
    return /macOS/i.test(userAgentData.platform);
  }

  // Fallback to userAgent string (works in all browsers)
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Get human-readable key display text.
 */
export function formatKeyCombo(keys: string): string {
  const parts = keys.split('+');
  const isMac = isMacPlatform();

  return parts
    .map((part) => {
      const lower = part.toLowerCase();
      switch (lower) {
        case 'ctrl':
        case 'control':
          return isMac ? '⌃' : 'Ctrl';
        case 'shift':
          return isMac ? '⇧' : 'Shift';
        case 'alt':
          return isMac ? '⌥' : 'Alt';
        case 'meta':
        case 'cmd':
        case 'command':
          return isMac ? '⌘' : 'Win';
        case 'escape':
        case 'esc':
          return 'Esc';
        case 'enter':
        case 'return':
          return isMac ? '⏎' : 'Enter';
        case 'backspace':
          return isMac ? '⌫' : 'Backspace';
        case 'delete':
          return isMac ? '⌦' : 'Del';
        case 'arrowup':
        case 'up':
          return '↑';
        case 'arrowdown':
        case 'down':
          return '↓';
        case 'arrowleft':
        case 'left':
          return '←';
        case 'arrowright':
        case 'right':
          return '→';
        default:
          return part.toUpperCase();
      }
    })
    .join(isMac ? '' : '+');
}

/**
 * Group shortcuts by category.
 */
export function groupShortcutsByCategory(
  shortcuts: KeyboardShortcut[],
): Record<ShortcutCategory, KeyboardShortcut[]> {
  return shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<ShortcutCategory, KeyboardShortcut[]>,
  );
}

/**
 * Category display names.
 */
export const CATEGORY_LABELS: Record<ShortcutCategory, string> = {
  navigation: 'Navigation',
  search: 'Search',
  actions: 'Actions',
  ui: 'Interface',
};
