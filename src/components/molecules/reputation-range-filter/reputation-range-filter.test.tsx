import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReputationRangeFilter } from './reputation-range-filter';

const defaultProps = {
  minValue: 20,
  maxValue: 80,
  onChange: vi.fn(),
};

describe('ReputationRangeFilter', () => {
  describe('basic rendering', () => {
    it('renders reputation range filter', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('reputation-range-filter')).toBeInTheDocument();
    });

    it('renders reputation label', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('reputation-range-label')).toHaveTextContent('Reputation');
    });

    it('renders range slider', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('range-slider')).toBeInTheDocument();
    });

    it('renders scale markers', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('scale-min')).toHaveTextContent('0');
      expect(screen.getByTestId('scale-mid')).toHaveTextContent('50');
      expect(screen.getByTestId('scale-max')).toHaveTextContent('100');
    });
  });

  describe('value display', () => {
    it('displays current range values', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('20 - 80');
    });

    it('updates display when values change', () => {
      const { rerender } = render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('20 - 80');

      rerender(<ReputationRangeFilter {...defaultProps} minValue={40} maxValue={100} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('40 - 100');
    });

    it('displays full range values', () => {
      render(<ReputationRangeFilter {...defaultProps} minValue={0} maxValue={100} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('0 - 100');
    });
  });

  describe('interaction', () => {
    it('calls onChange when min value changes', () => {
      const onChange = vi.fn();
      render(<ReputationRangeFilter {...defaultProps} onChange={onChange} />);
      const minThumb = screen.getByTestId('min-thumb');
      fireEvent.change(minThumb, { target: { value: '30' } });
      expect(onChange).toHaveBeenCalledWith(30, 80);
    });

    it('calls onChange when max value changes', () => {
      const onChange = vi.fn();
      render(<ReputationRangeFilter {...defaultProps} onChange={onChange} />);
      const maxThumb = screen.getByTestId('max-thumb');
      fireEvent.change(maxThumb, { target: { value: '90' } });
      expect(onChange).toHaveBeenCalledWith(20, 90);
    });
  });

  describe('step prop', () => {
    it('uses default step of 5', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('step', '5');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('step', '5');
    });

    it('uses custom step value', () => {
      render(<ReputationRangeFilter {...defaultProps} step={10} />);
      expect(screen.getByTestId('min-thumb')).toHaveAttribute('step', '10');
      expect(screen.getByTestId('max-thumb')).toHaveAttribute('step', '10');
    });
  });

  describe('disabled state', () => {
    it('has disabled data attribute when disabled', () => {
      render(<ReputationRangeFilter {...defaultProps} disabled />);
      expect(screen.getByTestId('reputation-range-filter')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('disables range slider when disabled', () => {
      render(<ReputationRangeFilter {...defaultProps} disabled />);
      expect(screen.getByTestId('min-thumb')).toBeDisabled();
      expect(screen.getByTestId('max-thumb')).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('range slider has aria-label for reputation', () => {
      render(<ReputationRangeFilter {...defaultProps} />);
      expect(screen.getByTestId('range-slider')).toHaveAttribute(
        'aria-label',
        'Filter by reputation score',
      );
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(<ReputationRangeFilter {...defaultProps} className="custom-class" />);
      expect(screen.getByTestId('reputation-range-filter')).toHaveClass('custom-class');
    });
  });

  describe('edge cases', () => {
    it('handles zero min value', () => {
      render(<ReputationRangeFilter {...defaultProps} minValue={0} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('0 - 80');
    });

    it('handles max value of 100', () => {
      render(<ReputationRangeFilter {...defaultProps} maxValue={100} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('20 - 100');
    });

    it('handles narrow range', () => {
      render(<ReputationRangeFilter {...defaultProps} minValue={45} maxValue={55} />);
      expect(screen.getByTestId('reputation-range-value')).toHaveTextContent('45 - 55');
    });
  });
});
