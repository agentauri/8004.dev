import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RangeSlider } from './range-slider';

const defaultProps = {
  min: 0,
  max: 100,
  minValue: 20,
  maxValue: 80,
  onChange: vi.fn(),
};

describe('RangeSlider', () => {
  describe('basic rendering', () => {
    it('renders range slider', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('range-slider')).toBeInTheDocument();
    });

    it('stores values in data attributes', () => {
      render(<RangeSlider {...defaultProps} />);
      const slider = screen.getByTestId('range-slider');
      expect(slider).toHaveAttribute('data-min', '20');
      expect(slider).toHaveAttribute('data-max', '80');
    });

    it('renders both thumbs', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toBeInTheDocument();
      expect(screen.getByTestId('max-thumb')).toBeInTheDocument();
    });

    it('renders active range', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('active-range')).toBeInTheDocument();
    });
  });

  describe('value display', () => {
    it('sets min thumb value correctly', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveValue('20');
    });

    it('sets max thumb value correctly', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('max-thumb')).toHaveValue('80');
    });

    it('calculates active range position correctly', () => {
      render(<RangeSlider {...defaultProps} />);
      const activeRange = screen.getByTestId('active-range');
      expect(activeRange).toHaveStyle({ left: '20%', width: '60%' });
    });
  });

  describe('interaction', () => {
    it('calls onChange when min thumb changes', () => {
      const onChange = vi.fn();
      render(<RangeSlider {...defaultProps} onChange={onChange} />);
      const minThumb = screen.getByTestId('min-thumb');
      fireEvent.change(minThumb, { target: { value: '30' } });
      expect(onChange).toHaveBeenCalledWith(30, 80);
    });

    it('calls onChange when max thumb changes', () => {
      const onChange = vi.fn();
      render(<RangeSlider {...defaultProps} onChange={onChange} />);
      const maxThumb = screen.getByTestId('max-thumb');
      fireEvent.change(maxThumb, { target: { value: '90' } });
      expect(onChange).toHaveBeenCalledWith(20, 90);
    });

    it('prevents min value from exceeding max value', () => {
      const onChange = vi.fn();
      render(<RangeSlider {...defaultProps} onChange={onChange} />);
      const minThumb = screen.getByTestId('min-thumb');
      fireEvent.change(minThumb, { target: { value: '85' } }); // Above max
      expect(onChange).toHaveBeenCalledWith(79, 80); // Clamped to maxValue - step
    });

    it('prevents max value from going below min value', () => {
      const onChange = vi.fn();
      render(<RangeSlider {...defaultProps} onChange={onChange} />);
      const maxThumb = screen.getByTestId('max-thumb');
      fireEvent.change(maxThumb, { target: { value: '15' } }); // Below min
      expect(onChange).toHaveBeenCalledWith(20, 21); // Clamped to minValue + step
    });
  });

  describe('step', () => {
    it('uses default step of 1', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('step', '1');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('step', '1');
    });

    it('uses custom step', () => {
      render(<RangeSlider {...defaultProps} step={5} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('step', '5');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('step', '5');
    });
  });

  describe('disabled state', () => {
    it('has disabled data attribute when disabled', () => {
      render(<RangeSlider {...defaultProps} disabled />);
      expect(screen.getByTestId('range-slider')).toHaveAttribute('data-disabled', 'true');
    });

    it('disables both thumbs when disabled', () => {
      render(<RangeSlider {...defaultProps} disabled />);
      expect(screen.getByTestId('min-thumb')).toBeDisabled();
      expect(screen.getByTestId('max-thumb')).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('has aria-label on container', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('range-slider')).toHaveAttribute(
        'aria-label',
        'Range slider from 0 to 100',
      );
    });

    it('uses custom aria-label when provided', () => {
      render(<RangeSlider {...defaultProps} ariaLabel="Reputation range" />);
      expect(screen.getByTestId('range-slider')).toHaveAttribute('aria-label', 'Reputation range');
    });

    it('has aria-valuemin on thumbs', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('aria-valuemin', '0');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('aria-valuemin', '0');
    });

    it('has aria-valuemax on thumbs', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('aria-valuemax', '100');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('aria-valuemax', '100');
    });

    it('has aria-valuenow on thumbs', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('aria-valuenow', '20');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('aria-valuenow', '80');
    });

    it('has aria-label on min thumb', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('aria-label', 'Minimum value');
    });

    it('has aria-label on max thumb', () => {
      render(<RangeSlider {...defaultProps} />);
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('aria-label', 'Maximum value');
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<RangeSlider {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('range-slider')).toHaveClass('custom-class');
    });
  });

  describe('edge cases', () => {
    it('handles full range selection', () => {
      render(<RangeSlider min={0} max={100} minValue={0} maxValue={100} onChange={vi.fn()} />);
      const activeRange = screen.getByTestId('active-range');
      expect(activeRange).toHaveStyle({ left: '0%', width: '100%' });
    });

    it('handles narrow range selection', () => {
      render(<RangeSlider min={0} max={100} minValue={49} maxValue={51} onChange={vi.fn()} />);
      const activeRange = screen.getByTestId('active-range');
      expect(activeRange).toHaveStyle({ left: '49%', width: '2%' });
    });
  });
});
