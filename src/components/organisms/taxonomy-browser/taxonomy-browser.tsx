'use client';

import { useCallback, useState } from 'react';
import { SearchInput } from '@/components/molecules';
import { TaxonomyTree } from '@/components/organisms/taxonomy-tree';
import type { TaxonomyCategory, TaxonomyType } from '@/lib/constants/oasf';
import { cn } from '@/lib/utils';

export interface TaxonomyBrowserProps {
  /** Callback when a category is selected */
  onCategorySelect?: (category: TaxonomyCategory, type: TaxonomyType) => void;
  /** Default tab to show */
  defaultTab?: TaxonomyType;
  /** Additional CSS classes */
  className?: string;
}

const TABS: { value: TaxonomyType; label: string }[] = [
  { value: 'skill', label: 'Skills' },
  { value: 'domain', label: 'Domains' },
];

/**
 * TaxonomyBrowser provides a tabbed interface to browse OASF taxonomy.
 *
 * @example
 * ```tsx
 * <TaxonomyBrowser
 *   onCategorySelect={(cat, type) => navigate(`/explore?${type}s=${cat.slug}`)}
 * />
 * ```
 */
export function TaxonomyBrowser({
  onCategorySelect,
  defaultTab = 'skill',
  className,
}: TaxonomyBrowserProps) {
  const [activeTab, setActiveTab] = useState<TaxonomyType>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = useCallback(
    (category: TaxonomyCategory) => {
      onCategorySelect?.(category, activeTab);
    },
    [activeTab, onCategorySelect],
  );

  return (
    <div className={cn('space-y-6', className)} data-testid="taxonomy-browser">
      {/* Header with tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2" role="tablist" data-testid="taxonomy-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setSearchQuery(''); // Clear search when switching tabs
              }}
              className={cn(
                'px-4 py-2 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
                'border-2 transition-all',
                activeTab === tab.value
                  ? tab.value === 'skill'
                    ? 'bg-[var(--taxonomy-skill)] border-[var(--taxonomy-skill)] text-white'
                    : 'bg-[var(--taxonomy-domain)] border-[var(--taxonomy-domain)] text-white'
                  : 'bg-transparent border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-500)] hover:text-[var(--pixel-gray-200)]',
              )}
              data-testid={`tab-${tab.value}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full md:w-64">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${activeTab}s...`}
          />
        </div>
      </div>

      {/* Description */}
      <div className="text-[var(--pixel-gray-400)] text-sm">
        {activeTab === 'skill' ? (
          <p>
            Skills define what an agent can do - their capabilities and areas of expertise. Click a
            category to filter agents by that skill.
          </p>
        ) : (
          <p>
            Domains describe the industries and fields where an agent operates. Click a category to
            filter agents by that domain.
          </p>
        )}
      </div>

      {/* Tree view */}
      <div className="min-h-[400px]" data-testid="taxonomy-browser-content">
        <TaxonomyTree
          type={activeTab}
          searchQuery={searchQuery}
          onCategoryClick={handleCategoryClick}
        />
      </div>
    </div>
  );
}
