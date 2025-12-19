import { Users } from 'lucide-react';
import type React from 'react';
import { type ChainId, PixelExplorer } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules';
import { AgentCard, type AgentCardAgent } from '@/components/organisms/agent-card';
import { cn } from '@/lib/utils';
import type { AgentSummary } from '@/types/agent';

export interface RelatedAgentsProps {
  /** Related agents to display */
  agents: AgentSummary[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether to show the section header */
  showHeader?: boolean;
  /** Maximum agents to display */
  maxAgents?: number;
  /** Optional additional class names */
  className?: string;
}

/**
 * Converts AgentSummary to AgentCardAgent format
 */
function toAgentCardAgent(agent: AgentSummary): AgentCardAgent {
  const capabilities: CapabilityType[] = [];
  if (agent.hasMcp) capabilities.push('mcp');
  if (agent.hasA2a) capabilities.push('a2a');
  if (agent.x402support) capabilities.push('x402');

  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    chainId: agent.chainId as ChainId,
    isActive: agent.active,
    trustScore: agent.reputationScore,
    capabilities,
  };
}

/**
 * RelatedAgents displays a grid of agents similar to the current agent.
 *
 * @example
 * ```tsx
 * <RelatedAgents
 *   agents={relatedAgentsList}
 *   isLoading={false}
 * />
 * ```
 */
export function RelatedAgents({
  agents,
  isLoading = false,
  showHeader = true,
  maxAgents = 4,
  className,
}: RelatedAgentsProps): React.JSX.Element {
  const displayedAgents = agents.slice(0, maxAgents);

  // Loading state
  if (isLoading) {
    return (
      <section className={cn('', className)} data-testid="related-agents" data-state="loading">
        {showHeader && (
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
            <Users size={16} className="text-[var(--pixel-gold-coin)]" aria-hidden="true" />
            SIMILAR AGENTS
          </h2>
        )}
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <PixelExplorer size="md" animation="walk" />
          <span className="text-[var(--pixel-gray-400)] text-sm">Finding similar agents...</span>
        </div>
      </section>
    );
  }

  // Empty state
  if (agents.length === 0) {
    return (
      <section className={cn('', className)} data-testid="related-agents" data-state="empty">
        {showHeader && (
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
            <Users size={16} className="text-[var(--pixel-gold-coin)]" aria-hidden="true" />
            SIMILAR AGENTS
          </h2>
        )}
        <div className="p-6 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-center">
          <div className="flex justify-center mb-3">
            <PixelExplorer size="md" animation="float" />
          </div>
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
            No similar agents found
          </p>
          <p className="text-[var(--pixel-gray-500)] text-[0.625rem] mt-1">
            Agents with similar capabilities will appear here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn('', className)}
      data-testid="related-agents"
      data-state="loaded"
      data-count={agents.length}
    >
      {showHeader && (
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
          <Users size={16} className="text-[var(--pixel-gold-coin)]" aria-hidden="true" />
          SIMILAR AGENTS
          <span className="text-[var(--pixel-gray-500)] text-[0.625rem] font-[family-name:var(--font-pixel-body)]">
            ({agents.length})
          </span>
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedAgents.map((agent) => (
          <AgentCard key={agent.id} agent={toAgentCardAgent(agent)} />
        ))}
      </div>
    </section>
  );
}
