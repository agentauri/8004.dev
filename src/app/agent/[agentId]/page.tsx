'use client';

import { use } from 'react';
import { AgentDetailTemplate } from '@/components/templates';
import { useAgentDetail, useSimilarAgents } from '@/hooks';

interface AgentPageProps {
  params: Promise<{ agentId: string }>;
}

export default function AgentPage({ params }: AgentPageProps) {
  const { agentId } = use(params);

  // Use TanStack Query hook for data fetching
  const { data, isLoading, error } = useAgentDetail(agentId);

  // Fetch similar agents based on OASF taxonomy
  const { data: similarAgents, isLoading: similarAgentsLoading } = useSimilarAgents(agentId, {
    limit: 4,
  });

  return (
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
  );
}
