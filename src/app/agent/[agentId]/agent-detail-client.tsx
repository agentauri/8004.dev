'use client';

import { useMemo } from 'react';
import { AgentBreadcrumb, AgentJsonLd } from '@/components/organisms/json-ld';
import { AgentDetailTemplate } from '@/components/templates';
import { useAgentDetail, useAgentEvaluations, useIntents, useSimilarAgents } from '@/hooks';

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

  // Fetch evaluations for this agent
  const { data: evaluations, isLoading: evaluationsLoading } = useAgentEvaluations(agentId, {
    enabled: Boolean(agentId),
  });

  // Fetch all intents to filter for matching ones
  const { data: allIntents, isLoading: intentsLoading } = useIntents({
    limit: 50,
  });

  // Filter intents that match this agent's capabilities
  // This is a client-side filter based on the agent's OASF skills/domains and the intent's required roles
  const matchingIntents = useMemo(() => {
    if (!allIntents || !data?.agent) return [];

    const agent = data.agent;
    const agentSkills = agent.oasf?.skills.map((s) => s.slug.toLowerCase()) || [];
    const agentDomains = agent.oasf?.domains.map((d) => d.slug.toLowerCase()) || [];

    // Match intents based on required roles that align with agent capabilities
    return allIntents.filter((intent) => {
      // Check if any of the agent's skills/domains match the intent's required roles
      const requiredRolesLower = intent.requiredRoles.map((r) => r.toLowerCase());

      // Match if agent has skills/domains that could fulfill any required role
      const hasMatchingSkill = agentSkills.some((skill) =>
        requiredRolesLower.some((role) => role.includes(skill) || skill.includes(role)),
      );

      const hasMatchingDomain = agentDomains.some((domain) =>
        requiredRolesLower.some((role) => role.includes(domain) || domain.includes(role)),
      );

      // Also check for capability matches (mcp, a2a support)
      const hasMcpAndNeeded =
        agent.endpoints.mcp && requiredRolesLower.some((r) => r.includes('mcp'));
      const hasA2aAndNeeded =
        agent.endpoints.a2a && requiredRolesLower.some((r) => r.includes('a2a'));

      return hasMatchingSkill || hasMatchingDomain || hasMcpAndNeeded || hasA2aAndNeeded;
    });
  }, [allIntents, data?.agent]);

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
        evaluations={evaluations}
        evaluationsLoading={evaluationsLoading}
        matchingIntents={matchingIntents}
        intentsLoading={intentsLoading}
        isLoading={isLoading}
        error={error?.message}
      />
    </>
  );
}
