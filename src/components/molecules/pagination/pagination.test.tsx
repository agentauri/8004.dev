import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  describe('basic rendering', () => {
    it('renders pagination component', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('renders all navigation buttons', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-first')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-previous')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-last')).toBeInTheDocument();
    });

    it('renders page info', () => {
      render(<Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-info')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('has correct aria-label on nav element', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
    });
  });

  describe('single page', () => {
    it('hides pagination when totalPages is 1', () => {
      render(<Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination')).toHaveClass('hidden');
    });

    it('hides pagination when totalPages is 0', () => {
      render(<Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination')).toHaveClass('hidden');
    });
  });

  describe('first page state', () => {
    it('disables first and previous buttons on first page', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-first')).toBeDisabled();
      expect(screen.getByTestId('pagination-previous')).toBeDisabled();
    });

    it('enables next and last buttons on first page', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-next')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last')).not.toBeDisabled();
    });
  });

  describe('last page state', () => {
    it('disables next and last buttons on last page', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-last')).toBeDisabled();
    });

    it('enables first and previous buttons on last page', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-first')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-previous')).not.toBeDisabled();
    });
  });

  describe('middle page state', () => {
    it('enables all buttons on middle page', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-first')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-previous')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-next')).not.toBeDisabled();
      expect(screen.getByTestId('pagination-last')).not.toBeDisabled();
    });
  });

  describe('navigation interactions', () => {
    it('calls onPageChange with 1 when first button clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByTestId('pagination-first'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange with previous page when previous button clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByTestId('pagination-previous'));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange with next page when next button clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByTestId('pagination-next'));
      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('calls onPageChange with last page when last button clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByTestId('pagination-last'));
      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('does not call onPageChange when previous clicked on first page', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByTestId('pagination-previous'));
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('does not call onPageChange when next clicked on last page', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={10} totalPages={10} onPageChange={onPageChange} />);
      fireEvent.click(screen.getByTestId('pagination-next'));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('disables all buttons when loading', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} isLoading />);
      expect(screen.getByTestId('pagination-first')).toBeDisabled();
      expect(screen.getByTestId('pagination-previous')).toBeDisabled();
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-last')).toBeDisabled();
    });

    it('does not call onPageChange when loading', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} isLoading />);
      fireEvent.click(screen.getByTestId('pagination-next'));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('disables all buttons when disabled', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} disabled />);
      expect(screen.getByTestId('pagination-first')).toBeDisabled();
      expect(screen.getByTestId('pagination-previous')).toBeDisabled();
      expect(screen.getByTestId('pagination-next')).toBeDisabled();
      expect(screen.getByTestId('pagination-last')).toBeDisabled();
    });

    it('does not call onPageChange when disabled', () => {
      const onPageChange = vi.fn();
      render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} disabled />);
      fireEvent.click(screen.getByTestId('pagination-next'));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('first button has correct aria-label', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-first')).toHaveAttribute(
        'aria-label',
        'Go to first page',
      );
    });

    it('previous button has correct aria-label', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-previous')).toHaveAttribute(
        'aria-label',
        'Go to previous page',
      );
    });

    it('next button has correct aria-label', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-next')).toHaveAttribute(
        'aria-label',
        'Go to next page',
      );
    });

    it('last button has correct aria-label', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />);
      expect(screen.getByTestId('pagination-last')).toHaveAttribute(
        'aria-label',
        'Go to last page',
      );
    });
  });

  describe('className prop', () => {
    it('applies additional class names', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={vi.fn()}
          className="custom-class"
        />,
      );
      expect(screen.getByTestId('pagination')).toHaveClass('custom-class');
    });
  });
});
