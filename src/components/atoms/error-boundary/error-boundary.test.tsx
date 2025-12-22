import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';

// Component that throws an error
function ThrowingComponent({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="child-component">Child content</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error during tests since we expect errors
  const originalError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Hello</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders default fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom error UI</div>}>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('includes component name in error message when provided', () => {
    render(
      <ErrorBoundary componentName="TestComponent">
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error in TestComponent')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it('resets error state when Try Again is clicked', () => {
    // Use a controlled throwing component
    let shouldThrow = true;

    function ControlledThrow() {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div data-testid="child-component">Child content</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ControlledThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary-retry')).toBeInTheDocument();

    // Before clicking retry, set shouldThrow to false
    shouldThrow = false;

    // Click the Try Again button - this resets error state and re-renders
    fireEvent.click(screen.getByTestId('error-boundary-retry'));

    // Force re-render to apply the new state
    rerender(
      <ErrorBoundary>
        <ControlledThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.queryByTestId('error-boundary-fallback')).not.toBeInTheDocument();
  });

  it('logs error to console in development mode', () => {
    // In Vitest, NODE_ENV is already 'test' which is handled like development
    render(
      <ErrorBoundary componentName="TestComponent">
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    // The error should be logged (console.error is mocked)
    expect(console.error).toHaveBeenCalled();
  });

  it('displays generic message when error has no message', () => {
    function ThrowEmptyError(): never {
      throw new Error();
    }

    render(
      <ErrorBoundary>
        <ThrowEmptyError />
      </ErrorBoundary>,
    );

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });
});
