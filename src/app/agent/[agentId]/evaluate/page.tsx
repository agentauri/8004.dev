'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { EvaluationCard } from '@/components/organisms';
import { useAgentEvaluations, useCreateEvaluation } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Breadcrumb navigation for agent evaluation page
 */
function Breadcrumb({ agentId }: { agentId: string }): React.JSX.Element {
  return (
    <nav
      className="flex items-center gap-2 text-[0.6875rem] font-mono text-[var(--pixel-gray-400)]"
      aria-label="Breadcrumb"
    >
      <Link href="/explore" className="hover:text-[var(--pixel-blue-sky)] transition-colors">
        Explore
      </Link>
      <span className="text-[var(--pixel-gray-600)]">/</span>
      <Link
        href={`/agent/${agentId}`}
        className="hover:text-[var(--pixel-blue-sky)] transition-colors"
      >
        Agent {agentId.split(':')[1]}
      </Link>
      <span className="text-[var(--pixel-gray-600)]">/</span>
      <span className="text-[var(--pixel-gray-300)]">Evaluations</span>
    </nav>
  );
}

/**
 * Loading skeleton for evaluation cards
 */
function EvaluationsSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-4 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="h-4 bg-[var(--pixel-gray-700)] rounded w-32" />
            <div className="h-5 bg-[var(--pixel-gray-700)] rounded w-20" />
          </div>
          <div className="h-16 bg-[var(--pixel-gray-800)] rounded mb-4" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
            <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
            <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
            <div className="h-8 bg-[var(--pixel-gray-700)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Agent evaluations page content
 */
function AgentEvaluateContent({ agentId }: { agentId: string }): React.JSX.Element {
  const [isCreating, setIsCreating] = useState(false);
  const { data: evaluations, isLoading, error } = useAgentEvaluations(agentId);
  const { mutate: createEvaluation, isPending: isCreatePending } = useCreateEvaluation();

  const handleCreateEvaluation = useCallback(() => {
    setIsCreating(true);
    createEvaluation(
      { agentId },
      {
        onSettled: () => {
          setIsCreating(false);
        },
      },
    );
  }, [agentId, createEvaluation]);

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb agentId={agentId} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-pixel-display)] text-xl md:text-2xl text-[var(--pixel-gray-100)] shadow-[0_0_20px_var(--glow-blue)]">
            AGENT EVALUATIONS
          </h1>
          <p className="font-mono text-xs text-[var(--pixel-gray-400)] mt-2">
            Agent ID: <span className="text-[var(--pixel-blue-sky)]">{agentId}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/agent/${agentId}`}
            className={cn(
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
              'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)]',
              'hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)] transition-all',
            )}
          >
            View Agent
          </Link>
          <button
            type="button"
            onClick={handleCreateEvaluation}
            disabled={isCreating || isCreatePending}
            className={cn(
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
              'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
              'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
              'hover:shadow-[0_0_12px_var(--glow-green)] transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            data-testid="create-evaluation-button"
          >
            {isCreating || isCreatePending ? 'Creating...' : '+ New Evaluation'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <EvaluationsSkeleton />}

      {/* Empty State */}
      {!isLoading && (!evaluations || evaluations.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]">
          <PixelExplorer size="md" animation="float" />
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-200)] mt-6">
            No Evaluations Yet
          </h3>
          <p className="font-mono text-sm text-[var(--pixel-gray-400)] mt-2 max-w-md">
            This agent has not been evaluated yet. Run an evaluation to see benchmark results.
          </p>
          <button
            type="button"
            onClick={handleCreateEvaluation}
            disabled={isCreating || isCreatePending}
            className={cn(
              'mt-6 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
              'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
              'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
              'hover:shadow-[0_0_12px_var(--glow-green)] transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isCreating || isCreatePending ? 'Creating...' : 'Run First Evaluation'}
          </button>
        </div>
      )}

      {/* Evaluations List */}
      {!isLoading && evaluations && evaluations.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-3 text-center">
              <span className="font-[family-name:var(--font-pixel-display)] text-xl text-[var(--pixel-gray-100)]">
                {evaluations.length}
              </span>
              <span className="font-[family-name:var(--font-pixel-body)] text-[0.5rem] uppercase tracking-wider text-[var(--pixel-gray-400)] block mt-1">
                Total
              </span>
            </div>
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-3 text-center">
              <span className="font-[family-name:var(--font-pixel-display)] text-xl text-[var(--pixel-green-pipe)]">
                {evaluations.filter((e) => e.status === 'completed').length}
              </span>
              <span className="font-[family-name:var(--font-pixel-body)] text-[0.5rem] uppercase tracking-wider text-[var(--pixel-gray-400)] block mt-1">
                Completed
              </span>
            </div>
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-3 text-center">
              <span className="font-[family-name:var(--font-pixel-display)] text-xl text-[var(--pixel-blue-sky)]">
                {evaluations.filter((e) => e.status === 'running').length}
              </span>
              <span className="font-[family-name:var(--font-pixel-body)] text-[0.5rem] uppercase tracking-wider text-[var(--pixel-gray-400)] block mt-1">
                Running
              </span>
            </div>
            <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-3 text-center">
              <span className="font-[family-name:var(--font-pixel-display)] text-xl text-[var(--pixel-gold-coin)]">
                {evaluations.filter((e) => e.status === 'pending').length}
              </span>
              <span className="font-[family-name:var(--font-pixel-body)] text-[0.5rem] uppercase tracking-wider text-[var(--pixel-gray-400)] block mt-1">
                Pending
              </span>
            </div>
          </div>

          {/* Evaluations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluations
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((evaluation) => (
                <Link key={evaluation.id} href={`/evaluate/${evaluation.id}`}>
                  <EvaluationCard evaluation={evaluation} showAgent={false} />
                </Link>
              ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-center gap-4 pt-4">
        <Link
          href="/evaluate"
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
            'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)]',
            'hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)] transition-all',
          )}
        >
          View All Evaluations
        </Link>
      </div>
    </div>
  );
}

/**
 * Agent evaluations page.
 * Shows evaluation history for a specific agent.
 */
export default function AgentEvaluatePage(): React.JSX.Element {
  const params = useParams<{ agentId: string }>();
  const agentId = params.agentId;

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-4 bg-[var(--pixel-gray-800)] rounded w-48 animate-pulse" />
          <EvaluationsSkeleton />
        </div>
      }
    >
      <AgentEvaluateContent agentId={agentId} />
    </Suspense>
  );
}
