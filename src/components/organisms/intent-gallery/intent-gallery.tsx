'use client';

import type React from 'react';
import { memo, useMemo, useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { IntentCard, SearchInput } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { IntentTemplate } from '@/types';

export interface IntentGalleryProps {
  /** List of intent templates to display */
  templates: IntentTemplate[];
  /** Callback when a template is selected */
  onSelect?: (template: IntentTemplate) => void;
  /** Whether the gallery is in loading state */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Extract unique categories from templates
 */
function getCategories(templates: IntentTemplate[]): string[] {
  const categories = new Set(templates.map((t) => t.category));
  return ['all', ...Array.from(categories).sort()];
}

/**
 * IntentGallery displays a grid of intent template cards with
 * category filtering and search functionality.
 *
 * @example
 * ```tsx
 * <IntentGallery
 *   templates={templates}
 *   onSelect={(template) => router.push(`/intents/${template.id}`)}
 *   isLoading={false}
 * />
 * ```
 */
export const IntentGallery = memo(function IntentGallery({
  templates,
  onSelect,
  isLoading = false,
  className,
}: IntentGalleryProps): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => getCategories(templates), [templates]);

  // Filter templates by category and search query
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Category filter
      if (selectedCategory !== 'all' && template.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDescription = template.description.toLowerCase().includes(query);
        const matchesRoles = template.requiredRoles.some((role) =>
          role.toLowerCase().includes(query),
        );
        return matchesName || matchesDescription || matchesRoles;
      }

      return true;
    });
  }, [templates, selectedCategory, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center py-16', className)}
        data-testid="intent-gallery-loading"
      >
        <PixelExplorer size="md" animation="bounce" />
        <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-400)] mt-4 animate-pulse uppercase tracking-wider">
          Loading templates...
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} data-testid="intent-gallery">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search templates..."
            data-testid="intent-search"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="flex flex-wrap gap-2 border-b-2 border-[var(--pixel-gray-700)] pb-4"
        data-testid="intent-category-tabs"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-3 py-1.5 border-2 transition-all',
              selectedCategory === category
                ? 'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)] shadow-[0_0_8px_var(--glow-blue)]'
                : 'border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-500)] hover:text-[var(--pixel-gray-200)]',
            )}
            data-testid={`category-tab-${category}`}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-testid="intent-gallery-empty"
        >
          <PixelExplorer size="md" animation="float" />
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-200)] mt-6">
            No Templates Found
          </h3>
          <p className="font-mono text-sm text-[var(--pixel-gray-400)] mt-2 max-w-md">
            {searchQuery
              ? `No templates match "${searchQuery}". Try a different search term.`
              : selectedCategory !== 'all'
                ? `No templates in the "${selectedCategory}" category.`
                : 'No intent templates available at the moment.'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className={cn(
                'mt-6 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
                'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)]',
                'hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)]',
                'hover:shadow-[0_0_12px_var(--glow-blue)] transition-all',
              )}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Templates grid */}
      {filteredTemplates.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-testid="intent-grid"
        >
          {filteredTemplates.map((template) => (
            <IntentCard
              key={template.id}
              template={template}
              onClick={onSelect ? () => onSelect(template) : undefined}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredTemplates.length > 0 && (
        <div className="text-center text-[var(--pixel-gray-500)] text-xs font-mono">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      )}
    </div>
  );
});
