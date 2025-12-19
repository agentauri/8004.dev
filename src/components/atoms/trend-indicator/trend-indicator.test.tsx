import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type TrendDirection, TrendIndicator } from './trend-indicator';

describe('TrendIndicator', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<TrendIndicator direction="up" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toBeInTheDocument();
    });

    it('renders trending up icon', () => {
      const { container } = render(<TrendIndicator direction="up" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders trending down icon', () => {
      const { container } = render(<TrendIndicator direction="down" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders stable icon', () => {
      const { container } = render(<TrendIndicator direction="stable" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Direction Attributes', () => {
    it('has correct data-direction attribute for up', () => {
      render(<TrendIndicator direction="up" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveAttribute('data-direction', 'up');
    });

    it('has correct data-direction attribute for down', () => {
      render(<TrendIndicator direction="down" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveAttribute('data-direction', 'down');
    });

    it('has correct data-direction attribute for stable', () => {
      render(<TrendIndicator direction="stable" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveAttribute('data-direction', 'stable');
    });
  });

  describe('Color Classes', () => {
    it('applies green color for up trend', () => {
      const { container } = render(<TrendIndicator direction="up" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-[#00D800]');
    });

    it('applies red color for down trend', () => {
      const { container } = render(<TrendIndicator direction="down" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-[#FC5454]');
    });

    it('applies gray color for stable trend', () => {
      const { container } = render(<TrendIndicator direction="stable" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-[#888888]');
    });
  });

  describe('Change Percentage', () => {
    it('does not show change when not provided', () => {
      render(<TrendIndicator direction="up" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator.textContent).toBe('');
    });

    it('shows positive change with + sign', () => {
      render(<TrendIndicator direction="up" change={12} />);
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    it('shows negative change with - sign', () => {
      render(<TrendIndicator direction="down" change={-8} />);
      expect(screen.getByText('-8%')).toBeInTheDocument();
    });

    it('shows zero change without sign', () => {
      render(<TrendIndicator direction="stable" change={0} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('applies correct color to change text for up', () => {
      const { container } = render(<TrendIndicator direction="up" change={5} />);
      const changeText = screen.getByText('+5%');
      expect(changeText).toHaveClass('text-[#00D800]');
    });

    it('applies correct color to change text for down', () => {
      const { container } = render(<TrendIndicator direction="down" change={-5} />);
      const changeText = screen.getByText('-5%');
      expect(changeText).toHaveClass('text-[#FC5454]');
    });

    it('applies font-mono class to change text', () => {
      render(<TrendIndicator direction="up" change={5} />);
      const changeText = screen.getByText('+5%');
      expect(changeText).toHaveClass('font-mono');
    });
  });

  describe('Size Variants', () => {
    it('renders medium size by default', () => {
      const { container } = render(<TrendIndicator direction="up" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '18');
      expect(svg).toHaveAttribute('height', '18');
    });

    it('renders small size when specified', () => {
      const { container } = render(<TrendIndicator direction="up" size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '14');
      expect(svg).toHaveAttribute('height', '14');
    });

    it('renders medium size when explicitly specified', () => {
      const { container } = render(<TrendIndicator direction="up" size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '18');
      expect(svg).toHaveAttribute('height', '18');
    });
  });

  describe('Custom Classes', () => {
    it('applies custom className', () => {
      render(<TrendIndicator direction="up" className="custom-class" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveClass('custom-class');
    });

    it('preserves default classes when custom className is applied', () => {
      render(<TrendIndicator direction="up" className="custom-class" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveClass('inline-flex');
      expect(indicator).toHaveClass('items-center');
      expect(indicator).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('has aria-label for up trend', () => {
      render(<TrendIndicator direction="up" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveAttribute('aria-label', 'Trending up');
    });

    it('has aria-label for down trend', () => {
      render(<TrendIndicator direction="down" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveAttribute('aria-label', 'Trending down');
    });

    it('has aria-label for stable trend', () => {
      render(<TrendIndicator direction="stable" />);
      const indicator = screen.getByTestId('trend-indicator');
      expect(indicator).toHaveAttribute('aria-label', 'Stable');
    });

    it('has aria-hidden on icon', () => {
      const { container } = render(<TrendIndicator direction="up" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('All Direction Combinations', () => {
    const directions: TrendDirection[] = ['up', 'down', 'stable'];

    directions.forEach((direction) => {
      it(`renders ${direction} direction correctly`, () => {
        render(<TrendIndicator direction={direction} />);
        const indicator = screen.getByTestId('trend-indicator');
        expect(indicator).toHaveAttribute('data-direction', direction);
      });

      it(`renders ${direction} direction with change correctly`, () => {
        const change = direction === 'down' ? -5 : 5;
        render(<TrendIndicator direction={direction} change={change} />);
        const expectedText = direction === 'down' ? '-5%' : '+5%';
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      });
    });
  });
});
