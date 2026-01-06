'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface BookmarkButtonProps {
  /** Whether the item is currently bookmarked */
  isBookmarked: boolean;
  /** Callback when bookmark is toggled */
  onToggle: () => void;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Optional additional class names */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

const SIZE_CONFIG = {
  xs: { button: 'p-1.5', icon: 14 },
  sm: { button: 'p-2', icon: 16 },
  md: { button: 'p-2.5 min-w-[44px] min-h-[44px]', icon: 18 },
  lg: { button: 'p-3 min-w-[44px] min-h-[44px]', icon: 20 },
};

/**
 * BookmarkButton provides a toggle button for bookmarking/unbookmarking items.
 *
 * @example
 * ```tsx
 * <BookmarkButton
 *   isBookmarked={isBookmarked}
 *   onToggle={() => toggleBookmark(agentId)}
 * />
 * ```
 */
export function BookmarkButton({
  isBookmarked,
  onToggle,
  size = 'md',
  className,
  label,
  disabled = false,
}: BookmarkButtonProps): React.JSX.Element {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Prevent click from propagating to parent elements (e.g., Link in AgentCard)
      e.stopPropagation();
      e.preventDefault();

      if (!disabled) {
        onToggle();
      }
    },
    [onToggle, disabled],
  );

  const sizeConfig = SIZE_CONFIG[size];
  const accessibleLabel = label ?? (isBookmarked ? 'Remove bookmark' : 'Add bookmark');

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center border-2 transition-all duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)]',
        disabled && 'opacity-50 cursor-not-allowed',
        isBookmarked
          ? 'border-[var(--pixel-gold-coin)] text-[var(--pixel-gold-coin)] shadow-[0_0_8px_var(--glow-gold)] hover:bg-[rgba(252,192,60,0.2)]'
          : 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gold-coin)] hover:text-[var(--pixel-gold-coin)] hover:shadow-[0_0_8px_var(--glow-gold)] hover:bg-[rgba(252,192,60,0.1)]',
        sizeConfig.button,
        className,
      )}
      aria-label={accessibleLabel}
      aria-pressed={isBookmarked}
      data-testid="bookmark-button"
      data-bookmarked={isBookmarked}
    >
      {isBookmarked ? (
        <BookmarkCheck size={sizeConfig.icon} aria-hidden="true" />
      ) : (
        <Bookmark size={sizeConfig.icon} aria-hidden="true" />
      )}
    </button>
  );
}
