'use client';

import { TaxonomyBrowser } from '@/components/organisms/taxonomy-browser';
import type { TaxonomyCategory, TaxonomyType } from '@/lib/constants/oasf';
import { cn } from '@/lib/utils';

export interface TaxonomyTemplateProps {
  /** Callback when a category is selected */
  onCategorySelect?: (category: TaxonomyCategory, type: TaxonomyType) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * TaxonomyTemplate provides the page layout for the taxonomy browser.
 *
 * @example
 * ```tsx
 * <TaxonomyTemplate
 *   onCategorySelect={(cat, type) => navigate(`/explore?${type}s=${cat.slug}`)}
 * />
 * ```
 */
export function TaxonomyTemplate({ onCategorySelect, className }: TaxonomyTemplateProps) {
  return (
    <div
      className={cn('min-h-screen bg-[var(--pixel-black)] py-8', className)}
      data-testid="taxonomy-template"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Page header */}
        <header className="mb-8">
          <h1
            className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-2xl md:text-3xl uppercase tracking-wider mb-2"
            data-testid="taxonomy-title"
          >
            OASF Taxonomy
          </h1>
          <p className="text-[var(--pixel-gray-400)] text-sm md:text-base max-w-2xl">
            Browse the Open Agentic Schema Framework taxonomy. Skills define agent capabilities,
            while Domains describe their areas of operation.
          </p>
        </header>

        {/* Browser component */}
        <main>
          <TaxonomyBrowser onCategorySelect={onCategorySelect} />
        </main>

        {/* Footer info */}
        <footer className="mt-12 pt-8 border-t border-[var(--pixel-gray-800)]">
          <div className="text-[var(--pixel-gray-500)] text-xs space-y-2">
            <p>
              The OASF (Open Agentic Schema Framework) provides a standardized taxonomy for
              describing AI agent capabilities and domains.
            </p>
            <p>
              <a
                href="https://docs.agntcy.org/oasf/open-agentic-schema-framework/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--pixel-primary)] hover:underline"
              >
                Learn more about OASF
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
