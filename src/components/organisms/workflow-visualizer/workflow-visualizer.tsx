'use client';

import type React from 'react';
import { memo, useMemo } from 'react';
import { WorkflowStep } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { WorkflowStep as WorkflowStepType } from '@/types';

export interface WorkflowVisualizerProps {
  /** Ordered workflow steps to display */
  steps: WorkflowStepType[];
  /** Map of role to matched agent ID */
  matchedAgents?: Record<string, string>;
  /** Currently active/highlighted step (1-based order) */
  activeStep?: number;
  /** Optional additional class names */
  className?: string;
}

/**
 * WorkflowVisualizer displays a vertical timeline of workflow steps.
 * Shows the flow of data between steps with connecting lines and
 * can highlight matched agents for each role.
 *
 * @example
 * ```tsx
 * <WorkflowVisualizer
 *   steps={[
 *     { order: 1, name: 'Analyze', requiredRole: 'analyzer', ... },
 *     { order: 2, name: 'Review', requiredRole: 'reviewer', ... },
 *   ]}
 *   matchedAgents={{
 *     'analyzer': '11155111:1',
 *     'reviewer': '11155111:2',
 *   }}
 *   activeStep={1}
 * />
 * ```
 */
export const WorkflowVisualizer = memo(function WorkflowVisualizer({
  steps,
  matchedAgents = {},
  activeStep,
  className,
}: WorkflowVisualizerProps): React.JSX.Element {
  // Sort steps by order
  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => a.order - b.order);
  }, [steps]);

  // Calculate data flow connections
  const dataFlowInfo = useMemo(() => {
    const allOutputs = new Set<string>();

    for (const step of sortedSteps) {
      for (const output of step.outputs) {
        allOutputs.add(output);
      }
    }

    return { allOutputs };
  }, [sortedSteps]);

  if (steps.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          'border-2 border-dashed border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]',
          className,
        )}
        data-testid="workflow-visualizer-empty"
      >
        <span className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-400)]">
          No workflow steps defined
        </span>
        <p className="font-mono text-sm text-[var(--pixel-gray-500)] mt-2">
          This template has no workflow steps configured.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} data-testid="workflow-visualizer">
      {/* Header with flow legend */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-[var(--pixel-gray-700)]">
        <span className="font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider text-[var(--pixel-gray-400)]">
          Workflow Pipeline
        </span>
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--pixel-gray-700)]" />
            <span className="text-[0.625rem] text-[var(--pixel-gray-500)] font-mono uppercase">
              Input
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--pixel-gold-coin)]/50" />
            <span className="text-[0.625rem] text-[var(--pixel-gray-500)] font-mono uppercase">
              Output
            </span>
          </div>
          {Object.keys(matchedAgents).length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--pixel-green-pipe)]/50" />
              <span className="text-[0.625rem] text-[var(--pixel-gray-500)] font-mono uppercase">
                Matched
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Steps timeline */}
      <div className="space-y-0" data-testid="workflow-steps">
        {sortedSteps.map((step, index) => {
          const isLast = index === sortedSteps.length - 1;
          const isActive = activeStep === step.order;
          const matchedAgentId = matchedAgents[step.requiredRole];

          return (
            <WorkflowStep
              key={step.order}
              step={step}
              stepNumber={index + 1}
              isActive={isActive}
              matchedAgentId={matchedAgentId}
              showConnector={!isLast}
            />
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-6 pt-4 border-t-2 border-[var(--pixel-gray-700)]">
        <div className="flex flex-wrap gap-6 text-[0.625rem]">
          {/* Total steps */}
          <div>
            <span className="uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-1">
              Total Steps
            </span>
            <span className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)]">
              {steps.length}
            </span>
          </div>

          {/* Unique roles */}
          <div>
            <span className="uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-1">
              Required Roles
            </span>
            <span className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)]">
              {new Set(steps.map((s) => s.requiredRole)).size}
            </span>
          </div>

          {/* Matched agents */}
          {Object.keys(matchedAgents).length > 0 && (
            <div>
              <span className="uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-1">
                Matched Agents
              </span>
              <span className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-green-pipe)]">
                {Object.keys(matchedAgents).length}
              </span>
            </div>
          )}

          {/* Data artifacts */}
          <div>
            <span className="uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-1">
              Data Artifacts
            </span>
            <span className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gold-coin)]">
              {dataFlowInfo.allOutputs.size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
