'use client';

import type React from 'react';
import { TreeNodeIndicator } from '@/components/atoms/tree-node-indicator';
import type { TaxonomyCategory, TaxonomyType } from '@/lib/constants/oasf/types';
import { cn } from '@/lib/utils';

export interface TaxonomyTreeNodeProps {
  /** The taxonomy category to display */
  category: TaxonomyCategory;
  /** Type of taxonomy (skill or domain) */
  type: TaxonomyType;
  /** Nesting depth (0 = root) */
  depth: number;
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Whether the node is currently selected */
  isSelected?: boolean;
  /** Callback when expand/collapse is toggled */
  onToggle: () => void;
  /** Callback when node is selected/clicked */
  onSelect?: (category: TaxonomyCategory) => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * TaxonomyTreeNode displays a single node in a hierarchical taxonomy tree.
 * Handles expand/collapse for parent nodes and selection.
 *
 * @example
 * ```tsx
 * <TaxonomyTreeNode
 *   category={category}
 *   type="skill"
 *   depth={0}
 *   isExpanded={expanded}
 *   onToggle={() => setExpanded(!expanded)}
 *   onSelect={(cat) => console.log('Selected:', cat.name)}
 * />
 * ```
 */
export function TaxonomyTreeNode({
  category,
  type,
  depth,
  isExpanded,
  isSelected = false,
  onToggle,
  onSelect,
  className,
}: TaxonomyTreeNodeProps): React.JSX.Element {
  const hasChildren = Boolean(category.children && category.children.length > 0);
  const indentPadding = depth * 16;

  const handleIndicatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle();
    }
  };

  const handleNodeClick = () => {
    onSelect?.(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.key === ' ' && hasChildren) {
        onToggle();
      } else {
        onSelect?.(category);
      }
    }
    if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      e.preventDefault();
      onToggle();
    }
    if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
      e.preventDefault();
      onToggle();
    }
  };

  const colorClass =
    type === 'skill' ? 'text-[var(--taxonomy-skill)]' : 'text-[var(--taxonomy-domain)]';
  const selectedBgClass =
    type === 'skill'
      ? 'bg-[var(--taxonomy-skill)]/10 border-[var(--taxonomy-skill)]/30'
      : 'bg-[var(--taxonomy-domain)]/10 border-[var(--taxonomy-domain)]/30';

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        'py-1 px-2 rounded cursor-pointer',
        'border border-transparent',
        'transition-colors duration-100',
        'hover:bg-[var(--pixel-gray-800)]',
        isSelected && selectedBgClass,
        className,
      )}
      style={{ paddingLeft: `${indentPadding + 8}px` }}
      onClick={handleNodeClick}
      onKeyDown={handleKeyDown}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={0}
      data-testid="taxonomy-tree-node"
      data-slug={category.slug}
      data-depth={depth}
      data-type={type}
    >
      <span
        onClick={handleIndicatorClick}
        className="flex-shrink-0"
        data-testid="taxonomy-tree-node-indicator"
      >
        <TreeNodeIndicator isExpanded={isExpanded} hasChildren={hasChildren} size="sm" />
      </span>

      <span
        className={cn(
          'text-sm font-mono truncate',
          isSelected ? colorClass : 'text-[var(--pixel-gray-300)]',
          'hover:text-[var(--pixel-gray-100)]',
        )}
        data-testid="taxonomy-tree-node-name"
      >
        {category.name}
      </span>

      {hasChildren && (
        <span
          className="text-[var(--pixel-gray-500)] text-xs ml-auto flex-shrink-0"
          data-testid="taxonomy-tree-node-count"
        >
          ({category.children?.length})
        </span>
      )}
    </div>
  );
}
