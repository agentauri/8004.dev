import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeedbackTimeline } from './feedback-timeline';

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn().mockReturnValue('2 days ago'),
}));

const mockFeedback = [
  {
    id: '1',
    score: 95,
    tags: ['excellent', 'fast'],
    context: 'Great agent!',
    submitter: '0x1111111111111111111111111111111111111111',
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    score: 72,
    tags: ['reliable'],
    context: 'Good performance.',
    submitter: '0x2222222222222222222222222222222222222222',
    timestamp: '2024-01-14T10:30:00Z',
  },
  {
    id: '3',
    score: 45,
    tags: ['slow'],
    context: 'Some issues.',
    submitter: '0x3333333333333333333333333333333333333333',
    timestamp: '2024-01-13T10:30:00Z',
  },
  {
    id: '4',
    score: 88,
    tags: ['helpful'],
    context: 'Very helpful.',
    submitter: '0x4444444444444444444444444444444444444444',
    timestamp: '2024-01-12T10:30:00Z',
  },
  {
    id: '5',
    score: 60,
    tags: ['average'],
    context: 'Average experience.',
    submitter: '0x5555555555555555555555555555555555555555',
    timestamp: '2024-01-11T10:30:00Z',
  },
];

describe('FeedbackTimeline', () => {
  describe('with data', () => {
    it('renders timeline', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      expect(screen.getByTestId('feedback-timeline')).toBeInTheDocument();
    });

    it('has loaded state in data attribute', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      expect(screen.getByTestId('feedback-timeline')).toHaveAttribute('data-state', 'loaded');
    });

    it('stores count in data attribute', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      expect(screen.getByTestId('feedback-timeline')).toHaveAttribute('data-count', '5');
    });

    it('displays section header with count', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      expect(screen.getByText('RECENT FEEDBACK')).toBeInTheDocument();
      expect(screen.getByText('(5)')).toBeInTheDocument();
    });

    it('hides header when showHeader is false', () => {
      render(<FeedbackTimeline feedback={mockFeedback} showHeader={false} />);
      expect(screen.queryByText('RECENT FEEDBACK')).not.toBeInTheDocument();
    });

    it('renders all feedback entries when no limit', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      const entries = screen.getAllByTestId('feedback-entry');
      expect(entries).toHaveLength(5);
    });
  });

  describe('maxEntries limit', () => {
    it('limits displayed entries', () => {
      render(<FeedbackTimeline feedback={mockFeedback} maxEntries={3} />);
      const entries = screen.getAllByTestId('feedback-entry');
      expect(entries).toHaveLength(3);
    });

    it('shows remaining count text when no onShowMore', () => {
      render(<FeedbackTimeline feedback={mockFeedback} maxEntries={3} />);
      expect(screen.getByTestId('more-count-text')).toHaveTextContent('+2 more feedback entries');
    });

    it('shows show more button when onShowMore provided', () => {
      const onShowMore = vi.fn();
      render(<FeedbackTimeline feedback={mockFeedback} maxEntries={3} onShowMore={onShowMore} />);
      expect(screen.getByTestId('show-more-button')).toHaveTextContent('Show 2 more');
    });

    it('calls onShowMore when button clicked', () => {
      const onShowMore = vi.fn();
      render(<FeedbackTimeline feedback={mockFeedback} maxEntries={3} onShowMore={onShowMore} />);
      fireEvent.click(screen.getByTestId('show-more-button'));
      expect(onShowMore).toHaveBeenCalledTimes(1);
    });

    it('does not show more indicator when all entries shown', () => {
      render(<FeedbackTimeline feedback={mockFeedback.slice(0, 3)} maxEntries={5} />);
      expect(screen.queryByTestId('show-more-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('more-count-text')).not.toBeInTheDocument();
    });
  });

  describe('compact mode', () => {
    it('passes compact prop to entries', () => {
      render(<FeedbackTimeline feedback={mockFeedback.slice(0, 1)} compact />);
      // Compact entries don't show context
      expect(screen.queryByTestId('feedback-context')).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty state when no feedback', () => {
      render(<FeedbackTimeline feedback={[]} />);
      expect(screen.getByTestId('feedback-timeline')).toHaveAttribute('data-state', 'empty');
    });

    it('displays no feedback message', () => {
      render(<FeedbackTimeline feedback={[]} />);
      expect(screen.getByText('No feedback yet')).toBeInTheDocument();
    });

    it('displays help text', () => {
      render(<FeedbackTimeline feedback={[]} />);
      expect(
        screen.getByText('Feedback will appear here once users rate this agent'),
      ).toBeInTheDocument();
    });

    it('still shows header in empty state', () => {
      render(<FeedbackTimeline feedback={[]} />);
      expect(screen.getByText('RECENT FEEDBACK')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<FeedbackTimeline feedback={mockFeedback} className="custom-class" />);
      expect(screen.getByTestId('feedback-timeline')).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('uses section element', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      expect(screen.getByTestId('feedback-timeline').tagName).toBe('SECTION');
    });

    it('has heading element for header', () => {
      render(<FeedbackTimeline feedback={mockFeedback} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('RECENT FEEDBACK');
    });

    it('show more button has correct type', () => {
      const onShowMore = vi.fn();
      render(<FeedbackTimeline feedback={mockFeedback} maxEntries={3} onShowMore={onShowMore} />);
      expect(screen.getByTestId('show-more-button')).toHaveAttribute('type', 'button');
    });
  });
});
