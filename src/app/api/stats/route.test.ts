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
const mockStatsResponse = {
  success: true as const,
  data: {
    totalAgents: 500,
    withRegistrationFile: 250,
    activeAgents: 170,
    chainBreakdown: [
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
  },
};

describe('GET /api/stats', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('returns platform statistics', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockStatsResponse);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('returns correct total agents count', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockStatsResponse);

      const response = await GET();
      const data = await response.json();

      expect(data.data.totalAgents).toBe(500);
    });

    it('returns correct withMetadata count', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockStatsResponse);

      const response = await GET();
      const data = await response.json();

      expect(data.data.withMetadata).toBe(250);
    });

    it('returns correct active agents count', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockStatsResponse);

      const response = await GET();
      const data = await response.json();

      expect(data.data.activeAgents).toBe(170);
    });

    it('calls backend with correct endpoint', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockStatsResponse);

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledTimes(1);
      expect(mockBackendFetch).toHaveBeenCalledWith('/api/v1/stats', {
        next: { revalidate: 300 },
      });
    });

    it('includes chain breakdown with mapped fields', async () => {
      mockBackendFetch.mockResolvedValueOnce(mockStatsResponse);

      const response = await GET();
      const data = await response.json();

      expect(data.data.chainBreakdown).toHaveLength(3);
      expect(data.data.chainBreakdown).toEqual([
        { chainId: 11155111, name: 'Sepolia', total: 300, withMetadata: 150, active: 100 },
        { chainId: 84532, name: 'Base', total: 150, withMetadata: 75, active: 50 },
        { chainId: 80002, name: 'Polygon', total: 50, withMetadata: 25, active: 20 },
      ]);
    });
  });

  describe('edge cases', () => {
    it('handles zero counts', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: {
          totalAgents: 0,
          withRegistrationFile: 0,
          activeAgents: 0,
          chainBreakdown: [],
        },
      });

      const response = await GET();
      const data = await response.json();

      expect(data.data.totalAgents).toBe(0);
      expect(data.data.withMetadata).toBe(0);
      expect(data.data.activeAgents).toBe(0);
      expect(data.data.chainBreakdown).toEqual([]);
    });

    it('handles partial chain data', async () => {
      mockBackendFetch.mockResolvedValueOnce({
        success: true,
        data: {
          totalAgents: 100,
          withRegistrationFile: 50,
          activeAgents: 30,
          chainBreakdown: [
            {
              chainId: 11155111,
              name: 'Ethereum Sepolia',
              shortName: 'Sepolia',
              explorerUrl: 'https://sepolia.etherscan.io',
              totalCount: 100,
              withRegistrationFileCount: 50,
              activeCount: 30,
              status: 'ok' as const,
            },
          ],
        },
      });

      const response = await GET();
      const data = await response.json();

      expect(data.data.totalAgents).toBe(100);
      expect(data.data.withMetadata).toBe(50);
      expect(data.data.chainBreakdown).toHaveLength(1);
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
      expect(data.code).toBe('STATS_ERROR');
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
