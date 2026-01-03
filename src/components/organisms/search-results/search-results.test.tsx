import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AgentCardAgent } from '../agent-card';
import { SearchResults } from './search-results';

const mockAgents: AgentCardAgent[] = [
  {
    id: '0x1111111111111111111111111111111111111111',
    name: 'Test Agent 1',
    description: 'First test agent',
    chainId: 11155111,
    isActive: true,
    trustScore: 85,
    capabilities: ['mcp'],
  },
  {
    id: '0x2222222222222222222222222222222222222222',
    name: 'Test Agent 2',
    description: 'Second test agent',
    chainId: 84532,
    isActive: false,
    capabilities: ['a2a'],
  },
];

describe('SearchResults', () => {
  describe('success state', () => {
    it('renders search results container', () => {
      render(<SearchResults agents={mockAgents} />);
      expect(screen.getByTestId('search-results')).toBeInTheDocument();
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'success');
    });

    it('applies custom className', () => {
      render(<SearchResults agents={mockAgents} className="custom-class" />);
      expect(screen.getByTestId('search-results')).toHaveClass('custom-class');
    });

    it('renders agent cards', () => {
      render(<SearchResults agents={mockAgents} />);
      expect(screen.getAllByTestId('agent-card')).toHaveLength(2);
    });

    it('renders agents in grid', () => {
      render(<SearchResults agents={mockAgents} />);
      expect(screen.getByTestId('search-results-grid')).toBeInTheDocument();
    });

    it('displays total count when provided', () => {
      render(<SearchResults agents={mockAgents} totalCount={100} />);
      expect(screen.getByTestId('search-results-count')).toHaveTextContent('100 agents found');
    });

    it('displays singular agent count', () => {
      render(<SearchResults agents={[mockAgents[0]]} totalCount={1} />);
      expect(screen.getByTestId('search-results-count')).toHaveTextContent('1 agent found');
    });

    it('does not display count when not provided', () => {
      render(<SearchResults agents={mockAgents} />);
      expect(screen.queryByTestId('search-results-count')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading skeletons', () => {
      render(<SearchResults agents={[]} isLoading />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'loading');
      expect(screen.getAllByTestId('search-result-skeleton')).toHaveLength(4);
    });

    it('applies custom className when loading', () => {
      render(<SearchResults agents={[]} isLoading className="custom-class" />);
      expect(screen.getByTestId('search-results')).toHaveClass('custom-class');
    });
  });

  describe('empty state', () => {
    it('shows empty message when no agents', () => {
      render(<SearchResults agents={[]} />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'empty');
      expect(screen.getByText('No agents found matching your search.')).toBeInTheDocument();
    });

    it('uses custom empty message', () => {
      render(<SearchResults agents={[]} emptyMessage="Custom empty message" />);
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('applies custom className when empty', () => {
      render(<SearchResults agents={[]} className="custom-class" />);
      expect(screen.getByTestId('search-results')).toHaveClass('custom-class');
    });
  });

  describe('error state', () => {
    it('shows error message', () => {
      render(<SearchResults agents={[]} error="Something went wrong" />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'error');
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('applies custom className when error', () => {
      render(<SearchResults agents={[]} error="Error" className="custom-class" />);
      expect(screen.getByTestId('search-results')).toHaveClass('custom-class');
    });

    it('error state takes precedence over loading', () => {
      render(<SearchResults agents={[]} error="Error" isLoading />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'error');
    });
  });

  describe('agent click handling', () => {
    it('calls onAgentClick when agent is clicked', () => {
      const onAgentClick = vi.fn();
      render(<SearchResults agents={mockAgents} onAgentClick={onAgentClick} />);

      const firstCard = screen.getAllByTestId('agent-card')[0];
      fireEvent.click(firstCard);

      expect(onAgentClick).toHaveBeenCalledWith(mockAgents[0]);
    });

    it('renders cards as links when no onAgentClick', () => {
      render(<SearchResults agents={mockAgents} />);
      const firstCard = screen.getAllByTestId('agent-card')[0];
      expect(firstCard.tagName).toBe('A');
    });

    it('renders cards as buttons when onAgentClick provided', () => {
      const onAgentClick = vi.fn();
      render(<SearchResults agents={mockAgents} onAgentClick={onAgentClick} />);
      const firstCard = screen.getAllByTestId('agent-card')[0];
      expect(firstCard.tagName).toBe('DIV');
      expect(firstCard).toHaveAttribute('role', 'button');
    });
  });

  // ============================================
  // Streaming Tests
  // ============================================

  describe('streaming state', () => {
    it('renders streaming state with data-state attribute', () => {
      render(<SearchResults agents={mockAgents} isStreaming />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'streaming');
    });

    it('shows streaming indicator when streaming', () => {
      render(<SearchResults agents={mockAgents} isStreaming />);
      expect(screen.getByTestId('streaming-indicator')).toBeInTheDocument();
    });

    it('displays LIVE badge when streaming', () => {
      render(<SearchResults agents={mockAgents} isStreaming />);
      expect(screen.getByTestId('streaming-badge')).toBeInTheDocument();
      expect(screen.getByTestId('streaming-badge')).toHaveTextContent('LIVE');
    });

    it('shows streaming text with animated dots', () => {
      render(<SearchResults agents={mockAgents} isStreaming />);
      expect(screen.getByTestId('streaming-text')).toHaveTextContent('Streaming results');
    });

    it('hides count when streaming', () => {
      render(<SearchResults agents={mockAgents} isStreaming totalCount={2} />);
      expect(screen.queryByTestId('search-results-count')).not.toBeInTheDocument();
    });

    it('hides sort selector when streaming', () => {
      const onSortChange = vi.fn();
      render(<SearchResults agents={mockAgents} isStreaming onSortChange={onSortChange} />);
      expect(screen.queryByTestId('sort-selector')).not.toBeInTheDocument();
    });

    it('does not show empty state when streaming with no agents', () => {
      render(<SearchResults agents={[]} isStreaming />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'streaming');
      expect(screen.queryByText('No agents found matching your search.')).not.toBeInTheDocument();
    });

    it('does not show loading state when streaming with isLoading true', () => {
      render(<SearchResults agents={mockAgents} isStreaming isLoading />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'streaming');
      expect(screen.queryAllByTestId('search-result-skeleton')).toHaveLength(0);
    });

    it('hides pagination when streaming', () => {
      render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          pageNumber={1}
          hasMore
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />,
      );
      expect(screen.queryByTestId('search-results-pagination')).not.toBeInTheDocument();
    });
  });

  describe('streaming progress', () => {
    it('displays progress bar when expected is known', () => {
      render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          streamProgress={{ current: 2, expected: 5 }}
        />,
      );
      expect(screen.getByTestId('streaming-progress')).toBeInTheDocument();
    });

    it('shows correct progress text', () => {
      render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          streamProgress={{ current: 3, expected: 10 }}
        />,
      );
      expect(screen.getByTestId('streaming-progress')).toHaveTextContent('3/10');
    });

    it('does not show progress bar when expected is null', () => {
      render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          streamProgress={{ current: 2, expected: null }}
        />,
      );
      expect(screen.queryByTestId('streaming-progress')).not.toBeInTheDocument();
    });

    it('shows streaming skeletons when more results expected', () => {
      render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          streamProgress={{ current: 2, expected: 5 }}
        />,
      );
      expect(screen.getByTestId('streaming-skeletons')).toBeInTheDocument();
      expect(screen.getAllByTestId('streaming-skeleton')).toHaveLength(2);
    });

    it('limits streaming skeletons to 2 maximum', () => {
      render(
        <SearchResults
          agents={[mockAgents[0]]}
          isStreaming
          streamProgress={{ current: 1, expected: 10 }}
        />,
      );
      expect(screen.getAllByTestId('streaming-skeleton')).toHaveLength(2);
    });

    it('does not show streaming skeletons when all results received', () => {
      render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          streamProgress={{ current: 2, expected: 2 }}
        />,
      );
      expect(screen.queryByTestId('streaming-skeletons')).not.toBeInTheDocument();
    });
  });

  describe('stop streaming', () => {
    it('shows stop button when onStopStream is provided', () => {
      const onStopStream = vi.fn();
      render(<SearchResults agents={mockAgents} isStreaming onStopStream={onStopStream} />);
      expect(screen.getByTestId('streaming-stop-button')).toBeInTheDocument();
    });

    it('does not show stop button when onStopStream is not provided', () => {
      render(<SearchResults agents={mockAgents} isStreaming />);
      expect(screen.queryByTestId('streaming-stop-button')).not.toBeInTheDocument();
    });

    it('calls onStopStream when stop button is clicked', () => {
      const onStopStream = vi.fn();
      render(<SearchResults agents={mockAgents} isStreaming onStopStream={onStopStream} />);

      fireEvent.click(screen.getByTestId('streaming-stop-button'));
      expect(onStopStream).toHaveBeenCalledTimes(1);
    });
  });

  describe('HyDE query display', () => {
    it('renders HyDE query section when hydeQuery is provided', () => {
      render(
        <SearchResults agents={mockAgents} hydeQuery="AI agent for code review and testing" />,
      );
      expect(screen.getByTestId('hyde-query-display')).toBeInTheDocument();
    });

    it('does not render HyDE query section when hydeQuery is null', () => {
      render(<SearchResults agents={mockAgents} hydeQuery={null} />);
      expect(screen.queryByTestId('hyde-query-display')).not.toBeInTheDocument();
    });

    it('does not render HyDE query section when hydeQuery is not provided', () => {
      render(<SearchResults agents={mockAgents} />);
      expect(screen.queryByTestId('hyde-query-display')).not.toBeInTheDocument();
    });

    it('toggle button has correct aria-expanded attribute', () => {
      render(<SearchResults agents={mockAgents} hydeQuery="AI agent for code review" />);
      const toggle = screen.getByTestId('hyde-query-toggle');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands HyDE query content when clicked', () => {
      render(<SearchResults agents={mockAgents} hydeQuery="AI agent for code review" />);

      const toggle = screen.getByTestId('hyde-query-toggle');
      expect(screen.queryByTestId('hyde-query-content')).not.toBeInTheDocument();

      fireEvent.click(toggle);

      expect(screen.getByTestId('hyde-query-content')).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses HyDE query content when clicked again', () => {
      render(<SearchResults agents={mockAgents} hydeQuery="AI agent for code review" />);

      const toggle = screen.getByTestId('hyde-query-toggle');
      fireEvent.click(toggle);
      expect(screen.getByTestId('hyde-query-content')).toBeInTheDocument();

      fireEvent.click(toggle);
      expect(screen.queryByTestId('hyde-query-content')).not.toBeInTheDocument();
    });

    it('displays the HyDE query text when expanded', () => {
      const hydeQuery = 'An advanced AI agent for automated code review';
      render(<SearchResults agents={mockAgents} hydeQuery={hydeQuery} />);

      fireEvent.click(screen.getByTestId('hyde-query-toggle'));

      expect(screen.getByTestId('hyde-query-content')).toHaveTextContent(hydeQuery);
    });

    it('renders HyDE query with streaming', () => {
      render(
        <SearchResults agents={mockAgents} isStreaming hydeQuery="AI agent for code review" />,
      );
      expect(screen.getByTestId('hyde-query-display')).toBeInTheDocument();
      expect(screen.getByTestId('streaming-indicator')).toBeInTheDocument();
    });
  });

  describe('streaming backward compatibility', () => {
    it('works without any streaming props', () => {
      render(<SearchResults agents={mockAgents} totalCount={2} />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'success');
      expect(screen.getByTestId('search-results-count')).toHaveTextContent('2 agents found');
    });

    it('transitions from streaming to success state', () => {
      const { rerender } = render(<SearchResults agents={mockAgents} isStreaming />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'streaming');

      rerender(<SearchResults agents={mockAgents} isStreaming={false} totalCount={2} />);
      expect(screen.getByTestId('search-results')).toHaveAttribute('data-state', 'success');
      expect(screen.getByTestId('search-results-count')).toHaveTextContent('2 agents found');
    });

    it('shows pagination after streaming completes', () => {
      const onNext = vi.fn();
      const onPrevious = vi.fn();

      const { rerender } = render(
        <SearchResults
          agents={mockAgents}
          isStreaming
          pageNumber={1}
          hasMore
          onNext={onNext}
          onPrevious={onPrevious}
        />,
      );
      expect(screen.queryByTestId('search-results-pagination')).not.toBeInTheDocument();

      rerender(
        <SearchResults
          agents={mockAgents}
          isStreaming={false}
          pageNumber={1}
          hasMore
          onNext={onNext}
          onPrevious={onPrevious}
        />,
      );
      expect(screen.getByTestId('search-results-pagination')).toBeInTheDocument();
    });
  });
});
