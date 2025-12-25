import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './route';

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

// Mock classification response
const mockClassification = {
  skills: [
    { slug: 'code_generation', confidence: 0.95 },
    { slug: 'text_generation', confidence: 0.85 },
  ],
  domains: [{ slug: 'technology', confidence: 0.9 }],
  confidence: 0.88,
  classifiedAt: '2024-12-09T10:00:00.000Z',
  modelVersion: 'claude-3-haiku',
};

function createRequest(method = 'GET', body?: unknown): Request {
  const options: RequestInit = { method };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  return new Request('http://localhost:3000/api/agents/11155111:123/classify', options);
}

describe('GET /api/agents/[agentId]/classify', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns existing classification', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockClassification,
      });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.skills).toHaveLength(2);
      expect(data.data.domains).toHaveLength(1);
      expect(data.data.confidence).toBe(0.88);
    });

    it('calls backend with correct endpoint', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockClassification,
      });

      await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:456' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:456/classify',
        expect.objectContaining({
          next: { revalidate: 60 },
        }),
      );
    });

    it('includes classification metadata', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockClassification,
      });

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(data.data.classifiedAt).toBe('2024-12-09T10:00:00.000Z');
      expect(data.data.modelVersion).toBe('claude-3-haiku');
    });
  });

  describe('pending classification', () => {
    it('returns 202 when classification is pending', async () => {
      const pendingError = new BackendError('Classification in progress', 'PENDING', 202);
      mockBackendFetch.mockRejectedValueOnce(pendingError);

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(202);
      expect(data.success).toBe(true);
      expect(data.status).toBe('pending');
      expect(data.estimatedTime).toBe('30s');
    });
  });

  describe('no classification available', () => {
    it('returns 404 when no classification exists', async () => {
      const notFoundError = new BackendError('Classification not found', 'NOT_FOUND', 404);
      mockBackendFetch.mockRejectedValueOnce(notFoundError);

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('No classification available');
      expect(data.code).toBe('NOT_FOUND');
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
      mockBackendFetch.mockRejectedValueOnce(new Error('Database error'));

      const response = await GET(createRequest(), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // This route still uses fallback message (has custom error handling)
      expect(data.error).toBe('Failed to fetch classification');
      expect(data.code).toBe('CLASSIFICATION_ERROR');
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

describe('POST /api/agents/[agentId]/classify', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('requests new classification', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: { status: 'queued', agentId: '11155111:123' },
      });

      const response = await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('queued');
    });

    it('calls backend with POST method', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: { status: 'queued', agentId: '11155111:123' },
      });

      await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: '11155111:456' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:456/classify',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('passes force flag when provided', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: { status: 'queued', agentId: '11155111:123' },
      });

      await POST(createRequest('POST', { force: true }), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/classify',
        expect.objectContaining({
          method: 'POST',
          body: { force: true },
        }),
      );
    });

    it('handles empty body', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: { status: 'queued', agentId: '11155111:123' },
      });

      await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/agents/11155111:123/classify',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        }),
      );
    });
  });

  describe('validation', () => {
    it('returns 400 for invalid agent ID format', async () => {
      const response = await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: 'invalid' }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid agent ID format. Expected: chainId:tokenId');
      expect(data.code).toBe('INVALID_AGENT_ID_FORMAT');
    });

    it('returns 400 for empty agent ID', async () => {
      const response = await POST(createRequest('POST'), {
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
      mockBackendFetch.mockRejectedValueOnce(new Error('Classification service error'));

      const response = await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to request classification');
      expect(data.code).toBe('CLASSIFICATION_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Agent not found', 'NOT_FOUND', 404);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: '11155111:999' }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Agent not found');
      expect(data.code).toBe('NOT_FOUND');
    });

    it('handles rate limiting', async () => {
      const rateLimitError = new BackendError('Rate limit exceeded', 'RATE_LIMITED', 429);
      mockBackendFetch.mockRejectedValueOnce(rateLimitError);

      const response = await POST(createRequest('POST'), {
        params: Promise.resolve({ agentId: '11155111:123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.code).toBe('RATE_LIMITED');
    });
  });
});
