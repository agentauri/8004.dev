'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { TaxonomyBadge } from '@/components/atoms/taxonomy-badge';
import { resolveSlug } from '@/lib/constants/oasf';
import type { TaxonomyType } from '@/lib/constants/oasf/types';
import { cn } from '@/lib/utils';

export interface TaxonomyTagProps {
  /** The taxonomy slug (e.g., "natural_language_processing/summarization") */
  slug: string;
  /** Type of taxonomy */
  type: TaxonomyType;
  /** Whether to show tooltip with full path on hover */
  showTooltip?: boolean;
  /** Visual variant */
  variant?: 'default' | 'outline';
  /** Whether to show the type icon */
  showIcon?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Optional additional class names */
  className?: string;
}

/**
 * TaxonomyTag resolves a taxonomy slug to its display name and shows
 * a tooltip with the full path on hover. Falls back to displaying the
 * raw slug if resolution fails.
 *
 * @example
 * ```tsx
 * <TaxonomyTag slug="natural_language_processing/summarization" type="skill" />
 * <TaxonomyTag slug="technology/blockchain" type="domain" showTooltip />
 * ```
 */
export function TaxonomyTag({
  slug,
  type,
  showTooltip = false,
  variant = 'default',
  showIcon = false,
  size = 'sm',
  className,
}: TaxonomyTagProps): React.JSX.Element {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('top');
  const containerRef = useRef<HTMLSpanElement>(null);

  const resolved = resolveSlug(slug, type);
  const displayName = resolved?.name ?? formatSlugFallback(slug);
  const fullPath = resolved?.fullPath ?? slug;

  useEffect(() => {
    if (isTooltipVisible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      setTooltipPosition(spaceAbove > spaceBelow || spaceAbove > 60 ? 'top' : 'bottom');
    }
  }, [isTooltipVisible]);

  const handleMouseEnter = () => {
    if (showTooltip) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  return (
    <span
      ref={containerRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="taxonomy-tag"
      data-type={type}
      data-slug={slug}
    >
      <TaxonomyBadge
        type={type}
        name={displayName}
        variant={variant}
        showIcon={showIcon}
        size={size}
      />

      {showTooltip && isTooltipVisible && (
        <span
          className={cn(
            'absolute left-1/2 -translate-x-1/2 z-50',
            'px-2 py-1',
            'bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-600)]',
            'text-[var(--pixel-gray-200)] text-xs whitespace-nowrap',
            'font-mono',
            tooltipPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
          )}
          role="tooltip"
          data-testid="taxonomy-tag-tooltip"
        >
          {fullPath}
          <span
            className={cn(
              'absolute left-1/2 -translate-x-1/2',
              'w-0 h-0 border-4 border-transparent',
              tooltipPosition === 'top'
                ? 'top-full border-t-[var(--pixel-gray-600)]'
                : 'bottom-full border-b-[var(--pixel-gray-600)]',
            )}
          />
        </span>
      )}
    </span>
  );
}

/**
 * Formats a slug as a fallback display name when resolution fails.
 * Converts underscores to spaces and capitalizes words.
 */
function formatSlugFallback(slug: string): string {
  const lastPart = slug.includes('/') ? (slug.split('/').pop() ?? slug) : slug;
  return lastPart
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
