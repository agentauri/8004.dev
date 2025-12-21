import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ExplorePage from './page';

// Mock fetch
const mockFetch = vi.fn();

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
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ExplorePage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockRouterPush.mockReset();
    mockSearchParams = new URLSearchParams();
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
    it(
      'displays error message when search fails',
      async () => {
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
      },
      20000,
    );
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

  describe('URL query parameter', () => {
    it('initializes with query from URL using POST /api/search with default active filter', async () => {
      mockSearchParams = new URLSearchParams('q=trading');

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        // When query is present, uses POST /api/search (semantic search)
        // Default behavior includes active: true filter
        expect(mockFetch).toHaveBeenCalledWith('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: 'trading', limit: 20, filters: { active: true } }),
        });
      });
    });

    it('populates search input with URL query', async () => {
      mockSearchParams = new URLSearchParams('q=my+agent');

      renderWithProviders(<ExplorePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

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
});
