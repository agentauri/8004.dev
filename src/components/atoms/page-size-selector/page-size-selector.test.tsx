import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  PageSizeSelector,
} from './page-size-selector';

describe('PageSizeSelector', () => {
  describe('rendering', () => {
    it('renders the selector', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} />);
      expect(screen.getByTestId('page-size-selector')).toBeInTheDocument();
    });

    it('renders Show and per page labels', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} />);
      expect(screen.getByText('Show')).toBeInTheDocument();
      expect(screen.getByText('per page')).toBeInTheDocument();
    });

    it('renders select element with current value', () => {
      render(<PageSizeSelector value={50} onChange={vi.fn()} />);
      const select = screen.getByTestId('page-size-select');
      expect(select).toHaveValue('50');
    });

    it('renders default options', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} />);
      const select = screen.getByTestId('page-size-select');
      const options = select.querySelectorAll('option');
      expect(options).toHaveLength(DEFAULT_PAGE_SIZE_OPTIONS.length);
      expect(options[0]).toHaveValue('10');
      expect(options[1]).toHaveValue('20');
      expect(options[2]).toHaveValue('50');
      expect(options[3]).toHaveValue('100');
    });

    it('renders custom options', () => {
      render(<PageSizeSelector value={25} options={[5, 10, 25]} onChange={vi.fn()} />);
      const select = screen.getByTestId('page-size-select');
      const options = select.querySelectorAll('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('5');
      expect(options[1]).toHaveValue('10');
      expect(options[2]).toHaveValue('25');
    });

    it('applies custom className', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} className="custom-class" />);
      expect(screen.getByTestId('page-size-selector')).toHaveClass('custom-class');
    });
  });

  describe('interaction', () => {
    it('calls onChange when selection changes', () => {
      const onChange = vi.fn();
      render(<PageSizeSelector value={20} onChange={onChange} />);
      const select = screen.getByTestId('page-size-select');
      fireEvent.change(select, { target: { value: '50' } });
      expect(onChange).toHaveBeenCalledWith(50);
    });

    it('calls onChange with correct numeric value', () => {
      const onChange = vi.fn();
      render(<PageSizeSelector value={20} onChange={onChange} />);
      const select = screen.getByTestId('page-size-select');
      fireEvent.change(select, { target: { value: '100' } });
      expect(onChange).toHaveBeenCalledWith(100);
    });
  });

  describe('disabled state', () => {
    it('disables the select when disabled prop is true', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} disabled />);
      const select = screen.getByTestId('page-size-select');
      expect(select).toBeDisabled();
    });

    it('does not disable the select when disabled prop is false', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} disabled={false} />);
      const select = screen.getByTestId('page-size-select');
      expect(select).not.toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('has aria-label on select', () => {
      render(<PageSizeSelector value={20} onChange={vi.fn()} />);
      const select = screen.getByTestId('page-size-select');
      expect(select).toHaveAttribute('aria-label', 'Items per page');
    });
  });

  describe('constants', () => {
    it('exports DEFAULT_PAGE_SIZE as 20', () => {
      expect(DEFAULT_PAGE_SIZE).toBe(20);
    });

    it('exports DEFAULT_PAGE_SIZE_OPTIONS', () => {
      expect(DEFAULT_PAGE_SIZE_OPTIONS).toEqual([10, 20, 50, 100]);
    });
  });
});
