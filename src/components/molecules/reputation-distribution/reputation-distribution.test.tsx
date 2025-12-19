import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReputationDistribution } from './reputation-distribution';

const defaultProps = {
  averageScore: 75,
  count: 42,
  distribution: {
    low: 5,
    medium: 10,
    high: 27,
  },
};

describe('ReputationDistribution', () => {
  describe('basic rendering', () => {
    it('renders component', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('reputation-distribution')).toBeInTheDocument();
    });

    it('displays the average score', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('trust-score')).toBeInTheDocument();
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '75');
    });

    it('displays the rating count', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('rating-count')).toHaveTextContent('42');
    });

    it('displays Ratings label', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByText('Ratings')).toBeInTheDocument();
    });

    it('renders distribution bar', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('distribution-bar')).toBeInTheDocument();
    });
  });

  describe('detailed breakdown', () => {
    it('shows details by default', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('detail-low')).toBeInTheDocument();
      expect(screen.getByTestId('detail-medium')).toBeInTheDocument();
      expect(screen.getByTestId('detail-high')).toBeInTheDocument();
    });

    it('displays correct distribution values in details', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('detail-low')).toHaveTextContent('5');
      expect(screen.getByTestId('detail-medium')).toHaveTextContent('10');
      expect(screen.getByTestId('detail-high')).toHaveTextContent('27');
    });

    it('hides details when showDetails is false', () => {
      render(<ReputationDistribution {...defaultProps} showDetails={false} />);
      expect(screen.queryByTestId('detail-low')).not.toBeInTheDocument();
      expect(screen.queryByTestId('detail-medium')).not.toBeInTheDocument();
      expect(screen.queryByTestId('detail-high')).not.toBeInTheDocument();
    });

    it('shows range labels in details', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByText('Low (0-39)')).toBeInTheDocument();
      expect(screen.getByText('Med (40-69)')).toBeInTheDocument();
      expect(screen.getByText('High (70-100)')).toBeInTheDocument();
    });
  });

  describe('score variants', () => {
    it('displays high score correctly', () => {
      render(<ReputationDistribution {...defaultProps} averageScore={90} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-level', 'high');
    });

    it('displays medium score correctly', () => {
      render(<ReputationDistribution {...defaultProps} averageScore={55} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-level', 'medium');
    });

    it('displays low score correctly', () => {
      render(<ReputationDistribution {...defaultProps} averageScore={25} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-level', 'low');
    });
  });

  describe('edge cases', () => {
    it('handles zero count', () => {
      render(
        <ReputationDistribution
          averageScore={0}
          count={0}
          distribution={{ low: 0, medium: 0, high: 0 }}
        />,
      );
      expect(screen.getByTestId('rating-count')).toHaveTextContent('0');
    });

    it('handles large numbers', () => {
      render(
        <ReputationDistribution
          averageScore={85}
          count={1234}
          distribution={{ low: 100, medium: 400, high: 734 }}
        />,
      );
      expect(screen.getByTestId('rating-count')).toHaveTextContent('1234');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<ReputationDistribution {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('reputation-distribution')).toHaveClass('custom-class');
    });
  });

  describe('styling', () => {
    it('has correct background color', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('reputation-distribution')).toHaveClass(
        'bg-[var(--pixel-gray-800)]',
      );
    });

    it('has border styling', () => {
      render(<ReputationDistribution {...defaultProps} />);
      expect(screen.getByTestId('reputation-distribution')).toHaveClass(
        'border-2',
        'border-[var(--pixel-gray-700)]',
      );
    });
  });
});
