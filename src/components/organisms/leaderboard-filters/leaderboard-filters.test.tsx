import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LeaderboardFiltersState } from '@/types/leaderboard';
import { LeaderboardFilters } from './leaderboard-filters';

const defaultFilters: LeaderboardFiltersState = {
  chains: [],
  protocols: [],
  period: 'all',
};

describe('LeaderboardFilters', () => {
  describe('rendering', () => {
    it('renders the filters container', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByTestId('leaderboard-filters')).toBeInTheDocument();
    });

    it('renders period options', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('All Time')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 24 Hours')).toBeInTheDocument();
    });

    it('renders chain selector', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('Chains')).toBeInTheDocument();
    });

    it('renders protocol filter', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('Protocols')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('leaderboard-filters')).toHaveClass('custom-class');
    });
  });

  describe('total count', () => {
    it('renders total count when provided', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          totalCount={150}
        />,
      );
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('agents')).toBeInTheDocument();
    });

    it('shows loading indicator when isLoading', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          totalCount={150}
          isLoading
        />,
      );
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('does not render count when not provided', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.queryByText('agents')).not.toBeInTheDocument();
    });
  });

  describe('period selection', () => {
    it('highlights selected period', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={{ ...defaultFilters, period: '7d' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      expect(screen.getByText('Last 7 Days')).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onFiltersChange when period is clicked', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      fireEvent.click(screen.getByText('Last 30 Days'));
      expect(onFiltersChange).toHaveBeenCalledWith({ ...defaultFilters, period: '30d' });
    });
  });

  describe('clear filters', () => {
    it('shows clear button when filters are active', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={{ ...defaultFilters, period: '7d' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('hides clear button when no filters are active', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
    });

    it('resets filters when clear is clicked', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={{ chains: [11155111], protocols: ['mcp'], period: '7d' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      fireEvent.click(screen.getByText('Clear Filters'));
      expect(onFiltersChange).toHaveBeenCalledWith({
        chains: [],
        protocols: [],
        period: 'all',
      });
    });
  });

  describe('mobile toggle', () => {
    it('renders mobile filter toggle button', () => {
      const onFiltersChange = vi.fn();
      render(<LeaderboardFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('shows active badge when filters are active', () => {
      const onFiltersChange = vi.fn();
      render(
        <LeaderboardFilters
          filters={{ ...defaultFilters, period: '7d' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });
});
