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
});
