import type React from 'react';
import { memo } from 'react';
import { ScoreGauge } from '@/components/atoms';
import { TeamMemberCard } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { TeamComposition } from '@/types';

export interface TeamResultProps {
  /** Team composition data */
  composition: TeamComposition;
  /** Callback when reset/try again is clicked */
  onReset?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * TeamResult displays the result of a team composition.
 *
 * Shows the overall fitness score prominently, the team members in a grid,
 * the AI reasoning for the composition, and a reset button.
 *
 * @example
 * ```tsx
 * <TeamResult
 *   composition={{
 *     id: 'comp-123',
 *     task: 'Build a smart contract auditor',
 *     team: [...],
 *     fitnessScore: 87,
 *     reasoning: 'This team combines...',
 *     createdAt: new Date(),
 *   }}
 *   onReset={() => setComposition(null)}
 * />
 * ```
 */
export const TeamResult = memo(function TeamResult({
  composition,
  onReset,
  className,
}: TeamResultProps): React.JSX.Element {
  return (
    <div className={cn('space-y-8', className)} data-testid="team-result">
      {/* Header with Fitness Score */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-200)] mb-4">
          Team Composed
        </h2>

        {/* Fitness Score Display */}
        <div className="inline-block p-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]">
          <span className="block font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-400)] mb-2">
            Team Fitness Score
          </span>
          <div className="flex justify-center">
            <ScoreGauge score={composition.fitnessScore} label="Fitness" size="lg" showValue />
          </div>
        </div>
      </div>

      {/* Task Description */}
      <div>
        <span className="block font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-500)] mb-2">
          Task
        </span>
        <p
          className="font-mono text-sm text-[var(--pixel-gray-300)] bg-[var(--pixel-gray-dark)] border border-[var(--pixel-gray-700)] p-3"
          data-testid="task-description"
        >
          {composition.task}
        </p>
      </div>

      {/* Team Members Grid */}
      <div>
        <span className="block font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-500)] mb-3">
          Team Members ({composition.team.length})
        </span>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-testid="team-members-grid"
        >
          {composition.team.map((member) => (
            <TeamMemberCard key={member.agentId} member={member} />
          ))}
        </div>
      </div>

      {/* AI Reasoning */}
      <div>
        <span className="block font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-500)] mb-2">
          AI Reasoning
        </span>
        <div
          className="bg-[var(--pixel-gray-dark)] border border-[var(--pixel-gray-700)] p-4"
          data-testid="ai-reasoning"
        >
          <p className="font-mono text-sm text-[var(--pixel-gray-300)] leading-relaxed">
            {composition.reasoning}
          </p>
        </div>
      </div>

      {/* Composition Metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--pixel-gray-700)]">
        <div className="font-mono text-[0.625rem] text-[var(--pixel-gray-500)]">
          <span>ID: {composition.id}</span>
          <span className="mx-2">|</span>
          <span>
            Created:{' '}
            {composition.createdAt.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className={cn(
              'px-4 py-2 border-2 transition-all',
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
              'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)]',
              'hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)]',
              'hover:shadow-[0_0_12px_var(--glow-blue)]',
            )}
            data-testid="reset-button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
});
