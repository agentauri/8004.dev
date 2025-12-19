import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DistributionBar } from './distribution-bar';

describe('DistributionBar', () => {
  describe('basic rendering', () => {
    it('renders with distribution data', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(screen.getByTestId('distribution-bar')).toBeInTheDocument();
    });

    it('stores data attributes correctly', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      const bar = screen.getByTestId('distribution-bar');
      expect(bar).toHaveAttribute('data-total', '100');
      expect(bar).toHaveAttribute('data-low', '10');
      expect(bar).toHaveAttribute('data-medium', '20');
      expect(bar).toHaveAttribute('data-high', '70');
    });
  });

  describe('empty state', () => {
    it('shows no data message when total is zero', () => {
      render(<DistributionBar low={0} medium={0} high={0} />);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('has total of 0 in data attribute when empty', () => {
      render(<DistributionBar low={0} medium={0} high={0} />);
      expect(screen.getByTestId('distribution-bar')).toHaveAttribute('data-total', '0');
    });
  });

  describe('segment rendering', () => {
    it('renders all three segments when all have values', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="low"]')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="medium"]')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="high"]')).toBeInTheDocument();
    });

    it('does not render low segment when low is 0', () => {
      render(<DistributionBar low={0} medium={30} high={70} />);
      expect(document.querySelector('[data-segment="low"]')).not.toBeInTheDocument();
      expect(document.querySelector('[data-segment="medium"]')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="high"]')).toBeInTheDocument();
    });

    it('does not render medium segment when medium is 0', () => {
      render(<DistributionBar low={30} medium={0} high={70} />);
      expect(document.querySelector('[data-segment="low"]')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="medium"]')).not.toBeInTheDocument();
      expect(document.querySelector('[data-segment="high"]')).toBeInTheDocument();
    });

    it('does not render high segment when high is 0', () => {
      render(<DistributionBar low={40} medium={60} high={0} />);
      expect(document.querySelector('[data-segment="low"]')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="medium"]')).toBeInTheDocument();
      expect(document.querySelector('[data-segment="high"]')).not.toBeInTheDocument();
    });

    it('only renders one segment when only one has value', () => {
      render(<DistributionBar low={0} medium={0} high={100} />);
      expect(document.querySelector('[data-segment="low"]')).not.toBeInTheDocument();
      expect(document.querySelector('[data-segment="medium"]')).not.toBeInTheDocument();
      expect(document.querySelector('[data-segment="high"]')).toBeInTheDocument();
    });
  });

  describe('labels', () => {
    it('shows labels by default', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(screen.getByText('10 LOW')).toBeInTheDocument();
      expect(screen.getByText('20 MED')).toBeInTheDocument();
      expect(screen.getByText('70 HIGH')).toBeInTheDocument();
    });

    it('hides labels when showLabels is false', () => {
      render(<DistributionBar low={10} medium={20} high={70} showLabels={false} />);
      expect(document.querySelector('[data-label="low"]')).not.toBeInTheDocument();
    });

    it('applies correct color classes to labels', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(document.querySelector('[data-label="low"]')).toHaveClass('text-[var(--trust-low)]');
      expect(document.querySelector('[data-label="medium"]')).toHaveClass(
        'text-[var(--trust-med)]',
      );
      expect(document.querySelector('[data-label="high"]')).toHaveClass('text-[var(--trust-high)]');
    });

    it('applies whitespace-nowrap to prevent label wrapping', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(document.querySelector('[data-label="low"]')).toHaveClass('whitespace-nowrap');
      expect(document.querySelector('[data-label="medium"]')).toHaveClass('whitespace-nowrap');
      expect(document.querySelector('[data-label="high"]')).toHaveClass('whitespace-nowrap');
    });
  });

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(<DistributionBar low={10} medium={20} high={70} size="sm" />);
      expect(screen.getByRole('img')).toHaveClass('h-2');
    });

    it('applies md size classes by default', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(screen.getByRole('img')).toHaveClass('h-3');
    });

    it('applies lg size classes', () => {
      render(<DistributionBar low={10} medium={20} high={70} size="lg" />);
      expect(screen.getByRole('img')).toHaveClass('h-4');
    });
  });

  describe('accessibility', () => {
    it('has aria-label describing the distribution', () => {
      render(<DistributionBar low={10} medium={20} high={70} />);
      expect(screen.getByRole('img')).toHaveAttribute(
        'aria-label',
        'Distribution: 10 low, 20 medium, 70 high out of 100 total',
      );
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<DistributionBar low={10} medium={20} high={70} className="custom-class" />);
      expect(screen.getByTestId('distribution-bar')).toHaveClass('custom-class');
    });
  });

  describe('percentage calculation', () => {
    it('calculates correct widths for equal distribution', () => {
      render(<DistributionBar low={33} medium={33} high={34} />);
      const lowSegment = document.querySelector('[data-segment="low"]') as HTMLElement;
      const mediumSegment = document.querySelector('[data-segment="medium"]') as HTMLElement;
      const highSegment = document.querySelector('[data-segment="high"]') as HTMLElement;

      expect(lowSegment.style.width).toBe('33%');
      expect(mediumSegment.style.width).toBe('33%');
      expect(highSegment.style.width).toBe('34%');
    });

    it('calculates correct widths for skewed distribution', () => {
      render(<DistributionBar low={10} medium={10} high={80} />);
      const highSegment = document.querySelector('[data-segment="high"]') as HTMLElement;
      expect(highSegment.style.width).toBe('80%');
    });
  });
});
