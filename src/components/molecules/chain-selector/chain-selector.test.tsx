import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChainSelector } from './chain-selector';

describe('ChainSelector', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<ChainSelector />);
      expect(screen.getByTestId('chain-selector')).toBeInTheDocument();
      expect(screen.getByTestId('chain-selector-trigger')).toBeInTheDocument();
    });

    it('shows "ALL CHAINS" when value is empty array', () => {
      render(<ChainSelector value={[]} />);
      expect(screen.getByText('ALL CHAINS')).toBeInTheDocument();
    });

    it('shows single ChainBadge when one chain selected', () => {
      render(<ChainSelector value={[11155111]} />);
      expect(screen.getByTestId('chain-badge')).toBeInTheDocument();
    });

    it('shows multiple ChainBadges when multiple chains selected', () => {
      render(<ChainSelector value={[11155111, 84532]} />);
      const badges = screen.getAllByTestId('chain-badge');
      expect(badges).toHaveLength(2);
    });

    it('applies custom className', () => {
      render(<ChainSelector className="custom-class" />);
      expect(screen.getByTestId('chain-selector')).toHaveClass('custom-class');
    });

    it('applies disabled styles', () => {
      render(<ChainSelector disabled />);
      expect(screen.getByTestId('chain-selector-trigger')).toBeDisabled();
      expect(screen.getByTestId('chain-selector-trigger')).toHaveClass('opacity-50');
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      expect(screen.queryByTestId('chain-selector-dropdown')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('chain-selector-trigger'));
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();
    });

    it('closes dropdown on second click', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();

      await user.click(screen.getByTestId('chain-selector-trigger'));
      expect(screen.queryByTestId('chain-selector-dropdown')).not.toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();

      render(<ChainSelector disabled />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      expect(screen.queryByTestId('chain-selector-dropdown')).not.toBeInTheDocument();
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('chain-selector-dropdown')).not.toBeInTheDocument();
    });

    it('opens on Enter key', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      screen.getByTestId('chain-selector-trigger').focus();
      await user.keyboard('{Enter}');
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();
    });

    it('opens on Space key', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      screen.getByTestId('chain-selector-trigger').focus();
      await user.keyboard(' ');
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();
    });

    it('closes on outside click', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <ChainSelector />
          <button type="button" data-testid="outside">
            Outside
          </button>
        </div>,
      );

      await user.click(screen.getByTestId('chain-selector-trigger'));
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();

      await user.click(screen.getByTestId('outside'));
      expect(screen.queryByTestId('chain-selector-dropdown')).not.toBeInTheDocument();
    });

    it('stays open after selecting a chain (multi-select)', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      await user.click(screen.getByTestId('chain-option-11155111'));

      // Dropdown should stay open for multi-select
      expect(screen.getByTestId('chain-selector-dropdown')).toBeInTheDocument();
    });
  });

  describe('options', () => {
    it('shows all chain options including "All Chains"', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      await user.click(screen.getByTestId('chain-selector-trigger'));

      expect(screen.getByTestId('chain-option-all')).toBeInTheDocument();
      expect(screen.getByTestId('chain-option-11155111')).toBeInTheDocument();
      expect(screen.getByTestId('chain-option-84532')).toBeInTheDocument();
      expect(screen.getByTestId('chain-option-80002')).toBeInTheDocument();
    });

    it('shows checkmark on "All Chains" when empty array', async () => {
      const user = userEvent.setup();

      render(<ChainSelector value={[]} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));

      expect(screen.getByTestId('chain-option-all')).toHaveClass('bg-[var(--pixel-gray-700)]');
      expect(screen.getByTestId('chain-option-all')).toHaveAttribute('aria-selected', 'true');
    });

    it('shows checkmark on selected chains', async () => {
      const user = userEvent.setup();

      render(<ChainSelector value={[84532]} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));

      expect(screen.getByTestId('chain-option-84532')).toHaveClass('bg-[var(--pixel-gray-700)]');
      expect(screen.getByTestId('chain-option-84532')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('chain-option-11155111')).toHaveAttribute('aria-selected', 'false');
    });

    it('shows multiple checkmarks when multiple chains selected', async () => {
      const user = userEvent.setup();

      render(<ChainSelector value={[11155111, 84532]} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));

      expect(screen.getByTestId('chain-option-11155111')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('chain-option-84532')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('chain-option-80002')).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('selection', () => {
    it('adds chain to selection when clicking unselected chain', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ChainSelector value={[]} onChange={onChange} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      await user.click(screen.getByTestId('chain-option-11155111'));

      expect(onChange).toHaveBeenCalledWith([11155111]);
    });

    it('removes chain from selection when clicking selected chain', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ChainSelector value={[11155111, 84532]} onChange={onChange} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      await user.click(screen.getByTestId('chain-option-11155111'));

      expect(onChange).toHaveBeenCalledWith([84532]);
    });

    it('selects "All Chains" (empty array) when clicking all option', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ChainSelector value={[11155111]} onChange={onChange} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      await user.click(screen.getByTestId('chain-option-all'));

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('can select multiple chains', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ChainSelector value={[11155111]} onChange={onChange} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      await user.click(screen.getByTestId('chain-option-84532'));

      expect(onChange).toHaveBeenCalledWith([11155111, 84532]);
    });

    it('removes last chain returns to empty array', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<ChainSelector value={[11155111]} onChange={onChange} />);
      await user.click(screen.getByTestId('chain-selector-trigger'));
      await user.click(screen.getByTestId('chain-option-11155111'));

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes on trigger', () => {
      render(<ChainSelector />);
      const trigger = screen.getByTestId('chain-selector-trigger');

      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when open', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      const trigger = screen.getByTestId('chain-selector-trigger');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('dropdown has listbox role with multiselectable', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      await user.click(screen.getByTestId('chain-selector-trigger'));

      const dropdown = screen.getByTestId('chain-selector-dropdown');
      expect(dropdown).toHaveAttribute('role', 'listbox');
      expect(dropdown).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('options have option role', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      await user.click(screen.getByTestId('chain-selector-trigger'));

      expect(screen.getByTestId('chain-option-all')).toHaveAttribute('role', 'option');
      expect(screen.getByTestId('chain-option-11155111')).toHaveAttribute('role', 'option');
    });
  });

  describe('chevron icon', () => {
    it('rotates chevron when open', async () => {
      const user = userEvent.setup();

      render(<ChainSelector />);
      const trigger = screen.getByTestId('chain-selector-trigger');
      const chevron = trigger.querySelector('svg.lucide-chevron-down');

      expect(chevron).not.toHaveClass('rotate-180');

      await user.click(trigger);
      expect(chevron).toHaveClass('rotate-180');
    });
  });
});
