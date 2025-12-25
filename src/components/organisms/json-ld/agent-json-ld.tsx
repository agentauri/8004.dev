import { getChainDisplayName } from '@/lib/constants';
import type { Agent } from '@/types/agent';

/**
 * Agent JSON-LD structured data
 * Represents an AI agent as a SoftwareApplication
 *
 * @see https://schema.org/SoftwareApplication
 */
interface AgentJsonLdProps {
  agent: Agent;
}

export function AgentJsonLd({ agent }: AgentJsonLdProps) {
  const chainName = getChainDisplayName(agent.chainId);

  // Build feature list from capabilities
  const featureList: string[] = [];
  if (agent.endpoints.mcp) featureList.push('MCP Protocol Support');
  if (agent.endpoints.a2a) featureList.push('A2A Protocol Support');
  if (agent.x402support) featureList.push('x402 Payment Support');
  if (agent.supportedTrust.includes('eas')) featureList.push('EAS Trust Verification');
  if (agent.supportedTrust.includes('tee')) featureList.push('TEE Validation');

  // Add OASF skills as features
  if (agent.oasf?.skills) {
    agent.oasf.skills.forEach((skill) => {
      featureList.push(skill.slug.replace(/_/g, ' '));
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.description,
    url: `https://www.8004.dev/agent/${agent.id}`,
    applicationCategory: 'AI Agent',
    operatingSystem: chainName,
    ...(agent.image && { image: agent.image }),
    ...(featureList.length > 0 && { featureList }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Chain ID',
        value: agent.chainId,
      },
      {
        '@type': 'PropertyValue',
        name: 'Token ID',
        value: agent.tokenId,
      },
      {
        '@type': 'PropertyValue',
        name: 'Status',
        value: agent.active ? 'Active' : 'Inactive',
      },
      ...(agent.reputation
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Reputation Score',
              value: agent.reputation.averageScore,
            },
            {
              '@type': 'PropertyValue',
              name: 'Feedback Count',
              value: agent.reputation.count,
            },
          ]
        : []),
    ],
    ...(agent.registration.owner && {
      creator: {
        '@type': 'Organization',
        name: agent.registration.owner,
      },
    }),
    ...(agent.registration.registeredAt && {
      datePublished: agent.registration.registeredAt,
    }),
    ...(agent.lastUpdatedAt && {
      dateModified: agent.lastUpdatedAt,
    }),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
