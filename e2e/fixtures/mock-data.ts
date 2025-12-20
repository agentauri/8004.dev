/**
 * Mock data for E2E tests
 * These fixtures provide consistent test data matching the exact API response format
 */

import type { AgentSummary, SimilarAgent } from '@/types/agent';

/**
 * Mock agents matching AgentSummary interface
 */
export const mockAgents: AgentSummary[] = [
  {
    id: '11155111:1',
    chainId: 11155111,
    tokenId: '1',
    name: 'AI Trading Bot',
    description: 'An autonomous trading agent that executes trades based on market analysis',
    image: undefined,
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402support: false,
    supportedTrust: ['reputation'],
    oasf: {
      skills: [{ slug: 'trading', confidence: 0.95 }],
      domains: [{ slug: 'finance', confidence: 0.9 }],
    },
    operators: [],
    ens: undefined,
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    reputationScore: 85,
    reputationCount: 12,
  },
  {
    id: '11155111:2',
    chainId: 11155111,
    tokenId: '2',
    name: 'Code Review Agent',
    description: 'Analyzes code and provides detailed review feedback',
    image: undefined,
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402support: false,
    supportedTrust: ['reputation', 'tee'],
    oasf: {
      skills: [{ slug: 'code_review', confidence: 0.88 }],
      domains: [{ slug: 'technology', confidence: 0.92 }],
    },
    operators: [],
    ens: 'codereview.eth',
    walletAddress: '0x2345678901abcdef2345678901abcdef23456789',
    reputationScore: 92,
    reputationCount: 8,
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
    x402support: true,
    supportedTrust: ['stake'],
    oasf: {
      skills: [{ slug: 'data_analysis', confidence: 0.91 }],
      domains: [{ slug: 'technology', confidence: 0.87 }],
    },
    operators: [],
    ens: undefined,
    walletAddress: '0x3456789012abcdef3456789012abcdef34567890',
    reputationScore: 78,
    reputationCount: 5,
  },
];

/**
 * Mock platform stats matching PlatformStats interface
 */
export const mockStats = {
  totalAgents: 156,
  withMetadata: 142,
  activeAgents: 135,
  chainBreakdown: [
    {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      total: 87,
      withMetadata: 82,
      active: 78,
    },
    {
      chainId: 84532,
      name: 'Base Sepolia',
      total: 45,
      withMetadata: 41,
      active: 39,
    },
    {
      chainId: 80002,
      name: 'Polygon Amoy',
      total: 24,
      withMetadata: 19,
      active: 18,
    },
  ],
};

/**
 * Mock taxonomy data
 */
export const mockTaxonomy = {
  domains: [
    { slug: 'technology', name: 'Technology', description: 'Technology domain' },
    { slug: 'finance', name: 'Finance', description: 'Finance domain' },
  ],
  skills: [
    { slug: 'trading', name: 'Trading', description: 'Trading skills' },
    { slug: 'code_review', name: 'Code Review', description: 'Code review skills' },
    { slug: 'data_analysis', name: 'Data Analysis', description: 'Data analysis skills' },
  ],
};

/**
 * Mock agent detail data
 */
export const mockAgentDetail = {
  agent: {
    id: '11155111:1',
    chainId: 11155111,
    tokenId: '1',
    name: 'AI Trading Bot',
    description: 'An autonomous trading agent that executes trades based on market analysis',
    image: undefined,
    endpoints: {
      mcp: { url: 'https://mcp.example.com', version: '1.0' },
    },
    oasf: {
      skills: [{ slug: 'trading', confidence: 0.95 }],
      domains: [{ slug: 'finance', confidence: 0.9 }],
    },
    supportedTrust: ['reputation'],
    active: true,
    x402support: false,
    registration: {
      chainId: 11155111,
      tokenId: '1',
      contractAddress: '0x1111111111111111111111111111111111111111',
      metadataUri: 'https://example.com/metadata/1',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-10T08:00:00Z',
    },
    reputation: {
      count: 12,
      averageScore: 85,
      distribution: { low: 1, medium: 3, high: 8 },
    },
  },
  reputation: {
    count: 12,
    averageScore: 85,
    distribution: { low: 1, medium: 3, high: 8 },
  },
  recentFeedback: [
    {
      id: 'fb-1',
      score: 90,
      tags: ['reliable', 'fast'],
      context: 'Excellent performance',
      submitter: '0xfeedback1111111111111111111111111111111111',
      timestamp: '2024-01-18T15:30:00Z',
      transactionHash: '0xtx111111111111111111111111111111111111111111',
    },
  ],
  validations: [
    {
      type: 'tee' as const,
      status: 'valid' as const,
      timestamp: '2024-01-15T10:00:00Z',
      expiresAt: '2025-01-15T10:00:00Z',
    },
  ],
};

/**
 * Mock similar agents data
 * SimilarAgent extends AgentSummary with similarity fields
 */
export const mockSimilarAgents: SimilarAgent[] = [
  {
    ...mockAgents[1], // Code Review Agent
    similarityScore: 85,
    matchedSkills: ['code_review'],
    matchedDomains: ['technology'],
  },
  {
    ...mockAgents[2], // Data Analysis Agent
    similarityScore: 72,
    matchedSkills: ['data_analysis'],
    matchedDomains: ['technology'],
  },
];

// API response builders
export function buildSearchResponse(agents = mockAgents, _query = '') {
  return {
    success: true,
    data: agents,
    meta: {
      total: agents.length,
      hasMore: false,
    },
  };
}

export function buildStatsResponse() {
  return {
    success: true,
    data: mockStats,
  };
}

export function buildTaxonomyResponse() {
  return {
    success: true,
    data: mockTaxonomy,
  };
}

export function buildAgentDetailResponse() {
  return {
    success: true,
    data: mockAgentDetail,
  };
}

export function buildSimilarAgentsResponse(agents = mockSimilarAgents) {
  return {
    success: true,
    data: {
      agents,
      meta: {
        total: agents.length,
        limit: 4,
        targetAgent: '11155111:1',
      },
    },
  };
}
