'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { EvaluationDetail } from '@/components/organisms';
import { useEvaluation } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Breadcrumb navigation component
 */
function Breadcrumb({ evaluationId }: { evaluationId: string }): React.JSX.Element {
  return (
    <nav
      className="flex items-center gap-2 text-[0.6875rem] font-mono text-[var(--pixel-gray-400)]"
      aria-label="Breadcrumb"
    >
      <Link href="/evaluate" className="hover:text-[var(--pixel-blue-sky)] transition-colors">
        Evaluations
      </Link>
      <span className="text-[var(--pixel-gray-600)]">/</span>
      <span className="text-[var(--pixel-gray-300)]">{evaluationId.slice(0, 8)}...</span>
    </nav>
  );
}

/**
 * Loading skeleton for evaluation detail
 */
function EvaluationDetailSkeleton(): React.JSX.Element {
  return (
    <div className="bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] animate-pulse">
      {/* Header skeleton */}
      <div className="p-4 border-b border-[var(--pixel-gray-700)]">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 bg-[var(--pixel-gray-700)] rounded w-48" />
            <div className="h-3 bg-[var(--pixel-gray-800)] rounded w-32" />
            <div className="h-3 bg-[var(--pixel-gray-800)] rounded w-40" />
          </div>
          <div className="h-6 bg-[var(--pixel-gray-700)] rounded w-24" />
        </div>
      </div>

      {/* Score skeleton */}
      <div className="p-4 border-b border-[var(--pixel-gray-700)]">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="h-3 bg-[var(--pixel-gray-800)] rounded w-20 mx-auto mb-2" />
            <div className="h-10 bg-[var(--pixel-gray-700)] rounded w-16 mx-auto" />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-[var(--pixel-gray-800)] rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="p-4 border-b border-[var(--pixel-gray-700)]">
        <div className="h-4 bg-[var(--pixel-gray-700)] rounded w-24 mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-[var(--pixel-gray-800)] rounded w-48" />
          <div className="h-3 bg-[var(--pixel-gray-800)] rounded w-52" />
        </div>
      </div>

      {/* Benchmarks skeleton */}
      <div className="p-4">
        <div className="h-4 bg-[var(--pixel-gray-700)] rounded w-36 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[var(--pixel-gray-800)] rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Evaluation detail page content
 */
function EvaluationDetailContent({ id }: { id: string }): React.JSX.Element {
  const { data: evaluation, isLoading, error } = useEvaluation(id);

  if (error) {
    throw error;
  }

  if (isLoading) {
    return <EvaluationDetailSkeleton />;
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PixelExplorer size="lg" animation="float" />
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-xl text-[var(--pixel-red-fire)] mt-6 shadow-[0_0_12px_var(--glow-red)]">
          EVALUATION NOT FOUND
        </h2>
        <p className="font-mono text-sm text-[var(--pixel-gray-400)] mt-2 max-w-md">
          The evaluation you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/evaluate"
          className={cn(
            'mt-6 font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
            'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)]',
            'hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)]',
            'hover:shadow-[0_0_12px_var(--glow-blue)] transition-all',
          )}
        >
          Back to Evaluations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb evaluationId={id} />

      {/* Agent Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/agent/${evaluation.agentId}`}
          className={cn(
            'inline-flex items-center gap-2',
            'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
            'text-[var(--pixel-blue-sky)] hover:text-[var(--pixel-gray-100)]',
            'border-b border-transparent hover:border-[var(--pixel-blue-sky)] transition-all',
          )}
        >
          <span>View Agent</span>
          <span className="font-mono text-[0.625rem] text-[var(--pixel-gray-400)]">
            ({evaluation.agentId})
          </span>
        </Link>
      </div>

      {/* Evaluation Detail */}
      <EvaluationDetail evaluation={evaluation} />

      {/* Back Link */}
      <div className="flex justify-center pt-4">
        <Link
          href="/evaluate"
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider px-4 py-2 border-2',
            'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)]',
            'hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)] transition-all',
          )}
        >
          Back to All Evaluations
        </Link>
      </div>
    </div>
  );
}

/**
 * Evaluation detail page.
 * Shows full evaluation results with benchmark breakdown.
 */
export default function EvaluationDetailPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const id = params.id;

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-4 bg-[var(--pixel-gray-800)] rounded w-32 animate-pulse" />
          <EvaluationDetailSkeleton />
        </div>
      }
    >
      <EvaluationDetailContent id={id} />
    </Suspense>
  );
}
