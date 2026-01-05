import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedbackStats, GlobalFeedbackFilters } from '@/types/feedback';
import { FeedbackFilters } from './feedback-filters';

const defaultFilters: GlobalFeedbackFilters = {
  chains: [],
  scoreCategory: undefined,
};

const mockStats: FeedbackStats = {
  total: 100,
  positive: 60,
  neutral: 25,
  negative: 15,
};

describe('FeedbackFilters', () => {
  describe('rendering', () => {
    it('renders the filters container', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByTestId('feedback-filters')).toBeInTheDocument();
    });

    it('renders score category options', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Positive')).toBeInTheDocument();
      expect(screen.getByText('Neutral')).toBeInTheDocument();
      expect(screen.getByText('Negative')).toBeInTheDocument();
    });

    it('renders chain selector', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('Chains')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('feedback-filters')).toHaveClass('custom-class');
    });
  });

  describe('stats display', () => {
    it('renders stats when provided', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={mockStats}
        />,
      );
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('total')).toBeInTheDocument();
    });

    it('renders breakdown counts', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={mockStats}
        />,
      );
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('shows loading indicator when isLoading', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={defaultFilters}
          onFiltersChange={onFiltersChange}
          stats={mockStats}
          isLoading
        />,
      );
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('does not render stats when not provided', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.queryByText('total')).not.toBeInTheDocument();
    });
  });

  describe('category selection', () => {
    it('highlights selected category', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={{ ...defaultFilters, scoreCategory: 'positive' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      expect(screen.getByText('Positive')).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onFiltersChange when category is clicked', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      fireEvent.click(screen.getByText('Positive'));
      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        scoreCategory: 'positive',
      });
    });

    it('clears category when All is clicked', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={{ ...defaultFilters, scoreCategory: 'positive' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      fireEvent.click(screen.getByText('All'));
      expect(onFiltersChange).toHaveBeenCalledWith({ ...defaultFilters, scoreCategory: undefined });
    });
  });

  describe('clear filters', () => {
    it('shows clear button when filters are active', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={{ ...defaultFilters, scoreCategory: 'positive' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('hides clear button when no filters are active', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
    });

    it('resets filters when clear is clicked', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={{ chains: [11155111], scoreCategory: 'positive' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      fireEvent.click(screen.getByText('Clear Filters'));
      expect(onFiltersChange).toHaveBeenCalledWith({
        chains: [],
        scoreCategory: undefined,
      });
    });
  });

  describe('mobile toggle', () => {
    it('renders mobile filter toggle button', () => {
      const onFiltersChange = vi.fn();
      render(<FeedbackFilters filters={defaultFilters} onFiltersChange={onFiltersChange} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('shows active badge when filters are active', () => {
      const onFiltersChange = vi.fn();
      render(
        <FeedbackFilters
          filters={{ ...defaultFilters, scoreCategory: 'positive' }}
          onFiltersChange={onFiltersChange}
        />,
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });
});
