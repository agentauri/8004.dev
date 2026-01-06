'use client';

import { Keyboard, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import {
  CATEGORY_LABELS,
  formatKeyCombo,
  groupShortcutsByCategory,
  type KeyboardShortcut,
  type ShortcutCategory,
} from '@/hooks/use-keyboard-shortcuts';

export interface ShortcutsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Registered shortcuts to display */
  shortcuts: KeyboardShortcut[];
}

/**
 * Modal displaying all available keyboard shortcuts.
 * Automatically groups shortcuts by category.
 *
 * @example
 * ```tsx
 * const { shortcuts, isModalOpen, closeModal } = useKeyboardShortcuts();
 *
 * <ShortcutsModal
 *   isOpen={isModalOpen}
 *   onClose={closeModal}
 *   shortcuts={shortcuts}
 * />
 * ```
 */
export function ShortcutsModal({ isOpen, onClose, shortcuts }: ShortcutsModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  const groupedShortcuts = groupShortcutsByCategory(shortcuts);
  const categories = Object.keys(groupedShortcuts) as ShortcutCategory[];

  // Built-in shortcuts that are always available
  const builtInShortcuts: KeyboardShortcut[] = [
    {
      id: 'help',
      description: 'Show this help',
      keys: '?',
      category: 'ui',
      handler: () => {},
    },
    {
      id: 'close-modal',
      description: 'Close modal',
      keys: 'Escape',
      category: 'ui',
      handler: () => {},
    },
  ];

  // Add built-in shortcuts to grouped
  for (const shortcut of builtInShortcuts) {
    if (!groupedShortcuts[shortcut.category]) {
      groupedShortcuts[shortcut.category] = [];
    }
    // Only add if not already registered
    if (!groupedShortcuts[shortcut.category].some((s) => s.id === shortcut.id)) {
      groupedShortcuts[shortcut.category].push(shortcut);
    }
  }

  // Ensure ui category is included
  if (!categories.includes('ui') && groupedShortcuts.ui) {
    categories.push('ui');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="shortcuts-modal-backdrop"
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] shadow-[0_0_30px_rgba(92,148,252,0.3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        data-testid="shortcuts-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--pixel-gray-700)]">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-[var(--pixel-blue-sky)]" />
            <h2
              id="shortcuts-modal-title"
              className="text-pixel-title text-lg text-[var(--pixel-blue-text)] uppercase tracking-wider"
            >
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] hover:bg-[var(--pixel-gray-800)] transition-colors"
            aria-label="Close modal"
            data-testid="shortcuts-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {categories.length === 0 ? (
            <p className="text-pixel-body text-sm text-[var(--pixel-gray-400)] text-center py-8">
              No shortcuts registered yet.
            </p>
          ) : (
            <div className="space-y-6">
              {categories.map((category) => (
                <ShortcutCategoryGroup
                  key={category}
                  category={category}
                  shortcuts={groupedShortcuts[category]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShortcutCategoryProps {
  category: ShortcutCategory;
  shortcuts: KeyboardShortcut[];
}

function ShortcutCategoryGroup({ category, shortcuts }: ShortcutCategoryProps) {
  return (
    <div data-testid={`shortcut-category-${category}`}>
      <h3 className="text-pixel-body text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider mb-3">
        {CATEGORY_LABELS[category]}
      </h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut) => (
          <ShortcutRow key={shortcut.id} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
}

interface ShortcutRowProps {
  shortcut: KeyboardShortcut;
}

function ShortcutRow({ shortcut }: ShortcutRowProps) {
  const formattedKeys = formatKeyCombo(shortcut.keys);

  return (
    <div
      className="flex items-center justify-between p-2 bg-[var(--pixel-gray-800)] hover:bg-[var(--pixel-gray-700)] transition-colors"
      data-testid={`shortcut-${shortcut.id}`}
    >
      <span className="text-pixel-body text-sm text-[var(--pixel-gray-200)]">
        {shortcut.description}
      </span>
      <kbd className="px-2 py-1 text-xs font-mono bg-[var(--pixel-black)] text-[var(--pixel-gold-coin)] border border-[var(--pixel-gray-600)] min-w-[2rem] text-center">
        {formattedKeys}
      </kbd>
    </div>
  );
}
