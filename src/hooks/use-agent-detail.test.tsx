import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAgentDetail } from './use-agent-detail';

const mockAgentDetail = {
  agent: {
    id: '11155111:123',
    chainId: 11155111,
    tokenId: '123',
    name: 'Test Agent',
    description: 'A test agent for testing',
    active: true,
    x402support: true,
    endpoints: {
      mcp: { url: 'https://mcp.example.com', version: '1.0' },
      a2a: { url: 'https://a2a.example.com', version: '1.0' },
    },
    oasf: { skills: ['code_generation'], domains: ['development'] },
    supportedTrust: ['github'],
    registration: {
      chainId: 11155111,
      tokenId: '123',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataUri: 'ipfs://QmXYZ',
      owner: '0xabcdef1234567890abcdef1234567890abcdef12',
      registeredAt: '2024-01-15T10:30:00Z',
    },
  },
  reputation: {
    count: 100,
    averageScore: 85,
    distribution: { low: 5, medium: 25, high: 70 },
  },
  recentFeedback: [
    {
      id: 'feedback-1',
      score: 90,
      tags: ['reliable', 'fast'],
      submitter: '0x1234',
      timestamp: '2024-01-20T10:00:00Z',
    },
  ],
};

const mockFetch = vi.fn();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAgentDetail', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches agent detail by ID', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockAgentDetail);
      expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123');
    });

    it('returns agent data', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.agent.name).toBe('Test Agent');
      expect(result.current.data?.agent.chainId).toBe(11155111);
    });

    it('returns reputation data', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.reputation.averageScore).toBe(85);
      expect(result.current.data?.reputation.count).toBe(100);
    });

    it('returns recent feedback', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.recentFeedback).toHaveLength(1);
      expect(result.current.data?.recentFeedback[0].score).toBe(90);
    });
  });

  describe('not found handling', () => {
    it('handles null response for non-existent agent', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, code: 'AGENT_NOT_FOUND' }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });
  });

  describe('error handling', () => {
    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Network error' }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Fetch failed');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when disabled', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not fetch when agentId is empty', () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled with valid ID', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123', true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('starts in loading state', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    it('transitions to success state', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockAgentDetail }),
      });

      const { result } = renderHook(() => useAgentDetail('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('different agent IDs', () => {
    it('fetches with different chain ID format', async () => {
      const baseSepolia = {
        ...mockAgentDetail,
        agent: { ...mockAgentDetail.agent, id: '84532:456', chainId: 84532 },
      };
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: baseSepolia }),
      });

      const { result } = renderHook(() => useAgentDetail('84532:456'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/agents/84532:456');
      expect(result.current.data?.agent.chainId).toBe(84532);
    });
  });
});
