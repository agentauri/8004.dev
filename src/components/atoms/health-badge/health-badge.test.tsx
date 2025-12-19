import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getHealthLevel, HealthBadge } from './health-badge';

describe('HealthBadge', () => {
  describe('basic rendering', () => {
    it('renders component', () => {
      render(<HealthBadge score={50} />);
      expect(screen.getByTestId('health-badge')).toBeInTheDocument();
    });

    it('displays score by default', () => {
      render(<HealthBadge score={75} />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('hides score when showScore is false', () => {
      render(<HealthBadge score={75} showScore={false} />);
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });
  });

  describe('health levels', () => {
    it('shows POOR for score < 50', () => {
      render(<HealthBadge score={30} />);
      expect(screen.getByText('POOR')).toBeInTheDocument();
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'poor');
    });

    it('shows FAIR for score 50-79', () => {
      render(<HealthBadge score={65} />);
      expect(screen.getByText('FAIR')).toBeInTheDocument();
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'fair');
    });

    it('shows GOOD for score >= 80', () => {
      render(<HealthBadge score={90} />);
      expect(screen.getByText('GOOD')).toBeInTheDocument();
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'good');
    });
  });

  describe('score clamping', () => {
    it('clamps score at 0 for negative values', () => {
      render(<HealthBadge score={-10} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-score', '0');
    });

    it('clamps score at 100 for values over 100', () => {
      render(<HealthBadge score={150} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-score', '100');
    });
  });

  describe('styling', () => {
    it('applies badge-pixel class', () => {
      render(<HealthBadge score={50} />);
      expect(screen.getByTestId('health-badge')).toHaveClass('badge-pixel');
    });

    it('applies red color for poor health', () => {
      render(<HealthBadge score={30} />);
      expect(screen.getByTestId('health-badge')).toHaveClass(
        'text-[var(--pixel-red-fire)]',
      );
    });

    it('applies gold color for fair health', () => {
      render(<HealthBadge score={60} />);
      expect(screen.getByTestId('health-badge')).toHaveClass(
        'text-[var(--pixel-gold-coin)]',
      );
    });

    it('applies green color for good health', () => {
      render(<HealthBadge score={90} />);
      expect(screen.getByTestId('health-badge')).toHaveClass(
        'text-[var(--pixel-green-pipe)]',
      );
    });

    it('applies additional class names', () => {
      render(<HealthBadge score={50} className="custom-class" />);
      expect(screen.getByTestId('health-badge')).toHaveClass('custom-class');
    });
  });

  describe('tooltip', () => {
    it('has title attribute with full score', () => {
      render(<HealthBadge score={75} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute(
        'title',
        'Health Score: 75/100',
      );
    });
  });

  describe('boundary values', () => {
    it('shows FAIR at exactly 50', () => {
      render(<HealthBadge score={50} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'fair');
    });

    it('shows POOR at 49', () => {
      render(<HealthBadge score={49} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'poor');
    });

    it('shows GOOD at exactly 80', () => {
      render(<HealthBadge score={80} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'good');
    });

    it('shows FAIR at 79', () => {
      render(<HealthBadge score={79} />);
      expect(screen.getByTestId('health-badge')).toHaveAttribute('data-level', 'fair');
    });
  });
});

describe('getHealthLevel', () => {
  it('returns poor for scores below 50', () => {
    expect(getHealthLevel(0)).toBe('poor');
    expect(getHealthLevel(25)).toBe('poor');
    expect(getHealthLevel(49)).toBe('poor');
  });

  it('returns fair for scores 50-79', () => {
    expect(getHealthLevel(50)).toBe('fair');
    expect(getHealthLevel(65)).toBe('fair');
    expect(getHealthLevel(79)).toBe('fair');
  });

  it('returns good for scores 80+', () => {
    expect(getHealthLevel(80)).toBe('good');
    expect(getHealthLevel(90)).toBe('good');
    expect(getHealthLevel(100)).toBe('good');
  });
});
