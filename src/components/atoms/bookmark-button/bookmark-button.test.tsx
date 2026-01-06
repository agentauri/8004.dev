import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BookmarkButton } from './bookmark-button';

describe('BookmarkButton', () => {
  it('renders with unbookmarked state', () => {
    render(<BookmarkButton isBookmarked={false} onToggle={() => {}} />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-bookmarked', 'false');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-label', 'Add bookmark');
  });

  it('renders with bookmarked state', () => {
    render(<BookmarkButton isBookmarked={true} onToggle={() => {}} />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toHaveAttribute('data-bookmarked', 'true');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Remove bookmark');
  });

  it('calls onToggle when clicked', () => {
    const handleToggle = vi.fn();
    render(<BookmarkButton isBookmarked={false} onToggle={handleToggle} />);

    const button = screen.getByTestId('bookmark-button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('stops event propagation when clicked', () => {
    const handleToggle = vi.fn();
    const handleParentClick = vi.fn();

    render(
      <div onClick={handleParentClick}>
        <BookmarkButton isBookmarked={false} onToggle={handleToggle} />
      </div>,
    );

    const button = screen.getByTestId('bookmark-button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('does not call onToggle when disabled', () => {
    const handleToggle = vi.fn();
    render(<BookmarkButton isBookmarked={false} onToggle={handleToggle} disabled />);

    const button = screen.getByTestId('bookmark-button');
    fireEvent.click(button);

    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('applies disabled styles when disabled', () => {
    render(<BookmarkButton isBookmarked={false} onToggle={() => {}} disabled />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('renders different sizes', () => {
    const { rerender } = render(
      <BookmarkButton isBookmarked={false} onToggle={() => {}} size="xs" />,
    );

    let button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('p-1.5');

    rerender(<BookmarkButton isBookmarked={false} onToggle={() => {}} size="sm" />);
    button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('p-2');

    rerender(<BookmarkButton isBookmarked={false} onToggle={() => {}} size="md" />);
    button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('p-2.5');

    rerender(<BookmarkButton isBookmarked={false} onToggle={() => {}} size="lg" />);
    button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('p-3');
  });

  it('uses custom label when provided', () => {
    render(<BookmarkButton isBookmarked={false} onToggle={() => {}} label="Save this agent" />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toHaveAttribute('aria-label', 'Save this agent');
  });

  it('applies custom className', () => {
    render(<BookmarkButton isBookmarked={false} onToggle={() => {}} className="custom-class" />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies bookmarked styles when bookmarked', () => {
    render(<BookmarkButton isBookmarked={true} onToggle={() => {}} />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('border-[var(--pixel-gold-coin)]');
    expect(button).toHaveClass('text-[var(--pixel-gold-coin)]');
  });

  it('applies unbookmarked styles when not bookmarked', () => {
    render(<BookmarkButton isBookmarked={false} onToggle={() => {}} />);

    const button = screen.getByTestId('bookmark-button');
    expect(button).toHaveClass('border-[var(--pixel-gray-600)]');
    expect(button).toHaveClass('text-[var(--pixel-gray-400)]');
  });
});
