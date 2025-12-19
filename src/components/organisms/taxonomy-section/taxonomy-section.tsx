'use client';

import { BookOpen, ChevronDown, Cpu } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { TaxonomyTag } from '@/components/molecules/taxonomy-tag';
import { resolveSlug } from '@/lib/constants/oasf';
import type { TaxonomyType } from '@/lib/constants/oasf/types';
import { cn } from '@/lib/utils';

export interface TaxonomySectionProps {
  /** Array of skill slugs */
  skills?: string[];
  /** Array of domain slugs */
  domains?: string[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

interface CategoryGroup {
  parentSlug: string;
  parentName: string;
  items: Array<{ slug: string; name: string; isChild: boolean }>;
}

/**
 * Groups taxonomy slugs by their parent category
 */
function groupByParent(slugs: string[], type: TaxonomyType): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();

  for (const slug of slugs) {
    const resolved = resolveSlug(slug, type);
    if (!resolved) {
      // Fallback for unknown slugs
      const parentSlug = slug.includes('/') ? slug.split('/')[0] : slug;
      const group = groups.get(parentSlug) || {
        parentSlug,
        parentName: formatSlugFallback(parentSlug),
        items: [],
      };
      group.items.push({
        slug,
        name: formatSlugFallback(slug),
        isChild: slug.includes('/'),
      });
      groups.set(parentSlug, group);
      continue;
    }

    const parentSlug = resolved.parent?.slug ?? resolved.category.slug;
    const parentName = resolved.parentName ?? resolved.name;
    const isChild = Boolean(resolved.parent);

    const group = groups.get(parentSlug) || {
      parentSlug,
      parentName,
      items: [],
    };

    group.items.push({
      slug,
      name: resolved.name,
      isChild,
    });
    groups.set(parentSlug, group);
  }

  return Array.from(groups.values()).sort((a, b) => a.parentName.localeCompare(b.parentName));
}

function formatSlugFallback(slug: string): string {
  const lastPart = slug.includes('/') ? (slug.split('/').pop() ?? slug) : slug;
  return lastPart
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface CollapsibleCategoryProps {
  type: TaxonomyType;
  groups: CategoryGroup[];
  title: string;
  icon: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleCategory({
  type,
  groups,
  title,
  icon,
  defaultExpanded = true,
}: CollapsibleCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (parentSlug: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(parentSlug)) {
        next.delete(parentSlug);
      } else {
        next.add(parentSlug);
      }
      return next;
    });
  };

  const colorClass =
    type === 'skill' ? 'text-[var(--taxonomy-skill)]' : 'text-[var(--taxonomy-domain)]';
  const borderClass =
    type === 'skill' ? 'border-[var(--taxonomy-skill)]/30' : 'border-[var(--taxonomy-domain)]/30';

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className={cn('border rounded-sm', borderClass)} data-testid={`taxonomy-section-${type}`}>
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2',
          'text-left',
          'hover:bg-[var(--pixel-gray-800)] transition-colors duration-100',
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        data-testid={`taxonomy-section-${type}-toggle`}
      >
        <ChevronDown
          size={14}
          className={cn(
            'transition-transform duration-100',
            !isExpanded && '-rotate-90',
            colorClass,
          )}
          style={{ transitionTimingFunction: 'steps(2)' }}
        />
        <span className={cn('flex items-center gap-1.5', colorClass)}>{icon}</span>
        <span
          className={cn('font-[family-name:var(--font-pixel-body)] text-xs uppercase', colorClass)}
        >
          {title}
        </span>
        <span className="text-[var(--pixel-gray-500)] text-xs ml-auto">({groups.length})</span>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-2" data-testid={`taxonomy-section-${type}-content`}>
          {groups.map((group) => {
            const hasChildren = group.items.some((item) => item.isChild);
            const isGroupExpanded = expandedGroups.has(group.parentSlug);

            if (!hasChildren) {
              // Single item or parent-only - just show tags
              return (
                <div key={group.parentSlug} className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <TaxonomyTag
                      key={item.slug}
                      slug={item.slug}
                      type={type}
                      showTooltip
                      size="md"
                    />
                  ))}
                </div>
              );
            }

            // Has children - show expandable group
            return (
              <div key={group.parentSlug} className="space-y-1.5">
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-1 text-xs',
                    'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
                    'transition-colors duration-100',
                  )}
                  onClick={() => toggleGroup(group.parentSlug)}
                  data-testid={`taxonomy-group-toggle-${group.parentSlug}`}
                >
                  <ChevronDown
                    size={12}
                    className={cn(
                      'transition-transform duration-100',
                      !isGroupExpanded && '-rotate-90',
                    )}
                    style={{ transitionTimingFunction: 'steps(2)' }}
                  />
                  <span className="font-mono">{group.parentName}</span>
                </button>

                {isGroupExpanded && (
                  <div className="flex flex-wrap gap-1.5 ml-4">
                    {group.items.map((item) => (
                      <TaxonomyTag
                        key={item.slug}
                        slug={item.slug}
                        type={type}
                        showTooltip
                        size="sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * TaxonomySection displays an agent's skills and domains in collapsible sections
 * with hierarchical grouping.
 *
 * @example
 * ```tsx
 * <TaxonomySection
 *   skills={['natural_language_processing', 'computer_vision/object_detection']}
 *   domains={['technology', 'healthcare/medical_research']}
 * />
 * ```
 */
export function TaxonomySection({
  skills = [],
  domains = [],
  isLoading = false,
  className,
}: TaxonomySectionProps): React.JSX.Element | null {
  const skillGroups = useMemo(() => groupByParent(skills, 'skill'), [skills]);
  const domainGroups = useMemo(() => groupByParent(domains, 'domain'), [domains]);

  const hasData = skills.length > 0 || domains.length > 0;

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)} data-testid="taxonomy-section-loading">
        <div className="h-10 bg-[var(--pixel-gray-800)] animate-pulse rounded-sm" />
        <div className="h-10 bg-[var(--pixel-gray-800)] animate-pulse rounded-sm" />
      </div>
    );
  }

  if (!hasData) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)} data-testid="taxonomy-section">
      {skills.length > 0 && (
        <CollapsibleCategory
          type="skill"
          groups={skillGroups}
          title="Skills"
          icon={<Cpu size={14} />}
          defaultExpanded={true}
        />
      )}

      {domains.length > 0 && (
        <CollapsibleCategory
          type="domain"
          groups={domainGroups}
          title="Domains"
          icon={<BookOpen size={14} />}
          defaultExpanded={true}
        />
      )}
    </div>
  );
}
