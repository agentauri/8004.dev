import { AlertTriangle } from 'lucide-react';
import type React from 'react';
import {
  AgentEndpoints,
  AgentRegistration,
  ReputationSection,
  TaxonomySection,
} from '@/components/organisms';
import { cn } from '@/lib/utils';
import type { Agent, AgentReputation, AgentWarning } from '@/types/agent';

export interface AgentOverviewProps {
  /** Agent data */
  agent: Agent;
  /** Agent reputation data */
  reputation?: AgentReputation;
  /** Optional additional class names */
  className?: string;
}

const SEVERITY_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  high: {
    border: 'border-[var(--pixel-red-fire)]',
    bg: 'bg-[rgba(252,84,84,0.1)]',
    text: 'text-[var(--pixel-red-fire)]',
  },
  medium: {
    border: 'border-[var(--pixel-gold-coin)]',
    bg: 'bg-[rgba(252,192,60,0.1)]',
    text: 'text-[var(--pixel-gold-coin)]',
  },
  low: {
    border: 'border-[var(--pixel-gray-500)]',
    bg: 'bg-[rgba(100,100,100,0.1)]',
    text: 'text-[var(--pixel-gray-400)]',
  },
};

function WarningsList({ warnings }: { warnings: AgentWarning[] }): React.JSX.Element {
  return (
    <div
      className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]"
      data-testid="warnings-list"
    >
      <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gold-coin)] mb-3 flex items-center gap-2">
        <AlertTriangle size={16} aria-hidden="true" />
        WARNINGS ({warnings.length})
      </h2>
      <div className="space-y-2">
        {warnings.map((warning, index) => {
          const styles = SEVERITY_STYLES[warning.severity] || SEVERITY_STYLES.low;
          return (
            <div
              key={`${warning.type}-${index}`}
              className={cn('p-3 border-2', styles.border, styles.bg)}
              data-testid="warning-item"
              data-severity={warning.severity}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'text-[0.6rem] font-[family-name:var(--font-pixel-body)] px-1.5 py-0.5 uppercase',
                    styles.text,
                    styles.border,
                    'border',
                  )}
                >
                  {warning.severity}
                </span>
                <span
                  className={cn(
                    'text-[0.6rem] font-[family-name:var(--font-pixel-body)] px-1.5 py-0.5 uppercase',
                    'text-[var(--pixel-gray-400)] border border-[var(--pixel-gray-600)]',
                  )}
                >
                  {warning.type}
                </span>
              </div>
              <p className="text-sm text-[var(--pixel-gray-300)] mt-2">{warning.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AgentOverview displays the main overview information for an agent.
 * Used in the Overview tab of the agent detail page.
 *
 * Contains:
 * - Description
 * - OASF Taxonomy (Skills and Domains)
 * - Endpoints and Capabilities
 * - Registration Information
 * - Reputation Summary
 *
 * @example
 * ```tsx
 * <AgentOverview
 *   agent={agentData}
 *   reputation={reputationData}
 * />
 * ```
 */
export function AgentOverview({
  agent,
  reputation,
  className,
}: AgentOverviewProps): React.JSX.Element {
  return (
    <div className={cn('space-y-6', className)} data-testid="agent-overview">
      {/* Description */}
      {agent.description && (
        <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-3">
            DESCRIPTION
          </h2>
          <p className="text-[var(--pixel-gray-300)] text-sm leading-relaxed">
            {agent.description}
          </p>
        </div>
      )}

      {/* OASF Taxonomy - Skills and Domains */}
      <TaxonomySection
        skills={agent.oasf?.skills?.map((s) => s.slug)}
        domains={agent.oasf?.domains?.map((d) => d.slug)}
      />

      {/* Warnings Section */}
      {agent.warnings && agent.warnings.length > 0 && <WarningsList warnings={agent.warnings} />}

      {/* Two-column layout for endpoints and registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentEndpoints endpoints={agent.endpoints} x402Support={agent.x402support} />
        <AgentRegistration registration={agent.registration} lastUpdatedAt={agent.lastUpdatedAt} />
      </div>

      {/* Reputation Section */}
      <ReputationSection reputation={reputation} />
    </div>
  );
}
