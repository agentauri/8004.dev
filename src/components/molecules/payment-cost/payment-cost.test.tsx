import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PaymentCost } from './payment-cost';

describe('PaymentCost', () => {
  describe('basic rendering', () => {
    it('renders cost amount', () => {
      render(<PaymentCost cost={0.05} />);
      expect(screen.getByText('$0.05')).toBeInTheDocument();
      expect(screen.getByText('USDC')).toBeInTheDocument();
    });

    it('renders icon by default', () => {
      const { container } = render(<PaymentCost cost={0.05} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('hides icon when showIcon is false', () => {
      const { container } = render(<PaymentCost cost={0.05} showIcon={false} />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('renders label when provided', () => {
      render(<PaymentCost cost={0.05} label="Compose Team" />);
      expect(screen.getByText('Compose Team:')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<PaymentCost cost={0.05} />);
      expect(screen.queryByText(':')).not.toBeInTheDocument();
    });
  });

  describe('inline variant (default)', () => {
    it('renders with flex row layout', () => {
      const { container } = render(<PaymentCost cost={0.05} />);
      expect(container.firstChild).toHaveClass('flex', 'items-center');
    });

    it('renders label with colon', () => {
      render(<PaymentCost cost={0.05} label="Cost" />);
      expect(screen.getByText('Cost:')).toBeInTheDocument();
    });
  });

  describe('stacked variant', () => {
    it('renders with flex column layout', () => {
      const { container } = render(<PaymentCost cost={0.05} variant="stacked" />);
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });

    it('renders label without colon', () => {
      render(<PaymentCost cost={0.05} label="Compose Team" variant="stacked" />);
      expect(screen.getByText('Compose Team')).toBeInTheDocument();
      expect(screen.queryByText('Compose Team:')).not.toBeInTheDocument();
    });

    it('uses larger size for amount', () => {
      const { container } = render(<PaymentCost cost={0.05} variant="stacked" />);
      const amountElement = container.querySelector('.text-lg');
      expect(amountElement).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(<PaymentCost cost={0.05} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has gold icon color', () => {
      const { container } = render(<PaymentCost cost={0.05} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-pixel-gold-coin');
    });
  });

  describe('different amounts', () => {
    it('renders zero cost', () => {
      render(<PaymentCost cost={0} />);
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('renders larger amounts', () => {
      render(<PaymentCost cost={10.5} />);
      expect(screen.getByText('$10.50')).toBeInTheDocument();
    });
  });
});
