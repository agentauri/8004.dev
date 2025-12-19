import type React from 'react';
import { cn } from '@/lib/utils';

export interface FeedbackTagsProps {
  /** Array of tag strings */
  tags: string[];
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Maximum number of tags to display (rest will be shown as +N) */
  maxTags?: number;
  /** Optional additional class names */
  className?: string;
}

const SIZE_CONFIG = {
  sm: 'text-[0.5rem] px-1.5 py-0.5',
  md: 'text-[0.625rem] px-2 py-1',
  lg: 'text-[0.75rem] px-3 py-1.5',
};

/**
 * FeedbackTags displays a list of styled tags for feedback entries.
 * Tags are styled with retro pixel aesthetic.
 *
 * @example
 * ```tsx
 * <FeedbackTags tags={['reliable', 'fast', 'accurate']} />
 * <FeedbackTags tags={['responsive', 'helpful']} maxTags={2} />
 * ```
 */
export function FeedbackTags({
  tags,
  size = 'md',
  maxTags,
  className,
}: FeedbackTagsProps): React.JSX.Element {
  const sizeClass = SIZE_CONFIG[size];
  const visibleTags = maxTags && tags.length > maxTags ? tags.slice(0, maxTags) : tags;
  const hiddenCount = maxTags && tags.length > maxTags ? tags.length - maxTags : 0;

  if (tags.length === 0) {
    return (
      <div
        className={cn('flex flex-wrap gap-1', className)}
        data-testid="feedback-tags"
        data-count="0"
      >
        <span
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-500)] italic',
            sizeClass,
          )}
        >
          No tags
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn('flex flex-wrap gap-1', className)}
      data-testid="feedback-tags"
      data-count={tags.length}
    >
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center font-[family-name:var(--font-pixel-body)] uppercase',
            'bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-200)]',
            'border border-[var(--pixel-gray-600)]',
            sizeClass,
          )}
          data-tag={tag}
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center font-[family-name:var(--font-pixel-body)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-400)]',
            'border border-[var(--pixel-gray-600)]',
            sizeClass,
          )}
          data-testid="hidden-count"
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
