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
