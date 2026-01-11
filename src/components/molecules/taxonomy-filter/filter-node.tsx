/**
 * FilterNode - Recursive tree node component for TaxonomyFilter
 */

import { useMemo } from 'react';
import { TreeNodeIndicator } from '@/components/atoms/tree-node-indicator';
import type { TaxonomyCategory, TaxonomyType } from '@/lib/constants/oasf/types';
import { cn } from '@/lib/utils';

export interface FilterNodeProps {
  category: TaxonomyCategory;
  type: TaxonomyType;
  depth: number;
  selected: string[];
  expandedNodes: Set<string>;
  onToggleExpand: (slug: string) => void;
  onToggleSelect: (slug: string) => void;
  searchQuery: string;
  parentSlug?: string;
}

export function FilterNode({
  category,
  type,
  depth,
  selected,
  expandedNodes,
  onToggleExpand,
  onToggleSelect,
  searchQuery,
  parentSlug,
}: FilterNodeProps): React.JSX.Element | null {
  const fullSlug = parentSlug ? `${parentSlug}/${category.slug}` : category.slug;
  const hasChildren = Boolean(category.children && category.children.length > 0);
  const isExpanded = expandedNodes.has(fullSlug);
  const isSelected = selected.includes(fullSlug);
  const indentPadding = depth * 16;

  // Check if this node or any children match the search
  const matchesSearch = useMemo(() => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (category.name.toLowerCase().includes(query)) return true;
    if (category.children?.some((child) => child.name.toLowerCase().includes(query))) return true;
    return false;
  }, [category, searchQuery]);

  if (!matchesSearch) return null;

  const colorClass =
    type === 'skill' ? 'text-[var(--taxonomy-skill)]' : 'text-[var(--taxonomy-domain)]';

  const handleRowClick = () => {
    // Toggle selection on row click
    onToggleSelect(fullSlug);
    // Also expand if has children and not expanded
    if (hasChildren && !isExpanded) {
      onToggleExpand(fullSlug);
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-1.5 py-1.5 px-1 rounded',
          'hover:bg-[var(--pixel-gray-800)] transition-colors duration-100',
          'cursor-pointer',
        )}
        style={{ paddingLeft: `${indentPadding + 4}px` }}
        onClick={handleRowClick}
        data-testid={`taxonomy-filter-node-${fullSlug}`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(fullSlug);
            }}
            className="flex-shrink-0"
            data-testid={`taxonomy-filter-expand-${fullSlug}`}
          >
            <TreeNodeIndicator isExpanded={isExpanded} hasChildren={hasChildren} size="sm" />
          </button>
        ) : (
          <span className="w-3" />
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(fullSlug)}
            onClick={(e) => e.stopPropagation()} // Prevent row click from also triggering
            aria-label={`Select ${category.name}`}
            className={cn(
              'w-3.5 h-3.5 rounded-none border cursor-pointer',
              'bg-transparent',
              'accent-[var(--taxonomy-skill)]',
              type === 'domain' && 'accent-[var(--taxonomy-domain)]',
            )}
            data-testid={`taxonomy-filter-checkbox-${fullSlug}`}
          />
          <span
            className={cn(
              'text-sm font-mono truncate',
              isSelected ? colorClass : 'text-[var(--pixel-gray-300)]',
            )}
          >
            {category.name}
          </span>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {category.children?.map((child) => (
            <FilterNode
              key={child.id}
              category={child}
              type={type}
              depth={depth + 1}
              selected={selected}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
              searchQuery={searchQuery}
              parentSlug={fullSlug}
            />
          ))}
        </div>
      )}
    </>
  );
}
