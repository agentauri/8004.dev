import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompareCheckbox } from './compare-checkbox';

describe('CompareCheckbox', () => {
  const defaultProps = {
    checked: false,
    onChange: vi.fn(),
  };

  describe('rendering', () => {
    it('renders with unchecked state', () => {
      render(<CompareCheckbox {...defaultProps} />);

      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveAttribute('data-checked', 'false');
    });

    it('renders with checked state', () => {
      render(<CompareCheckbox {...defaultProps} checked={true} />);

      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).toHaveAttribute('data-checked', 'true');
    });

    it('renders as button with checkbox role', () => {
      render(<CompareCheckbox {...defaultProps} />);

      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox.tagName).toBe('BUTTON');
      expect(checkbox).toHaveAttribute('role', 'checkbox');
    });

    it('applies custom className', () => {
      render(<CompareCheckbox {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('compare-checkbox')).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('has default aria-label for unchecked state', () => {
      render(<CompareCheckbox {...defaultProps} />);

      expect(screen.getByTestId('compare-checkbox')).toHaveAttribute(
        'aria-label',
        'Add to comparison',
      );
    });

    it('has default aria-label for checked state', () => {
      render(<CompareCheckbox {...defaultProps} checked={true} />);

      expect(screen.getByTestId('compare-checkbox')).toHaveAttribute(
        'aria-label',
        'Remove from comparison',
      );
    });

    it('uses custom label when provided', () => {
      render(<CompareCheckbox {...defaultProps} label="Compare Trading Bot" />);

      expect(screen.getByTestId('compare-checkbox')).toHaveAttribute(
        'aria-label',
        'Compare Trading Bot',
      );
    });
  });

  describe('interactions', () => {
    it('calls onChange when clicked', () => {
      const onChange = vi.fn();
      render(<CompareCheckbox {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByTestId('compare-checkbox'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange on Enter key', () => {
      const onChange = vi.fn();
      render(<CompareCheckbox {...defaultProps} onChange={onChange} />);

      fireEvent.keyDown(screen.getByTestId('compare-checkbox'), { key: 'Enter' });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onChange on Space key', () => {
      const onChange = vi.fn();
      render(<CompareCheckbox {...defaultProps} onChange={onChange} />);

      fireEvent.keyDown(screen.getByTestId('compare-checkbox'), { key: ' ' });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('ignores other keys', () => {
      const onChange = vi.fn();
      render(<CompareCheckbox {...defaultProps} onChange={onChange} />);

      fireEvent.keyDown(screen.getByTestId('compare-checkbox'), { key: 'Tab' });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('stops propagation on click', () => {
      const onChange = vi.fn();
      const parentClick = vi.fn();

      render(
        <div onClick={parentClick}>
          <CompareCheckbox {...defaultProps} onChange={onChange} />
        </div>,
      );

      fireEvent.click(screen.getByTestId('compare-checkbox'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(parentClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('renders as disabled', () => {
      render(<CompareCheckbox {...defaultProps} disabled={true} />);

      expect(screen.getByTestId('compare-checkbox')).toBeDisabled();
    });

    it('does not call onChange when disabled', () => {
      const onChange = vi.fn();
      render(<CompareCheckbox {...defaultProps} onChange={onChange} disabled={true} />);

      fireEvent.click(screen.getByTestId('compare-checkbox'));

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange on keydown when disabled', () => {
      const onChange = vi.fn();
      render(<CompareCheckbox {...defaultProps} onChange={onChange} disabled={true} />);

      fireEvent.keyDown(screen.getByTestId('compare-checkbox'), { key: 'Enter' });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('applies reduced opacity when disabled and unchecked', () => {
      render(<CompareCheckbox {...defaultProps} disabled={true} />);

      expect(screen.getByTestId('compare-checkbox')).toHaveClass('opacity-50');
    });
  });

  describe('sizes', () => {
    it('renders medium size by default', () => {
      render(<CompareCheckbox {...defaultProps} />);

      expect(screen.getByTestId('compare-checkbox')).toHaveClass('w-8', 'h-8');
    });

    it('renders small size', () => {
      render(<CompareCheckbox {...defaultProps} size="sm" />);

      expect(screen.getByTestId('compare-checkbox')).toHaveClass('w-6', 'h-6');
    });

    it('renders medium size', () => {
      render(<CompareCheckbox {...defaultProps} size="md" />);

      expect(screen.getByTestId('compare-checkbox')).toHaveClass('w-8', 'h-8');
    });
  });

  describe('styling', () => {
    it('has unchecked styles', () => {
      render(<CompareCheckbox {...defaultProps} />);

      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveClass('border-[var(--pixel-gray-600)]');
      expect(checkbox).toHaveClass('text-[var(--pixel-gray-400)]');
    });

    it('has checked styles', () => {
      render(<CompareCheckbox {...defaultProps} checked={true} />);

      const checkbox = screen.getByTestId('compare-checkbox');
      expect(checkbox).toHaveClass('border-[var(--pixel-blue-sky)]');
      expect(checkbox).toHaveClass('text-[var(--pixel-blue-text)]');
    });
  });
});
