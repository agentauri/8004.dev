import type { AgentSummary } from '@/types';

/**
 * Mock agent summary for frontend tests.
 * Use createMockAgentSummary() for variants.
 */
export const mockAgentSummary: AgentSummary = {
  id: '11155111:1',
  chainId: 11155111,
  tokenId: '1',
  name: 'Test Agent',
  description: 'A test agent for testing purposes',
  active: true,
  hasMcp: true,
  hasA2a: false,
  x402support: false,
  reputationScore: 85,
  reputationCount: 100,
  supportedTrust: ['eas'],
  oasf: {
    skills: [{ slug: 'code_generation', confidence: 0.9 }],
    domains: [{ slug: 'technology', confidence: 0.85 }],
  },
};

/**
 * Mock agent detail response for frontend tests.
 */
export const mockAgentDetail = {
  agent: {
    id: '11155111:123',
    chainId: 11155111,
    tokenId: '123',
    name: 'Test Agent',
    description: 'A test agent for testing',
    active: true,
    x402support: true,
    endpoints: {
      mcp: { url: 'https://mcp.example.com', version: '1.0' },
      a2a: { url: 'https://a2a.example.com', version: '1.0' },
    },
    oasf: { skills: ['code_generation'], domains: ['development'] },
    supportedTrust: ['github'],
    registration: {
      chainId: 11155111,
      tokenId: '123',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataUri: 'ipfs://QmXYZ',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-15T10:30:00Z',
    },
  },
  reputation: {
    count: 100,
    averageScore: 85,
    distribution: { low: 5, medium: 25, high: 70 },
  },
  recentFeedback: [
    {
      id: 'feedback-1',
      score: 90,
      tags: ['reliable', 'fast'],
      submitter: '0x1234',
      timestamp: '2024-01-20T10:00:00Z',
    },
  ],
};

/**
 * Mock backend agent for API route tests.
 * This is the format returned by the backend API.
 */
export const mockBackendAgent = {
  id: '11155111:1',
  chainId: 11155111,
  tokenId: '1',
  name: 'Test Agent',
  description: 'A test agent',
  image: 'https://example.com/image.png',
  active: true,
  hasMcp: true,
  hasA2a: false,
  x402Support: false,
  supportedTrust: ['eas'],
  oasf: {
    skills: [{ slug: 'code_generation', confidence: 0.9 }],
    domains: [{ slug: 'technology', confidence: 0.85 }],
    confidence: 0.88,
    classifiedAt: '2024-12-09T10:00:00.000Z',
    modelVersion: 'claude-3-haiku',
  },
  oasfSource: 'llm-classification' as const,
  operators: ['0x1234567890abcdef1234567890abcdef12345678'],
  ens: 'test-agent.eth',
  walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
};

/**
 * Mock backend response with pagination meta.
 */
export const mockBackendResponse = {
  success: true as const,
  data: [mockBackendAgent],
  meta: {
    total: 1,
    limit: 20,
    hasMore: false,
    nextCursor: undefined,
  },
};

/**
 * Mock related agents for useRelatedAgents tests.
 */
export const mockRelatedAgents = [
  {
    id: '11155111:2',
    chainId: 11155111,
    tokenId: '2',
    name: 'Related Agent 1',
    description: 'Similar agent',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: [],
    reputationScore: 85,
    reputationCount: 10,
  },
  {
    id: '84532:1',
    chainId: 84532,
    tokenId: '1',
    name: 'Related Agent 2',
    description: 'Cross-chain similar agent',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: [],
    reputationScore: 75,
    reputationCount: 5,
  },
];

/**
 * Creates a mock agent summary with custom overrides.
 *
 * @example
 * ```tsx
 * const agent = createMockAgentSummary({ name: 'Custom Agent', active: false });
 * ```
 */
export function createMockAgentSummary(overrides: Partial<AgentSummary> = {}): AgentSummary {
  return { ...mockAgentSummary, ...overrides };
}

/**
 * Creates a mock backend agent with custom overrides.
 *
 * @example
 * ```tsx
 * const agent = createMockBackendAgent({ hasMcp: false, hasA2a: true });
 * ```
 */
export function createMockBackendAgent(overrides: Partial<typeof mockBackendAgent> = {}) {
  return { ...mockBackendAgent, ...overrides };
}

/**
 * Creates an array of mock agents with sequential IDs.
 *
 * @example
 * ```tsx
 * const agents = createMockAgentList(5); // Creates 5 agents
 * ```
 */
export function createMockAgentList(
  count: number,
  baseOverrides: Partial<AgentSummary> = {},
): AgentSummary[] {
  return Array.from({ length: count }, (_, i) =>
    createMockAgentSummary({
      id: `11155111:${i + 1}`,
      tokenId: String(i + 1),
      name: `Agent ${i + 1}`,
      ...baseOverrides,
    }),
  );
}
