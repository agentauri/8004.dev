import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

// Mock the backend module
vi.mock('@/lib/api/backend', () => ({
  backendFetch: vi.fn(),
  BackendError: class BackendError extends Error {
    constructor(
      message: string,
      public code: string,
      public status: number,
    ) {
      super(message);
      this.name = 'BackendError';
    }
  },
}));

// Import after mocking
import { BackendError, backendFetch } from '@/lib/api/backend';

const mockBackendFetch = vi.mocked(backendFetch);

// Mock backend similar agents response
const mockSimilarAgents = [
  {
    id: '11155111:456',
    chainId: 11155111,
    tokenId: '456',
    name: 'Similar Agent 1',
    description: 'A similar agent',
    image: 'https://example.com/image1.png',
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: false,
    supportedTrust: ['eas'],
    similarityScore: 85,
    matchedSkills: ['code_generation', 'text_analysis'],
    matchedDomains: ['technology'],
  },
  {
    id: '11155111:789',
    chainId: 11155111,
    tokenId: '789',
    name: 'Similar Agent 2',
    description: 'Another similar agent',
    image: 'https://example.com/image2.png',
    active: true,
    hasMcp: false,
    hasA2a: true,
    x402Support: true,
    supportedTrust: [],
    similarityScore: 72,
    matchedSkills: ['code_generation'],
    matchedDomains: ['technology', 'finance'],
  },
];

function createRequest(url = 'http://localhost:3000/api/agents/11155111:123/similar'): Request {
  return new Request(url);
}

describe('GET /api/agents/[agentId]/similar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns similar agents', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: mockSimilarAgents });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.agents).toHaveLength(2);
      expect(data.data.meta.targetAgent).toBe('11155111:123');
    });

    it('maps similarity data correctly', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: mockSimilarAgents });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(data.data.agents[0].similarityScore).toBe(85);
      expect(data.data.agents[0].matchedSkills).toEqual(['code_generation', 'text_analysis']);
      expect(data.data.agents[0].matchedDomains).toEqual(['technology']);
    });

    it('uses default limit of 10', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: mockSimilarAgents });

      await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/similar?limit=10',
        expect.any(Object),
      );
    });

    it('respects custom limit parameter', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: mockSimilarAgents });

      await GET(createRequest('http://localhost:3000/api/agents/11155111:123/similar?limit=5'), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/similar?limit=5',
        expect.any(Object),
      );
    });

    it('caps limit at 20', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: mockSimilarAgents });

      await GET(createRequest('http://localhost:3000/api/agents/11155111:123/similar?limit=100'), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/similar?limit=20',
        expect.any(Object),
      );
    });

    it('handles empty similar agents', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: [] });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.agents).toEqual([]);
      expect(data.data.meta.total).toBe(0);
    });

    it('returns meta information', async () => {
      mockBackendFetch.mockResolvedValueOnce({ success: true, data: mockSimilarAgents });

      const response = await GET(
        createRequest('http://localhost:3000/api/agents/11155111:123/similar?limit=15'),
        {
          params: Promise.resolve({ agentId: '11155111:123' }),
        },
      );
      const data = await response.json();

      expect(data.data.meta).toEqual({
        total: 2,
        limit: 15,
        targetAgent: '11155111:123',
      });
    });
  });

  describe('validation', () => {
    it('returns 400 for invalid agent ID format', async () => {
      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: 'invalid' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid agent ID format. Expected: chainId:tokenId');
      expect(data.code).toBe('INVALID_AGENT_ID_FORMAT');
    });

    it('returns 400 for empty agent ID', async () => {
      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('MISSING_AGENT_ID');
    });
  });

  describe('error handling', () => {
    it('returns 404 when agent not found', async () => {
      const notFoundError = new BackendError('Agent not found', 'NOT_FOUND', 404);
      mockBackendFetch.mockRejectedValueOnce(notFoundError);

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:999' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Agent not found');
      expect(data.code).toBe('AGENT_NOT_FOUND');
    });

    it('returns 500 on backend error', async () => {
      mockBackendFetch.mockRejectedValueOnce(new Error('Database error'));

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.code).toBe('FETCH_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Service unavailable', 'SERVICE_UNAVAILABLE', 503);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Service unavailable');
      expect(data.code).toBe('SERVICE_UNAVAILABLE');
    });
  });
});
