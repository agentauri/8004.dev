import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  describe('basic rendering', () => {
    it('renders toggle switch', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toBeInTheDocument();
    });

    it('displays both labels', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('left-label')).toHaveTextContent('AND');
      expect(screen.getByTestId('right-label')).toHaveTextContent('OR');
    });

    it('has left value in data attribute when value is false', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('data-value', 'left');
    });

    it('has right value in data attribute when value is true', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={true} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('data-value', 'right');
    });
  });

  describe('interaction', () => {
    it('calls onChange with true when clicking left position', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('toggle-switch'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when clicking right position', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={true} onChange={onChange} />);
      fireEvent.click(screen.getByTestId('toggle-switch'));
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('toggles value on Enter key', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} />);
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles value on Space key', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} />);
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: ' ' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('moves left on ArrowLeft key when value is true', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={true} onChange={onChange} />);
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: 'ArrowLeft' });
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('does not move left on ArrowLeft key when already left', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} />);
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: 'ArrowLeft' });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('moves right on ArrowRight key when value is false', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} />);
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: 'ArrowRight' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not move right on ArrowRight key when already right', () => {
      const onChange = vi.fn();
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={true} onChange={onChange} />);
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: 'ArrowRight' });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('has disabled data attribute when disabled', () => {
      render(
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} disabled />,
      );
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('data-disabled', 'true');
    });

    it('does not call onChange when disabled and clicked', () => {
      const onChange = vi.fn();
      render(
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} disabled />,
      );
      fireEvent.click(screen.getByTestId('toggle-switch'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when disabled and key pressed', () => {
      const onChange = vi.fn();
      render(
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={onChange} disabled />,
      );
      fireEvent.keyDown(screen.getByTestId('toggle-switch'), { key: 'Enter' });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('has negative tabIndex when disabled', () => {
      render(
        <ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} disabled />,
      );
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('size variants', () => {
    it('applies sm size classes', () => {
      render(
        <ToggleSwitch
          leftLabel="AND"
          rightLabel="OR"
          value={false}
          onChange={() => {}}
          size="sm"
        />,
      );
      expect(screen.getByTestId('toggle-switch')).toHaveClass('h-7');
    });

    it('applies md size classes by default', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveClass('h-8');
    });

    it('applies lg size classes', () => {
      render(
        <ToggleSwitch
          leftLabel="AND"
          rightLabel="OR"
          value={false}
          onChange={() => {}}
          size="lg"
        />,
      );
      expect(screen.getByTestId('toggle-switch')).toHaveClass('h-10');
    });
  });

  describe('accessibility', () => {
    it('has role switch', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('role', 'switch');
    });

    it('has aria-checked false when value is false', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('has aria-checked true when value is true', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={true} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('has default aria-label', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute(
        'aria-label',
        'Toggle between AND and OR',
      );
    });

    it('uses custom aria-label when provided', () => {
      render(
        <ToggleSwitch
          leftLabel="AND"
          rightLabel="OR"
          value={false}
          onChange={() => {}}
          ariaLabel="Filter mode selector"
        />,
      );
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute(
        'aria-label',
        'Filter mode selector',
      );
    });

    it('is focusable', () => {
      render(<ToggleSwitch leftLabel="AND" rightLabel="OR" value={false} onChange={() => {}} />);
      expect(screen.getByTestId('toggle-switch')).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(
        <ToggleSwitch
          leftLabel="AND"
          rightLabel="OR"
          value={false}
          onChange={() => {}}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('toggle-switch')).toHaveClass('custom-class');
    });
  });
});
