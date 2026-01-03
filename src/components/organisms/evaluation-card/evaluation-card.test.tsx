import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Evaluation } from '@/types';
import { EvaluationCard } from './evaluation-card';

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
  benchmarks: [],
  createdAt: new Date('2024-01-15T10:30:00'),
  completedAt: new Date('2024-01-15T10:35:00'),
};

describe('EvaluationCard', () => {
  describe('rendering', () => {
    it('renders the evaluation card', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-card')).toBeInTheDocument();
    });

    it('renders evaluation ID (truncated)', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByText('Evaluation #eval-123')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EvaluationCard evaluation={mockEvaluation} className="custom-class" />);
      expect(screen.getByTestId('evaluation-card')).toHaveClass('custom-class');
    });

    it('sets data-evaluation-id attribute', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-card')).toHaveAttribute(
        'data-evaluation-id',
        'eval-123456789',
      );
    });

    it('sets data-status attribute', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-card')).toHaveAttribute('data-status', 'completed');
    });
  });

  describe('status badge', () => {
    it('renders status badge', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-status-badge')).toBeInTheDocument();
    });

    it('shows correct status', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveTextContent('COMPLETED');
    });
  });

  describe('agent link', () => {
    it('does not show agent link by default', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.queryByText(/Agent:/)).not.toBeInTheDocument();
    });

    it('shows agent link when showAgent is true', () => {
      render(<EvaluationCard evaluation={mockEvaluation} showAgent />);
      expect(screen.getByText('Agent: 11155111:456')).toBeInTheDocument();
    });

    it('agent link has correct href', () => {
      render(<EvaluationCard evaluation={mockEvaluation} showAgent />);
      const link = screen.getByText('Agent: 11155111:456');
      expect(link).toHaveAttribute('href', '/agent/11155111:456');
    });
  });

  describe('completed evaluation', () => {
    it('shows overall score', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('overall-score')).toBeInTheDocument();
    });

    it('calculates correct overall score', () => {
      // (95 + 78 + 82 + 65) / 4 = 80
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('overall-score')).toHaveTextContent('80');
    });

    it('renders evaluation scores component', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-scores')).toBeInTheDocument();
    });

    it('applies green color for high overall score', () => {
      const highScoreEval = {
        ...mockEvaluation,
        scores: { safety: 90, capability: 85, reliability: 88, performance: 82 },
      };
      render(<EvaluationCard evaluation={highScoreEval} />);
      expect(screen.getByTestId('overall-score')).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('applies yellow color for medium overall score', () => {
      const mediumScoreEval = {
        ...mockEvaluation,
        scores: { safety: 70, capability: 60, reliability: 55, performance: 50 },
      };
      render(<EvaluationCard evaluation={mediumScoreEval} />);
      expect(screen.getByTestId('overall-score')).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies red color for low overall score', () => {
      const lowScoreEval = {
        ...mockEvaluation,
        scores: { safety: 30, capability: 40, reliability: 35, performance: 25 },
      };
      render(<EvaluationCard evaluation={lowScoreEval} />);
      expect(screen.getByTestId('overall-score')).toHaveClass('text-[var(--pixel-red-fire)]');
    });
  });

  describe('pending evaluation', () => {
    const pendingEval = {
      ...mockEvaluation,
      status: 'pending' as const,
      completedAt: undefined,
    };

    it('does not show overall score', () => {
      render(<EvaluationCard evaluation={pendingEval} />);
      expect(screen.queryByTestId('overall-score')).not.toBeInTheDocument();
    });

    it('shows pending message', () => {
      render(<EvaluationCard evaluation={pendingEval} />);
      expect(screen.getByText('Evaluation queued...')).toBeInTheDocument();
    });

    it('does not show evaluation scores', () => {
      render(<EvaluationCard evaluation={pendingEval} />);
      expect(screen.queryByTestId('evaluation-scores')).not.toBeInTheDocument();
    });
  });

  describe('running evaluation', () => {
    const runningEval = {
      ...mockEvaluation,
      status: 'running' as const,
      completedAt: undefined,
    };

    it('shows running message', () => {
      render(<EvaluationCard evaluation={runningEval} />);
      expect(screen.getByText('Evaluation in progress...')).toBeInTheDocument();
    });
  });

  describe('failed evaluation', () => {
    const failedEval = {
      ...mockEvaluation,
      status: 'failed' as const,
      completedAt: undefined,
    };

    it('shows failed message', () => {
      render(<EvaluationCard evaluation={failedEval} />);
      expect(screen.getByText('Evaluation failed.')).toBeInTheDocument();
    });
  });

  describe('timestamps', () => {
    it('shows created timestamp', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByText(/Created:/)).toBeInTheDocument();
    });

    it('shows completed timestamp for completed evaluations', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByText(/Completed:/)).toBeInTheDocument();
    });

    it('does not show completed timestamp when not completed', () => {
      const pendingEval = { ...mockEvaluation, status: 'pending' as const, completedAt: undefined };
      render(<EvaluationCard evaluation={pendingEval} />);
      expect(screen.queryByText(/Completed:/)).not.toBeInTheDocument();
    });
  });

  describe('onClick behavior', () => {
    it('renders as div with button role when onClick is provided', () => {
      const onClick = vi.fn();
      render(<EvaluationCard evaluation={mockEvaluation} onClick={onClick} />);
      const card = screen.getByTestId('evaluation-card');
      expect(card.tagName).toBe('DIV');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('calls onClick when clicked', () => {
      const onClick = vi.fn();
      render(<EvaluationCard evaluation={mockEvaluation} onClick={onClick} />);
      fireEvent.click(screen.getByTestId('evaluation-card'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Enter key', () => {
      const onClick = vi.fn();
      render(<EvaluationCard evaluation={mockEvaluation} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('evaluation-card'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Space key', () => {
      const onClick = vi.fn();
      render(<EvaluationCard evaluation={mockEvaluation} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('evaluation-card'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('ignores other keys', () => {
      const onClick = vi.fn();
      render(<EvaluationCard evaluation={mockEvaluation} onClick={onClick} />);
      fireEvent.keyDown(screen.getByTestId('evaluation-card'), { key: 'Tab' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('has tabIndex when onClick is provided', () => {
      const onClick = vi.fn();
      render(<EvaluationCard evaluation={mockEvaluation} onClick={onClick} />);
      expect(screen.getByTestId('evaluation-card')).toHaveAttribute('tabIndex', '0');
    });

    it('does not have button role without onClick', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-card')).not.toHaveAttribute('role');
    });
  });

  describe('styling', () => {
    it('applies hover styles', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      const card = screen.getByTestId('evaluation-card');
      expect(card).toHaveClass('hover:translate-y-[-2px]');
      expect(card).toHaveClass('hover:border-[var(--pixel-blue-sky)]');
    });

    it('applies base border color', () => {
      render(<EvaluationCard evaluation={mockEvaluation} />);
      expect(screen.getByTestId('evaluation-card')).toHaveClass('border-[var(--pixel-gray-700)]');
    });
  });
});
