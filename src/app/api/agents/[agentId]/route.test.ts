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
  shouldUseMockData: vi.fn().mockReturnValue(false),
}));

// Import after mocking
import { BackendError, backendFetch } from '@/lib/api/backend';

const mockBackendFetch = vi.mocked(backendFetch);

// Mock backend agent response
const mockBackendAgent = {
  id: '11155111:123',
  chainId: 11155111,
  tokenId: '123',
  name: 'Test Agent',
  description: 'A test agent',
  image: 'https://example.com/image.png',
  active: true,
  hasMcp: true,
  hasA2a: false,
  x402Support: true,
  supportedTrust: ['eas'],
  oasf: {
    skills: [{ slug: 'code_generation', confidence: 0.9 }],
    domains: [{ slug: 'technology', confidence: 0.85 }],
    confidence: 0.88,
    classifiedAt: '2024-12-09T10:00:00.000Z',
    modelVersion: 'claude-3-haiku',
  },
  metadata: {
    owner: '0xabcdef1234567890abcdef1234567890abcdef12',
    createdAt: '2024-01-15T10:30:00Z',
  },
};

// Mock backend reputation response (full BackendReputation structure)
const mockBackendReputation = {
  agentId: '11155111:123',
  reputation: {
    count: 100,
    averageScore: 85,
    distribution: { low: 5, medium: 25, high: 70 },
  },
  recentFeedback: [],
};

// Mock backend validations response
const mockBackendValidations = [
  {
    id: 'v1',
    type: 'tee',
    status: 'valid',
    timestamp: '2024-01-15T10:30:00Z',
    details: { provider: 'test' },
  },
];

function createRequest(): Request {
  return new Request('http://localhost:3000/api/agents/11155111:123');
}

describe('GET /api/agents/[agentId]', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns agent detail', async () => {
      mockBackendFetch
        .mockResolvedValueOnce({ success: true, data: mockBackendAgent })
        .mockResolvedValueOnce({ success: true, data: mockBackendReputation })
        .mockResolvedValueOnce({ success: true, data: mockBackendValidations });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.agent.id).toBe('11155111:123');
    });

    it('fetches agent, reputation, and validations in parallel', async () => {
      mockBackendFetch
        .mockResolvedValueOnce({ success: true, data: mockBackendAgent })
        .mockResolvedValueOnce({ success: true, data: mockBackendReputation })
        .mockResolvedValueOnce({ success: true, data: mockBackendValidations });

      await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledTimes(3);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123',
        expect.any(Object),
      );
      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/reputation',
        expect.any(Object),
      );
      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/validations',
        expect.any(Object),
      );
    });

    it('maps backend response to frontend format', async () => {
      mockBackendFetch
        .mockResolvedValueOnce({ success: true, data: mockBackendAgent })
        .mockResolvedValueOnce({ success: true, data: mockBackendReputation })
        .mockResolvedValueOnce({ success: true, data: mockBackendValidations });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      // Check agent mapping
      expect(data.data.agent.x402support).toBe(true); // Mapped from x402Support
      // OASF preserves full objects with confidence
      expect(data.data.agent.oasf.skills).toEqual([
        { slug: 'code_generation', confidence: 0.9, reasoning: undefined },
      ]);

      // Check reputation mapping
      expect(data.data.reputation.count).toBe(100);
      expect(data.data.reputation.averageScore).toBe(85);

      // Check validations mapping
      expect(data.data.validations).toHaveLength(1);
      expect(data.data.validations[0].type).toBe('tee');
    });

    it('handles missing reputation gracefully', async () => {
      mockBackendFetch
        .mockResolvedValueOnce({ success: true, data: mockBackendAgent })
        .mockRejectedValueOnce(new Error('Reputation not found'))
        .mockResolvedValueOnce({ success: true, data: mockBackendValidations });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.reputation.count).toBe(0);
      expect(data.data.reputation.averageScore).toBe(0);
    });

    it('handles missing validations gracefully', async () => {
      mockBackendFetch
        .mockResolvedValueOnce({ success: true, data: mockBackendAgent })
        .mockResolvedValueOnce({ success: true, data: mockBackendReputation })
        .mockRejectedValueOnce(new Error('Validations not found'));

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.validations).toEqual([]);
    });

    it('handles different chain IDs', async () => {
      const baseAgent = { ...mockBackendAgent, id: '84532:456', chainId: 84532 };
      mockBackendFetch
        .mockResolvedValueOnce({ success: true, data: baseAgent })
        .mockResolvedValueOnce({ success: true, data: mockBackendReputation })
        .mockResolvedValueOnce({ success: true, data: mockBackendValidations });

      await GET(createRequest(), {
        params: Promise.resolve({ agentId: '84532:456' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith('/api/v1/agents/84532:456', expect.any(Object));
    });
  });

  describe('not found', () => {
    it('returns 404 when agent not found', async () => {
      const notFoundError = new BackendError('Agent not found', 'NOT_FOUND', 404);
      // Must mock all calls since Promise.all runs them in parallel
      mockBackendFetch
        .mockRejectedValueOnce(notFoundError)
        .mockRejectedValueOnce(new Error('Reputation not found'))
        .mockRejectedValueOnce(new Error('Validations not found'));

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:999' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Agent not found');
      expect(data.code).toBe('AGENT_NOT_FOUND');
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
    it('returns 500 on backend error', async () => {
      // Must mock all calls since Promise.all runs them in parallel
      mockBackendFetch
        .mockRejectedValueOnce(new Error('Database error'))
        .mockRejectedValueOnce(new Error('Reputation not found'))
        .mockRejectedValueOnce(new Error('Validations not found'));

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // handleRouteError uses the original error message for generic errors
      expect(data.error).toBe('Database error');
      expect(data.code).toBe('FETCH_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Service unavailable', 'SERVICE_UNAVAILABLE', 503);
      // Must mock all calls since Promise.all runs them in parallel
      mockBackendFetch
        .mockRejectedValueOnce(backendError)
        .mockRejectedValueOnce(new Error('Reputation not found'))
        .mockRejectedValueOnce(new Error('Validations not found'));

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
