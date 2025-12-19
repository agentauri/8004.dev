import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  describe('active status', () => {
    it('renders ACTIVE label', () => {
      render(<StatusBadge status="active" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('ACTIVE');
    });

    it('has correct data-status attribute', () => {
      render(<StatusBadge status="active" />);
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', 'active');
    });

    it('applies active color class', () => {
      render(<StatusBadge status="active" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--status-active)]');
    });

    it('includes status indicator dot', () => {
      render(<StatusBadge status="active" />);
      const badge = screen.getByTestId('status-badge');
      expect(badge.querySelector('.rounded-full')).toBeInTheDocument();
    });
  });

  describe('inactive status', () => {
    it('renders INACTIVE label', () => {
      render(<StatusBadge status="inactive" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('INACTIVE');
    });

    it('has correct data-status attribute', () => {
      render(<StatusBadge status="inactive" />);
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', 'inactive');
    });

    it('applies inactive color class', () => {
      render(<StatusBadge status="inactive" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--status-inactive)]');
    });

    it('does not include glow effect', () => {
      render(<StatusBadge status="inactive" />);
      expect(screen.getByTestId('status-badge')).not.toHaveClass(
        'shadow-[0_0_6px_var(--glow-green)]',
      );
    });
  });

  describe('verified status', () => {
    it('renders VERIFIED label', () => {
      render(<StatusBadge status="verified" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('VERIFIED');
    });

    it('applies verified color class', () => {
      render(<StatusBadge status="verified" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--status-verified)]');
    });
  });

  describe('mcp status', () => {
    it('renders MCP label', () => {
      render(<StatusBadge status="mcp" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('MCP');
    });

    it('has correct data-status attribute', () => {
      render(<StatusBadge status="mcp" />);
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', 'mcp');
    });

    it('applies blue color class', () => {
      render(<StatusBadge status="mcp" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--pixel-blue-sky)]');
    });
  });

  describe('a2a status', () => {
    it('renders A2A label', () => {
      render(<StatusBadge status="a2a" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('A2A');
    });

    it('has correct data-status attribute', () => {
      render(<StatusBadge status="a2a" />);
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', 'a2a');
    });

    it('applies gold color class', () => {
      render(<StatusBadge status="a2a" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--pixel-gold-coin)]');
    });
  });

  describe('x402 status', () => {
    it('renders x402 label', () => {
      render(<StatusBadge status="x402" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('x402');
    });

    it('has correct data-status attribute', () => {
      render(<StatusBadge status="x402" />);
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', 'x402');
    });

    it('applies emerald color class', () => {
      render(<StatusBadge status="x402" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--pixel-emerald)]');
    });
  });

  describe('trust status', () => {
    it('renders TRUST label', () => {
      render(<StatusBadge status="trust" />);
      expect(screen.getByTestId('status-badge')).toHaveTextContent('TRUST');
    });

    it('has correct data-status attribute', () => {
      render(<StatusBadge status="trust" />);
      expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', 'trust');
    });

    it('applies purple color class', () => {
      render(<StatusBadge status="trust" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('text-[var(--pixel-purple)]');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<StatusBadge status="active" className="custom-class" />);
      expect(screen.getByTestId('status-badge')).toHaveClass('custom-class');
    });

    it('merges with default classes', () => {
      render(<StatusBadge status="active" className="mt-4" />);
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveClass('text-[var(--status-active)]');
      expect(badge).toHaveClass('mt-4');
    });
  });
});
