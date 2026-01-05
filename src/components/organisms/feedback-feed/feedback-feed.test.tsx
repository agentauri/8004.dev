import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GlobalFeedback } from '@/types/feedback';
import { FeedbackFeed } from './feedback-feed';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockFeedbacks: GlobalFeedback[] = [
  {
    id: 'fb_1',
    score: 92,
    tags: ['reliable', 'fast'],
    context: 'Excellent code review.',
    submitter: '0x1234567890abcdef1234567890abcdef12345678',
    timestamp: new Date().toISOString(),
    transactionHash: '0xabc123',
    agentId: '11155111:42',
    agentName: 'CodeReview Pro',
    agentChainId: 11155111,
  },
  {
    id: 'fb_2',
    score: 45,
    tags: ['slow'],
    context: 'Response was accurate but slow.',
    submitter: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: new Date().toISOString(),
    transactionHash: '0xdef456',
    agentId: '84532:15',
    agentName: 'Trading Assistant',
    agentChainId: 84532,
  },
];

describe('FeedbackFeed', () => {
  describe('rendering', () => {
    it('renders the feed container', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} />);
      expect(screen.getByTestId('feedback-feed')).toBeInTheDocument();
    });

    it('renders all feedback cards', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} />);
      expect(screen.getByText('CodeReview Pro')).toBeInTheDocument();
      expect(screen.getByText('Trading Assistant')).toBeInTheDocument();
    });

    it('renders feedback card components', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} />);
      expect(screen.getAllByTestId('feedback-card-global')).toHaveLength(2);
    });

    it('applies custom className', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} className="custom-class" />);
      expect(screen.getByTestId('feedback-feed')).toHaveClass('custom-class');
    });
  });

  describe('loading state', () => {
    it('renders skeletons when loading', () => {
      render(<FeedbackFeed feedbacks={[]} isLoading />);
      expect(screen.getAllByTestId('feedback-card-skeleton')).toHaveLength(5);
    });

    it('does not render feedbacks when loading', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} isLoading />);
      expect(screen.queryByText('CodeReview Pro')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders error message', () => {
      render(<FeedbackFeed feedbacks={[]} error="Failed to load feedbacks" />);
      expect(screen.getByText('Failed to load feedbacks')).toBeInTheDocument();
    });

    it('has role alert on error', () => {
      render(<FeedbackFeed feedbacks={[]} error="Error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render feedbacks when error', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} error="Error" />);
      expect(screen.queryByText('CodeReview Pro')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty message when no feedbacks', () => {
      render(<FeedbackFeed feedbacks={[]} />);
      expect(screen.getByText('No feedbacks found matching your filters.')).toBeInTheDocument();
    });

    it('renders message icon in empty state', () => {
      render(<FeedbackFeed feedbacks={[]} />);
      const container = screen.getByText('No feedbacks found matching your filters.').parentElement;
      expect(container?.querySelector('.lucide-message-square')).toBeInTheDocument();
    });
  });

  describe('load more', () => {
    it('renders load more button when hasMore is true', () => {
      const onLoadMore = vi.fn();
      render(<FeedbackFeed feedbacks={mockFeedbacks} hasMore onLoadMore={onLoadMore} />);
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    it('does not render load more button when hasMore is false', () => {
      const onLoadMore = vi.fn();
      render(<FeedbackFeed feedbacks={mockFeedbacks} hasMore={false} onLoadMore={onLoadMore} />);
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    it('does not render load more button when onLoadMore is undefined', () => {
      render(<FeedbackFeed feedbacks={mockFeedbacks} hasMore />);
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    it('calls onLoadMore when button is clicked', () => {
      const onLoadMore = vi.fn();
      render(<FeedbackFeed feedbacks={mockFeedbacks} hasMore onLoadMore={onLoadMore} />);
      fireEvent.click(screen.getByText('Load More'));
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('shows loading text when isLoadingMore is true', () => {
      const onLoadMore = vi.fn();
      render(
        <FeedbackFeed feedbacks={mockFeedbacks} hasMore onLoadMore={onLoadMore} isLoadingMore />,
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('disables button when isLoadingMore is true', () => {
      const onLoadMore = vi.fn();
      render(
        <FeedbackFeed feedbacks={mockFeedbacks} hasMore onLoadMore={onLoadMore} isLoadingMore />,
      );
      expect(screen.getByText('Loading...')).toBeDisabled();
    });
  });
});
