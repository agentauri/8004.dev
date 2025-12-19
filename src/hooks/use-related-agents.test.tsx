import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRelatedAgents } from './use-related-agents';

const mockFetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockAgent = {
  id: '11155111:1',
  chainId: 11155111,
  tokenId: '1',
  name: 'Test Agent',
  description: 'A test agent',
  endpoints: {
    mcp: { url: 'https://example.com/mcp', version: '1.0' },
  },
  oasf: { skills: [], domains: [] },
  supportedTrust: [],
  active: true,
  x402support: true,
  registration: {
    chainId: 11155111,
    tokenId: '1',
    contractAddress: '0x123',
    metadataUri: 'ipfs://test',
    owner: '0x456',
    registeredAt: '2024-01-01',
  },
};

const mockRelatedAgents = [
  {
    id: '11155111:2',
    chainId: 11155111,
    tokenId: '2',
    name: 'Related Agent 1',
    description: 'Similar agent',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: [],
    reputationScore: 85,
    reputationCount: 10,
  },
  {
    id: '84532:1',
    chainId: 84532,
    tokenId: '1',
    name: 'Related Agent 2',
    description: 'Cross-chain similar agent',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: [],
    reputationScore: 75,
    reputationCount: 5,
  },
];

describe('useRelatedAgents', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            { ...mockRelatedAgents[0], id: '11155111:1' }, // Include current agent to test filtering
            mockRelatedAgents[0],
            mockRelatedAgents[1],
          ],
        }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty array when agent is undefined', async () => {
    const { result } = renderHook(() => useRelatedAgents(undefined), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fetches related agents with limit parameter', async () => {
    const { result } = renderHook(() => useRelatedAgents(mockAgent), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Default limit is 4, so limit+1=5 is sent to account for potential current agent
    expect(mockFetch).toHaveBeenCalledWith('/api/agents?mcp=true&x402=true&active=true&limit=5');
  });

  it('filters out current agent from results', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            { ...mockRelatedAgents[0], id: '11155111:1' }, // Same ID as current agent
            mockRelatedAgents[0],
          ],
        }),
    });

    const { result } = renderHook(() => useRelatedAgents(mockAgent), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should only have one agent (the different one)
    expect(result.current.data?.length).toBe(1);
  });

  it('respects limit option', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            mockRelatedAgents[0],
            mockRelatedAgents[1],
            { ...mockRelatedAgents[0], id: '11155111:3' },
            { ...mockRelatedAgents[0], id: '11155111:4' },
            { ...mockRelatedAgents[0], id: '11155111:5' },
          ],
        }),
    });

    const { result } = renderHook(() => useRelatedAgents(mockAgent, { limit: 2 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.length).toBe(2);
  });

  it('filters by chain when crossChain is false', async () => {
    // When crossChain is false, chainIds is sent to API
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          // Backend returns only same-chain results
          data: [mockRelatedAgents[0]],
        }),
    });

    const { result } = renderHook(() => useRelatedAgents(mockAgent, { crossChain: false }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should include chainIds in the request
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/agents?mcp=true&x402=true&active=true&limit=5&chainIds=11155111',
    );
    // Should only have same-chain agents
    expect(result.current.data?.length).toBe(1);
    expect(result.current.data?.[0].chainId).toBe(mockAgent.chainId);
  });

  it('includes a2a in search when agent has a2a endpoint', async () => {
    const agentWithA2a = {
      ...mockAgent,
      endpoints: {
        ...mockAgent.endpoints,
        a2a: { url: 'https://example.com/a2a', version: '1.0' },
      },
    };

    const { result } = renderHook(() => useRelatedAgents(agentWithA2a), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should include a2a and limit parameters
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/agents?mcp=true&a2a=true&x402=true&active=true&limit=5',
    );
  });

  it('handles search error', async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: false,
          error: 'Search failed',
        }),
    });

    const { result } = renderHook(() => useRelatedAgents(mockAgent), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Search failed');
  });

  it('handles fetch rejection', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRelatedAgents(mockAgent), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Network error');
  });
});
