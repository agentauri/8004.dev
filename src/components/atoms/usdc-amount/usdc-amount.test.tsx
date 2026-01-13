import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UsdcAmount } from './usdc-amount';

describe('UsdcAmount', () => {
  describe('amount formatting', () => {
    it('formats standard amounts with 2 decimals', () => {
      render(<UsdcAmount amount={0.05} />);
      expect(screen.getByText('0.05')).toBeInTheDocument();
    });

    it('formats whole numbers with trailing zeros', () => {
      render(<UsdcAmount amount={1} />);
      expect(screen.getByText('1.00')).toBeInTheDocument();
    });

    it('formats larger amounts correctly', () => {
      render(<UsdcAmount amount={100.5} />);
      expect(screen.getByText('100.50')).toBeInTheDocument();
    });

    it('formats very small amounts with more precision', () => {
      render(<UsdcAmount amount={0.001} />);
      expect(screen.getByText('0.001')).toBeInTheDocument();
    });

    it('handles zero amount', () => {
      render(<UsdcAmount amount={0} />);
      expect(screen.getByText('0.00')).toBeInTheDocument();
    });
  });

  describe('display options', () => {
    it('shows $ symbol when showSymbol is true', () => {
      render(<UsdcAmount amount={0.05} showSymbol />);
      expect(screen.getByText('$0.05')).toBeInTheDocument();
    });

    it('shows USDC token when showToken is true', () => {
      render(<UsdcAmount amount={0.05} showToken />);
      expect(screen.getByText('0.05')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('shows both symbol and token', () => {
      render(<UsdcAmount amount={0.05} showSymbol showToken />);
      expect(screen.getByText(/\$0\.05/)).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('applies small size class', () => {
      const { container } = render(<UsdcAmount amount={0.05} size="sm" />);
      expect(container.firstChild).toHaveClass('text-sm');
    });

    it('applies medium size class by default', () => {
      const { container } = render(<UsdcAmount amount={0.05} />);
      expect(container.firstChild).toHaveClass('text-base');
    });

    it('applies large size class', () => {
      const { container } = render(<UsdcAmount amount={0.05} size="lg" />);
      expect(container.firstChild).toHaveClass('text-lg');
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(<UsdcAmount amount={0.05} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has monospace font for tabular alignment', () => {
      const { container } = render(<UsdcAmount amount={0.05} />);
      expect(container.firstChild).toHaveClass('font-mono', 'tabular-nums');
    });

    it('has green color for amounts', () => {
      const { container } = render(<UsdcAmount amount={0.05} />);
      expect(container.firstChild).toHaveClass('text-pixel-green-pipe');
    });
  });
});
