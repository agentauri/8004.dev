import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AgentPage from './page';

// Mock fetch
const mockFetch = vi.fn();

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockAgent = {
  id: '11155111:123',
  chainId: 11155111,
  tokenId: '123',
  name: 'Test Agent',
  description: 'A test agent',
  active: true,
  x402support: true,
  endpoints: {
    mcp: { url: 'https://mcp.example.com', version: '1.0' },
  },
  oasf: { skills: [], domains: [] },
  supportedTrust: [],
  registration: {
    chainId: 11155111,
    tokenId: '123',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    metadataUri: 'ipfs://QmXYZ',
    owner: '0xabcdef1234567890abcdef1234567890abcdef12',
    registeredAt: '2024-01-15T10:30:00Z',
  },
};

const mockReputation = {
  count: 100,
  averageScore: 85,
  distribution: { low: 5, medium: 25, high: 70 },
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

async function renderAgentPage(agentId: string) {
  const paramsPromise = Promise.resolve({ agentId });
  const queryClient = createQueryClient();

  await act(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading suspense...</div>}>
          <AgentPage params={paramsPromise} />
        </Suspense>
      </QueryClientProvider>,
    );
    // Allow the promise to resolve
    await paramsPromise;
  });
}

describe('AgentPage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loading state', () => {
    it('shows loading state initially', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));
      await renderAgentPage('11155111:123');

      expect(screen.getByText('Loading agent...')).toBeInTheDocument();
    });
  });

  describe('success state', () => {
    it('displays agent details after loading', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agent: mockAgent,
              reputation: mockReputation,
              recentFeedback: [],
            },
          }),
      });

      await renderAgentPage('11155111:123');

      await waitFor(() => {
        expect(screen.getByText('Test Agent')).toBeInTheDocument();
      });
    });

    it('fetches agent with correct ID', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agent: mockAgent,
              reputation: mockReputation,
              recentFeedback: [],
            },
          }),
      });

      await renderAgentPage('11155111:123');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123');
      });
    });

    it('displays agent description', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agent: mockAgent,
              reputation: mockReputation,
              recentFeedback: [],
            },
          }),
      });

      await renderAgentPage('11155111:123');

      await waitFor(() => {
        expect(screen.getByText('A test agent')).toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    it('displays error message when fetch fails', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Network error' }),
      });

      await renderAgentPage('11155111:123');

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('not found state', () => {
    it('displays not found when agent is null', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, code: 'AGENT_NOT_FOUND' }),
      });

      await renderAgentPage('11155111:999');

      await waitFor(() => {
        expect(screen.getByText('Agent not found')).toBeInTheDocument();
      });
    });
  });

  describe('different agent IDs', () => {
    it('fetches agent with different ID format', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agent: { ...mockAgent, id: '84532:456', chainId: 84532 },
              reputation: mockReputation,
              recentFeedback: [],
            },
          }),
      });

      await renderAgentPage('84532:456');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/agents/84532:456');
      });
    });
  });
});
