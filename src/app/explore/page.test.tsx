import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { StreamingSearchResult } from '@/hooks';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import ExplorePage from './page';

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

// Mock EventSource for RealtimeEventsProvider
const mockEventSource = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  close: vi.fn(),
  readyState: 1,
};

vi.stubGlobal(
  'EventSource',
  vi.fn(() => mockEventSource),
);

// Mock streaming search hook
const mockStartStream = vi.fn();
const mockStopStream = vi.fn();
const mockClearResults = vi.fn();

const defaultStreamingState: StreamingSearchResult = {
  results: [],
  metadata: null,
  hydeQuery: null,
  streamState: 'idle',
  isStreaming: false,
  error: null,
  startStream: mockStartStream,
  stopStream: mockStopStream,
  clearResults: mockClearResults,
  resultCount: 0,
  expectedTotal: null,
};

let mockStreamingState = { ...defaultStreamingState };

vi.mock('@/hooks/use-streaming-search', () => ({
  useStreamingSearch: () => mockStreamingState,
}));

// Mock MobileFilterSheet to avoid duplicate filter elements in tests
vi.mock('@/components/organisms/mobile-filter-sheet', () => ({
  MobileFilterSheet: () => <div data-testid="mobile-filter-sheet-mock">Mobile Filters</div>,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/navigation
let mockSearchParams = new URLSearchParams();
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/explore',
}));

const mockAgents = [
  {
    id: '11155111:1',
    chainId: 11155111,
    tokenId: '1',
    name: 'Test Agent 1',
    description: 'A test agent',
    active: true,
    x402support: true,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: ['evm-attestation'],
    reputationScore: 85,
    reputationCount: 10,
  },
  {
    id: '84532:2',
    chainId: 84532,
    tokenId: '2',
    name: 'Test Agent 2',
    description: 'Another test agent',
    active: false,
    x402support: false,
    hasMcp: false,
    hasA2a: true,
    supportedTrust: [],
    reputationScore: 45,
    reputationCount: 5,
  },
];

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

function renderWithProviders(ui: ReactNode) {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RealtimeEventsProvider enabled={false}>{ui}</RealtimeEventsProvider>
    </QueryClientProvider>,
  );
}

describe('ExplorePage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockRouterPush.mockReset();
    mockStartStream.mockReset();
    mockStopStream.mockReset();
    mockClearResults.mockReset();
    mockSearchParams = new URLSearchParams();
    mockStreamingState = { ...defaultStreamingState };
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          success: true,
          data: mockAgents,
          meta: { total: 2, hasMore: false },
        }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial load', () => {
    it('renders explore template', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByTestId('explore-template')).toBeInTheDocument();
      });
    });

    it('shows loading state initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders(<ExplorePage />);

      expect(screen.getByTestId('explore-template')).toBeInTheDocument();
    });

    it('executes initial search on mount with default active filter', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        // Default behavior includes active=true filter
        expect(mockFetch).toHaveBeenCalledWith('/api/agents?active=true&limit=20');
      });
    });

    it('displays agents after loading', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText('Test Agent 1')).toBeInTheDocument();
        expect(screen.getByText('Test Agent 2')).toBeInTheDocument();
      });
    });
  });

  describe('search functionality', () => {
    it('updates query on input change', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: 'trading' } });

      expect(searchInput).toHaveValue('trading');
    });

    it('updates URL on Enter key', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: 'trading' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/explore?q=trading', { scroll: false });
      });
    });
  });

  describe('filter functionality', () => {
    it('updates URL when status filter changes', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Click on Active filter
      const activeFilter = screen.getByTestId('filter-option-active');
      fireEvent.click(activeFilter);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/explore?active=true', { scroll: false });
      });
    });

    it('updates URL when protocol filter changes', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Click on MCP filter (first capability tag in filters)
      const capabilityTags = screen.getAllByTestId('capability-tag');
      const mcpFilter = capabilityTags.find((tag) => tag.getAttribute('data-type') === 'mcp');
      fireEvent.click(mcpFilter!);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/explore?mcp=true', { scroll: false });
      });
    });

    it('updates URL when a2a protocol filter changes', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Click on A2A filter
      const capabilityTags = screen.getAllByTestId('capability-tag');
      const a2aFilter = capabilityTags.find((tag) => tag.getAttribute('data-type') === 'a2a');
      fireEvent.click(a2aFilter!);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/explore?a2a=true', { scroll: false });
      });
    });

    it('updates URL when x402 protocol filter changes', async () => {
      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Click on x402 filter
      const capabilityTags = screen.getAllByTestId('capability-tag');
      const x402Filter = capabilityTags.find((tag) => tag.getAttribute('data-type') === 'x402');
      fireEvent.click(x402Filter!);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/explore?x402=true', { scroll: false });
      });
    });
  });

  describe('error handling', () => {
    it('displays error message when search fails', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Network error' }),
      });

      renderWithProviders(<ExplorePage />);

      // With retry logic (3 retries with exponential backoff), errors take longer to surface
      await waitFor(
        () => {
          expect(screen.getByText('Network error')).toBeInTheDocument();
        },
        { timeout: 15000 },
      );
    }, 20000);
  });

  describe('empty results', () => {
    it('handles empty results', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [],
            meta: { total: 0, hasMore: false },
          }),
      });

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByText(/no agents found/i)).toBeInTheDocument();
      });
    });
  });

  describe('URL query parameter with streaming', () => {
    it('displays streaming results when query is in URL', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      // Set up streaming state with results already loaded
      mockStreamingState = {
        ...defaultStreamingState,
        results: mockAgents,
        streamState: 'complete',
        resultCount: 2,
        expectedTotal: 2,
      };

      renderWithProviders(<ExplorePage />);

      // Check that agents from streaming results are displayed
      await waitFor(() => {
        expect(screen.getByText('Test Agent 1')).toBeInTheDocument();
        expect(screen.getByText('Test Agent 2')).toBeInTheDocument();
      });
    });

    it('populates search input with URL query', async () => {
      mockSearchParams = new URLSearchParams('q=my+agent');

      // Set up streaming state
      mockStreamingState = {
        ...defaultStreamingState,
        streamState: 'complete',
        results: [],
      };

      renderWithProviders(<ExplorePage />);

      const searchInput = screen.getByTestId('search-input-field');
      expect(searchInput).toHaveValue('my agent');
    });

    it('searches without query when URL has no q parameter (defaults to active=true)', async () => {
      mockSearchParams = new URLSearchParams();

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        // Default behavior now includes active=true filter
        expect(mockFetch).toHaveBeenCalledWith('/api/agents?active=true&limit=20');
      });
    });

    it('ignores page parameter from URL (cursor-based pagination)', async () => {
      // Page parameter is deprecated - cursor-based pagination is managed in React state
      // Page from URL is ignored, always starts at page 1
      mockSearchParams = new URLSearchParams('page=2');

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        // Page parameter is ignored - no cursor on first load
        expect(mockFetch).toHaveBeenCalledWith('/api/agents?active=true&limit=20');
      });
    });

    it('initializes with filters from URL', async () => {
      mockSearchParams = new URLSearchParams('active=true&mcp=true');

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        // Params are serialized in a specific order by toSearchParams
        expect(mockFetch).toHaveBeenCalledWith('/api/agents?mcp=true&active=true&limit=20');
      });
    });
  });

  describe('streaming search behavior', () => {
    it('shows streaming indicator when streaming', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      mockStreamingState = {
        ...defaultStreamingState,
        results: [mockAgents[0]],
        streamState: 'streaming',
        isStreaming: true,
        resultCount: 1,
        expectedTotal: 2,
      };

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).toBeInTheDocument();
      });
    });

    it('displays streaming progress', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      mockStreamingState = {
        ...defaultStreamingState,
        results: [mockAgents[0]],
        streamState: 'streaming',
        isStreaming: true,
        resultCount: 1,
        expectedTotal: 2,
      };

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByTestId('streaming-progress')).toBeInTheDocument();
        expect(screen.getByText('1/2')).toBeInTheDocument();
      });
    });

    it('allows stopping the stream', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      mockStreamingState = {
        ...defaultStreamingState,
        results: [mockAgents[0]],
        streamState: 'streaming',
        isStreaming: true,
        resultCount: 1,
        expectedTotal: 2,
      };

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        const stopButton = screen.getByTestId('streaming-stop-button');
        fireEvent.click(stopButton);
        expect(mockStopStream).toHaveBeenCalled();
      });
    });

    it('shows HyDE query when available', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      mockStreamingState = {
        ...defaultStreamingState,
        results: mockAgents,
        streamState: 'complete',
        hydeQuery: 'Find trading bots and financial analysis agents',
        resultCount: 2,
        expectedTotal: 2,
      };

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByTestId('hyde-query-display')).toBeInTheDocument();
      });
    });

    it('clears results when query is cleared', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      mockStreamingState = {
        ...defaultStreamingState,
        results: mockAgents,
        streamState: 'complete',
        resultCount: 2,
      };

      renderWithProviders(<ExplorePage />);

      const searchInput = screen.getByTestId('search-input-field');
      fireEvent.change(searchInput, { target: { value: '' } });
      fireEvent.keyDown(searchInput, { key: 'Enter' });

      await waitFor(() => {
        expect(mockClearResults).toHaveBeenCalled();
      });
    });

    it('falls back to regular search when no text query', async () => {
      mockSearchParams = new URLSearchParams('mcp=true');

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        // Should use regular GET /api/agents instead of streaming
        expect(mockFetch).toHaveBeenCalledWith('/api/agents?mcp=true&active=true&limit=20');
      });
    });

    it('does not show compose team button when streaming', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      mockStreamingState = {
        ...defaultStreamingState,
        results: mockAgents,
        streamState: 'streaming',
        isStreaming: true,
        resultCount: 2,
      };

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(screen.getByTestId('streaming-indicator')).toBeInTheDocument();
      });

      // Compose button should not be visible during streaming
      expect(screen.queryByTestId('compose-team-button')).not.toBeInTheDocument();
    });
  });
});
