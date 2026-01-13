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
  PaymentRequiredError: class PaymentRequiredError extends Error {
    constructor(
      message: string,
      public paymentDetails: unknown,
    ) {
      super(message);
      this.name = 'PaymentRequiredError';
    }
  },
  isPaymentRequiredError: (error: unknown) => (error as Error)?.name === 'PaymentRequiredError',
  shouldUseMockData: vi.fn().mockReturnValue(false),
}));

// Import after mocking
import { BackendError, backendFetch } from '@/lib/api/backend';

const mockBackendFetch = vi.mocked(backendFetch);

// Mock backend taxonomy response
const mockTaxonomy = {
  skills: [
    {
      slug: 'natural_language_processing/text_generation',
      name: 'Text Generation',
      category: 'Natural Language Processing',
      description: 'Generate text content',
    },
    {
      slug: 'code_generation',
      name: 'Code Generation',
      category: 'Software Development',
      description: 'Generate code snippets',
    },
  ],
  domains: [
    {
      slug: 'technology',
      name: 'Technology',
      description: 'Technology and software',
    },
    {
      slug: 'finance',
      name: 'Finance',
      description: 'Financial services',
    },
  ],
};

function createRequest(queryParams?: Record<string, string>): Request {
  const url = new URL('http://localhost:3000/api/taxonomy');
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.set(key, value);
    }
  }
  return new Request(url.toString());
}

describe('GET /api/taxonomy', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns full taxonomy', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockTaxonomy,
      });

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.skills).toHaveLength(2);
      expect(data.data.domains).toHaveLength(2);
    });

    it('calls backend with correct endpoint', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockTaxonomy,
      });

      await GET(createRequest());

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/taxonomy',
        expect.objectContaining({
          params: {},
          next: { revalidate: 3600 }, // 1 hour cache
        }),
      );
    });

    it('filters by skill type', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: { skills: mockTaxonomy.skills },
      });

      await GET(createRequest({ type: 'skill' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/taxonomy',
        expect.objectContaining({
          params: { type: 'skill' },
        }),
      );
    });

    it('filters by domain type', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: { domains: mockTaxonomy.domains },
      });

      await GET(createRequest({ type: 'domain' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/taxonomy',
        expect.objectContaining({
          params: { type: 'domain' },
        }),
      );
    });

    it('ignores invalid type parameter', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockTaxonomy,
      });

      await GET(createRequest({ type: 'invalid' }));

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/taxonomy',
        expect.objectContaining({
          params: {}, // No type passed for invalid values
        }),
      );
    });

    it('returns skill details', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockTaxonomy,
      });

      const response = await GET(createRequest());
      const data = await response.json();

      expect(data.data.skills[0]).toHaveProperty('slug');
      expect(data.data.skills[0]).toHaveProperty('name');
      expect(data.data.skills[0]).toHaveProperty('category');
      expect(data.data.skills[0]).toHaveProperty('description');
    });

    it('returns domain details', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockTaxonomy,
      });

      const response = await GET(createRequest());
      const data = await response.json();

      expect(data.data.domains[0]).toHaveProperty('slug');
      expect(data.data.domains[0]).toHaveProperty('name');
      expect(data.data.domains[0]).toHaveProperty('description');
    });
  });

  describe('caching', () => {
    it('uses 1 hour cache for taxonomy', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: mockTaxonomy,
      });

      await GET(createRequest());

      expect(mockBackendFetch).toHaveBeenCalledWith(
        '/api/v1/taxonomy',
        expect.objectContaining({
          next: { revalidate: 3600 },
        }),
      );
    });
  });

  describe('error handling', () => {
    it('returns 500 on backend error', async () => {
      mockBackendFetch.mockRejectedValueOnce(new Error('Database error'));

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // handleRouteError uses the original error message for generic errors
      expect(data.error).toBe('Database error');
      expect(data.code).toBe('TAXONOMY_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Service unavailable', 'SERVICE_UNAVAILABLE', 503);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Service unavailable');
      expect(data.code).toBe('SERVICE_UNAVAILABLE');
    });

    it('handles unauthorized error', async () => {
      const unauthorizedError = new BackendError('Invalid API key', 'UNAUTHORIZED', 401);
      mockBackendFetch.mockRejectedValueOnce(unauthorizedError);

      const response = await GET(createRequest());
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.code).toBe('UNAUTHORIZED');
    });
  });
});
