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

// Mock next/link - preserve all props including data-testid
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
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

const mockIntentsResponse = {
  success: true,
  data: [
    {
      id: 'code-review',
      name: 'Code Review Workflow',
      description: 'Automated code review pipeline',
      category: 'development',
      steps: [
        {
          order: 1,
          name: 'Analyze',
          description: 'Analyze code',
          requiredRole: 'analyzer',
          inputs: [],
          outputs: [],
        },
      ],
      requiredRoles: ['analyzer', 'reviewer'],
    },
    {
      id: 'data-pipeline',
      name: 'Data Pipeline',
      description: 'ETL processing workflow',
      category: 'automation',
      steps: [
        {
          order: 1,
          name: 'Extract',
          description: 'Extract data',
          requiredRole: 'extractor',
          inputs: [],
          outputs: [],
        },
      ],
      requiredRoles: ['extractor', 'loader'],
    },
  ],
};

const mockEvaluationsResponse = {
  success: true,
  data: [
    {
      id: 'eval-1',
      agentId: '11155111:123',
      status: 'completed',
      scores: { safety: 95, capability: 80, reliability: 85, performance: 70 },
      benchmarks: [],
      createdAt: new Date('2024-01-01'),
      completedAt: new Date('2024-01-01'),
    },
    {
      id: 'eval-2',
      agentId: '11155111:456',
      status: 'completed',
      scores: { safety: 88, capability: 92, reliability: 78, performance: 85 },
      benchmarks: [],
      createdAt: new Date('2024-01-02'),
      completedAt: new Date('2024-01-02'),
    },
  ],
};

describe('HomePage', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockFetch.mockReset();
    global.fetch = mockFetch;
    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/stats') {
        return Promise.resolve({
          json: () => Promise.resolve(mockStatsResponse),
        });
      }
      if (url.includes('/api/intents')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockIntentsResponse),
        });
      }
      if (url.includes('/api/evaluations')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockEvaluationsResponse),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({ success: false, error: 'Not found' }),
      });
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

  describe('feature highlights section', () => {
    it('renders the features section', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('features-section')).toBeInTheDocument();
    });

    it('renders the Streaming Search feature card', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Streaming Search')).toBeInTheDocument();
      expect(screen.getByText("Real-time results as they're found")).toBeInTheDocument();
    });

    it('renders the Compose Teams feature card', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Compose Teams')).toBeInTheDocument();
      expect(screen.getByText('Build optimal agent teams for tasks')).toBeInTheDocument();
    });

    it('renders the Evaluations feature card', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Evaluations')).toBeInTheDocument();
      expect(screen.getByText('Benchmark agent performance')).toBeInTheDocument();
    });

    it('feature cards link to correct pages', () => {
      renderWithProviders(<HomePage />);
      const featureCards = screen.getAllByTestId('feature-card');
      expect(featureCards[0]).toHaveAttribute('href', '/explore');
      expect(featureCards[1]).toHaveAttribute('href', '/compose');
      expect(featureCards[2]).toHaveAttribute('href', '/evaluate');
    });
  });

  describe('compose CTA section', () => {
    it('renders the compose CTA section', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('compose-cta-section')).toBeInTheDocument();
    });

    it('renders the BUILD YOUR DREAM TEAM heading', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Build Your Dream Team')).toBeInTheDocument();
    });

    it('renders the compose CTA description', () => {
      renderWithProviders(<HomePage />);
      expect(
        screen.getByText(/Describe your task and let AI find the perfect combination/),
      ).toBeInTheDocument();
    });

    it('renders the Start Composing button', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('compose-cta-button')).toBeInTheDocument();
      expect(screen.getByText('Start Composing')).toBeInTheDocument();
    });

    it('compose button links to /compose', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('compose-cta-button')).toHaveAttribute('href', '/compose');
    });
  });

  describe('intents section', () => {
    it('renders the intents section', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('intents-section')).toBeInTheDocument();
    });

    it('renders the Workflow Templates heading', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Workflow Templates')).toBeInTheDocument();
    });

    it('renders the Browse all link', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('intents-browse-link')).toHaveAttribute('href', '/intents');
    });

    it('displays intent cards when data loads', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Code Review Workflow')).toBeInTheDocument();
        expect(screen.getByText('Data Pipeline')).toBeInTheDocument();
      });
    });

    it('shows loading skeletons initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders(<HomePage />);

      expect(screen.getAllByTestId('intent-skeleton')).toHaveLength(4);
    });

    it('shows empty state when no intents available', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/intents')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: true, data: [] }),
          });
        }
        if (url === '/api/stats') {
          return Promise.resolve({
            json: () => Promise.resolve(mockStatsResponse),
          });
        }
        if (url.includes('/api/evaluations')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockEvaluationsResponse),
          });
        }
        return Promise.resolve({ json: () => Promise.resolve({ success: false }) });
      });

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByTestId('intents-empty')).toBeInTheDocument();
      });
    });

    it('navigates to intent detail on card click', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('Code Review Workflow')).toBeInTheDocument();
      });

      const intentCard = screen.getAllByTestId('intent-card')[0];
      fireEvent.click(intentCard);

      expect(mockPush).toHaveBeenCalledWith('/intents/code-review');
    });
  });

  describe('evaluations section', () => {
    it('renders the evaluations section', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('evaluations-section')).toBeInTheDocument();
    });

    it('renders the Recent Evaluations heading', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Recent Evaluations')).toBeInTheDocument();
    });

    it('renders the View all link', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('evaluations-browse-link')).toHaveAttribute('href', '/evaluate');
    });

    it('displays evaluation cards when data loads', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getAllByTestId('evaluation-card')).toHaveLength(2);
      });
    });

    it('shows loading skeletons initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderWithProviders(<HomePage />);

      expect(screen.getAllByTestId('evaluation-skeleton')).toHaveLength(3);
    });

    it('shows empty state when no evaluations available', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('/api/evaluations')) {
          return Promise.resolve({
            json: () => Promise.resolve({ success: true, data: [] }),
          });
        }
        if (url === '/api/stats') {
          return Promise.resolve({
            json: () => Promise.resolve(mockStatsResponse),
          });
        }
        if (url.includes('/api/intents')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockIntentsResponse),
          });
        }
        return Promise.resolve({ json: () => Promise.resolve({ success: false }) });
      });

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByTestId('evaluations-empty')).toBeInTheDocument();
      });
    });

    it('navigates to evaluation detail on card click', async () => {
      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getAllByTestId('evaluation-card')).toHaveLength(2);
      });

      const evalCard = screen.getAllByTestId('evaluation-card')[0];
      fireEvent.click(evalCard);

      expect(mockPush).toHaveBeenCalledWith('/evaluate/eval-1');
    });
  });

  describe('stats section', () => {
    it('renders the stats section', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    });

    it('renders the Platform Statistics label', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Platform Statistics')).toBeInTheDocument();
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
      mockFetch.mockImplementation((url: string) => {
        if (url === '/api/stats') {
          return Promise.resolve({
            json: () => Promise.resolve({ success: false, error: 'Failed to fetch' }),
          });
        }
        if (url.includes('/api/intents')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockIntentsResponse),
          });
        }
        if (url.includes('/api/evaluations')) {
          return Promise.resolve({
            json: () => Promise.resolve(mockEvaluationsResponse),
          });
        }
        return Promise.resolve({ json: () => Promise.resolve({ success: false }) });
      });

      renderWithProviders(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
      });
    });
  });
});
