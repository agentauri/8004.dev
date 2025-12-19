import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type SortField, type SortOrder, SortSelector } from './sort-selector';

describe('SortSelector', () => {
  const defaultProps = {
    sortBy: 'relevance' as SortField,
    order: 'desc' as SortOrder,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      render(<SortSelector {...defaultProps} />);

      expect(screen.getByTestId('sort-selector')).toBeInTheDocument();
      expect(screen.getByTestId('sort-selector-trigger')).toHaveTextContent('Sort: Relevance');
    });

    it('displays current sort field', () => {
      render(<SortSelector {...defaultProps} sortBy="name" />);

      expect(screen.getByTestId('sort-selector-trigger')).toHaveTextContent('Sort: Name');
    });

    it('displays reputation sort field', () => {
      render(<SortSelector {...defaultProps} sortBy="reputation" />);

      expect(screen.getByTestId('sort-selector-trigger')).toHaveTextContent('Sort: Reputation');
    });

    it('displays createdAt sort field as Date', () => {
      render(<SortSelector {...defaultProps} sortBy="createdAt" />);

      expect(screen.getByTestId('sort-selector-trigger')).toHaveTextContent('Sort: Date');
    });

    it('applies custom className', () => {
      render(<SortSelector {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('sort-selector')).toHaveClass('custom-class');
    });

    it('renders disabled state', () => {
      render(<SortSelector {...defaultProps} disabled />);

      expect(screen.getByTestId('sort-selector-trigger')).toBeDisabled();
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on click', () => {
      render(<SortSelector {...defaultProps} />);

      expect(screen.queryByTestId('sort-selector-dropdown')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.getByTestId('sort-selector-dropdown')).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <SortSelector {...defaultProps} />
          <div data-testid="outside">Outside</div>
        </div>,
      );

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));
      expect(screen.getByTestId('sort-selector-dropdown')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByTestId('sort-selector-dropdown')).not.toBeInTheDocument();
    });

    it('shows all sort options in dropdown', () => {
      render(<SortSelector {...defaultProps} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.getByTestId('sort-option-relevance')).toBeInTheDocument();
      expect(screen.getByTestId('sort-option-name')).toBeInTheDocument();
      expect(screen.getByTestId('sort-option-createdAt')).toBeInTheDocument();
      expect(screen.getByTestId('sort-option-reputation')).toBeInTheDocument();
    });

    it('marks current selection as selected', () => {
      render(<SortSelector {...defaultProps} sortBy="name" />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.getByTestId('sort-option-name')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('sort-option-relevance')).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('onChange behavior', () => {
    it('calls onChange with new field and default order when selecting different field', () => {
      const onChange = vi.fn();
      render(<SortSelector {...defaultProps} onChange={onChange} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));
      fireEvent.click(screen.getByTestId('sort-option-name'));

      expect(onChange).toHaveBeenCalledWith('name', 'asc');
    });

    it('toggles order when selecting same field', () => {
      const onChange = vi.fn();
      render(
        <SortSelector {...defaultProps} sortBy="relevance" order="desc" onChange={onChange} />,
      );

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));
      fireEvent.click(screen.getByTestId('sort-option-relevance'));

      expect(onChange).toHaveBeenCalledWith('relevance', 'asc');
    });

    it('toggles order when clicking order button', () => {
      const onChange = vi.fn();
      render(<SortSelector {...defaultProps} order="desc" onChange={onChange} />);

      fireEvent.click(screen.getByTestId('sort-order-toggle'));

      expect(onChange).toHaveBeenCalledWith('relevance', 'asc');
    });

    it('uses default desc order for reputation', () => {
      const onChange = vi.fn();
      render(<SortSelector {...defaultProps} sortBy="name" onChange={onChange} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));
      fireEvent.click(screen.getByTestId('sort-option-reputation'));

      expect(onChange).toHaveBeenCalledWith('reputation', 'desc');
    });

    it('uses default desc order for createdAt', () => {
      const onChange = vi.fn();
      render(<SortSelector {...defaultProps} sortBy="name" onChange={onChange} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));
      fireEvent.click(screen.getByTestId('sort-option-createdAt'));

      expect(onChange).toHaveBeenCalledWith('createdAt', 'desc');
    });
  });

  describe('disabled state', () => {
    it('does not open dropdown when disabled', () => {
      render(<SortSelector {...defaultProps} disabled />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.queryByTestId('sort-selector-dropdown')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper aria attributes on trigger', () => {
      render(<SortSelector {...defaultProps} />);

      const trigger = screen.getByTestId('sort-selector-trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('updates aria-expanded when open', () => {
      render(<SortSelector {...defaultProps} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.getByTestId('sort-selector-trigger')).toHaveAttribute('aria-expanded', 'true');
    });

    it('dropdown has listbox role', () => {
      render(<SortSelector {...defaultProps} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.getByTestId('sort-selector-dropdown')).toHaveAttribute('role', 'listbox');
    });

    it('options have proper role', () => {
      render(<SortSelector {...defaultProps} />);

      fireEvent.click(screen.getByTestId('sort-selector-trigger'));

      expect(screen.getByTestId('sort-option-relevance')).toHaveAttribute('role', 'option');
    });
  });
});
