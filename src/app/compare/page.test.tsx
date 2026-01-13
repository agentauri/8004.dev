import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import ComparePage from './page';

// Mock next/navigation
const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock the useWallet hook
vi.mock('@/hooks/use-wallet', () => ({
  useWallet: () => ({
    status: 'disconnected',
    address: null,
    chainId: null,
    isCorrectNetwork: false,
    usdcBalance: null,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    switchToBase: vi.fn(),
    isReadyForPayment: false,
    connectors: [],
  }),
  truncateAddress: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create mock AgentDetailResponse
function createMockAgentResponse(id: string, name: string, chainId: number) {
  return {
    success: true,
    data: {
      agent: {
        id,
        name,
        description: `${name} description`,
        chainId,
        tokenId: id.split(':')[1],
        active: true,
        x402support: false,
        endpoints: {},
        supportedTrust: [],
        registration: {
          chainId,
          tokenId: id.split(':')[1],
          contractAddress: '0x123',
          metadataUri: 'https://example.com',
          owner: '0x456',
          registeredAt: '2024-01-01',
        },
      },
      reputation: {
        count: 10,
        averageScore: 75,
        distribution: { low: 1, medium: 5, high: 4 },
      },
      recentFeedback: [],
      validations: [],
    },
  };
}

// Mock CompareTemplate and MainLayout to simplify tests
vi.mock('@/components/templates', () => ({
  CompareTemplate: ({
    agents,
    isLoading,
    onRemoveAgent,
  }: {
    agents: unknown[];
    isLoading: boolean;
    onRemoveAgent?: (id: string) => void;
  }) => (
    <div data-testid="compare-template">
      <span data-testid="agent-count">{agents.length}</span>
      <span data-testid="loading-state">{isLoading ? 'loading' : 'loaded'}</span>
      {onRemoveAgent && (
        <button
          type="button"
          data-testid="remove-btn"
          onClick={() => onRemoveAgent('11155111:123')}
        >
          Remove
        </button>
      )}
    </div>
  ),
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

describe('ComparePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockFetch.mockReset();
  });

  describe('rendering', () => {
    it('renders compare page', async () => {
      render(<ComparePage />);

      await waitFor(() => {
        expect(screen.getByTestId('compare-template')).toBeInTheDocument();
      });
    });

    it('shows loading state initially when agents are in URL', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<ComparePage />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
    });
  });

  describe('no agents', () => {
    it('renders with empty agents when no URL params', async () => {
      render(<ComparePage />);

      await waitFor(() => {
        expect(screen.getByTestId('agent-count')).toHaveTextContent('0');
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
      });
    });
  });

  describe('fetching agents', () => {
    it('fetches agents from API based on URL params', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('11155111:123')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve(createMockAgentResponse('11155111:123', 'Agent 1', 11155111)),
          });
        }
        if (url.includes('84532:456')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(createMockAgentResponse('84532:456', 'Agent 2', 84532)),
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<ComparePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123');
        expect(mockFetch).toHaveBeenCalledWith('/api/agents/84532:456');
      });

      await waitFor(() => {
        expect(screen.getByTestId('agent-count')).toHaveTextContent('2');
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
      });
    });

    it('handles fetch errors gracefully', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      mockFetch.mockRejectedValue(new Error('Network error'));

      render(<ComparePage />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
      });
    });

    it('filters out failed agent fetches', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('11155111:123')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve(createMockAgentResponse('11155111:123', 'Agent 1', 11155111)),
          });
        }
        // Second agent fails
        return Promise.resolve({
          ok: false,
        });
      });

      render(<ComparePage />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
      });
    });
  });

  describe('remove functionality', () => {
    it('updates URL when agent is removed', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,84532:456');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockAgentResponse('11155111:123', 'Agent 1', 11155111)),
      });

      render(<ComparePage />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
      });

      // Click remove button
      screen.getByTestId('remove-btn').click();

      expect(mockPush).toHaveBeenCalledWith('/compare?agents=84532%3A456');
    });

    it('navigates to /compare when last agent is removed', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockAgentResponse('11155111:123', 'Agent 1', 11155111)),
      });

      render(<ComparePage />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('loaded');
      });

      // Click remove button
      screen.getByTestId('remove-btn').click();

      expect(mockPush).toHaveBeenCalledWith('/compare');
    });
  });

  describe('URL parsing', () => {
    it('limits agents to MAX_COMPARE_AGENTS', async () => {
      // 6 agents in URL, should only fetch 4
      mockSearchParams = new URLSearchParams('agents=1:1,2:2,3:3,4:4,5:5,6:6');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockAgentResponse('1:1', 'Agent', 11155111)),
      });

      render(<ComparePage />);

      await waitFor(() => {
        // Should only fetch 4 agents (MAX_COMPARE_AGENTS)
        expect(mockFetch).toHaveBeenCalledTimes(4);
      });
    });

    it('trims whitespace from agent IDs', async () => {
      mockSearchParams = new URLSearchParams('agents= 11155111:123 , 84532:456 ');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockAgentResponse('11155111:123', 'Agent', 11155111)),
      });

      render(<ComparePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123');
        expect(mockFetch).toHaveBeenCalledWith('/api/agents/84532:456');
      });
    });

    it('filters empty agent IDs', async () => {
      mockSearchParams = new URLSearchParams('agents=11155111:123,,84532:456,');

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createMockAgentResponse('11155111:123', 'Agent', 11155111)),
      });

      render(<ComparePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });
});
