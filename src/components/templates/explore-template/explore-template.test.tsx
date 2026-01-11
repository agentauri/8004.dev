import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchFiltersState } from '@/components/organisms';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import { ExploreTemplate } from './explore-template';

// Mock MobileFilterSheet to avoid duplicate filter elements in tests
vi.mock('@/components/organisms/mobile-filter-sheet', () => ({
  MobileFilterSheet: () => <div data-testid="mobile-filter-sheet-mock">Mobile Filters</div>,
}));

// Mock Header to avoid complex dependencies in template tests
vi.mock('@/components/organisms', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/organisms')>();
  return {
    ...actual,
    Header: () => <header data-testid="header-mock">Header</header>,
  };
});

// Mock next/link
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

const mockAgents: AgentCardAgent[] = [
  {
    id: '11155111:1',
    name: 'Test Agent',
    chainId: 11155111,
    isActive: true,
  },
];

const defaultFilters: SearchFiltersState = {
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND',
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
  // Gap 1: Trust Score & Version Filters
  minTrustScore: 0,
  maxTrustScore: 100,
  erc8004Version: '',
  mcpVersion: '',
  a2aVersion: '',
  // Gap 3: Curation Filters
  isCurated: false,
  curatedBy: '',
  // Gap 5: Endpoint Filters
  hasEmail: false,
  hasOasfEndpoint: false,
  // Gap 6: Reachability Filters
  hasRecentReachability: false,
};

const defaultProps = {
  query: '',
  onQueryChange: vi.fn(),
  onSearch: vi.fn(),
  filters: defaultFilters,
  onFiltersChange: vi.fn(),
  agents: [] as AgentCardAgent[],
};

describe('ExploreTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('layout rendering', () => {
    it('renders explore template container', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByTestId('explore-template')).toBeInTheDocument();
    });

    it('renders header', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    });

    it('renders sidebar with filters', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByTestId('explore-sidebar')).toBeInTheDocument();
      const sidebar = screen.getByTestId('explore-sidebar');
      expect(sidebar.querySelector('[data-testid="search-filters"]')).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByTestId('explore-main')).toBeInTheDocument();
    });

    it('renders page title', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByText('EXPLORE AGENTS')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ExploreTemplate {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('explore-template')).toHaveClass('custom-class');
    });
  });

  describe('dynamically loaded components', () => {
    it('renders search bar', async () => {
      render(<ExploreTemplate {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      });
    });

    it('renders search results', async () => {
      render(<ExploreTemplate {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('search-results')).toBeInTheDocument();
      });
    });
  });

  describe('search functionality', () => {
    it('displays current query', async () => {
      render(<ExploreTemplate {...defaultProps} query="test search" />);
      await waitFor(() => {
        expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
      });
    });

    it('calls onQueryChange when input changes', async () => {
      const onQueryChange = vi.fn();
      render(<ExploreTemplate {...defaultProps} onQueryChange={onQueryChange} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search agents/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
        target: { value: 'new query' },
      });
      expect(onQueryChange).toHaveBeenCalledWith('new query');
    });

    it('calls onSearch when Enter is pressed', async () => {
      const onSearch = vi.fn();
      render(<ExploreTemplate {...defaultProps} query="test" onSearch={onSearch} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search agents/i)).toBeInTheDocument();
      });

      fireEvent.keyDown(screen.getByPlaceholderText(/search agents/i), { key: 'Enter' });
      expect(onSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('filters', () => {
    it('displays current filters', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          filters={{
            ...defaultFilters,
            status: ['active'],
          }}
        />,
      );
      expect(screen.getByTestId('filter-option-active')).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onFiltersChange when filter is toggled', () => {
      const onFiltersChange = vi.fn();
      render(<ExploreTemplate {...defaultProps} onFiltersChange={onFiltersChange} />);

      fireEvent.click(screen.getByTestId('filter-option-active'));
      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        status: ['active'],
      });
    });

    it('passes filter counts to SearchFilters', () => {
      render(<ExploreTemplate {...defaultProps} filterCounts={{ active: 42, inactive: 8 }} />);
      expect(screen.getByText('(42)')).toBeInTheDocument();
      expect(screen.getByText('(8)')).toBeInTheDocument();
    });

    it('disables filters when loading', () => {
      render(<ExploreTemplate {...defaultProps} isLoading />);
      const sidebar = screen.getByTestId('explore-sidebar');
      expect(sidebar.querySelector('[data-testid="search-filters"]')).toHaveClass('opacity-50');
    });

    it('disables filters when streaming', () => {
      render(<ExploreTemplate {...defaultProps} isStreaming />);
      const sidebar = screen.getByTestId('explore-sidebar');
      expect(sidebar.querySelector('[data-testid="search-filters"]')).toHaveClass('opacity-50');
    });
  });

  describe('results display', () => {
    it('passes agents to search results', async () => {
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} />);
      // Verify that search-results is rendered (the actual card rendering depends on dynamic imports)
      await waitFor(() => {
        expect(screen.getByTestId('search-results')).toBeInTheDocument();
      });
    });

    it('displays total count', async () => {
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} totalCount={100} />);
      await waitFor(() => {
        expect(screen.getByText('100 agents found')).toBeInTheDocument();
      });
    });

    it('shows loading state', async () => {
      render(<ExploreTemplate {...defaultProps} isLoading />);
      await waitFor(() => {
        expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'loading');
      });
    });

    it('shows error state', async () => {
      render(<ExploreTemplate {...defaultProps} error="Something went wrong" />);
      await waitFor(() => {
        expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'error');
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      });
    });
  });

  describe('streaming support', () => {
    it('shows streaming state on search results', async () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          isStreaming
          streamProgress={{ current: 5, expected: 10 }}
        />,
      );
      await waitFor(() => {
        expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'streaming');
      });
    });

    it('shows HyDE query when provided', async () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          agents={mockAgents}
          hydeQuery="AI agent for code review"
        />,
      );
      await waitFor(() => {
        expect(screen.getByTestId('hyde-query-display')).toBeInTheDocument();
      });
    });

    it('handles stop stream action', async () => {
      const onStopStream = vi.fn();
      render(
        <ExploreTemplate
          {...defaultProps}
          isStreaming
          streamProgress={{ current: 5, expected: 10 }}
          onStopStream={onStopStream}
        />,
      );
      await waitFor(() => {
        expect(screen.getByTestId('streaming-stop-button')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('streaming-stop-button'));
      expect(onStopStream).toHaveBeenCalled();
    });
  });

  describe('compose team button conditional visibility', () => {
    // The compose button visibility is controlled by a combination of props
    // These tests verify the negative conditions (when it should NOT render)

    it('does not render when showComposeButton is false', () => {
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} showComposeButton={false} />);
      expect(screen.queryByTestId('compose-team-section')).not.toBeInTheDocument();
    });

    it('does not render when agents array is empty', () => {
      render(<ExploreTemplate {...defaultProps} agents={[]} showComposeButton />);
      expect(screen.queryByTestId('compose-team-section')).not.toBeInTheDocument();
    });

    it('does not render when isLoading is true', () => {
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} showComposeButton isLoading />);
      expect(screen.queryByTestId('compose-team-section')).not.toBeInTheDocument();
    });

    it('does not render when isStreaming is true', () => {
      render(
        <ExploreTemplate {...defaultProps} agents={mockAgents} showComposeButton isStreaming />,
      );
      expect(screen.queryByTestId('compose-team-section')).not.toBeInTheDocument();
    });

    // Note: Positive rendering tests are handled by integration tests in page.test.tsx
    // as they require full component tree with providers
  });

  describe('compare bar', () => {
    const compareAgents = [
      { id: '11155111:123', name: 'Agent 1' },
      { id: '84532:456', name: 'Agent 2' },
    ];

    it('does not render compare bar when no agents selected', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.queryByTestId('compare-bar')).not.toBeInTheDocument();
    });

    it('does not render compare bar when compareAgents is empty', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={[]}
          compareUrl="/compare"
          onRemoveCompareAgent={vi.fn()}
          onClearCompareAgents={vi.fn()}
        />,
      );
      expect(screen.queryByTestId('compare-bar')).not.toBeInTheDocument();
    });

    it('renders compare bar when agents are selected', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare?agents=11155111:123,84532:456"
          onRemoveCompareAgent={vi.fn()}
          onClearCompareAgents={vi.fn()}
        />,
      );
      expect(screen.getByTestId('compare-bar')).toBeInTheDocument();
    });

    it('shows selected agent count', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare?agents=11155111:123,84532:456"
          onRemoveCompareAgent={vi.fn()}
          onClearCompareAgents={vi.fn()}
        />,
      );
      expect(screen.getByText('2/4')).toBeInTheDocument();
    });

    it('calls onRemoveCompareAgent when agent is removed', () => {
      const onRemoveCompareAgent = vi.fn();
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare"
          onRemoveCompareAgent={onRemoveCompareAgent}
          onClearCompareAgents={vi.fn()}
        />,
      );
      fireEvent.click(screen.getByTestId('compare-bar-remove-11155111:123'));
      expect(onRemoveCompareAgent).toHaveBeenCalledWith('11155111:123');
    });

    it('calls onClearCompareAgents when clear is clicked', () => {
      const onClearCompareAgents = vi.fn();
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare"
          onRemoveCompareAgent={vi.fn()}
          onClearCompareAgents={onClearCompareAgents}
        />,
      );
      fireEvent.click(screen.getByTestId('compare-bar-clear'));
      expect(onClearCompareAgents).toHaveBeenCalledTimes(1);
    });

    it('has correct compare URL', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare?agents=11155111:123,84532:456"
          onRemoveCompareAgent={vi.fn()}
          onClearCompareAgents={vi.fn()}
        />,
      );
      const compareButton = screen.getByTestId('compare-bar-compare-button');
      expect(compareButton).toHaveAttribute('href', '/compare?agents=11155111:123,84532:456');
    });

    it('does not render compare bar when onRemoveCompareAgent is missing', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare"
          onClearCompareAgents={vi.fn()}
        />,
      );
      expect(screen.queryByTestId('compare-bar')).not.toBeInTheDocument();
    });

    it('does not render compare bar when onClearCompareAgents is missing', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          compareUrl="/compare"
          onRemoveCompareAgent={vi.fn()}
        />,
      );
      expect(screen.queryByTestId('compare-bar')).not.toBeInTheDocument();
    });

    it('does not render compare bar when compareUrl is missing', () => {
      render(
        <ExploreTemplate
          {...defaultProps}
          compareAgents={compareAgents}
          onRemoveCompareAgent={vi.fn()}
          onClearCompareAgents={vi.fn()}
        />,
      );
      expect(screen.queryByTestId('compare-bar')).not.toBeInTheDocument();
    });
  });
});
