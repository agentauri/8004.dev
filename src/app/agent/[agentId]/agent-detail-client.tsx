'use client';

import { AgentBreadcrumb, AgentJsonLd } from '@/components/organisms/json-ld';
import { AgentDetailTemplate } from '@/components/templates';
import { useAgentDetail, useSimilarAgents } from '@/hooks';

interface AgentDetailClientProps {
  agentId: string;
}

/**
 * Client component for agent detail page
 * Handles data fetching with TanStack Query hooks
 */
export function AgentDetailClient({ agentId }: AgentDetailClientProps) {
  // Use TanStack Query hook for data fetching
  const { data, isLoading, error } = useAgentDetail(agentId);

  // Fetch similar agents based on OASF taxonomy
  const { data: similarAgents, isLoading: similarAgentsLoading } = useSimilarAgents(agentId, {
    limit: 4,
  });

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      {data?.agent && (
        <>
          <AgentJsonLd agent={data.agent} />
          <AgentBreadcrumb agentId={agentId} agentName={data.agent.name} />
        </>
      )}

      <AgentDetailTemplate
        agent={data?.agent}
        reputation={data?.reputation}
        recentFeedback={data?.recentFeedback}
        validations={data?.validations}
        relatedAgents={similarAgents}
        relatedAgentsLoading={similarAgentsLoading}
        isLoading={isLoading}
        error={error?.message}
      />
    </>
  );
}
