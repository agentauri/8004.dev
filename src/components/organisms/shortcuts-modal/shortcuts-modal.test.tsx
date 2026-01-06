import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { ShortcutsModal } from './shortcuts-modal';

describe('ShortcutsModal', () => {
  const mockOnClose = vi.fn();
  const mockShortcuts: KeyboardShortcut[] = [
    {
      id: 'search',
      description: 'Focus search',
      keys: 'Ctrl+K',
      category: 'search',
      handler: vi.fn(),
    },
    {
      id: 'home',
      description: 'Go to home',
      keys: 'G',
      category: 'navigation',
      handler: vi.fn(),
    },
    {
      id: 'filter',
      description: 'Toggle filters',
      keys: 'F',
      category: 'search',
      handler: vi.fn(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('visibility', () => {
    it('renders nothing when closed', () => {
      render(<ShortcutsModal isOpen={false} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      expect(screen.queryByTestId('shortcuts-modal')).not.toBeInTheDocument();
    });

    it('renders modal when open', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      expect(screen.getByTestId('shortcuts-modal')).toBeInTheDocument();
      expect(screen.getByText('Keyboard Shortcuts')).toBeVisible();
    });
  });

  describe('content', () => {
    it('displays shortcuts grouped by category', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      expect(screen.getByTestId('shortcut-category-search')).toBeInTheDocument();
      expect(screen.getByTestId('shortcut-category-navigation')).toBeInTheDocument();
    });

    it('displays shortcut descriptions', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      expect(screen.getByText('Focus search')).toBeVisible();
      expect(screen.getByText('Go to home')).toBeVisible();
      expect(screen.getByText('Toggle filters')).toBeVisible();
    });

    it('displays built-in shortcuts', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={[]} />);

      expect(screen.getByText('Show this help')).toBeVisible();
      expect(screen.getByText('Close modal')).toBeVisible();
    });

    it('shows empty state when no shortcuts', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={[]} />);

      // Built-in shortcuts should still be shown in the ui category
      expect(screen.getByTestId('shortcut-category-ui')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClose when close button clicked', async () => {
      const user = userEvent.setup();
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      await user.click(screen.getByTestId('shortcuts-modal-close'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop clicked', async () => {
      const user = userEvent.setup();
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      await user.click(screen.getByTestId('shortcuts-modal-backdrop'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content clicked', async () => {
      const user = userEvent.setup();
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      await user.click(screen.getByTestId('shortcuts-modal'));

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      const modal = screen.getByTestId('shortcuts-modal');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'shortcuts-modal-title');
    });

    it('close button has accessible label', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      expect(screen.getByTestId('shortcuts-modal-close')).toHaveAttribute(
        'aria-label',
        'Close modal',
      );
    });
  });

  describe('key formatting', () => {
    it('displays formatted key combinations', () => {
      render(<ShortcutsModal isOpen={true} onClose={mockOnClose} shortcuts={mockShortcuts} />);

      // Check that keys are displayed (format depends on platform)
      const searchShortcut = screen.getByTestId('shortcut-search');
      expect(searchShortcut).toBeInTheDocument();
      // Key should contain K
      expect(searchShortcut.textContent).toMatch(/K/);
    });
  });
});
