'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import type { ChainId } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules';
import type { CompareTableAgent } from '@/components/organisms/compare-table';
import { CompareTemplate } from '@/components/templates';
import { COMPARE_PARAM_KEY, MAX_COMPARE_AGENTS } from '@/hooks/use-compare-agents';
import type { AgentDetailResponse } from '@/types/agent';

/**
 * Parse agent IDs from URL search params
 */
function parseAgentIds(searchParams: URLSearchParams): string[] {
  const agentsParam = searchParams.get(COMPARE_PARAM_KEY);
  if (!agentsParam) return [];

  return agentsParam
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .slice(0, MAX_COMPARE_AGENTS);
}

/**
 * Convert API response to CompareTableAgent
 */
function toCompareTableAgent(response: AgentDetailResponse): CompareTableAgent {
  const { agent, reputation, validations } = response;

  const capabilities: CapabilityType[] = [];
  if (agent.endpoints?.mcp) capabilities.push('mcp');
  if (agent.endpoints?.a2a) capabilities.push('a2a');
  if (agent.x402support) capabilities.push('x402');

  // Check if any validation is valid
  const isVerified = validations?.some((v) => v.status === 'valid') ?? false;

  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    image: agent.image,
    chainId: agent.chainId as ChainId,
    isActive: agent.active,
    isVerified,
    trustScore: reputation?.averageScore,
    capabilities,
    oasfSkills: agent.oasf?.skills,
    oasfDomains: agent.oasf?.domains,
    walletAddress: agent.endpoints?.agentWallet,
    supportedTrust: agent.supportedTrust,
    reputationCount: reputation?.count,
  };
}

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState<CompareTableAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse agent IDs from URL
  const agentIds = useMemo(() => parseAgentIds(searchParams), [searchParams]);

  // Fetch agent details
  useEffect(() => {
    async function fetchAgents() {
      if (agentIds.length === 0) {
        setAgents([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch all agents in parallel
        const responses = await Promise.all(
          agentIds.map(async (id) => {
            const response = await fetch(`/api/agents/${id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch agent ${id}`);
            }
            return response.json();
          }),
        );

        // Convert to CompareTableAgent format
        const comparedAgents = responses
          .filter((res) => res.success && res.data)
          .map((res) => toCompareTableAgent(res.data));

        setAgents(comparedAgents);
      } catch (err) {
        console.error('Failed to fetch agents:', err);
        setError('Failed to load some agents. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgents();
  }, [agentIds]);

  // Handle removing an agent
  const handleRemoveAgent = useCallback(
    (agentId: string) => {
      const newIds = agentIds.filter((id) => id !== agentId);
      const params = new URLSearchParams();
      if (newIds.length > 0) {
        params.set(COMPARE_PARAM_KEY, newIds.join(','));
        router.push(`/compare?${params.toString()}`);
      } else {
        router.push('/compare');
      }
    },
    [agentIds, router],
  );

  if (error) {
    return <CompareTemplate agents={agents} isLoading={false} onRemoveAgent={handleRemoveAgent} />;
  }

  return (
    <CompareTemplate agents={agents} isLoading={isLoading} onRemoveAgent={handleRemoveAgent} />
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareTemplate agents={[]} isLoading={true} />}>
      <ComparePageContent />
    </Suspense>
  );
}
