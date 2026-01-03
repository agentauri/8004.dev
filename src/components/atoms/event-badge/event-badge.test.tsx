import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EventBadge } from './event-badge';

describe('EventBadge', () => {
  describe('rendering', () => {
    it('renders event badge element', () => {
      render(<EventBadge count={0} isConnected={true} />);
      expect(screen.getByTestId('event-badge')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<EventBadge count={0} isConnected={true} className="custom-class" />);
      expect(screen.getByTestId('event-badge')).toHaveClass('custom-class');
    });

    it('renders connection indicator', () => {
      render(<EventBadge count={0} isConnected={true} />);
      expect(screen.getByTestId('event-badge-indicator')).toBeInTheDocument();
    });
  });

  describe('connection status', () => {
    it('shows connected indicator when connected', () => {
      render(<EventBadge count={0} isConnected={true} />);
      const indicator = screen.getByTestId('event-badge-indicator');
      expect(indicator).toHaveClass('bg-[var(--pixel-green-pipe)]');
      expect(indicator).toHaveClass('animate-pulse');
    });

    it('shows disconnected indicator when not connected', () => {
      render(<EventBadge count={0} isConnected={false} />);
      const indicator = screen.getByTestId('event-badge-indicator');
      expect(indicator).toHaveClass('bg-[var(--pixel-gray-500)]');
      expect(indicator).not.toHaveClass('animate-pulse');
    });

    it('disables button when disconnected', () => {
      render(<EventBadge count={5} isConnected={false} />);
      expect(screen.getByTestId('event-badge')).toBeDisabled();
    });

    it('enables button when connected', () => {
      render(<EventBadge count={5} isConnected={true} />);
      expect(screen.getByTestId('event-badge')).not.toBeDisabled();
    });

    it('applies connected styling', () => {
      render(<EventBadge count={0} isConnected={true} />);
      expect(screen.getByTestId('event-badge')).toHaveClass('border-[var(--pixel-green-pipe)]');
    });

    it('applies disconnected styling', () => {
      render(<EventBadge count={0} isConnected={false} />);
      expect(screen.getByTestId('event-badge')).toHaveClass('border-[var(--pixel-gray-500)]');
    });
  });

  describe('event count', () => {
    it('does not show count badge when count is 0', () => {
      render(<EventBadge count={0} isConnected={true} />);
      expect(screen.queryByTestId('event-badge-count')).not.toBeInTheDocument();
    });

    it('shows count badge when count is greater than 0', () => {
      render(<EventBadge count={5} isConnected={true} />);
      expect(screen.getByTestId('event-badge-count')).toBeInTheDocument();
      expect(screen.getByTestId('event-badge-count')).toHaveTextContent('5');
    });

    it('displays exact count for values up to 99', () => {
      render(<EventBadge count={99} isConnected={true} />);
      expect(screen.getByTestId('event-badge-count')).toHaveTextContent('99');
    });

    it('displays 99+ for counts over 99', () => {
      render(<EventBadge count={100} isConnected={true} />);
      expect(screen.getByTestId('event-badge-count')).toHaveTextContent('99+');
    });

    it('displays 99+ for very large counts', () => {
      render(<EventBadge count={999} isConnected={true} />);
      expect(screen.getByTestId('event-badge-count')).toHaveTextContent('99+');
    });
  });

  describe('click interaction', () => {
    it('calls onClick when clicked and connected', () => {
      const handleClick = vi.fn();
      render(<EventBadge count={5} isConnected={true} onClick={handleClick} />);

      fireEvent.click(screen.getByTestId('event-badge'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when clicked and disconnected', () => {
      const handleClick = vi.fn();
      render(<EventBadge count={5} isConnected={false} onClick={handleClick} />);

      fireEvent.click(screen.getByTestId('event-badge'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onClick with no count when connected', () => {
      const handleClick = vi.fn();
      render(<EventBadge count={0} isConnected={true} onClick={handleClick} />);

      fireEvent.click(screen.getByTestId('event-badge'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('has correct aria-label when connected with events', () => {
      render(<EventBadge count={5} isConnected={true} />);
      expect(screen.getByTestId('event-badge')).toHaveAttribute('aria-label', '5 events');
    });

    it('has correct aria-label when connected without events', () => {
      render(<EventBadge count={0} isConnected={true} />);
      expect(screen.getByTestId('event-badge')).toHaveAttribute('aria-label', '0 events');
    });

    it('has correct aria-label when disconnected', () => {
      render(<EventBadge count={5} isConnected={false} />);
      expect(screen.getByTestId('event-badge')).toHaveAttribute(
        'aria-label',
        '5 events (disconnected)',
      );
    });

    it('indicator has aria-hidden', () => {
      render(<EventBadge count={0} isConnected={true} />);
      expect(screen.getByTestId('event-badge-indicator')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
