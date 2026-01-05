'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Suspense, useCallback, useMemo } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { WorkflowVisualizer } from '@/components/organisms';
import { useIntent, useIntentMatches } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Get category color classes based on category name
 */
function getCategoryColor(category: string): {
  bg: string;
  text: string;
  glow: string;
} {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('automation') || categoryLower.includes('auto')) {
    return {
      bg: 'bg-[var(--pixel-green-pipe)]/20',
      text: 'text-[var(--pixel-green-pipe)]',
      glow: 'shadow-[0_0_8px_var(--glow-green)]',
    };
  }
  if (categoryLower.includes('development') || categoryLower.includes('dev')) {
    return {
      bg: 'bg-[var(--pixel-blue-sky)]/20',
      text: 'text-[var(--pixel-blue-sky)]',
      glow: 'shadow-[0_0_8px_var(--glow-blue)]',
    };
  }
  if (categoryLower.includes('security') || categoryLower.includes('audit')) {
    return {
      bg: 'bg-[var(--pixel-red-fire)]/20',
      text: 'text-[var(--pixel-red-fire)]',
      glow: 'shadow-[0_0_8px_var(--glow-red)]',
    };
  }
  if (categoryLower.includes('analysis') || categoryLower.includes('data')) {
    return {
      bg: 'bg-[var(--pixel-gold-coin)]/20',
      text: 'text-[var(--pixel-gold-coin)]',
      glow: 'shadow-[0_0_8px_var(--glow-gold)]',
    };
  }

  // Default purple
  return {
    bg: 'bg-[#9C54FC]/20',
    text: 'text-[#9C54FC]',
    glow: 'shadow-[0_0_8px_rgba(156,84,252,0.5)]',
  };
}

/**
 * Intent detail page content
 */
function IntentDetailContent(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: template, isLoading, error } = useIntent(id);
  const {
    mutate: matchAgents,
    isPending: isMatching,
    error: matchError,
  } = useIntentMatches(id);

  // Always use the template from the query cache - the mutation updates the cache
  // with matchedAgents while preserving all other template data
  const displayTemplate = template;

  // Build matched agents map from role to agent ID
  const matchedAgentsMap = useMemo(() => {
    if (!displayTemplate?.matchedAgents || !displayTemplate.steps) {
      return {};
    }

    const map: Record<string, string> = {};
    displayTemplate.steps.forEach((step, index) => {
      if (displayTemplate.matchedAgents?.[index]) {
        map[step.requiredRole] = displayTemplate.matchedAgents[index];
      }
    });
    return map;
  }, [displayTemplate]);

  const handleMatchAgents = useCallback(() => {
    matchAgents();
  }, [matchAgents]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <PixelExplorer size="lg" animation="bounce" />
        <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
          Loading Template...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    throw error;
  }

  // Not found
  if (!displayTemplate) {
    notFound();
  }

  const categoryColors = getCategoryColor(displayTemplate.category);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/intents"
          className="text-[var(--pixel-gray-400)] hover:text-[var(--pixel-blue-sky)] transition-colors font-[family-name:var(--font-pixel-body)] uppercase tracking-wider text-xs"
        >
          Intent Templates
        </Link>
        <span className="text-[var(--pixel-gray-600)]">/</span>
        <span className="text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)] uppercase tracking-wider text-xs truncate">
          {displayTemplate.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={cn(
                'px-2 py-0.5 text-[0.625rem] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]',
                categoryColors.bg,
                categoryColors.text,
              )}
            >
              {displayTemplate.category}
            </span>
            <span className="text-[var(--pixel-gray-500)] text-xs font-mono">
              ID: {displayTemplate.id}
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl md:text-3xl text-[var(--pixel-gray-100)] shadow-[0_0_20px_var(--glow-blue)]">
            {displayTemplate.name}
          </h1>

          <p className="text-[var(--pixel-gray-400)] mt-3 max-w-2xl">
            {displayTemplate.description}
          </p>
        </div>

        <button
          type="button"
          onClick={handleMatchAgents}
          disabled={isMatching}
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
            'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
            'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
            'hover:shadow-[0_0_12px_var(--glow-green)] transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isMatching ? 'Matching...' : 'Match Agents'}
        </button>
      </div>

      {/* Match error */}
      {matchError && (
        <div className="p-4 bg-[rgba(252,84,84,0.1)] border-2 border-[var(--pixel-red-fire)] text-[var(--pixel-red-fire)]">
          <span className="font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider">
            Match Error:
          </span>{' '}
          <span className="font-mono text-sm">{matchError.message}</span>
        </div>
      )}

      {/* Matched agents summary */}
      {displayTemplate.matchedAgents && displayTemplate.matchedAgents.length > 0 && (
        <div className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-green-pipe)]">
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-green-pipe)] mb-3">
            Matched Agents
          </h3>
          <div className="flex flex-wrap gap-2">
            {displayTemplate.matchedAgents.map((agentId, index) => (
              <Link
                key={agentId}
                href={`/agent/${agentId}`}
                className={cn(
                  'px-3 py-1.5 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
                  'text-[var(--pixel-gray-200)] font-mono text-sm',
                  'hover:border-[var(--pixel-green-pipe)] hover:text-[var(--pixel-green-pipe)]',
                  'transition-colors',
                )}
              >
                <span className="text-[var(--pixel-gray-500)] text-xs uppercase mr-2">
                  {displayTemplate.steps[index]?.requiredRole}:
                </span>
                {agentId}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Required roles */}
      <div className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]">
        <h3 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-200)] mb-3">
          Required Roles
        </h3>
        <div className="flex flex-wrap gap-2">
          {displayTemplate.requiredRoles.map((role) => {
            const isMatched = matchedAgentsMap[role];
            return (
              <span
                key={role}
                className={cn(
                  'px-2 py-1 text-xs uppercase tracking-wider font-[family-name:var(--font-pixel-body)]',
                  isMatched
                    ? 'bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)] border border-[var(--pixel-green-pipe)]'
                    : 'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-300)] border border-[var(--pixel-gray-700)]',
                )}
              >
                {role}
                {isMatched && <span className="ml-1 text-[0.5rem]">(matched)</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Workflow visualization */}
      <div>
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-100)] mb-4">
          Workflow Steps
        </h2>
        <WorkflowVisualizer steps={displayTemplate.steps} matchedAgents={matchedAgentsMap} />
      </div>
    </div>
  );
}

/**
 * Intent detail page.
 * Shows full workflow visualization, required roles, and matched agents.
 */
export default function IntentDetailPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <PixelExplorer size="lg" animation="bounce" />
          <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
            Loading Template...
          </p>
        </div>
      }
    >
      <IntentDetailContent />
    </Suspense>
  );
}
