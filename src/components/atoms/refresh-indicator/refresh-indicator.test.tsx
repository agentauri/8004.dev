import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RefreshIndicator } from './refresh-indicator';

describe('RefreshIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders last updated time', () => {
    const lastUpdated = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(new Date('2024-01-01T12:01:00Z')); // 1 minute later

    render(<RefreshIndicator isRefreshing={false} lastUpdated={lastUpdated} />);

    expect(screen.getByTestId('refresh-indicator')).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it('shows spinning icon when refreshing', () => {
    render(<RefreshIndicator isRefreshing={true} lastUpdated={new Date()} />);

    const button = screen.getByTestId('refresh-indicator');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Refreshing...')).toBeInTheDocument();

    // Check for spinning icon class
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('calls onManualRefresh when clicked', () => {
    const onManualRefresh = vi.fn();

    render(
      <RefreshIndicator
        isRefreshing={false}
        lastUpdated={new Date()}
        onManualRefresh={onManualRefresh}
      />,
    );

    const button = screen.getByTestId('refresh-indicator');
    fireEvent.click(button);

    expect(onManualRefresh).toHaveBeenCalledTimes(1);
  });

  it('does not call onManualRefresh when refreshing', () => {
    const onManualRefresh = vi.fn();

    render(
      <RefreshIndicator
        isRefreshing={true}
        lastUpdated={new Date()}
        onManualRefresh={onManualRefresh}
      />,
    );

    const button = screen.getByTestId('refresh-indicator');
    fireEvent.click(button);

    expect(onManualRefresh).not.toHaveBeenCalled();
  });

  it('formats time correctly for recent updates', () => {
    const lastUpdated = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(new Date('2024-01-01T12:00:30Z')); // 30 seconds later

    render(<RefreshIndicator isRefreshing={false} lastUpdated={lastUpdated} />);

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    // date-fns may use "less than a minute ago" or "30 seconds ago"
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it('formats time correctly for longer durations', () => {
    const lastUpdated = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(new Date('2024-01-01T13:30:00Z')); // 1.5 hours later

    render(<RefreshIndicator isRefreshing={false} lastUpdated={lastUpdated} />);

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    // date-fns may use "about 2 hours ago" or similar formats
    expect(screen.getByText(/hour|hours/)).toBeInTheDocument();
  });

  it('handles undefined lastUpdated', () => {
    render(<RefreshIndicator isRefreshing={false} lastUpdated={undefined} />);

    expect(screen.getByText(/Never updated/)).toBeInTheDocument();
  });

  it('does not throw when clicked without callback', () => {
    render(<RefreshIndicator isRefreshing={false} lastUpdated={new Date()} />);

    const button = screen.getByTestId('refresh-indicator');
    expect(() => fireEvent.click(button)).not.toThrow();
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <RefreshIndicator isRefreshing={false} lastUpdated={new Date()} className="custom-class" />,
    );

    const button = screen.getByTestId('refresh-indicator');
    expect(button).toHaveClass('custom-class');
  });

  it('has correct accessibility attributes when refreshing', () => {
    render(<RefreshIndicator isRefreshing={true} lastUpdated={new Date()} />);

    const button = screen.getByTestId('refresh-indicator');
    expect(button).toHaveAttribute('aria-label', 'Refreshing...');
    expect(button).toBeDisabled();
  });

  it('has correct accessibility attributes when not refreshing', () => {
    render(<RefreshIndicator isRefreshing={false} lastUpdated={new Date()} />);

    const button = screen.getByTestId('refresh-indicator');
    expect(button).toHaveAttribute('aria-label', 'Refresh');
    expect(button).not.toBeDisabled();
  });

  it('applies hover styles', () => {
    render(<RefreshIndicator isRefreshing={false} lastUpdated={new Date()} />);

    const button = screen.getByTestId('refresh-indicator');
    expect(button).toHaveClass('hover:opacity-70');
  });

  it('shows blue text color when refreshing', () => {
    render(<RefreshIndicator isRefreshing={true} lastUpdated={new Date()} />);

    const text = screen.getByText('Refreshing...');
    expect(text).toHaveClass('text-[#5C94FC]');
  });

  it('shows gray text color when not refreshing', () => {
    const lastUpdated = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(new Date('2024-01-01T12:01:00Z'));

    render(<RefreshIndicator isRefreshing={false} lastUpdated={lastUpdated} />);

    const text = screen.getByText(/Last updated:/);
    expect(text).toHaveClass('text-gray-400');
  });
});
