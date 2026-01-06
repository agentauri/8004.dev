import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WatchButton } from './watch-button';

describe('WatchButton', () => {
  it('renders with unwatched state', () => {
    render(<WatchButton isWatched={false} onToggle={() => {}} />);

    const button = screen.getByTestId('watch-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-watched', 'false');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-label', 'Start watching');
  });

  it('renders with watched state', () => {
    render(<WatchButton isWatched={true} onToggle={() => {}} />);

    const button = screen.getByTestId('watch-button');
    expect(button).toHaveAttribute('data-watched', 'true');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Stop watching');
  });

  it('calls onToggle when clicked', () => {
    const handleToggle = vi.fn();
    render(<WatchButton isWatched={false} onToggle={handleToggle} />);

    const button = screen.getByTestId('watch-button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('stops event propagation when clicked', () => {
    const handleToggle = vi.fn();
    const handleParentClick = vi.fn();

    render(
      <div onClick={handleParentClick}>
        <WatchButton isWatched={false} onToggle={handleToggle} />
      </div>,
    );

    const button = screen.getByTestId('watch-button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('does not call onToggle when disabled', () => {
    const handleToggle = vi.fn();
    render(<WatchButton isWatched={false} onToggle={handleToggle} disabled />);

    const button = screen.getByTestId('watch-button');
    fireEvent.click(button);

    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('applies disabled styles when disabled', () => {
    render(<WatchButton isWatched={false} onToggle={() => {}} disabled />);

    const button = screen.getByTestId('watch-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<WatchButton isWatched={false} onToggle={() => {}} size="xs" />);

    let button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('p-1.5');

    rerender(<WatchButton isWatched={false} onToggle={() => {}} size="sm" />);
    button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('p-2');

    rerender(<WatchButton isWatched={false} onToggle={() => {}} size="md" />);
    button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('p-2.5');

    rerender(<WatchButton isWatched={false} onToggle={() => {}} size="lg" />);
    button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('p-3');
  });

  it('uses custom label when provided', () => {
    render(<WatchButton isWatched={false} onToggle={() => {}} label="Monitor this agent" />);

    const button = screen.getByTestId('watch-button');
    expect(button).toHaveAttribute('aria-label', 'Monitor this agent');
  });

  it('applies custom className', () => {
    render(<WatchButton isWatched={false} onToggle={() => {}} className="custom-class" />);

    const button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies watched styles when watched', () => {
    render(<WatchButton isWatched={true} onToggle={() => {}} />);

    const button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('border-[var(--pixel-blue-sky)]');
    expect(button).toHaveClass('text-[var(--pixel-blue-sky)]');
  });

  it('applies unwatched styles when not watched', () => {
    render(<WatchButton isWatched={false} onToggle={() => {}} />);

    const button = screen.getByTestId('watch-button');
    expect(button).toHaveClass('border-[var(--pixel-gray-600)]');
    expect(button).toHaveClass('text-[var(--pixel-gray-400)]');
  });
});
