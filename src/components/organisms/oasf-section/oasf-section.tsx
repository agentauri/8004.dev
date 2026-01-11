'use client';

import { BookOpen, Bot, ChevronDown, Cpu, User } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { TaxonomyTag } from '@/components/molecules/taxonomy-tag';
import { resolveSlug } from '@/lib/constants/oasf';
import type { TaxonomyType } from '@/lib/constants/oasf/types';
import { cn } from '@/lib/utils';
import type { OASFItem } from '@/types/agent';
import type { OASFSource } from '@/types/backend';

export interface OasfSectionProps {
  /** LLM-classified skills (from oasf.skills) */
  classifiedSkills?: OASFItem[];
  /** LLM-classified domains (from oasf.domains) */
  classifiedDomains?: OASFItem[];
  /** Creator-declared skill slugs (from declaredOasfSkills) */
  declaredSkills?: string[];
  /** Creator-declared domain slugs (from declaredOasfDomains) */
  declaredDomains?: string[];
  /** Source of the OASF classification */
  oasfSource?: OASFSource;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

interface CategoryGroup {
  parentSlug: string;
  parentName: string;
  items: Array<{ slug: string; name: string; isChild: boolean; confidence?: number }>;
}

/**
 * Groups taxonomy slugs by their parent category
 */
function groupByParent(
  slugs: string[],
  type: TaxonomyType,
  confidenceMap?: Map<string, number>,
): CategoryGroup[] {
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
        confidence: confidenceMap?.get(slug),
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
      confidence: confidenceMap?.get(slug),
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

interface SourceBadgeProps {
  source: 'creator' | 'ai';
}

function SourceBadge({ source }: SourceBadgeProps): React.JSX.Element {
  if (source === 'creator') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 text-[0.625rem] uppercase tracking-wide',
          'bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)]',
          'border border-[var(--pixel-green-pipe)]/30 rounded-sm',
          'font-[family-name:var(--font-pixel-body)]',
        )}
      >
        <User size={10} aria-hidden="true" />
        Creator Declared
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[0.625rem] uppercase tracking-wide',
        'bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-text)]',
        'border border-[var(--pixel-blue-sky)]/30 rounded-sm',
        'font-[family-name:var(--font-pixel-body)]',
      )}
    >
      <Bot size={10} aria-hidden="true" />
      AI Classified
    </span>
  );
}

interface CollapsibleCategoryProps {
  type: TaxonomyType;
  groups: CategoryGroup[];
  title: string;
  icon: React.ReactNode;
  defaultExpanded?: boolean;
  showConfidence?: boolean;
}

function CollapsibleCategory({
  type,
  groups,
  title,
  icon,
  defaultExpanded = true,
  showConfidence = false,
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

  // Suppress unused variable warning - showConfidence is reserved for future use
  void showConfidence;

  return (
    <div className={cn('border rounded-sm', borderClass)} data-testid={`oasf-section-${type}`}>
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2',
          'text-left',
          'hover:bg-[var(--pixel-gray-800)] transition-colors duration-100',
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        data-testid={`oasf-section-${type}-toggle`}
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
        <div className="px-3 pb-3 pt-1 space-y-2" data-testid={`oasf-section-${type}-content`}>
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
                  data-testid={`oasf-group-toggle-${group.parentSlug}`}
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

interface OasfGroupProps {
  source: 'creator' | 'ai';
  skills: string[];
  domains: string[];
  skillConfidenceMap?: Map<string, number>;
  domainConfidenceMap?: Map<string, number>;
}

function OasfGroup({
  source,
  skills,
  domains,
  skillConfidenceMap,
  domainConfidenceMap,
}: OasfGroupProps): React.JSX.Element | null {
  const skillGroups = useMemo(
    () => groupByParent(skills, 'skill', skillConfidenceMap),
    [skills, skillConfidenceMap],
  );
  const domainGroups = useMemo(
    () => groupByParent(domains, 'domain', domainConfidenceMap),
    [domains, domainConfidenceMap],
  );

  const hasData = skills.length > 0 || domains.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="space-y-3" data-testid={`oasf-group-${source}`}>
      <div className="flex items-center gap-2 mb-2">
        <SourceBadge source={source} />
      </div>

      {skills.length > 0 && (
        <CollapsibleCategory
          type="skill"
          groups={skillGroups}
          title="Skills"
          icon={<Cpu size={14} />}
          defaultExpanded={true}
          showConfidence={source === 'ai'}
        />
      )}

      {domains.length > 0 && (
        <CollapsibleCategory
          type="domain"
          groups={domainGroups}
          title="Domains"
          icon={<BookOpen size={14} />}
          defaultExpanded={true}
          showConfidence={source === 'ai'}
        />
      )}
    </div>
  );
}

/**
 * OasfSection displays an agent's skills and domains, distinguishing between
 * creator-declared and AI-classified OASF taxonomy entries.
 *
 * - Shows "Creator Declared" badge for skills/domains from declaredOasfSkills/declaredOasfDomains
 * - Shows "AI Classified" badge for skills/domains from oasf.skills/oasf.domains
 * - If both exist, shows both sections
 * - If only one exists, shows just that one
 *
 * @example
 * ```tsx
 * <OasfSection
 *   classifiedSkills={agent.oasf?.skills}
 *   classifiedDomains={agent.oasf?.domains}
 *   declaredSkills={agent.declaredOasfSkills}
 *   declaredDomains={agent.declaredOasfDomains}
 *   oasfSource={agent.oasfSource}
 * />
 * ```
 */
export function OasfSection({
  classifiedSkills = [],
  classifiedDomains = [],
  declaredSkills = [],
  declaredDomains = [],
  oasfSource,
  isLoading = false,
  className,
}: OasfSectionProps): React.JSX.Element | null {
  // Suppress unused variable warning - oasfSource may be used in future
  void oasfSource;

  // Build confidence maps for classified items
  const skillConfidenceMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of classifiedSkills) {
      map.set(s.slug, s.confidence);
    }
    return map;
  }, [classifiedSkills]);

  const domainConfidenceMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of classifiedDomains) {
      map.set(d.slug, d.confidence);
    }
    return map;
  }, [classifiedDomains]);

  // Extract slugs from classified items
  const classifiedSkillSlugs = useMemo(
    () => classifiedSkills.map((s) => s.slug),
    [classifiedSkills],
  );
  const classifiedDomainSlugs = useMemo(
    () => classifiedDomains.map((d) => d.slug),
    [classifiedDomains],
  );

  const hasClassified = classifiedSkillSlugs.length > 0 || classifiedDomainSlugs.length > 0;
  const hasDeclared = declaredSkills.length > 0 || declaredDomains.length > 0;
  const hasData = hasClassified || hasDeclared;

  if (isLoading) {
    return (
      <div
        className={cn(
          'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] space-y-3',
          className,
        )}
        data-testid="oasf-section-loading"
      >
        <div className="h-6 w-32 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
        <div className="h-10 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
        <div className="h-10 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
      </div>
    );
  }

  if (!hasData) {
    return null;
  }

  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="oasf-section"
    >
      <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
        OASF TAXONOMY
      </h2>

      <div className="space-y-6">
        {/* Creator Declared section - show first if exists */}
        {hasDeclared && (
          <OasfGroup source="creator" skills={declaredSkills} domains={declaredDomains} />
        )}

        {/* AI Classified section */}
        {hasClassified && (
          <OasfGroup
            source="ai"
            skills={classifiedSkillSlugs}
            domains={classifiedDomainSlugs}
            skillConfidenceMap={skillConfidenceMap}
            domainConfidenceMap={domainConfidenceMap}
          />
        )}
      </div>
    </div>
  );
}
