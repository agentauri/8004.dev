import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Evaluation } from '@/types';
import { EvaluationDetail } from './evaluation-detail';

const mockEvaluation: Evaluation = {
  id: 'eval-123456789',
  agentId: '11155111:456',
  status: 'completed',
  scores: {
    safety: 95,
    capability: 78,
    reliability: 82,
    performance: 65,
  },
  benchmarks: [
    {
      name: 'Input Validation',
      category: 'safety',
      score: 92,
      maxScore: 100,
      details: 'Passed input validation tests.',
    },
    {
      name: 'Prompt Injection',
      category: 'safety',
      score: 88,
      maxScore: 100,
      details: 'Defended against injection attempts.',
    },
    {
      name: 'Task Completion',
      category: 'capability',
      score: 78,
      maxScore: 100,
      details: 'Completed benchmark tasks.',
    },
    {
      name: 'Response Time',
      category: 'performance',
      score: 65,
      maxScore: 100,
      details: 'Average response latency.',
    },
  ],
  createdAt: new Date('2024-01-15T10:30:00'),
  completedAt: new Date('2024-01-15T10:35:00'),
};

describe('EvaluationDetail', () => {
  describe('rendering', () => {
    it('renders the evaluation detail', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-detail')).toBeInTheDocument();
    });

    it('renders evaluation ID', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText(/eval-123456789/)).toBeInTheDocument();
    });

    it('renders agent ID', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText(/11155111:456/)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} className="custom-class" />);
      expect(screen.getByTestId('evaluation-detail')).toHaveClass('custom-class');
    });

    it('sets data-evaluation-id attribute', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-detail')).toHaveAttribute(
        'data-evaluation-id',
        'eval-123456789',
      );
    });
  });

  describe('header', () => {
    it('renders title', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText('Evaluation Results')).toBeInTheDocument();
    });

    it('renders status badge', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-status-badge')).toBeInTheDocument();
    });

    it('does not render close button when onClose not provided', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.queryByTestId('close-button')).not.toBeInTheDocument();
    });

    it('renders close button when onClose provided', () => {
      const onClose = vi.fn();
      render(<EvaluationDetail evaluation={mockEvaluation} onClose={onClose} />);
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
      const onClose = vi.fn();
      render(<EvaluationDetail evaluation={mockEvaluation} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('close-button'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('overall score', () => {
    it('shows overall score for completed evaluations', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('overall-score')).toBeInTheDocument();
    });

    it('calculates correct overall score', () => {
      // (95 + 78 + 82 + 65) / 4 = 80
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('overall-score')).toHaveTextContent('80');
    });

    it('renders evaluation scores component', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-scores')).toBeInTheDocument();
    });

    it('does not show overall score for pending evaluations', () => {
      const pendingEval = { ...mockEvaluation, status: 'pending' as const, completedAt: undefined };
      render(<EvaluationDetail evaluation={pendingEval} />);
      expect(screen.queryByTestId('overall-score')).not.toBeInTheDocument();
    });
  });

  describe('timeline', () => {
    it('shows Timeline section', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText('Timeline')).toBeInTheDocument();
    });

    it('shows created timestamp', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
    });

    it('shows completed timestamp for completed evaluations', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText(/Completed:/)).toBeInTheDocument();
    });

    it('shows running indicator for running evaluations', () => {
      const runningEval = { ...mockEvaluation, status: 'running' as const, completedAt: undefined };
      render(<EvaluationDetail evaluation={runningEval} />);
      expect(screen.getByText('Running...')).toBeInTheDocument();
    });

    it('shows Failed label for failed evaluations', () => {
      const failedEval = {
        ...mockEvaluation,
        status: 'failed' as const,
        completedAt: new Date('2024-01-15T10:35:00'),
      };
      render(<EvaluationDetail evaluation={failedEval} />);
      expect(screen.getByText(/Failed:/)).toBeInTheDocument();
    });
  });

  describe('benchmark results', () => {
    it('shows Benchmark Results section for completed evaluations', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByText('Benchmark Results')).toBeInTheDocument();
    });

    it('renders benchmark rows', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      const rows = screen.getAllByTestId('benchmark-row');
      expect(rows.length).toBe(4);
    });

    it('groups benchmarks by category', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      expect(screen.getByTestId('benchmark-category-safety')).toBeInTheDocument();
      expect(screen.getByTestId('benchmark-category-capability')).toBeInTheDocument();
      expect(screen.getByTestId('benchmark-category-performance')).toBeInTheDocument();
    });

    it('does not render empty categories', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      // Reliability category has no benchmarks in mockEvaluation
      expect(screen.queryByTestId('benchmark-category-reliability')).not.toBeInTheDocument();
    });

    it('shows empty state when no benchmarks', () => {
      const noBenchmarksEval = { ...mockEvaluation, benchmarks: [] };
      render(<EvaluationDetail evaluation={noBenchmarksEval} />);
      expect(screen.getByText('No detailed benchmark results available.')).toBeInTheDocument();
    });

    it('does not show benchmark section for pending evaluations', () => {
      const pendingEval = { ...mockEvaluation, status: 'pending' as const, completedAt: undefined };
      render(<EvaluationDetail evaluation={pendingEval} />);
      expect(screen.queryByText('Benchmark Results')).not.toBeInTheDocument();
    });
  });

  describe('status messages', () => {
    it('shows pending message', () => {
      const pendingEval = { ...mockEvaluation, status: 'pending' as const, completedAt: undefined };
      render(<EvaluationDetail evaluation={pendingEval} />);
      expect(
        screen.getByText('Evaluation is queued and will begin shortly...'),
      ).toBeInTheDocument();
    });

    it('shows running message', () => {
      const runningEval = { ...mockEvaluation, status: 'running' as const, completedAt: undefined };
      render(<EvaluationDetail evaluation={runningEval} />);
      expect(
        screen.getByText('Evaluation is in progress. Results will appear here when complete.'),
      ).toBeInTheDocument();
    });

    it('shows failed message', () => {
      const failedEval = { ...mockEvaluation, status: 'failed' as const, completedAt: undefined };
      render(<EvaluationDetail evaluation={failedEval} />);
      expect(
        screen.getByText('Evaluation failed. Please check the logs or try again.'),
      ).toBeInTheDocument();
    });
  });

  describe('score colors', () => {
    it('applies green color for high overall score', () => {
      const highScoreEval = {
        ...mockEvaluation,
        scores: { safety: 90, capability: 85, reliability: 88, performance: 82 },
      };
      render(<EvaluationDetail evaluation={highScoreEval} />);
      expect(screen.getByTestId('overall-score')).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('applies yellow color for medium overall score', () => {
      const mediumScoreEval = {
        ...mockEvaluation,
        scores: { safety: 70, capability: 60, reliability: 55, performance: 50 },
      };
      render(<EvaluationDetail evaluation={mediumScoreEval} />);
      expect(screen.getByTestId('overall-score')).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies red color for low overall score', () => {
      const lowScoreEval = {
        ...mockEvaluation,
        scores: { safety: 30, capability: 40, reliability: 35, performance: 25 },
      };
      render(<EvaluationDetail evaluation={lowScoreEval} />);
      expect(screen.getByTestId('overall-score')).toHaveClass('text-[var(--pixel-red-fire)]');
    });
  });

  describe('category labels', () => {
    it('displays Safety category label in benchmark section', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      const safetyCategory = screen.getByTestId('benchmark-category-safety');
      expect(within(safetyCategory).getByText('Safety')).toBeInTheDocument();
    });

    it('displays Capability category label in benchmark section', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      const capabilityCategory = screen.getByTestId('benchmark-category-capability');
      expect(within(capabilityCategory).getByText('Capability')).toBeInTheDocument();
    });

    it('displays Performance category label in benchmark section', () => {
      render(<EvaluationDetail evaluation={mockEvaluation} />);
      const performanceCategory = screen.getByTestId('benchmark-category-performance');
      expect(within(performanceCategory).getByText('Performance')).toBeInTheDocument();
    });
  });
});
