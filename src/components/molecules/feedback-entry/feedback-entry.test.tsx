import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeedbackEntry } from './feedback-entry';

// Mock date-fns to have consistent output
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn().mockReturnValue('2 days ago'),
}));

const baseFeedback = {
  id: 'feedback-1',
  score: 85,
  tags: ['reliable', 'fast', 'accurate'],
  context: 'Great agent for trading tasks',
  feedbackUri: 'https://example.com/feedback/1',
  submitter: '0x1234567890abcdef1234567890abcdef12345678',
  timestamp: '2024-01-15T10:30:00Z',
};

describe('FeedbackEntry', () => {
  describe('basic rendering', () => {
    it('renders component', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-entry')).toBeInTheDocument();
    });

    it('stores feedback ID in data attribute', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-entry')).toHaveAttribute(
        'data-feedback-id',
        'feedback-1',
      );
    });
  });

  describe('score display', () => {
    it('displays trust score', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '85');
    });

    it('shows high level for high score', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, score: 90 }} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-level', 'high');
    });

    it('shows medium level for medium score', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, score: 55 }} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-level', 'medium');
    });

    it('shows low level for low score', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, score: 25 }} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-level', 'low');
    });
  });

  describe('submitter display', () => {
    it('displays truncated submitter address', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('submitter-address')).toHaveTextContent('0x1234...5678');
    });

    it('shows full address in title attribute', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('submitter-address')).toHaveAttribute(
        'title',
        '0x1234567890abcdef1234567890abcdef12345678',
      );
    });

    it('handles short addresses without truncation', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, submitter: '0x1234' }} />);
      expect(screen.getByTestId('submitter-address')).toHaveTextContent('0x1234');
    });
  });

  describe('timestamp display', () => {
    it('displays relative timestamp', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-timestamp')).toHaveTextContent('2 days ago');
    });

    it('has dateTime attribute', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-timestamp')).toHaveAttribute(
        'datetime',
        '2024-01-15T10:30:00Z',
      );
    });
  });

  describe('tags display', () => {
    it('displays feedback tags', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-tags')).toBeInTheDocument();
    });

    it('does not render tags section when empty', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, tags: [] }} />);
      expect(screen.queryByTestId('feedback-tags')).not.toBeInTheDocument();
    });
  });

  describe('context display', () => {
    it('displays context when provided', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-context')).toHaveTextContent(
        'Great agent for trading tasks',
      );
    });

    it('does not render context when not provided', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, context: undefined }} />);
      expect(screen.queryByTestId('feedback-context')).not.toBeInTheDocument();
    });
  });

  describe('feedback URI', () => {
    it('displays feedback URI link when provided', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      const link = screen.getByTestId('feedback-uri-link');
      expect(link).toHaveAttribute('href', 'https://example.com/feedback/1');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not render URI link when not provided', () => {
      render(<FeedbackEntry feedback={{ ...baseFeedback, feedbackUri: undefined }} />);
      expect(screen.queryByTestId('feedback-uri-link')).not.toBeInTheDocument();
    });
  });

  describe('compact mode', () => {
    it('hides context in compact mode', () => {
      render(<FeedbackEntry feedback={baseFeedback} compact />);
      expect(screen.queryByTestId('feedback-context')).not.toBeInTheDocument();
    });

    it('hides feedback URI in compact mode', () => {
      render(<FeedbackEntry feedback={baseFeedback} compact />);
      expect(screen.queryByTestId('feedback-uri-link')).not.toBeInTheDocument();
    });

    it('still shows tags in compact mode', () => {
      render(<FeedbackEntry feedback={baseFeedback} compact />);
      expect(screen.getByTestId('feedback-tags')).toBeInTheDocument();
    });

    it('limits tags to 3 in compact mode', () => {
      render(<FeedbackEntry feedback={baseFeedback} compact />);
      expect(screen.getByTestId('feedback-tags')).toHaveAttribute('data-count', '3');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<FeedbackEntry feedback={baseFeedback} className="custom-class" />);
      expect(screen.getByTestId('feedback-entry')).toHaveClass('custom-class');
    });
  });

  describe('styling', () => {
    it('has correct background color', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-entry')).toHaveClass('bg-[var(--pixel-gray-800)]');
    });

    it('has border styling', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-entry')).toHaveClass(
        'border-2',
        'border-[var(--pixel-gray-700)]',
      );
    });

    it('has hover transition', () => {
      render(<FeedbackEntry feedback={baseFeedback} />);
      expect(screen.getByTestId('feedback-entry')).toHaveClass('transition-colors');
    });
  });

  describe('transaction hash link', () => {
    const feedbackWithTxHash = {
      ...baseFeedback,
      transactionHash: '0xabc123def456',
    };

    it('renders transaction explorer link when transactionHash and chainId provided', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} chainId={11155111} />);
      expect(screen.getByTestId('tx-explorer-link')).toBeInTheDocument();
    });

    it('links to correct explorer URL', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} chainId={11155111} />);
      const link = screen.getByTestId('tx-explorer-link');
      expect(link).toHaveAttribute('href', 'https://sepolia.etherscan.io/tx/0xabc123def456');
    });

    it('opens in new tab', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} chainId={11155111} />);
      const link = screen.getByTestId('tx-explorer-link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not render without chainId', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} />);
      expect(screen.queryByTestId('tx-explorer-link')).not.toBeInTheDocument();
    });

    it('does not render without transactionHash', () => {
      render(<FeedbackEntry feedback={baseFeedback} chainId={11155111} />);
      expect(screen.queryByTestId('tx-explorer-link')).not.toBeInTheDocument();
    });

    it('hides in compact mode', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} chainId={11155111} compact />);
      expect(screen.queryByTestId('tx-explorer-link')).not.toBeInTheDocument();
    });

    it('works with Base Sepolia chain', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} chainId={84532} />);
      const link = screen.getByTestId('tx-explorer-link');
      expect(link).toHaveAttribute('href', 'https://sepolia.basescan.org/tx/0xabc123def456');
    });

    it('renders alongside feedback URI link', () => {
      render(<FeedbackEntry feedback={feedbackWithTxHash} chainId={11155111} />);
      expect(screen.getByTestId('feedback-uri-link')).toBeInTheDocument();
      expect(screen.getByTestId('tx-explorer-link')).toBeInTheDocument();
    });
  });
});
