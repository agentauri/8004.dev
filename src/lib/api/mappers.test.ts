import { describe, expect, it } from 'vitest';
import type {
  BackendAgent,
  BackendAgentWarning,
  BackendFeedback,
  BackendHealthCheck,
  BackendHealthScore,
  BackendOASFClassification,
  BackendReputation,
  BackendSearchResult,
  BackendSimilarAgent,
} from '@/types/backend';
import {
  mapAgentDetailResponse,
  mapAgentsToSummaries,
  mapAgentToFull,
  mapAgentToSummary,
  mapFeedback,
  mapHealthCheck,
  mapHealthScore,
  mapOASF,
  mapReputation,
  mapSearchResultsToSummaries,
  mapSearchResultToSummary,
  mapSimilarAgent,
  mapSimilarAgents,
  mapValidation,
  mapWarning,
  mapWarnings,
} from './mappers';

// Test fixtures
const mockOASF: BackendOASFClassification = {
  skills: [
    { slug: 'natural_language_processing/text_generation', confidence: 0.95 },
    { slug: 'code_generation', confidence: 0.85 },
  ],
  domains: [{ slug: 'technology/software_development', confidence: 0.9 }],
  confidence: 0.92,
  classifiedAt: '2024-12-09T10:00:00.000Z',
  modelVersion: 'claude-3-haiku-20240307',
};

const mockBackendAgent: BackendAgent = {
  id: '11155111:1',
  chainId: 11155111,
  tokenId: '1',
  name: 'AI Helper',
  description: 'An AI assistant agent',
  image: 'https://example.com/image.png',
  active: true,
  hasMcp: true,
  hasA2a: false,
  x402Support: true,
  supportedTrust: ['eas'],
  oasf: mockOASF,
  // New registration structure (preferred)
  registration: {
    chainId: 11155111,
    tokenId: '1',
    contractAddress: '0xcontract1234',
    metadataUri: 'ipfs://QmXYZ',
    owner: '0x1234567890abcdef',
    registeredAt: '2024-01-01T00:00:00.000Z',
  },
  // Deprecated but still supported for backwards compatibility
  metadata: {
    owner: '0xoldowner',
    createdAt: '2023-12-01T00:00:00.000Z',
  },
};

const mockSearchResult: BackendSearchResult = {
  ...mockBackendAgent,
  searchScore: 0.95,
};

const mockFeedback: BackendFeedback = {
  id: 'feedback-123',
  score: 85,
  tags: ['reliable', 'fast'],
  context: 'Great agent!',
  submitter: '0xabcd1234',
  easUid: 'eas-uid-123',
  submittedAt: '2024-12-09T10:00:00.000Z',
};

const mockReputation: BackendReputation = {
  agentId: '11155111:1',
  reputation: {
    count: 25,
    averageScore: 78.5,
    distribution: {
      low: 3,
      medium: 7,
      high: 15,
    },
  },
  recentFeedback: [mockFeedback],
};

describe('mappers', () => {
  describe('mapOASF', () => {
    it('should map OASF classification preserving confidence and reasoning', () => {
      const result = mapOASF(mockOASF);

      expect(result).toEqual({
        skills: [
          {
            slug: 'natural_language_processing/text_generation',
            confidence: 0.95,
            reasoning: undefined,
          },
          { slug: 'code_generation', confidence: 0.85, reasoning: undefined },
        ],
        domains: [
          { slug: 'technology/software_development', confidence: 0.9, reasoning: undefined },
        ],
      });
    });

    it('should return undefined for undefined input', () => {
      const result = mapOASF(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle empty arrays', () => {
      const emptyOASF: BackendOASFClassification = {
        skills: [],
        domains: [],
        confidence: 0,
        classifiedAt: '',
        modelVersion: '',
      };

      const result = mapOASF(emptyOASF);
      expect(result).toEqual({ skills: [], domains: [] });
    });

    it('should preserve reasoning when present', () => {
      const oasfWithReasoning: BackendOASFClassification = {
        skills: [{ slug: 'code_generation', confidence: 0.9, reasoning: 'Agent generates code' }],
        domains: [],
        confidence: 0.9,
        classifiedAt: '',
        modelVersion: '',
      };

      const result = mapOASF(oasfWithReasoning);
      expect(result?.skills[0].reasoning).toBe('Agent generates code');
    });
  });

  describe('mapAgentToSummary', () => {
    it('should map backend agent to summary', () => {
      const result = mapAgentToSummary(mockBackendAgent);

      expect(result).toEqual({
        id: '11155111:1',
        chainId: 11155111,
        tokenId: '1',
        name: 'AI Helper',
        description: 'An AI assistant agent',
        image: 'https://example.com/image.png',
        active: true,
        x402support: true, // Note: lowercase 's'
        hasMcp: true,
        hasA2a: false,
        supportedTrust: ['eas'],
        oasf: {
          skills: [
            {
              slug: 'natural_language_processing/text_generation',
              confidence: 0.95,
              reasoning: undefined,
            },
            { slug: 'code_generation', confidence: 0.85, reasoning: undefined },
          ],
          domains: [
            { slug: 'technology/software_development', confidence: 0.9, reasoning: undefined },
          ],
        },
        oasfSource: undefined,
        operators: undefined,
        ens: undefined,
        did: undefined,
        walletAddress: undefined,
        reputationScore: undefined,
        reputationCount: undefined,
      });
    });

    it('should handle agent without OASF', () => {
      const agentWithoutOASF: BackendAgent = {
        ...mockBackendAgent,
        oasf: undefined,
      };

      const result = mapAgentToSummary(agentWithoutOASF);
      expect(result.oasf).toBeUndefined();
    });

    it('should handle agent without image', () => {
      const agentWithoutImage: BackendAgent = {
        ...mockBackendAgent,
        image: undefined,
      };

      const result = mapAgentToSummary(agentWithoutImage);
      expect(result.image).toBeUndefined();
    });

    it('should use fallback name when name is empty', () => {
      const agentWithEmptyName: BackendAgent = {
        ...mockBackendAgent,
        name: '',
      };

      const result = mapAgentToSummary(agentWithEmptyName);
      expect(result.name).toBe('Agent #1');
    });

    it('should use fallback name when name is whitespace', () => {
      const agentWithWhitespaceName: BackendAgent = {
        ...mockBackendAgent,
        name: '   ',
      };

      const result = mapAgentToSummary(agentWithWhitespaceName);
      expect(result.name).toBe('Agent #1');
    });
  });

  describe('mapSearchResultToSummary', () => {
    it('should map search result with score', () => {
      const result = mapSearchResultToSummary(mockSearchResult);

      expect(result.id).toBe('11155111:1');
      expect(result.relevanceScore).toBe(95); // 0.95 * 100 rounded
    });

    it('should round search score to integer', () => {
      const resultWithDecimal: BackendSearchResult = {
        ...mockSearchResult,
        searchScore: 0.876,
      };

      const result = mapSearchResultToSummary(resultWithDecimal);
      expect(result.relevanceScore).toBe(88); // 87.6 rounded
    });

    it('should include matchReasons if present', () => {
      const resultWithReasons: BackendSearchResult = {
        ...mockSearchResult,
        matchReasons: ['Matched description', 'Matched capability'],
      };

      const result = mapSearchResultToSummary(resultWithReasons);
      expect(result.matchReasons).toEqual(['Matched description', 'Matched capability']);
    });

    it('should handle missing matchReasons', () => {
      const result = mapSearchResultToSummary(mockSearchResult);
      expect(result.matchReasons).toBeUndefined();
    });
  });

  describe('mapAgentToFull', () => {
    it('should map backend agent to full agent', () => {
      const result = mapAgentToFull(mockBackendAgent);

      expect(result.id).toBe('11155111:1');
      expect(result.x402support).toBe(true);
      expect(result.endpoints.mcp).toBeDefined();
      expect(result.endpoints.a2a).toBeUndefined();
      expect(result.registration.owner).toBe('0x1234567890abcdef');
      expect(result.registration.registeredAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should use registration fields over deprecated metadata fields', () => {
      const result = mapAgentToFull(mockBackendAgent);

      // registration.owner should take precedence over metadata.owner
      expect(result.registration.owner).toBe('0x1234567890abcdef');
      expect(result.registration.registeredAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.registration.contractAddress).toBe('0xcontract1234');
      expect(result.registration.metadataUri).toBe('ipfs://QmXYZ');
    });

    it('should fall back to metadata fields when registration is not present', () => {
      const agentWithOnlyMetadata: BackendAgent = {
        ...mockBackendAgent,
        registration: undefined,
      };

      const result = mapAgentToFull(agentWithOnlyMetadata);
      expect(result.registration.owner).toBe('0xoldowner');
      expect(result.registration.registeredAt).toBe('2023-12-01T00:00:00.000Z');
    });

    it('should use actual endpoint data when provided', () => {
      const agentWithEndpoints: BackendAgent = {
        ...mockBackendAgent,
        endpoints: {
          mcp: { url: 'https://mcp.example.com', version: '1.0.0' },
          a2a: { url: 'https://a2a.example.com', version: '2.0.0' },
          agentWallet: '0xagentwallet1234',
        },
      };

      const result = mapAgentToFull(agentWithEndpoints);
      expect(result.endpoints.mcp).toEqual({ url: 'https://mcp.example.com', version: '1.0.0' });
      expect(result.endpoints.a2a).toEqual({ url: 'https://a2a.example.com', version: '2.0.0' });
      expect(result.endpoints.agentWallet).toBe('0xagentwallet1234');
    });

    it('should fall back to walletAddress when agentWallet not in endpoints', () => {
      const agentWithWalletAddress: BackendAgent = {
        ...mockBackendAgent,
        walletAddress: '0xfallbackwallet',
        endpoints: undefined,
      };

      const result = mapAgentToFull(agentWithWalletAddress);
      expect(result.endpoints.agentWallet).toBe('0xfallbackwallet');
    });

    it('should include ens and did in endpoints', () => {
      const agentWithEnsAndDid: BackendAgent = {
        ...mockBackendAgent,
        ens: 'agent.eth',
        did: 'did:web:example.com',
      };

      const result = mapAgentToFull(agentWithEnsAndDid);
      expect(result.endpoints.ens).toBe('agent.eth');
      expect(result.endpoints.did).toBe('did:web:example.com');
    });

    it('should set endpoints based on hasMcp/hasA2a flags when no endpoint data', () => {
      const agentWithA2a: BackendAgent = {
        ...mockBackendAgent,
        hasMcp: false,
        hasA2a: true,
        endpoints: undefined,
      };

      const result = mapAgentToFull(agentWithA2a);
      expect(result.endpoints.mcp).toBeUndefined();
      expect(result.endpoints.a2a).toBeDefined();
    });

    it('should handle missing metadata and registration', () => {
      const agentWithoutBoth: BackendAgent = {
        ...mockBackendAgent,
        metadata: undefined,
        registration: undefined,
      };

      const result = mapAgentToFull(agentWithoutBoth);
      expect(result.registration.owner).toBe('');
      expect(result.registration.registeredAt).toBe('');
    });

    it('should use fallback name when name is empty', () => {
      const agentWithEmptyName: BackendAgent = {
        ...mockBackendAgent,
        name: '',
      };

      const result = mapAgentToFull(agentWithEmptyName);
      expect(result.name).toBe('Agent #1');
    });
  });

  describe('mapFeedback', () => {
    it('should map backend feedback to frontend format', () => {
      const result = mapFeedback(mockFeedback);

      expect(result).toEqual({
        id: 'feedback-123',
        score: 85,
        tags: ['reliable', 'fast'],
        context: 'Great agent!',
        submitter: '0xabcd1234',
        timestamp: '2024-12-09T10:00:00.000Z',
        feedbackUri: 'https://sepolia.easscan.org/attestation/view/eas-uid-123',
      });
    });

    it('should handle missing easUid', () => {
      const feedbackWithoutEas: BackendFeedback = {
        ...mockFeedback,
        easUid: undefined,
      };

      const result = mapFeedback(feedbackWithoutEas);
      expect(result.feedbackUri).toBeUndefined();
    });

    it('should handle missing context', () => {
      const feedbackWithoutContext: BackendFeedback = {
        ...mockFeedback,
        context: undefined,
      };

      const result = mapFeedback(feedbackWithoutContext);
      expect(result.context).toBeUndefined();
    });
  });

  describe('mapReputation', () => {
    it('should map backend reputation to frontend format', () => {
      const result = mapReputation(mockReputation);

      expect(result).toEqual({
        count: 25,
        averageScore: 78.5,
        distribution: {
          low: 3,
          medium: 7,
          high: 15,
        },
      });
    });
  });

  describe('mapAgentDetailResponse', () => {
    it('should combine agent and reputation into detail response', () => {
      const result = mapAgentDetailResponse(mockBackendAgent, mockReputation);

      expect(result.agent.id).toBe('11155111:1');
      expect(result.agent.reputation).toBeDefined();
      expect(result.agent.reputation?.count).toBe(25);
      expect(result.reputation.averageScore).toBe(78.5);
      expect(result.recentFeedback).toHaveLength(1);
      expect(result.recentFeedback[0].id).toBe('feedback-123');
    });
  });

  describe('mapAgentsToSummaries', () => {
    it('should map array of agents', () => {
      const agents: BackendAgent[] = [
        mockBackendAgent,
        { ...mockBackendAgent, id: '11155111:2', tokenId: '2' },
      ];

      const result = mapAgentsToSummaries(agents);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('11155111:1');
      expect(result[1].id).toBe('11155111:2');
    });

    it('should return empty array for empty input', () => {
      const result = mapAgentsToSummaries([]);
      expect(result).toEqual([]);
    });
  });

  describe('mapSearchResultsToSummaries', () => {
    it('should map array of search results', () => {
      const results: BackendSearchResult[] = [
        mockSearchResult,
        { ...mockSearchResult, id: '11155111:2', tokenId: '2', searchScore: 0.8 },
      ];

      const summaries = mapSearchResultsToSummaries(results);

      expect(summaries).toHaveLength(2);
      expect(summaries[0].relevanceScore).toBe(95);
      expect(summaries[1].relevanceScore).toBe(80);
    });
  });

  describe('mapValidation', () => {
    it('should return undefined for undefined input', () => {
      const result = mapValidation(undefined);
      expect(result).toBeUndefined();
    });

    it('should map backend validation to frontend format', () => {
      const backendValidation = {
        type: 'tee' as const,
        status: 'valid' as const,
        validatorAddress: '0x1234567890abcdef',
        attestationId: 'att-123',
        timestamp: '2024-01-15T10:00:00.000Z',
        expiresAt: '2025-01-15T10:00:00.000Z',
      };

      const result = mapValidation(backendValidation);

      expect(result).toEqual({
        type: 'tee',
        status: 'valid',
        validatorAddress: '0x1234567890abcdef',
        attestationId: 'att-123',
        timestamp: '2024-01-15T10:00:00.000Z',
        expiresAt: '2025-01-15T10:00:00.000Z',
      });
    });

    it('should handle validation with missing optional fields', () => {
      const backendValidation = {
        type: 'zkml' as const,
        status: 'pending' as const,
      };

      const result = mapValidation(backendValidation);

      expect(result).toEqual({
        type: 'zkml',
        status: 'pending',
        validatorAddress: undefined,
        attestationId: undefined,
        timestamp: undefined,
        expiresAt: undefined,
      });
    });
  });

  describe('mapWarning', () => {
    it('should map backend warning to frontend format', () => {
      const backendWarning: BackendAgentWarning = {
        type: 'metadata',
        message: 'Missing description',
        severity: 'medium',
      };

      const result = mapWarning(backendWarning);

      expect(result).toEqual({
        type: 'metadata',
        message: 'Missing description',
        severity: 'medium',
      });
    });
  });

  describe('mapWarnings', () => {
    it('should map array of warnings', () => {
      const warnings: BackendAgentWarning[] = [
        { type: 'metadata', message: 'Missing image', severity: 'low' },
        { type: 'endpoint', message: 'MCP endpoint unreachable', severity: 'high' },
      ];

      const result = mapWarnings(warnings);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('metadata');
      expect(result[1].severity).toBe('high');
    });

    it('should return empty array for undefined', () => {
      const result = mapWarnings(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('mapHealthCheck', () => {
    it('should map backend health check to frontend format', () => {
      const check: BackendHealthCheck = {
        category: 'endpoints',
        status: 'pass',
        score: 100,
        message: 'All endpoints responding',
      };

      const result = mapHealthCheck(check);

      expect(result).toEqual({
        category: 'endpoints',
        status: 'pass',
        score: 100,
        message: 'All endpoints responding',
      });
    });
  });

  describe('mapHealthScore', () => {
    it('should map backend health score to frontend format', () => {
      const healthScore: BackendHealthScore = {
        overallScore: 85,
        checks: [
          { category: 'metadata', status: 'pass', score: 100, message: 'Complete' },
          { category: 'endpoints', status: 'warning', score: 70, message: 'Slow response' },
        ],
      };

      const result = mapHealthScore(healthScore);

      expect(result).toEqual({
        overallScore: 85,
        checks: [
          { category: 'metadata', status: 'pass', score: 100, message: 'Complete' },
          { category: 'endpoints', status: 'warning', score: 70, message: 'Slow response' },
        ],
      });
    });

    it('should return undefined for undefined input', () => {
      const result = mapHealthScore(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mapSimilarAgent', () => {
    it('should map backend similar agent to frontend format', () => {
      const similarAgent: BackendSimilarAgent = {
        ...mockBackendAgent,
        similarityScore: 85,
        matchedSkills: ['code_generation', 'text_analysis'],
        matchedDomains: ['technology'],
      };

      const result = mapSimilarAgent(similarAgent);

      expect(result.id).toBe('11155111:1');
      expect(result.similarityScore).toBe(85);
      expect(result.matchedSkills).toEqual(['code_generation', 'text_analysis']);
      expect(result.matchedDomains).toEqual(['technology']);
    });
  });

  describe('mapSimilarAgents', () => {
    it('should map array of similar agents', () => {
      const agents: BackendSimilarAgent[] = [
        {
          ...mockBackendAgent,
          id: '11155111:1',
          similarityScore: 90,
          matchedSkills: ['code_generation'],
          matchedDomains: ['technology'],
        },
        {
          ...mockBackendAgent,
          id: '11155111:2',
          tokenId: '2',
          similarityScore: 75,
          matchedSkills: [],
          matchedDomains: ['technology'],
        },
      ];

      const result = mapSimilarAgents(agents);

      expect(result).toHaveLength(2);
      expect(result[0].similarityScore).toBe(90);
      expect(result[1].similarityScore).toBe(75);
    });
  });

  describe('mapFeedback with transactionHash', () => {
    it('should include transactionHash when present', () => {
      const feedbackWithTx: BackendFeedback = {
        ...mockFeedback,
        transactionHash: '0xabc123def456',
      };

      const result = mapFeedback(feedbackWithTx);

      expect(result.transactionHash).toBe('0xabc123def456');
    });

    it('should handle missing transactionHash', () => {
      const result = mapFeedback(mockFeedback);
      expect(result.transactionHash).toBeUndefined();
    });
  });

  describe('mapAgentToFull with new fields', () => {
    it('should include lastUpdatedAt when present', () => {
      const agentWithTimestamp: BackendAgent = {
        ...mockBackendAgent,
        lastUpdatedAt: '2024-12-15T10:00:00.000Z',
      };

      const result = mapAgentToFull(agentWithTimestamp);

      expect(result.lastUpdatedAt).toBe('2024-12-15T10:00:00.000Z');
    });

    it('should include warnings when present', () => {
      const agentWithWarnings: BackendAgent = {
        ...mockBackendAgent,
        warnings: [{ type: 'metadata', message: 'Missing image', severity: 'low' }],
      };

      const result = mapAgentToFull(agentWithWarnings);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings?.[0].type).toBe('metadata');
    });

    it('should include healthScore when present', () => {
      const agentWithHealth: BackendAgent = {
        ...mockBackendAgent,
        healthScore: {
          overallScore: 95,
          checks: [{ category: 'metadata', status: 'pass', score: 100, message: 'OK' }],
        },
      };

      const result = mapAgentToFull(agentWithHealth);

      expect(result.healthScore?.overallScore).toBe(95);
      expect(result.healthScore?.checks).toHaveLength(1);
    });
  });
});

// ============================================================================
// Leaderboard Mapper Tests
// ============================================================================

import type { BackendLeaderboardEntry, BackendGlobalFeedback, BackendTrendingAgent } from '@/types/backend';
import {
  mapLeaderboardEntry,
  mapLeaderboardEntries,
  mapGlobalFeedback,
  mapGlobalFeedbacks,
  getScoreCategory,
  mapTrendingAgent,
  mapTrendingAgents,
} from './mappers';

const mockLeaderboardEntry: BackendLeaderboardEntry = {
  agentId: '11155111:42',
  chainId: 11155111,
  tokenId: 42,
  name: 'CodeReview Pro',
  description: 'An AI code reviewer',
  image: 'https://example.com/image.png',
  score: 95,
  feedbackCount: 156,
  trend: 'up',
  active: true,
  hasMcp: true,
  hasA2a: true,
  x402Support: false,
  registeredAt: '2024-01-15T10:00:00Z',
};

describe('mapLeaderboardEntry', () => {
  it('should map backend entry to frontend with rank', () => {
    const result = mapLeaderboardEntry(mockLeaderboardEntry, 1);

    expect(result.rank).toBe(1);
    expect(result.agentId).toBe('11155111:42');
    expect(result.name).toBe('CodeReview Pro');
    expect(result.score).toBe(95);
    expect(result.feedbackCount).toBe(156);
    expect(result.trend).toBe('up');
  });

  it('should handle missing name with fallback', () => {
    const entryNoName = { ...mockLeaderboardEntry, name: undefined };
    const result = mapLeaderboardEntry(entryNoName as BackendLeaderboardEntry, 1);

    expect(result.name).toBe('Agent #42');
  });

  it('should default missing fields', () => {
    const minimalEntry: BackendLeaderboardEntry = {
      agentId: '11155111:1',
      chainId: 11155111,
      tokenId: 1,
    };
    const result = mapLeaderboardEntry(minimalEntry, 5);

    expect(result.score).toBe(0);
    expect(result.feedbackCount).toBe(0);
    expect(result.trend).toBe('stable');
    expect(result.active).toBe(false);
    expect(result.hasMcp).toBe(false);
  });
});

describe('mapLeaderboardEntries', () => {
  it('should map array with correct ranks', () => {
    const entries = [mockLeaderboardEntry, { ...mockLeaderboardEntry, agentId: '84532:15', tokenId: 15 }];
    const result = mapLeaderboardEntries(entries);

    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[1].rank).toBe(2);
  });

  it('should start from custom rank', () => {
    const entries = [mockLeaderboardEntry];
    const result = mapLeaderboardEntries(entries, 10);

    expect(result[0].rank).toBe(10);
  });
});

// ============================================================================
// Global Feedback Mapper Tests
// ============================================================================

const mockGlobalFeedback: BackendGlobalFeedback = {
  id: 'fb_1',
  score: 92,
  tags: ['reliable', 'fast'],
  context: 'Excellent code review',
  submitter: '0x1234567890abcdef1234567890abcdef12345678',
  submittedAt: '2026-01-05T10:00:00Z',
  txHash: '0xabc123',
  easUid: 'eas_uid_123',
  agentId: '11155111:42',
  agentName: 'CodeReview Pro',
  agentChainId: 11155111,
};

describe('mapGlobalFeedback', () => {
  it('should map backend feedback to frontend', () => {
    const result = mapGlobalFeedback(mockGlobalFeedback);

    expect(result.id).toBe('fb_1');
    expect(result.score).toBe(92);
    expect(result.tags).toEqual(['reliable', 'fast']);
    expect(result.context).toBe('Excellent code review');
    expect(result.submitter).toBe('0x1234567890abcdef1234567890abcdef12345678');
    expect(result.timestamp).toBe('2026-01-05T10:00:00Z');
    expect(result.transactionHash).toBe('0xabc123');
    expect(result.agentId).toBe('11155111:42');
    expect(result.agentName).toBe('CodeReview Pro');
  });

  it('should construct feedbackUri from easUid', () => {
    const result = mapGlobalFeedback(mockGlobalFeedback);

    expect(result.feedbackUri).toBe('https://sepolia.easscan.org/attestation/view/eas_uid_123');
  });

  it('should handle missing easUid', () => {
    const feedbackNoEas = { ...mockGlobalFeedback, easUid: undefined };
    const result = mapGlobalFeedback(feedbackNoEas);

    expect(result.feedbackUri).toBeUndefined();
  });

  it('should default empty tags array', () => {
    const feedbackNoTags = { ...mockGlobalFeedback, tags: undefined };
    const result = mapGlobalFeedback(feedbackNoTags as BackendGlobalFeedback);

    expect(result.tags).toEqual([]);
  });
});

describe('mapGlobalFeedbacks', () => {
  it('should map array of feedbacks', () => {
    const feedbacks = [mockGlobalFeedback, { ...mockGlobalFeedback, id: 'fb_2', score: 45 }];
    const result = mapGlobalFeedbacks(feedbacks);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('fb_1');
    expect(result[1].id).toBe('fb_2');
    expect(result[1].score).toBe(45);
  });
});

describe('getScoreCategory', () => {
  it('should return positive for scores >= 70', () => {
    expect(getScoreCategory(100)).toBe('positive');
    expect(getScoreCategory(70)).toBe('positive');
    expect(getScoreCategory(85)).toBe('positive');
  });

  it('should return neutral for scores 40-69', () => {
    expect(getScoreCategory(69)).toBe('neutral');
    expect(getScoreCategory(40)).toBe('neutral');
    expect(getScoreCategory(55)).toBe('neutral');
  });

  it('should return negative for scores < 40', () => {
    expect(getScoreCategory(39)).toBe('negative');
    expect(getScoreCategory(0)).toBe('negative');
    expect(getScoreCategory(20)).toBe('negative');
  });
});

// ============================================================================
// Trending Mapper Tests
// ============================================================================

const mockTrendingAgent: BackendTrendingAgent = {
  agentId: '11155111:42',
  chainId: 11155111,
  tokenId: 42,
  name: 'CodeReview Pro',
  image: 'https://example.com/image.png',
  currentScore: 92,
  previousScore: 78,
  scoreChange: 14,
  percentageChange: 17.9,
  trend: 'up',
  active: true,
  hasMcp: true,
  hasA2a: true,
  x402Support: false,
};

describe('mapTrendingAgent', () => {
  it('should map backend trending agent to frontend', () => {
    const result = mapTrendingAgent(mockTrendingAgent);

    expect(result.id).toBe('11155111:42');
    expect(result.chainId).toBe(11155111);
    expect(result.name).toBe('CodeReview Pro');
    expect(result.currentScore).toBe(92);
    expect(result.previousScore).toBe(78);
    expect(result.scoreChange).toBe(14);
    expect(result.percentageChange).toBe(17.9);
    expect(result.trend).toBe('up');
    expect(result.isActive).toBe(true);
  });

  it('should handle missing name with fallback', () => {
    const agentNoName = { ...mockTrendingAgent, name: undefined };
    const result = mapTrendingAgent(agentNoName as BackendTrendingAgent);

    expect(result.name).toBe('Agent #42');
  });

  it('should default missing fields', () => {
    const minimalAgent: BackendTrendingAgent = {
      agentId: '11155111:1',
      chainId: 11155111,
      tokenId: 1,
    };
    const result = mapTrendingAgent(minimalAgent);

    expect(result.currentScore).toBe(0);
    expect(result.previousScore).toBe(0);
    expect(result.scoreChange).toBe(0);
    expect(result.percentageChange).toBe(0);
    expect(result.trend).toBe('stable');
    expect(result.isActive).toBe(false);
  });
});

describe('mapTrendingAgents', () => {
  it('should map array of trending agents', () => {
    const agents = [mockTrendingAgent, { ...mockTrendingAgent, agentId: '84532:15', tokenId: 15 }];
    const result = mapTrendingAgents(agents);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('11155111:42');
    expect(result[1].id).toBe('84532:15');
  });
});

// ============================================================================
// Stream Mapper Tests
// ============================================================================

import type {
  BackendStreamMetadata,
  BackendStreamError,
  BackendStreamEvent,
} from '@/types/backend';
import {
  mapStreamMetadata,
  mapStreamError,
  mapStreamEvent,
} from './mappers';

const mockStreamMetadata: BackendStreamMetadata = {
  hydeQuery: 'code review agent',
  totalExpected: 10,
  rerankerModel: 'cross-encoder-v1',
};

const mockStreamError: BackendStreamError = {
  code: 'SEARCH_FAILED',
  message: 'Search service unavailable',
};

describe('mapStreamMetadata', () => {
  it('should map backend stream metadata to frontend', () => {
    const result = mapStreamMetadata(mockStreamMetadata);

    expect(result.hydeQuery).toBe('code review agent');
    expect(result.totalExpected).toBe(10);
    expect(result.rerankerModel).toBe('cross-encoder-v1');
  });
});

describe('mapStreamError', () => {
  it('should map backend stream error to frontend', () => {
    const result = mapStreamError(mockStreamError);

    expect(result.code).toBe('SEARCH_FAILED');
    expect(result.message).toBe('Search service unavailable');
  });
});

describe('mapStreamEvent', () => {
  it('should map result event', () => {
    const resultEvent: BackendStreamEvent = {
      type: 'result',
      data: mockSearchResult,
    };
    const result = mapStreamEvent(resultEvent);

    expect(result.type).toBe('result');
    expect(result.data).toBeDefined();
    expect((result.data as { id: string }).id).toBe('11155111:1');
  });

  it('should map metadata event', () => {
    const metadataEvent: BackendStreamEvent = {
      type: 'metadata',
      data: mockStreamMetadata,
    };
    const result = mapStreamEvent(metadataEvent);

    expect(result.type).toBe('metadata');
    expect((result.data as { hydeQuery: string }).hydeQuery).toBe('code review agent');
  });

  it('should map error event', () => {
    const errorEvent: BackendStreamEvent = {
      type: 'error',
      data: mockStreamError,
    };
    const result = mapStreamEvent(errorEvent);

    expect(result.type).toBe('error');
    expect((result.data as { code: string }).code).toBe('SEARCH_FAILED');
  });

  it('should map done event', () => {
    const doneEvent: BackendStreamEvent = {
      type: 'done',
      data: null,
    };
    const result = mapStreamEvent(doneEvent);

    expect(result.type).toBe('done');
    expect(result.data).toBeNull();
  });
});

// ============================================================================
// Evaluation Mapper Tests
// ============================================================================

import type {
  BackendBenchmarkResult,
  BackendEvaluationScores,
  BackendEvaluation,
} from '@/types/backend';
import {
  mapBenchmarkResult,
  mapEvaluationScores,
  mapEvaluation,
  mapEvaluations,
} from './mappers';

const mockBenchmarkResult: BackendBenchmarkResult = {
  name: 'Response Quality',
  category: 'quality',
  score: 92,
  maxScore: 100,
  details: 'Excellent response accuracy',
};

const mockEvaluationScores: BackendEvaluationScores = {
  safety: 95,
  capability: 88,
  reliability: 92,
  performance: 85,
};

const mockEvaluation: BackendEvaluation = {
  id: 'eval_123',
  agentId: '11155111:42',
  status: 'completed',
  benchmarks: [mockBenchmarkResult],
  scores: mockEvaluationScores,
  createdAt: '2026-01-01T10:00:00Z',
  completedAt: '2026-01-01T10:05:00Z',
};

describe('mapBenchmarkResult', () => {
  it('should map backend benchmark result to frontend', () => {
    const result = mapBenchmarkResult(mockBenchmarkResult);

    expect(result.name).toBe('Response Quality');
    expect(result.category).toBe('quality');
    expect(result.score).toBe(92);
    expect(result.maxScore).toBe(100);
    expect(result.details).toBe('Excellent response accuracy');
  });
});

describe('mapEvaluationScores', () => {
  it('should map backend evaluation scores to frontend', () => {
    const result = mapEvaluationScores(mockEvaluationScores);

    expect(result.safety).toBe(95);
    expect(result.capability).toBe(88);
    expect(result.reliability).toBe(92);
    expect(result.performance).toBe(85);
  });

  it('should default to zero for undefined scores', () => {
    const result = mapEvaluationScores(undefined);

    expect(result.safety).toBe(0);
    expect(result.capability).toBe(0);
    expect(result.reliability).toBe(0);
    expect(result.performance).toBe(0);
  });
});

describe('mapEvaluation', () => {
  it('should map backend evaluation to frontend', () => {
    const result = mapEvaluation(mockEvaluation);

    expect(result.id).toBe('eval_123');
    expect(result.agentId).toBe('11155111:42');
    expect(result.status).toBe('completed');
    expect(result.benchmarks).toHaveLength(1);
    expect(result.benchmarks[0].name).toBe('Response Quality');
    expect(result.scores.safety).toBe(95);
  });

  it('should convert timestamps to Date objects', () => {
    const result = mapEvaluation(mockEvaluation);

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.completedAt).toBeInstanceOf(Date);
  });

  it('should handle missing completedAt', () => {
    const incompleteEval = { ...mockEvaluation, completedAt: undefined };
    const result = mapEvaluation(incompleteEval);

    expect(result.completedAt).toBeUndefined();
  });

  it('should default status to pending', () => {
    const evalNoStatus = { ...mockEvaluation, status: undefined };
    const result = mapEvaluation(evalNoStatus as BackendEvaluation);

    expect(result.status).toBe('pending');
  });
});

describe('mapEvaluations', () => {
  it('should map array of evaluations', () => {
    const evaluations = [mockEvaluation, { ...mockEvaluation, id: 'eval_456' }];
    const result = mapEvaluations(evaluations);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('eval_123');
    expect(result[1].id).toBe('eval_456');
  });
});

// ============================================================================
// Team Composition Mapper Tests
// ============================================================================

import type {
  BackendTeamMember,
  BackendTeamComposition,
} from '@/types/backend';
import {
  mapTeamMember,
  mapTeamComposition,
  mapTeamCompositions,
} from './mappers';

const mockTeamMember: BackendTeamMember = {
  agentId: '11155111:42',
  role: 'code_reviewer',
  contribution: 'Reviews code quality and suggests improvements',
  compatibilityScore: 0.95,
};

const mockTeamComposition: BackendTeamComposition = {
  id: 'team_123',
  task: 'Build a web application with secure authentication',
  team: [mockTeamMember, { ...mockTeamMember, agentId: '84532:15', role: 'security_auditor' }],
  fitnessScore: 0.88,
  reasoning: 'Selected based on complementary skills',
  createdAt: '2026-01-05T10:00:00Z',
};

describe('mapTeamMember', () => {
  it('should map backend team member to frontend', () => {
    const result = mapTeamMember(mockTeamMember);

    expect(result.agentId).toBe('11155111:42');
    expect(result.role).toBe('code_reviewer');
    expect(result.contribution).toBe('Reviews code quality and suggests improvements');
    expect(result.compatibilityScore).toBe(0.95);
  });
});

describe('mapTeamComposition', () => {
  it('should map backend team composition to frontend', () => {
    const result = mapTeamComposition(mockTeamComposition);

    expect(result.id).toBe('team_123');
    expect(result.task).toBe('Build a web application with secure authentication');
    expect(result.team).toHaveLength(2);
    expect(result.fitnessScore).toBe(0.88);
    expect(result.reasoning).toBe('Selected based on complementary skills');
  });

  it('should convert createdAt to Date object', () => {
    const result = mapTeamComposition(mockTeamComposition);

    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should map all team members', () => {
    const result = mapTeamComposition(mockTeamComposition);

    expect(result.team[0].role).toBe('code_reviewer');
    expect(result.team[1].role).toBe('security_auditor');
  });
});

describe('mapTeamCompositions', () => {
  it('should map array of team compositions', () => {
    const compositions = [mockTeamComposition, { ...mockTeamComposition, id: 'team_456' }];
    const result = mapTeamCompositions(compositions);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('team_123');
    expect(result[1].id).toBe('team_456');
  });
});

// ============================================================================
// Intent Template Mapper Tests
// ============================================================================

import type {
  BackendWorkflowStep,
  BackendIntentTemplate,
} from '@/types/backend';
import {
  mapWorkflowStep,
  mapIntentTemplate,
  mapIntentTemplates,
} from './mappers';

const mockWorkflowStep: BackendWorkflowStep = {
  order: 1,
  name: 'Code Analysis',
  description: 'Analyze the codebase for potential issues',
  requiredRole: 'code_analyzer',
  inputs: ['source_code', 'context'],
  outputs: ['analysis_report'],
};

const mockIntentTemplate: BackendIntentTemplate = {
  id: 'template_123',
  name: 'Code Review Workflow',
  description: 'Comprehensive code review process',
  category: 'development',
  steps: [mockWorkflowStep],
  requiredRoles: ['code_analyzer', 'security_auditor'],
  matchedAgents: 5,
};

describe('mapWorkflowStep', () => {
  it('should map backend workflow step to frontend', () => {
    const result = mapWorkflowStep(mockWorkflowStep);

    expect(result.order).toBe(1);
    expect(result.name).toBe('Code Analysis');
    expect(result.description).toBe('Analyze the codebase for potential issues');
    expect(result.requiredRole).toBe('code_analyzer');
    expect(result.inputs).toEqual(['source_code', 'context']);
    expect(result.outputs).toEqual(['analysis_report']);
  });

  it('should default missing fields', () => {
    const minimalStep: BackendWorkflowStep = {};
    const result = mapWorkflowStep(minimalStep);

    expect(result.order).toBe(0);
    expect(result.name).toBe('');
    expect(result.description).toBe('');
    expect(result.requiredRole).toBe('');
    expect(result.inputs).toEqual([]);
    expect(result.outputs).toEqual([]);
  });
});

describe('mapIntentTemplate', () => {
  it('should map backend intent template to frontend', () => {
    const result = mapIntentTemplate(mockIntentTemplate);

    expect(result.id).toBe('template_123');
    expect(result.name).toBe('Code Review Workflow');
    expect(result.description).toBe('Comprehensive code review process');
    expect(result.category).toBe('development');
    expect(result.steps).toHaveLength(1);
    expect(result.requiredRoles).toEqual(['code_analyzer', 'security_auditor']);
    expect(result.matchedAgents).toBe(5);
  });

  it('should default missing fields', () => {
    const minimalTemplate: BackendIntentTemplate = {};
    const result = mapIntentTemplate(minimalTemplate);

    expect(result.id).toBe('');
    expect(result.name).toBe('Unnamed Template');
    expect(result.description).toBe('');
    expect(result.category).toBe('general');
    expect(result.steps).toEqual([]);
    expect(result.requiredRoles).toEqual([]);
  });
});

describe('mapIntentTemplates', () => {
  it('should map array of intent templates', () => {
    const templates = [mockIntentTemplate, { ...mockIntentTemplate, id: 'template_456' }];
    const result = mapIntentTemplates(templates);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('template_123');
    expect(result[1].id).toBe('template_456');
  });
});

// ============================================================================
// Realtime Event Mapper Tests
// ============================================================================

import type {
  BackendAgentCreatedEvent,
  BackendAgentUpdatedEvent,
  BackendAgentClassifiedEvent,
  BackendReputationChangedEvent,
  BackendEvaluationCompletedEvent,
  BackendRealtimeEvent,
} from '@/types/backend';
import {
  mapAgentCreatedEvent,
  mapAgentUpdatedEvent,
  mapAgentClassifiedEvent,
  mapReputationChangedEvent,
  mapEvaluationCompletedEvent,
  mapRealtimeEvent,
} from './mappers';

const mockAgentCreatedEvent: BackendAgentCreatedEvent = {
  agentId: '11155111:42',
  chainId: 11155111,
  tokenId: 42,
  name: 'New Agent',
};

const mockAgentUpdatedEvent: BackendAgentUpdatedEvent = {
  agentId: '11155111:42',
  changedFields: ['name', 'description'],
};

const mockAgentClassifiedEvent: BackendAgentClassifiedEvent = {
  agentId: '11155111:42',
  skills: ['code_review', 'testing'],
  domains: ['development'],
  confidence: 0.95,
};

const mockReputationChangedEvent: BackendReputationChangedEvent = {
  agentId: '11155111:42',
  previousScore: 80,
  newScore: 85,
  feedbackId: 'fb_123',
};

const mockEvaluationCompletedEvent: BackendEvaluationCompletedEvent = {
  evaluationId: 'eval_123',
  agentId: '11155111:42',
  overallScore: 92,
  status: 'completed',
};

describe('mapAgentCreatedEvent', () => {
  it('should map backend agent created event to frontend', () => {
    const result = mapAgentCreatedEvent(mockAgentCreatedEvent);

    expect(result.agentId).toBe('11155111:42');
    expect(result.chainId).toBe(11155111);
    expect(result.tokenId).toBe(42);
    expect(result.name).toBe('New Agent');
  });
});

describe('mapAgentUpdatedEvent', () => {
  it('should map backend agent updated event to frontend', () => {
    const result = mapAgentUpdatedEvent(mockAgentUpdatedEvent);

    expect(result.agentId).toBe('11155111:42');
    expect(result.changedFields).toEqual(['name', 'description']);
  });
});

describe('mapAgentClassifiedEvent', () => {
  it('should map backend agent classified event to frontend', () => {
    const result = mapAgentClassifiedEvent(mockAgentClassifiedEvent);

    expect(result.agentId).toBe('11155111:42');
    expect(result.skills).toEqual(['code_review', 'testing']);
    expect(result.domains).toEqual(['development']);
    expect(result.confidence).toBe(0.95);
  });
});

describe('mapReputationChangedEvent', () => {
  it('should map backend reputation changed event to frontend', () => {
    const result = mapReputationChangedEvent(mockReputationChangedEvent);

    expect(result.agentId).toBe('11155111:42');
    expect(result.previousScore).toBe(80);
    expect(result.newScore).toBe(85);
    expect(result.feedbackId).toBe('fb_123');
  });
});

describe('mapEvaluationCompletedEvent', () => {
  it('should map backend evaluation completed event to frontend', () => {
    const result = mapEvaluationCompletedEvent(mockEvaluationCompletedEvent);

    expect(result.evaluationId).toBe('eval_123');
    expect(result.agentId).toBe('11155111:42');
    expect(result.overallScore).toBe(92);
    expect(result.status).toBe('completed');
  });
});

describe('mapRealtimeEvent', () => {
  it('should map agent.created event', () => {
    const event: BackendRealtimeEvent = {
      type: 'agent.created',
      timestamp: '2026-01-05T10:00:00Z',
      data: mockAgentCreatedEvent,
    };
    const result = mapRealtimeEvent(event);

    expect(result.type).toBe('agent.created');
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.data.agentId).toBe('11155111:42');
  });

  it('should map agent.updated event', () => {
    const event: BackendRealtimeEvent = {
      type: 'agent.updated',
      timestamp: '2026-01-05T10:00:00Z',
      data: mockAgentUpdatedEvent,
    };
    const result = mapRealtimeEvent(event);

    expect(result.type).toBe('agent.updated');
    expect((result.data as { changedFields: string[] }).changedFields).toEqual(['name', 'description']);
  });

  it('should map agent.classified event', () => {
    const event: BackendRealtimeEvent = {
      type: 'agent.classified',
      timestamp: '2026-01-05T10:00:00Z',
      data: mockAgentClassifiedEvent,
    };
    const result = mapRealtimeEvent(event);

    expect(result.type).toBe('agent.classified');
    expect((result.data as { skills: string[] }).skills).toEqual(['code_review', 'testing']);
  });

  it('should map reputation.changed event', () => {
    const event: BackendRealtimeEvent = {
      type: 'reputation.changed',
      timestamp: '2026-01-05T10:00:00Z',
      data: mockReputationChangedEvent,
    };
    const result = mapRealtimeEvent(event);

    expect(result.type).toBe('reputation.changed');
    expect((result.data as { newScore: number }).newScore).toBe(85);
  });

  it('should map evaluation.completed event', () => {
    const event: BackendRealtimeEvent = {
      type: 'evaluation.completed',
      timestamp: '2026-01-05T10:00:00Z',
      data: mockEvaluationCompletedEvent,
    };
    const result = mapRealtimeEvent(event);

    expect(result.type).toBe('evaluation.completed');
    expect((result.data as { overallScore: number }).overallScore).toBe(92);
  });
});
