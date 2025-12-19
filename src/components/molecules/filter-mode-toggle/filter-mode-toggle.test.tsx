import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterModeToggle } from './filter-mode-toggle';

describe('FilterModeToggle', () => {
  describe('basic rendering', () => {
    it('renders filter mode toggle', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByTestId('filter-mode-toggle')).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByTestId('toggle-switch')).toBeInTheDocument();
    });

    it('renders info button', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByTestId('filter-mode-info')).toBeInTheDocument();
    });

    it('renders AND label', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByText('AND')).toBeInTheDocument();
    });

    it('renders OR label', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByText('OR')).toBeInTheDocument();
    });
  });

  describe('value display', () => {
    it('shows AND as selected when value is AND', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      const toggle = screen.getByTestId('toggle-switch');
      expect(toggle).toHaveAttribute('data-value', 'left');
    });

    it('shows OR as selected when value is OR', () => {
      render(<FilterModeToggle value="OR" onChange={vi.fn()} />);
      const toggle = screen.getByTestId('toggle-switch');
      expect(toggle).toHaveAttribute('data-value', 'right');
    });
  });

  describe('interaction', () => {
    it('calls onChange with OR when switching from AND', () => {
      const onChange = vi.fn();
      render(<FilterModeToggle value="AND" onChange={onChange} />);
      fireEvent.click(screen.getByTestId('toggle-switch'));
      expect(onChange).toHaveBeenCalledWith('OR');
    });

    it('calls onChange with AND when switching from OR', () => {
      const onChange = vi.fn();
      render(<FilterModeToggle value="OR" onChange={onChange} />);
      fireEvent.click(screen.getByTestId('toggle-switch'));
      expect(onChange).toHaveBeenCalledWith('AND');
    });
  });

  describe('tooltip', () => {
    it('does not show tooltip by default', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.queryByTestId('filter-mode-tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip on info button hover', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.mouseEnter(screen.getByTestId('filter-mode-info'));
      expect(screen.getByTestId('filter-mode-tooltip')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.mouseEnter(screen.getByTestId('filter-mode-info'));
      fireEvent.mouseLeave(screen.getByTestId('filter-mode-info'));
      expect(screen.queryByTestId('filter-mode-tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip on info button focus', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.focus(screen.getByTestId('filter-mode-info'));
      expect(screen.getByTestId('filter-mode-tooltip')).toBeInTheDocument();
    });

    it('hides tooltip on blur', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.focus(screen.getByTestId('filter-mode-info'));
      fireEvent.blur(screen.getByTestId('filter-mode-info'));
      expect(screen.queryByTestId('filter-mode-tooltip')).not.toBeInTheDocument();
    });

    it('tooltip contains AND explanation', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.mouseEnter(screen.getByTestId('filter-mode-info'));
      expect(screen.getByText(/all/i)).toBeInTheDocument();
    });

    it('tooltip contains OR explanation', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.mouseEnter(screen.getByTestId('filter-mode-info'));
      expect(screen.getByText(/any/i)).toBeInTheDocument();
    });

    it('tooltip has role tooltip', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      fireEvent.mouseEnter(screen.getByTestId('filter-mode-info'));
      expect(screen.getByTestId('filter-mode-tooltip')).toHaveAttribute('role', 'tooltip');
    });
  });

  describe('disabled state', () => {
    it('disables toggle switch when disabled', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} disabled />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('data-disabled', 'true');
    });

    it('disables info button when disabled', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} disabled />);
      expect(screen.getByTestId('filter-mode-info')).toBeDisabled();
    });

    it('does not show tooltip when disabled and hovered', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} disabled />);
      fireEvent.mouseEnter(screen.getByTestId('filter-mode-info'));
      expect(screen.queryByTestId('filter-mode-tooltip')).not.toBeInTheDocument();
    });

    it('does not show tooltip when disabled and focused', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} disabled />);
      fireEvent.focus(screen.getByTestId('filter-mode-info'));
      expect(screen.queryByTestId('filter-mode-tooltip')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('info button has aria-label', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByTestId('filter-mode-info')).toHaveAttribute(
        'aria-label',
        'Filter mode information',
      );
    });

    it('toggle has descriptive aria-label', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute(
        'aria-label',
        'Filter mode: AND matches all criteria, OR matches any criteria',
      );
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<FilterModeToggle value="AND" onChange={vi.fn()} className="custom-class" />);
      expect(screen.getByTestId('filter-mode-toggle')).toHaveClass('custom-class');
    });
  });
});
