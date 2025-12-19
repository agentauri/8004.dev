'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { TreeNodeIndicator } from '@/components/atoms';
import { TaxonomyBadge } from '@/components/atoms/taxonomy-badge';
import {
  getDomainTree,
  getSkillTree,
  searchTaxonomy,
  type TaxonomyCategory,
  type TaxonomyType,
} from '@/lib/constants/oasf';
import { cn } from '@/lib/utils';

export interface TaxonomyTreeProps {
  /** Type of taxonomy to display */
  type: TaxonomyType;
  /** Optional search query to filter the tree */
  searchQuery?: string;
  /** Callback when a category is clicked */
  onCategoryClick?: (category: TaxonomyCategory) => void;
  /** Additional CSS classes */
  className?: string;
}

interface TreeNodeProps {
  category: TaxonomyCategory;
  type: TaxonomyType;
  depth: number;
  expandedNodes: Set<string>;
  onToggle: (slug: string) => void;
  onSelect?: (category: TaxonomyCategory) => void;
  matchedSlugs?: Set<string>;
}

function TreeNode({
  category,
  type,
  depth,
  expandedNodes,
  onToggle,
  onSelect,
  matchedSlugs,
}: TreeNodeProps) {
  const hasChildren = (category.children?.length ?? 0) > 0;
  const isExpanded = expandedNodes.has(category.slug);
  const isMatched = matchedSlugs?.has(category.slug) ?? true;

  // Show node if it matches, or if any of its descendants match
  const hasMatchedDescendant = useMemo(() => {
    if (!matchedSlugs) return true;
    if (matchedSlugs.has(category.slug)) return true;
    if (!category.children) return false;
    const checkDescendants = (children: TaxonomyCategory[]): boolean => {
      return children.some(
        (child) =>
          matchedSlugs.has(child.slug) || (child.children && checkDescendants(child.children)),
      );
    };
    return checkDescendants(category.children);
  }, [category, matchedSlugs]);

  if (!isMatched && !hasMatchedDescendant) return null;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 py-1.5 px-2 rounded transition-colors',
          'hover:bg-[var(--pixel-gray-800)]',
          depth > 0 && 'ml-4',
        )}
        style={{ marginLeft: depth > 0 ? `${depth * 16}px` : undefined }}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggle(category.slug)}
          className={cn('flex-shrink-0', !hasChildren && 'invisible')}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <TreeNodeIndicator isExpanded={isExpanded} hasChildren={hasChildren} size="sm" />
        </button>
        <button
          type="button"
          onClick={() => onSelect?.(category)}
          className={cn(
            'flex items-center gap-2 flex-1 text-left transition-colors',
            'text-[var(--pixel-gray-300)] hover:text-[var(--pixel-gray-100)]',
            isMatched && matchedSlugs && 'font-semibold',
          )}
        >
          <TaxonomyBadge type={type} name={category.name} size="sm" />
          {category.description && (
            <span className="text-[var(--pixel-gray-500)] text-xs truncate hidden md:inline">
              {category.description}
            </span>
          )}
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              type={type}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onSelect={onSelect}
              matchedSlugs={matchedSlugs}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * TaxonomyTree displays a full hierarchical tree view of taxonomy categories.
 *
 * @example
 * ```tsx
 * <TaxonomyTree type="skill" onCategoryClick={(cat) => navigate(`/explore?skills=${cat.slug}`)} />
 * ```
 */
export function TaxonomyTree({ type, searchQuery, onCategoryClick, className }: TaxonomyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const tree = useMemo(() => {
    return type === 'skill' ? getSkillTree() : getDomainTree();
  }, [type]);

  // Get matched slugs when searching
  const matchedSlugs = useMemo(() => {
    if (!searchQuery?.trim()) return undefined;
    const results = searchTaxonomy(searchQuery, type);
    return new Set(results.map((r) => r.slug));
  }, [searchQuery, type]);

  // When searching, auto-expand matched nodes' parents
  useEffect(() => {
    if (matchedSlugs && matchedSlugs.size > 0) {
      const expanded = new Set<string>();
      matchedSlugs.forEach((slug) => {
        // Add parent slugs
        if (slug.includes('/')) {
          const parentSlug = slug.split('/')[0];
          expanded.add(parentSlug);
        }
      });
      setExpandedNodes(expanded);
    }
  }, [matchedSlugs]);

  const handleToggle = useCallback((slug: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    setAllExpanded(false);
  }, []);

  const handleExpandAll = useCallback(() => {
    const allSlugs = new Set<string>();
    const collectSlugs = (categories: TaxonomyCategory[]) => {
      for (const cat of categories) {
        if (cat.children && cat.children.length > 0) {
          allSlugs.add(cat.slug);
          collectSlugs(cat.children);
        }
      }
    };
    collectSlugs(tree);
    setExpandedNodes(allSlugs);
    setAllExpanded(true);
  }, [tree]);

  const handleCollapseAll = useCallback(() => {
    setExpandedNodes(new Set());
    setAllExpanded(false);
  }, []);

  const totalCategories = useMemo(() => {
    let count = 0;
    const countCategories = (categories: TaxonomyCategory[]) => {
      for (const cat of categories) {
        count++;
        if (cat.children) {
          countCategories(cat.children);
        }
      }
    };
    countCategories(tree);
    return count;
  }, [tree]);

  return (
    <div className={cn('space-y-4', className)} data-testid="taxonomy-tree">
      {/* Header with expand/collapse controls */}
      <div className="flex items-center justify-between">
        <div className="text-[var(--pixel-gray-400)] text-xs">
          {matchedSlugs
            ? `${matchedSlugs.size} of ${totalCategories} categories`
            : `${totalCategories} categories`}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExpandAll}
            className={cn(
              'text-xs px-2 py-1 rounded transition-colors',
              'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
              'border border-[var(--pixel-gray-700)] hover:border-[var(--pixel-gray-500)]',
              allExpanded && 'text-[var(--pixel-gray-200)] border-[var(--pixel-gray-500)]',
            )}
            data-testid="expand-all"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className={cn(
              'text-xs px-2 py-1 rounded transition-colors',
              'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
              'border border-[var(--pixel-gray-700)] hover:border-[var(--pixel-gray-500)]',
            )}
            data-testid="collapse-all"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree content */}
      <div className="space-y-1" data-testid="taxonomy-tree-content">
        {tree.map((category) => (
          <TreeNode
            key={category.id}
            category={category}
            type={type}
            depth={0}
            expandedNodes={expandedNodes}
            onToggle={handleToggle}
            onSelect={onCategoryClick}
            matchedSlugs={matchedSlugs}
          />
        ))}
      </div>

      {/* Empty state for search */}
      {matchedSlugs && matchedSlugs.size === 0 && (
        <div
          className="text-center py-8 text-[var(--pixel-gray-500)] text-sm"
          data-testid="no-results"
        >
          No categories match &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
