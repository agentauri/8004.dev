import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

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

// Mock mappers
vi.mock('@/lib/api/mappers', () => ({
  mapSearchResultsToSummaries: vi.fn((results) =>
    results.map((r: { id: string }) => ({ id: r.id, mapped: true })),
  ),
}));

// Import after mocking
import { BackendError, backendFetch } from '@/lib/api/backend';

const mockBackendFetch = vi.mocked(backendFetch);

// Mock backend search results
const mockBackendResults = [
  {
    id: '11155111:123',
    chainId: 11155111,
    tokenId: '123',
    name: 'Search Agent',
    description: 'An agent for searching',
    score: 0.95,
  },
  {
    id: '84532:456',
    chainId: 84532,
    tokenId: '456',
    name: 'Another Agent',
    description: 'Another agent',
    score: 0.85,
  },
];

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/search', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns search results', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      const response = await POST(createRequest({ query: 'test agent' }));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
    });

    it('sends query to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      await POST(createRequest({ query: 'find agents for code review' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/search',
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({
            query: 'find agents for code review',
          }),
        }),
      );
    });

    it('passes optional parameters', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 10 },
      });

      await POST(
        createRequest({
          query: 'test',
          limit: 10,
          minScore: 0.5,
          filters: {
            chainIds: [11155111],
            active: true,
            mcp: true,
          },
        }),
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/search',
        expect.objectContaining({
          body: expect.objectContaining({
            query: 'test',
            limit: 10,
            minScore: 0.5,
            filters: {
              chainIds: [11155111],
              active: true,
              mcp: true,
            },
          }),
        }),
      );
    });

    it('maps backend results to frontend format', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      const response = await POST(createRequest({ query: 'test' }));
      const data = await response.json();

      // Should have mapped results
      expect(data.data[0]).toHaveProperty('mapped', true);
    });

    it('includes meta information', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test query', total: 100, limit: 20 },
      });

      const response = await POST(createRequest({ query: 'test query' }));
      const data = await response.json();

      expect(data.meta).toBeDefined();
    });

    it('uses default limit of 20', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      await POST(createRequest({ query: 'test' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/search',
        expect.objectContaining({
          body: expect.objectContaining({
            limit: 20,
          }),
        }),
      );
    });

    it('passes cursor for pagination', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 100, limit: 20 },
      });

      await POST(createRequest({ query: 'test', cursor: 'abc123' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/search',
        expect.objectContaining({
          body: expect.objectContaining({
            query: 'test',
            limit: 20,
            cursor: 'abc123',
          }),
        }),
      );
    });

    it('does not pass cursor when not provided', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 100, limit: 20 },
      });

      await POST(createRequest({ query: 'test' }));

      const callBody = mockBackendFetch.mock.calls[0]?.[1]?.body as { cursor?: string } | undefined;
      expect(callBody?.cursor).toBeUndefined();
    });

    it('passes sort and order to backend', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      await POST(createRequest({ query: 'test', sort: 'name', order: 'asc' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/search',
        expect.objectContaining({
          body: expect.objectContaining({
            query: 'test',
            limit: 20,
            sort: 'name',
            order: 'asc',
          }),
        }),
      );
    });

    it('passes only sort when order not provided', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      await POST(createRequest({ query: 'test', sort: 'createdAt' }));

      const callBody = mockBackendFetch.mock.calls[0]?.[1]?.body as
        | {
            sort?: string;
            order?: string;
          }
        | undefined;
      expect(callBody?.sort).toBe('createdAt');
      expect(callBody?.order).toBeUndefined();
    });

    it('does not pass sort and order when not provided', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockBackendResults,
        meta: { query: 'test', total: 2, limit: 20 },
      });

      await POST(createRequest({ query: 'test' }));

      const callBody = mockBackendFetch.mock.calls[0]?.[1]?.body as
        | {
            sort?: string;
            order?: string;
          }
        | undefined;
      expect(callBody?.sort).toBeUndefined();
      expect(callBody?.order).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('returns 400 for missing query', async () => {
      const response = await POST(createRequest({}));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Query is required');
      expect(data.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for empty query', async () => {
      const response = await POST(createRequest({ query: '' }));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for non-string query', async () => {
      const response = await POST(createRequest({ query: 123 }));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Query is required');
    });

    it('returns 400 for query too long', async () => {
      const longQuery = 'a'.repeat(1001);
      const response = await POST(createRequest({ query: longQuery }));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Query must be between 1 and 1000 characters');
      expect(data.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for invalid JSON body', async () => {
      const request = new Request('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid JSON body');
      expect(data.code).toBe('PARSE_ERROR');
    });
  });

  describe('error handling', () => {
    it('returns 500 on backend error', async () => {
      mockBackendFetch.mockRejectedValueOnce(new Error('Search service unavailable'));

      const response = await POST(createRequest({ query: 'test' }));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // handleRouteError uses the original error message for generic errors
      expect(data.error).toBe('Search service unavailable');
      expect(data.code).toBe('SEARCH_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Rate limit exceeded', 'RATE_LIMITED', 429);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await POST(createRequest({ query: 'test' }));
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Rate limit exceeded');
      expect(data.code).toBe('RATE_LIMITED');
    });

    it('handles unauthorized error', async () => {
      const unauthorizedError = new BackendError('Invalid API key', 'UNAUTHORIZED', 401);
      mockBackendFetch.mockRejectedValueOnce(unauthorizedError);

      const response = await POST(createRequest({ query: 'test' }));
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.code).toBe('UNAUTHORIZED');
    });
  });
});
