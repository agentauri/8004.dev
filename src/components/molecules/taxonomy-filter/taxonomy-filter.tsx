'use client';

import { BookOpen, ChevronDown, Cpu, Search } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { getDomainTree, getSkillTree } from '@/lib/constants/oasf';
import type { TaxonomyType } from '@/lib/constants/oasf/types';
import { cn } from '@/lib/utils';

import { FilterNode } from './filter-node';

export interface TaxonomyFilterProps {
  /** Type of taxonomy (skill or domain) */
  type: TaxonomyType;
  /** Currently selected slugs */
  selected: string[];
  /** Callback when selection changes */
  onChange: (selected: string[]) => void;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Whether the filter section is expanded by default */
  defaultExpanded?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * TaxonomyFilter provides a filterable, expandable tree with checkboxes
 * for selecting taxonomy categories.
 *
 * @example
 * ```tsx
 * <TaxonomyFilter
 *   type="skill"
 *   selected={['natural_language_processing']}
 *   onChange={setSelected}
 * />
 * ```
 */
export function TaxonomyFilter({
  type,
  selected,
  onChange,
  disabled = false,
  defaultExpanded = false,
  className,
}: TaxonomyFilterProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    return type === 'skill' ? getSkillTree() : getDomainTree();
  }, [type]);

  const handleToggleExpand = (slug: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const handleToggleSelect = (slug: string) => {
    const newSelected = selected.includes(slug)
      ? selected.filter((s) => s !== slug)
      : [...selected, slug];
    onChange(newSelected);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const colorClass =
    type === 'skill' ? 'text-[var(--taxonomy-skill)]' : 'text-[var(--taxonomy-domain)]';
  const borderClass =
    type === 'skill' ? 'border-[var(--taxonomy-skill)]/30' : 'border-[var(--taxonomy-domain)]/30';
  const Icon = type === 'skill' ? Cpu : BookOpen;
  const title = type === 'skill' ? 'Skills' : 'Domains';

  return (
    <div
      className={cn('space-y-2', disabled && 'opacity-50 pointer-events-none', className)}
      data-testid={`taxonomy-filter-${type}`}
    >
      {/* Header */}
      <button
        type="button"
        className="w-full flex items-center gap-2 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid={`taxonomy-filter-${type}-toggle`}
      >
        <ChevronDown
          size={12}
          className={cn(
            'transition-transform duration-100 text-[var(--pixel-gray-400)]',
            !isExpanded && '-rotate-90',
          )}
          style={{ transitionTimingFunction: 'steps(2)' }}
        />
        <Icon size={14} className={colorClass} />
        <span
          className={cn(
            'text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider',
          )}
        >
          {title}
        </span>
        {selected.length > 0 && (
          <span className={cn('text-[0.625rem] ml-auto', colorClass)}>({selected.length})</span>
        )}
      </button>

      {isExpanded && (
        <div className={cn('border rounded-sm p-2 space-y-2', borderClass)}>
          {/* Search */}
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--pixel-gray-500)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className={cn(
                'w-full pl-7 pr-2 py-1.5',
                'bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
                'text-[var(--pixel-gray-200)] text-sm font-mono',
                'placeholder:text-[var(--pixel-gray-500)]',
                'focus:outline-none focus:border-[var(--pixel-gray-500)]',
              )}
              data-testid={`taxonomy-filter-${type}-search`}
            />
          </div>

          {/* Clear button */}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)] text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase"
              data-testid={`taxonomy-filter-${type}-clear`}
            >
              Clear selection
            </button>
          )}

          {/* Tree */}
          <div
            className="max-h-64 overflow-y-auto scrollbar-thin"
            data-testid={`taxonomy-filter-${type}-tree`}
          >
            {categories.map((category) => (
              <FilterNode
                key={category.id}
                category={category}
                type={type}
                depth={0}
                selected={selected}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
                onToggleSelect={handleToggleSelect}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
