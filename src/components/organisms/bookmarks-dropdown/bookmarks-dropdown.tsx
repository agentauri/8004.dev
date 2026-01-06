'use client';

import { Bookmark, ChevronRight, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChainBadge, type ChainId } from '@/components/atoms/chain-badge';
import type { BookmarkedAgent } from '@/hooks/use-bookmarks';
import { cn } from '@/lib/utils';

export interface BookmarksDropdownProps {
  /** List of bookmarked agents */
  bookmarks: BookmarkedAgent[];
  /** Callback to remove a bookmark */
  onRemove: (agentId: string) => void;
  /** Callback to clear all bookmarks */
  onClearAll: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * Dropdown component that displays bookmarked agents with quick access.
 *
 * @example
 * ```tsx
 * const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();
 *
 * <BookmarksDropdown
 *   bookmarks={bookmarks}
 *   onRemove={removeBookmark}
 *   onClearAll={clearBookmarks}
 * />
 * ```
 */
export function BookmarksDropdown({
  bookmarks,
  onRemove,
  onClearAll,
  className,
}: BookmarksDropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const handleRemove = useCallback(
    (e: React.MouseEvent, agentId: string) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove(agentId);
    },
    [onRemove],
  );

  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClearAll();
      closeDropdown();
    },
    [onClearAll, closeDropdown],
  );

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-3 py-2 border-2 transition-all duration-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)]',
          isOpen || bookmarks.length > 0
            ? 'border-[var(--pixel-gold-coin)] text-[var(--pixel-gold-coin)]'
            : 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gold-coin)] hover:text-[var(--pixel-gold-coin)]',
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Bookmarks (${bookmarks.length})`}
        data-testid="bookmarks-dropdown-trigger"
      >
        <Bookmark size={18} aria-hidden="true" />
        {bookmarks.length > 0 && <span className="font-mono text-sm">{bookmarks.length}</span>}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 z-50 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          role="menu"
          aria-orientation="vertical"
          data-testid="bookmarks-dropdown-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--pixel-gray-700)]">
            <h3 className="text-pixel-title text-sm text-[var(--pixel-gold-coin)] uppercase tracking-wider">
              Bookmarks
            </h3>
            <button
              type="button"
              onClick={closeDropdown}
              className="text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] transition-colors"
              aria-label="Close bookmarks"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          {bookmarks.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bookmark
                size={32}
                className="mx-auto mb-3 text-[var(--pixel-gray-600)]"
                aria-hidden="true"
              />
              <p className="text-sm text-[var(--pixel-gray-400)] font-mono">No bookmarks yet</p>
              <p className="text-xs text-[var(--pixel-gray-500)] mt-1">
                Click the bookmark icon on agents to save them
              </p>
            </div>
          ) : (
            <>
              {/* Bookmarks List */}
              <div className="max-h-64 overflow-y-auto">
                {bookmarks.map((bookmark) => (
                  <Link
                    key={bookmark.agentId}
                    href={`/agent/${bookmark.agentId}`}
                    onClick={closeDropdown}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--pixel-gray-800)] transition-colors group"
                    role="menuitem"
                    data-testid={`bookmark-item-${bookmark.agentId}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--pixel-white)] truncate font-medium">
                          {bookmark.name}
                        </span>
                        <ChainBadge chainId={bookmark.chainId as ChainId} />
                      </div>
                      {bookmark.description && (
                        <p className="text-xs text-[var(--pixel-gray-500)] truncate mt-0.5">
                          {bookmark.description}
                        </p>
                      )}
                      <p className="text-xs text-[var(--pixel-gray-600)] mt-1">
                        Saved {formatDate(bookmark.bookmarkedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, bookmark.agentId)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[var(--pixel-gray-500)] hover:text-[var(--pixel-red-fire)] transition-all"
                      aria-label={`Remove ${bookmark.name} from bookmarks`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t-2 border-[var(--pixel-gray-700)] flex items-center justify-between">
                <Link
                  href="/bookmarks"
                  onClick={closeDropdown}
                  className="text-xs text-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-sky)] transition-colors flex items-center gap-1"
                >
                  View all
                  <ChevronRight size={12} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-[var(--pixel-gray-500)] hover:text-[var(--pixel-red-fire)] transition-colors"
                >
                  Clear all
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
