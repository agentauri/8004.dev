import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getScoreLevel, ScoreGauge } from './score-gauge';

describe('getScoreLevel', () => {
  it('returns high for score >= 80', () => {
    expect(getScoreLevel(80)).toBe('high');
    expect(getScoreLevel(90)).toBe('high');
    expect(getScoreLevel(100)).toBe('high');
  });

  it('returns medium for score >= 50 and < 80', () => {
    expect(getScoreLevel(50)).toBe('medium');
    expect(getScoreLevel(65)).toBe('medium');
    expect(getScoreLevel(79)).toBe('medium');
  });

  it('returns low for score < 50', () => {
    expect(getScoreLevel(0)).toBe('low');
    expect(getScoreLevel(25)).toBe('low');
    expect(getScoreLevel(49)).toBe('low');
  });
});

describe('ScoreGauge', () => {
  describe('rendering', () => {
    it('renders the gauge', () => {
      render(<ScoreGauge score={75} label="Safety" />);
      expect(screen.getByTestId('score-gauge')).toBeInTheDocument();
    });

    it('renders the label', () => {
      render(<ScoreGauge score={75} label="Safety" />);
      expect(screen.getByText('Safety')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ScoreGauge score={75} label="Safety" className="custom-class" />);
      expect(screen.getByTestId('score-gauge')).toHaveClass('custom-class');
    });

    it('sets data attributes correctly', () => {
      render(<ScoreGauge score={85} label="Test" />);
      const gauge = screen.getByTestId('score-gauge');
      expect(gauge).toHaveAttribute('data-level', 'high');
      expect(gauge).toHaveAttribute('data-score', '85');
    });
  });

  describe('score display', () => {
    it('shows score value by default', () => {
      render(<ScoreGauge score={75} label="Safety" />);
      expect(screen.getByTestId('score-value')).toHaveTextContent('75');
    });

    it('hides score value when showValue is false', () => {
      render(<ScoreGauge score={75} label="Safety" showValue={false} />);
      expect(screen.queryByTestId('score-value')).not.toBeInTheDocument();
    });
  });

  describe('score clamping', () => {
    it('clamps negative scores to 0', () => {
      render(<ScoreGauge score={-10} label="Test" />);
      expect(screen.getByTestId('score-gauge')).toHaveAttribute('data-score', '0');
      expect(screen.getByTestId('score-value')).toHaveTextContent('0');
    });

    it('clamps scores above 100 to 100', () => {
      render(<ScoreGauge score={150} label="Test" />);
      expect(screen.getByTestId('score-gauge')).toHaveAttribute('data-score', '100');
      expect(screen.getByTestId('score-value')).toHaveTextContent('100');
    });
  });

  describe('high score level (>= 80)', () => {
    it('sets high level in data attribute', () => {
      render(<ScoreGauge score={85} label="Test" />);
      expect(screen.getByTestId('score-gauge')).toHaveAttribute('data-level', 'high');
    });

    it('applies green color class to value', () => {
      render(<ScoreGauge score={85} label="Test" />);
      expect(screen.getByTestId('score-value')).toHaveClass('text-[var(--pixel-green-pipe)]');
    });

    it('applies green fill class to bar', () => {
      render(<ScoreGauge score={85} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('bg-[var(--pixel-green-pipe)]');
    });

    it('applies green glow class to bar', () => {
      render(<ScoreGauge score={85} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('shadow-[0_0_6px_var(--glow-green)]');
    });
  });

  describe('medium score level (50-79)', () => {
    it('sets medium level in data attribute', () => {
      render(<ScoreGauge score={65} label="Test" />);
      expect(screen.getByTestId('score-gauge')).toHaveAttribute('data-level', 'medium');
    });

    it('applies yellow/gold color class to value', () => {
      render(<ScoreGauge score={65} label="Test" />);
      expect(screen.getByTestId('score-value')).toHaveClass('text-[var(--pixel-gold-coin)]');
    });

    it('applies yellow/gold fill class to bar', () => {
      render(<ScoreGauge score={65} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('bg-[var(--pixel-gold-coin)]');
    });

    it('applies gold glow class to bar', () => {
      render(<ScoreGauge score={65} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('shadow-[0_0_6px_var(--glow-gold)]');
    });
  });

  describe('low score level (< 50)', () => {
    it('sets low level in data attribute', () => {
      render(<ScoreGauge score={25} label="Test" />);
      expect(screen.getByTestId('score-gauge')).toHaveAttribute('data-level', 'low');
    });

    it('applies red color class to value', () => {
      render(<ScoreGauge score={25} label="Test" />);
      expect(screen.getByTestId('score-value')).toHaveClass('text-[var(--pixel-red-fire)]');
    });

    it('applies red fill class to bar', () => {
      render(<ScoreGauge score={25} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('bg-[var(--pixel-red-fire)]');
    });

    it('applies red glow class to bar', () => {
      render(<ScoreGauge score={25} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('shadow-[0_0_6px_var(--glow-red)]');
    });
  });

  describe('fill width', () => {
    it('sets correct width for score', () => {
      render(<ScoreGauge score={75} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveStyle({ width: '75%' });
    });

    it('sets 0% width for score 0', () => {
      render(<ScoreGauge score={0} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveStyle({ width: '0%' });
    });

    it('sets 100% width for score 100', () => {
      render(<ScoreGauge score={100} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveStyle({ width: '100%' });
    });
  });

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(<ScoreGauge score={75} label="Test" size="sm" />);
      const gauge = screen.getByTestId('score-gauge');
      expect(gauge).toHaveClass('gap-1');
      expect(screen.getByText('Test')).toHaveClass('text-[0.5rem]');
    });

    it('applies md size classes by default', () => {
      render(<ScoreGauge score={75} label="Test" />);
      const gauge = screen.getByTestId('score-gauge');
      expect(gauge).toHaveClass('gap-1.5');
      expect(screen.getByText('Test')).toHaveClass('text-[0.625rem]');
    });

    it('applies lg size classes', () => {
      render(<ScoreGauge score={75} label="Test" size="lg" />);
      const gauge = screen.getByTestId('score-gauge');
      expect(gauge).toHaveClass('gap-2');
      expect(screen.getByText('Test')).toHaveClass('text-[0.75rem]');
    });
  });

  describe('accessibility', () => {
    it('respects prefers-reduced-motion', () => {
      render(<ScoreGauge score={75} label="Test" />);
      expect(screen.getByTestId('score-fill')).toHaveClass('motion-reduce:transition-none');
    });

    it('uses tabular-nums for score display', () => {
      render(<ScoreGauge score={75} label="Test" />);
      expect(screen.getByTestId('score-value')).toHaveClass('tabular-nums');
    });
  });

  describe('label styling', () => {
    it('applies pixel font family', () => {
      render(<ScoreGauge score={75} label="Test" />);
      expect(screen.getByText('Test')).toHaveClass('font-[family-name:var(--font-pixel-body)]');
    });

    it('applies uppercase text transform', () => {
      render(<ScoreGauge score={75} label="Test" />);
      expect(screen.getByText('Test')).toHaveClass('uppercase');
    });
  });
});
