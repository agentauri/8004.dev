'use client';

import { FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { EvaluationCard } from '@/components/organisms';
import { MainLayout } from '@/components/templates';
import { useCreateEvaluation, useEvaluations } from '@/hooks';
import { cn } from '@/lib/utils';
import type { EvaluationStatus } from '@/types';

/** Status filter tabs */
const STATUS_TABS: Array<{ value: EvaluationStatus | null; label: string }> = [
  { value: null, label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

/**
 * Stats card for displaying evaluation counts
 */
function StatCard({
  label,
  count,
  colorClass,
  glowClass,
}: {
  label: string;
  count: number;
  colorClass: string;
  glowClass: string;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-4 text-center',
        'hover:border-current transition-colors',
        colorClass,
      )}
    >
      <span
        className={cn(
          'font-[family-name:var(--font-pixel-display)] text-2xl md:text-3xl tabular-nums block',
          colorClass,
          glowClass,
        )}
      >
        {count}
      </span>
      <span className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-400)] mt-1 block">
        {label}
      </span>
    </div>
  );
}

/**
 * Create Evaluation Modal
 */
function CreateEvaluationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): React.JSX.Element | null {
  const [agentId, setAgentId] = useState('');
  const { mutate: createEvaluation, isPending, error } = useCreateEvaluation();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!agentId.trim()) return;

      createEvaluation(
        { agentId: agentId.trim() },
        {
          onSuccess: () => {
            setAgentId('');
            onClose();
          },
        },
      );
    },
    [agentId, createEvaluation, onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="button"
      tabIndex={0}
      data-testid="create-evaluation-modal-overlay"
    >
      <div
        className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        data-testid="create-evaluation-modal"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="modal-title"
            className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-100)]"
          >
            Create Evaluation
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] border border-[var(--pixel-gray-700)] hover:border-[var(--pixel-gray-600)] transition-colors"
            aria-label="Close modal"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="agent-id"
              className="font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider text-[var(--pixel-gray-400)] block mb-2"
            >
              Agent ID
            </label>
            <input
              id="agent-id"
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="e.g., 11155111:123"
              className="w-full bg-[var(--pixel-black)] border-2 border-[var(--pixel-gray-700)] px-3 py-2 font-mono text-sm text-[var(--pixel-gray-100)] placeholder:text-[var(--pixel-gray-500)] focus:border-[var(--pixel-blue-sky)] focus:outline-none focus:shadow-[0_0_8px_var(--glow-blue)]"
              disabled={isPending}
            />
            <p className="font-mono text-[0.625rem] text-[var(--pixel-gray-500)] mt-1">
              Format: chainId:tokenId
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-[rgba(252,84,84,0.1)] border border-[var(--pixel-red-fire)] text-[var(--pixel-red-fire)] font-mono text-xs">
              {error.message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)] transition-all"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                'flex-1 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
                'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
                'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
                'hover:shadow-[0_0_12px_var(--glow-green)] transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              disabled={isPending || !agentId.trim()}
            >
              {isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Main evaluations page content
 */
function EvaluatePageContent(): React.JSX.Element {
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data: evaluations,
    isLoading,
    error,
  } = useEvaluations({ status: statusFilter ?? undefined });

  // Calculate stats from evaluations
  const stats = useMemo(() => {
    if (!evaluations) {
      return { total: 0, pending: 0, running: 0, completed: 0, failed: 0 };
    }

    return evaluations.reduce(
      (acc, evaluation) => {
        acc.total++;
        acc[evaluation.status]++;
        return acc;
      },
      { total: 0, pending: 0, running: 0, completed: 0, failed: 0 },
    );
  }, [evaluations]);

  // Filter evaluations by status (when using "all" filter)
  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return [];
    return evaluations;
  }, [evaluations]);

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Evaluations"
        description="Agent benchmark results and performance scores"
        icon={FlaskConical}
        glow="blue"
        action={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={cn(
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
              'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
              'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
              'hover:shadow-[0_0_12px_var(--glow-green)] transition-all',
            )}
            data-testid="create-evaluation-button"
          >
            + New Evaluation
          </button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Total"
          count={stats.total}
          colorClass="text-[var(--pixel-gray-100)]"
          glowClass=""
        />
        <StatCard
          label="Pending"
          count={stats.pending}
          colorClass="text-[var(--pixel-gold-coin)]"
          glowClass="shadow-[0_0_12px_var(--glow-gold)]"
        />
        <StatCard
          label="Running"
          count={stats.running}
          colorClass="text-[var(--pixel-blue-sky)]"
          glowClass="shadow-[0_0_12px_var(--glow-blue)]"
        />
        <StatCard
          label="Completed"
          count={stats.completed}
          colorClass="text-[var(--pixel-green-pipe)]"
          glowClass="shadow-[0_0_12px_var(--glow-green)]"
        />
        <StatCard
          label="Failed"
          count={stats.failed}
          colorClass="text-[var(--pixel-red-fire)]"
          glowClass="shadow-[0_0_12px_var(--glow-red)]"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[var(--pixel-gray-700)] pb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value ?? 'all'}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-3 py-1.5 border-2 transition-all',
              statusFilter === tab.value
                ? 'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)] shadow-[0_0_8px_var(--glow-blue)]'
                : 'border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-500)] hover:text-[var(--pixel-gray-200)]',
            )}
            data-testid={`status-filter-${tab.value ?? 'all'}`}
          >
            {tab.label}
            {tab.value && (
              <span className="ml-1.5 text-[0.5rem] opacity-75">({stats[tab.value]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <PixelExplorer size="md" animation="bounce" />
          <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-400)] mt-4 animate-pulse uppercase tracking-wider">
            Loading evaluations...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEvaluations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PixelExplorer size="md" animation="float" />
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-200)] mt-6">
            No Evaluations Found
          </h3>
          <p className="font-mono text-sm text-[var(--pixel-gray-400)] mt-2 max-w-md">
            {statusFilter
              ? `No ${statusFilter} evaluations at the moment.`
              : 'Start by creating a new evaluation for an agent.'}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={cn(
              'mt-6 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
              'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
              'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
              'hover:shadow-[0_0_12px_var(--glow-green)] transition-all',
            )}
          >
            Create First Evaluation
          </button>
        </div>
      )}

      {/* Evaluations Grid */}
      {!isLoading && filteredEvaluations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvaluations.map((evaluation) => (
            <Link key={evaluation.id} href={`/evaluate/${evaluation.id}`}>
              <EvaluationCard evaluation={evaluation} showAgent />
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateEvaluationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}

/**
 * Evaluations dashboard page.
 * Lists all evaluations with status filtering and stats overview.
 */
export default function EvaluatePage(): React.JSX.Element {
  return (
    <MainLayout>
      <div className="min-h-screen bg-pixel-grid">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <PixelExplorer size="lg" animation="bounce" />
                <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
                  Loading Evaluations...
                </p>
              </div>
            }
          >
            <EvaluatePageContent />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}
