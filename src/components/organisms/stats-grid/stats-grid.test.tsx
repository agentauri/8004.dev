import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type PlatformStats, StatsGrid } from './stats-grid';

const mockStats: PlatformStats = {
  totalAgents: 4770,
  withMetadata: 2704,
  activeAgents: 946,
  chainBreakdown: [
    { chainId: 11155111, name: 'Sepolia', total: 3167, withMetadata: 1989, active: 334 },
    { chainId: 84532, name: 'Base', total: 1587, withMetadata: 705, active: 607 },
    { chainId: 80002, name: 'Polygon', total: 16, withMetadata: 10, active: 5 },
  ],
};

describe('StatsGrid', () => {
  describe('rendering with data', () => {
    it('renders stats grid with correct state', () => {
      render(<StatsGrid stats={mockStats} />);

      expect(screen.getByTestId('stats-grid')).toHaveAttribute('data-state', 'success');
    });

    it('renders total agents card', () => {
      render(<StatsGrid stats={mockStats} />);

      expect(screen.getByText('Total Agents')).toBeInTheDocument();
      expect(screen.getByText('4,770')).toBeInTheDocument();
      expect(screen.getByText('946 active')).toBeInTheDocument();
    });

    it('renders all chain cards', () => {
      render(<StatsGrid stats={mockStats} />);

      expect(screen.getByText('Sepolia')).toBeInTheDocument();
      expect(screen.getByText('3,167')).toBeInTheDocument();

      expect(screen.getByText('Base')).toBeInTheDocument();
      expect(screen.getByText('1,587')).toBeInTheDocument();

      expect(screen.getByText('Polygon')).toBeInTheDocument();
      expect(screen.getByText('16')).toBeInTheDocument();
    });

    it('renders 4 stat cards total', () => {
      render(<StatsGrid stats={mockStats} />);

      const cards = screen.getAllByTestId('stat-card');
      expect(cards).toHaveLength(4);
    });
  });

  describe('loading state', () => {
    it('renders loading state when isLoading is true', () => {
      render(<StatsGrid isLoading />);

      expect(screen.getByTestId('stats-grid')).toHaveAttribute('data-state', 'loading');
    });

    it('renders loading skeleton cards', () => {
      render(<StatsGrid isLoading />);

      const cards = screen.getAllByTestId('stat-card');
      expect(cards).toHaveLength(4);
      for (const card of cards) {
        expect(card).toHaveAttribute('data-loading', 'true');
      }
    });

    it('renders loading state when stats is undefined', () => {
      render(<StatsGrid stats={undefined} />);

      expect(screen.getByTestId('stats-grid')).toHaveAttribute('data-state', 'loading');
    });
  });

  describe('error state', () => {
    it('renders error state', () => {
      render(<StatsGrid error="Failed to load" />);

      expect(screen.getByTestId('stats-grid')).toHaveAttribute('data-state', 'error');
    });

    it('displays error message', () => {
      render(<StatsGrid error="Failed to load statistics" />);

      expect(screen.getByText('Failed to load statistics')).toBeInTheDocument();
    });

    it('does not render stat cards on error', () => {
      render(<StatsGrid error="Error" />);

      expect(screen.queryAllByTestId('stat-card')).toHaveLength(0);
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<StatsGrid stats={mockStats} className="custom-class" />);

      expect(screen.getByTestId('stats-grid')).toHaveClass('custom-class');
    });

    it('applies custom className when loading', () => {
      render(<StatsGrid isLoading className="custom-class" />);

      expect(screen.getByTestId('stats-grid')).toHaveClass('custom-class');
    });

    it('applies custom className on error', () => {
      render(<StatsGrid error="Error" className="custom-class" />);

      expect(screen.getByTestId('stats-grid')).toHaveClass('custom-class');
    });
  });

  describe('single chain', () => {
    it('renders correctly with single chain', () => {
      const singleChainStats: PlatformStats = {
        totalAgents: 200,
        withMetadata: 100,
        activeAgents: 75,
        chainBreakdown: [
          { chainId: 11155111, name: 'Sepolia', total: 200, withMetadata: 100, active: 75 },
        ],
      };

      render(<StatsGrid stats={singleChainStats} />);

      const cards = screen.getAllByTestId('stat-card');
      expect(cards).toHaveLength(2); // Total + 1 chain
    });
  });
});
