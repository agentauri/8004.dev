import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EvaluationStatusBadge } from './evaluation-status-badge';

describe('EvaluationStatusBadge', () => {
  describe('rendering', () => {
    it('renders the badge', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EvaluationStatusBadge status="pending" className="custom-class" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('custom-class');
    });

    it('sets data-status attribute', () => {
      render(<EvaluationStatusBadge status="completed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveAttribute(
        'data-status',
        'completed',
      );
    });
  });

  describe('pending status', () => {
    it('displays PENDING label', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveTextContent('PENDING');
    });

    it('applies yellow/gold color class', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'text-[var(--pixel-gold-coin)]',
      );
    });

    it('applies gold glow class', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'shadow-[0_0_8px_var(--glow-gold)]',
      );
    });

    it('does not animate', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).not.toHaveClass('animate-pulse');
    });
  });

  describe('running status', () => {
    it('displays RUNNING label', () => {
      render(<EvaluationStatusBadge status="running" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveTextContent('RUNNING');
    });

    it('applies blue color class', () => {
      render(<EvaluationStatusBadge status="running" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'text-[var(--pixel-blue-sky)]',
      );
    });

    it('applies blue glow class', () => {
      render(<EvaluationStatusBadge status="running" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'shadow-[0_0_8px_var(--glow-blue)]',
      );
    });

    it('applies pulse animation', () => {
      render(<EvaluationStatusBadge status="running" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('animate-pulse');
    });

    it('respects prefers-reduced-motion', () => {
      render(<EvaluationStatusBadge status="running" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'motion-reduce:animate-none',
      );
    });
  });

  describe('completed status', () => {
    it('displays COMPLETED label', () => {
      render(<EvaluationStatusBadge status="completed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveTextContent('COMPLETED');
    });

    it('applies green color class', () => {
      render(<EvaluationStatusBadge status="completed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'text-[var(--pixel-green-pipe)]',
      );
    });

    it('applies green glow class', () => {
      render(<EvaluationStatusBadge status="completed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'shadow-[0_0_8px_var(--glow-green)]',
      );
    });

    it('does not animate', () => {
      render(<EvaluationStatusBadge status="completed" />);
      expect(screen.getByTestId('evaluation-status-badge')).not.toHaveClass('animate-pulse');
    });
  });

  describe('failed status', () => {
    it('displays FAILED label', () => {
      render(<EvaluationStatusBadge status="failed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveTextContent('FAILED');
    });

    it('applies red color class', () => {
      render(<EvaluationStatusBadge status="failed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'text-[var(--pixel-red-fire)]',
      );
    });

    it('applies red glow class', () => {
      render(<EvaluationStatusBadge status="failed" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass(
        'shadow-[0_0_8px_var(--glow-red)]',
      );
    });

    it('does not animate', () => {
      render(<EvaluationStatusBadge status="failed" />);
      expect(screen.getByTestId('evaluation-status-badge')).not.toHaveClass('animate-pulse');
    });
  });

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(<EvaluationStatusBadge status="pending" size="sm" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('text-[0.5rem]');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('px-1.5');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('py-0.5');
    });

    it('applies md size classes by default', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('text-[0.625rem]');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('px-2');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('py-1');
    });

    it('applies lg size classes', () => {
      render(<EvaluationStatusBadge status="pending" size="lg" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('text-[0.75rem]');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('px-3');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('py-1.5');
    });
  });

  describe('styling', () => {
    it('applies badge-pixel class', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('badge-pixel');
    });

    it('applies font-bold class', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('font-bold');
    });

    it('applies uppercase class', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('uppercase');
    });

    it('applies border classes', () => {
      render(<EvaluationStatusBadge status="pending" />);
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('border-2');
      expect(screen.getByTestId('evaluation-status-badge')).toHaveClass('border-current');
    });
  });
});
