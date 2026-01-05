import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TrendingAgent } from '@/types/trending';
import { TrendingAgentCard } from './trending-agent-card';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockAgent: TrendingAgent = {
  id: '11155111:42',
  name: 'CodeReview Pro',
  chainId: 11155111,
  currentScore: 92,
  previousScore: 78,
  scoreChange: 14,
  percentageChange: 17.9,
  trend: 'up',
  hasMcp: true,
  hasA2a: true,
  x402Support: false,
  isActive: true,
};

describe('TrendingAgentCard', () => {
  describe('rendering', () => {
    it('renders with agent data', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByTestId('trending-agent-card')).toBeInTheDocument();
      expect(screen.getByText('CodeReview Pro')).toBeInTheDocument();
    });

    it('renders rank badge', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByLabelText('Rank 1')).toBeInTheDocument();
    });

    it('renders current score', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('92')).toBeInTheDocument();
      expect(screen.getByText('score')).toBeInTheDocument();
    });

    it('renders score change with positive sign', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('+14 pts')).toBeInTheDocument();
    });

    it('links to agent detail page', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      const link = screen.getByTestId('trending-agent-card');
      expect(link).toHaveAttribute('href', '/agent/11155111:42');
    });

    it('applies custom className', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} className="custom-class" />);
      expect(screen.getByTestId('trending-agent-card')).toHaveClass('custom-class');
    });
  });

  describe('rank styling', () => {
    it('applies gold styling for rank 1', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      const rankBadge = screen.getByLabelText('Rank 1');
      expect(rankBadge).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies silver styling for rank 2', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={2} />);
      const rankBadge = screen.getByLabelText('Rank 2');
      expect(rankBadge).toHaveClass('text-[var(--pixel-gray-200)]');
    });

    it('applies bronze styling for rank 3', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={3} />);
      const rankBadge = screen.getByLabelText('Rank 3');
      expect(rankBadge).toHaveClass('text-[#CD7F32]');
    });

    it('applies default styling for rank 4+', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={5} />);
      const rankBadge = screen.getByLabelText('Rank 5');
      expect(rankBadge).toHaveClass('text-[var(--pixel-gray-400)]');
    });
  });

  describe('trend indicator', () => {
    it('renders up trend with green color', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      const trendContainer = screen.getByText('+14 pts').parentElement;
      expect(trendContainer).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('renders down trend with red color', () => {
      const downAgent = { ...mockAgent, trend: 'down' as const, scoreChange: -5 };
      render(<TrendingAgentCard agent={downAgent} rank={1} />);
      const trendContainer = screen.getByText('-5 pts').parentElement;
      expect(trendContainer).toHaveClass('text-[var(--pixel-red-fire)]');
    });

    it('formats negative score change correctly', () => {
      const downAgent = { ...mockAgent, trend: 'down' as const, scoreChange: -5 };
      render(<TrendingAgentCard agent={downAgent} rank={1} />);
      expect(screen.getByText('-5 pts')).toBeInTheDocument();
    });
  });

  describe('chain badge', () => {
    it('renders chain badge for supported chain', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('SEPOLIA')).toBeInTheDocument();
    });

    it('renders Base chain badge', () => {
      const baseAgent = { ...mockAgent, chainId: 84532 };
      render(<TrendingAgentCard agent={baseAgent} rank={1} />);
      expect(screen.getByText('BASE')).toBeInTheDocument();
    });

    it('renders Polygon chain badge', () => {
      const polygonAgent = { ...mockAgent, chainId: 80002 };
      render(<TrendingAgentCard agent={polygonAgent} rank={1} />);
      expect(screen.getByText('POLYGON')).toBeInTheDocument();
    });

    it('does not render chain badge for unsupported chain', () => {
      const unsupportedAgent = { ...mockAgent, chainId: 99999 };
      render(<TrendingAgentCard agent={unsupportedAgent} rank={1} />);
      expect(screen.queryByTestId('chain-badge')).not.toBeInTheDocument();
    });
  });

  describe('active badge', () => {
    it('renders active badge when agent is active', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('does not render active badge when agent is inactive', () => {
      const inactiveAgent = { ...mockAgent, isActive: false };
      render(<TrendingAgentCard agent={inactiveAgent} rank={1} />);
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });
  });

  describe('protocol badges', () => {
    it('renders MCP badge when hasMcp is true', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('MCP')).toBeInTheDocument();
    });

    it('renders A2A badge when hasA2a is true', () => {
      render(<TrendingAgentCard agent={mockAgent} rank={1} />);
      expect(screen.getByText('A2A')).toBeInTheDocument();
    });

    it('renders x402 badge when x402Support is true', () => {
      const x402Agent = { ...mockAgent, x402Support: true };
      render(<TrendingAgentCard agent={x402Agent} rank={1} />);
      expect(screen.getByText('x402')).toBeInTheDocument();
    });

    it('does not render protocol badges when none are supported', () => {
      const noProtocolAgent = { ...mockAgent, hasMcp: false, hasA2a: false, x402Support: false };
      render(<TrendingAgentCard agent={noProtocolAgent} rank={1} />);
      expect(screen.queryByText('MCP')).not.toBeInTheDocument();
      expect(screen.queryByText('A2A')).not.toBeInTheDocument();
      expect(screen.queryByText('x402')).not.toBeInTheDocument();
    });
  });
});
