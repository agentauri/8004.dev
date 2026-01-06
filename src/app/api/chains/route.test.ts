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

// Mock backend response
const mockChainsResponse = {
  success: true as const,
  data: [
    {
      chainId: 11155111,
      name: 'Ethereum Sepolia',
      shortName: 'Sepolia',
      explorerUrl: 'https://sepolia.etherscan.io',
      totalCount: 300,
      withRegistrationFileCount: 150,
      activeCount: 100,
      status: 'ok' as const,
    },
    {
      chainId: 84532,
      name: 'Base Sepolia',
      shortName: 'Base',
      explorerUrl: 'https://sepolia.basescan.org',
      totalCount: 150,
      withRegistrationFileCount: 75,
      activeCount: 50,
      status: 'ok' as const,
    },
    {
      chainId: 80002,
      name: 'Polygon Amoy',
      shortName: 'Polygon',
      explorerUrl: 'https://amoy.polygonscan.com',
      totalCount: 50,
      withRegistrationFileCount: 25,
      activeCount: 20,
      status: 'ok' as const,
    },
  ],
};

describe('GET /api/chains', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns chain information with counts', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockChainsResponse);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('calls backend with correct endpoint', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockChainsResponse);

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledTimes(1);
      expect(mockBackendFetch).toHaveBeenCalledWith('/api/v1/chains', {
        next: { revalidate: 300 },
      });
    });

    it('includes all chains from backend', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockChainsResponse);

      const response = await GET();
      const data = await response.json();

      expect(data.data).toHaveLength(3);

      const chainIds = data.data.map((c: { chainId: number }) => c.chainId);
      expect(chainIds).toContain(11155111);
      expect(chainIds).toContain(84532);
      expect(chainIds).toContain(80002);
    });

    it('includes chain metadata', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockChainsResponse);

      const response = await GET();
      const data = await response.json();

      const sepolia = data.data.find((c: { chainId: number }) => c.chainId === 11155111);
      expect(sepolia).toMatchObject({
        chainId: 11155111,
        name: 'Ethereum Sepolia',
        shortName: 'Sepolia',
        explorerUrl: 'https://sepolia.etherscan.io',
      });
    });

    it('includes agent counts per chain', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockChainsResponse);

      const response = await GET();
      const data = await response.json();

      const sepolia = data.data.find((c: { chainId: number }) => c.chainId === 11155111);
      const base = data.data.find((c: { chainId: number }) => c.chainId === 84532);
      const polygon = data.data.find((c: { chainId: number }) => c.chainId === 80002);

      expect(sepolia.totalCount).toBe(300);
      expect(sepolia.withMetadataCount).toBe(150);
      expect(sepolia.activeCount).toBe(100);

      expect(base.totalCount).toBe(150);
      expect(base.withMetadataCount).toBe(75);

      expect(polygon.totalCount).toBe(50);
      expect(polygon.withMetadataCount).toBe(25);
    });

    it('handles empty chains response', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: [],
      });

      const response = await GET();
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('returns 500 on backend error', async () => {
      mockBackendFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // handleRouteError uses the original error message for generic errors
      expect(data.error).toBe('Network error');
      expect(data.code).toBe('CHAINS_ERROR');
    });

    it('returns backend error status and message', async () => {
      const backendError = new BackendError('Service unavailable', 'SERVICE_UNAVAILABLE', 503);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Service unavailable');
      expect(data.code).toBe('SERVICE_UNAVAILABLE');
    });

    it('handles unauthorized error', async () => {
      const backendError = new BackendError('Invalid API key', 'UNAUTHORIZED', 401);
      mockBackendFetch.mockRejectedValueOnce(backendError);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.code).toBe('UNAUTHORIZED');
    });
  });
});
