import type { Metadata } from 'next';

import { backendFetch } from '@/lib/api/backend';
import { getChainDisplayName } from '@/lib/constants';
import type { BackendAgent } from '@/types/backend';
import { AgentDetailClient } from './agent-detail-client';

interface AgentPageProps {
  params: Promise<{ agentId: string }>;
}

/**
 * Fetch agent data for metadata generation
 * Returns null if agent not found or error occurs
 */
async function fetchAgentForMetadata(agentId: string): Promise<BackendAgent | null> {
  try {
    const response = await backendFetch<BackendAgent>(`/api/v1/agents/${agentId}`, {
      next: { revalidate: 60 },
    });
    return response.data;
  } catch {
    return null;
  }
}

/**
 * Truncate description to a max length for SEO
 */
function truncateDescription(description: string, maxLength = 150): string {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return `${description.substring(0, maxLength).trim()}...`;
}

/**
 * Generate dynamic metadata for agent pages
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { agentId } = await params;

  const agent = await fetchAgentForMetadata(agentId);

  // Default metadata for not found or error states
  if (!agent) {
    return {
      title: 'Agent Not Found',
      description: 'The requested AI agent could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const chainName = getChainDisplayName(agent.chainId);
  const title = agent.name || `Agent #${agent.tokenId}`;
  const description = truncateDescription(
    agent.description || `AI agent on ${chainName} - ERC-8004 Trustless Agent`,
  );

  // Build capabilities list for keywords
  const capabilities: string[] = [];
  if (agent.hasMcp) capabilities.push('MCP Protocol');
  if (agent.hasA2a) capabilities.push('A2A Protocol');
  if (agent.x402Support) capabilities.push('x402 Payments');

  return {
    title,
    description,
    keywords: [
      agent.name,
      'AI Agent',
      'ERC-8004',
      chainName,
      ...capabilities,
      ...(agent.oasf?.skills.map((s) => s.slug) || []),
      ...(agent.oasf?.domains.map((d) => d.slug) || []),
    ].filter(Boolean),
    alternates: {
      canonical: `https://www.8004.dev/agent/${agentId}`,
    },
    openGraph: {
      title: `${title} | Agent Explorer`,
      description,
      url: `https://www.8004.dev/agent/${agentId}`,
      siteName: 'Agent Explorer',
      type: 'website',
      images: [
        {
          url: `/api/og/agent/${agentId}`,
          width: 1200,
          height: 630,
          alt: `${title} - AI Agent on ${chainName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Agent Explorer`,
      description,
      images: [`/api/og/agent/${agentId}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Agent detail page - Server component wrapper
 * Delegates client-side data fetching to AgentDetailClient
 */
export default async function AgentPage({ params }: AgentPageProps) {
  const { agentId } = await params;

  return <AgentDetailClient agentId={agentId} />;
}
