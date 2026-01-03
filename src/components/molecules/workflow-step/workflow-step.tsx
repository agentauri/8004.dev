import type React from 'react';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { WorkflowStep as WorkflowStepType } from '@/types';

export interface WorkflowStepProps {
  /** Workflow step data */
  step: WorkflowStepType;
  /** Step number for display (1-based) */
  stepNumber: number;
  /** Whether this step is currently active/highlighted */
  isActive?: boolean;
  /** Optional matched agent ID for this step's role */
  matchedAgentId?: string;
  /** Whether to show the connecting line to the next step */
  showConnector?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * WorkflowStep displays a single step in a workflow visualization.
 * Shows the step number, name, description, required role, inputs and outputs.
 * Can display a connected line to the next step and highlight matched agents.
 *
 * @example
 * ```tsx
 * <WorkflowStep
 *   step={{
 *     order: 1,
 *     name: 'Analyze Code',
 *     description: 'Analyze source code for issues',
 *     requiredRole: 'code-analyzer',
 *     inputs: ['source_code'],
 *     outputs: ['analysis_report'],
 *   }}
 *   stepNumber={1}
 *   isActive={true}
 *   matchedAgentId="11155111:123"
 *   showConnector={true}
 * />
 * ```
 */
export const WorkflowStep = memo(function WorkflowStep({
  step,
  stepNumber,
  isActive = false,
  matchedAgentId,
  showConnector = true,
  className,
}: WorkflowStepProps): React.JSX.Element {
  return (
    <div
      className={cn('relative flex gap-4', className)}
      data-testid="workflow-step"
      data-step-order={step.order}
      data-active={isActive}
    >
      {/* Step number with connector line */}
      <div className="flex flex-col items-center">
        {/* Step number circle */}
        <div
          className={cn(
            'w-10 h-10 flex items-center justify-center border-2 transition-all',
            'font-[family-name:var(--font-pixel-display)] text-lg',
            isActive
              ? [
                  'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
                  'bg-[var(--pixel-green-pipe)]/20 shadow-[0_0_12px_var(--glow-green)]',
                ]
              : [
                  'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)]',
                  'bg-[var(--pixel-gray-800)]',
                ],
          )}
          data-testid="step-number"
        >
          {stepNumber}
        </div>

        {/* Connector line */}
        {showConnector && (
          <div
            className={cn(
              'w-0.5 flex-1 min-h-[20px]',
              isActive ? 'bg-[var(--pixel-green-pipe)]' : 'bg-[var(--pixel-gray-700)]',
            )}
            data-testid="step-connector"
            data-active={isActive}
          />
        )}
      </div>

      {/* Step content */}
      <div
        className={cn(
          'flex-1 pb-6 border-2 p-4 transition-all',
          isActive
            ? 'border-[var(--pixel-green-pipe)] bg-[var(--pixel-gray-dark)]'
            : 'border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)]',
        )}
      >
        {/* Step name and role */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4
            className={cn(
              'font-[family-name:var(--font-pixel-heading)] text-sm',
              isActive ? 'text-[var(--pixel-gray-100)]' : 'text-[var(--pixel-gray-200)]',
            )}
            data-testid="step-name"
          >
            {step.name}
          </h4>
          <span
            className={cn(
              'px-2 py-0.5 text-[0.625rem] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]',
              'bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-sky)]',
              'shrink-0',
            )}
            data-testid="step-role"
          >
            {step.requiredRole}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--pixel-gray-400)] mb-3" data-testid="step-description">
          {step.description}
        </p>

        {/* Inputs and Outputs */}
        <div className="flex flex-wrap gap-4 text-[0.625rem]">
          {/* Inputs */}
          {step.inputs.length > 0 && (
            <div data-testid="step-inputs">
              <span className="uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-1">
                Inputs
              </span>
              <div className="flex flex-wrap gap-1">
                {step.inputs.map((input) => (
                  <span
                    key={input}
                    className="px-1.5 py-0.5 bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-300)] font-mono"
                  >
                    {input}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Outputs */}
          {step.outputs.length > 0 && (
            <div data-testid="step-outputs">
              <span className="uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-1">
                Outputs
              </span>
              <div className="flex flex-wrap gap-1">
                {step.outputs.map((output) => (
                  <span
                    key={output}
                    className="px-1.5 py-0.5 bg-[var(--pixel-gold-coin)]/20 text-[var(--pixel-gold-coin)] font-mono"
                  >
                    {output}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Matched agent */}
        {matchedAgentId && (
          <div
            className="mt-3 pt-3 border-t border-[var(--pixel-gray-700)]"
            data-testid="step-matched-agent"
          >
            <span className="text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-500)]">
              Matched Agent:{' '}
            </span>
            <span className="text-[0.625rem] font-mono text-[var(--pixel-green-pipe)]">
              {matchedAgentId}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
