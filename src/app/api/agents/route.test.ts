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

// Mock backend agent
const mockBackendAgent = {
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

const mockBackendResponse = {
  success: true as const,
  data: [mockBackendAgent],
  meta: {
    total: 1,
    limit: 20,
    hasMore: false,
    nextCursor: undefined,
  },
};

function createRequest(params: Record<string, string> = {}): Request {
  const url = new URL('http://localhost:3000/api/agents');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new Request(url.toString());
}

describe('GET /api/agents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns agents with default params', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].id).toBe('11155111:1');
      expect(data.meta.total).toBe(1);
    });

    it('maps backend agents to frontend format', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      const response = await GET(createRequest());
      const data = await response.json();

      const agent = data.data[0];
      expect(agent.x402support).toBe(false); // Mapped from x402Support
      // OASF preserves full objects with confidence
      expect(agent.oasf.skills).toEqual([
        { slug: 'code_generation', confidence: 0.9, reasoning: undefined },
      ]);
      expect(agent.oasf.domains).toEqual([
        { slug: 'technology', confidence: 0.85, reasoning: undefined },
      ]);
      // New fields
      expect(agent.oasfSource).toBe('llm-classification');
      expect(agent.operators).toEqual(['0x1234567890abcdef1234567890abcdef12345678']);
      expect(agent.ens).toBe('test-agent.eth');
      expect(agent.walletAddress).toBe('0xabcdef1234567890abcdef1234567890abcdef12');
    });

    it('passes search query as q param', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ q: 'trading' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ q: 'trading' }),
        }),
      );
    });

    it('passes mcp filter', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ mcp: 'true' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ mcp: true }),
        }),
      );
    });

    it('passes a2a filter', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ a2a: 'true' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ a2a: true }),
        }),
      );
    });

    it('passes x402 filter', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ x402: 'true' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ x402: true }),
        }),
      );
    });

    it('passes filterMode=OR', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ filterMode: 'OR' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ filterMode: 'OR' }),
        }),
      );
    });

    it('passes filterMode=AND', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ filterMode: 'AND' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ filterMode: 'AND' }),
        }),
      );
    });

    it('passes domains filter', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ domains: 'technology,finance' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ domains: 'technology,finance' }),
        }),
      );
    });

    it('passes active filter true', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ active: 'true' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ active: true }),
        }),
      );
    });

    it('passes active filter false', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ active: 'false' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ active: false }),
        }),
      );
    });

    it('passes limit parameter', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ limit: '20' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ limit: 20 }),
        }),
      );
    });

    it('passes cursor parameter', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);
      const validCursor = JSON.stringify({ _global_offset: 20 });

      await GET(createRequest({ cursor: validCursor }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ cursor: validCursor }),
        }),
      );
    });

    it('rejects invalid cursor format', async () => {
      const response = await GET(createRequest({ cursor: 'invalid-cursor' }));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_CURSOR_JSON');
    });

    it('passes multiple chains as CSV to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ chains: '11155111,84532' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ chains: '11155111,84532' }),
        }),
      );
    });

    it('passes single chain as CSV to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ chains: '11155111' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ chains: '11155111' }),
        }),
      );
    });

    it('passes chainId param as chains for backwards compatibility', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ chainId: '84532' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ chains: '84532' }),
        }),
      );
    });

    it('passes multiple filters', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(
        createRequest({
          q: 'trading',
          mcp: 'true',
          active: 'true',
          limit: '10',
        }),
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'trading',
            mcp: true,
            active: true,
            limit: 10,
          }),
        }),
      );
    });
  });

  describe('response format', () => {
    it('includes meta with pagination info', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        ...mockBackendResponse,
        meta: {
          total: 100,
          limit: 20,
          hasMore: true,
          nextCursor: 'next123',
        },
      });

      const response = await GET(createRequest());
      const data = await response.json();

      expect(data.meta).toEqual({
        total: 100,
        limit: 20,
        hasMore: true,
        nextCursor: 'next123',
      });
    });
  });

  describe('parameter validation', () => {
    it('ignores limit over 100', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ limit: '200' }));

      const callParams = mockBackendFetch.mock.calls[0][1]?.params;
      expect(callParams?.limit).toBeUndefined();
    });

    it('ignores negative limit', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ limit: '-10' }));

      const callParams = mockBackendFetch.mock.calls[0][1]?.params;
      expect(callParams?.limit).toBeUndefined();
    });

    it('filters out invalid chain IDs from chains CSV', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ chains: '11155111,invalid,84532' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ chains: '11155111,84532' }),
        }),
      );
    });

    it('ignores all invalid chains', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ chains: 'abc,def' }));

      const callParams = mockBackendFetch.mock.calls[0][1]?.params;
      expect(callParams?.chains).toBeUndefined();
    });
  });

  describe('reputation filters', () => {
    it('passes minRep filter to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ minRep: '50' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ minRep: 50 }),
        }),
      );
    });

    it('passes maxRep filter to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ maxRep: '80' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ maxRep: 80 }),
        }),
      );
    });

    it('passes both minRep and maxRep together', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ minRep: '30', maxRep: '70' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ minRep: 30, maxRep: 70 }),
        }),
      );
    });

    it('ignores invalid minRep values', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ minRep: 'invalid' }));

      const callParams = mockBackendFetch.mock.calls[0][1]?.params;
      expect(callParams?.minRep).toBeUndefined();
    });
  });

  describe('skills filter', () => {
    it('passes skills filter to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ skills: 'code_generation' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ skills: 'code_generation' }),
        }),
      );
    });

    it('passes multiple skills as CSV', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ skills: 'code_generation,data_analysis' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ skills: 'code_generation,data_analysis' }),
        }),
      );
    });
  });

  describe('sorting options', () => {
    it('passes sort filter to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ sort: 'reputation' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ sort: 'reputation' }),
        }),
      );
    });

    it('passes order filter to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ order: 'desc' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ order: 'desc' }),
        }),
      );
    });

    it('passes both sort and order together', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ sort: 'createdAt', order: 'asc' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents',
        expect.objectContaining({
          params: expect.objectContaining({ sort: 'createdAt', order: 'asc' }),
        }),
      );
    });
  });

  describe('filterMode validation', () => {
    it('ignores invalid filterMode values', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockBackendResponse);

      await GET(createRequest({ filterMode: 'INVALID' }));

      const callParams = mockBackendFetch.mock.calls[0][1]?.params;
      expect(callParams?.filterMode).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('returns 500 on backend error', async () => {
      mockBackendFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // handleRouteError uses the original error message for generic errors
      expect(data.error).toBe('Network error');
      expect(data.code).toBe('SEARCH_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Rate limit exceeded');
      expect(data.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('handles unauthorized error', async () => {
      const backendError = new BackendError('Invalid API key', 'UNAUTHORIZED', 401);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.code).toBe('UNAUTHORIZED');
    });
  });
});
