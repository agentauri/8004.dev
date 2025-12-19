import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from './page';

// Mock fetch
const mockFetch = vi.fn();

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

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

const mockStatsResponse = {
  success: true,
  data: {
    totalAgents: 500,
    withMetadata: 250,
    activeAgents: 170,
    chainBreakdown: [
      { chainId: 11155111, name: 'Sepolia', total: 300, withMetadata: 150, active: 100 },
      { chainId: 84532, name: 'Base', total: 150, withMetadata: 75, active: 50 },
      { chainId: 80002, name: 'Polygon', total: 50, withMetadata: 25, active: 20 },
    ],
  },
};

describe('HomePage', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockFetch.mockReset();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockStatsResponse),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the page title', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('AGENT EXPLORER')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText(/Discover and explore autonomous AI agents/)).toBeInTheDocument();
    });

    it('renders the search input', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('renders the status badge', async () => {
      renderWithProviders(<HomePage />);
      await waitFor(() => {
        expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument();
      });
    });

    it('renders the ADVANCED SEARCH button', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('ADVANCED SEARCH')).toBeInTheDocument();
    });

    it('renders the LEARN MORE button', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('LEARN MORE')).toBeInTheDocument();
    });

    it('renders stats grid with chain data', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-grid')).toBeInTheDocument();
      });

      // Check for chain names in stats (title case as returned from API)
      await waitFor(() => {
        expect(screen.getByText('Sepolia')).toBeInTheDocument();
        expect(screen.getByText('Base')).toBeInTheDocument();
        expect(screen.getByText('Polygon')).toBeInTheDocument();
      });
    });

    it('renders the footer with ERC-8004 link', () => {
      renderWithProviders(<HomePage />);
      const link = screen.getByRole('link', { name: 'ERC-8004' });
      expect(link).toHaveAttribute('href', 'https://eips.ethereum.org/EIPS/eip-8004');
    });
  });

  describe('search functionality', () => {
    it('has search input with correct placeholder', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByPlaceholderText('Search agents by name...')).toBeInTheDocument();
    });

    it('navigates to /explore with query on search submit', () => {
      renderWithProviders(<HomePage />);
      const input = screen.getByTestId('search-input-field');

      fireEvent.change(input, { target: { value: 'trading bot' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockPush).toHaveBeenCalledWith('/explore?q=trading%20bot');
    });

    it('does not navigate when search query is empty', () => {
      renderWithProviders(<HomePage />);
      const input = screen.getByTestId('search-input-field');

      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not navigate when search query is only whitespace', () => {
      renderWithProviders(<HomePage />);
      const input = screen.getByTestId('search-input-field');

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('trims whitespace from search query', () => {
      renderWithProviders(<HomePage />);
      const input = screen.getByTestId('search-input-field');

      fireEvent.change(input, { target: { value: '  agent  ' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockPush).toHaveBeenCalledWith('/explore?q=agent');
    });

    it('encodes special characters in search query', () => {
      renderWithProviders(<HomePage />);
      const input = screen.getByTestId('search-input-field');

      fireEvent.change(input, { target: { value: 'agent&bot' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockPush).toHaveBeenCalledWith('/explore?q=agent%26bot');
    });
  });

  describe('navigation links', () => {
    it('ADVANCED SEARCH button links to /explore', () => {
      renderWithProviders(<HomePage />);
      const link = screen.getByText('ADVANCED SEARCH');
      expect(link).toHaveAttribute('href', '/explore');
    });
  });

  describe('accessibility', () => {
    it('has accessible search input', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('search-input-field')).toBeInTheDocument();
    });

    it('footer link opens in new tab', () => {
      renderWithProviders(<HomePage />);
      const link = screen.getByRole('link', { name: 'ERC-8004' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('stats', () => {
    it('fetches stats on mount', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/stats');
      });
    });

    it('displays total agents count', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('500')).toBeInTheDocument(); // Total agents
      });
    });

    it('shows loading state initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders(<HomePage />);

      expect(screen.getByTestId('stats-grid')).toBeInTheDocument();
    });

    it('handles error state', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, error: 'Failed to fetch' }),
      });

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
      });
    });
  });
});
