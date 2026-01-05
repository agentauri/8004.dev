import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LeaderboardEntry } from '@/types/leaderboard';
import { LeaderboardRow } from './leaderboard-row';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockEntry: LeaderboardEntry = {
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
};

describe('LeaderboardRow', () => {
  describe('rendering', () => {
    it('renders with entry data', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByTestId('leaderboard-row')).toBeInTheDocument();
      expect(screen.getByText('CodeReview Pro')).toBeInTheDocument();
    });

    it('renders rank badge', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByLabelText('Rank 1')).toBeInTheDocument();
    });

    it('renders score', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('95')).toBeInTheDocument();
    });

    it('renders feedback count', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('156')).toBeInTheDocument();
      expect(screen.getByText('feedbacks')).toBeInTheDocument();
    });

    it('links to agent detail page', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      const link = screen.getByTestId('leaderboard-row');
      expect(link).toHaveAttribute('href', '/agent/11155111:42');
    });

    it('sets data-rank attribute', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByTestId('leaderboard-row')).toHaveAttribute('data-rank', '1');
    });

    it('applies custom className', () => {
      render(<LeaderboardRow entry={mockEntry} className="custom-class" />);
      expect(screen.getByTestId('leaderboard-row')).toHaveClass('custom-class');
    });
  });

  describe('rank styling', () => {
    it('applies gold styling for rank 1', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      const rankBadge = screen.getByLabelText('Rank 1');
      expect(rankBadge).toHaveClass('text-[var(--pixel-gold-coin)]');
      expect(rankBadge).toHaveClass('bg-[var(--pixel-gold-coin)]/20');
    });

    it('applies silver styling for rank 2', () => {
      const entry = { ...mockEntry, rank: 2 };
      render(<LeaderboardRow entry={entry} />);
      const rankBadge = screen.getByLabelText('Rank 2');
      expect(rankBadge).toHaveClass('text-[var(--pixel-gray-200)]');
    });

    it('applies bronze styling for rank 3', () => {
      const entry = { ...mockEntry, rank: 3 };
      render(<LeaderboardRow entry={entry} />);
      const rankBadge = screen.getByLabelText('Rank 3');
      expect(rankBadge).toHaveClass('text-[#CD7F32]');
    });

    it('applies default styling for rank 4+', () => {
      const entry = { ...mockEntry, rank: 5 };
      render(<LeaderboardRow entry={entry} />);
      const rankBadge = screen.getByLabelText('Rank 5');
      expect(rankBadge).toHaveClass('text-[var(--pixel-gray-400)]');
    });
  });

  describe('trend indicator', () => {
    it('renders up trend with green color', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('up')).toBeInTheDocument();
    });

    it('renders down trend with red color', () => {
      const entry = { ...mockEntry, trend: 'down' as const };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.getByText('down')).toBeInTheDocument();
    });

    it('renders stable trend with dash', () => {
      const entry = { ...mockEntry, trend: 'stable' as const };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });

  describe('chain badge', () => {
    it('renders chain badge for Sepolia', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('SEPOLIA')).toBeInTheDocument();
    });

    it('renders chain badge for Base Sepolia', () => {
      const entry = { ...mockEntry, chainId: 84532 };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.getByText('BASE')).toBeInTheDocument();
    });

    it('renders chain badge for Polygon Amoy', () => {
      const entry = { ...mockEntry, chainId: 80002 };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.getByText('POLYGON')).toBeInTheDocument();
    });

    it('does not render chain badge for unsupported chain', () => {
      const entry = { ...mockEntry, chainId: 99999 };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.queryByTestId('chain-badge')).not.toBeInTheDocument();
    });
  });

  describe('active badge', () => {
    it('renders active badge when agent is active', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('does not render active badge when agent is inactive', () => {
      const entry = { ...mockEntry, active: false };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });
  });

  describe('protocol badges', () => {
    it('renders MCP badge when hasMcp is true', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('MCP')).toBeInTheDocument();
    });

    it('renders A2A badge when hasA2a is true', () => {
      render(<LeaderboardRow entry={mockEntry} />);
      expect(screen.getByText('A2A')).toBeInTheDocument();
    });

    it('renders x402 badge when x402Support is true', () => {
      const entry = { ...mockEntry, x402Support: true };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.getByText('x402')).toBeInTheDocument();
    });

    it('does not render protocol badges when none are supported', () => {
      const entry = { ...mockEntry, hasMcp: false, hasA2a: false, x402Support: false };
      render(<LeaderboardRow entry={entry} />);
      expect(screen.queryByText('MCP')).not.toBeInTheDocument();
      expect(screen.queryByText('A2A')).not.toBeInTheDocument();
      expect(screen.queryByText('x402')).not.toBeInTheDocument();
    });
  });
});
