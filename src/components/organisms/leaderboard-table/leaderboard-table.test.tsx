import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { LeaderboardTable } from './leaderboard-table';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    agentId: '11155111:42',
    chainId: 11155111,
    tokenId: '42',
    name: 'CodeReview Pro',
    description: 'An AI code review assistant',
    score: 95,
    feedbackCount: 156,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: true,
    x402Support: false,
  },
  {
    rank: 2,
    agentId: '84532:15',
    chainId: 84532,
    tokenId: '15',
    name: 'Trading Assistant',
    description: 'Automated trading helper',
    score: 92,
    feedbackCount: 203,
    trend: 'up',
    active: true,
    hasMcp: true,
    hasA2a: false,
    x402Support: true,
  },
  {
    rank: 3,
    agentId: '11155111:88',
    chainId: 11155111,
    tokenId: '88',
    name: 'Data Analyzer',
    description: 'Data analysis specialist',
    score: 89,
    feedbackCount: 98,
    trend: 'stable',
    active: true,
    hasMcp: false,
    hasA2a: true,
    x402Support: false,
  },
];

describe('LeaderboardTable', () => {
  describe('rendering', () => {
    it('renders the table', () => {
      render(<LeaderboardTable entries={mockEntries} />);
      expect(screen.getByTestId('leaderboard-table')).toBeInTheDocument();
    });

    it('renders table headers', () => {
      render(<LeaderboardTable entries={mockEntries} />);
      expect(screen.getByText('Rank')).toBeInTheDocument();
      expect(screen.getByText('Agent')).toBeInTheDocument();
      expect(screen.getByText('Feedbacks')).toBeInTheDocument();
      expect(screen.getByText('Trend')).toBeInTheDocument();
      expect(screen.getByText('Score')).toBeInTheDocument();
    });

    it('renders all entries', () => {
      render(<LeaderboardTable entries={mockEntries} />);
      expect(screen.getByText('CodeReview Pro')).toBeInTheDocument();
      expect(screen.getByText('Trading Assistant')).toBeInTheDocument();
      expect(screen.getByText('Data Analyzer')).toBeInTheDocument();
    });

    it('renders leaderboard rows', () => {
      render(<LeaderboardTable entries={mockEntries} />);
      expect(screen.getAllByTestId('leaderboard-row')).toHaveLength(3);
    });

    it('applies custom className', () => {
      render(<LeaderboardTable entries={mockEntries} className="custom-class" />);
      expect(screen.getByTestId('leaderboard-table')).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('renders skeletons when loading', () => {
      render(<LeaderboardTable entries={[]} isLoading />);
      expect(screen.getAllByTestId('leaderboard-row-skeleton')).toHaveLength(10);
    });

    it('does not render entries when loading', () => {
      render(<LeaderboardTable entries={mockEntries} isLoading />);
      expect(screen.queryByText('CodeReview Pro')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders error message', () => {
      render(<LeaderboardTable entries={[]} error="Failed to load leaderboard" />);
      expect(screen.getByText('Failed to load leaderboard')).toBeInTheDocument();
    });

    it('has role alert on error', () => {
      render(<LeaderboardTable entries={[]} error="Failed to load" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render entries when error', () => {
      render(<LeaderboardTable entries={mockEntries} error="Error" />);
      expect(screen.queryByText('CodeReview Pro')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty message when no entries', () => {
      render(<LeaderboardTable entries={[]} />);
      expect(screen.getByText('No agents found matching your filters.')).toBeInTheDocument();
    });

    it('renders trophy icon in empty state', () => {
      render(<LeaderboardTable entries={[]} />);
      const container = screen.getByText('No agents found matching your filters.').parentElement;
      expect(container?.querySelector('.lucide-trophy')).toBeInTheDocument();
    });
  });

  describe('load more', () => {
    it('renders load more button when hasMore is true', () => {
      const onLoadMore = vi.fn();
      render(<LeaderboardTable entries={mockEntries} hasMore onLoadMore={onLoadMore} />);
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    it('does not render load more button when hasMore is false', () => {
      const onLoadMore = vi.fn();
      render(<LeaderboardTable entries={mockEntries} hasMore={false} onLoadMore={onLoadMore} />);
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    it('does not render load more button when onLoadMore is undefined', () => {
      render(<LeaderboardTable entries={mockEntries} hasMore />);
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    it('calls onLoadMore when button is clicked', () => {
      const onLoadMore = vi.fn();
      render(<LeaderboardTable entries={mockEntries} hasMore onLoadMore={onLoadMore} />);
      fireEvent.click(screen.getByText('Load More'));
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('shows loading text when isLoadingMore is true', () => {
      const onLoadMore = vi.fn();
      render(
        <LeaderboardTable entries={mockEntries} hasMore onLoadMore={onLoadMore} isLoadingMore />,
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('disables button when isLoadingMore is true', () => {
      const onLoadMore = vi.fn();
      render(
        <LeaderboardTable entries={mockEntries} hasMore onLoadMore={onLoadMore} isLoadingMore />,
      );
      expect(screen.getByText('Loading...')).toBeDisabled();
    });
  });
});
