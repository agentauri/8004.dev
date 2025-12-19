import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AgentFeedback } from '@/types/agent';
import { AgentFeedbacks } from './agent-feedbacks';

const createMockFeedback = (id: number): AgentFeedback => ({
  id: `feedback-${id}`,
  score: 70 + (id % 30),
  tags: ['reliable', 'fast'],
  context: `Test feedback ${id}`,
  submitter: `0x${id.toString().padStart(40, '0')}`,
  timestamp: new Date(Date.now() - id * 3600000).toISOString(),
  feedbackUri: `https://easscan.org/attestation/${id}`,
});

const mockFeedbacks: AgentFeedback[] = Array.from({ length: 25 }, (_, i) =>
  createMockFeedback(i + 1),
);

describe('AgentFeedbacks', () => {
  describe('rendering', () => {
    it('renders with feedback data', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 5)} />);
      expect(screen.getByTestId('agent-feedbacks')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 5)} className="custom-class" />);
      expect(screen.getByTestId('agent-feedbacks')).toHaveClass('custom-class');
    });

    it('shows header with FEEDBACKS title', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 5)} />);
      expect(screen.getByText('FEEDBACKS')).toBeInTheDocument();
    });

    it('shows feedback count', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 5)} totalCount={25} />);
      expect(screen.getByText('(25)')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty state when no feedbacks', () => {
      render(<AgentFeedbacks feedback={[]} />);
      expect(screen.getByTestId('agent-feedbacks')).toHaveAttribute('data-empty', 'true');
      expect(screen.getByText('No feedback yet')).toBeInTheDocument();
    });

    it('shows descriptive empty message', () => {
      render(<AgentFeedbacks feedback={[]} />);
      expect(
        screen.getByText(/This agent hasn't received any feedback/),
      ).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading state when loading with no data', () => {
      render(<AgentFeedbacks feedback={[]} isLoading />);
      expect(screen.getByTestId('agent-feedbacks')).toHaveAttribute('data-loading', 'true');
    });

    it('shows loading indicator when loading more', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 10)} isLoading hasMore />);
      expect(screen.getByText('Loading more...')).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('shows only initial feedbacks', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks} />);
      // Should show 10 initially (INITIAL_DISPLAY_COUNT)
      const entries = screen.getAllByTestId('feedback-entry');
      expect(entries).toHaveLength(10);
    });

    it('shows "Show more" button when there are hidden feedbacks', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks} />);
      expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
      expect(screen.getByText(/Show \d+ more/)).toBeInTheDocument();
    });

    it('expands list when "Show more" is clicked', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks} />);

      const button = screen.getByTestId('load-more-button');
      fireEvent.click(button);

      // Should now show 20 (initial 10 + 10 more)
      const entries = screen.getAllByTestId('feedback-entry');
      expect(entries).toHaveLength(20);
    });

    it('calls onLoadMore when all local feedbacks are shown and hasMore is true', () => {
      const onLoadMore = vi.fn();
      render(
        <AgentFeedbacks
          feedback={mockFeedbacks.slice(0, 10)}
          hasMore
          onLoadMore={onLoadMore}
        />,
      );

      const button = screen.getByTestId('load-more-button');
      fireEvent.click(button);

      expect(onLoadMore).toHaveBeenCalled();
    });

    it('does not show "Show more" when all feedbacks are displayed', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 5)} />);
      expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
    });

    it('shows "Showing all X feedbacks" when fully expanded', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks} />);

      // Click show more multiple times to expand all
      // Initial: displayCount=10, after 1st click: displayCount=20, after 2nd click: displayCount=30
      fireEvent.click(screen.getByTestId('load-more-button')); // displayCount becomes 20
      fireEvent.click(screen.getByTestId('load-more-button')); // displayCount becomes 30 (> 25, all shown)

      // Now button should be gone and message should appear
      expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
      expect(screen.getByText(/Showing all 25 feedbacks/)).toBeInTheDocument();
    });
  });

  describe('feedback entries', () => {
    it('renders FeedbackEntry for each displayed feedback', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 5)} />);
      const entries = screen.getAllByTestId('feedback-entry');
      expect(entries).toHaveLength(5);
    });

    it('shows feedback content', () => {
      render(<AgentFeedbacks feedback={[mockFeedbacks[0]]} />);
      expect(screen.getByText('Test feedback 1')).toBeInTheDocument();
    });
  });

  describe('total count', () => {
    it('uses array length when totalCount not provided', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 15)} />);
      expect(screen.getByText('(15)')).toBeInTheDocument();
    });

    it('uses totalCount when provided', () => {
      render(<AgentFeedbacks feedback={mockFeedbacks.slice(0, 10)} totalCount={100} />);
      expect(screen.getByText('(100)')).toBeInTheDocument();
    });
  });
});
