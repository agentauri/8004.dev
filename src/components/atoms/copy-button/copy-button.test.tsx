import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CopyButton } from './copy-button';

describe('CopyButton', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    });

    it('has correct aria-label by default', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button')).toHaveAttribute('aria-label', 'Copy to clipboard');
    });

    it('uses custom label', () => {
      render(<CopyButton text="test" label="Copy address" />);
      expect(screen.getByTestId('copy-button')).toHaveAttribute('aria-label', 'Copy address');
    });

    it('has data-copied false initially', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'false');
    });

    it('is a button element', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button').tagName).toBe('BUTTON');
    });

    it('has type button to prevent form submission', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button')).toHaveAttribute('type', 'button');
    });
  });

  describe('copy functionality', () => {
    it('shows success state after clicking', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" />);
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'true');
      });
      expect(screen.getByTestId('copy-button')).toHaveAttribute('aria-label', 'Copied!');
    });

    it('resets to initial state after successDuration', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" successDuration={100} />);
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'true');
      });

      await waitFor(
        () => {
          expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'false');
        },
        { timeout: 200 },
      );
    });

    it('calls onCopy callback on success', async () => {
      const user = userEvent.setup();
      const onCopy = vi.fn();

      render(<CopyButton text="test" onCopy={onCopy} />);
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        expect(onCopy).toHaveBeenCalledTimes(1);
      });
    });

    it('applies success styling when copied', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" />);
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toHaveClass('border-[var(--pixel-green-pipe)]');
      });
    });

    it('shows check icon when copied', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" />);
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        const svg = screen.getByTestId('copy-button').querySelector('svg');
        expect(svg).toHaveClass('lucide-check');
      });
    });

    it('shows copy icon initially', () => {
      render(<CopyButton text="test" />);
      const svg = screen.getByTestId('copy-button').querySelector('svg');
      expect(svg).toHaveClass('lucide-copy');
    });
  });

  describe('size variants', () => {
    it('applies xs size classes (compact, no min dimensions)', () => {
      render(<CopyButton text="test" size="xs" />);
      const button = screen.getByTestId('copy-button');
      expect(button).toHaveClass('p-1.5');
    });

    it('applies sm size classes (compact)', () => {
      render(<CopyButton text="test" size="sm" />);
      const button = screen.getByTestId('copy-button');
      expect(button).toHaveClass('p-2');
    });

    it('applies md size classes by default with 44px touch target', () => {
      render(<CopyButton text="test" />);
      const button = screen.getByTestId('copy-button');
      expect(button).toHaveClass('p-2.5');
      expect(button).toHaveClass('min-w-[44px]');
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('applies lg size classes with 44px touch target', () => {
      render(<CopyButton text="test" size="lg" />);
      const button = screen.getByTestId('copy-button');
      expect(button).toHaveClass('p-3');
      expect(button).toHaveClass('min-w-[44px]');
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('renders icon size 14 for xs', () => {
      render(<CopyButton text="test" size="xs" />);
      const svg = screen.getByTestId('copy-button').querySelector('svg');
      expect(svg).toHaveAttribute('height', '14');
      expect(svg).toHaveAttribute('width', '14');
    });

    it('renders icon size 16 for sm', () => {
      render(<CopyButton text="test" size="sm" />);
      const svg = screen.getByTestId('copy-button').querySelector('svg');
      expect(svg).toHaveAttribute('height', '16');
      expect(svg).toHaveAttribute('width', '16');
    });

    it('renders icon size 18 for md', () => {
      render(<CopyButton text="test" size="md" />);
      const svg = screen.getByTestId('copy-button').querySelector('svg');
      expect(svg).toHaveAttribute('height', '18');
      expect(svg).toHaveAttribute('width', '18');
    });

    it('renders different icon sizes for lg', () => {
      render(<CopyButton text="test" size="lg" />);
      const svg = screen.getByTestId('copy-button').querySelector('svg');
      expect(svg).toHaveAttribute('height', '20');
      expect(svg).toHaveAttribute('width', '20');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<CopyButton text="test" className="custom-class" />);
      expect(screen.getByTestId('copy-button')).toHaveClass('custom-class');
    });

    it('merges with default classes', () => {
      render(<CopyButton text="test" className="custom-class" />);
      const button = screen.getByTestId('copy-button');
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('is focusable', () => {
      render(<CopyButton text="test" />);
      const button = screen.getByTestId('copy-button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('can be activated with keyboard', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" />);
      const button = screen.getByTestId('copy-button');
      button.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'true');
      });
    });

    it('can be activated with space key', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" />);
      const button = screen.getByTestId('copy-button');
      button.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'true');
      });
    });

    it('has aria-hidden on icon', () => {
      render(<CopyButton text="test" />);
      const svg = screen.getByTestId('copy-button').querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('default values', () => {
    it('uses default successDuration of 2000ms', async () => {
      const user = userEvent.setup();

      render(<CopyButton text="test" />);
      await user.click(screen.getByTestId('copy-button'));

      await waitFor(() => {
        expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'true');
      });

      // Should still be copied after 100ms (less than default 2000ms)
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(screen.getByTestId('copy-button')).toHaveAttribute('data-copied', 'true');
    });

    it('uses default label "Copy to clipboard"', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button')).toHaveAttribute('aria-label', 'Copy to clipboard');
    });

    it('uses default size md', () => {
      render(<CopyButton text="test" />);
      expect(screen.getByTestId('copy-button')).toHaveClass('p-2.5');
    });
  });
});
