import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GlobalFeedback } from '@/types/feedback';
import { FeedbackCardGlobal } from './feedback-card-global';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockFeedback: GlobalFeedback = {
  id: 'fb_1',
  score: 92,
  tags: ['reliable', 'fast'],
  context: 'Excellent code review, caught several edge cases I missed.',
  submitter: '0x1234567890abcdef1234567890abcdef12345678',
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  transactionHash: '0xabc123',
  agentId: '11155111:42',
  agentName: 'CodeReview Pro',
  agentChainId: 11155111,
};

describe('FeedbackCardGlobal', () => {
  describe('rendering', () => {
    it('renders with feedback data', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByTestId('feedback-card-global')).toBeInTheDocument();
    });

    it('renders score', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByText('92')).toBeInTheDocument();
    });

    it('renders agent name as link', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      const agentLink = screen.getByText('CodeReview Pro');
      expect(agentLink).toBeInTheDocument();
      expect(agentLink.closest('a')).toHaveAttribute('href', '/agent/11155111:42');
    });

    it('renders context text', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(
        screen.getByText('Excellent code review, caught several edge cases I missed.'),
      ).toBeInTheDocument();
    });

    it('renders submitter address truncated', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} className="custom-class" />);
      expect(screen.getByTestId('feedback-card-global')).toHaveClass('custom-class');
    });
  });

  describe('score styling', () => {
    it('applies positive styling for score >= 70', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      const scoreText = screen.getByText('92');
      expect(scoreText).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('applies neutral styling for score 40-69', () => {
      const neutralFeedback = { ...mockFeedback, score: 55 };
      render(<FeedbackCardGlobal feedback={neutralFeedback} />);
      const scoreText = screen.getByText('55');
      expect(scoreText).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies negative styling for score < 40', () => {
      const negativeFeedback = { ...mockFeedback, score: 25 };
      render(<FeedbackCardGlobal feedback={negativeFeedback} />);
      const scoreText = screen.getByText('25');
      expect(scoreText).toHaveClass('text-[var(--pixel-red-fire)]');
    });
  });

  describe('tags', () => {
    it('renders all tags', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByText('reliable')).toBeInTheDocument();
      expect(screen.getByText('fast')).toBeInTheDocument();
    });

    it('does not render tags section when empty', () => {
      const noTagsFeedback = { ...mockFeedback, tags: [] };
      render(<FeedbackCardGlobal feedback={noTagsFeedback} />);
      expect(screen.queryByText('reliable')).not.toBeInTheDocument();
    });
  });

  describe('chain badge', () => {
    it('renders Sepolia chain badge', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByText('SEPOLIA')).toBeInTheDocument();
    });

    it('renders Base Sepolia chain badge', () => {
      const baseFeedback = { ...mockFeedback, agentChainId: 84532 };
      render(<FeedbackCardGlobal feedback={baseFeedback} />);
      expect(screen.getByText('BASE')).toBeInTheDocument();
    });

    it('renders Polygon Amoy chain badge', () => {
      const polygonFeedback = { ...mockFeedback, agentChainId: 80002 };
      render(<FeedbackCardGlobal feedback={polygonFeedback} />);
      expect(screen.getByText('POLYGON')).toBeInTheDocument();
    });

    it('does not render chain badge for unsupported chain', () => {
      const unsupportedFeedback = { ...mockFeedback, agentChainId: 99999 };
      render(<FeedbackCardGlobal feedback={unsupportedFeedback} />);
      expect(screen.queryByTestId('chain-badge')).not.toBeInTheDocument();
    });
  });

  describe('timestamp', () => {
    it('renders relative timestamp', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByText('2h ago')).toBeInTheDocument();
    });

    it('renders "Just now" for recent feedback', () => {
      const recentFeedback = { ...mockFeedback, timestamp: new Date().toISOString() };
      render(<FeedbackCardGlobal feedback={recentFeedback} />);
      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('renders days ago for older feedback', () => {
      const oldFeedback = {
        ...mockFeedback,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
      render(<FeedbackCardGlobal feedback={oldFeedback} />);
      expect(screen.getByText('3d ago')).toBeInTheDocument();
    });
  });

  describe('transaction link', () => {
    it('renders transaction link when hash is provided', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      const txLink = screen.getByText('View tx');
      expect(txLink).toHaveAttribute('href', 'https://sepolia.etherscan.io/tx/0xabc123');
      expect(txLink).toHaveAttribute('target', '_blank');
      expect(txLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not render transaction link when hash is undefined', () => {
      const noTxFeedback = { ...mockFeedback, transactionHash: undefined };
      render(<FeedbackCardGlobal feedback={noTxFeedback} />);
      expect(screen.queryByText('View tx')).not.toBeInTheDocument();
    });
  });

  describe('context text', () => {
    it('renders context when provided', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(
        screen.getByText('Excellent code review, caught several edge cases I missed.'),
      ).toBeInTheDocument();
    });

    it('does not render context section when undefined', () => {
      const noContextFeedback = { ...mockFeedback, context: undefined };
      render(<FeedbackCardGlobal feedback={noContextFeedback} />);
      expect(
        screen.queryByText('Excellent code review, caught several edge cases I missed.'),
      ).not.toBeInTheDocument();
    });
  });

  describe('copy button', () => {
    it('renders copy button for submitter address', () => {
      render(<FeedbackCardGlobal feedback={mockFeedback} />);
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });
  });
});
