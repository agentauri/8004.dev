/**
 * Mock data matching the exact backend API response format
 *
 * IMPORTANT: These types must match the backend API exactly.
 * See src/types/backend.ts for type definitions.
 */

import type {
  BackendAgent,
  BackendChainStats,
  BackendPlatformStats,
  BackendReputation,
  BackendSearchResult,
  BackendSimilarAgent,
  BackendTaxonomy,
  BackendValidation,
} from '@/types/backend';

/**
 * Mock agents in backend format
 * Note: Backend uses different field names and null for unset values
 */
export const mockBackendAgents: BackendSearchResult[] = [
  {
    id: '11155111:1',
    chainId: 11155111,
    tokenId: '1',
    name: 'AI Trading Bot Test',
    description: 'An autonomous trading agent that executes trades based on market analysis',
    image: undefined,
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: false, // Note: Backend uses x402Support, not x402support
    supportedTrust: ['reputation'],
    oasf: {
      skills: [{ slug: 'trading', confidence: 0.95 }],
      domains: [{ slug: 'finance', confidence: 0.9 }],
      confidence: 0.92,
      classifiedAt: '2024-01-15T10:00:00Z',
      modelVersion: '1.0.0',
    },
    oasfSource: 'llm-classification',
    operators: [],
    ens: undefined,
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    registration: {
      chainId: 11155111,
      tokenId: '1',
      contractAddress: '0x1111111111111111111111111111111111111111',
      metadataUri: 'https://example.com/metadata/1',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-10T08:00:00Z',
    },
    endpoints: {
      mcp: { url: 'https://mcp.example.com/agent1', version: '1.0' },
    },
    searchScore: 0.95,
    matchReasons: ['Matches query: trading'],
  },
  {
    id: '11155111:2',
    chainId: 11155111,
    tokenId: '2',
    name: 'Code Review Test Agent',
    description: 'Analyzes code and provides detailed review feedback',
    image: undefined,
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
    supportedTrust: ['reputation', 'tee'],
    oasf: {
      skills: [{ slug: 'code_review', confidence: 0.88 }],
      domains: [{ slug: 'technology', confidence: 0.92 }],
      confidence: 0.9,
      classifiedAt: '2024-01-16T10:00:00Z',
      modelVersion: '1.0.0',
    },
    oasfSource: 'llm-classification',
    operators: [],
    ens: 'codereview.eth',
    walletAddress: '0x2345678901abcdef2345678901abcdef23456789',
    registration: {
      chainId: 11155111,
      tokenId: '2',
      contractAddress: '0x1111111111111111111111111111111111111111',
      metadataUri: 'https://example.com/metadata/2',
      owner: '0xbcdef01234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-11T09:00:00Z',
    },
    endpoints: {
      mcp: { url: 'https://mcp.example.com/agent2', version: '1.0' },
      a2a: { url: 'https://a2a.example.com/agent2', version: '0.1' },
    },
    searchScore: 0.88,
    matchReasons: ['Matches query: code'],
  },
  {
    id: '84532:1',
    chainId: 84532,
    tokenId: '1',
    name: 'Data Analysis Agent',
    description: 'Processes and analyzes large datasets with AI-powered insights',
    image: undefined,
    active: true,
    hasMcp: false,
    hasA2a: true,
    x402Support: true,
    supportedTrust: ['stake'],
    oasf: {
      skills: [{ slug: 'data_analysis', confidence: 0.91 }],
      domains: [{ slug: 'technology', confidence: 0.87 }],
      confidence: 0.89,
      classifiedAt: '2024-01-17T10:00:00Z',
      modelVersion: '1.0.0',
    },
    oasfSource: 'llm-classification',
    operators: [],
    ens: undefined,
    walletAddress: '0x3456789012abcdef3456789012abcdef34567890',
    registration: {
      chainId: 84532,
      tokenId: '1',
      contractAddress: '0x2222222222222222222222222222222222222222',
      metadataUri: 'https://example.com/metadata/3',
      owner: '0xcdef012345678901abcdef1234567890abcdef12',
      registeredAt: '2024-01-12T10:00:00Z',
    },
    endpoints: {
      a2a: { url: 'https://a2a.example.com/agent3', version: '0.1' },
      agentWallet: '0x3456789012abcdef3456789012abcdef34567890',
    },
    searchScore: 0.82,
    matchReasons: ['Matches query: data'],
  },
  {
    id: '80002:1',
    chainId: 80002,
    tokenId: '1',
    name: 'Content Writer Agent',
    description: 'Creates engaging content for blogs, social media, and marketing',
    image: undefined,
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: true,
    supportedTrust: ['reputation'],
    oasf: {
      skills: [{ slug: 'content_creation', confidence: 0.93 }],
      domains: [{ slug: 'marketing', confidence: 0.88 }],
      confidence: 0.9,
      classifiedAt: '2024-01-18T10:00:00Z',
      modelVersion: '1.0.0',
    },
    oasfSource: 'llm-classification',
    operators: [],
    ens: undefined,
    walletAddress: '0x4567890123abcdef4567890123abcdef45678901',
    registration: {
      chainId: 80002,
      tokenId: '1',
      contractAddress: '0x3333333333333333333333333333333333333333',
      metadataUri: 'https://example.com/metadata/4',
      owner: '0xdef0123456789012abcdef1234567890abcdef12',
      registeredAt: '2024-01-13T11:00:00Z',
    },
    endpoints: {
      mcp: { url: 'https://mcp.example.com/agent4', version: '1.0' },
    },
    searchScore: 0.78,
    matchReasons: ['Matches query: content'],
  },
];

/**
 * Get agent by ID (for detail endpoint)
 */
export function getBackendAgent(agentId: string): BackendAgent | undefined {
  return mockBackendAgents.find((a) => a.id === agentId);
}

/**
 * Mock platform stats in backend format
 */
export const mockBackendStats: BackendPlatformStats = {
  totalAgents: 156,
  withRegistrationFile: 142,
  activeAgents: 135,
  chainBreakdown: [
    {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      shortName: 'Sepolia',
      explorerUrl: 'https://sepolia.etherscan.io',
      totalCount: 87,
      withRegistrationFileCount: 82,
      activeCount: 78,
      status: 'ok',
    },
    {
      chainId: 84532,
      name: 'Base Sepolia',
      shortName: 'Base Sep',
      explorerUrl: 'https://sepolia.basescan.org',
      totalCount: 45,
      withRegistrationFileCount: 41,
      activeCount: 39,
      status: 'ok',
    },
    {
      chainId: 80002,
      name: 'Polygon Amoy',
      shortName: 'Amoy',
      explorerUrl: 'https://amoy.polygonscan.com',
      totalCount: 24,
      withRegistrationFileCount: 19,
      activeCount: 18,
      status: 'ok',
    },
  ] as BackendChainStats[],
};

/**
 * Mock taxonomy in backend format
 */
export const mockBackendTaxonomy: BackendTaxonomy = {
  version: '1.0.0',
  skills: [
    { slug: 'trading', name: 'Trading' },
    { slug: 'code_review', name: 'Code Review' },
    { slug: 'data_analysis', name: 'Data Analysis' },
    { slug: 'content_creation', name: 'Content Creation' },
  ],
  domains: [
    { slug: 'finance', name: 'Finance' },
    { slug: 'technology', name: 'Technology' },
    { slug: 'marketing', name: 'Marketing' },
  ],
};

/**
 * Mock reputation data in backend format
 */
export function getMockBackendReputation(agentId: string): BackendReputation {
  return {
    agentId,
    reputation: {
      count: 12,
      averageScore: 85,
      distribution: {
        low: 1,
        medium: 3,
        high: 8,
      },
    },
    recentFeedback: [
      {
        id: 'fb-1',
        score: 90,
        tags: ['reliable', 'fast'],
        context: 'Excellent performance on trading tasks',
        submitter: '0xfeedback1111111111111111111111111111111111',
        easUid: '0xeas1111111111111111111111111111111111111111',
        submittedAt: '2024-01-18T15:30:00Z',
        transactionHash: '0xtx111111111111111111111111111111111111111111',
      },
      {
        id: 'fb-2',
        score: 80,
        tags: ['accurate'],
        context: 'Good analysis results',
        submitter: '0xfeedback2222222222222222222222222222222222',
        submittedAt: '2024-01-17T10:00:00Z',
      },
    ],
  };
}

/**
 * Mock validations in backend format
 */
export function getMockBackendValidations(_agentId: string): BackendValidation[] {
  return [
    {
      type: 'tee',
      status: 'valid',
      validatorAddress: '0xvalidator111111111111111111111111111111',
      attestationId: 'att-123',
      timestamp: '2024-01-15T10:00:00Z',
      expiresAt: '2025-01-15T10:00:00Z',
    },
  ];
}

/**
 * Mock similar agents in backend format
 */
export function getMockBackendSimilarAgents(targetAgentId: string): BackendSimilarAgent[] {
  // Return other agents as similar (exclude the target)
  return mockBackendAgents
    .filter((a) => a.id !== targetAgentId)
    .slice(0, 3)
    .map((agent, index) => ({
      ...agent,
      similarityScore: 85 - index * 10,
      matchedSkills: agent.oasf?.skills.map((s) => s.slug) ?? [],
      matchedDomains: agent.oasf?.domains.map((d) => d.slug) ?? [],
    }));
}

/**
 * Filter agents based on search request
 */
export function filterBackendAgents(
  query: string,
  filters?: {
    chainIds?: number[];
    active?: boolean;
    mcp?: boolean;
    a2a?: boolean;
    x402?: boolean;
  },
): BackendSearchResult[] {
  let result = [...mockBackendAgents];

  // Apply text filter
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
    );
  }

  // Apply chain filter
  if (filters?.chainIds && filters.chainIds.length > 0) {
    result = result.filter((a) => filters.chainIds!.includes(a.chainId));
  }

  // Apply capability filters
  if (filters?.active === true) result = result.filter((a) => a.active === true);
  if (filters?.mcp === true) result = result.filter((a) => a.hasMcp === true);
  if (filters?.a2a === true) result = result.filter((a) => a.hasA2a === true);
  if (filters?.x402 === true) result = result.filter((a) => a.x402Support === true);

  return result;
}
