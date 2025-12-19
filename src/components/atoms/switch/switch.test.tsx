import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch';

describe('Switch', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeInTheDocument();
      expect(switchEl).toHaveAttribute('data-checked', 'false');
      expect(switchEl).toHaveAttribute('data-size', 'md');
    });

    it('renders in checked state', () => {
      const onChange = vi.fn();
      render(<Switch checked={true} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
      expect(switchEl).toHaveAttribute('data-checked', 'true');
    });

    it('renders in unchecked state', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      expect(switchEl).toHaveAttribute('data-checked', 'false');
    });
  });

  describe('label and description', () => {
    it('renders with label', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} label="Test Label" />);

      expect(screen.getByTestId('switch-label')).toHaveTextContent('Test Label');
    });

    it('renders with label and description', () => {
      const onChange = vi.fn();
      render(
        <Switch
          checked={false}
          onChange={onChange}
          label="Test Label"
          description="Test description text"
        />,
      );

      expect(screen.getByTestId('switch-label')).toHaveTextContent('Test Label');
      expect(screen.getByTestId('switch-description')).toHaveTextContent('Test description text');
    });

    it('renders without label', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      expect(screen.queryByTestId('switch-label')).not.toBeInTheDocument();
      expect(screen.queryByTestId('switch-description')).not.toBeInTheDocument();
    });

    it('renders description only when label is provided', () => {
      const onChange = vi.fn();
      render(
        <Switch checked={false} onChange={onChange} label="Label" description="Description" />,
      );

      expect(screen.getByTestId('switch-description')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} size="sm" />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('data-size', 'sm');
      expect(switchEl).toHaveClass('w-8', 'h-4');
    });

    it('renders medium size (default)', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} size="md" />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('data-size', 'md');
      expect(switchEl).toHaveClass('w-10', 'h-5');
    });

    it('renders large size', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} size="lg" />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('data-size', 'lg');
      expect(switchEl).toHaveClass('w-12', 'h-6');
    });
  });

  describe('interactions', () => {
    it('calls onChange when clicked', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      fireEvent.click(switchEl);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when checked and clicked', () => {
      const onChange = vi.fn();
      render(<Switch checked={true} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      fireEvent.click(switchEl);

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('calls onChange when Enter key is pressed', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      fireEvent.keyDown(switchEl, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange when Space key is pressed', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      fireEvent.keyDown(switchEl, { key: ' ' });

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not call onChange for other keys', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      fireEvent.keyDown(switchEl, { key: 'a' });
      fireEvent.keyDown(switchEl, { key: 'Escape' });
      fireEvent.keyDown(switchEl, { key: 'Tab' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('renders in disabled state', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} disabled />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('data-disabled', 'true');
      expect(switchEl).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('does not call onChange when disabled and clicked', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} disabled />);

      const switchEl = screen.getByRole('switch');
      fireEvent.click(switchEl);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when disabled and key pressed', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} disabled />);

      const switchEl = screen.getByRole('switch');
      fireEvent.keyDown(switchEl, { key: 'Enter' });
      fireEvent.keyDown(switchEl, { key: ' ' });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('has negative tabIndex when disabled', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} disabled />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('accessibility', () => {
    it('has role="switch"', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has aria-checked attribute', () => {
      const onChange = vi.fn();
      const { rerender } = render(<Switch checked={false} onChange={onChange} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch checked={true} onChange={onChange} />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('uses label as aria-label', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} label="Test Label" />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-label', 'Test Label');
    });

    it('uses ariaLabel prop when provided', () => {
      const onChange = vi.fn();
      render(
        <Switch
          checked={false}
          onChange={onChange}
          label="Visible Label"
          ariaLabel="Custom Aria Label"
        />,
      );

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-label', 'Custom Aria Label');
    });

    it('uses default aria-label when no label provided', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-label', 'Toggle switch');
    });

    it('is focusable', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('styling', () => {
    it('applies checked styling', () => {
      const onChange = vi.fn();
      render(<Switch checked={true} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveClass('bg-[var(--pixel-blue-sky)]');
      expect(switchEl).toHaveClass('border-[var(--pixel-blue-sky)]');
    });

    it('applies unchecked styling', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveClass('bg-[var(--pixel-gray-800)]');
      expect(switchEl).toHaveClass('border-[var(--pixel-gray-600)]');
    });

    it('moves thumb when checked', () => {
      const onChange = vi.fn();
      render(<Switch checked={true} onChange={onChange} />);

      const thumb = screen.getByTestId('switch-thumb');
      expect(thumb).toHaveClass('translate-x-[20px]');
    });

    it('thumb is at start when unchecked', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      const thumb = screen.getByTestId('switch-thumb');
      expect(thumb).not.toHaveClass('translate-x-[20px]');
    });

    it('applies custom className', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} className="custom-class" />);

      const container = screen.getByRole('switch').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('testId', () => {
    it('uses default testId', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} />);

      expect(screen.getByTestId('switch')).toBeInTheDocument();
      expect(screen.getByTestId('switch-thumb')).toBeInTheDocument();
    });

    it('uses custom testId', () => {
      const onChange = vi.fn();
      render(<Switch checked={false} onChange={onChange} testId="custom-switch" />);

      expect(screen.getByTestId('custom-switch')).toBeInTheDocument();
      expect(screen.getByTestId('custom-switch-thumb')).toBeInTheDocument();
    });

    it('uses custom testId for label and description', () => {
      const onChange = vi.fn();
      render(
        <Switch
          checked={false}
          onChange={onChange}
          testId="custom-switch"
          label="Label"
          description="Description"
        />,
      );

      expect(screen.getByTestId('custom-switch-label')).toBeInTheDocument();
      expect(screen.getByTestId('custom-switch-description')).toBeInTheDocument();
    });
  });
});
