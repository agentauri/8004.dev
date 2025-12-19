import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getTrustLevel, TrustScore } from './trust-score';

describe('getTrustLevel', () => {
  it('returns high for score >= 70', () => {
    expect(getTrustLevel(70)).toBe('high');
    expect(getTrustLevel(85)).toBe('high');
    expect(getTrustLevel(100)).toBe('high');
  });

  it('returns medium for score >= 40 and < 70', () => {
    expect(getTrustLevel(40)).toBe('medium');
    expect(getTrustLevel(55)).toBe('medium');
    expect(getTrustLevel(69)).toBe('medium');
  });

  it('returns low for score < 40', () => {
    expect(getTrustLevel(0)).toBe('low');
    expect(getTrustLevel(20)).toBe('low');
    expect(getTrustLevel(39)).toBe('low');
  });
});

describe('TrustScore', () => {
  describe('score display', () => {
    it('shows score by default', () => {
      render(<TrustScore score={75} />);
      expect(screen.getByTestId('trust-score')).toHaveTextContent('75');
    });

    it('hides score when showScore is false', () => {
      render(<TrustScore score={75} showScore={false} />);
      expect(screen.getByTestId('trust-score')).not.toHaveTextContent('75');
      expect(screen.getByTestId('trust-score')).toHaveTextContent('HIGH');
    });
  });

  describe('high trust level (>= 70)', () => {
    it('displays HIGH label', () => {
      render(<TrustScore score={80} />);
      expect(screen.getByTestId('trust-score')).toHaveTextContent('HIGH');
    });

    it('has correct data attributes', () => {
      render(<TrustScore score={80} />);
      const element = screen.getByTestId('trust-score');
      expect(element).toHaveAttribute('data-level', 'high');
      expect(element).toHaveAttribute('data-score', '80');
    });

    it('applies high trust color class', () => {
      render(<TrustScore score={80} />);
      expect(screen.getByTestId('trust-score')).toHaveClass('text-[var(--trust-high)]');
    });
  });

  describe('medium trust level (40-69)', () => {
    it('displays MED label', () => {
      render(<TrustScore score={50} />);
      expect(screen.getByTestId('trust-score')).toHaveTextContent('MED');
    });

    it('has correct data attributes', () => {
      render(<TrustScore score={50} />);
      const element = screen.getByTestId('trust-score');
      expect(element).toHaveAttribute('data-level', 'medium');
      expect(element).toHaveAttribute('data-score', '50');
    });

    it('applies medium trust color class', () => {
      render(<TrustScore score={50} />);
      expect(screen.getByTestId('trust-score')).toHaveClass('text-[var(--trust-med)]');
    });
  });

  describe('low trust level (< 40)', () => {
    it('displays LOW label', () => {
      render(<TrustScore score={20} />);
      expect(screen.getByTestId('trust-score')).toHaveTextContent('LOW');
    });

    it('has correct data attributes', () => {
      render(<TrustScore score={20} />);
      const element = screen.getByTestId('trust-score');
      expect(element).toHaveAttribute('data-level', 'low');
      expect(element).toHaveAttribute('data-score', '20');
    });

    it('applies low trust color class', () => {
      render(<TrustScore score={20} />);
      expect(screen.getByTestId('trust-score')).toHaveClass('text-[var(--trust-low)]');
    });
  });

  describe('score clamping', () => {
    it('clamps negative scores to 0', () => {
      render(<TrustScore score={-10} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '0');
    });

    it('clamps scores above 100 to 100', () => {
      render(<TrustScore score={150} />);
      expect(screen.getByTestId('trust-score')).toHaveAttribute('data-score', '100');
    });
  });

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(<TrustScore score={50} size="sm" />);
      expect(screen.getByTestId('trust-score')).toHaveClass('text-[0.5rem]');
    });

    it('applies badge-pixel class for md size by default', () => {
      render(<TrustScore score={50} />);
      expect(screen.getByTestId('trust-score')).toHaveClass('badge-pixel');
    });

    it('applies lg size classes', () => {
      render(<TrustScore score={50} size="lg" />);
      expect(screen.getByTestId('trust-score')).toHaveClass('text-[0.75rem]');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<TrustScore score={50} className="custom-class" />);
      expect(screen.getByTestId('trust-score')).toHaveClass('custom-class');
    });
  });

  describe('count prop', () => {
    it('shows count when provided and greater than 0', () => {
      render(<TrustScore score={85} count={23} />);
      expect(screen.getByTestId('trust-score')).toHaveTextContent('(23)');
    });

    it('does not show count when count is 0', () => {
      render(<TrustScore score={85} count={0} />);
      expect(screen.getByTestId('trust-score')).not.toHaveTextContent('(0)');
    });

    it('does not show count when count is undefined', () => {
      render(<TrustScore score={85} />);
      expect(screen.getByTestId('trust-score').textContent).not.toMatch(/\(\d+\)/);
    });

    it('displays full format with score, level, and count', () => {
      render(<TrustScore score={85} count={42} />);
      const element = screen.getByTestId('trust-score');
      expect(element).toHaveTextContent('85');
      expect(element).toHaveTextContent('HIGH');
      expect(element).toHaveTextContent('(42)');
    });
  });
});
