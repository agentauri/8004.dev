import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EvaluationScores } from './evaluation-scores';

const mockScores = {
  safety: 95,
  capability: 78,
  reliability: 82,
  performance: 65,
};

describe('EvaluationScores', () => {
  describe('rendering', () => {
    it('renders the evaluation scores container', () => {
      render(<EvaluationScores scores={mockScores} />);
      expect(screen.getByTestId('evaluation-scores')).toBeInTheDocument();
    });

    it('renders all four score gauges', () => {
      render(<EvaluationScores scores={mockScores} />);
      const gauges = screen.getAllByTestId('score-gauge');
      expect(gauges).toHaveLength(4);
    });

    it('renders correct labels for each category', () => {
      render(<EvaluationScores scores={mockScores} />);
      expect(screen.getByText('Safety')).toBeInTheDocument();
      expect(screen.getByText('Capability')).toBeInTheDocument();
      expect(screen.getByText('Reliability')).toBeInTheDocument();
      expect(screen.getByText('Performance')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EvaluationScores scores={mockScores} className="custom-class" />);
      expect(screen.getByTestId('evaluation-scores')).toHaveClass('custom-class');
    });
  });

  describe('score values', () => {
    it('displays correct score values', () => {
      render(<EvaluationScores scores={mockScores} />);
      const values = screen.getAllByTestId('score-value');
      expect(values[0]).toHaveTextContent('95');
      expect(values[1]).toHaveTextContent('78');
      expect(values[2]).toHaveTextContent('82');
      expect(values[3]).toHaveTextContent('65');
    });

    it('sets correct data-score attributes', () => {
      render(<EvaluationScores scores={mockScores} />);
      const gauges = screen.getAllByTestId('score-gauge');
      expect(gauges[0]).toHaveAttribute('data-score', '95');
      expect(gauges[1]).toHaveAttribute('data-score', '78');
      expect(gauges[2]).toHaveAttribute('data-score', '82');
      expect(gauges[3]).toHaveAttribute('data-score', '65');
    });
  });

  describe('layout variants', () => {
    it('uses grid layout by default', () => {
      render(<EvaluationScores scores={mockScores} />);
      const container = screen.getByTestId('evaluation-scores');
      expect(container).toHaveAttribute('data-layout', 'grid');
      expect(container).toHaveClass('grid');
      expect(container).toHaveClass('grid-cols-2');
    });

    it('applies horizontal layout when specified', () => {
      render(<EvaluationScores scores={mockScores} layout="horizontal" />);
      const container = screen.getByTestId('evaluation-scores');
      expect(container).toHaveAttribute('data-layout', 'horizontal');
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('flex-row');
    });

    it('applies overflow-x-auto for horizontal layout', () => {
      render(<EvaluationScores scores={mockScores} layout="horizontal" />);
      expect(screen.getByTestId('evaluation-scores')).toHaveClass('overflow-x-auto');
    });

    it('applies min-width to gauges in horizontal layout', () => {
      render(<EvaluationScores scores={mockScores} layout="horizontal" />);
      const gauges = screen.getAllByTestId('score-gauge');
      for (const gauge of gauges) {
        expect(gauge).toHaveClass('min-w-[120px]');
        expect(gauge).toHaveClass('flex-shrink-0');
      }
    });

    it('does not apply min-width to gauges in grid layout', () => {
      render(<EvaluationScores scores={mockScores} layout="grid" />);
      const gauges = screen.getAllByTestId('score-gauge');
      for (const gauge of gauges) {
        expect(gauge).not.toHaveClass('min-w-[120px]');
      }
    });
  });

  describe('size variants', () => {
    it('uses md size by default', () => {
      render(<EvaluationScores scores={mockScores} />);
      const gauges = screen.getAllByTestId('score-gauge');
      // Check one gauge has md size classes
      expect(gauges[0]).toHaveClass('gap-1.5');
    });

    it('applies sm size when specified', () => {
      render(<EvaluationScores scores={mockScores} size="sm" />);
      const gauges = screen.getAllByTestId('score-gauge');
      // Check one gauge has sm size classes
      expect(gauges[0]).toHaveClass('gap-1');
    });
  });

  describe('edge cases', () => {
    it('handles zero scores', () => {
      const zeroScores = { safety: 0, capability: 0, reliability: 0, performance: 0 };
      render(<EvaluationScores scores={zeroScores} />);
      const values = screen.getAllByTestId('score-value');
      for (const value of values) {
        expect(value).toHaveTextContent('0');
      }
    });

    it('handles max scores', () => {
      const maxScores = { safety: 100, capability: 100, reliability: 100, performance: 100 };
      render(<EvaluationScores scores={maxScores} />);
      const values = screen.getAllByTestId('score-value');
      for (const value of values) {
        expect(value).toHaveTextContent('100');
      }
    });

    it('handles mixed score levels', () => {
      const mixedScores = { safety: 90, capability: 60, reliability: 30, performance: 80 };
      render(<EvaluationScores scores={mixedScores} />);
      const gauges = screen.getAllByTestId('score-gauge');
      expect(gauges[0]).toHaveAttribute('data-level', 'high'); // 90
      expect(gauges[1]).toHaveAttribute('data-level', 'medium'); // 60
      expect(gauges[2]).toHaveAttribute('data-level', 'low'); // 30
      expect(gauges[3]).toHaveAttribute('data-level', 'high'); // 80
    });
  });

  describe('responsive behavior', () => {
    it('applies responsive gap classes for grid layout', () => {
      render(<EvaluationScores scores={mockScores} layout="grid" />);
      const container = screen.getByTestId('evaluation-scores');
      expect(container).toHaveClass('gap-3');
      expect(container).toHaveClass('md:gap-4');
    });
  });
});
