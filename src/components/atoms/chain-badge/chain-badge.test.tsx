import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChainBadge } from './chain-badge';

describe('ChainBadge', () => {
  describe('Sepolia (11155111)', () => {
    it('renders short name by default', () => {
      render(<ChainBadge chainId={11155111} />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('SEPOLIA');
    });

    it('renders full name when showFullName is true', () => {
      render(<ChainBadge chainId={11155111} showFullName />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('Ethereum Sepolia');
    });

    it('has correct data-chain attribute', () => {
      render(<ChainBadge chainId={11155111} />);
      expect(screen.getByTestId('chain-badge')).toHaveAttribute('data-chain', '11155111');
    });

    it('applies sepolia color classes', () => {
      render(<ChainBadge chainId={11155111} />);
      const badge = screen.getByTestId('chain-badge');
      expect(badge).toHaveClass('text-[var(--chain-sepolia)]');
      expect(badge).toHaveClass('border-[var(--chain-sepolia)]');
    });
  });

  describe('Base Sepolia (84532)', () => {
    it('renders short name by default', () => {
      render(<ChainBadge chainId={84532} />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('BASE');
    });

    it('renders full name when showFullName is true', () => {
      render(<ChainBadge chainId={84532} showFullName />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('Base Sepolia');
    });

    it('has correct data-chain attribute', () => {
      render(<ChainBadge chainId={84532} />);
      expect(screen.getByTestId('chain-badge')).toHaveAttribute('data-chain', '84532');
    });

    it('applies base color classes', () => {
      render(<ChainBadge chainId={84532} />);
      const badge = screen.getByTestId('chain-badge');
      expect(badge).toHaveClass('text-[var(--chain-base)]');
      expect(badge).toHaveClass('border-[var(--chain-base)]');
    });
  });

  describe('Polygon Amoy (80002)', () => {
    it('renders short name by default', () => {
      render(<ChainBadge chainId={80002} />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('POLYGON');
    });

    it('renders full name when showFullName is true', () => {
      render(<ChainBadge chainId={80002} showFullName />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('Polygon Amoy');
    });

    it('has correct data-chain attribute', () => {
      render(<ChainBadge chainId={80002} />);
      expect(screen.getByTestId('chain-badge')).toHaveAttribute('data-chain', '80002');
    });

    it('applies polygon color classes', () => {
      render(<ChainBadge chainId={80002} />);
      const badge = screen.getByTestId('chain-badge');
      expect(badge).toHaveClass('text-[var(--chain-polygon)]');
      expect(badge).toHaveClass('border-[var(--chain-polygon)]');
    });
  });

  describe('Unknown chain', () => {
    it('renders UNKNOWN for unsupported chain ID', () => {
      // @ts-expect-error - Testing invalid chain ID
      render(<ChainBadge chainId={99999} />);
      expect(screen.getByTestId('chain-badge')).toHaveTextContent('UNKNOWN');
    });

    it('has unknown data-chain attribute', () => {
      // @ts-expect-error - Testing invalid chain ID
      render(<ChainBadge chainId={99999} />);
      expect(screen.getByTestId('chain-badge')).toHaveAttribute('data-chain', 'unknown');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<ChainBadge chainId={11155111} className="custom-class" />);
      expect(screen.getByTestId('chain-badge')).toHaveClass('custom-class');
    });

    it('merges with default classes', () => {
      render(<ChainBadge chainId={11155111} className="mt-4" />);
      const badge = screen.getByTestId('chain-badge');
      expect(badge).toHaveClass('badge-pixel');
      expect(badge).toHaveClass('mt-4');
    });
  });
});
