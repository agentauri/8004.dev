import { fireEvent, render, screen } from '@testing-library/react';
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

const mockAgents: AgentCardAgent[] = [
  {
    id: '0x1111111111111111111111111111111111111111',
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
};

const defaultProps = {
  query: '',
  onQueryChange: vi.fn(),
  onSearch: vi.fn(),
  filters: defaultFilters,
  onFiltersChange: vi.fn(),
  agents: [],
};

describe('ExploreTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
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
      // Desktop sidebar contains SearchFilters, mobile has MobileFilterSheet
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

    it('renders search bar', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    it('renders search results', () => {
      render(<ExploreTemplate {...defaultProps} />);
      expect(screen.getByTestId('search-results')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ExploreTemplate {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('explore-template')).toHaveClass('custom-class');
    });
  });

  describe('search functionality', () => {
    it('displays current query', () => {
      render(<ExploreTemplate {...defaultProps} query="test search" />);
      expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    });

    it('calls onQueryChange when input changes', () => {
      const onQueryChange = vi.fn();
      render(<ExploreTemplate {...defaultProps} onQueryChange={onQueryChange} />);

      // Use the search input placeholder to identify the main search box
      fireEvent.change(screen.getByPlaceholderText(/search agents/i), {
        target: { value: 'new query' },
      });
      expect(onQueryChange).toHaveBeenCalledWith('new query');
    });

    it('calls onSearch when Enter is pressed', () => {
      const onSearch = vi.fn();
      render(<ExploreTemplate {...defaultProps} query="test" onSearch={onSearch} />);

      // Use the search input placeholder to identify the main search box
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
            status: ['active'],
            protocols: [],
            chains: [],
            filterMode: 'AND',
            minReputation: 0,
            maxReputation: 100,
            skills: [],
            domains: [],
            showAllAgents: false,
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
        status: ['active'],
        protocols: [],
        chains: [],
        filterMode: 'AND',
        minReputation: 0,
        maxReputation: 100,
        skills: [],
        domains: [],
        showAllAgents: false,
      });
    });

    it('passes filter counts to SearchFilters', () => {
      render(<ExploreTemplate {...defaultProps} filterCounts={{ active: 42, inactive: 8 }} />);
      expect(screen.getByText('(42)')).toBeInTheDocument();
      expect(screen.getByText('(8)')).toBeInTheDocument();
    });

    it('disables filters when loading', () => {
      render(<ExploreTemplate {...defaultProps} isLoading />);
      // Desktop sidebar contains SearchFilters
      const sidebar = screen.getByTestId('explore-sidebar');
      expect(sidebar.querySelector('[data-testid="search-filters"]')).toHaveClass('opacity-50');
    });
  });

  describe('results', () => {
    it('displays agents', () => {
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} />);
      expect(screen.getByTestId('agent-card')).toBeInTheDocument();
    });

    it('displays total count', () => {
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} totalCount={100} />);
      expect(screen.getByText('100 agents found')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(<ExploreTemplate {...defaultProps} isLoading />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'loading');
    });

    it('shows error state', () => {
      render(<ExploreTemplate {...defaultProps} error="Something went wrong" />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'error');
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('calls onAgentClick when agent is clicked', () => {
      const onAgentClick = vi.fn();
      render(<ExploreTemplate {...defaultProps} agents={mockAgents} onAgentClick={onAgentClick} />);

      fireEvent.click(screen.getByTestId('agent-card'));
      expect(onAgentClick).toHaveBeenCalledWith(mockAgents[0]);
    });
  });
});
