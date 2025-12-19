import { ChevronRight } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

export interface TreeNodeIndicatorProps {
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Whether the node has children */
  hasChildren: boolean;
  /** Size of the indicator */
  size?: 'sm' | 'md';
  /** Optional additional class names */
  className?: string;
}

/**
 * TreeNodeIndicator displays an expand/collapse chevron for tree structures.
 * Uses step-based animation for authentic 8-bit feel.
 *
 * @example
 * ```tsx
 * <TreeNodeIndicator isExpanded={true} hasChildren={true} />
 * <TreeNodeIndicator isExpanded={false} hasChildren={false} />
 * ```
 */
export function TreeNodeIndicator({
  isExpanded,
  hasChildren,
  size = 'sm',
  className,
}: TreeNodeIndicatorProps): React.JSX.Element {
  const iconSize = size === 'md' ? 16 : 12;

  if (!hasChildren) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center',
          size === 'md' ? 'w-4 h-4' : 'w-3 h-3',
          className,
        )}
        data-testid="tree-node-indicator"
        data-has-children="false"
      >
        <span className="w-1 h-1 bg-[var(--pixel-gray-600)] rounded-full" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'text-[var(--pixel-gray-400)]',
        'transition-transform duration-100',
        size === 'md' ? 'w-4 h-4' : 'w-3 h-3',
        isExpanded && 'rotate-90',
        className,
      )}
      style={{
        transitionTimingFunction: 'steps(2)',
      }}
      data-testid="tree-node-indicator"
      data-expanded={isExpanded}
      data-has-children="true"
    >
      <ChevronRight size={iconSize} aria-hidden="true" />
    </span>
  );
}
